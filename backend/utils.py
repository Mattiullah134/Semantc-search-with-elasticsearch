from elasticsearch import Elasticsearch
import time

def create_es_cient(max_retries: int = 5 , max_sleep: int =5) -> Elasticsearch:
    i = 0
    while i < max_retries:
        try:
            es = Elasticsearch('http://localhost:9200')
            print(es.info())
            print('connect to the elasticsearch successfully')
            return es
        except Exception as e:
            print('error while connecting to the elasticsearch' ,e)
            time.sleep(max_sleep)
            i = i + 1
    raise ConnectionError(f"Failed to connect to the elastic search after so many retries ")