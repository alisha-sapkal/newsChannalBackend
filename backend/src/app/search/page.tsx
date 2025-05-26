"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "material-ui-search-bar";
import { news } from "../utilfunctions/interfaces"; // Adjust the path as necessary
// import NewsBlock from '../components/NewsBlock';
import ExploreLayout from "../components/ExploreLayout";

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<news[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/searcharticles?query=${searchValue}&num=20`
        );
        if (response.status === 404) {
          setSearchResults([]); // Set empty results if 404
        } else {
          const data = await response.json();
          if (response.ok) {
            setSearchResults(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchValue]);

  return (
    <div className="search-page">
      <div className="search-bar-wrapper">
        <SearchBar
          className="searchbar"
          style={{ width: "90%", maxWidth: "500px" }}
          value={searchValue}
          onChange={(newValue) => setSearchValue(newValue)}
          onCancelSearch={() => setSearchValue("")}
          placeholder="Search News, markets, photos, videos...."
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ExploreLayout
          articles={searchResults}
          zeroArticleMsg={`No Articles Found for "${searchValue}"`}
        />
      )}
    </div>
  );
}
