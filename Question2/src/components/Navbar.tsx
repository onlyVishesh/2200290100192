import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

// Simple navbar with basic styling
const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Stock Price Aggregator
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Stock Chart
          </Button>
          <Button color="inherit" component={RouterLink} to="/correlation">
            Correlation
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
