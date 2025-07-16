import React, { useState, useRef, useEffect, useMemo } from "react";
import HikingMap from "../components/map/HikingMap";
import TrailList from "../components/trails/TrailList";
import SearchFilterSection from "../components/search/SearchFilterSection";

import { useTrailData } from "../hooks/useTrailData";
import { useWeatherData } from "../hooks/useWeatherData";
import { useLongTermWeatherData } from "../hooks/useLongTermWeatherData";
import { useWeatherAlert } from "../hooks/useWeatherAlert";

import WeatherSummary from "../components/weather/WeatherSummary";
import DailyForecastList from "../components/weather/DailyForecastList";
import HourlyForecastList from "../components/weather/HourlyForecastList";
import SunriseSunset from "../components/weather/SunriseSunset";
import WeatherAlertBox from "../components/weather/WeatherAlertBox";

export default function MainPage() {
  const [inputKeyword, setInputKeyword] = useState("");
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
  const [showWeather, setShowWeather] = useState(false);
  const weatherRef = useRef(null);
  const [searchTrigger, setSearchTrigger] = useState(false);

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

  const [selectedForecastDate, setSelectedForecastDate] = useState(null);

  const { weatherData, forecast } = useWeatherData(lat, lon);
  const { dailyForecast } = useLongTermWeatherData(lat, lon);

  const selectedDateTime = selectedForecastDate ? selectedForecastDate + "1500" : null;
  const currentCategories = selectedDateTime && forecast?.[selectedDateTime]?.categories;

  const alerts = useWeatherAlert(currentCategories);

  const filteredForecast = useMemo(() => {
    if (!forecast || !selectedForecastDate) return null;
    return Object.values(forecast).filter((item) => item.fcstDate === selectedForecastDate);
  }, [forecast, selectedForecastDate]);

  useEffect(() => {
    if (showWeather && weatherRef.current) {
      weatherRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showWeather]);

  useEffect(() => {
    if (dailyForecast) {
      const dates = Object.keys(dailyForecast).sort();
      if (dates.length > 0) setSelectedForecastDate(dates[0]);
    }
  }, [dailyForecast]);

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
    if (inputKeyword.trim() === "") {
      return;
    }

    const sameKeyword = lastSearch.current.keyword === inputKeyword;
    const sameLat = lastSearch.current.lat === lat;
    const sameLon = lastSearch.current.lon === lon;

    if (sameKeyword && sameLat && sameLon) {
      return;
    }

    lastSearch.current = {
      keyword: inputKeyword,
      lat,
      lon,
      minRange,
      maxRange,
      difficulty,
    };

    setKeyword(inputKeyword);
    setSearchParams({
      keyword: inputKeyword,
      lat,
      lon,
      minRange,
      maxRange,
      difficulty,
    });
    setSearchTrigger((prev) => prev + 1);
    setShowResults(true);
    setShowMap(true);
  }

  function clearSelection() {
    setSelectedTrail(null);
    setCollapseAllTrigger((prev) => prev + 1);
  }

  useEffect(() => {
    if (lat !== null && lon !== null) {
      setSearchParams((prev) => ({
        ...prev,
        lat,
        lon,
      }));
    }
  }, [lat, lon]);

  useEffect(() => {
    setShowWeather(false);
  }, [searchParams]);

  // 페이지 스케일링
  function updateViewport() {
    const meta = document.querySelector("#viewport-meta");
    if (window.innerWidth <= 768) {
      meta.setAttribute("content", "width=480, user-scalable=no");
    } else {
      meta.setAttribute("content", "width=device-width, initial-scale=1.0");
    }
  }

  window.addEventListener("resize", updateViewport);
  window.addEventListener("DOMContentLoaded", updateViewport);

  return (
    <div className="main-container">
      <div className={`search-wrapper ${showResults ? "searched" : ""}`}>
        <h1 className="title">우리 동네 등산로 검색 서비스</h1>
        <SearchFilterSection
          keyword={inputKeyword}
          setKeyword={setInputKeyword}
          handleSearch={handleSearch}
          minRange={minRange}
          setMinRange={setMinRange}
          maxRange={maxRange}
          setMaxRange={setMaxRange}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />
      </div>
      <div className={`search-results ${showResults ? "visible" : ""}`}>
        <div className="trail-results">
          {showMap && (
            <HikingMap
              keyword={keyword}
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
              searchTrigger={searchTrigger}
            />
          )}

          {!trailsLoading && !trailsError && showResults && (
            <TrailList
              trailData={trailData.filter((trail) => {
                const len = parseFloat(trail.properties.sec_len);
                const matchMin = minRange === "" || len >= parseFloat(minRange);
                const matchMax = maxRange === "" || len <= parseFloat(maxRange);
                const matchDiff =
                  difficulty === "전체" ||
                  difficulty === "" ||
                  trail.properties.cat_nam === difficulty;
                return matchMin && matchMax && matchDiff;
              })}
              selectedTrail={selectedTrail}
              setSelectedTrail={setSelectedTrail}
              collapseAllTrigger={collapseAllTrigger}
            />
          )}
        </div>

        <div>
          <h3
            className="weather-toggle-header"
            onClick={() => {
              setShowWeather((prev) => !prev);
            }}
          >
            지역 날씨 상황 정보
            <span className="triangle">{showWeather ? "▲" : "▼"}</span>
          </h3>
          {showWeather && (
            <div ref={weatherRef} className="weather-results">
              <div className="weather-summary-row">
                <WeatherSummary lat={lat} lon={lon} />
                <SunriseSunset lat={lat} lon={lon} />
                <WeatherAlertBox alerts={alerts} />
              </div>
              <div className="forecasts">
                {dailyForecast && (
                  <DailyForecastList
                    dailyForecast={dailyForecast}
                    selectedForecastDate={selectedForecastDate}
                    setSelectedForecastDate={setSelectedForecastDate}
                  />
                )}
                {filteredForecast && filteredForecast.length > 0 && (
                  <HourlyForecastList
                    selectedForecastDate={selectedForecastDate}
                    filteredForecast={filteredForecast}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
