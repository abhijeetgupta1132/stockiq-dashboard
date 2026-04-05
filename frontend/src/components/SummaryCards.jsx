// SummaryCards.jsx
// The 6 metric cards at the top

export default function SummaryCards({ summary, latestReturn = 0 }) {
  const isPos = latestReturn >= 0;
  const sign = isPos ? "+" : "";

  const cards = [
    {
      label: "52W High",
      value: `₹${summary.high_52w}`,
      sub: "Yearly peak",
      color: "var(--blue)",
      top: "var(--blue)",
    },
    {
      label: "52W Low",
      value: `₹${summary.low_52w}`,
      sub: "Yearly bottom",
      color: "var(--red)",
      top: "var(--red)",
    },
    {
      label: "Avg Close (1Y)",
      value: `₹${summary.avg_close}`,
      sub: "Annual average",
      color: "var(--accent)",
      top: "var(--accent)",
    },
    {
      label: "Volatility Score",
      value: `${summary.avg_volatility}`,
      sub: "0 stable · 100 wild",
      color: "var(--orange)",
      top: "var(--orange)",
    },
    {
      label: "Daily Return",
      value: `${sign}${latestReturn.toFixed(2)}%`,
      sub: "Open → Close",
      color: isPos ? "var(--green)" : "var(--red)",
      top: isPos ? "var(--green)" : "var(--red)",
    },
    {
      label: "As of Date",
      value: summary.as_of_date,
      sub: "Latest data point",
      color: "var(--text)",
      top: "var(--muted2)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))",
        gap: 14,
      }}
    >
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "18px 20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg,${c.top},transparent)`,
            }}
          />
          <div
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted2)",
              marginBottom: 8,
            }}
          >
            {c.label}
          </div>
          <div
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: c.color,
            }}
          >
            {c.value}
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--muted2)",
              marginTop: 4,
            }}
          >
            {c.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
