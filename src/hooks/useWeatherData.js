import { useState, useEffect } from "react";
import { latlonToGrid } from "../utils/latlonToGrid";

const SERVICE_KEY = encodeURIComponent(
  "Fn8nBDNNZn0hIRp85JkxCQhQUBSuaxYLC11J5xocF5WqxiLpogKvhdaKPkfyX5nyYhp9VAJKgLVNWSJ/n/J+Cw=="
);

function getBaseDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - 40); // API 시간 기준 보정
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");

  const times = [2, 5, 8, 11, 14, 17, 20, 23];
  let baseTime = "0200";
  for (let t of times) {
    if (Number(hh) >= t) baseTime = String(t).padStart(2, "0") + "00";
  }

  return { baseDate: `${yyyy}${mm}${dd}`, baseTime };
}

export function useWeatherData(lat, lon) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat == null || lon == null) return;

    async function fetchData() {
      setLoading(true);
      const { baseDate, baseTime } = getBaseDateTime();
      const { x: nx, y: ny } = latlonToGrid(lat, lon);

      try {
        const url1 = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${SERVICE_KEY}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}&dataType=JSON`;
        const res1 = await fetch(url1);
        const json1 = await res1.json();

        const ultra = {};
        json1.response.body.items.item.forEach(i => {
          ultra[i.category] = isNaN(i.obsrValue) ? i.obsrValue : Number(i.obsrValue);
        });
        setWeatherData(ultra);

        const url2 = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${SERVICE_KEY}&numOfRows=1500&pageNo=1&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}&dataType=JSON`;
        const res2 = await fetch(url2);
        const json2 = await res2.json();

        const grouped = {};
        json2.response.body.items.item.forEach(({ fcstDate, fcstTime, category, fcstValue }) => {
          const key = fcstDate + fcstTime;
          if (!grouped[key]) {
            grouped[key] = { fcstDate, fcstTime, categories: {} };
          }
          grouped[key].categories[category] = isNaN(fcstValue) ? fcstValue : Number(fcstValue);
        });

        setForecast(grouped);
      } catch (error) {
        console.error("기상청 API 실패", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [lat, lon]);

  return { weatherData, forecast, loading };
}
