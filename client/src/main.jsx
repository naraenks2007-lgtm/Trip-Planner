import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { GeolocationProvider } from "./context/GeolocationContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <GeolocationProvider>
          <App />
        </GeolocationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
