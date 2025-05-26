// components/SearchBarClient.tsx
"use client";

import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchBarClient: React.FC = () => {
  return (
    <div className="header-search-bar">
      <SearchIcon style={{ fontSize: 30, color: "white", cursor: "pointer" }} className="sr" />
    </div>
  );
};

export default SearchBarClient;
