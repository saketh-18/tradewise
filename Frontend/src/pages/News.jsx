import {useState, useEffect} from 'react';
import { API_URL } from '../config';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/news`); // Your backend route that fetches Guardian API
        const data = await res.json();
        setNews(data || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };
    fetchNews();
  }, []);

  return (
  <>
    <Navbar />

    {/* Banner Section */}
    <div className="relative h-screen w-full bg-fixed banner-1-news flex items-center justify-center">
      <div className="w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-transparent flex flex-col justify-center items-end text-center px-4">
        <p className="text-white banner-1-sub animation-1 text-7xl">
          Market Insights
        </p>
        <p className="text-xl sm:text-2xl text-white hero-line banner-1-main animation-1 mt-2">
          Stay ahead of the curve with real-time news.
        </p>
      </div>
    </div>

    {/* News Content */}
    <div className="px-6 md:px-16 py-16 bg-zinc-950 min-h-screen text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* News feed */}
        <div className="lg:col-span-2 space-y-6">
          {news &&
            news.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 rounded-2xl p-6 shadow hover:shadow-lg transition"
              >
                {/* Section + Date */}
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-3 py-1 text-sm rounded-full bg-blue-600/20 text-blue-400">
                    {item.sectionName}
                  </span>
                  <p className="text-xs text-gray-400">
                    {new Date(item.webPublicationDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold mb-2">{item.webTitle}</h2>

                {/* Button */}
                <a
                  href={item.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Read More →
                </a>
              </div>
            ))}

          {/* Load more button */}
          <div className="text-center">
            <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium">
              Load More
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Categories */}
          <div className="bg-zinc-900 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-blue-400 cursor-pointer">All Markets</li>
              <li className="hover:text-blue-400 cursor-pointer">Business</li>
              <li className="hover:text-blue-400 cursor-pointer">Economy</li>
              <li className="hover:text-blue-400 cursor-pointer">Cryptocurrency</li>
              <li className="hover:text-blue-400 cursor-pointer">Forex</li>
            </ul>
          </div>

          {/* Trending */}
          <div className="bg-zinc-900 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Trending</h3>
            <ol className="space-y-3 list-decimal list-inside text-gray-300">
              <li className="hover:text-blue-400 cursor-pointer">
                Tech Stocks Rally on Positive Earnings
              </li>
              <li className="hover:text-blue-400 cursor-pointer">
                Impact of Global Supply Chain Disruptions
              </li>
              <li className="hover:text-blue-400 cursor-pointer">
                The Rise of Sustainable Investing
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  </>
);
}


