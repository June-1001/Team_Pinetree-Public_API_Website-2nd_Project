import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import reportWebVitals from "./reportWebVitals";

import MainPage from "./component/Main";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <div>
    <MainPage />
  </div>
);

reportWebVitals();
