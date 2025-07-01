import { useState, useEffect } from "react";
import $ from "jquery";
import { getHikingUrl } from "../api/hikingTrails";

// jquery로 jsonp 데이터 불러오기
function fetchTrailData(lat, lon, min, max, diff) {
  return new Promise((resolve, reject) => {
    const url = getHikingUrl(lat, lon, min, max, diff);
    console.log("▶ fetching trails from:", url);

    $.ajax({
      url: url,
      dataType: "jsonp",
      success: (data) => resolve(data),
      error: (err) => reject(err),
    });
  });
}

// json 파일을 사용 가능한 array로 변환
export function useTrailData(lat, lon, minRange, maxRange, difficulty) {
  const [trailData, setTrailData] = useState([]);

  useEffect(() => {
    // geomFilter에서 위도 경도 값이 정해지지 않으면 API 검색이 불가능함
    if (lat == null || lon == null) {
      setTrailData([]);
      return;
    }

    fetchTrailData(lat, lon, minRange, maxRange, difficulty)
      .then((data) => {
        const fc = data?.response?.result?.featureCollection;
        let features = [];

        if (Array.isArray(fc?.features)) {
          features = fc.features;
        } else if (Array.isArray(fc)) {
          features = fc;
        } else if (Array.isArray(data?.features)) {
          features = data.features;
        }
        setTrailData(features);
      })
      .catch((err) => {
        setTrailData([]);
      });
  }, [lat, lon, minRange, maxRange, difficulty]);

  return trailData;
}
