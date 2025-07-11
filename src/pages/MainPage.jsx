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
      <div className={`search-results ${showResults ? "visible" : ""}`}>
        <div className="trail-results">
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
            />
          )}
        </div>

        <div className="weather-results">
          <h3 style={{ marginBottom: 8 }}>선택 지역 현재 날씨</h3>

          <div className="weather-summary-row">
            <div>
              <WeatherSummary weatherData={weatherData} />
            </div>
            <div>
              <SunriseSunset lat={lat} lon={lon} />
            </div>
            <div>
              <WeatherAlertBox alerts={alerts} />
            </div>
          </div>
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
    </div>
  );
}
