# 2200290100192

Stock price aggregation project completed in 1 hour.

## Structure

- **Question1**: Backend API (Express + Node)
- **Question2**: Frontend (React + TypeScript)

## Quick Setup

### Backend

```
cd Question1
npm install
# Create .env file:
# PORT=3001
# API_BASE_URL=http://20.244.56.144/evaluation-service
# ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# CLIENT_ID=5662d827-262b-4846-8453-caac566a906c
# CLIENT_SECRET=suZCnPtfnhkEGEKu
npm start
```

### Frontend

```
cd Question2
npm install
# Create .env file:
# REACT_APP_API_URL=http://localhost:3001
# PORT=3000
npm start
```

## Notes

- Basic UI due to time constraints
- Limited error handling
- Token might expire, regenerate if needed

## Project Structure

The repository is organized into two main folders:

1. **Question1**: Backend microservice for stock price aggregation

   - Node.js/Express API with caching mechanism
   - Endpoints for average stock price and correlation calculation

2. **Question2**: Frontend web application for stock price visualization
   - React with TypeScript
   - Material UI components
   - Stock price chart and correlation heatmap

## API Endpoints

### Backend API

- **GET /stocks/:ticker?minutes=m&aggregation=average**: Get average stock price for a ticker over the last m minutes
- **GET /stockcorrelation?minutes=m&ticker={TICKER1}&ticker={TICKER2}**: Get correlation between two stocks over the last m minutes

## Implementation Notes

- The backend uses a caching mechanism to reduce API calls to the stock exchange
- Correlation is calculated using Pearson's correlation coefficient
- The frontend is responsive and works on both mobile and desktop
- Due to time constraints, error handling is minimal
- The project was completed within the 3-hour time limit

## Frontend Pages

- **Stock Chart**: View stock prices over time with average price highlighted
- **Correlation Heatmap**: View correlations between different stocks with color-coded visualization
