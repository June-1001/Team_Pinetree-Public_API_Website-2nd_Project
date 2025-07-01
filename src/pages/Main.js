import React, { useState, useEffect } from "react";
import HikingMap from "../components/Map/HikingMap";
import SearchBar from "../components/Search/SearchBar";
import RangeInput from "../components/Search/RangeInput";
import DifficultyDropdown from "../components/Search/DifficultyDropdown";
import TrailList from "../components/Trails/TrailList";
import { getWeatherUrl } from "../api/weather";
import { getHikingUrl } from "../api/hikingTrails";

const MainPage = () => {
  const [keyword, setKeyword] = useState("");
  const [minRange, setMinRange] = useState("");
  const [maxRange, setMaxRange] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [searched, setSearched] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [trailData, setTrailData] = useState([]);

  const handleSearch = () => {
    if (keyword.trim() === "") {
      return;
    }
    setSearched(true);
  };

  useEffect(() => {
    if (lat !== null && lon !== null) {
      const weatherUrl = getWeatherUrl(lat, lon);
      fetch(weatherUrl)
        .then((res) => res.json())
        .then((data) => {
          setWeatherData(data);
        });

      const hikingUrl = getHikingUrl(
        lat,
        lon,
        minRange,
        maxRange,
        difficulty === "전체" ? "" : difficulty
      );
      fetch(hikingUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.response && data.response.result) {
            setTrailData(data.response.result.featureCollection.features);
          } else {
            setTrailData([]);
          }
        });
    }
  }, [lat, lon, minRange, maxRange, difficulty]);

  return (
    <div className="main-container">
      <div className="search-section">
        <SearchBar keyword={keyword} setKeyword={setKeyword} onSearch={handleSearch} />
        <div className="filter-section">
          <div className="range-section">
            <span>거리</span>
            <RangeInput value={minRange} setValue={setMinRange} placeholder="최소" />
            <RangeInput value={maxRange} setValue={setMaxRange} placeholder="최대" />
          </div>
          <div className="difficulty-section">
            <span>난이도</span>
            <DifficultyDropdown value={difficulty} setValue={setDifficulty} />
          </div>
        </div>
      </div>

      <HikingMap
        keyword={keyword}
        searched={searched}
        onCenterChanged={(lat, lon) => {
          setLat(lat);
          setLon(lon);
        }}
        trails={trailData}
      />

      <TrailList trailData={trailData} />
    </div>
  );
};

export default MainPage;
