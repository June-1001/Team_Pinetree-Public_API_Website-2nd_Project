import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import GetData from "./API/getData";

import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GetData item="cultural" />
    <GetData item="health" />
    <GetData item="weather" />
  </React.StrictMode>
);

reportWebVitals();
