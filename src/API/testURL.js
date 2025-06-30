import React, { useEffect, useState } from "react";
import { GetRequestUrl } from "./requestURL";

function DataTest({ item }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const url = GetRequestUrl(item);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        console.log(`Fetched "${item}" data:`, json);
      })
      .catch((err) => {
        console.error(`Error fetching "${item}":`, err);
      });
  }, [item]);

  return (
    <div>
      <h2>Fetched Data for "{item}"</h2>
      <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
    </div>
  );
}

export default DataTest;
