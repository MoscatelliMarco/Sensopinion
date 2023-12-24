import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs
from variables import urls_to_scrape

def scrape_news():
    # Headers to simulate a real user visit
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

    urls = []

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

                response = requests.get(google_news_url, allow_redirects=True, timeout=10)
                
                # Get the final URL after redirection
                final_url = response.url

                urls.append(final_url)

    return set(urls)