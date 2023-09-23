from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
from typing import List

app = FastAPI()


# app.add_middleware is used to add middleware to the application, idk why we need it but it doesnt work unless i have it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# this is from pydantic and is used to define the structure of the data that is being sent to the api
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
        "results": [
            {
                "result": "Sample Result 1. Hello, this is a sample sentence. I like turtles.",
                "chunk_id": 23213,
                "location": 12039,
                "score": "92.1%"
            },
            {
                "result": "Sample Result 2. this one is short",
                "chunk_id": 23214,
                "location": 12040,
                "score": "89.1%"
            },
            {
                "result": "Sample Result 3. this one is really long, this one is really long this one is really long this one is really long this one is really long this one is really long this one is really long this one is really long this one is really long this one is really long",
                "chunk_id": 23215,
                "location": 12041,
                "score": "90.1%"
            },
            {
                "result": "Sample Result 4",
                "chunk_id": 23216,
                "location": 12042,
                "score": "91.1%"
            },
            {
                "result": "Sample Result 5. I like turtles.",
                "chunk_id": 23217,
                "location": 12043,
                "score": "93.1%"
            }
        ]
    }