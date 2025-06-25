import { GetRequestUrl } from "./requestURL";
import React, { useEffect, useState } from "react";

function GetData({ item }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(GetRequestUrl(item));
      const json = await response.json();
      setData(json);
    })();
  }, [item]);

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default GetData;
