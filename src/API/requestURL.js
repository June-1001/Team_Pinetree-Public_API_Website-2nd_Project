// API 키
const publicDataApiKey = `ErCuM5KvYasv6PiohNILSbv%2BloBCCBgMSv2rgzbrGMxQpVDNjuLn%2B3yhaGiW3ftEEcm58h0r%2BIUpyn8bJi4lLQ%3D%3D`;
const vworldApiKey = `31198BF5-179E-3380-947F-F97448ED7D34`;

const apiParams = {
  // 기상청_단기예보 ((구)_동네예보) 조회서비스
  weather: {
    url: `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0`,
    pageNo: 1,
    numOfRows: 1000,
    dataType: "json",

    base_date: "20250630",
    base_time: "0500",
    nx: 55,
    ny: 127,
  },

  // V-WORLD 등산로 API
  hiking: {
    url: "https://api.vworld.kr/req/data",
    domain: "localhost:3000",
    service: "data",
    request: "getfeature",
    format: "json",
    data: "LT_L_FRSTCLIMB",
    size: 1000,
    page: 1,
    geomFilter: setHikingGeomFilterFromPoint({ x: 126.96, y: 37.65 }, 3),
    attrFilter: `cat_nam:=:하|mntn_nm:=:족두리봉아래`,
  },
};

// V-WORLD 좌표 지정
function setHikingGeomFilterFromPoint(point, bufferKm) {
  const bufferLat = bufferKm / 111;
  const bufferLon = bufferKm / (111 * Math.cos((point.y * Math.PI) / 180));

  const round = (num) => Math.round(num * 1000) / 1000;

  const minx = round(point.x - bufferLon);
  const maxx = round(point.x + bufferLon);
  const miny = round(point.y - bufferLat);
  const maxy = round(point.y + bufferLat);

  return `BOX(${minx},${miny},${maxx},${maxy})`;
}

// 공공 API 요청 URL 생성
export function GetRequestUrl(item) {
  const apiType = apiParams[item];
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

    if (apiType.nx) {
      params.push("nx=" + apiType.nx);
    }

    if (apiType.ny) {
      params.push("ny=" + apiType.ny);
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
