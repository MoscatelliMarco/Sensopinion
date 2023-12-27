from database import fetch_news
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
async def read_root():
    news_list = fetch_news()
    # Convert each news item to a dictionary and convert ObjectId to string
    for news in news_list:
        news["_id"] = str(news["_id"])  # Convert ObjectId to string
    return news_list