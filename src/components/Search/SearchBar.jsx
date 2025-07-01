import React from "react";

const SearchBar = ({ keyword, setKeyword, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder="검색어를 입력하세요"
      />
      <button onClick={onSearch}>검색</button>
    </div>
  );
};

export default SearchBar;
