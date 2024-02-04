from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

def html_to_image(folder, replacements, output_file = "./posts/demo.png"):
    # Read HTML and CSS content
    with open(f"./{folder}/template.html", 'r') as file:
        html_content = file.read()
    with open(f"./{folder}/style.css", 'r') as file:
        css_content = file.read()

    # Replace placeholders in HTML and CSS
    for key, value in replacements.items():
        html_content = html_content.replace(f'{{{{ {key} }}}}', value)
    
    # Full HTML content including CSS
    full_html = html_content.replace('<link rel="stylesheet" href="example.css">', f'<style>{css_content}</style>')
    
    # Configure Selenium with headless Chrome
    chrome_options = Options()
    # chrome_options.add_argument("--headless") TODO put headless back after testing
    chrome_options.add_argument("--window-size=2000x2000")
    driver = webdriver.Chrome(options=chrome_options)  # Ensure you have chromedriver installed and in PATH
    
    # Set content and render
    driver.get("data:text/html;charset=utf-8," + full_html)
    time.sleep(2)  # Adjust as necessary

    # Save screenshot
    driver.save_screenshot(output_file)
    driver.quit()