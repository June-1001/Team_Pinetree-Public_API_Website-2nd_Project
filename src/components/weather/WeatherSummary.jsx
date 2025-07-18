import React from "react";
import { useWeatherData } from "../../hooks/useWeatherData";

export default function WeatherSummary({ lat, lon }) {
  const { weatherData, loading } = useWeatherData(lat, lon);

  if (loading)
    return (
      <div className="weather-summary">
        <p>날씨 정보를 불러오는 중...</p>
      </div>
    );

  const noData =
    !weatherData ||
    Object.keys(weatherData).length === 0 ||
    ["T1H", "RN1", "WSD", "REH"].some(
      (key) => weatherData[key] === -999 || weatherData[key] === undefined || weatherData[key] === null
    );


  return (
    <div className="weather-summary">
      <h4>현재 날씨 상황</h4>
      <ul style={{ listStyle: "none", marginTop: 0 }}>
        {noData ? (
          <li>정보 없음</li>
        ) : (
          <>
            <li>🌡️ 온도: {weatherData.T1H}℃</li>
            <li>🌧️ 강수량: {weatherData.RN1}mm</li>
            <li>💨 풍속: {weatherData.WSD}m/s</li>
            <li>🌫️ 습도: {weatherData.REH}%</li>
          </>
        )}
      </ul>
    </div>
  );
}
