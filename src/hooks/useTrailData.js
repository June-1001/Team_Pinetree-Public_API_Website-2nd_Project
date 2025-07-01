import { useState, useEffect } from "react";
import $ from "jquery";
import { getHikingUrl } from "../api/hikingTrails";

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

export function useTrailData(lat, lon, minRange, maxRange, difficulty) {
  const [trailData, setTrailData] = useState([]);

  useEffect(() => {
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
