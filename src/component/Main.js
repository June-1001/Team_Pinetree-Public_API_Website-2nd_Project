import React, { useState, useEffect } from "react";
import KakaoMap from "./kakaoMap";

const MainPage = () => {
  const [keyword, setKeyword] = useState("");
  const [searched, setSearched] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) return;
    setSearchKeyword(keyword);
    setTriggerSearch((prev) => !prev);
    setSearched(true);
  };

  useEffect(() => {
    if (searched) {
      const timer = setTimeout(() => {
        setShowMap(true);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setShowMap(false);
    }
  }, [searched]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: searched ? 0 : "50%",
          left: 0,
          width: "100vw",
          transform: searched ? "translateY(0)" : "translateY(-50%)",
          transition: "top 0.4s ease, transform 0.4s ease",
          backgroundColor: "#064420",
          padding: "10px 0",
          textAlign: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#064420",
            padding: "10px",
            boxShadow: searched ? "0 2px 5px rgba(0,0,0,0.2)" : "none",
          }}
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              width: "300px",
              marginRight: "8px",
              padding: "8px",
              backgroundColor: "#064420",
              color: "#ffffff",
              border: "1px solid #ffffff",
              outline: "none",
              fontSize: "16px",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "8px 16px",
              backgroundColor: "#064420",
              color: "#ffffff",
              border: "1px solid #ffffff",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            검색
          </button>
        </div>
      </div>

      <div
        style={{
          height: "100%",
          opacity: showMap ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: showMap ? "auto" : "none",
        }}
      >
        {showMap && <KakaoMap keyword={searchKeyword} triggerSearch={triggerSearch} />}
      </div>
    </div>
  );
};

export default MainPage;
