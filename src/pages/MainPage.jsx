import React, { useState, useEffect, useMemo } from "react";
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
  const [searched, setSearched] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [collapseAllTrigger, setCollapseAllTrigger] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [containerHeight, setContainerHeight] = useState(800);
  const [selectedForecastDate, setSelectedForecastDate] = useState(null);

  const { weatherData, forecast } = useWeatherData(lat, lon);
  const { dailyForecast } = useLongTermWeatherData(lat, lon);

  const selectedDateTime = selectedForecastDate ? selectedForecastDate + "1500" : null;
  const currentCategories = selectedDateTime && forecast?.[selectedDateTime]?.categories;

  const alerts = useWeatherAlert(currentCategories); // 자외선 제거로 uvNow 빠짐

  const {
    data: trailData,
    isLoading: trailsLoading,
    error: trailsError,
  } = useTrailData(lat, lon, minRange, maxRange, difficulty, searched);

  const filteredForecast = useMemo(() => {
    if (!forecast || !selectedForecastDate) return null;
    return Object.values(forecast).filter(
      (item) => item.fcstDate === selectedForecastDate
    );
  }, [forecast, selectedForecastDate]);

  useEffect(() => {
    if (dailyForecast) {
      const dates = Object.keys(dailyForecast).sort();
      if (dates.length > 0) setSelectedForecastDate(dates[0]);
    }
  }, [dailyForecast]);

  useEffect(() => {
    const baseWidth = 1280;
    const baseHeight = 800;
    const maxHeight = 800;

    function handleResize() {
      const scale = window.innerWidth / baseWidth;
      const scaledHeight = baseHeight * scale;
      if (scaledHeight > maxHeight) {
        setZoom(maxHeight / baseHeight);
        setContainerHeight(maxHeight);
      } else {
        setZoom(scale);
        setContainerHeight(scaledHeight);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!trailsLoading && searched) setSearched(false);
  }, [trailsLoading, searched]);

  useEffect(() => setSearched(false), [keyword]);

  function handleSearch() {
    if (keyword.trim() === "") return;
    setSearched(true);
  }

  function clearSelection() {
    setSelectedTrail(null);
    setCollapseAllTrigger((prev) => prev + 1);
  }

  return (
    <div style={{ padding: 20, fontFamily: "'Segoe UI', sans-serif" }}>
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

      <div style={{ display: "flex", height: containerHeight, gap: 12, marginTop: 12 }}>
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

      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 8 }}>선택 지역 현재 날씨</h3>

        <div style={{ display: "flex", gap: 40 }}>
          <WeatherSummary weatherData={weatherData} />
          <SunriseSunset lat={lat} lon={lon} />
          <WeatherAlertBox alerts={alerts} />
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
  );
}
