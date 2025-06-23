export function widget(symbol = "AAPL") {
  const existing = document.getElementById("tradingview-widget");
  if (existing) {
    existing.innerHTML = "";
  }

  new window.TradingView.widget({
    autosize: true,
    symbol: symbol,
    interval: "D",
    timezone: "Asia/Kolkata",
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#0f111a",
    container_id: "tradingview-widget",
  });
}
