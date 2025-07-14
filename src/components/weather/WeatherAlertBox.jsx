export default function WeatherAlertBox({ alerts }) {
  const allClear = alerts.every((a) => a.message === "해당 없음");

  return (
    <div
      style={{
        border: `2px solid ${allClear ? "#2cc532" : "red"}`,
        padding: 12,
        marginTop: 20,
      }}
    >
      <h4>기상 경고</h4>
      <ul>
        {alerts.map((a, idx) => (
          <li key={idx}>
            <strong>
              {a.type} {a.level !== "-" ? a.level : ""}:
            </strong>{" "}
            {a.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
