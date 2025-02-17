# Project Title

Semantic search

## Tech Stack

This project is built using the following technologies:
- **FastAPI** - For backend API development
- **Elasticsearch** - For search and indexing
- **React.js** - For frontend development
- **Python** - As the core programming language
- **Huging face SentenceTransformer** - As the model for transform the string into dense vector

## Description

This project implements a hybrid search engine that combines traditional n-gram tokenization and semantic search powered by embeddings from the Hugging Face model all-MiniLM-L6-v2. It uses K-Nearest Neighbors (KNN) for efficient search and ranking of results, alongside n-grams for token-based search.

## Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (Latest LTS version recommended)
- **Python** (Version 3.x)
- **Docker Desktop**
- **npm** (Comes with Node.js)

### Installing

#### Frontend Setup

```sh
cd frontend
npm i
npm run dev
open http://localhost:5173/
```

#### Backend Setup

```sh
cd backend
py -m venv .  # For Windows or
python -m venv . 

# Activate Virtual Environment
# Windows (Command Prompt)
Scripts\activate
pip install -r requirements.txt
```

### Docker Setup

1. Ensure **Docker Desktop** is running.
2. Navigate to the project root directory and start the containers:
   ```sh
   docker compose up -d
   py index_data.py
   ```

Your project should now be up and running! 🚀


## Authors

Contributors' names and contact info

Matti Ullah 
https://www.linkedin.com/in/matti-ullah-3417a4240/


## Acknowledgments

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [dbader](https://github.com/dbader/readme-template)
* [zenorocha](https://gist.github.com/zenorocha/4526327)
* [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)

