import React, { useEffect, useRef } from "react";

const SymbolInfo = () => {
  const containerRef = useRef(null); // Reference to the widget container

  useEffect(() => {
    if (!containerRef.current) return; // Ensure the container is ready

    // Remove any existing scripts in case of re-render
    containerRef.current.innerHTML = "";

    // Create the script element
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "BSE:SUZLON",
      width: "100%",
      locale: "en",
      colorTheme: "dark",
      isTransparent: true,
    });

    // Append the script to the container
    containerRef.current.appendChild(script);
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default SymbolInfo;
