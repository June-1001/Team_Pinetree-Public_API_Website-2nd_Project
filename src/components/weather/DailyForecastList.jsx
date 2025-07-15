import React from "react";

export default function DailyForecastList({
  dailyForecast,
  selectedForecastDate,
  setSelectedForecastDate,
}) {
  if (!dailyForecast) return null;

  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ marginBottom: 12, fontWeight: "700", color: "#222" }}>
        3일 단기 예보 (클릭 시 시간별 단기예보 표시)
      </h3>
      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
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
                style={{
                  minWidth: 200,
                  borderRadius: 12,
                  border: isSelected ? "2px solid #6e9bcbff" : "1px solid #ddd",
                  backgroundColor: isSelected ? "#e6f0ff" : "#fafafa",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  padding: 16,
                  userSelect: "none",
                  transition: "all 0.25s ease",
                }}
              >
                <div
                  style={{
                    alignSelf: "center",
                    width: 70,
                    height: 70,
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "600",
                    fontSize: 16,
                    marginBottom: 12,
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <div style={{ fontSize: 18, marginTop: 2 }}>{dayName}</div>

                  <div>{date.slice(4, 6)}/{date.slice(6)}</div>
                </div>


                <div style={{ flexGrow: 1 }}>
                  <div style={{ marginBottom: 12 }}>
                    <b>아침 기온</b>
                    <div style={{ fontSize: 18, color: "#f05454" }}>
                      {tempAM}℃
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <b>낮 기온</b>
                    <div style={{ fontSize: 18, color: "#ff793f" }}>
                      {tempPM}℃
                    </div>
                  </div>
                  <div>
                    <b>강수확률</b>
                    <div style={{ fontSize: 16, color: "#4096ff" }}>
                      오전: {popAM}% <br /> 오후: {popPM}%
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
