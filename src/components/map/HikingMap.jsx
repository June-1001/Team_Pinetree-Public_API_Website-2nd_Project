import React, { useEffect, useRef, useState } from "react";

const kakaoApiKey = "5f283b38458e2a36a38d8894a017f5de";

function HikingMap(props) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const allPolylines = useRef([]);
  const allOverlays = useRef([]);
  const selectedPolyline = useRef(null);
  const selectedOverlay = useRef(null);

  const [mapReady, setMapReady] = useState(false);

  // 좌표 추출
  function extractCoords(geometry) {
    if (!geometry || !geometry.coordinates) {
      return [];
    }
    if (typeof geometry.coordinates[0][0] === "number") {
      return geometry.coordinates;
    } else {
      return geometry.coordinates[0];
    }
  }

  // 카카오 맵 스크립트
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=" +
      kakaoApiKey +
      "&libraries=services&autoload=false";
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        // 기본 값 - 서울
        const center = new window.kakao.maps.LatLng(37.5665, 126.978);
        const options = {
          center: center,
          level: 5,
        };
        mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);

        // 우클릭 시 클릭한 위경도 좌표로 이동
        window.kakao.maps.event.addListener(mapInstance.current, "rightclick", (mouseEvent) => {
          const lat = mouseEvent.latLng.getLat();
          const lon = mouseEvent.latLng.getLng();
          props.onCenterChanged(lat, lon);

          if (markerRef.current) {
            markerRef.current.setMap(null);
            markerRef.current = null;
          }
          markerRef.current = new window.kakao.maps.Marker({
            map: mapInstance.current,
            position: mouseEvent.latLng,
          });

          // 폴리라인 컨트롤
          allPolylines.current.forEach((poly) => poly.setMap(null));
          allPolylines.current = [];
          if (selectedPolyline.current) {
            selectedPolyline.current.setMap(null);
            selectedPolyline.current = null;
          }
          if (selectedOverlay.current) {
            selectedOverlay.current.setMap(null);
            selectedOverlay.current = null;
          }

          if (props.onClearSelection) {
            props.onClearSelection();
          }
        });

        setMapReady(true);
      });
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      allPolylines.current.forEach((poly) => poly.setMap(null));
      allPolylines.current = [];
      if (selectedPolyline.current) {
        selectedPolyline.current.setMap(null);
        selectedPolyline.current = null;
      }
      if (selectedOverlay.current) {
        selectedOverlay.current.setMap(null);
        selectedOverlay.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !Array.isArray(props.trailData) || !mapInstance.current) {
      return;
    }

    // 폴리라인 표시
    allPolylines.current.forEach((poly) => poly.setMap(null));
    allPolylines.current = [];

    // 오버레이 표시
    allOverlays.current.forEach((ov) => ov.setMap(null));
    allOverlays.current = [];

    props.trailData.forEach((trail) => {
      const coords = extractCoords(trail.geometry);
      if (!Array.isArray(coords) || coords.length === 0) return;

      const path = coords.map((pair) => new window.kakao.maps.LatLng(pair[1], pair[0]));

      // 등산로 데이터 받아온 좌표로 폴리라인 표신
      const polyline = new window.kakao.maps.Polyline({
        path: path,
        strokeWeight: 2,
        strokeColor: "#FF0000",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      });

      polyline.setMap(mapInstance.current);

      window.kakao.maps.event.addListener(polyline, "click", () => {
        if (props.setSelectedTrail) {
          props.setSelectedTrail(trail);
        }
      });

      const content = `<div class="trail-overlay">${trail.properties.mntn_nm} / ${trail.properties.sec_len}m / ${trail.properties.cat_nam}</div>`;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: path[Math.floor(path.length / 2)],
        content: content,
        yAnchor: 1,
        zIndex: 3,
      });

      // trail-overlay 내부에 클릭 이벤트 바인딩
      const div = document.createElement("div");
      div.innerHTML = content;

      const overlayElement = div.querySelector(".trail-overlay");
      if (overlayElement && props.setSelectedTrail) {
        overlayElement.addEventListener("click", () => {
          props.setSelectedTrail(trail);
        });
      }
      overlay.setContent(div);

      // 폴리라인 위에 마우스 올렸을 때 오버레이 표시
      window.kakao.maps.event.addListener(polyline, "mouseover", () => {
        if (selectedOverlay.current) {
          selectedOverlay.current.setMap(null);
        }
        allOverlays.current.forEach((ov) => {
          ov.setMap(null);
        });
        overlay.setMap(mapInstance.current);
      });

      allPolylines.current.push(polyline);
      allOverlays.current.push(overlay);
    });
  }, [props.trailData, mapReady]);

  useEffect(() => {
    if (!mapReady || !mapInstance.current) {
      return;
    }

    if (selectedPolyline.current) {
      selectedPolyline.current.setMap(null);
      selectedPolyline.current = null;
    }
    if (selectedOverlay.current) {
      selectedOverlay.current.setMap(null);
      selectedOverlay.current = null;
    }

    // 등산로 카드 선택 시 폴리라인 더 두껍게 그리기
    if (props.selectedTrail) {
      const coords = extractCoords(props.selectedTrail.geometry);
      if (coords.length === 0) return;

      const path = coords.map((pair) => new window.kakao.maps.LatLng(pair[1], pair[0]));

      selectedPolyline.current = new window.kakao.maps.Polyline({
        path: path,
        strokeWeight: 6,
        strokeColor: "#2cc532",
        strokeOpacity: 1,
        strokeStyle: "solid",
      });

      selectedPolyline.current.setMap(mapInstance.current);

      const midPoint = path[Math.floor(path.length / 2)];

      const content = `<div class="trail-overlay selected">${props.selectedTrail.properties.mntn_nm} / ${props.selectedTrail.properties.sec_len}m / ${props.selectedTrail.properties.cat_nam}</div>`;

      allOverlays.current.forEach((ov) => {
        ov.setMap(null);
      });

      // 등산로 카드 선택 시 오버레이 항상 표시하기
      selectedOverlay.current = new window.kakao.maps.CustomOverlay({
        position: path[Math.floor(path.length / 2)],
        content: content,
        yAnchor: 1,
        zIndex: 5,
      });

      selectedOverlay.current.setMap(mapInstance.current);

      const startPoint = path[0];
      mapInstance.current.panTo(startPoint);
    }
  }, [props.selectedTrail, mapReady]);

  // 주소 있으면 주소 먼저 사용, 없으면 키워드로 검색
  useEffect(() => {
    if (!mapReady || !props.searched || !props.keyword || !window.kakao || !mapInstance.current) {
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    // 주소 검색
    geocoder.addressSearch(props.keyword, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        const first = result[0];
        const lat = parseFloat(first.y);
        const lon = parseFloat(first.x);
        const position = new window.kakao.maps.LatLng(lat, lon);
        mapInstance.current.setCenter(position);

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        markerRef.current = new window.kakao.maps.Marker({
          map: mapInstance.current,
          position: position,
        });
        props.onCenterChanged(lat, lon);
      }
      // 주소 없으면 키워드로 검색
      else {
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(props.keyword, (result2, status2) => {
          if (status2 === window.kakao.maps.services.Status.OK && result2.length > 0) {
            const first2 = result2[0];
            const lat2 = parseFloat(first2.y);
            const lon2 = parseFloat(first2.x);
            const position2 = new window.kakao.maps.LatLng(lat2, lon2);
            mapInstance.current.setCenter(position2);

            if (markerRef.current) {
              markerRef.current.setMap(null);
            }
            markerRef.current = new window.kakao.maps.Marker({
              map: mapInstance.current,
              position: position2,
            });
            props.onCenterChanged(lat2, lon2);
          }
        });
      }
    });
  }, [props.searched, props.keyword, mapReady]);

  return <div id="hiking-map" ref={mapRef}></div>;
}

export default HikingMap;
