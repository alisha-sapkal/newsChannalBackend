"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Image from "next/image"; // Import Next.js Image component
import "../../../../assets/css/SpecificArticleDesign1.scss";
import { formatDate } from "@/app/utilfunctions/dateFormatter";
import LeftAsideNews from "@/app/components/LeftAsideNews";
import Link from "next/link";
import { news } from "@/app/utilfunctions/interfaces";
import RightBsideNews from "@/app/components/RightBsideNews";
import { Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

import ShareWhite from "../../../../assets/img/shareWhite.png"; // Adjust your image import path

function getRandomElement(array: news[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const ArticlePage = ({ params }: { params: { articleId: string } }) => {
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trendingNews, setTrendingNews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [marketTickerData, setMarketTickerData] = useState(<></>);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchTrendingNewsArticle = async () => {
      try {
        const response = await fetch(`/api/searcharticles?num=15&randomize=false&sortBy=created_datetime&order=DESC`);
        let data = await response.json();
        if (response.ok) {
          const randomElement = getRandomElement(data.slice(1) || data);
          setMarketTickerData(
            <Link href={`/view/${randomElement.articleId}`}>
              Breaking News: {randomElement.title}
            </Link>
          );
          data = data.slice(0, 10);
          setTrendingNews(data);
          if (data.type) {
            localStorage.setItem("articleType", data.type);
          }
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      }
    };

    const fetchLatestNewsArticle = async () => {
      try {
        const response = await fetch(`/api/searcharticles?articleType=random&num=8&order=DESC`);
        const data = await response.json();
        if (response.ok) {
          setLatestNews(data);
          if (data.type) {
            localStorage.setItem("articleType", data.type);
          }
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      }
    };

    fetchTrendingNewsArticle();
    fetchLatestNewsArticle();
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/searcharticles?articleId=${encodeURIComponent(params.articleId)}&fullDescription=true`);
        const data = await response.json();
        if (response.ok) {
          setArticle(data[0]);
          if (data.type) {
            localStorage.setItem("articleType", data.type);
          }
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.articleId]);

  const handleShare = async () => {
    const articleUrl = `${window.location.origin}/view/${params.articleId}`;
    const articleTitle = article?.title || "Check out this article!";

    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          text: article.description,
          url: articleUrl,
        });
        console.log("Article shared successfully!");
      } catch (error) {
        console.error("Error sharing article:", error);
      }
    } else {
      navigator.clipboard.writeText(articleUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Article not found.</p>;

  return (
    <div className="specific-article-design1" style={{marginTop: "90px"}}>
      <Head>
        <title>{article?.title || "Article Page"}</title>
      </Head>
      <div className="header">
        <div className="go-back" onClick={() => router.back()}>
          <ArrowBackIosNewIcon style={{ fontSize: "10px" }} />
        </div>
        <div className="date-title">
          <div className="date">
            {article.date ? formatDate(new Date(article.date)) : "Unknown Date"}
          </div>
          <div className="title">{article.title}</div>
        </div>
      </div>
      <div className="body">
        <div className="leftaside">
          <LeftAsideNews trendingNews={trendingNews} />
        </div>
        <div className="article-dis">
          <div className="image">
            <img src={article.lphoto} alt="Article Image" />
          </div>
          <div
            className="des"
            dangerouslySetInnerHTML={{
              __html: article.description, // Sanitize and set inner HTML
            }}
          />

          {/* Share Button */}
          <div className="share-button">
            <Tooltip title={isCopied ? "Link Copied!" : "Share this article"}>
              <button
                onClick={handleShare}
                className="share-article-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  position: "fixed",
                  right: "50px",
                  top: "120px",
                }}
              >
                <Image
                  src={ShareWhite}
                  width={20}
                  height={20}
                  alt="share icon"
                  style={{ marginRight: "5px" }}
                />
                Share
              </button>
            </Tooltip>
          </div>
        </div>
        <aside className="right-aside">
          <RightBsideNews latestNews={latestNews} />
        </aside>
      </div>
    </div>
  );
};

export default ArticlePage;
