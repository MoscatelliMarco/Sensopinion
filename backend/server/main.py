from database import fetch_news, collection_requests
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from functions.analyze_article import *
import functions.check_vpns as check_vpns
import hashlib
from datetime import datetime, timedelta

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
async def analyze_text(body: AnalyzeTextRequest, request: Request):
    request_ip = request.client.host
    hashed_ip = hashlib.sha256(request_ip.encode()).hexdigest()  # Hash IP for privacy

    # Rate limit check
    start_of_day = datetime.utcnow() - timedelta(days=1)
    request_count = collection_requests.count_documents({"ip": hashed_ip, "timestamp": {"$gte": start_of_day}})

    if request_count >= 10:
        return {'error': "You can only send ten requests per day"}

    # Log the request
    collection_requests.insert_one({"ip": hashed_ip, "timestamp": datetime.utcnow()})

    try:
        # You can now access the data with request_body.text and request_body.url
        if not check_vpns.is_vpn(request_ip):
            if body.text:
                if len(body.text) > 2500:
                    return {'error': "The text is over the 2500 characters limit"}
                return analyze_text_article(body.text)
            elif body.url:
                return analyze_url_article(body.url)
            else:
                return {'error': "Invalid text or url"}
        else:
            return {'error': "You need to deactivate your vpns or proxies to use our services"}
    except Exception as e:
        return {'error': f"Invalid request {e}"}