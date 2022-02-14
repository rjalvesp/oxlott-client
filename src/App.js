import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { BaseRoutes } from "./App.routes";
import "App.scss";
import { createTheme, ThemeProvider } from "@mui/material";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <Router>
          <Routes>
            {BaseRoutes.map((route, index) => (
              <Route key={`main-router-${index}`} {...route} />
            ))}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
