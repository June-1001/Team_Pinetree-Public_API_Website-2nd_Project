import React from "react";
import { useWeatherData } from "../../hooks/useWeatherData";


export default function WeatherSummary({ lat, lon }) {

  const {weatherData, loading} = useWeatherData(lat, lon);

  if(loading) return <p>날씨 정보를 불러오는 중...</p>

  if (!weatherData || Object.keys(weatherData).length === 0) {
    return <p>지역을 선택해주세요</p>;
  }
  return (
    <div className="weather-summary">
      <h4>현재 날씨 상황</h4>
      <ul style={{ listStyle: "none", marginTop: 0 }}>
        <li>
          <div style={{ width: 17 }}>🌡️</div> <div>온도: {weatherData.T1H}℃</div>
        </li>
        <li>
          <div style={{ width: 17 }}>🌧️</div> <div>강수량: {weatherData.RN1}mm</div>
        </li>
        <li>
          <div style={{ width: 17 }}>💨</div> <div>풍속: {weatherData.WSD}m/s</div>
        </li>
        <li>
          <div style={{ width: 17 }}>🌫️</div> <div>습도: {weatherData.REH}%</div>
        </li>
      </ul>
    </div>
  );
}  