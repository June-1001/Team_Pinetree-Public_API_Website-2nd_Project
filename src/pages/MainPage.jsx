import React, { useState, useRef } from "react";
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
  const [showResults, setShowResults] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [collapseAllTrigger, setCollapseAllTrigger] = useState(0);
  const [showMap, setShowMap] = useState(false);

  const lastSearch = useRef({
    keyword: "",
    lat: null,
    lon: null,
    minRange: "",
    maxRange: "",
    difficulty: "",
  });

  const [searchParams, setSearchParams] = useState({
    keyword: "",
    lat: null,
    lon: null,
    minRange: "",
    maxRange: "",
    difficulty: "",
  });

  const weatherData = useWeatherData(lat, lon);

  const {
    data: trailData,
    isLoading: trailsLoading,
    error: trailsError,
  } = useTrailData(
    searchParams.lat,
    searchParams.lon,
    searchParams.minRange,
    searchParams.maxRange,
    searchParams.difficulty,
    searchParams.keyword
  );

  function handleSearch() {
    if (keyword.trim() === "") {
      return;
    }

    const sameSearch =
      keyword === lastSearch.current.keyword &&
      lat === lastSearch.current.lat &&
      lon === lastSearch.current.lon &&
      minRange === lastSearch.current.minRange &&
      maxRange === lastSearch.current.maxRange &&
      difficulty === lastSearch.current.difficulty;

    if (sameSearch) {
      setShowResults(true);
      setShowMap(true);
      return;
    }

    lastSearch.current = {
      keyword,
      lat,
      lon,
      minRange,
      maxRange,
      difficulty,
    };

    setSearchParams({
      keyword,
      lat,
      lon,
      minRange,
      maxRange,
      difficulty,
    });

    setShowResults(true);
    setShowMap(true);
  }

  function clearSelection() {
    setSelectedTrail(null);
    setCollapseAllTrigger((prev) => prev + 1);
  }

  return (
    <div className="main-container">
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
            keyword={searchParams.keyword}
            searched={true}
            trailData={trailData}
            selectedTrail={selectedTrail}
            setSelectedTrail={setSelectedTrail}
            onCenterChanged={(newLat, newLon) => {
              setLat(newLat);
              setLon(newLon);
              setSearchParams((prev) => ({
                ...prev,
                lat: newLat,
                lon: newLon,
              }));
            }}
            onClearSelection={clearSelection}
          />
        )}

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
