export function useWeatherAlert(forecastCategories) {
  const alerts = [];

  if (!forecastCategories) {
    return [
      { type: "폭염", level: "-", message: "해당 없음" },
      { type: "강풍", level: "-", message: "해당 없음" },
      { type: "호우", level: "-", message: "해당 없음" },
    ];
  }

  const currentTemp = parseFloat(forecastCategories["TMP"]);
  const windSpeed = parseFloat(forecastCategories["WSD"]);
  const rawRain = forecastCategories["PCP"];
  const rain1hr =
    rawRain === "강수없음" ? 0 : parseFloat(rawRain);


  const feelsLike =
    !isNaN(currentTemp) && !isNaN(windSpeed)
      ? calcFeelsLike(currentTemp, windSpeed)
      : null;

  // 폭염
  if (feelsLike != null) {
    if (feelsLike >= 35) {
      alerts.push({ type: "폭염", level: "경보", message: `체감온도 ${feelsLike.toFixed(1)}℃ 이상입니다.` });
    } else if (feelsLike >= 33) {
      alerts.push({ type: "폭염", level: "주의보", message: `체감온도 ${feelsLike.toFixed(1)}℃ 이상입니다.` });
    } else {
      alerts.push({ type: "폭염", level: "-", message: "해당 없음" });
    }
  } else {
    alerts.push({ type: "폭염", level: "-", message: "데이터 부족" });
  }

  // 강풍
  if (!isNaN(windSpeed)) {
    if (windSpeed >= 21) {
      alerts.push({ type: "강풍", level: "경보", message: `풍속 ${windSpeed}m/s` });
    } else if (windSpeed >= 14) {
      alerts.push({ type: "강풍", level: "주의보", message: `풍속 ${windSpeed}m/s` });
    } else {
      alerts.push({ type: "강풍", level: "-", message: "해당 없음" });
    }
  } else {
    alerts.push({ type: "강풍", level: "-", message: "데이터 부족" });
  }

  // 호우
  if (!isNaN(rain1hr)) {
    if (rain1hr >= 90) {
      alerts.push({ type: "호우", level: "경보", message: `강수량 ${rain1hr}mm` });
    } else if (rain1hr >= 60) {
      alerts.push({ type: "호우", level: "주의보", message: `강수량 ${rain1hr}mm` });
    } else {
      alerts.push({ type: "호우", level: "-", message: "해당 없음" });
    }
  } else {
    alerts.push({ type: "호우", level: "-", message: "데이터 부족" });
  }

  return alerts;
}

function calcFeelsLike(temp, wind) {
  if (temp == null || wind == null) return null;
  return parseFloat(
    (
      13.12 +
      0.6215 * temp -
      11.37 * Math.pow(wind, 0.16) +
      0.3965 * Math.pow(wind, 0.16) * temp
    ).toFixed(1)
  );
}
