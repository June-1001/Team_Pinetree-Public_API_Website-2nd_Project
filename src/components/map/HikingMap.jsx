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
  const categoryMarkers = useRef({
    coffee: [],
    store: [],
    carpark: [],
  });

  const [mapReady, setMapReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("coffee");
  
  const createMarkers = (positions, spriteY) => {
    return positions.map(([lat, lng]) => {
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
  };

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

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=" +
      kakaoApiKey +
      "&libraries=services&autoload=false";
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(37.5665, 126.978);
        const options = {
          center: center,
          level: 5,
        };
        mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);

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

    allPolylines.current.forEach((poly) => poly.setMap(null));
    allPolylines.current = [];
    allOverlays.current.forEach((ov) => ov.setMap(null));
    allOverlays.current = [];

    props.trailData.forEach((trail) => {
      const coords = extractCoords(trail.geometry);
      if (!Array.isArray(coords) || coords.length === 0) return;


      const path = coords.map((pair) => new window.kakao.maps.LatLng(pair[1], pair[0]));

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

      const content = `<div class="trail-overlay selected">${props.selectedTrail.properties.mntn_nm} / ${props.selectedTrail.properties.sec_len}m / ${props.selectedTrail.properties.cat_nam}</div>`;

      allOverlays.current.forEach((ov) => {
        ov.setMap(null);
      });

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

  useEffect(() => {
    if (!mapReady || !props.searched || !props.keyword || !window.kakao || !mapInstance.current) {
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(props.keyword, (result, status) => {
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
    });
  }, [props.searched, props.keyword, mapReady]);

  const initCategoryMarkers = () => {
    if (!mapInstance.current) return;

    // 예시 좌표 - 필요에 따라 교체하세요
    const coffee = [
      [37.5665, 126.978], 
      [37.565, 126.977]
  ];
    const store = [
      [37.567, 126.978], 
      [37.564, 126.976]
    ];
    const carpark = [
      [37.5655, 126.975], 
      [37.5667, 126.976]
    ];

    categoryMarkers.current["coffee"] = createMarkers(coffee, 0);
    categoryMarkers.current["store"] = createMarkers(store, 36);
    categoryMarkers.current["carpark"] = createMarkers(carpark, 72);
  };

  const changeMarker = (category) => {
    setSelectedCategory(category);

    Object.entries(categoryMarkers.current).forEach(([type, markers]) => {
      markers.forEach((marker) => {
        marker.setMap(type === category ? mapInstance.current : null);
      });
    });
  };

  useEffect(() => {
    if (!mapReady) return;
    initCategoryMarkers();
    changeMarker(selectedCategory);
  }, [mapReady]);

    return (
    <div id="mapwrap">
      <div id="hikingMap" ref={mapRef}></div>
      <div class="category">
        <ul>
          <li
            className={selectedCategory === "coffee" ? "menu_selected" : ""}
            onClick={() => changeMarker("coffee")}
          >
            <span className="ico_comm ico_coffee"></span>
            커피숍
          </li>
          <li
            className={selectedCategory === "store" ? "menu_selected" : ""}
            onClick={() => changeMarker("store")}
          >
            <span className="ico_comm ico_store"></span>
            편의점
          </li>
          <li
            className={selectedCategory === "carpark" ? "menu_selected" : ""}
            onClick={() => changeMarker("carpark")}
          >
            <span className="ico_comm ico_carpark"></span>
            주차장
          </li>
        </ul>
      </div>    
    </div>
  );
}

export default HikingMap;
