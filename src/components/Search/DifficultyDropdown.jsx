import React from "react";

const DifficultyDropdown = ({ value, setValue }) => {
  const options = ["전체", "상", "중", "하"];

  return (
    <select
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

export default DifficultyDropdown;
