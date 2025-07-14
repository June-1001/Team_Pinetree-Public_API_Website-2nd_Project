import React, { useEffect, useRef, useState } from "react";
import CategorySelector from "../../api/categoryselector";

const kakaoApiKey = "5f283b38458e2a36a38d8894a017f5de";

function HikingMap(props) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const allPolylines = useRef([]);
  const allOverlays = useRef([]);
  const selectedPolyline = useRef(null);
  const selectedOverlay = useRef(null);
  const categoryMarkers = useRef([]);
  const myLocationMarker = useRef(null);
  const myLocationOverlay = useRef(null);
  const currentInfoOverlay = useRef(null);
  const geomBoxOverlay = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // 카테고리 마커 및 현재 장소 정보 오버레이 초기화
  const resetCategory = () => {
    // 카테고리 마커 제거
    categoryMarkers.current.forEach((m) => m.setMap(null));
    categoryMarkers.current = [];

    // 현재 장소 정보 오버레이 제거
    if (currentInfoOverlay.current) {
      currentInfoOverlay.current.setMap(null);
      currentInfoOverlay.current = null;
    }
  };

  // 우클릭 등 일반 마커 초기화 (markerRef)
  const resetMarker = () => {
    // 지도에 찍힌 일반 마커 제거
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  };

  // 모든 폴리라인과 오버레이, 선택된 폴리라인 및 오버레이 초기화
  const resetPolylinesAndOverlays = () => {
    // 모든 일반 폴리라인 제거
    allPolylines.current.forEach((poly) => poly.setMap(null));
    allPolylines.current = [];

    // 모든 일반 오버레이 제거
    allOverlays.current.forEach((ov) => ov.setMap(null));
    allOverlays.current = [];

    // 선택된 폴리라인 제거
    if (selectedPolyline.current) {
      selectedPolyline.current.setMap(null);
      selectedPolyline.current = null;
    }

    // 선택된 오버레이 제거
    if (selectedOverlay.current) {
      selectedOverlay.current.setMap(null);
      selectedOverlay.current = null;
    }
  };

  // 내 위치 마커 및 오버레이 초기화
  const resetMyLocation = () => {
    if (myLocationMarker.current) {
      myLocationMarker.current.setMap(null);
      myLocationMarker.current = null;
    }
    if (myLocationOverlay.current) {
      myLocationOverlay.current.setMap(null);
      myLocationOverlay.current = null;
    }
  };

  useEffect(() => {
    function updateMapHeight() {
      if (mapRef.current) {
        const width = mapRef.current.offsetWidth;
        mapRef.current.style.height = width + "px";
      }
    }

    updateMapHeight();
    window.addEventListener("resize", updateMapHeight);

    return () => {
      window.removeEventListener("resize", updateMapHeight);
    };
  }, []);

  const createMarkers = (positions, spriteY) =>
    positions.map(([lat, lng]) => {
      const markerImage = new window.kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png",
        new window.kakao.maps.Size(22, 26),
        {
          spriteOrigin: new window.kakao.maps.Point(10, spriteY),
          spriteSize: new window.kakao.maps.Size(36, 98),
        }
      );
      return new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng),
        image: markerImage,
      });
    });

  function extractCoords(geometry) {
    if (!geometry || !geometry.coordinates) return [];
    if (typeof geometry.coordinates[0][0] === "number") return geometry.coordinates;
    return geometry.coordinates[0];
  }

  // 등산로 받아오는 필터 박스 표시하기
  const drawGeomBox = (point, bufferKm = 5) => {
    const bufferLat = bufferKm / 111;
    const bufferLon = bufferKm / (111 * Math.cos((point.getLat() * Math.PI) / 180));

    const sw = new window.kakao.maps.LatLng(point.getLat() - bufferLat, point.getLng() - bufferLon);
    const ne = new window.kakao.maps.LatLng(point.getLat() + bufferLat, point.getLng() + bufferLon);

    if (geomBoxOverlay.current) {
      geomBoxOverlay.current.setMap(null);
    }

    geomBoxOverlay.current = new window.kakao.maps.Rectangle({
      map: mapInstance.current,
      bounds: new window.kakao.maps.LatLngBounds(sw, ne),
      strokeWeight: 2,
      strokeColor: "#2cc532",
      strokeOpacity: 0.9,
      strokeStyle: "solid",
      fillColor: "#2cc532",
      fillOpacity: 0.03,
    });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(37.5665, 126.978);
        const isMobile = window.innerWidth <= 768;
        const options = {
          center,
          level: isMobile ? 3 : 6,
          draggable: true,
          pinchZoom: true,
        };

        mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);

        if (isMobile) {
          // 모바일에서는 클릭 이벤트를 사용하여 우클릭과 동일한 동작 처리
          window.kakao.maps.event.addListener(mapInstance.current, "click", (mouseEvent) => {
            const lat = mouseEvent.latLng.getLat();
            const lon = mouseEvent.latLng.getLng();
            const position = mouseEvent.latLng;

            props.onCenterChanged(lat, lon);
            if (props.onResetKeyword) {
              props.onResetKeyword();
            }
            drawGeomBox(position, 5);

            // 클릭 시 기존 일반 마커 제거
            resetMarker();

            // 클릭 위치에 새 마커 생성
            markerRef.current = new window.kakao.maps.Marker({
              map: mapInstance.current,
              position: mouseEvent.latLng,
            });

            // 모든 폴리라인과 오버레이 초기화
            resetPolylinesAndOverlays();

            // 카테고리 마커 및 오버레이 초기화
            resetCategory();

            // 내 위치 마커 및 오버레이 초기화
            resetMyLocation();

            setSelectedCategory("");

            if (props.onClearSelection) props.onClearSelection();
          });
        } else {
          // 데스크탑에서는 기존 우클릭 이벤트 유지
          window.kakao.maps.event.addListener(mapInstance.current, "rightclick", (mouseEvent) => {
            const lat = mouseEvent.latLng.getLat();
            const lon = mouseEvent.latLng.getLng();
            const position = mouseEvent.latLng;

            props.onCenterChanged(lat, lon);
            if (props.onResetKeyword) {
              props.onResetKeyword();
            }
            drawGeomBox(position, 5);

            // 우클릭 시 기존 일반 마커 제거
            resetMarker();

            // 우클릭 위치에 새 마커 생성
            markerRef.current = new window.kakao.maps.Marker({
              map: mapInstance.current,
              position: mouseEvent.latLng,
            });

            // 모든 폴리라인과 오버레이 초기화
            resetPolylinesAndOverlays();

            // 카테고리 마커 및 오버레이 초기화
            resetCategory();

            // 내 위치 마커 및 오버레이 초기화
            resetMyLocation();

            setSelectedCategory("");

            if (props.onClearSelection) props.onClearSelection();
          });
        }

        setMapReady(true);
      });
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);

      // 컴포넌트 언마운트 시 모든 리소스 초기화
      resetMarker();
      resetPolylinesAndOverlays();
      resetCategory();
      resetMyLocation();
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !Array.isArray(props.trailData) || !mapInstance.current) {
      return;
    }

    // 트레일 데이터 변경 시 기존 폴리라인과 오버레이 모두 초기화
    resetPolylinesAndOverlays();

    props.trailData.forEach((trail) => {
      const coords = extractCoords(trail.geometry);
      if (!Array.isArray(coords) || coords.length === 0) return;

      const path = coords.map((pair) => new window.kakao.maps.LatLng(pair[1], pair[0]));
      const polyline = new window.kakao.maps.Polyline({
        path,
        strokeWeight: 2,
        strokeColor: "#FF0000",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      });
      polyline.setMap(mapInstance.current);

      window.kakao.maps.event.addListener(polyline, "click", () => {
        if (props.setSelectedTrail) props.setSelectedTrail(trail);
        setSelectedCategory("");
        document.querySelectorAll("#category li.on").forEach((el) => el.classList.remove("on"));
      });

      const customOverlayDiv = document.createElement("div");
      // 커스텀 오버레이 디자인
      Object.assign(customOverlayDiv.style, {
        background: "rgba(255,255,255,0.95)",
        border: "2px solid #2cc532",
        borderRadius: "8px",
        padding: "2px 6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        fontWeight: "bold",
        fontSize: "15px",
        color: "#222",
        cursor: "pointer",
        display: "inline-block",
      });
      customOverlayDiv.innerHTML = `
        <div style="margin-bottom:2px;font-size:13px;font-weight:normal;">
          ${trail.properties.mntn_nm} / 
          ${parseFloat(trail.properties.sec_len)}m
        </div>
      `;
      customOverlayDiv.onclick = () => {
        if (props.setSelectedTrail) props.setSelectedTrail(trail);
        setSelectedCategory("");
        document.querySelectorAll("#category li.on").forEach((el) => el.classList.remove("on"));
      };

      const overlay = new window.kakao.maps.CustomOverlay({
        position: path[Math.floor(path.length / 2)],
        content: customOverlayDiv,
        yAnchor: 1,
        zIndex: 3,
      });

      window.kakao.maps.event.addListener(polyline, "mouseover", () => {
        if (selectedOverlay.current) selectedOverlay.current.setMap(null);
        allOverlays.current.forEach((ov) => ov.setMap(null));
        overlay.setMap(mapInstance.current);
      });

      allPolylines.current.push(polyline);
      allOverlays.current.push(overlay);
    });
  }, [props.trailData, mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    if (props.selectedTrail) {
      setSelectedCategory("");
      document.querySelectorAll("#category li.on").forEach((el) => {
        el.classList.remove("on");
      });
    }
  }, [props.selectedTrail, mapReady]);

  useEffect(() => {
    if (selectedPolyline.current) {
      selectedPolyline.current.setMap(null);
      selectedPolyline.current = null;
    }
    if (selectedOverlay.current) {
      selectedOverlay.current.setMap(null);
      selectedOverlay.current = null;
    }
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

      // 현재 선택한 커스텀 오버레이 디자인
      const selectedOverlayDiv = document.createElement("div");
      Object.assign(selectedOverlayDiv.style, {
        background: "#2cc532",
        border: "2px solid #1a8c2c",
        borderRadius: "10px",
        padding: "2px 8px",
        boxShadow: "0 2px 12px rgba(44,197,50,0.18)",
        fontWeight: "bold",
        fontSize: "17px",
        color: "#fff",
        cursor: "pointer",
        display: "inline-block",
      });
      selectedOverlayDiv.innerHTML = `
        <div style="margin-bottom:2px;font-size:14px;font-weight:normal;">
          ${props.selectedTrail.properties.mntn_nm} / 
          ${parseFloat(props.selectedTrail.properties.sec_len)}m
        </div>
      `;

      allOverlays.current.forEach((ov) => {
        ov.setMap(null);
      });

      selectedOverlay.current = new window.kakao.maps.CustomOverlay({
        position: path[Math.floor(path.length / 2)],
        content: selectedOverlayDiv,
        yAnchor: 1,
        zIndex: 5,
      });

      selectedOverlay.current.setMap(mapInstance.current);

      const startPoint = path[0];
      mapInstance.current.panTo(startPoint);
    }
  }, [props.selectedTrail, mapReady]);

  useEffect(() => {
    if (!mapReady || !props.searched || !props.keyword || !window.kakao || !mapInstance.current) {
      return;
    }

    setSelectedCategory("");
    document.querySelectorAll("#category li.on").forEach((el) => {
      el.classList.remove("on");
    });

    resetMarker();
    resetCategory();

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(props.keyword, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        const first = result[0];
        const lat = parseFloat(first.y);
        const lon = parseFloat(first.x);
        const position = new window.kakao.maps.LatLng(lat, lon);
        mapInstance.current.setCenter(position);

        markerRef.current = new window.kakao.maps.Marker({
          map: mapInstance.current,
          position: position,
        });
        drawGeomBox(position, 5);
        props.onCenterChanged(lat, lon);
        resetMyLocation();
      } else {
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(props.keyword, (result2, status2) => {
          if (status2 === window.kakao.maps.services.Status.OK && result2.length > 0) {
            const first2 = result2[0];
            const lat2 = parseFloat(first2.y);
            const lon2 = parseFloat(first2.x);
            const position2 = new window.kakao.maps.LatLng(lat2, lon2);
            mapInstance.current.setCenter(position2);

            markerRef.current = new window.kakao.maps.Marker({
              map: mapInstance.current,
              position: position2,
            });
            drawGeomBox(position2, 5);
            props.onCenterChanged(lat2, lon2);
            resetMyLocation();
          }
        });
      }
    });
  }, [props.searched, props.keyword, mapReady, props.searchTrigger]);

  const handleCategoryChange = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory("");
      document.querySelectorAll("#category li.on").forEach((el) => {
        el.classList.remove("on");
      });
      resetCategory();
      return;
    }

    setSelectedCategory(categoryId);
    setIsSearching(true);

    const clickedLi = document.querySelector(`#category li[id='${categoryId}']`);
    if (clickedLi) {
      clickedLi.classList.add("on");
      if (currentInfoOverlay.current) {
        currentInfoOverlay.current.setMap(null);
        currentInfoOverlay.current = null;
      }
    }

    if (!mapInstance.current || !window.kakao || !categoryId) {
      setIsSearching(false);
      return;
    }

    const ps = new window.kakao.maps.services.Places(mapInstance.current);
    resetCategory();

    ps.categorySearch(
      categoryId,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const order = parseInt(document.querySelector(`#${categoryId}`)?.dataset?.order || 0);

          data.forEach((place) => {
            const markerImage = new window.kakao.maps.MarkerImage(
              "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png",
              new window.kakao.maps.Size(27, 28),
              {
                spriteSize: new window.kakao.maps.Size(72, 208),
                spriteOrigin: new window.kakao.maps.Point(46, order * 36),
                offset: new window.kakao.maps.Point(11, 28),
              }
            );

            const marker = new window.kakao.maps.Marker({
              map: mapInstance.current,
              position: new window.kakao.maps.LatLng(place.y, place.x),
              image: markerImage,
            });

            const content = document.createElement("div");
            content.className = "placeinfo_wrap";
            content.innerHTML = `
              <div class="placeinfo">
                <a class="title" href="${place.place_url}" target="_blank">${place.place_name}</a>
                <span>${place.road_address_name || place.address_name}</span>
                <span class="tel">${place.phone || ""}</span>
              </div>
              <div class="after"></div>
            `;

            const overlay = new window.kakao.maps.CustomOverlay({
              content,
              position: new window.kakao.maps.LatLng(place.y, place.x),
              yAnchor: 1,
              zIndex: 3,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
              if (currentInfoOverlay.current) {
                currentInfoOverlay.current.setMap(null);
              }
              overlay.setMap(mapInstance.current);
              currentInfoOverlay.current = overlay;
            });

            categoryMarkers.current.push(marker);
          });
        }

        setIsSearching(false);
      },
      { useMapBounds: true }
    );
  };

  const handleMyLocation = () => {
    // 일반 마커 초기화
    resetMarker();

    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const loc = new window.kakao.maps.LatLng(lat, lng);

        // 내 위치 마커 및 오버레이 초기화
        resetMyLocation();

        const redMarkerImage = new window.kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
          new window.kakao.maps.Size(24, 35)
        );

        myLocationMarker.current = new window.kakao.maps.Marker({
          map: mapInstance.current,
          position: loc,
          image: redMarkerImage,
          title: "현 위치",
        });

        // 현 위치 오버레이
        const overlayDiv = document.createElement("div");
        Object.assign(overlayDiv.style, {
          background: "white",
          border: "2px solid red",
          borderRadius: "6px",
          padding: "2px 6px",
          color: "black",
          fontWeight: "bold",
          fontSize: "13px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
          userSelect: "none",
        });
        overlayDiv.textContent = "현 위치";

        myLocationOverlay.current = new window.kakao.maps.CustomOverlay({
          content: overlayDiv,
          position: loc,
          yAnchor: 1.8,
          zIndex: 4,
          clickable: false,
        });

        myLocationOverlay.current.setMap(mapInstance.current);
        mapInstance.current.setCenter(loc);
        drawGeomBox(loc, 5);
        props.onCenterChanged(lat, lng);
      },
      (error) => {
        alert("현위치 정보를 가져올 수 없습니다.");
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div id="mapwrap">
      <div id="hiking-map" ref={mapRef}></div>
      <button onClick={handleMyLocation} className="access-location" title="현 위치">
        현 위치
      </button>
      <CategorySelector
        selected={selectedCategory}
        onSelect={handleCategoryChange}
        disabled={isSearching}
      />
    </div>
  );
}

export default HikingMap;
