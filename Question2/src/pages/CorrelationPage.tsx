import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllCorrelations, getStocks, StockMap } from "../services/api";

const CorrelationPage: React.FC = () => {
  const [stocks, setStocks] = useState<StockMap>({});
  const [correlations, setCorrelations] = useState<{
    [key: string]: { [key: string]: number };
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stocksData = await getStocks();

        const limitedStocks: StockMap = {};
        const entries = Object.entries(stocksData);
        for (let i = 0; i < Math.min(5, entries.length); i++) {
          const [name, ticker] = entries[i];
          limitedStocks[name] = ticker;
        }
        setStocks(limitedStocks);
      } catch (err) {
        setError("Failed to fetch stocks");
        console.error("Error fetching stocks:", err);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    if (Object.keys(stocks).length > 0) {
      fetchCorrelations();
    }
  }, [stocks]);

  const fetchCorrelations = async () => {
    setLoading(true);
    setError(null);

    try {
      const tickers = Object.values(stocks);
      const correlationsData = await getAllCorrelations(tickers, 60);
      setCorrelations(correlationsData);
    } catch (err) {
      setError("Failed to fetch correlations");
      console.error("Error fetching correlations:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.5) return "#0066ff"; 
    if (correlation > 0) return "#99ffff"; 
    if (correlation > -0.5) return "#ffcccc"; 
    return "#ff3333"; 
  };

  const renderHeatmap = () => {
    const tickers = Object.values(stocks);

    if (tickers.length === 0) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <Typography>No stocks available</Typography>
        </Box>
      );
    }

    const cellSize = 60;

    return (
      <Box sx={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ width: cellSize, height: cellSize }}></th>
              {tickers.map((ticker) => (
                <th
                  key={`col-${ticker}`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    padding: 8,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {ticker}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickers.map((rowTicker) => (
              <tr key={`row-${rowTicker}`}>
                <th
                  style={{
                    width: cellSize,
                    height: cellSize,
                    padding: 8,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {rowTicker}
                </th>
                {tickers.map((colTicker) => {
                  const correlation = correlations[rowTicker]?.[colTicker] || 0;
                  return (
                    <td
                      key={`cell-${rowTicker}-${colTicker}`}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: getCorrelationColor(correlation),
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                      title={`Correlation: ${correlation.toFixed(4)}`}
                    >
                      {correlation.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stock Correlation Heatmap
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Typography variant="body1" gutterBottom>
          Showing correlations for the last 60 minutes.
        </Typography>

        <Box sx={{ mt: 3 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            renderHeatmap()
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CorrelationPage;
