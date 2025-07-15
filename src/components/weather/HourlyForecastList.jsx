import React from "react";
import {Line,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,ComposedChart,} from "recharts";
import { getSkyLabel, getPtyLabel } from "../../utils/weatherUtils";

export default function HourlyForecastList({ selectedForecastDate, filteredForecast }) {
  if (!filteredForecast || filteredForecast.length === 0) return null;

  const formattedDate = new Date(
    selectedForecastDate.slice(0, 4),
    parseInt(selectedForecastDate.slice(4, 6)) - 1,
    selectedForecastDate.slice(6)
  ).toLocaleDateString("ko-KR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const chartData = filteredForecast
    .filter((item) => parseInt(item.fcstTime.slice(0, 2)) % 3 === 2)
    .map((item) => ({
      time: `${item.fcstTime.slice(0, 2)}시`,
      temperature: parseFloat(item.categories.TMP),
      pop: parseInt(item.categories.POP) || 0,
      sky: getSkyLabel(item.categories.SKY),
      pty: getPtyLabel(item.categories.PTY),
    }));

  return (

    <div style={{width: 700, overflowX: "auto",marginTop: 32,padding: 24,backgroundColor: "#ffffff",borderRadius: 16, boxShadow: "0 6px 18px rgba(0,0,0,0.08)",}}>
      <h3 style={{ fontSize: 20, fontWeight: "700", color: "#222", marginBottom: 16 }}>
        {formattedDate} 시간별 예보
      </h3>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: 12,
          paddingBottom: 16,
        }}
      >
        {chartData.map((item) => (
          <div
            key={item.time}
            style={{
              minWidth: 80,
              backgroundColor: "#f7f9fb",
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: "8px 10px",
              textAlign: "center",
              fontSize: 13,
              color: "#333",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontWeight: 600 }}>{item.time}</div>
            <div>{item.sky}</div>
            <div>{item.temperature}℃</div>
            <div style={{ color: "#1890ff" }}>{item.pop}%</div>
          </div>
        ))}
>>>>>>> Stashed changes
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#eaeaea" />
          <XAxis
            dataKey="time"
            tick={{ fill: "#444", fontSize: 12 }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
          />

          <YAxis
            yAxisId="left"
            label={{
              angle: -90,
              position: "insideLeft",
              style: { fill: "#666", fontWeight: 600 },
            }}
            tick={{ fill: "#444", fontSize: 12 }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
            domain={[0, 100]}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              angle: -90,
              position: "insideRight",
              style: { fill: "#666", fontWeight: 600 },
            }}
            tick={{ fill: "#444", fontSize: 12 }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
            domain={['dataMin - 3', 'dataMax + 3']}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#2c3e50",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#fff",
              fontSize: 13,
            }}
            formatter={(value, name) => {
              if (name === "pop") return [`${value}%`, "강수확률"];
              if (name === "temperature") return [`${value}℃`, "기온"];
              return value;
            }}
            labelFormatter={(label, payload) => {
              const item = payload?.[0]?.payload;
              return `${label} (${item.sky}, ${item.pty})`;
            }}
          />

          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              fontSize: 13,
              fontWeight: "500",
              color: "#333",
            }}
          />

          <Bar
            yAxisId="right"
            dataKey="temperature"
            barSize={22}
            fill="#E86767"
            radius={[6, 6, 0, 0]}
            name="기온"
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="pop"
            stroke="#40a9ff"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#40a9ff", stroke: "#fff" }}
            activeDot={{ r: 6 }}
            name="강수확률"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
