import React from "react";

// 검색창 키워드
// 엔터 눌러서 검색 가능

const SearchBar = ({ keyword, setKeyword, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="search-bar">
      <span>지역/명칭</span>
      <input
        type="text"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder="지역검색 및 산명칭 검색"
      />
      <button onClick={onSearch}>검색</button>
    </div>
  );
};

export default SearchBar;
