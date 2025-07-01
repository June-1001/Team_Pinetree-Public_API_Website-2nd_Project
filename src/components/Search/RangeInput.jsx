import React from "react";

const RangeInput = ({ value, setValue, placeholder }) => {
  const handleChange = (e) => {
    const input = e.target.value;
    if (input === "" || /^[0-9]*$/.test(input)) {
      setValue(input);
    }
  };

  return <input type="text" value={value} onChange={handleChange} placeholder={placeholder} />;
};

export default RangeInput;
