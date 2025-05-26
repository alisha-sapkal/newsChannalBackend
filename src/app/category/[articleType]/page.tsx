"use client";
import { news } from "@/app/utilfunctions/interfaces";
import { useEffect, useState } from "react";
import Explore from "../../components/ExploreLayout";

export default function Search({
  params,
}: {
  params: { articleType: string };
}) {
  const [newsContainer, setNewsContainer] = useState<news[]>([]);
  useEffect(() => {
    const fetchMainNewsArticle = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?articleType=${params.articleType}&num=20`
        );
        const data = await response.json();
        if (response.ok) {
          setNewsContainer(data);
          // Store category in localStorage
          if (data.type) {
            localStorage.setItem("articleType", params.articleType);
          }
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchMainNewsArticle();
  }, []);

  return (
    <>
      <div className="market-ticker">
        <div className="ticker-animation">
          S&P 10132.89 S&P 10132.89 S&P 10132.89
        </div>
      </div>
      <Explore
        articles={newsContainer}
        zeroArticleMsg={`No Articles Found for ${params.articleType}`}
      />
    </>
  );
}
