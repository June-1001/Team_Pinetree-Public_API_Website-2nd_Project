import React from "react";
import { useSunriseSunset } from "../../hooks/useSunriseSunset";

export default function SunriseSunset({ lat, lon }) {
  const data = useSunriseSunset(lat, lon);

  const formatTime = (time) => {
    return time && time.length === 6 ? `${time.slice(0, 2)}:${time.slice(2, 4)}` : "-";
  };

  if (!data) return <div>일출/일몰 정보 불러오는중...</div>;

  return (
    <div>
      <h4>일출/일몰 정보</h4>
      <ul>
        <li>일출 시간 : {formatTime(data.sunrise)}</li>
        <li>일몰 시간 : {formatTime(data.sunset)}</li>
      </ul>
    </div>
  );
}
