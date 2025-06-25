import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { GetRequestUrl } from "./key/urlKey";

import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<React.StrictMode></React.StrictMode>);

console.log(GetRequestUrl("cultural"));
console.log(GetRequestUrl("health"));
console.log(GetRequestUrl("weather"));

reportWebVitals();
