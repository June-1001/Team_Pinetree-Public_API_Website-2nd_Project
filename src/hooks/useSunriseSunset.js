import { useEffect, useState } from "react";
import { fetchSunriseSunset } from "../api/fetchSunriseSunset";

export function useSunriseSunset(lat, lon) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const today = new Date();
    const dateString = today.toISOString().slice(0, 10);

    (async () => {
      console.log("좌표 lat:", lat, ", lon:", lon);
      const data = await fetchSunriseSunset({ lat, lon, date: dateString });
      console.log("SunriseSunset API data:", data);
      setData(data);
    })();
  }, [lat, lon]);

  return data;
}
