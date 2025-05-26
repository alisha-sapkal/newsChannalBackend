import os
import requests
import pymysql
from bs4 import BeautifulSoup
import hashlib
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class WebScraperMarket:
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
        suffix = hashlib.md5(title.encode()).hexdigest()[:7]
        return f"{title_slug}-{suffix}"

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

            # Skip articles with empty bodies
            if not description.strip():
                print(f"Skipped article with empty body: {article.get('headline', '')}")
                return

            cursor.execute(insert_query, (
                article_id,
                article.get('headline', ''),
                description,
                article.get('images', {}).get('large', ''),
                article.get('images', {}).get('large', ''),
                "Markets",
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
        r=  requests.get(self.url, self.headers)

        soup = BeautifulSoup(r.text, 'html.parser')


        # Find the div element with class "market_tpnews"
        market_tpnews_div = soup.find_all('div', class_='market_tpnews')

        article_text=""
        article_href=""
        hindi_text=""

        for div in market_tpnews_div:
            # Find the first a tag with an img tag inside and get the image alt text
            first_a_tag = div.find('a', href=True)
            if first_a_tag and first_a_tag.find('img', alt=True):
                image_alt1=div.find('img', alt=True)
                image_alt = first_a_tag.find('img')['alt']
                image_url = image_alt1['src']
            else:
                image_alt = "No image alt text found"


            
            a_tags = div.find_all('a')
            if len(a_tags) > 1:
                article_href = a_tags[1]['href']

                article_href = article_href[45:len(article_href)]

                if article_href.startswith('/'):
                    article_href = f"https://www.moneycontrol.com{article_href}"
                    
                article_response = requests.get(article_href, headers=self.headers)
                article_soup = BeautifulSoup(article_response.text, 'html.parser')
                    
                content_wrapper_div = article_soup.find('div', class_='page_wrapper') #page_wrapper  
                hindi_wrapper_div = article_soup.find('div', class_='wrapper consumption-main') 
                if content_wrapper_div:
                    paragraphs = content_wrapper_div.find_all('p')
                    paragraph_texts = [p.get_text(strip=True) for p in paragraphs]
                    paragraphs=content_wrapper_div.find_all('h2')
                    h2 = [p.get_text(strip=True) for p in paragraphs]
                elif hindi_wrapper_div:
                    paragraphs = hindi_wrapper_div.find_all('p')
                    paragraph_texts = [p.get_text(strip=True) for p in paragraphs]
                    paragraphs=hindi_wrapper_div.find_all('h2')
                    h2 = [p.get_text(strip=True) for p in paragraphs]
                else:
                    paragraph_texts = ["No paragraphs found in content wrapper"]
                
            else:
                article_href = "No second link found"
                article_text = "No second link text found"
                
                

            # Print the results
            print(f'Image Alt Text: {image_alt}')
            print(f'Image URL: {image_url}')
            print(f'Article Href: {article_href}')
            print(f'Heading of article: ')
            for para in h2:
                print(para)  
            print(f'Article Text: {article_text}')
            body_data = ""
            for para in paragraph_texts:
                body_data += para + "\n"
                print(para)  
            print('---')

            article = {
                "headline":image_alt,
                "body": body_data,
                "images":{
                    "large":image_url,
                    "small":image_url
                },
                "posturl":image_url,
            }
            self.insert_to_db(article)

if __name__ == "__main__":
    scraper = WebScraperMarket()
    scraper.run()
