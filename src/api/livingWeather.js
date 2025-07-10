import axios from "axios";

export const SERVICE_KEY = "Fn8nBDNNZn0hIRp85JkxCQhQUBSuaxYLC11J5xocF5WqxiLpogKvhdaKPkfyX5nyYhp9VAJKgLVNWSJ%2Fn%2FJ%2BCw%3D%3D";


export async function fetchWindchillIndex(areaNo, date) {
  const url = `https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getWindchillIdxV4?serviceKey=${SERVICE_KEY}&areaNo=${areaNo}&time=${date}06&dataType=json`;

  try {
    const response = await axios.get(url);
    const items = response.data.response?.body?.items?.item;
    return items?.[0]?.today ?? null;
  } catch (err) {
    console.error("체감온도지수 불러오기 실패", err);
    return null;
  }
}
