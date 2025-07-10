

export const skyMap = {
  1: "맑음 ☀️",
  3: "구름 많음 ⛅",
  4: "흐림 ☁️",
};

export const ptyMap = {
  0: "없음",
  1: "비",
  2: "비/눈",
  3: "눈",
  4: "소나기",
};

export const getSkyLabel = (code) => skyMap[code] || "-";
export const getPtyLabel = (code) => ptyMap[code] || "-";
