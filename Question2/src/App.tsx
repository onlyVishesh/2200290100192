import { CssBaseline } from "@mui/material";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import CorrelationPage from "./pages/CorrelationPage";
import StockPage from "./pages/StockPage";

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<StockPage />} />
          <Route path="/correlation" element={<CorrelationPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
