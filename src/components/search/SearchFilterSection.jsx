import React, { useEffect } from "react";
import SearchBar from "./SearchBar";
import RangeInput from "./RangeInput";
import DifficultyDropdown from "./DifficultyDropdown";

const SearchFilterSection = ({
  keyword,
  setKeyword,
  handleSearch,
  minRange,
  setMinRange,
  maxRange,
  setMaxRange,
  difficulty,
  setDifficulty,
}) => {
  useEffect(() => {
    if (keyword.trim() !== "") {
      handleSearch();
    }
  }, difficulty);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-section">
      <SearchBar keyword={keyword} setKeyword={setKeyword} onSearch={handleSearch} />
      <div className="filter-section">
        <div className="range-section">
          <span>등산로 길이</span>
          <RangeInput
            value={minRange}
            setValue={setMinRange}
            placeholder="최소"
            onKeyDown={handleKeyDown}
          />
          <RangeInput
            value={maxRange}
            setValue={setMaxRange}
            placeholder="최대"
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="difficulty-section">
          <span>난이도</span>
          <DifficultyDropdown
            value={difficulty}
            setValue={(value) => {
              setDifficulty(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilterSection;
