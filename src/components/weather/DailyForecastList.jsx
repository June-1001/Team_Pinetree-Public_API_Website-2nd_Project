import React from "react";

export default function DailyForecastList({
  dailyForecast,
  selectedForecastDate,
  setSelectedForecastDate,
}) {
  if (!dailyForecast) return null;

  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ marginBottom: 8 }}>3일 단기 예보 (클릭 시 시간별 단기예보 표시)</h3>
      <div className="daily-forecasts-container-align">
        {Object.entries(dailyForecast)
          .slice(0, 3)
          .map(([date, times]) => {
            const am = times["0600"] || {};
            const pm = times["1500"] || {};
            const tempAM = am.TMN || am.T1H || "-";
            const tempPM = pm.TMX || pm.T1H || "-";
            const popAM = am.POP || "-";
            const popPM = pm.POP || "-";
            const dayName = new Date(
              `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`
            ).toLocaleDateString("ko-KR", { weekday: "short" });

            return (
              <div className="daily-forecasts-container">
                <div
                  className="daily-forecasts"
                  key={date}
                  onClick={() => setSelectedForecastDate(date)}
                  style={{
                    padding: 12,
                    border: selectedForecastDate === date ? "2px solid #007bff" : "1px solid #ccc",
                    borderRadius: 6,
                    cursor: "pointer",
                    backgroundColor: selectedForecastDate === date ? "#e6f0ff" : "transparent",
                  }}
                >
                  <div
                    className="daily-day-list"
                    style={{
                      backgroundColor: selectedForecastDate === date ? "#007bff" : "#ccc",
                      color: selectedForecastDate === date ? "#fff" : "#333",
                    }}
                  >
                    {date.slice(4, 6)}/{date.slice(6)} ({dayName})
                  </div>
                  <div className="daily-list">
                    <div>
                      <b>아침 기온</b>
                      <br /> {tempAM}℃
                    </div>
                    <div>
                      <b>낮 기온</b>
                      <br /> {tempPM}℃
                    </div>
                    <div>
                      <b>강수확률</b>
                      <br /> 오전: {popAM}% <br /> 오후: {popPM}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
