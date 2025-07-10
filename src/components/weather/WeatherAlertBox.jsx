export default function WeatherAlertBox({ alerts }) {
  return (
    <div style={{ border: "2px solid red", padding: 12, marginTop: 20 }}>
      <h4>기상 경고</h4>
      <ul>
        {alerts.map((a, idx) => (
          <li key={idx}>
            <strong>{a.type} {a.level !== "-" ? a.level : ""}:</strong> {a.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
