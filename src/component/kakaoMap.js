import React, { useEffect, useState } from "react";

const kakaoApiKey = "5f283b38458e2a36a38d8894a017f5de";

const KakaoMapAddressSearch = () => {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
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

  const handleLatLonSubmit = () => {
    if (!map || !lat || !lon) return;

    const coords = new window.kakao.maps.LatLng(lat, lon);
    map.setCenter(coords);

    if (marker) {
      marker.setMap(null);
    }

    const newMarker = new window.kakao.maps.Marker({
      map: map,
      position: coords,
    });
    setMarker(newMarker);

    // Optional reverse geocoding to show address
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(lon, lat, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0].road_address
          ? result[0].road_address.address_name
          : result[0].address.address_name;
        alert("주소: " + address);
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="위도 (lat)"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        style={{ width: "150px", marginRight: "10px" }}
      />
      <input
        type="text"
        placeholder="경도 (lon)"
        value={lon}
        onChange={(e) => setLon(e.target.value)}
        style={{ width: "150px", marginRight: "10px" }}
      />
      <button onClick={handleLatLonSubmit}>지도 이동</button>

      <div
        id="kakao_map_container"
        style={{ width: "500px", height: "400px", marginTop: "10px" }}
      ></div>
    </div>
  );
};

export default KakaoMapAddressSearch;
