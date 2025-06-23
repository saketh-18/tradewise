import { useEffect, useRef } from "react";

export default function TradingViewWidget({ symbol = "AAPL" }) {
  const containerRef = useRef();

  useEffect(() => {
    if (!window.TradingView) return;

    const widget = new window.TradingView.widget({
      symbol: symbol,
      container_id: containerRef.current.id,
      width: "100%",
      height: 400,
      theme: "dark",
      interval: "D",
      timezone: "Etc/UTC",
      style: "1",
      locale: "en",
    });

    return () => {
      containerRef.current.innerHTML = "";
    };
  }, [symbol]);

  return <div id="tv-container" ref={containerRef}></div>;
}
