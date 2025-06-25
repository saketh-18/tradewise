import React, { useEffect, useRef } from "react";

const CryptoList = () => {
  const container = useRef();

  useEffect(() => {
    // Clear previous content to avoid duplicates
    container.current.innerHTML = "";

    // Create the TradingView script dynamically
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "defaultColumn": "overview",
        "screener_type": "crypto_mkt",
        "displayCurrency": "BTC",
        "colorTheme": "dark",
        "locale": "en",
        "isTransparent": true
      }
    `;
    container.current.appendChild(script);
  }, []); // Dependency array ensures this effect runs only once

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default CryptoList;
