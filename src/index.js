import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import KakaoMapAddressSearch from "./component/kakaoMap";

import reportWebVitals from "./reportWebVitals";
import DataTest from "./API/testURL";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <div>
    <DataTest item="hiking" />
    <KakaoMapAddressSearch />
  </div>
);

reportWebVitals();
