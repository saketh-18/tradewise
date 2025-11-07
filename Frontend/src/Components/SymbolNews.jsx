import React, { useEffect } from "react";
import { API_URL } from "../config";
import { useState } from "react";

export default function SymbolNews({ symbol }) {
  const [news, setNews] = useState([
    { headline: "Apple stock is down as doctors are staying away from it" },
  ]);
  useEffect(() => {
      async function fetchSymbolNews() {
      console.log(symbol);
      const response = await fetch(`${API_URL}/api/news/${symbol}`);
      const result = await response.json();
      // console.log(result);
      setNews(result);  
      } fetchSymbolNews();
  }, [symbol]);
  return (
    <div className="border border-[#24283b] rounded-xl bg-[#111422]/80 p-2 h-96 overflow-scroll overflow-x-hidden no-scrollbar">
      {news.map((el) => (
        <div className="p-2" key={el.id}>
          <p className="text-l font-semibold">{el.headline}</p>
          <p className="text-xs font-thin">{el.source}</p>
        </div>
      ))}
    </div>
  );
}
