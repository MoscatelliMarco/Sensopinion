import asyncio
from pyppeteer import launch

async def save_html_as_png(html_content, output_png):
    browser = await launch(headless=True)
    page = await browser.newPage()

    # Set content of the page to the provided HTML string
    await page.setContent(html_content)

    # Set viewport size to the full page size
    body_width = await page.evaluate('document.body.scrollWidth')
    body_height = await page.evaluate('document.body.scrollHeight')
    await page.setViewport({'width': body_width, 'height': body_height})

    # Save screenshot as PNG
    await page.screenshot({'path': output_png})

    # Close browser
    await browser.close()

def html_to_image(folder, replacements, output_file = "./posts/demo.png"):
    # Read HTML and CSS content
    with open(f"./templates/{folder}/template.html", 'r') as file:
        html_content = file.read()
    with open(f"./templates/{folder}/style.css", 'r') as file:
        css_content = file.read()
    with open(f"./templates/app.css", 'r') as file:
        tailwind_css_content = file.read()

    # Replace placeholders in HTML and CSS
    for key, value in replacements.items():
        html_content = html_content.replace("{{" + key + "}}", value)
    
    # Full HTML content including CSS
    full_html = html_content.replace('<link rel="stylesheet" href="./style.css">', f'<style>{css_content}</style>')
    full_html = full_html.replace('<link rel="stylesheet" href="../app.css">', f'<style>{tailwind_css_content}</style>')

    print(full_html)
    
    # Save file
    asyncio.get_event_loop().run_until_complete(save_html_as_png(full_html, output_file))