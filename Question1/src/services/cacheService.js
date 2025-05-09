const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 30 });

const CACHE_KEYS = {
  STOCKS: "stocks",
  STOCK_PRICE: (ticker) => `stock_price_${ticker}`,
  STOCK_HISTORY: (ticker, minutes) => `stock_history_${ticker}_${minutes}`,
  CORRELATION: (ticker1, ticker2, minutes) =>
    `correlation_${ticker1}_${ticker2}_${minutes}`,
};

const getFromCache = (key) => {
  return cache.get(key);
};
const setInCache = (key, data) => {
  cache.set(key, data);
};

const hasInCache = (key) => {
  return cache.has(key);
};

module.exports = {
  CACHE_KEYS,
  getFromCache,
  setInCache,
  hasInCache,
};
