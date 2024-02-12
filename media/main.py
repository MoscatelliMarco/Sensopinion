from functions.html_to_image import html_to_image

if __name__ == "__main__":
    html_to_image("most_x_news", {
        "factor": "negative", 
        "category": "politics",
        "news_title": "Biden is killing civiliants and his enjoying it",
        "news_description": "People are desperate and don't know what to do, they are begging for mercy.",
        "image_url": "https://asianews.network/wp-content/uploads/2024/02/2532551.jpg",

        "news_title_2": "Biden is killing civiliants and his enjoying it",
        "news_description_2": "People are desperate and don't know what to do, they are begging for mercy.",
        "image_url_2": "https://asianews.network/wp-content/uploads/2024/02/2532551.jpg",

        "news_title_3": "Biden is killing civiliants and his enjoying it",
        "news_description_3": "People are desperate and don't know what to do, they are begging for mercy.",
        "image_url_3": "https://asianews.network/wp-content/uploads/2024/02/2532551.jpg"
        })

    print('post')