import React from "react";

const CompanyProfile = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-800 rounded-lg shadow-lg scale-90">
      <div className="flex flex-col items-center text-white">
        {/* Company Logo and Name */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <img
            className="w-12 h-12 rounded-full"
            src="/Images/suzlon-logo.png" // Suzlon logo
            alt="Suzlon Logo"
          />
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Suzlon Energy Ltd.</h2>
            <p className="text-sm text-gray-400">BSE: SUZLON</p>
          </div>
        </div>

        {/* Stock Data */}
        <div className="w-full mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Stock Price */}
            <div className="p-3 bg-gray-700 rounded-lg text-center">
              <h3 className="text-lg font-medium">Stock Price</h3>
              <p className="text-xl text-green-400">₹ 12.45</p>
            </div>

            {/* Market Capitalization */}
            <div className="p-3 bg-gray-700 rounded-lg text-center">
              <h3 className="text-lg font-medium">Market Cap</h3>
              <p className="text-xl text-yellow-400">₹ 15,534 Cr</p>
            </div>

            {/* P/E Ratio */}
            <div className="p-3 bg-gray-700 rounded-lg text-center">
              <h3 className="text-lg font-medium">P/E Ratio</h3>
              <p className="text-xl text-blue-400">N/A</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-center text-gray-400 mb-4">
          <p className="text-sm">
            Suzlon Energy Ltd. is a global renewable energy solutions provider, primarily engaged in the design, development, and installation of wind turbine generators. It is one of the largest wind turbine manufacturers in India.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4">
          <a
            href="https://www.tradingview.com/"
            className="text-blue-400 hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Track all markets on TradingView
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
