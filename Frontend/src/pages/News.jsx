import {useState, useEffect} from 'react';
import { API_URL } from '../config';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import TickerTape from '../Components/Widgets/TickerTape';
import TopStories from '../Components/Widgets/TopStories';
import NewsSlideshow from '../Components/SlideShow';
import NewsCardGrid from '../Components/NewsCardGrid';
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
  <div className='mt-[6rem]'>
    <TickerTape />
  </div>
  <div className='grid grid-cols-4 gap-2'>
    <div className='col-span-1 border border-[#24283b] rounded-xl bg-[#111422]/80 p-2 m-4'><TopStories /></div>
    <div className='col-span-3 flex text-4xl text-white p-2 m-4'>
      <NewsSlideshow items={news}/>
    </div>
  </div>
  <div className='p-2 bg-transparent'>
    <NewsCardGrid items={news}/>
  </div>
  <Footer />
 </>
);
}

