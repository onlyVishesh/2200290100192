import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getStockData, getStocks, StockData, StockMap } from "../services/api";

const StockPage: React.FC = () => {
  const [stocks, setStocks] = useState<StockMap>({});
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [timeInterval, setTimeInterval] = useState<number>(60);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stocksData = await getStocks();
        setStocks(stocksData);
        const firstTicker = Object.values(stocksData)[0];
        if (firstTicker) {
          setSelectedStock(firstTicker);
        }
      } catch (err) {
        setError("Failed to fetch stocks");
        console.error("Error fetching stocks:", err);
      }
    };

    fetchStocks();
  }, []);

  
  useEffect(() => {
    if (selectedStock) {
      fetchStockData();
    }
  }, [selectedStock, timeInterval]);

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getStockData(selectedStock, timeInterval);
      setStockData(data);
    } catch (err) {
      setError("Failed to fetch stock data");
      console.error("Error fetching stock data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (event: SelectChangeEvent) => {
    setSelectedStock(event.target.value);
  };

  const handleTimeIntervalChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setTimeInterval(newValue as number);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStockNameByTicker = (ticker: string): string => {
    for (const [name, value] of Object.entries(stocks)) {
      if (value === ticker) {
        return name;
      }
    }
    return ticker;
  };

  const formatChartData = (priceHistory: any[] | undefined) => {
    if (!priceHistory) return [];

    return priceHistory.map((item) => ({
      ...item,
      formattedDate: formatDate(item.lastUpdatedAt),
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, border: "1px solid #ccc" }}>
          <Typography variant="body2">Time: {label}</Typography>
          <Typography variant="body2" color="primary">
            Price: ${payload[0].value.toFixed(2)}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stock Price Chart
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="stock-select-label">Stock</InputLabel>
          <Select
            labelId="stock-select-label"
            id="stock-select"
            value={selectedStock}
            label="Stock"
            onChange={handleStockChange}
          >
            {Object.entries(stocks).map(([name, ticker]) => (
              <MenuItem key={ticker} value={ticker}>
                {name} ({ticker})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mb: 2 }}>
          <Typography id="time-interval-slider" gutterBottom>
            Time Interval (minutes): {timeInterval}
          </Typography>
          <Slider
            value={timeInterval}
            onChange={handleTimeIntervalChange}
            aria-labelledby="time-interval-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={10}
            max={120}
          />
        </Box>

        {stockData && (
          <Typography variant="h6" gutterBottom>
            Average Price: ${stockData.averageStockPrice.toFixed(2)}
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 2, height: 400 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : stockData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formatChartData(stockData.priceHistory)}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="formattedDate"
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={stockData.averageStockPrice}
                label="Average"
                stroke="red"
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                name={getStockNameByTicker(selectedStock)}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography>Select a stock to view data</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default StockPage;
