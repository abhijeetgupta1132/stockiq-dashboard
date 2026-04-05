// dataPrep.js
// Fetches 1 year of NSE stock data from Yahoo Finance
// Cleans data and computes metrics, saves to SQLite
// Run once with: npm run prepare-data

const axios = require("axios");
const db = require("./db");

const COMPANIES = {
  RELIANCE: "RELIANCE.NS",
  TCS: "TCS.NS",
  INFY: "INFY.NS",
  HDFCBANK: "HDFCBANK.NS",
  WIPRO: "WIPRO.NS",
};

// Fetch raw OHLCV data from Yahoo Finance (free, no API key)
async function fetchData(ticker) {
  const end = Math.floor(Date.now() / 1000);
  const start = end - 365 * 24 * 60 * 60;

  const res = await axios.get(
    `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`,
    {
      params: { period1: start, period2: end, interval: "1d" },
      headers: { "User-Agent": "Mozilla/5.0" },
    },
  );

  const result = res.data.chart.result[0];
  const timestamps = result.timestamp;
  const q = result.indicators.quote[0];

  return timestamps
    .map((ts, i) => ({
      date: new Date(ts * 1000).toISOString().slice(0, 10),
      open: q.open[i],
      high: q.high[i],
      low: q.low[i],
      close: q.close[i],
      volume: q.volume[i],
    }))
    .filter((r) => r.open && r.high && r.low && r.close && r.volume);
}

// Rolling helpers (replaces NumPy)
const rollingMean = (arr, w) =>
  arr.map((_, i) => {
    const s = arr.slice(Math.max(0, i - w + 1), i + 1);
    return s.reduce((a, b) => a + b, 0) / s.length;
  });

const rollingMax = (arr, w) =>
  arr.map((_, i) => Math.max(...arr.slice(Math.max(0, i - w + 1), i + 1)));

const rollingMin = (arr, w) =>
  arr.map((_, i) => Math.min(...arr.slice(Math.max(0, i - w + 1), i + 1)));

const rollingStd = (arr, w) =>
  arr.map((_, i) => {
    const s = arr.slice(Math.max(0, i - w + 1), i + 1);
    const mean = s.reduce((a, b) => a + b, 0) / s.length;
    return Math.sqrt(s.reduce((a, b) => a + (b - mean) ** 2, 0) / s.length);
  });

// Compute all metrics for each row
function addMetrics(rows) {
  const dailyReturns = rows.map((r) => ((r.close - r.open) / r.open) * 100);
  const ma7 = rollingMean(
    rows.map((r) => r.close),
    7,
  );
  const high52w = rollingMax(
    rows.map((r) => r.high),
    252,
  );
  const low52w = rollingMin(
    rows.map((r) => r.low),
    252,
  );
  const stdArr = rollingStd(dailyReturns, 14);
  const maxStd = Math.max(...stdArr) || 1;

  return rows.map((r, i) => ({
    ...r,
    daily_return: +dailyReturns[i].toFixed(4),
    ma_7: +ma7[i].toFixed(2),
    high_52w: +high52w[i].toFixed(2),
    low_52w: +low52w[i].toFixed(2),
    volatility_score: +((stdArr[i] / maxStd) * 100).toFixed(2),
  }));
}

function saveCompanies() {
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO companies (symbol, yf_ticker, exchange) VALUES (?, ?, ?)`,
  );
  for (const [sym, ticker] of Object.entries(COMPANIES))
    stmt.run(sym, ticker, "NSE");
}

function saveStockData(symbol, rows) {
  db.exec(`DELETE FROM stock_data WHERE symbol = '${symbol}'`);
  const stmt = db.prepare(`
    INSERT INTO stock_data
      (symbol,date,open,high,low,close,volume,daily_return,ma_7,high_52w,low_52w,volatility_score)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  db.transaction((list) => {
    for (const r of list)
      stmt.run(
        symbol,
        r.date,
        r.open,
        r.high,
        r.low,
        r.close,
        r.volume,
        r.daily_return,
        r.ma_7,
        r.high_52w,
        r.low_52w,
        r.volatility_score,
      );
  })(rows);
}

async function main() {
  console.log("💾 Saving companies...");
  saveCompanies();

  for (const [symbol, ticker] of Object.entries(COMPANIES)) {
    console.log(`📡 Fetching ${symbol}...`);
    try {
      const rows = addMetrics(await fetchData(ticker));
      saveStockData(symbol, rows);
      console.log(`  ✓ ${rows.length} rows`);
    } catch (e) {
      console.error(`  ✗ ${e.message}`);
    }
  }

  console.log("\n✅ Done!");
  process.exit(0);
}

main();
