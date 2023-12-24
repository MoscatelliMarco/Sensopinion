from pymongo import MongoClient

class DBClient():
    def __init__(self, mongo_connection_string: str):
        # Initiate MongoDB client
        client = MongoClient(mongo_connection_string)
        db = client['news_database']
        collection = db['news_collection']
        collection.create_index([("time_analyze", 1)], expireAfterSeconds=604800)  # 7 days in seconds

    def fetch_news():
        # Fetch recent news entries
        return list(collection.find({}))

    def insert_article(url, emotions, category, time_of_the_article):
        doc = {
            "url": url,
            "emotions": emotions,
            "category": category,
            "subcategories": subcategories,
            "time_analyze": datetime.datetime.utcnow(),
            "time_of_the_article": time_of_the_article
        }
        collection.insert_one(doc)