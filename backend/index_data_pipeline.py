from utils import create_es_cient
from typing import List
from os import path
from config import INDEX_NAME_WITH_RAW_DATA
from elasticsearch import Elasticsearch
import json
def index_document(docs: List[dict]):
    try:
        pipeline_id = 'my_personal_pipeline'
        es = create_es_cient(max_retries=5, max_sleep=5)
        create_pipeline(id=pipeline_id, es=es)
        create_index(es)
        es.bulk(operations=docs , pipeline=pipeline_id)
        print('upload all the data')
        return True
    except Exception as e:
        raise Exception('unable to send the docs to elasticsearch' , e)
    
def create_index(es: Elasticsearch):
    # es.indices.delete(index=INDEX_NAME_WITH_RAW_DATA)
    return es.indices.create(index= INDEX_NAME_WITH_RAW_DATA )

def fetch_docs ():
    data = json.load(open('./data/apod.json'))

    operations = []
    for res in data:
        operations.append({'index':{'_index' : INDEX_NAME_WITH_RAW_DATA}})
        operations.append(res)
        

    index_document(docs=operations)

def create_pipeline(id , es):
    resp = es.ingest.put_pipeline(
        id=id,
        description="My optional pipeline description",
        processors=[
            {
                "html_strip":{
                    "field":"title"
                }
            },
            {
                "html_strip":{
                    "field":"explanation"
                }
            }
        ],
    )
    print(resp)

fetch_docs()