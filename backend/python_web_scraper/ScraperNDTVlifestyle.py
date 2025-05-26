from bs4 import BeautifulSoup
import requests
import pymysql
import hashlib
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class ScraperNDTVLifestyle:
    def __init__(self):
        self.url = 'https://www.ndtvprofit.com/api/v1/advanced-search?section-id=3416,&sort=latest-published&limit=10&offset=0'
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
        print(f"Slug Length: {len(title_slug)}")
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

            stories = data['items']
            for story in stories:
                article_data = {}

                headline = story.get('headline', 'No headline available')
                summary = story.get('summary', 'No summary available')
                article_url = f"{base_url}/{story.get('slug', '')}"

                article_data['headline'] = headline
                article_data['summary'] = summary

                if article_url:
                    full_article_url = f"https://www.ndtvprofit.com{article_url}"
                    article_data['article_url'] = full_article_url
                else:
                    article_data['article_url'] = "No URL found"

                image_key = story.get('hero-image-s3-key')
                if image_key:
                    full_image_url = f"https://media.assettype.com/{image_key}"
                    article_data['image_url'] = full_image_url
                else:
                    article_data['image_url'] = "No Image URL found"

                # Extract article text
                article_text = ""
                cards = story.get('cards', [])
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

                # Append the article data to the list
                articles.append(article_data)

            return articles
        except Exception as e:
            print(f"Error fetching data: {str(e)}")
            return []

    def insert_data(self, headings, desc_list, small_img, big_img, article_url):
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
                        values = (article_id, headings, desc_list, small_img, big_img, 'Lifestyle', "NDTV", "https://www.ndtvprofit.com/lifestyle", article_url)
                        cursor.execute(insert_query, values)
                        connection.commit()
                        print("Data inserted successfully")
                    else:
                        print(f"Article with ArticleId {article_id} already exists, skipping.")
                except Exception as e:
                    print(f"Error executing query: {str(e)}")
                    connection.rollback()
        except Exception as e:
            print(f"Database connection error: {str(e)}")
        finally:
            connection.close()

    def run(self):
        articles = self.fetch_data()
        
        for article in articles:
            self.insert_data(article['headline'], article['article_text'], article['image_url'], article['image_url'], article['article_url'])

if __name__ == "__main__":
    scraper = ScraperNDTVLifestyle()
    scraper.run()