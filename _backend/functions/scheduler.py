import logging
date_format = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
                    datefmt=date_format)
logger = logging.getLogger(__name__)

from functions.scrape_news import scrape_news
from functions.process_article import process_article
from functions.database import DBClient

import os
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

client = DBClient(os.environ.get("MONGODB_CLIENT_URL"))

def scheduler_function():
    # try:
    # Step 1: Fetch recent news entries (assuming this function is defined)
    logger.info("Fetching news")
    news_entries = client.fetch_news()
    logger.info("Scraping news")
    new_articles = scrape_news()

    # Step 2 & 3: Iterate through the news entries and process new URLs
    for article_url in new_articles:
        
        logger.info(f"Doing {article_url}")

        # Check if the URL is already in the database
        is_already_inside = False
        for entry in news_entries:
            if entry['url'] == article_url:
                is_already_inside = True
                logger.info(f"URL already processed: {url}")
                break
        if is_already_inside:
            continue

        # Scrape the news article (assuming this function is defined)
        article_text = scrape_news()

        try:
            emotions_percentage, sentiment, valid_categories, valid_subcategories, article_date_publish = process_article(article_url)
        except:
            return

        if not len(valid_categories):
            logger.info(f"The article analyze is not recognized in any category: {article_url}")
            continue
        client.insert_article(article_url, emotions_percentage, valid_categories, valid_subcategories, article_date_publish)

    # except Exception as e:
    #     print(f"Error in main workflow: {e}")

