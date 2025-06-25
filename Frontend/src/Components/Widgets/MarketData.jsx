import React, { useEffect } from 'react';

const TradingViewWidget = () => {
  useEffect(() => {
    // Check if the script is already added to avoid duplication
    if (!document.querySelector('#tradingview-widget-script')) {
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script'; // Unique ID for the script
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        width: '100%',
        height: '100%',
        symbolsGroups: [
          {
            name: 'Indices',
            originalName: 'Indices',
            symbols: [
              { name: 'FOREXCOM:SPXUSD', displayName: 'S&P 500 Index' },
              { name: 'FOREXCOM:NSXUSD', displayName: 'US 100 Cash CFD' },
              { name: 'FOREXCOM:DJI', displayName: 'Dow Jones Industrial Average Index' },
              { name: 'INDEX:NKY', displayName: 'Japan 225' },
              { name: 'INDEX:DEU40', displayName: 'DAX Index' },
              { name: 'FOREXCOM:UKXGBP', displayName: 'FTSE 100 Index' },
              { name: 'MARKETSCOM:BITCOIN', displayName: 'Bitcoin' },
            ],
          },
          {
            name: 'Futures',
            originalName: 'Futures',
            symbols: [
              { name: 'CME_MINI:ES1!', displayName: 'S&P 500' },
              { name: 'CME:6E1!', displayName: 'Euro' },
              { name: 'COMEX:GC1!', displayName: 'Gold' },
              { name: 'NYMEX:CL1!', displayName: 'WTI Crude Oil' },
              { name: 'NYMEX:NG1!', displayName: 'Gas' },
              { name: 'CBOT:ZC1!', displayName: 'Corn' },
            ],
          },
          {
            name: 'Forex',
            originalName: 'Forex',
            symbols: [
              { name: 'FX:EURUSD', displayName: 'EUR to USD' },
              { name: 'FX:GBPUSD', displayName: 'GBP to USD' },
              { name: 'FX:USDJPY', displayName: 'USD to JPY' },
              { name: 'FX:USDCHF', displayName: 'USD to CHF' },
              { name: 'FX:AUDUSD', displayName: 'AUD to USD' },
              { name: 'FX:USDCAD', displayName: 'USD to CAD' },
            ],
          },
        ],
        showSymbolLogo: true,
        isTransparent: true,
        colorTheme: 'dark',
        locale: 'en',
      });
      document.querySelector('.tradingview-widget-container').appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
      
    </div>
  );
};

export default TradingViewWidget;
