import React, { useState, useEffect, useRef } from "react";
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
  const [showResults, setShowResults] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [collapseAllTrigger, setCollapseAllTrigger] = useState(0);
  const [showMap, setShowMap] = useState(false);

  const lastSearchedKeyword = useRef("");

  const weatherData = useWeatherData(lat, lon);

  const {
    data: trailData,
    isLoading: trailsLoading,
    error: trailsError,
  } = useTrailData(lat, lon, minRange, maxRange, difficulty, searched);

  function handleSearch() {
    if (keyword.trim() === "") {
      return;
    }
    lastSearchedKeyword.current = keyword;
    setShowResults(true);
    setShowMap(true);
    setSearched((prev) => !prev);
  }

  function clearSelection() {
    setSelectedTrail(null);
    setCollapseAllTrigger((prev) => prev + 1);
  }

  return (
    <div className="main-container">
      <div className="top-overflow">
        <div className={`search-wrapper ${showResults ? "searched" : ""}`}>
          <h1 className="title">우리 동네 등산로 검색 서비스</h1>
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
        </div>
        <div
          id="search-results"
          className={`search-results-container ${showResults ? "visible" : ""}`}
        >
          {showMap && (
            <HikingMap
              keyword={lastSearchedKeyword.current}
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
          )}
        </div>
      </div>
      <div>
        {!trailsLoading && !trailsError && showResults && (
          <TrailList
            trailData={trailData}
            selectedTrail={selectedTrail}
            setSelectedTrail={setSelectedTrail}
            collapseAllTrigger={collapseAllTrigger}
            style={{ flexGrow: 1, overflowY: "auto", height: "100%" }}
          />
        )}        
      </div>
    </div>
  );
}
