import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, Brain } from "lucide-react";
import { API_URL } from "../config";

export default function AISignal({ symbol }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle missing symbol safely
  if (!symbol) {
    return (
      <div className="p-4 text-center bg-[#0f172a] border border-[#1e293b] rounded-2xl text-gray-400">
        <Sparkles className="w-5 h-5 mx-auto animate-pulse mb-2 text-cyan-500" />
        Loading symbol...
      </div>
    );
  }

  useEffect(() => {
    let isCancelled = false; // prevent race condition

    async function getAIData() {
      setIsLoading(true);
      setData({}); // 👈 clear previous data immediately when symbol changes
      try {
        const res = await fetch(`${API_URL}/api/ai/${symbol}`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const result = await res.json();
        if (!isCancelled) setData(result);
      } catch (error) {
        console.error("Error fetching AI data:", error);
        if (!isCancelled) setData({});
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    getAIData();
    return () => {
      isCancelled = true;
    };
  }, [symbol]); // 👈 refetch cleanly whenever symbol changes

  const parsed = useMemo(() => {
    try {
      if (data.insights && typeof data.insights === "string") {
        return JSON.parse(data.insights);
      }
    } catch (e) {
      console.error("JSON Parsing Error:", e);
      return {
        Sentiment: "Error",
        Summary: "Could not parse AI response.",
        ConfidencePct: "0%",
      };
    }
    return null;
  }, [data.insights]);

  if (isLoading || !parsed) {
    return (
      <div className="p-4 text-center bg-[#0f172a] border border-[#1e293b] rounded-2xl text-gray-400 animate-fade-in">
        <Sparkles className="w-5 h-5 mx-auto animate-pulse mb-2 text-cyan-500" />
        {isLoading
          ? `Analyzing ${symbol.toUpperCase()} market signals...`
          : `Awaiting AI insight for ${symbol.toUpperCase()}...`}
      </div>
    );
  }

  const isBullish = parsed.Sentiment?.toLowerCase() === "bullish";

  return (
    <motion.div
      key={symbol} // 👈 ensures a fresh render for every symbol switch
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-lg p-5 w-full max-w-sm text-gray-100 hover:shadow-cyan-700/30 hover:border-cyan-600/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="text-cyan-400 w-5 h-5" />
          <h2 className="text-lg font-semibold tracking-wide">
            AI Insights – {symbol}
          </h2>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isBullish
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {parsed.Sentiment}
        </span>
      </div>

      <p className="text-sm text-gray-300 mb-4 leading-relaxed">
        {parsed.Summary}
      </p>

      <div className="bg-[#1e293b]/70 rounded-xl p-3 text-sm space-y-2 border border-[#334155]/40">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Confidence</span>
          <span className="font-semibold text-cyan-400">
            {parsed.ConfidencePct}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Primary Driver</span>
          <span className="font-semibold text-gray-200">
            {parsed.PrimaryDriver || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Trade Interval</span>
          <span className="font-semibold text-gray-200">
            {parsed.TradeInterval || "N/A"}
          </span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className={`mt-5 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
          isBullish
            ? "bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-700/40"
            : "bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-700/40"
        }`}
      >
        {isBullish ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        {isBullish ? "Consider Long Position" : "Consider Short Position"}
      </motion.button>

      <div className="text-xs text-gray-500 text-center mt-3 italic">
        AI-generated analysis. Use with discretion.
      </div>
    </motion.div>
  );
}
