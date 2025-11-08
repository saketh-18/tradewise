// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget() {
  const container = useRef(null);

  useEffect(() => {
    // Clear any existing script/widget before adding a new one
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          { "proName": "TVC:GOLD", "title": "Gold" },
          { "proName": "BSE:TATASTEEL", "title": "Tata Steel" },
          { "proName": "BSE:SENSEX", "title": "Sensex" },
          { "proName": "BSE:SBIN", "title": "SBI" },
          { "proName": "BSE:RELIANCE", "title": "Reliance" },
          { "proName": "BSE:ADANIPOWER", "title": "ADANI POW" },
          { "proName": "BSE:TCS", "title": "TCS" },
          { "proName": "BSE:MRF", "title": "MRF" },
          { "proName": "BSE:SUZLON", "title": "Suzlon" },
          { "proName": "BSE:ITC", "title": "ITC" },
          { "proName": "BSE:ICICIBANK", "title": "ICICI" },
          { "proName": "BSE:HDFCBANK", "title": "HDFC" },
          { "proName": "BSE:INFY", "title": "INFY" }
        ],
        "colorTheme": "dark",
        "locale": "en",
        "isTransparent": true,
        "showSymbolLogo": true,
        "displayMode": "adaptive"
      }`;
    container.current.appendChild(script);

    // remove script and widget on unmount
    return () => {
      container.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewWidget);
