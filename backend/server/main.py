# main.py
from fastapi import FastAPI
from database import fetch_news

app = FastAPI()

@app.get("/api/news")
async def read_root():
    news_list = fetch_news()
    # Convert each news item to a dictionary and convert ObjectId to string
    for news in news_list:
        news["_id"] = str(news["_id"])  # Convert ObjectId to string
    return news_list