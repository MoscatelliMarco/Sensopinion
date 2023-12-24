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
        logger.info(f"Initializing MongoClient")
        client = MongoClient(mongo_connection_string)
        db = client['news_database']
        self.collection = db['news_collection']
        self.collection.create_index([("time_analyze", 1)], expireAfterSeconds=604800)  # 7 days in seconds

    def fetch_news(self):
        # Fetch recent news entries
        return list(self.collection.find({}))

    def insert_article(self, url, emotions, category, subcategories, time_of_the_article):
        doc = {
            "url": url,
            "emotions": emotions,
            "category": category,
            "subcategories": subcategories,
            "time_analyze": datetime.datetime.utcnow(),
            "time_of_the_article": time_of_the_article
        }
        self.collection.insert_one(doc)