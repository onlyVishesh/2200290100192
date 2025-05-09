const apiService = require("./apiService");
const cacheService = require("./cacheService");
const { CACHE_KEYS } = cacheService;

const calculateAverage = (priceHistory) => {
  if (!priceHistory || priceHistory.length === 0) {
    return 0;
  }

  const sum = priceHistory.reduce((acc, item) => acc + item.price, 0);
  return sum / priceHistory.length;
};

const calculateStandardDeviation = (priceHistory, average) => {
  if (!priceHistory || priceHistory.length <= 1) {
    return 0;
  }

  const squaredDifferences = priceHistory.map((item) =>
    Math.pow(item.price - average, 2)
  );

  const sumOfSquaredDifferences = squaredDifferences.reduce(
    (acc, val) => acc + val,
    0
  );
  return Math.sqrt(sumOfSquaredDifferences / (priceHistory.length - 1));
};

const calculateCovariance = (stockA, stockB, avgA, avgB) => {
  const stockBMap = new Map();
  stockB.forEach((item) => {
    stockBMap.set(new Date(item.lastUpdatedAt).getTime(), item.price);
  });

  const matchingPairs = [];

  stockA.forEach((itemA) => {
    const timestampA = new Date(itemA.lastUpdatedAt).getTime();

    let closestTimestamp = null;
    let minDiff = Infinity;

    stockB.forEach((itemB) => {
      const timestampB = new Date(itemB.lastUpdatedAt).getTime();
      const diff = Math.abs(timestampA - timestampB);

      if (diff < minDiff && diff <= 60000) {
        minDiff = diff;
        closestTimestamp = timestampB;
      }
    });

    if (closestTimestamp !== null) {
      matchingPairs.push({
        priceA: itemA.price,
        priceB: stockBMap.get(closestTimestamp),
      });
    }
  });

  if (matchingPairs.length <= 1) {
    return 0; 
  }

  const sumOfProducts = matchingPairs.reduce(
    (acc, pair) => acc + (pair.priceA - avgA) * (pair.priceB - avgB),
    0
  );

  return sumOfProducts / (matchingPairs.length - 1);
};

const calculateCorrelation = (stockA, stockB) => {
  if (!stockA || !stockB || stockA.length <= 1 || stockB.length <= 1) {
    return 0;
  }

  const avgA = calculateAverage(stockA);
  const avgB = calculateAverage(stockB);

  const stdDevA = calculateStandardDeviation(stockA, avgA);
  const stdDevB = calculateStandardDeviation(stockB, avgB);

  if (stdDevA === 0 || stdDevB === 0) {
    return 0; 
  }

  const covariance = calculateCovariance(stockA, stockB, avgA, avgB);
  return covariance / (stdDevA * stdDevB);
};

const getAverageStockPrice = async (ticker, minutes) => {
  const cacheKey = CACHE_KEYS.STOCK_HISTORY(ticker, minutes);

  let priceHistory;
  if (cacheService.hasInCache(cacheKey)) {
    priceHistory = cacheService.getFromCache(cacheKey);
  } else {
    priceHistory = await apiService.getStockPriceHistory(ticker, minutes);
    cacheService.setInCache(cacheKey, priceHistory);
  }

  const averagePrice = calculateAverage(priceHistory);

  return {
    averageStockPrice: averagePrice,
    priceHistory,
  };
};

const getStockCorrelation = async (ticker1, ticker2, minutes) => {
  const cacheKey = CACHE_KEYS.CORRELATION(ticker1, ticker2, minutes);

  if (cacheService.hasInCache(cacheKey)) {
    return cacheService.getFromCache(cacheKey);
  }

  const stock1Data = await getAverageStockPrice(ticker1, minutes);
  const stock2Data = await getAverageStockPrice(ticker2, minutes);

  const correlation = calculateCorrelation(
    stock1Data.priceHistory,
    stock2Data.priceHistory
  );

  const result = {
    correlation: parseFloat(correlation.toFixed(4)),
    stocks: {
      [ticker1]: {
        averagePrice: stock1Data.averageStockPrice,
        priceHistory: stock1Data.priceHistory,
      },
      [ticker2]: {
        averagePrice: stock2Data.averageStockPrice,
        priceHistory: stock2Data.priceHistory,
      },
    },
  };

  cacheService.setInCache(cacheKey, result);
  return result;
};

module.exports = {
  getAverageStockPrice,
  getStockCorrelation,
  calculateAverage,
  calculateStandardDeviation,
  calculateCorrelation,
};
