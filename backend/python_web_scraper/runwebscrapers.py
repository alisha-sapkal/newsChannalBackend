from ScraperNDTVlifestyle import ScraperNDTVLifestyle
from ScraperMoneyControlFinance import ScraperMoneyControlFinance
from ScraperNDTVtechnology import ScraperNDTVTechnology
from ScraperMoneyControlMarket import ScraperMoneyControlMarket

def main():
    scrapers = [
        ScraperNDTVLifestyle(),
        ScraperMoneyControlFinance(),
        ScraperNDTVTechnology(),
        ScraperMoneyControlMarket()
    ]
    
    for scraper in scrapers:
        try:
            print(f"Starting {scraper.__class__.__name__}...")
            scraper.run()
            print(f"{scraper.__class__.__name__} completed successfully.")
        except Exception as e:
            print(f"Error running {scraper.__class__.__name__}: {str(e)}")
            # Optionally log error details to a file
            with open("error_log.txt", "a") as f:
                f.write(f"Error running {scraper.__class__.__name__}: {str(e)}\n")
            continue

if __name__ == "__main__":
    main()
