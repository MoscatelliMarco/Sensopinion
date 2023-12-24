from functions.scrape_news import scrape_news
from functions.process_article import process_article
from functions.database import DBClient
import os

client = DBClient(os.environ.get("MONGODB_CLIENT_URL"))

def scheduler_function():
    # try:
    # Step 1: Fetch recent news entries (assuming this function is defined)
    news_entries = client.fetch_news()
    new_articles = scrape_news(new_urls)

    # Step 2 & 3: Iterate through the news entries and process new URLs
    for entry in news_entries:
        for article_url in new_articles:
            url = entry['url']

            # Check if the URL is already in the database
            is_already_analyzed = False
            for entry_key in news_entries.keys():
                if news_entries[entry_key]['url'] == article_url:
                    print(f"URL already processed: {url}")
                    continue  # Skip this URL and move to the next

            # Scrape the news article (assuming this function is defined)
            article_text = scrape_news(url)

            emotions_percentage, sentiment, valid_categories, valid_subcategories, article_date_publish = process_article(url)
            if not len(valid_categories):
                print(f"The article analyze is not recognized in any category: {url}")
                continue
            client.insert_article(url, emotions_percentage, valid_categories, valid_subcategories, article_date_publish)

    # except Exception as e:
    #     print(f"Error in main workflow: {e}")

