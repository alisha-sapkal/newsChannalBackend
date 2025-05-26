from bs4 import BeautifulSoup
import requests
import pymysql
import hashlib
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class ScraperMoneyControlMarket:
    def __init__(self):
        self.url = "https://www.moneycontrol.com/stocksmarketsindia/"
        self.headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
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
        suffix = hashlib.md5(title.encode()).hexdigest()[:7]
        return f"{title_slug}-{suffix}"

    def fetch_data(self):
        try:
            response = requests.get(self.url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')

            # Initialize the list to store scraped data
            scraped_data = []

            # Find the div elements with class "market_tpnews"
            market_tpnews_divs = soup.find_all('div', class_='market_tpnews')

            for div in market_tpnews_divs:
                article_data = {
                    'image_alt_text': "No image alt text found",
                    'image_url': None,
                    'article_href': "No second link found",
                    'headings': "",
                    'article_text': "No second link text found"
                }

                # Find image and alt text if available
                first_a_tag = div.find('a', href=True)
                if first_a_tag and first_a_tag.find('img', alt=True):
                    image_alt = div.find('img', alt=True)
                    article_data['image_alt_text'] = first_a_tag.find('img')['alt']
                    article_data['image_url'] = image_alt['src']

                # Find article link and fetch its content
                a_tags = div.find_all('a')
                if len(a_tags) > 1:
                    article_href = a_tags[1]['href']
                    if article_href.startswith('/'):
                        article_href = f"https://www.moneycontrol.com{article_href}"
                    article_data['article_href'] = article_href

                    # Fetch article page and extract details
                    article_response = requests.get(article_href, headers=self.headers)
                    article_soup = BeautifulSoup(article_response.text, 'html.parser')

                    content_wrapper_div = article_soup.find('div', class_='page_wrapper')
                    hindi_wrapper_div = article_soup.find('div', class_='wrapper consumption-main')

                    if content_wrapper_div:
                        paragraphs = content_wrapper_div.find_all('p')
                        article_data['article_text'] = ' '.join(p.get_text(strip=True) for p in paragraphs)
                        headings = content_wrapper_div.find_all('h2')
                        article_data['headings'] = ' '.join(h.get_text(strip=True) for h in headings)
                    elif hindi_wrapper_div:
                        paragraphs = hindi_wrapper_div.find_all('p')
                        article_data['article_text'] = ' '.join(p.get_text(strip=True) for p in paragraphs)
                        headings = hindi_wrapper_div.find_all('h2')
                        article_data['headings'] = ' '.join(h.get_text(strip=True) for h in headings)

                # Append the article data to the list
                scraped_data.append(article_data)

            return scraped_data

        except Exception as e:
            print(f"Error fetching data: {str(e)}")
            return []

    def insert_data(self, article_data):
        connection = pymysql.connect(**self.db_config, cursorclass=pymysql.cursors.DictCursor)
        try:
            with connection.cursor() as cursor:
                try:
                    article_id = self.generate_article_id(article_data['headings'])
                    check_query = "SELECT COUNT(*) FROM news WHERE ArticleId = %s"
                    cursor.execute(check_query, (article_id,))
                    exists = cursor.fetchone()['COUNT(*)']

                    if exists == 0:
                        insert_query = """
                            INSERT INTO news (ArticleId, Title, Description, Sphoto, Lphoto, Type, Source, SourceLink, Link)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """
                        values = (
                            article_id,
                            article_data['headings'],
                            article_data['article_text'],
                            article_data['image_url'],
                            article_data['image_url'],
                            'Markets',
                            "MoneyControl",
                            "https://www.moneycontrol.com",
                            article_data['article_href']
                        )
                        cursor.execute(insert_query, values)
                        connection.commit()
                        print(f"Data inserted successfully for {article_id}")
                    else:
                        print(f"Article with ArticleId {article_id} already exists, skipping.")

                except Exception as e:
                    print(f"Error executing query: {str(e)}")
                    connection.rollback()

        except Exception as e:
            print(f"Error with database connection: {str(e)}")
            connection.rollback()

        finally:
            connection.close()

    def run(self):
        articles = self.fetch_data()

        for article in articles:
            self.insert_data(article)

if __name__ == "__main__":
    scraper = ScraperMoneyControlMarket()
    scraper.run()
