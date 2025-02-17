from fastapi import FastAPI,Request
from utils import create_es_cient
from fastapi.middleware.cors import CORSMiddleware
from config import INDEX_NAME,INDEX_NAME_WITH_RAW_DATA , INDEX_NAME_WITH_EMBEDDINGS
from sentence_transformers import SentenceTransformer
# Create a FastAPI application
app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)  
# Define a route at the root web address ("/")
@app.get("/")
def read_root(request: Request):
    search = request.query_params['search']
    page = int(request.query_params['page'])
    itemperpage = int(request.query_params['itemperpage'])
    year = request.query_params['year']
    es = create_es_cient(max_retries=5 , max_sleep=5)
    from_page = (page - 1) * 10
    try:
        query = {"bool": {"must": [], "filter": []}}  # Use lists for conditions
        if search and len(search) > 3:
            query["bool"]['must']=[
                        {
                            "multi_match":{
                                "query":search,
                                "fields":["title" , "explanation"]
                            },
                        }
                ]
        if year:
            query['bool']['filter']=[
                {
                    'range':{
                        'date':{
                            'gte':f"{year}-01-01",
                            'lte':f"{year}-12-31",
                            "format":"yyyy-mm-dd"
                        }
                    }
                }
            ]
        if not query["bool"]["must"]:
            query["bool"]["must"].append({"match_all": {}})
        count = es.count(index=INDEX_NAME_WITH_RAW_DATA,body={"query":query} )

        data = es.search(
            index=INDEX_NAME_WITH_RAW_DATA , 
            body={
                "query": query,
                "from":from_page,
                "size":itemperpage
            }
        )
        return {"message":"Fetched data" , "data":data['hits']['hits'],'count':count['count']}
        
    except Exception as e:
        print('error while handling the / route' , e)


@app.get("/embedding")
def embedding(request: Request):
    search = request.query_params['search']
    page = int(request.query_params['page'])
    itemperpage = int(request.query_params['itemperpage'])
    year = request.query_params['year']
    es = create_es_cient(max_retries=5 , max_sleep=5)
    from_page = (page - 1) * 10
    try:
        query = {"bool": {"must": [], "filter": []}}  # Use lists for conditions
        if search and len(search) > 3:
            query["bool"]['must']=[
                        {
                            "knn":{
                                "field":"embedding",
                                "query_vector":model.encode(search),
                                "k":1e4
                            },
                        }
                ]
        if year:
            query['bool']['filter']=[
                {
                    'range':{
                        'date':{
                            'gte':f"{year}-01-01",
                            'lte':f"{year}-12-31",
                            "format":"yyyy-mm-dd"
                        }
                    }
                }
            ]
        if not query["bool"]["must"]:
            query["bool"]["must"].append({"match_all": {}})
        count = es.count(index=INDEX_NAME_WITH_EMBEDDINGS,body={"query":query} )

        data = es.search(
            index=INDEX_NAME_WITH_EMBEDDINGS , 
            body={
                "query": query,
                "from":from_page,
                "size":itemperpage
            }
        )
        return {"message":"Fetched data" , "data":data['hits']['hits'],'count':count['count']}
        
    except Exception as e:
        print('error while handling the / route' , e)
@app.get("/api/v1/get_year_count")
def get_year_count(request: Request):
    try:
        search = request.query_params['search']
        es = create_es_cient(max_retries=5 , max_sleep=5)
        if search and len(search) > 3:
            
            data = es.search(
                index=INDEX_NAME , 
                body={
                    "query":{
                        "bool":{
                            "must":[
                                {
                                    "multi_match":{
                                        "query":search,
                                        "fields":["title" , "explanation"]
                                    },
                                }
                            ]
                        }
                    },
                    "aggs":{
                        "docs_per_year":{
                            "date_histogram":{
                                "field":"date",
                                "calendar_interval":"year",
                                "format":"yyyy"
                            }
                        }
                    }
                },
                filter_path=[
                    "aggregations.docs_per_year"
                ]
            )
            return {"message":"Fetched data" , "data":data['aggregations']['docs_per_year']['buckets']}
        else:
            print('main else main hoon')
            data = es.search(
                index=INDEX_NAME , 
                body={
                    
                    "aggs":{
                        "docs_per_year":{
                            "date_histogram":{
                                "field":"date",
                                "calendar_interval":"year",
                                "format":"yyyy"
                            }
                        }
                    }
                },
                filter_path=[
                    "aggregations.docs_per_year"
                ]
            )
            print('year------------------>>>>>>>>.',data)

            return {"message":"Fetched data" , "data":data['aggregations']['docs_per_year']['buckets']}
    except Exception as e:
        print('error while handling the /get_year_count route' , e)
