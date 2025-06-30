import React, { useEffect, useState } from "react";

const kakaoApiKey = "5f283b38458e2a36a38d8894a017f5de";

const KakaoMapSingleKeywordSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false&libraries=services`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      };
    }

    function initializeMap() {
      const container = document.getElementById("kakao_map_container");
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);
    }
  }, []);

  const handleKeywordSearch = () => {
    if (!keyword || !map) return;

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
        const firstPlace = data[0];
        const coords = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);

        map.setCenter(coords);

        if (marker) {
          marker.setMap(null);
        }

        const newMarker = new window.kakao.maps.Marker({
          map: map,
          position: coords,
        });

        setMarker(newMarker);
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="키워드를 입력하세요."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleKeywordSearch}>검색</button>

      <div
        id="kakao_map_container"
        style={{ width: "500px", height: "400px", marginTop: "10px" }}
      ></div>
    </div>
  );
};

export default KakaoMapSingleKeywordSearch;
