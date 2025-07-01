function GetRequestUrl(apiType) {
  if (!apiType) {
    return "";
  }

  let baseUrl = "";
  const params = [];

  if (item === "weather") {
    baseUrl = apiType.url + "/getVilageFcst?";
    params.push("serviceKey=" + publicDataApiKey);

    if (apiType.pageNo) {
      params.push("pageNo=" + apiType.pageNo);
    }

    if (apiType.numOfRows) {
      params.push("numOfRows=" + apiType.numOfRows);
    }

    if (apiType.dataType) {
      params.push("dataType=" + apiType.dataType);
    }

    if (apiType.base_date) {
      params.push("base_date=" + apiType.base_date);
    }

    if (apiType.base_time) {
      params.push("base_time=" + apiType.base_time);
    }

    if (lat !== null && lon !== null) {
      const { x: nx, y: ny } = latlonToGrid(lat, lon);
      params.push("nx=" + nx);
      params.push("ny=" + ny);
    }
  }

  if (item === "hiking") {
    baseUrl = apiType.url + "?";
    params.push("key=" + vworldApiKey);

    if (apiType.service) {
      params.push("service=" + apiType.service);
    }

    if (apiType.request) {
      params.push("request=" + apiType.request);
    }

    if (apiType.format) {
      params.push("format=" + apiType.format);
    }

    if (apiType.data) {
      params.push("data=" + apiType.data);
    }

    if (apiType.size) {
      params.push("size=" + apiType.size);
    }

    if (apiType.page) {
      params.push("page=" + apiType.page);
    }

    if (apiType.domain) {
      params.push("domain=" + apiType.domain);
    }

    if (apiType.geomFilter) {
      params.push("geomFilter=" + apiType.geomFilter);
    }

    if (apiType.attrFilter) {
      params.push("attrFilter=" + apiType.attrFilter);
    }
  }

  return baseUrl + params.join("&");
}
