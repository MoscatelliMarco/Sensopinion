from functions.process_article import process_article
from functions.process_article import process_article_text

def analyze_text_article(text):
    return process_article_text(text)

def analyze_url_article(url):
    return process_article(url)