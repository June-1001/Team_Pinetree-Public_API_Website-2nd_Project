import React from "react";

export default function WeatherSummary({ weatherData }) {
  if (!weatherData || Object.keys(weatherData).length === 0) {
    return <p>지역을 선택해주세요</p>;
  }
  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>🌡️ 온도: {weatherData.T1H}℃</li>
        <li>🌧️ 강수량: {weatherData.RN1}mm</li>
        <li>💨 풍속: {weatherData.WSD}m/s</li>
        <li>🌫️ 습도: {weatherData.REH}%</li>
      </ul>
    </div>
  );
}
