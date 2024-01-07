import logging
date_format = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
                    datefmt=date_format)
logger = logging.getLogger(__name__)

import os
from dotenv import load_dotenv
from pymongo import MongoClient
import datetime

load_dotenv()

client = MongoClient(os.environ.get("MONGODB_CLIENT_URL"))
db = client['news_database']
collection = db['news_collection']
collection.create_index([("time_analyze", 1)], expireAfterSeconds=604800)  # 7 days in seconds
logger.info("Connected to the database")

def fetch_news(category):
    return list(collection.find({}))