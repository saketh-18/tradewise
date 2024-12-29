// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';

function TradingViewChart() {
  const container = useRef();

  useEffect(
    () => {
        container.current.innerHTML = "";
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbols": [
            [
              "BSE:SENSEX"
            ]
          ],
          "chartOnly": false,
          "width": "80%",
          "height": "80%",
          "locale": "en",
          "colorTheme": "dark",
          "autosize": true,
          "showVolume": false,
          "showMA": false,
          "hideDateRanges": false,
          "hideMarketStatus": false,
          "hideSymbolLogo": false,
          "scalePosition": "right",
          "scaleMode": "Normal",
          "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
          "fontSize": "10",
          "noTimeScale": false,
          "valuesTracking": "1",
          "changeMode": "price-and-percent",
          "chartType": "area",
          "maLineColor": "#2962FF",
          "maLineWidth": 1,
          "maLength": 9,
          "headerFontSize": "medium",
          "backgroundColor": "rgba(255, 255, 255, 0)",
          "lineWidth": 2,
          "lineType": 0,
          "dateRanges": [
            "1d|1",
            "1m|30",
            "3m|60",
            "12m|1D",
            "60m|1W",
            "all|1M"
          ]
        }`;
      container.current.appendChild(script);
    },
    []
  );

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
    </div>
  );
}

export default memo(TradingViewChart);


// import { createChart, ColorType } from 'lightweight-charts';
// import React, { useEffect, useRef } from 'react';

// export const ChartComponent = props => {
//     const {
//         data,
//         colors: {
//             backgroundColor = 'white',
//             lineColor = '#2962FF',
//             textColor = 'black',
//             areaTopColor = '#2962FF',
//             areaBottomColor = 'rgba(41, 98, 255, 0.28)',
//         } = {},
//     } = props;

//     const chartContainerRef = useRef();

//     useEffect(
//         () => {
//             const handleResize = () => {
//                 chart.applyOptions({ width: chartContainerRef.current.clientWidth });
//             };

//             const chart = createChart(chartContainerRef.current, {
//                 layout: {
//                     background: { type: ColorType.Solid, color: backgroundColor },
//                     textColor,
//                 },
//                 width: chartContainerRef.current.clientWidth,
//                 height: 300,
//             });
//             chart.timeScale().fitContent();

//             const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
//             newSeries.setData(data);

//             window.addEventListener('resize', handleResize);

//             return () => {
//                 window.removeEventListener('resize', handleResize);

//                 chart.remove();
//             };
//         },
//         [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
//     );

//     return (
//         <div
//             ref={chartContainerRef}
//         />
//     );
// };

// const initialData = [
//     { time: '2018-12-22', value: 32.51 },
//     { time: '2018-12-23', value: 31.11 },
//     { time: '2018-12-24', value: 27.02 },
//     { time: '2018-12-25', value: 27.32 },
//     { time: '2018-12-26', value: 25.17 },
//     { time: '2018-12-27', value: 28.89 },
//     { time: '2018-12-28', value: 25.46 },
//     { time: '2018-12-29', value: 23.92 },
//     { time: '2018-12-30', value: 22.68 },
//     { time: '2018-12-31', value: 22.67 },
// ];

// export function TradingViewChart(props) {
//     return (
//         <ChartComponent {...props} data={initialData}></ChartComponent>
//     );
// }