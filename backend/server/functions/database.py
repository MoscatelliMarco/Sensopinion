import logging
date_format = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
                    datefmt=date_format)
logger = logging.getLogger(__name__)

from pymongo import MongoClient
import datetime

class DBClient():
    def __init__(self, mongo_connection_string: str, accepted_days_news: int):
        # Initiate MongoDB client
        client = MongoClient(mongo_connection_string)
        db = client['news_database']
        self.collection = db['news_collection']
        self.collection.create_index([("time_of_the_article", 1)], expireAfterSeconds=60 * 60 * 24 * accepted_days_news)  # 7 days in seconds
        logger.info("Connected to the database")

    def fetch_news(self):
        # Fetch recent news entries
        return list(self.collection.find({}))

    def insert_article(self, url, google_news_url, image_url, article_description, article_title, emotions, sentiment, category, subcategories, time_of_the_article):
        doc = {
            "url": url,
            "google_news_url": google_news_url,
            "image": image_url,
            "title": article_title,
            "description": article_description,
            "emotions": emotions,
            "sentiment": sentiment,
            "categories": dict(zip(category, subcategories)),
            "time_analyze": datetime.datetime.utcnow(),
            "time_of_the_article": time_of_the_article
        }
        self.collection.insert_one(doc)