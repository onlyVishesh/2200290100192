const axios = require("axios");

const api = axios.create({
  baseURL:
    process.env.API_BASE_URL || "http://20.244.56.144/evaluation-service",
  headers: {
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

const getStocks = async () => {
  try {
    const response = await api.get("/stocks");
    return response.data;
  } catch (error) {
    console.error("Error fetching stocks:", error.message);
    throw error;
  }
};

const getStockPrice = async (ticker) => {
  try {
    const response = await api.get(`/stocks/${ticker}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock price for ${ticker}:`, error.message);
    throw error;
  }
};

const getStockPriceHistory = async (ticker, minutes) => {
  try {
    const response = await api.get(`/stocks/${ticker}?minutes=${minutes}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching stock price history for ${ticker}:`,
      error.message
    );
    throw error;
  }
};

module.exports = {
  getStocks,
  getStockPrice,
  getStockPriceHistory,
};
