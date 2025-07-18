import React from "react";

export default function DailyForecastList({
  dailyForecast,
  selectedForecastDate,
  setSelectedForecastDate,
}) {
  if (!dailyForecast) return null;

  return (
    <div className="daily-card">
      <h3 style={{ marginBottom: 12, fontWeight: "700", color: "#222" }}>
        3일 단기 예보 (클릭 시 시간별 단기예보 표시)
      </h3>

      <div className="daily-forecast-list">
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

            const isSelected = selectedForecastDate === date;

            return (
              <div
                key={date}
                onClick={() => setSelectedForecastDate(date)}
                className={`forecast-card ${isSelected ? "selected" : ""}`}
              >
                <div className="forecast-date">
                  <div className="date">
                    {date.slice(4, 6)}/{date.slice(6)}
                  </div>
                  <div className="day">{dayName}</div>
                  
                </div>

                <div className="forecast-info">
                  <div>
                    <b>아침 기온</b>
                    <div className="am-temp">{tempAM}℃</div>
                  </div>
                  <div>
                    <b>낮 기온</b>
                    <div className="pm-temp">{tempPM}℃</div>
                  </div>
                  <div>
                    <b>강수확률</b>
                    <div className="pop">
                      오전: {popAM}% <br />
                      오후: {popPM}%
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
