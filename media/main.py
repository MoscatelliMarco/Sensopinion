from functions.html_to_image import html_to_image

if __name__ == "__main__":
    html_to_image("./templates/most_x_news", {"title": "demo title", "body": "demo body"})