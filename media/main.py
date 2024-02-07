from functions.html_to_image import html_to_image

if __name__ == "__main__":
    html_to_image("most_x_news", {
        "factor": "negative", 
        "category": "politics",
        "news_title": "Biden is killing civiliants and his enjoying it",
        "image_first_url": "https://asianews.network/wp-content/uploads/2024/02/2532551.jpg"
        })

    print('post')