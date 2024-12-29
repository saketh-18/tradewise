import React, { useEffect, useRef } from "react";

const TradingViewFinancialsWidget = () => {
  const containerRef = useRef(null); // Reference to the container for the widget

  useEffect(() => {
    if (!containerRef.current) return; // Ensure the container is available

    // Clear any previously rendered content to avoid duplication
    containerRef.current.innerHTML = "";

    // Create and configure the TradingView widget script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      isTransparent: true,
      largeChartUrl: "",
      displayMode: "adaptive",
      width: "100%",
      height: "250",
      colorTheme: "dark",
      symbol: "BSE:SUZLON",
      locale: "en",
    });

    // Append the script to the container
    containerRef.current.appendChild(script);
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget"></div>
      
    </div>
  );
};

export default TradingViewFinancialsWidget;
