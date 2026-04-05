// CompareChart.jsx
// Compare two stocks' daily returns side by side with correlation

import { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
          {p.name}: {Number(p.value).toFixed(3)}%
        </p>
      ))}
    </div>
  );
};

export default function CompareChart({ symbol, companies, API }) {
  const others = companies.filter((c) => c.symbol !== symbol);
  const [sym2, setSym2] = useState(others[0]?.symbol || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function compare() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/compare`, {
        params: { symbol1: symbol, symbol2: sym2, days: 30 },
      });
      setResult(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

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
        <h3 style={{ fontSize: "0.88rem", fontWeight: 700 }}>
          ⚖️ Compare with Another Stock
        </h3>
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
          Daily Return %
        </span>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <select
          value={sym2}
          onChange={(e) => setSym2(e.target.value)}
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border2)",
            borderRadius: 8,
            color: "var(--text)",
            padding: "8px 12px",
            fontFamily: "'Syne',sans-serif",
            fontSize: "0.85rem",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {others.map((c) => (
            <option key={c.symbol} value={c.symbol}>
              {c.symbol}
            </option>
          ))}
        </select>

        <button
          onClick={compare}
          disabled={loading}
          style={{
            background: "var(--accent)",
            border: "none",
            borderRadius: 8,
            color: "#000",
            padding: "9px 18px",
            fontFamily: "'Syne',sans-serif",
            fontSize: "0.85rem",
            fontWeight: 700,
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : "Compare"}
        </button>

        {result && (
          <div
            style={{
              marginLeft: "auto",
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.7rem",
              background: "rgba(14,165,233,0.1)",
              border: "1px solid rgba(14,165,233,0.25)",
              borderRadius: 20,
              padding: "5px 14px",
              color: "var(--blue)",
            }}
          >
            r = {result.correlation} · {result.interpretation}
          </div>
        )}
      </div>

      {/* Chart */}
      {result && (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={result.data}
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
            <Legend
              wrapperStyle={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey={symbol}
              stroke="#00ff88"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey={sym2}
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {!result && (
        <div
          style={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted)",
            fontSize: "0.85rem",
          }}
        >
          Select a stock and click Compare
        </div>
      )}
    </div>
  );
}
