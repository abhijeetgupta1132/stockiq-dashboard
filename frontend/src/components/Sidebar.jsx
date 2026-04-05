// Sidebar.jsx
// Left panel with company watchlist and market movers

export default function Sidebar({ companies, movers, selected, onSelect }) {
  const moverMap = {};
  movers?.all?.forEach((m) => {
    moverMap[m.symbol] = m.daily_return;
  });

  return (
    <aside
      style={{
        width: 230,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        padding: "22px 14px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.18em",
          color: "var(--muted)",
          textTransform: "uppercase",
          padding: "0 10px",
          marginBottom: 10,
        }}
      >
        Watchlist
      </div>

      {companies.map((c) => {
        const ret = moverMap[c.symbol] ?? 0;
        const isPos = ret >= 0;
        const active = selected === c.symbol;
        return (
          <button
            key={c.symbol}
            onClick={() => onSelect(c.symbol)}
            style={{
              width: "100%",
              background: active ? "rgba(0,255,136,0.07)" : "transparent",
              border: `1px solid ${active ? "rgba(0,255,136,0.22)" : "transparent"}`,
              borderRadius: 10,
              color: active ? "var(--accent)" : "var(--muted2)",
              padding: "11px 13px",
              textAlign: "left",
              cursor: "pointer",
              fontFamily: "'Syne',sans-serif",
              fontSize: "0.9rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.18s",
            }}
          >
            <span>{c.symbol}</span>
            <span
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.62rem",
                padding: "2px 7px",
                borderRadius: 5,
                background: isPos
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(239,68,68,0.15)",
                color: isPos ? "var(--green)" : "var(--red)",
              }}
            >
              {isPos ? "+" : ""}
              {ret.toFixed(2)}%
            </span>
          </button>
        );
      })}

      {/* Divider */}
      <div
        style={{ height: 1, background: "var(--border)", margin: "12px 0" }}
      />

      {/* Movers */}
      {movers && (
        <div style={{ padding: "0 4px" }}>
          <div
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              color: "var(--muted)",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Market Movers
          </div>
          <MoverCard
            label="TOP GAINER"
            data={movers.top_gainers[0]}
            color="var(--green)"
            bg="rgba(34,197,94,0.07)"
            border="rgba(34,197,94,0.18)"
          />
          <div style={{ height: 6 }} />
          <MoverCard
            label="TOP LOSER"
            data={movers.top_losers[0]}
            color="var(--red)"
            bg="rgba(239,68,68,0.07)"
            border="rgba(239,68,68,0.18)"
          />
        </div>
      )}
    </aside>
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
        borderRadius: 8,
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.1em",
          color: "var(--muted2)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 700 }}>{data.symbol}</span>
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.8rem",
            color,
          }}
        >
          {sign}
          {data.daily_return.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
