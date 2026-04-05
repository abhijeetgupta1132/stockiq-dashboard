// StockChart.jsx
// Price chart, Daily Return bar chart, Volume chart
// Uses Recharts library

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Custom dark tooltip
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--border2)",
        borderRadius: 8,
        padding: "10px 14px",
      }}
    >
      <p
        style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "0.7rem",
          color: "var(--muted2)",
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      {payload.map((p, i) => (
        <p
          key={i}
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.78rem",
            color: p.color,
          }}
        >
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function StockChart({ data, symbol }) {
  // Format volume: 1Cr, 50L etc
  const fmtVol = (v) =>
    v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : `${(v / 1e5).toFixed(0)}L`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Price + MA */}
      <ChartBox
        title="📈 Closing Price + 7-Day Moving Average"
        tag="Last 30 Days"
      >
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => d.slice(5)}
              tick={{
                fill: "#64748b",
                fontSize: 11,
                fontFamily: "'Space Mono',monospace",
              }}
            />
            <YAxis
              tick={{
                fill: "#64748b",
                fontSize: 11,
                fontFamily: "'Space Mono',monospace",
              }}
              tickFormatter={(v) => `₹${v.toFixed(0)}`}
              width={70}
            />
            <Tooltip content={<DarkTooltip />} />
            <Legend
              wrapperStyle={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="close"
              name="Close Price"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="ma_7"
              name="7-Day MA"
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>

      {/* Daily Return */}
      <ChartBox title="📊 Daily Return (%)" tag="Green = Gain · Red = Loss">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => d.slice(5)}
              tick={{
                fill: "#64748b",
                fontSize: 11,
                fontFamily: "'Space Mono',monospace",
              }}
            />
            <YAxis
              tick={{
                fill: "#64748b",
                fontSize: 11,
                fontFamily: "'Space Mono',monospace",
              }}
              tickFormatter={(v) => `${v.toFixed(1)}%`}
              width={55}
            />
            <Tooltip content={<DarkTooltip />} />
            <Bar
              dataKey="daily_return"
              name="Daily Return %"
              radius={[3, 3, 0, 0]}
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.daily_return >= 0 ? "#22c55e" : "#ef4444"}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>

      {/* Volume */}
      <ChartBox title="📦 Trading Volume" tag="Shares traded per day">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => d.slice(5)}
              tick={{
                fill: "#64748b",
                fontSize: 11,
                fontFamily: "'Space Mono',monospace",
              }}
            />
            <YAxis
              tick={{
                fill: "#64748b",
                fontSize: 11,
                fontFamily: "'Space Mono',monospace",
              }}
              tickFormatter={fmtVol}
              width={55}
            />
            <Tooltip
              content={<DarkTooltip />}
              formatter={(v) => [fmtVol(v), "Volume"]}
            />
            <Bar
              dataKey="volume"
              name="Volume"
              fill="#8b5cf6"
              fillOpacity={0.6}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

// Reusable chart wrapper box
function ChartBox({ title, tag, children }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "22px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <h3 style={{ fontSize: "0.88rem", fontWeight: 700 }}>{title}</h3>
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.62rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border2)",
            borderRadius: 6,
            padding: "3px 9px",
            color: "var(--muted2)",
          }}
        >
          {tag}
        </span>
      </div>
      {children}
    </div>
  );
}
