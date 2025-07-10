import axios from "axios";

const SERVICE_KEY = `Fn8nBDNNZn0hIRp85JkxCQhQUBSuaxYLC11J5xocF5WqxiLpogKvhdaKPkfyX5nyYhp9VAJKgLVNWSJ/n/J+Cw==`;

export async function fetchSunriseSunset({ lat, lon, date }) {
  if (!lat || !lon || !date) return null;

  const locdate = date.replace(/-/g, ""); 
  const latitude = parseFloat(lat).toFixed(7);    // 실수형반환

  
  const longitude = parseFloat(lon).toFixed(7);  
  const url = `https://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getLCRiseSetInfo?` +
              `serviceKey=${encodeURIComponent(SERVICE_KEY)}` +
              `&locdate=${locdate}` +
              `&longitude=${longitude}` +
              `&latitude=${latitude}` +
              `&dnYn=Y&_type=json`;

  try {
    console.log("[일출/일몰 API 요청 URL]", url);

    const response = await axios.get(url);
    const item = response.data?.response?.body?.items?.item;

    if (!item) return null;

    return {
      location: item.location,
      sunrise: item.sunrise,
      sunset: item.sunset,
      moonrise: item.moonrise,
      moonset: item.moonset,
    };
  } catch (error) {
    console.error("[일출/일몰 API 에러]", error);
    return null;
  }
}
