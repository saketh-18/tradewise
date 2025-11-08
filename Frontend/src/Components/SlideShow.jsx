// NewsSlideshow.jsx
// A polished, theme-aware slideshow for TradeWise news data
// - Animations via Framer Motion
// - Tailwind + shadcn/ui for clean UI
// - Keyboard + swipe + autoplay with progress
// - Accessible controls and reduced-motion support

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, ExternalLink, Pause, Play, Dot } from "lucide-react";

/**
 * Expected item shape (maps 1:1 with the sample API):
 * {
 *   category: string,
 *   datetime: number, // seconds since epoch
 *   headline: string,
 *   id: number,
 *   image: string,
 *   source: string,
 *   summary: string,
 *   url: string
 * }
 */

const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>
      <defs>
        <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
          <stop stop-color='#0f172a' offset='0%'/>
          <stop stop-color='#020617' offset='100%'/>
        </linearGradient>
      </defs>
      <rect fill='url(#g)' width='800' height='450'/>
      <g fill='#93c5fd' font-family='Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial' font-size='28'>
        <text x='40' y='80' opacity='0.9'>TradeWise</text>
        <text x='40' y='130' opacity='0.7'>News</text>
      </g>
    </svg>`
  );

// ✅ make this a plain helper function (not a hook)
function getRelativeTime(tsSec) {
  if (!tsSec) return "";
  try {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    const now = Date.now();
    const diffMs = tsSec * 1000 - now;
    const abs = Math.abs(diffMs);
    const units = [
      ["year", 1000 * 60 * 60 * 24 * 365],
      ["month", 1000 * 60 * 60 * 24 * 30],
      ["week", 1000 * 60 * 60 * 24 * 7],
      ["day", 1000 * 60 * 60 * 24],
      ["hour", 1000 * 60 * 60],
      ["minute", 1000 * 60],
      ["second", 1000],
    ];
    for (const [unit, ms] of units) {
      if (abs >= ms || unit === "second") {
        const val = Math.round(diffMs / ms);
        return rtf.format(val, unit);
      }
    }
  } catch {
    return new Date(tsSec * 1000).toLocaleString();
  }
}

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function NewsSlideshow({ items = [], autoplayMs = 6000, className = "" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevIndex = useRef(0);
  const dirRef = useRef(0);
  const containerRef = useRef(null);
  const pointer = useRef({ startX: 0, dragging: false });
  const reduceMotion = useReducedMotion();

  // ✅ define items and curr inside component
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  const count = safeItems.length;
  const curr = safeItems[index] ?? null;
  const when = getRelativeTime(curr?.datetime);

  const next = useCallback(() => {
    if (!count) return;
    prevIndex.current = index;
    const nextIndex = (index + 1) % count;
    dirRef.current = 1;
    setIndex(nextIndex);
    setProgress(0);
  }, [index, count]);

  const prev = useCallback(() => {
    if (!count) return;
    prevIndex.current = index;
    const nextIndex = (index - 1 + count) % count;
    dirRef.current = -1;
    setIndex(nextIndex);
    setProgress(0);
  }, [index, count]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key.toLowerCase() === " ") setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Autoplay + progress
  useEffect(() => {
    if (paused || !count) return;
    const step = 50; // ms
    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += step;
      setProgress(Math.min(100, (elapsed / autoplayMs) * 100));
      if (elapsed >= autoplayMs) {
        next();
        elapsed = 0;
      }
    }, step);
    return () => clearInterval(id);
  }, [paused, count, autoplayMs, next]);

  // Swipe gestures (pointer events)
  const onPointerDown = (e) => {
    pointer.current = { startX: e.clientX ?? e.touches?.[0]?.clientX ?? 0, dragging: true };
  };
  const onPointerUp = (e) => {
    if (!pointer.current.dragging) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const dx = endX - pointer.current.startX;
    pointer.current.dragging = false;
    if (dx > 60) prev();
    if (dx < -60) next();
  };

  // Skeleton if empty
  if (!count) {
    return (
      <Card className={`w-full overflow-hidden bg-gradient-to-b from-slate-900 to-black border-slate-800 ${className}`}>
        <CardHeader className="p-0">
          <div className="relative h-64 w-full animate-pulse bg-slate-800/60" />
        </CardHeader>
        <CardContent className="space-y-3 p-6">
          <div className="h-6 w-40 rounded bg-slate-800/60" />
          <div className="h-8 w-3/4 rounded bg-slate-800/60" />
          <div className="h-20 w-full rounded bg-slate-800/60" />
        </CardContent>
      </Card>
    );
  }

  const direction = index === prevIndex.current ? 0 : index > prevIndex.current ? 1 : -1;

  const headline = curr?.headline ?? "";
  const summary = curr?.summary ?? "";
  const category = (curr?.category || "").toUpperCase();
  const source = curr?.source || "";
  const href = curr?.url || "#";
  const imageSrc = curr?.image || FALLBACK_IMG;

  return (
    <Card
      className={`group relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 shadow-[0_10px_40px_-20px_rgba(2,6,23,0.6)] ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Media */}
      <div
        ref={containerRef}
        className="relative h-[360px] w-full select-none"
        onMouseDown={onPointerDown}
        onMouseUp={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchEnd={onPointerUp}
      >
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.img
            key={curr?.id ?? index}
            src={imageSrc}
            alt={headline}
            className="absolute inset-0 h-full w-full object-cover "
            custom={direction}
            initial={reduceMotion ? false : "enter"}
            animate={reduceMotion ? { opacity: 1 } : "center"}
            exit={reduceMotion ? { opacity: 0 } : "exit"}
            variants={variants}
            transition={{ type: "spring", stiffness: 260, damping: 30, opacity: { duration: 0.5 } }}
            onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
          />
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_30%,rgba(59,130,246,0.10),transparent_60%)]" />

        {/* Category + source */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          {category && <Badge className="bg-blue-600/90 text-white">{category}</Badge>}
          {source && <Badge variant="secondary" className="bg-slate-900/80 text-slate-200 border-slate-700">{source}</Badge>}
        </div>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button size="icon" className="text-white h-9 w-9 bg-slate-900/70 border-slate-700" onClick={prev}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button size="icon" className="text-white h-9 w-9 bg-slate-900/70 border-slate-700" onClick={next}>
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="text-white h-9 w-9 bg-slate-900/70 border-slate-700"
                onClick={() => setPaused((p) => !p)}
              >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {safeItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    prevIndex.current = index;
                    dirRef.current = i > index ? 1 : -1;
                    setIndex(i);
                    setProgress(0);
                  }}
                  className={`h-2.5 w-2.5 rounded-full border transition-all ${
                    i === index
                      ? "scale-110 bg-white border-white"
                      : "bg-white/30 border-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
          <Progress value={progress} className="h-1.5 bg-slate-800/70" />
        </div>
      </div>

      {/* Text content */}
      <CardContent className="grid gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2 text-slate-400">
          {when && <span className="text-xs tracking-wide uppercase">{when}</span>}
          <Dot className="h-4 w-4 opacity-50" />
          {source && <span className="text-xs tracking-wide uppercase">{source}</span>}
        </div>
        <h3 className="text-xl font-semibold leading-snug text-slate-50 md:text-2xl">{headline}</h3>
        {summary && <p className="line-clamp-3 text-sm leading-relaxed text-slate-300 md:line-clamp-4">{summary}</p>}
        <div className="mt-2 flex items-center gap-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-500">
            <a href={href} target="_blank" rel="noreferrer noopener">
              Read full story
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Example usage:
// <NewsSlideshow items={newsArrayFromAPI} autoplayMs={7000} />
