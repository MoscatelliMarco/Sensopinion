import logging
date_format = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
                    datefmt=date_format)
logger = logging.getLogger(__name__)

from functions.scrape_process_news import scrape_process_news
from functions.database import DBClient

import os
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

client = DBClient(os.environ.get("MONGODB_CLIENT_URL"), int(os.environ.get("ACCEPTED_DAYS_NEWS")))

def scheduler_function():
    try:
        scrape_process_news(client)
        logger.info("FINISHED ANALYZING")
    except Exception as e:
        logger.error(f"Could not scrape and process the news: {e}")