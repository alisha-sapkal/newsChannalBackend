import requests
from bs4 import BeautifulSoup

# URL to fetch the JSON data
url = 'https://www.ndtvprofit.com/route-data.json?path=%2Ftechnology&query=read-more'

response = requests.get(url)
data = response.json()


stories = data['data']['stories']
for story in stories:
    headline = story.get('headline', 'No headline available')
    summary = story.get('summary', 'No summary available')
    print(f"Headline: {headline}")
    print(f"Summary: {summary}")
    
    # Extract and print the text content from the story cards
    cards = story.get('cards', [])
    for card in cards:
        elements = card.get('story-elements', [])
        for element in elements:
            if element['type'] == 'text':
                html_text = element['text']
                # Use BeautifulSoup to parse the HTML
                soup = BeautifulSoup(html_text, 'html.parser')
                paragraphs = soup.find_all('p')
                print("All information on this article")
                for p in paragraphs:
                    print(p.get_text())
    print("\n" + "="*50 + "\n")