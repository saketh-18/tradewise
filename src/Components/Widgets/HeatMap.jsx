import React, { useEffect, useRef, memo } from "react";

function HeatMapWidget() {
  const container = useRef();
  const scriptAdded = useRef(false); // Track if the script is already added

  useEffect(() => {
    if (!scriptAdded.current) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "exchanges": [],
          "dataSource": "SENSEX",
          "grouping": "sector",
          "blockSize": "market_cap_basic",
          "blockColor": "change",
          "locale": "en",
          "symbolUrl": "",
          "colorTheme": "dark",
          "hasTopBar": false,
          "isDataSetEnabled": false,
          "isZoomEnabled": true,
          "hasSymbolTooltip": true,
          "isMonoSize": false,
          "width": "100%",
          "height": "100%",
          "isTransparent": true
        }`;
      container.current.appendChild(script);
      scriptAdded.current = true; // Mark script as added
    }
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(HeatMapWidget);
