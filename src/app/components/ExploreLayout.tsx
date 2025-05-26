import { NextPage } from "next";
import "../../../assets/css/SpecificArticleDesign1.scss";
import "../../../assets/css/Explore.css";
import { news } from "@/app/utilfunctions/interfaces";
import Masonry from "react-masonry-css";
import Link from "next/link";

export default function Explore({
  articles,
  zeroArticleMsg="No articles found",
}: {
  articles: news[];
  zeroArticleMsg: string;
}) {
  const cardDesign1 = (newsArticle: news) => {
    return (
      <div className="news-block-design1 left-news-block" >
        <img src={newsArticle.sphoto} alt="News Image" />
        <p className="heading">
          <img src="images/avatar.jpg" alt="" />
          <span>John Doe</span>
          <span>1 day ago</span>
        </p>
        <p className="body">{newsArticle.title}</p>
      </div>
    );
  };

  const cardDesign2 = (newsArticle: news) => {
    return (
      <Link href={`/view/${newsArticle.articleId}`}>
      <div className="news-block-design2" style={{marginTop: "50px"}}>
        <img src={newsArticle.sphoto} alt="News Image" />
        <div className="overlay-gradient" />
        <p className="body">{newsArticle.title}</p>
      </div>
      </Link>
    );
  };

  if (articles.length === 0) {
    return (
      <div className="no-articles-found">
        <p>{zeroArticleMsg}</p>
      </div>
    );
  }

  return (
    <>
      <section className="masonry-layout left-news-block">
        <Masonry
          breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {articles.map(cardDesign2)}
        </Masonry>
      </section>

      {/* <section className="news">
        <div className="news-article">
          <b>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </b>
          <img
            src="images/news1.jpg"
            alt="News Image"
            // style={{ maxHeight: "200px", maxWidth: "200px" }}
          />
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
        <div className="news-sidebar">
          <ul>
            <li>
              <img src="images/news2.jpg" alt="News Image" />
              <div>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <span>27 May 2024</span>
              </div>
            </li>
            <li>
              <img src="images/news3.jpg" alt="News Image" />
              <div>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum is simply dummy text of the
                  printing and typesetting industry. Lorem Ipsum is simply dummy
                  text of the printing and typesetting industry.
                </p>
                <span>27 May 2024</span>
              </div>
            </li>
            <li>
              <img src="images/news4.jpg" alt="News Image" />
              <div>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <span>27 May 2024</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section className="six-news-blocks">
        <div className="left-news-block">
          <div className="news-block-design1">
            <img src="images/news5.jpg" alt="News Image" />
            <p className="heading">
              <img src="images/avatar.jpg" alt="" />
              <span>John Doe</span>
              <span>1 day ago</span>
            </p>
            <p className="body">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>
          <div className="news-block-design2">
            <img src="images/news6.jpg" alt="News Image" />
            <div className="overlay-gradient" />
            <p className="body">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>
        </div>
        <div className="right-news-block">
          <div className="news-block">
            <img src="images/news7.jpg" alt="News Image" />
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>
          <div className="news-block">
            <img src="images/news8.jpg" alt="News Image" />
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>
          <div className="news-block">
            <img src="images/news9.jpg" alt="News Image" />
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>
          <div className="news-block">
            <img src="images/news10.jpg" alt="News Image" />
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>
        </div>
      </section>
      <section className="market-action">
        <div className="market-info">
          <div className="market-summary">
            <h2>Market Action</h2>
            <ul>
              <li>
                <p>Nifty 50</p>
                <p>
                  22999.66 <span className="change">42.15(0.69)</span>
                </p>
              </li>
              <li>
                <p>BSE Sensex</p>
                <p>
                  15566.45 <span className="change">216.86 (0.475)</span>
                </p>
              </li>
            </ul>
          </div>
          <div className="market-chart">
            <img src="images/chart.jpg" alt="Market Chart" />
          </div>
        </div>
      </section>

      <section className="weather">
        <div className="weather-summary">
          <h2>Weather Summary</h2>
          <img src="images/weather1.jpg" alt="Weather Chart" />
        </div>
        <div className="weather-details">
          <div className="weather-hourly">
            <h3>Hourly</h3>
            <img src="images/weather2.jpg" alt="Hourly Weather Chart" />
          </div>
          <div className="weather-more">
            <h3>More Details</h3>
            <img src="images/weather3.jpg" alt="More Weather Chart" />
          </div>
        </div>
      </section> */}
    </>
  );
}
