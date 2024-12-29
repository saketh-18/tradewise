import React from "react";
import Navbar from "../Components/Navbar";
import MarketData from "../Components/Widgets/MarketData";
import HeatMapWidget from "../Components/Widgets/HeatMap";
import MarketOverviewWidget from "../Components/Widgets/MarketOverview";
import SymbolInfo from "../Components/Widgets/SymbolInfo";
import TechnicalAnalysis from "../Components/Widgets/TechnicalAnalysis";
import TradingViewFinancialsWidget from "../Components/Widgets/FundamentalAnalysis";
import SymbolOverview from "../Components/Widgets/SymbolOverview";
import CryptoList from "../Components/Widgets/CryptoList";
import Footer from "../Components/Footer";


export default function LandingPage() {
  return (
    <>
      <Navbar />
      {/* Banner 1*/}
      <div className="flex h-screen w-full relative bg-fixed banner-1 -z-40">
        <div className="w-full z-9 bg-gradient-to-b from-zinc-900 to-transparent flex flex-col justify-center items-center">
          <p className="text-white banner-1-sub animation-1">
            India's no1 paper trading platform.{" "}
          </p>
          <p className="text-4xl sm:text-7xl text-white hero-line banner-1-main animation-1">
            Test before you Invest.
          </p>
          <button className="bg-white rounded-lg py-2 px-5 mt-5 text-lg font-semibold animation-1">
            Get Started
          </button>
        </div>
      </div>
      {/* Banner 2 */}
      {/* <div className='flex relative h-screen bg-gradient-to-r from-gray-900 to-black '>
        <div className='w-full relative top-20 h-5/6 flex flex-col justify-center items-center'>
        <p className='text-4xl mb-8 font-semibold  text-white'>Stay Ahead with real time market data</p>
         <TradingViewChart/>
        </div>
      </div> */}
      {/* banner 3 */}
      <div className="h-screen w-full bg-gradient-to-r from-gray-900 to-black  flex flex-col justify-center items-center">
        <p className="md:text-3xl  text-white text-2xl sm:mb-0 mb-9">
          Analyze all markets at one place
        </p>
        <div className="widget-container sm:h-4/6 sm:w-5/6 sm:mt-5 h-4/6 w-full flex justify-center items-end">
          <MarketData />
        </div>
      </div>
      {/*Banner 4*/}
      <div className="w-full h-screen bg-gradient-to-r from-gray-900 to-black  flex flex-col justify-center items-center">
        <p className="text-2xl md:text-3xl text-white mb-4 mt-3">
          Track all Sectors
        </p>
        <div className="widget-container sm:h-4/6 sm:w-5/6 sm:mt-5 h-4/6 w-full flex justify-center items-end">
          <HeatMapWidget />
        </div>
      </div>
      {/*Banner 5*/}
      <div className="h-screen w-full bg-gradient-to-r from-gray-900 to-black  flex flex-col justify-center items-center">
        <p className="md:text-3xl text-white md:mt-20 mb-1 mt-5 text-2xl">
          All Indices at one place
        </p>
        <div className="widget-container sm:h-4/6 sm:w-5/6 sm:mt-5 h-4/6 w-full flex justify-center items-end">
          <MarketOverviewWidget />
        </div>
      </div>
      {/*Banner 6*/}
      <div className="bg-gradient-to-r from-gray-900 to-black w-full p-9 flex flex-col items-center">
        {/* Tagline */}
        <h2 className="text-xl sm:text-3xl text-white mb-6 font-semibold">
          Deep Dive into Stock Analysis
        </h2>

        {/* Grid of Widgets */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 sm:w-5/6 grid-outer">
          <div className="border border-gray-700 rounded-lg bg-gray-800 p-3 widget-container">
            <SymbolInfo />
          </div>
          <div className="border border-gray-700 rounded-lg bg-gray-800 p-3 widget-container technical-analysis-container">
            <TechnicalAnalysis />
          </div>
          <div className="border border-gray-700 rounded-lg bg-gray-800 p-3 widget-container">
            <TradingViewFinancialsWidget />
          </div>
          <div className="border border-gray-700 rounded-lg bg-gray-800 p-3 widget-container">
            <SymbolOverview />
          </div>
        </div>
      </div>
      {/* banner 7*/}
      <div className="h-screen w-full bg-gradient-to-r from-gray-900 to-black  flex flex-col justify-center items-center">
        <p className="md:text-3xl text-white md:mt-20 mb-1 mt-5 text-xl">
          Track your Favorite Cryptos in Real-Time
        </p>
        <div className="widget-container sm:h-4/6 sm:w-5/6 sm:mt-5 h-4/6 w-full flex justify-center items-end">
          <CryptoList />
        </div>
      </div>
      <Footer />
    </>
  );
}
