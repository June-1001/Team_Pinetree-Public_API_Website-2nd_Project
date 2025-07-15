import { useEffect, useState } from "react";
import { latlonToGrid } from "../utils/latlonToGrid";

const SERVICE_KEY = encodeURIComponent(
  "Fn8nBDNNZn0hIRp85JkxCQhQUBSuaxYLC11J5xocF5WqxiLpogKvhdaKPkfyX5nyYhp9VAJKgLVNWSJ/n/J+Cw=="
);

// 기상청 단기예보 발표 기준 시각 계산 (2,5,8,11,14,17,20,23시)
function getBaseDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - 40); // 40분 전으로 보정

  let yyyy = now.getFullYear();
  let mm = String(now.getMonth() + 1).padStart(2, "0");
  let dd = String(now.getDate()).padStart(2, "0");
  const hh = now.getHours();

  const times = [2, 5, 8, 11, 14, 17, 20, 23];
  let baseTime = "0200";
  let baseDate = `${yyyy}${mm}${dd}`;

  for (let i = 0; i < times.length; i++) {
    if (hh < times[i]) {
      const selectedHour = times[i - 1] ?? 23;
      baseTime = String(selectedHour).padStart(2, "0") + "00";

      // 00시 ~ 01시 사이면 전날 23시로
      if (selectedHour === 23 && hh < 2) {
        const prev = new Date(now);
        prev.setDate(now.getDate() - 1);
        yyyy = prev.getFullYear();
        mm = String(prev.getMonth() + 1).padStart(2, "0");
        dd = String(prev.getDate()).padStart(2, "0");
        baseDate = `${yyyy}${mm}${dd}`;
      }
      break;
    }
  }

  return { baseDate, baseTime };
}

export function useWeatherData(lat, lon) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat == null || lon == null) {
      console.log("위도, 경도 값이 없습니다.");
      return;
    }

    async function fetchData() {
      setLoading(true);

      const { baseDate, baseTime } = getBaseDateTime();
      const { x: nx, y: ny } = latlonToGrid(lat, lon);

      console.log("날짜, 시간:", baseDate, baseTime);
      console.log("격자 좌표 nx, ny:", nx, ny);

      try {
        // 1) 초단기 실황 (현재 날씨)
        const url1 = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${SERVICE_KEY}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}&dataType=JSON`;
        const res1 = await fetch(url1);
        const json1 = await res1.json();
        console.log("초단기 실황 API 응답:", json1);

        const ultra = {};
        if (json1?.response?.body?.items?.item) {
          json1.response.body.items.item.forEach(i => {
            ultra[i.category] = isNaN(i.obsrValue) ? i.obsrValue : Number(i.obsrValue);
          });
          setWeatherData(ultra);
        } else {
          setWeatherData(null);
          console.warn("초단기 실황 데이터 없음");
        }

        // 2) 단기 예보
        const url2 = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${SERVICE_KEY}&numOfRows=1500&pageNo=1&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}&dataType=JSON`;
        const res2 = await fetch(url2);
        const json2 = await res2.json();
        console.log("단기 예보 API 응답:", json2);

        const grouped = {};
        if (json2?.response?.body?.items?.item) {
          json2.response.body.items.item.forEach(({ fcstDate, fcstTime, category, fcstValue }) => {
            const key = fcstDate + fcstTime;
            if (!grouped[key]) {
              grouped[key] = { fcstDate, fcstTime, categories: {} };
            }
            grouped[key].categories[category] = isNaN(fcstValue) ? fcstValue : Number(fcstValue);
          });
          setForecast(Object.values(grouped));
        } else {
          setForecast(null);
          console.warn("단기 예보 데이터 없음");
        }

      } catch (error) {
        console.error("기상청 API 호출 실패:", error);
        setWeatherData(null);
        setForecast(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [lat, lon]);

  return { weatherData, forecast, loading };
}
