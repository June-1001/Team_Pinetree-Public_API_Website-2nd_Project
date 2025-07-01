import { latlonToGrid } from "../utils/latlonToGrid";

const publicDataApiKey = `ErCuM5KvYasv6PiohNILSbv%2BloBCCBgMSv2rgzbrGMxQpVDNjuLn%2B3yhaGiW3ftEEcm58h0r%2BIUpyn8bJi4lLQ%3D%3D`;

const weather = {
  url: `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0`,
  pageNo: 1,
  numOfRows: 1000,
  dataType: "json",
  base_date: getTodayDateString(),
  base_time: "0200",
};

// 오늘 날짜 받아오기
function getTodayDateString() {
  const now = new Date();
  if (now.getHours() < 2) {
    now.setDate(now.getDate() - 1);
  }
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}
