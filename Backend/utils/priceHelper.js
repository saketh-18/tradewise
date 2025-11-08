import { NseIndia } from "stock-nse-india";

const nse = new NseIndia();

/**
 * Helper function to extract symbol name from formats like "BSE:TCS" or "NSE:TCS"
 * @param {string} symbol - Symbol in format "BSE:TCS", "NSE:TCS", or "TCS"
 * @returns {string} - Clean symbol name like "TCS"
 */
function extractSymbolName(symbol) {
  if (!symbol) return symbol;
  // Remove BSE: or NSE: prefix if present
  const cleanSymbol = symbol.toUpperCase().replace(/^(BSE|NSE):/, "");
  return cleanSymbol;
}

/**
 * Get current price for an Indian stock using NSE India API
 * @param {string} symbol - Symbol in any format (BSE:TCS, NSE:TCS, or TCS)
 * @returns {Promise<number>} - Current price
 */
async function getIndianStockPrice(symbol) {
  try {
    const cleanSymbol = extractSymbolName(symbol);
    const details = await nse.getEquityDetails(cleanSymbol);
    
    if (details && details.priceInfo && details.priceInfo.lastPrice) {
      return details.priceInfo.lastPrice;
    }
    throw new Error("Price not found in response");
  } catch (error) {
    console.error(`Error fetching Indian price for ${symbol}:`, error.message);
    throw new Error(`Unable to fetch price for ${symbol}: ${error.message}`);
  }
}

export { getIndianStockPrice, extractSymbolName };

