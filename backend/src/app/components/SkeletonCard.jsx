// components/SkeletonCard.jsx

import React from "react";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__image"></div>
      <div className="skeleton-card__content">
        <div className="skeleton-card__title">
          <div className="loading-line"></div>
        </div>
        <div className="skeleton-card__description">
          <div className="loading-line"></div>
          <div className="loading-line"></div>
          <div className="loading-line"></div>
        </div>
        <div className="skeleton-card__see-more">
          <div className="loading-line"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
