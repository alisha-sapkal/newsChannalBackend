from math import e
from bs4 import BeautifulSoup
import requests
import pymysql
import hashlib
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class ScraperNDTVTechnology:
    def __init__(self):
        self.url = 'https://www.ndtvprofit.com/route-data.json?path=%2Ftechnology&query=read-more'
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        }
        self.db_config = {
            'host': os.getenv('MYSQL_HOST'),
            'port': int(os.getenv('MYSQL_PORT')),
            'user': os.getenv('MYSQL_USER'),
            'password': os.getenv('MYSQL_PASSWORD'),
            'database': os.getenv('MYSQL_DATABASE')
        }

    def generate_article_id(self, title: str) -> str:
        """Generate a unique ArticleId based on the article title."""
        title_slug = ''.join(c if c.isalnum() else '-' for c in title.lower())
        if len(title_slug) > 240:
            title_slug = title_slug[:240]
        print(len(title_slug))
        suffix = hashlib.md5(title.encode()).hexdigest()[:7]
        return f"{title_slug}-{suffix}"

    def fetch_data(self):
        try:
            response = requests.get(self.url)
            data = response.json()

            # Base URL for constructing full URLs
            base_url = data.get('currentHostUrl', '')

            # List to store all the output
            articles = []

            stories = data['data']['stories']
            for story in stories:
                article_data = {}

                cards = story.get('cards', [])
                headline = story.get('headline', 'No headline available')
                summary = story.get('summary', 'No summary available')
                article_url = f"{base_url}/{story.get('slug', '')}"

                article_data['headline'] = headline
                article_data['summary'] = summary
                article_data['article_url'] = article_url

                image_key = story.get('hero-image-s3-key')
                if image_key:
                    full_image_url = f"https://media.assettype.com/{image_key}"
                    article_data['image_url'] = full_image_url
                else:
                    article_data['image_url'] = "No Hero Image S3 URL found"

                # Extract and store article text
                article_text = ""
                for card in cards:
                    elements = card.get('story-elements', [])
                    for element in elements:
                        if element['type'] == 'text':
                            html_text = element['text']
                            soup = BeautifulSoup(html_text, 'html.parser')
                            paragraphs = soup.find_all('p')
                            for p in paragraphs:
                                article_text += p.get_text() + "\n"

                article_data['article_text'] = article_text.strip()

                # Add the dictionary to the list
                articles.append(article_data)

            # Now, articles is a list of dictionaries containing all the collected data
            for article in articles:
                print(article)
                print("\n" + "="*50 + "\n")

            return articles
        except Exception as e:
            print(f"Error fetching data: {str(e)}")
            return [], [], [], []

    def insert_data(self, headings, Desc_list, smallimg, bigimg, articleURL):
        connection = pymysql.connect(**self.db_config, cursorclass=pymysql.cursors.DictCursor)
        try:
            with connection.cursor() as cursor:
                try:
                    article_id = self.generate_article_id(headings)
                    check_query = "SELECT COUNT(*) FROM news WHERE ArticleId = %s"
                    cursor.execute(check_query, (article_id,))
                    exists = cursor.fetchone()['COUNT(*)']

                    if exists == 0:
                        insert_query = """
                            INSERT INTO news (ArticleId, Title, Description, Sphoto, Lphoto, Type, Source, SourceLink, Link)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """
                        values = (article_id, headings, Desc_list, smallimg, bigimg, 'Technology', "NDTV", "https://www.ndtvprofit.com/technology", articleURL)
                        cursor.execute(insert_query, values)
                    else:
                        print(f"Article with ArticleId {article_id} already exists, skipping.")
                except Exception as e:
                    print(f"Error executing query: {str(e)}")
                    connection.rollback()
                connection.commit()
                print("Data inserted successfully")
        except Exception as e:
            print(f"Error with database operations: {str(e)}")
            connection.rollback()
        finally:
            connection.close()

    def run(self):
        articles = self.fetch_data()
        
        for article in articles:
            self.insert_data(article['headline'], article['article_text'], article['image_url'], article['image_url'], article['article_url'])


if __name__ == "__main__":
    scraper = ScraperNDTVTechnology()
    scraper.run()
