import React, { useEffect, useRef } from "react";

const TechnicalAnalysis = () => {
  const containerRef = useRef(null); // Ref to the container where the widget will be embedded

  useEffect(() => {
    if (!containerRef.current) return; // Ensure the container is ready

    // Clean up any previously added content to avoid duplicates
    containerRef.current.innerHTML = "";

    // Create and configure the TradingView widget script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: "1m",
      width: "100%",
      height: "100%" ,
      isTransparent: true,
      symbol: "BSE:SUZLON",
      showIntervalTabs: true,
      displayMode: "single",
      locale: "en",
      colorTheme: "dark",
    });

    // Append the script to the widget container
    containerRef.current.appendChild(script);
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget technicalAnalysis"></div>
    </div>
  );
};

export default TechnicalAnalysis;
