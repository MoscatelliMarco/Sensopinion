import logging
date_format = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
                    datefmt=date_format)
logger = logging.getLogger(__name__)

import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs
from variables import urls_to_scrape
from functions.process_article import process_article
import random

def scrape_process_news(mongo_client):
    # Headers to simulate a real user visit
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

    news_entries = mongo_client.fetch_news()

    google_news_urls = []
    for url_to_scrape in urls_to_scrape:
        response = requests.get(url_to_scrape, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')

        for link in soup.find_all('article'):
            a_tag = link.find('a', href=True)
            if a_tag and 'href' in a_tag.attrs:
                # Get the partial URL
                partial_url = a_tag.attrs['href']
                # Construct the full Google News URL
                google_news_url = f'https://news.google.com{partial_url}'
                google_news_urls.append(google_news_url)
    
    # Shuffle all the google news urls
    random.shuffle(google_news_urls)
    for google_news_url in google_news_urls:
        is_already_inside = False
        for entry in news_entries:
            if entry['google_news_url'] == google_news_url:
                is_already_inside = True
                logger.info(f"URL already processed: {google_news_url}")
                break
        if is_already_inside:
            continue

        try:
            response = requests.get(google_news_url, allow_redirects=True, timeout=15)
            final_url = response.url
            factors, valid_categories, valid_subcategories, article_date_publish = process_article(final_url)
            if factors and valid_categories and valid_subcategories and article_date_publish:
                logger.info(f"Added article: {final_url}")
                mongo_client.insert_article(final_url, google_news_url, factors, valid_categories, valid_subcategories, article_date_publish)
            else:
                logger.debug(f"Not added article: {final_url}")
        except:
            logger.debug(f"Couldn't go through fetch and/or analyze {google_news_url}")
            continue