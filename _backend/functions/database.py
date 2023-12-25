import logging
date_format = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
                    datefmt=date_format)
logger = logging.getLogger(__name__)

from pymongo import MongoClient
import datetime

class DBClient():
    def __init__(self, mongo_connection_string: str):
        # Initiate MongoDB client
        client = MongoClient(mongo_connection_string)
        db = client['news_database']
        self.collection = db['news_collection']
        self.collection.create_index([("time_analyze", 1)], expireAfterSeconds=604800)  # 7 days in seconds
        logger.info("Connected to the database")

    def fetch_news(self):
        # Fetch recent news entries
        return list(self.collection.find({}))

    def insert_article(self, url, google_news_url, emotions, category, subcategories, time_of_the_article):
        # TODO save also description, top_image
        doc = {
            "url": url,
            "google_news_url": google_news_url,
            "emotions": emotions,
            "category": category,
            "subcategories": subcategories,
            "time_analyze": datetime.datetime.utcnow(),
            "time_of_the_article": time_of_the_article if time_of_the_article else None
        }
        self.collection.insert_one(doc)