import React, { useState, useEffect } from "react";
import HikingMap from "../components/map/HikingMap";
import TrailList from "../components/trails/TrailList";
import SearchFilterSection from "../components/search/SearchFilterSection";
import { useTrailData } from "../hooks/useTrailData";
import { useWeatherData } from "../hooks/useWeatherData";

export default function MainPage() {
  const [keyword, setKeyword] = useState("");
  const [minRange, setMinRange] = useState("");
  const [maxRange, setMaxRange] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [searched, setSearched] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [collapseAllTrigger, setCollapseAllTrigger] = useState(0);

  const weatherData = useWeatherData(lat, lon);

  const {
    data: trailData,
    isLoading: trailsLoading,
    error: trailsError,
  } = useTrailData(lat, lon, minRange, maxRange, difficulty, searched);

  useEffect(() => {
    if (trailsLoading === false && searched === true) {
      setSearched(false);
    }
  }, [trailsLoading, searched]);

  // 키워드 입력 시 검색 초기화
  useEffect(() => {
    setSearched(false);
  }, [keyword]);

  function handleSearch() {
    if (keyword.trim() === "") {
      return;
    }
    setSearched(true);
  }

  function clearSelection() {
    setSelectedTrail(null);
    setCollapseAllTrigger((prev) => prev + 1);
  }

  return (
    <div className="main-container">
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

      {!trailsLoading && !trailsError && (
        <TrailList
          trailData={trailData}
          selectedTrail={selectedTrail}
          setSelectedTrail={setSelectedTrail}
          collapseAllTrigger={collapseAllTrigger}
        />
      )}
    </div>
  );
}
