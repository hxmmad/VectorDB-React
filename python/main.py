from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    query: str

class Result(BaseModel):
    query: str
    id: int

status = "processing"

@app.get("/search")
async def read_root():
    return {"Hello": "World"}

@app.post("/search")
async def create_item(query: Query):
    global status
    time.sleep(5)  # wait for 5 seconds
    status = "processing"
    return Result(query=query.query, id=1002432)

@app.get("/status")
async def get_status():
    global status
    if status == "processing":
        time.sleep(4)  # wait for 4 seconds
        status = "completed"
    return {
        "id": 1002432, 
        "status": status, 
        "results": {
            "result": "Hello, this is a sample sentence. I like turtles.",
            "chunk_id": 23213,
            "location": 12039,
            "score": "92.1%"
        }
    }