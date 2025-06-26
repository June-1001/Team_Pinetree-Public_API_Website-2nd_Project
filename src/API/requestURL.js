const apiParams = {
  // 한국등산트레킹지원센터_전국주요봉우리 문화자원 POI 정보 서비스
  cultural: {
    url: `https://apis.data.go.kr/B553662/culturalInfoService`,
    numOfRows: 10,
    pageNo: 1,
    type: "json",

    //숲길명
    srchFrtrlNm: "",
  },

  // 한국등산트레킹지원센터_전국주요봉우리 건강효과 POI 정보 서비스
  health: {
    url: `https://apis.data.go.kr/B553662/hlthEffctInfoService`,
    numOfRows: 10,
    pageNo: 1,
    type: "json",

    // 숲길명
    srchFrtrlNm: "",

    // 난이도 : 001 - 쉬움 / 002 - 보통 / 003 - 어려움
    srchDgdfCd: "",
  },

  // 기상청_단기예보 ((구)_동네예보) 조회서비스
  weather: {
    url: `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0`,
    pageNo: 1,
    numOfRows: 1000,
    dataType: "json",

    // 측정 일자
    base_date: "20250625",

    // 측정 시간
    base_time: "0500",

    // 좌표
    nx: 55,
    ny: 127,
  },
};

// API 키
const dataApiKey = `ErCuM5KvYasv6PiohNILSbv%2BloBCCBgMSv2rgzbrGMxQpVDNjuLn%2B3yhaGiW3ftEEcm58h0r%2BIUpyn8bJi4lLQ%3D%3D`;

// 공공 API 요청 URL 생성
export function GetRequestUrl(item) {
  if (!apiParams[item]) return null;

  let baseUrl = "";
  const params = [];

  if (item === "cultural") {
    baseUrl = apiParams[item].url + "/getCulturalInfoList?";
    if (apiParams[item].numOfRows) {
      params.push("numOfRows=" + apiParams[item].numOfRows);
    }
    if (apiParams[item].pageNo) {
      params.push("pageNo=" + apiParams[item].pageNo);
    }
    params.push("serviceKey=" + dataApiKey);
    if (apiParams[item].type) {
      params.push("type=" + apiParams[item].type);
    }
    if (apiParams[item].srchFrtrlNm) {
      params.push("srchFrtrlNm=" + encodeURIComponent(apiParams[item].srchFrtrlNm));
    }
  }

  if (item === "health") {
    baseUrl = apiParams[item].url + "/getHlthEffctInfoList?";
    if (apiParams[item].numOfRows) {
      params.push("numOfRows=" + apiParams[item].numOfRows);
    }
    if (apiParams[item].pageNo) {
      params.push("pageNo=" + apiParams[item].pageNo);
    }
    params.push("serviceKey=" + dataApiKey);
    if (apiParams[item].type) {
      params.push("type=" + apiParams[item].type);
    }
    if (apiParams[item].srchFrtrlNm) {
      params.push("srchFrtrlNm=" + encodeURIComponent(apiParams[item].srchFrtrlNm));
    }
    if (apiParams[item].srchDgdfCd) {
      params.push("srchDgdfCd=" + apiParams[item].srchDgdfCd);
    }
  }

  if (item === "weather") {
    baseUrl = apiParams[item].url + "/getVilageFcst?";
    params.push("serviceKey=" + dataApiKey);
    if (apiParams[item].pageNo) {
      params.push("pageNo=" + apiParams[item].pageNo);
    }
    if (apiParams[item].numOfRows) {
      params.push("numOfRows=" + apiParams[item].numOfRows);
    }
    if (apiParams[item].dataType) {
      params.push("dataType=" + apiParams[item].dataType);
    }
    if (apiParams[item].base_date) {
      params.push("base_date=" + apiParams[item].base_date);
    }
    if (apiParams[item].base_time) {
      params.push("base_time=" + apiParams[item].base_time);
    }
    if (apiParams[item].nx) {
      params.push("nx=" + apiParams[item].nx);
    }
    if (apiParams[item].ny) {
      params.push("ny=" + apiParams[item].ny);
    }
  }

  return baseUrl + params.join("&");
}
