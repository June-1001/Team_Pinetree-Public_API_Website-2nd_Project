import React, { useEffect, useState } from "react";
import { fetchSunriseSunset } from "../../api/fetchSunriseSunset";


export default function SunriseSunset({ lat, lon }) {

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

  if (!data) return <div>일출/일몰 정보 불러오는중...</div>

  const formatTime = (time) => {
    return time && time.length === 6 ? `${time.slice(0, 2)}:${time.slice(2, 4)}` : "-";

  }

  return (
    <div>
      <h4>일출/일몰 정보</h4>
      <div>일출 : {formatTime(data.sunrise)}</div>
      <div>일몰 : {formatTime(data.sunset)}</div>



    </div>

  );

}
