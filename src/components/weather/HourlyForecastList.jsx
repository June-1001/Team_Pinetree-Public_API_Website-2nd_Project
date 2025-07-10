import React from "react";
import { getSkyLabel, getPtyLabel } from "../../utils/weatherUtils";

export default function HourlyForecastList({ selectedForecastDate, filteredForecast }) {
  if (!filteredForecast || filteredForecast.length === 0) return null;

  const formattedDate = new Date(
    selectedForecastDate.slice(0, 4),
    parseInt(selectedForecastDate.slice(4, 6)) - 1,
    selectedForecastDate.slice(6)
  ).toLocaleDateString("ko-KR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  console.log("Filtered Forecast", filteredForecast);

  return (
    <div style={{ marginTop: 20 }}>
      <h4 style={{ marginBottom: 6 }}>{formattedDate} 시간별 예보</h4>
      <div style={{ display: "flex", overflowX: "auto", gap: 16 }}>
        {filteredForecast.map((item) => (
          <div
            key={item.fcstTime + item.fcstDate}
            style={{
              minWidth: 120,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 6,
            }}
          >
            <div>{item.fcstTime.slice(0, 2)}시</div>
            <div>🌡️온도: {item.categories.TMP}℃</div>
            <div>☔강수확률: {item.categories.POP || "0"}%</div>
            <div>{getSkyLabel(item.categories.SKY)}</div>
            <div>🌧️ 강수: {getPtyLabel(item.categories.PTY)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
