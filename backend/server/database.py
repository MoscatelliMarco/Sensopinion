import logging
date_format = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
                    datefmt=date_format)
logger = logging.getLogger(__name__)

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
import datetime

load_dotenv()

client = MongoClient(os.environ.get("MONGODB_CLIENT_URL"))
db = client['news_database']

collection_news = db['news_collection']
collection_news.create_index([("time_analyze", 1)], expireAfterSeconds=604800)  # 7 days in seconds

collection_requests = db["requests"]

logger.info("Connected to the database")

def sanitize_string_for_mongodb(input_string):
    # Replace or escape special MongoDB characters
    sanitized_string = input_string.replace('$', '\$').replace('.', '\.')
    return sanitized_string

def fetch_news(param, value):
    if param and value:
        # Sanitize the string for mongodb
        param = sanitize_string_for_mongodb(param)
        value = sanitize_string_for_mongodb(value)
        if param == '_id':
            return list(collection_news.find({param: ObjectId(value)}))
        return list(collection_news.find({param: value}))
    return list(collection_news.find({}))