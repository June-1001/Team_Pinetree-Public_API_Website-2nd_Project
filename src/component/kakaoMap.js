import React, { useEffect, useRef, useState } from "react";

const kakaoApiKey = "5f283b38458e2a36a38d8894a017f5de";

export let lat = null;
export let lon = null;

const KakaoMap = ({ keyword, searched }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setKakaoLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setKakaoLoaded(true);
      });
    };
  }, []);

  useEffect(() => {
    if (kakaoLoaded && mapRef.current && !mapInstance.current) {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      mapInstance.current = map;

      const marker = new window.kakao.maps.Marker({
        position: map.getCenter(),
        map: map,
      });
      markerInstance.current = marker;

      window.kakao.maps.event.addListener(map, "center_changed", () => {
        const center = map.getCenter();
        marker.setPosition(center);
        lat = center.getLat();
        lon = center.getLng();
      });
    }
  }, [kakaoLoaded]);

  useEffect(() => {
    if (!searched || !kakaoLoaded || !mapInstance.current || !keyword.trim()) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
        const place = data[0];
        lat = parseFloat(place.y);
        lon = parseFloat(place.x);

        const position = new window.kakao.maps.LatLng(lat, lon);
        mapInstance.current.setCenter(position);
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  }, [searched, keyword, kakaoLoaded]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "45vw",
        height: "50vh",
        position: "relative",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
      id="kakao_map_container"
    />
  );
};

export default KakaoMap;
