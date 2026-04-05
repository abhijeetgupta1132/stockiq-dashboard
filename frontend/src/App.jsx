// App.jsx
// Root component — holds state and layout

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import SummaryCards from "./components/SummaryCards";
import StockChart from "./components/StockChart";
import CompareChart from "./components/CompareChart";

const API = "http://localhost:5000/api";

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [movers, setMovers] = useState(null);
  const [selected, setSelected] = useState(null); // active symbol string
  const [stockData, setStockData] = useState(null); // last 30 days rows
  const [summary, setSummary] = useState(null); // 52w stats
  const [loading, setLoading] = useState(false);

  // Load companies + movers on mount
  useEffect(() => {
    axios.get(`${API}/companies`).then((r) => setCompanies(r.data.companies));
    axios.get(`${API}/movers`).then((r) => setMovers(r.data));
  }, []);

  // When a company is clicked
  async function selectCompany(symbol) {
    setSelected(symbol);
    setLoading(true);
    setStockData(null);
    setSummary(null);
    try {
      const [d, s] = await Promise.all([
        axios.get(`${API}/data/${symbol}`),
        axios.get(`${API}/summary/${symbol}`),
      ]);
      setStockData(d.data);
      setSummary(s.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 32px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(4,6,10,0.9)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg,#00ff88,#00cc6a)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(0,255,136,0.3)",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: "1.35rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Stock<span style={{ color: "var(--accent)" }}>IQ</span>
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.68rem",
              color: "var(--accent)",
              background: "rgba(0,255,136,0.07)",
              border: "1px solid rgba(0,255,136,0.18)",
              borderRadius: 20,
              padding: "5px 13px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: "var(--accent)",
                borderRadius: "50%",
                animation: "blink 2s infinite",
                display: "inline-block",
              }}
            />
            NSE LIVE
          </div>
          <Clock />
        </div>
      </header>

      {/* Body */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Sidebar
          companies={companies}
          movers={movers}
          selected={selected}
          onSelect={selectCompany}
        />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {!selected && <EmptyState />}
          {selected && loading && <Spinner />}
          {selected && !loading && stockData && summary && (
            <>
              {/* Stock title */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {selected}
                  </h2>
                  <p
                    style={{
                      color: "var(--muted2)",
                      fontSize: "0.82rem",
                      marginTop: 2,
                    }}
                  >
                    NSE India · Last 30 trading days
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "2.2rem",
                      fontWeight: 700,
                    }}
                  >
                    ₹{summary.latest_close}
                  </div>
                  <ReturnBadge
                    value={
                      stockData.data[stockData.data.length - 1]?.daily_return
                    }
                  />
                </div>
              </div>

              <SummaryCards
                summary={summary}
                latestReturn={
                  stockData.data[stockData.data.length - 1]?.daily_return
                }
              />
              <StockChart data={stockData.data} symbol={selected} />
              <CompareChart symbol={selected} companies={companies} API={API} />
            </>
          )}
        </main>
      </div>

      {/* Glow orbs */}
      <div
        style={{
          position: "fixed",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "#00ff88",
          filter: "blur(130px)",
          opacity: 0.07,
          top: -250,
          left: -200,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "#0ea5e9",
          filter: "blur(130px)",
          opacity: 0.07,
          bottom: -200,
          right: -100,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-IN", { hour12: false }),
  );
  useEffect(() => {
    const t = setInterval(
      () => setTime(new Date().toLocaleTimeString("en-IN", { hour12: false })),
      1000,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        fontFamily: "'Space Mono',monospace",
        fontSize: "0.78rem",
        color: "var(--muted2)",
      }}
    >
      {time}
    </div>
  );
}

function ReturnBadge({ value = 0 }) {
  const pos = value >= 0;
  const sign = pos ? "+" : "";
  return (
    <div
      style={{
        fontFamily: "'Space Mono',monospace",
        fontSize: "0.9rem",
        marginTop: 4,
        color: pos ? "var(--green)" : "var(--red)",
      }}
    >
      {sign}
      {value?.toFixed(2)}% today
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        color: "var(--muted)",
      }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.3 }}
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
      <p style={{ fontSize: "0.9rem" }}>Select a company from the watchlist</p>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid var(--border2)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}
