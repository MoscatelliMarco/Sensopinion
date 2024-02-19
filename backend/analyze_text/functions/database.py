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
        try:
            self.collection.create_index([("date_published", 1)], expireAfterSeconds=60 * 60 * 24 * accepted_days_news)  # 7 days in seconds
        except Exception as e:
            logger.error("Error creating index for date_published")
        logger.info("Connected to the database")

    def fetch_news(self):
        # Fetch recent news entries
        return list(self.collection.find({}))

    def insert_article(self, url, google_news_url, image_url, article_description, article_title, emotions, sentiment, category, subcategories, date_published):
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
            "date_published": date_published
        }
        self.collection.insert_one(doc)

    def delete_duplicates(self):
        # Define the aggregation pipeline
        pipeline = [
            {
                "$group": {
                    "_id": {
                        "google_news_url": "$google_news_url",
                        "url": "$url",
                        "title": "$title",
                        "description": "$description"
                    },
                    "count": {"$sum": 1},
                    "ids": {"$push": "$_id"}
                }
            },
            {
                "$match": {
                    "count": {"$gt": 1}
                }
            },
            {
                "$project": {
                    "idsToKeep": {"$slice": ["$ids", 1]},
                    "idsToDelete": {"$slice": ["$ids", 1, {"$size": "$ids"}]}
                }
            },
            {
                "$unwind": "$idsToDelete"
            }
        ]

        # Execute the aggregation pipeline
        duplicate_documents = list(self.collection.aggregate(pipeline))

        # Delete duplicate documents, keeping one from each group
        for doc in duplicate_documents:
            self.collection.delete_one({"_id": doc['idsToDelete']})
            logger.debug(f"Deleted duplicate document with ID: {doc['idsToDelete']}")