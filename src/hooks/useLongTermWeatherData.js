import { useEffect, useState } from "react";
import { latlonToGrid } from "../utils/latlonToGrid";

const SERVICE_KEY = encodeURIComponent("Fn8nBDNNZn0hIRp85JkxCQhQUBSuaxYLC11J5xocF5WqxiLpogKvhdaKPkfyX5nyYhp9VAJKgLVNWSJ/n/J+Cw==");


function getBaseDateTime() {
  const now = new Date();
  now.setHours(now.getHours() - 1);
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return { baseDate: `${yyyy}${mm}${dd}`, baseTime: "0500" };
}

export function useLongTermWeatherData(lat, lon) {
  const [dailyForecast, setDailyForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lon) return;

    const { baseDate, baseTime } = getBaseDateTime();
    const { x, y } = latlonToGrid(lat, lon);

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${SERVICE_KEY}&numOfRows=3000&pageNo=1&base_date=${baseDate}&base_time=${baseTime}&nx=${x}&ny=${y}&dataType=JSON`
        );
        const json = await res.json();
        const items = json.response.body.items.item;

        const grouped = {};
        items.forEach(({ fcstDate, fcstTime, category, fcstValue }) => {
          if (!grouped[fcstDate]) grouped[fcstDate] = {};
          if (!grouped[fcstDate][fcstTime]) grouped[fcstDate][fcstTime] = {};
          grouped[fcstDate][fcstTime][category] = fcstValue;
        });

        setDailyForecast(grouped);
      } catch (e) {
        console.error("장기예보 불러오기 실패", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [lat, lon]);

  return { dailyForecast, loading };
}
