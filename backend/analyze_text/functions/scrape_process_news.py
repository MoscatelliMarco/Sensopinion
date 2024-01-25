import logging
import requests
from bs4 import BeautifulSoup
import random
import time
import os
import threading
from dotenv import load_dotenv
from variables import urls_to_scrape
from functions.process_article import process_article

# Set up logging
date_format = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', datefmt=date_format)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def analyze_and_post_with_timeout(news_entries, google_news_url, mongo_client, timeout=60):
    # Define a function to run `analyze_and_post` in a separate thread
    def target(result_holder):
        try:
            result_holder.append(analyze_and_post(news_entries, google_news_url, mongo_client))
        except Exception as e:
            logger.error(f"Error in thread when analyzing {google_news_url}: {e}")

    result_holder = []
    thread = threading.Thread(target=target, args=(result_holder,))
    thread.start()
    thread.join(timeout)
    if thread.is_alive():
        logger.warning(f"Function timed out for news URL: {google_news_url}")
        return False
    return True

def scrape_process_news(mongo_client):
    # headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    news_entries = mongo_client.fetch_news()
    google_news_urls = []
    for url_to_scrape in urls_to_scrape:
        response = requests.get(url_to_scrape)
        soup = BeautifulSoup(response.text, 'html.parser')
        for link in soup.find_all('article'):
            a_tag = link.find('a', href=True)
            if a_tag and 'href' in a_tag.attrs:
                partial_url = a_tag.attrs['href']
                google_news_url = f'https://news.google.com{partial_url}'
                google_news_urls.append(google_news_url)
    random.shuffle(google_news_urls)
    for news_index, google_news_url in enumerate(google_news_urls):
        logger.info(f"Analyzing news number {news_index + 1} out of {len(google_news_urls)}")
        if not analyze_and_post_with_timeout(news_entries, google_news_url, mongo_client):
            continue

def analyze_and_post(news_entries, google_news_url, mongo_client):
    is_already_inside = False
    for entry in news_entries:
        if entry['google_news_url'] == google_news_url:
            is_already_inside = True
            logger.info(f"URL already processed (news.google): {google_news_url}")
            break
    if is_already_inside:
        return
    response = requests.get(google_news_url, allow_redirects=True, timeout=25)
    final_url = response.url
    for entry in news_entries:
        if entry['url'] == final_url:
            is_already_inside = True
            logger.info(f"URL already processed (destination url): {google_news_url}")
            break
    if is_already_inside:
        return

    if final_url:
        try:
            emotions, sentiment, valid_categories, valid_subcategories, article_date_publish, image_url, article_description, article_title = process_article(final_url, news_entries)
            if emotions and sentiment and valid_categories and valid_subcategories and article_date_publish:
                logger.info(f"Added article: {final_url}")
                mongo_client.insert_article(final_url, google_news_url, image_url, article_description, article_title, emotions, sentiment, valid_categories, valid_subcategories, article_date_publish)
                news_entries.append({
                    "url": url,
                    "google_news_url": google_news_url,
                    "image": image_url,
                    "title": article_title,
                    "description": article_description,
                    "emotions": emotions,
                    "sentiment": sentiment,
                    "categories": dict(zip(valid_categories, valid_subcategories)),
                    "time_analyze": datetime.datetime.utcnow(),
                    "time_of_the_article": article_date_publish
                })
            else:
                logger.info(f"Not added article: {final_url}")
            time.sleep(int(os.environ.get("SECOND_WAIT_REDUCE_USAGE")))
        except Exception as e:
            logger.error(f"Couldn't go through fetch and/or analyze {google_news_url}, error: {e}")
        final_url = None