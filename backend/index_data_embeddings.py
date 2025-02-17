from utils import create_es_cient
from typing import List
from config import INDEX_NAME_WITH_EMBEDDINGS
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer

import json
def index_document(docs: List[dict]):
    try:
        es = create_es_cient(max_retries=5, max_sleep=5)
        create_index(es)
        es.bulk(operations=docs)
        print('upload all the data')
        return True
    except Exception as e:
        raise Exception('unable to send the docs to elasticsearch' , e)
    
def create_index(es: Elasticsearch):
    # es.indices.delete(index=INDEX_NAME_WITH_EMBEDDINGS)
    return es.indices.create(index=INDEX_NAME_WITH_EMBEDDINGS , mappings={
        "properties":{
            "embedding":{
                "type":"dense_vector"
            }
        }
    })

def fetch_docs ():
    data = json.load(open('./data/apod.json'))
    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    operations = []
    for res in data:
        operations.append({'index':{'_index' : INDEX_NAME_WITH_EMBEDDINGS}})
        operations.append({
            **res,
            'embedding':model.encode(res['explanation'])
        })
        

    index_document(docs=operations)


fetch_docs()