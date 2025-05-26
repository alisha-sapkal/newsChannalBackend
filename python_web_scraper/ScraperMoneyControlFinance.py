import os
import requests
import pymysql
from bs4 import BeautifulSoup
import hashlib
from datetime import datetime
from dotenv import load_dotenv
import unicodedata
import re

# Load environment variables from .env file
load_dotenv()

class ScraperMoneyControlFinance:
    def __init__(self):
        self.urls = [
            "https://www.moneycontrol.com/newsapi/mc_news.php?query=tags_slug%3A(%22invest%22+OR+%22mutual-funds%22+OR+%22equity-funds%22+OR+%22debt-funds%22+OR+%22gold%22+OR+%22bonds%22+OR+%22ncd%22+OR+%22fixed-deposit%22+OR+%22nps%22)+AND+sub_category_slug%3A%22personal-finance%22&start=0&limit=3&sortby=creation_date&sortorder=desc&classic=true",
            "https://www.moneycontrol.com/newsapi/mc_news.php?query=tags_slug%3A(%22insurance%22+OR+%22ulip%22+OR+%22term-plan%22+OR+%22endowment-plan%22+OR+%22policy%22+OR+%22premium%22+OR+%22house-insurance%22+OR+%22fire-insurance%22+OR+%22car-insurance%22+OR+%22third-party%22)+AND+sub_category_slug%3A%22personal-finance%22&start=0&limit=3&sortby=creation_date&sortorder=desc&classic=true",
            "https://www.moneycontrol.com/newsapi/mc_news.php?query=tags_slug%3A(%22banking%22+OR+%22bank%22+OR+%22app%22+OR+%22npci%22+OR+%22bhim%22+OR+%22digital%22+OR+%22rbi%22+OR+%22credit-policy%22+OR+%22loans%22+OR+%22fixed-deposit%22)+AND+sub_category_slug%3A%22personal-finance%22&start=0&limit=3&sortby=creation_date&sortorder=desc&classic=true",
            "https://www.moneycontrol.com/newsapi/mc_news.php?query=tags_slug%3A(%22tax%22+OR+%22income-tax%22+OR+%22capital-gains-tax%22+OR+%22dividend-distribution-tax%22)+AND+sub_category_slug%3A%22personal-finance%22&start=0&limit=3&sortby=creation_date&sortorder=desc&classic=true",
            "https://www.moneycontrol.com/newsapi/mc_news.php?query=tags_slug%3A(%22financial-planning%22+OR+%22millenial%22+OR+%22wealth-management%22+OR+%22financial-plan%22+OR+%22goals%22)+AND+sub_category_slug%3A%22personal-finance%22&start=0&limit=3&sortby=creation_date&sortorder=desc&classic=true",
            "https://www.moneycontrol.com/newsapi/mc_news.php?query=sub_category_slug%3A%22personal-finance%22%20AND%20post_type%3A%22videos%22&start=0&limit=12&sortby=creation_date&sortorder=desc&classic=true"
        ]
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

    def contains_hindi_text(self, text: str) -> bool:
        """Check if the given text contains Hindi (Devanagari script) characters."""
        # Regular expression to match Devanagari characters (Hindi script)
        devanagari_pattern = re.compile(r'[\u0900-\u097F]')
        return bool(devanagari_pattern.search(text))

    def fetch_data(self, url):
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()  # Check for HTTP errors
            return response.json()
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
        except Exception as err:
            print(f"Other error occurred: {err}")
        return None

    def insert_to_db(self, article):
        try:
            connection = pymysql.connect(**self.db_config)
            cursor = connection.cursor()

            insert_query = """
            INSERT INTO news (ArticleId, Title, Description, Sphoto, Lphoto, Type, Source, SourceLink, Link)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            article_id = self.generate_article_id(article.get('headline', ''))
            description = BeautifulSoup(article.get('body', ''), 'html.parser').get_text()

            # Skip articles with empty bodies or those containing Hindi text
            if not description.strip() or self.contains_hindi_text(description):
                print(f"Skipped article due to empty body or Hindi text: {article.get('headline', '')}")
                return

            cursor.execute(insert_query, (
                article_id,
                article.get('headline', ''),
                description,
                article.get('images', {}).get('large', ''),
                article.get('images', {}).get('large', ''),
                "Finance",
                "Money Control",
                "https://www.moneycontrol.com/",
                article.get('posturl', ''),
            ))

            connection.commit()
            print(f"Inserted article: {article.get('headline', '')}")

        except pymysql.MySQLError as db_err:
            print(f"Database error occurred: {db_err}")
        except Exception as err:
            print(f"Failed to insert article: {article}")
            print(f"Error: {err}")
        finally:
            if connection:
                cursor.close()
                connection.close()

    def run(self):
        for url in self.urls:
            data = self.fetch_data(url)
            if data:
                for key, article in data.items():
                    if key.isdigit() and article.get('headline') and article.get('body') and article.get('images', {}).get('thumbnail') and article.get('images', {}).get('large') and article.get('posturl'):
                        print(article)
                        
                        self.insert_to_db(article)

if __name__ == "__main__":
    scraper = ScraperMoneyControlFinance()
    scraper.run()
