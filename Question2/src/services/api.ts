import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

export interface StockPrice {
  price: number;
  lastUpdatedAt: string;
}

export interface StockData {
  averageStockPrice: number;
  priceHistory: StockPrice[];
}

export interface CorrelationData {
  correlation: number;
  stocks: {
    [ticker: string]: {
      averagePrice: number;
      priceHistory: StockPrice[];
    };
  };
}

export interface StockMap {
  [name: string]: string;
}

export const getStocks = async (): Promise<StockMap> => {
  const response = await axios.get(`${API_BASE_URL}/stocks`);
  return response.data.stocks;
};

export const getStockData = async (
  ticker: string,
  minutes: number
): Promise<StockData> => {
  const response = await axios.get(
    `${API_BASE_URL}/stocks/${ticker}?minutes=${minutes}&aggregation=average`
  );
  return response.data;
};

export const getStockCorrelation = async (
  ticker1: string,
  ticker2: string,
  minutes: number
): Promise<CorrelationData> => {
  const response = await axios.get(
    `${API_BASE_URL}/stockcorrelation?minutes=${minutes}&ticker=${ticker1}&ticker=${ticker2}`
  );
  return response.data;
};

export const getAllCorrelations = async (
  tickers: string[],
  minutes: number
): Promise<{ [key: string]: { [key: string]: number } }> => {
  const correlations: { [key: string]: { [key: string]: number } } = {};
  tickers.forEach((ticker) => {
    correlations[ticker] = {};
    tickers.forEach((otherTicker) => {
      correlations[ticker][otherTicker] = ticker === otherTicker ? 1 : 0;
    });
  });

  for (let i = 0; i < tickers.length; i++) {
    for (let j = i + 1; j < tickers.length; j++) {
      try {
        const data = await getStockCorrelation(tickers[i], tickers[j], minutes);
        correlations[tickers[i]][tickers[j]] = data.correlation;
        correlations[tickers[j]][tickers[i]] = data.correlation;
      } catch (error) {
        console.error(
          `Error calculating correlation between ${tickers[i]} and ${tickers[j]}:`,
          error
        );
      }
    }
  }

  return correlations;
};
