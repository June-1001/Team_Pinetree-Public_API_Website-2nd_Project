import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

const kakaoApiKey = "5f283b38458e2a36a38d8894a017f5de";

const KakaoMap = forwardRef(({ keyword, triggerSearch }, ref) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const lastCoords = useRef({ lat: null, lon: null });

  useImperativeHandle(ref, () => ({
    getLatLng: () => lastCoords.current,
  }));

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setKakaoLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false&libraries=services`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          setKakaoLoaded(true);
        });
      };
    }
  }, []);

  useEffect(() => {
    if (kakaoLoaded && mapRef.current && !mapInstance.current) {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      mapInstance.current = new window.kakao.maps.Map(container, options);

      markerInstance.current = new window.kakao.maps.Marker({
        position: options.center,
        map: mapInstance.current,
      });

      window.kakao.maps.event.addListener(mapInstance.current, "center_changed", () => {
        const center = mapInstance.current.getCenter();
        markerInstance.current.setPosition(center);
        lastCoords.current = {
          lat: center.getLat(),
          lon: center.getLng(),
        };
      });

      lastCoords.current = {
        lat: options.center.getLat(),
        lon: options.center.getLng(),
      };
    }
  }, [kakaoLoaded]);

  useEffect(() => {
    if (!kakaoLoaded || !mapInstance.current || !keyword.trim()) return;

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
        const place = data[0];
        const lat = parseFloat(place.y);
        const lon = parseFloat(place.x);
        const position = new window.kakao.maps.LatLng(lat, lon);

        mapInstance.current.setCenter(position);

        lastCoords.current = { lat, lon };
      }
    });
  }, [triggerSearch, kakaoLoaded, keyword]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "50vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
      id="kakao_map_container"
    />
  );
});

export default KakaoMap;
