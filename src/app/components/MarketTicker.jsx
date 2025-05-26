"use client";

const MarketTicker = ({data}) => {
  return (
    <div className="market-ticker">
      <div className="ticker-animation">
        {data}
      </div>
    </div>
  );
};

export default MarketTicker;
