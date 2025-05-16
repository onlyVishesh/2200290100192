const express = require("express");
const router = express.Router();
const stockService = require("../services/stockService");
const apiService = require("../services/apiService");
const cacheService = require("../services/cacheService");
const { CACHE_KEYS } = cacheService;

router.get("/stocks", async (req, res) => {
  try {
    const cacheKey = CACHE_KEYS.STOCKS;

    let stocks;
    if (cacheService.hasInCache(cacheKey)) {
      stocks = cacheService.getFromCache(cacheKey);
    } else {
      stocks = await apiService.getStocks();
      cacheService.setInCache(cacheKey, stocks);
    }

    res.json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Failed to fetch stocks" });
  }
});

router.get("/stocks/:ticker", async (req, res) => {
  try {
    const { ticker } = req.params;
    const { minutes = 60, aggregation } = req.query;

    if (aggregation === "average") {
      const result = await stockService.getAverageStockPrice(ticker, minutes);
      res.json(result);
    } else {
     
      const cacheKey = CACHE_KEYS.STOCK_HISTORY(ticker, minutes);

      let priceHistory;
      if (cacheService.hasInCache(cacheKey)) {
        priceHistory = cacheService.getFromCache(cacheKey);
      } else {
        priceHistory = await apiService.getStockPriceHistory(ticker, minutes);
        cacheService.setInCache(cacheKey, priceHistory);
      }

      res.json(priceHistory);
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

router.get("/stockcorrelation", async (req, res) => {
  try {
    const { minutes = 60 } = req.query;
    const tickers = req.query.ticker;

    if (!tickers || !Array.isArray(tickers) || tickers.length !== 2) {
      return res.status(400).json({
        error:
          "Exactly two tickers must be provided using ticker query parameter",
      });
    }

    const [ticker1, ticker2] = tickers;
    const result = await stockService.getStockCorrelation(
      ticker1,
      ticker2,
      minutes
    );

    res.json(result);
  } catch (error) {
    console.error("Error calculating correlation:", error);
    res.status(500).json({ error: "Failed to calculate correlation" });
  }
});

module.exports = router;
