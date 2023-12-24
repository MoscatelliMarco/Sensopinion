from fastapi import FastAPI
import uvicorn

# Define your FastAPI app
app = FastAPI()

# Define a simple route
@app.get("/")
async def read_root():
    return {"Hello": "World"}