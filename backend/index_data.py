from utils import create_es_cient
from typing import List
from config import INDEX_NAME_WITH_NGRAM
from elasticsearch import Elasticsearch
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
    # es.indices.delete(index=INDEX_NAME_WITH_NGRAM)
    return es.indices.create(index= INDEX_NAME_WITH_NGRAM , settings={
        "analysis":{
            "analyzer":{
                "default":{
                    "type":"custom",
                    "tokenizer":"n_gram_tokenizer"
                }
            },"tokenizer":{
                "n_gram_tokenizer":{
                    "type":"edge_ngram",
                    "min_gram":1,
                    "max_gram":30,
                    "token_chars":["letter" , "digit"]
                }
            }
        }
    })

def fetch_docs ():
    data = json.load(open('./data/apod.json'))

    operations = []
    for res in data:
        operations.append({'index':{'_index' : INDEX_NAME_WITH_NGRAM}})
        operations.append(res)
        

    index_document(docs=operations)


fetch_docs()