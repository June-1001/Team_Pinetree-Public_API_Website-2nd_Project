import React, { useState, useEffect } from "react";
import HikingMap from "../components/map/HikingMap";
import TrailList from "../components/trails/TrailList";
import SearchFilterSection from "../components/search/SearchFilterSection";
import { useTrailData } from "../hooks/useTrailData";
import { useWeatherData } from "../hooks/useWeatherData";

export default function MainPage() {
  // 검색 키워드
  const [keyword, setKeyword] = useState("");

  // 등산로 최소 최대 길이 지정
  const [minRange, setMinRange] = useState("");
  const [maxRange, setMaxRange] = useState("");

  // 등산로 난이도 지정
  const [difficulty, setDifficulty] = useState("");

  //검색 시 검색됨 상태로 변경
  const [searched, setSearched] = useState(false);

  // 위도 및 경도
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  // 현재 선택한 등산로
  const [selectedTrail, setSelectedTrail] = useState(null);

  // 등산로 드롭다운 전체 닫기
  const [collapseAllTrigger, setCollapseAllTrigger] = useState(0);

  // 날씨 데이터
  const weatherData = useWeatherData(lat, lon);

  // 등산로 데이터
  const trailData = useTrailData(lat, lon, minRange, maxRange, difficulty);

  useEffect(() => {
    setSearched(false);
  }, [keyword]);

  // 키워드 검색 시 사용
  function handleSearch() {
    if (keyword.trim() === "") {
      return;
    }
    setSearched(true);
  }

  // 드롭다운 전체 닫기 - 우클릭 시 사용
  function clearSelection() {
    setSelectedTrail(null);
    setCollapseAllTrigger((prev) => prev + 1);
  }

  return (
    <div className="main-container">
      {/* 검색창 */}
      <SearchFilterSection
        keyword={keyword}
        setKeyword={setKeyword}
        handleSearch={handleSearch}
        minRange={minRange}
        setMinRange={setMinRange}
        maxRange={maxRange}
        setMaxRange={setMaxRange}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />

      {/* 등산로 지도 */}
      <HikingMap
        keyword={keyword}
        searched={searched}
        trailData={trailData}
        selectedTrail={selectedTrail}
        setSelectedTrail={setSelectedTrail}
        onCenterChanged={(lat, lon) => {
          setLat(lat);
          setLon(lon);
        }}
        onClearSelection={clearSelection}
      />

      {/* 등산로 목록 */}
      <TrailList
        trailData={trailData}
        selectedTrail={selectedTrail}
        setSelectedTrail={setSelectedTrail}
        collapseAllTrigger={collapseAllTrigger}
      />
    </div>
  );
}
