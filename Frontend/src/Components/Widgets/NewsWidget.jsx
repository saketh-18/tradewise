import React, { useEffect } from 'react';

const NewsWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: "market",
      market: "index",
      isTransparent: true,
      displayMode: "adaptive",
      width: "100%",     
      height: "100%", 
      colorTheme: "dark",
      locale: "en",
    });

    const widgetContainer = document.getElementById('tradingview-widget');
    widgetContainer.appendChild(script);

    return () => {
      widgetContainer.innerHTML = ''; // Cleanup script on unmount
    };
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      style={{
        flex: '1 1 100%', // Full width in flex layout
        maxWidth: '1200px', // Prevent the widget from being too large
        margin: '0 auto', // Center the widget
        width: '100%', // Ensure it spans full width
      }}
    >
      <div id="tradingview-widget"></div>
      <div className="tradingview-widget-copyright"></div>
    </div>
  );
};

export default NewsWidget;
