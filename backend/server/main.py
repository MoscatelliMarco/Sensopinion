from database import fetch_news
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from analyze_article import *

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows access from your SvelteKit's localhost port
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/api/news")
async def return_news(param: str = None, value: str = None):
    try:
        news_list = fetch_news(param, value)
        # Convert each news item to a dictionary and convert ObjectId to string
        for news in news_list:
            news["_id"] = str(news["_id"])  # Convert ObjectId to string
        return news_list
    except Exception as e:
        return []

# BODY FOR ANALYZE_TEXT
from pydantic import BaseModel, Field
from typing import Optional

class AnalyzeTextRequest(BaseModel):
    text: Optional[str] = Field(None, description="Text to analyze")
    url: Optional[str] = Field(None, description="URL to analyze")

@app.post("/api/analyze_text")
async def analyze_text(body: AnalyzeTextRequest):
    # You can now access the data with request_body.text and request_body.url
    if body.text:
        if len(body.text) > 2500:
            return {'error': "The text is over the 1500 charachters limit"}
        return analyze_text_article(body.text)
    elif body.url:
        return analyze_url_article(body.url)
    else:
        return {'error': "invalid text or url"}

    return {"message": "message"}