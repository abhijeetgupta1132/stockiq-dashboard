import { useState } from "react";
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

// ── Simple Linear Regression prediction ──────────────────────────────────
// This is the "ML model" — predicts next 7 days price using least squares
function linearRegression(data) {
  const n = data.length;
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((a, b) => a + b, 0) / n;

  let num = 0,
    den = 0;
  data.forEach((y, x) => {
    num += (x - xMean) * (y - yMean);
    den += (x - xMean) ** 2;
  });

  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;

  // Predict next 7 days
  const predictions = [];
  for (let i = 1; i <= 7; i++) {
    predictions.push(+(intercept + slope * (n - 1 + i)).toFixed(2));
  }
  return { slope, predictions };
}

// Generate fake future dates like "04-10", "04-11" etc
function futureDates(lastDate, count) {
  const dates = [];
  const d = new Date(lastDate);
  for (let i = 1; i <= count; i++) {
    d.setDate(d.getDate() + 1);
    // Skip weekends
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    if (d.getDay() === 6) d.setDate(d.getDate() + 2);
    dates.push(d.toISOString().slice(5, 10));
  }
  return dates;
}

export default function StockChart({ data, symbol }) {
  const [days, setDays] = useState(30);
  const [showPredict, setShowPredict] = useState(false);

  // Filter data by selected days
  const filtered = data.slice(-days);
  const labels = filtered.map((r) => r.date.slice(5));

  // Build prediction data
  const closes = filtered.map((r) => r.close);
  const { predictions } = linearRegression(closes);
  const lastDate = filtered[filtered.length - 1]?.date || "";
  const futureLabels = futureDates(lastDate, 7);

  // Merge actual + prediction into one array for the chart
  const chartData = [
    ...filtered.map((r) => ({
      date: r.date.slice(5),
      close: r.close,
      ma_7: r.ma_7,
      prediction: null,
    })),
    // Bridge point — connect actual to prediction line
    {
      date: filtered[filtered.length - 1]?.date.slice(5),
      close: null,
      ma_7: null,
      prediction: filtered[filtered.length - 1]?.close,
    },
    ...futureLabels.map((date, i) => ({
      date,
      close: null,
      ma_7: null,
      prediction: predictions[i],
    })),
  ];

  const fmtVol = (v) =>
    v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : `${(v / 1e5).toFixed(0)}L`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Day filter buttons ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.7rem",
            color: "var(--muted2)",
            marginRight: 4,
          }}
        >
          FILTER:
        </span>
        {[30, 60, 90].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            style={{
              background: days === d ? "var(--accent)" : "var(--surface2)",
              border: `1px solid ${days === d ? "var(--accent)" : "var(--border2)"}`,
              borderRadius: 8,
              color: days === d ? "#000" : "var(--muted2)",
              padding: "6px 14px",
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.72rem",
              cursor: "pointer",
              fontWeight: days === d ? 700 : 400,
              transition: "all 0.15s",
            }}
          >
            {d}D
          </button>
        ))}

        {/* Prediction toggle */}
        <button
          onClick={() => setShowPredict((p) => !p)}
          style={{
            marginLeft: "auto",
            background: showPredict
              ? "rgba(139,92,246,0.15)"
              : "var(--surface2)",
            border: `1px solid ${showPredict ? "#8b5cf6" : "var(--border2)"}`,
            borderRadius: 8,
            color: showPredict ? "#8b5cf6" : "var(--muted2)",
            padding: "6px 14px",
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.72rem",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          🤖 {showPredict ? "Hide" : "Show"} Prediction
        </button>
      </div>

      {/* ── Price + MA + Prediction Chart ── */}
      <ChartBox
        title="📈 Closing Price + 7-Day Moving Average"
        tag={`Last ${days} Days${showPredict ? " + 7-Day Forecast" : ""}`}
      >
        {showPredict && (
          <div
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: 8,
              padding: "8px 14px",
              marginBottom: 14,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.7rem",
              color: "#8b5cf6",
            }}
          >
            🤖 Prediction uses Linear Regression on closing prices. Next 7
            trading days forecast shown in purple. Not financial advice.
          </div>
        )}
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={
              showPredict
                ? chartData
                : filtered.map((r) => ({ ...r, date: r.date.slice(5) }))
            }
            margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              dataKey="date"
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
              tickFormatter={(v) => `₹${v?.toFixed(0)}`}
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
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="ma_7"
              name="7-Day MA"
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              connectNulls={false}
            />
            {showPredict && (
              <Line
                type="monotone"
                dataKey="prediction"
                name="Prediction (7D)"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={{ fill: "#8b5cf6", r: 3 }}
                connectNulls={true}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>

      {/* ── Daily Return Chart ── */}
      <ChartBox title="📊 Daily Return (%)" tag="Green = Gain · Red = Loss">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={filtered}
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
              {filtered.map((entry, i) => (
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

      {/* ── Volume Chart ── */}
      <ChartBox title="📦 Trading Volume" tag="Shares traded per day">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={filtered}
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
