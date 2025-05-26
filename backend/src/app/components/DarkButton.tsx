"use client";

import "./DarkButton.css";
import { useState } from "react";

const DarkButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);


  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  };

  return (
    <div className="dark-toggle-container">
      <button
      className= {`toggle-btn ${isDarkMode ? "toggled" : ""}`}
      onClick={toggleDarkMode}
      >
        <div className="ball" ></div>
      </button>
    </div>
  );
};

export default DarkButton;
