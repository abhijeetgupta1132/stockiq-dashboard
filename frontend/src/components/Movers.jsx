// Movers.jsx
// Shows top gainer and top loser cards

export default function Movers({ movers }) {
  if (!movers) return null;

  const gainer = movers.top_gainers[0];
  const loser = movers.top_losers[0];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <MoverCard
        label="🟢 TOP GAINER"
        data={gainer}
        color="var(--green)"
        bg="rgba(34,197,94,0.07)"
        border="rgba(34,197,94,0.2)"
      />
      <MoverCard
        label="🔴 TOP LOSER"
        data={loser}
        color="var(--red)"
        bg="rgba(239,68,68,0.07)"
        border="rgba(239,68,68,0.2)"
      />
    </div>
  );
}

function MoverCard({ label, data, color, bg, border }) {
  if (!data) return null;
  const sign = data.daily_return >= 0 ? "+" : "";
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted2)",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>{data.symbol}</div>
        <div
          style={{ fontSize: "0.75rem", color: "var(--muted2)", marginTop: 2 }}
        >
          ₹{data.close?.toFixed(2)}
        </div>
      </div>
      <div
        style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "1.3rem",
          fontWeight: 700,
          color,
        }}
      >
        {sign}
        {data.daily_return.toFixed(2)}%
      </div>
    </div>
  );
}
