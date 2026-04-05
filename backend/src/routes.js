// routes.js
// All REST API endpoints

const express = require("express");
const db = require("./db");
const router = express.Router();

// GET /companies
router.get("/companies", (req, res) => {
  const data = db.prepare("SELECT * FROM companies").all();
  if (!data.length)
    return res.status(404).json({ error: "Run: npm run prepare-data first" });
  res.json({ companies: data });
});

// GET /data/:symbol — supports ?days=30 (default), ?days=60, ?days=90
router.get("/data/:symbol", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const days = parseInt(req.query.days) || 30;
  const rows = db
    .prepare(
      `
    SELECT date, open, high, low, close, volume, daily_return, ma_7, volatility_score
    FROM stock_data WHERE symbol = ?
    ORDER BY date DESC LIMIT ?
  `,
    )
    .all(symbol, days);

  if (!rows.length)
    return res.status(404).json({ error: `No data for ${symbol}` });

  res.json({ symbol, count: rows.length, data: rows.reverse() });
});

// GET /summary/:symbol — 52 week stats
router.get("/summary/:symbol", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const row = db
    .prepare(
      `
    SELECT
      ROUND(MAX(high), 2)             AS high_52w,
      ROUND(MIN(low),  2)             AS low_52w,
      ROUND(AVG(close), 2)            AS avg_close,
      ROUND(MAX(close), 2)            AS latest_close,
      MAX(date)                       AS as_of_date,
      ROUND(AVG(volatility_score), 2) AS avg_volatility
    FROM stock_data WHERE symbol = ?
  `,
    )
    .get(symbol);

  if (!row?.high_52w)
    return res.status(404).json({ error: `No data for ${symbol}` });

  res.json({ symbol, ...row });
});

// GET /compare?symbol1=INFY&symbol2=TCS&days=30
router.get("/compare", (req, res) => {
  const s1 = (req.query.symbol1 || "").toUpperCase();
  const s2 = (req.query.symbol2 || "").toUpperCase();
  const days = parseInt(req.query.days) || 30;

  if (!s1 || !s2)
    return res.status(400).json({ error: "Provide symbol1 and symbol2" });

  const getReturns = (sym) =>
    db
      .prepare(
        `
      SELECT date, daily_return FROM stock_data
      WHERE symbol = ? ORDER BY date DESC LIMIT ?
    `,
      )
      .all(sym, days)
      .reverse();

  const r1 = getReturns(s1);
  const r2 = getReturns(s2);

  const map1 = Object.fromEntries(r1.map((r) => [r.date, r.daily_return]));
  const map2 = Object.fromEntries(r2.map((r) => [r.date, r.daily_return]));
  const dates = r1.map((r) => r.date).filter((d) => map2[d] !== undefined);
  const a1 = dates.map((d) => map1[d]);
  const a2 = dates.map((d) => map2[d]);

  const mean1 = a1.reduce((a, b) => a + b, 0) / a1.length;
  const mean2 = a2.reduce((a, b) => a + b, 0) / a2.length;
  const num = a1.reduce((s, v, i) => s + (v - mean1) * (a2[i] - mean2), 0);
  const den = Math.sqrt(
    a1.reduce((s, v) => s + (v - mean1) ** 2, 0) *
      a2.reduce((s, v) => s + (v - mean2) ** 2, 0),
  );
  const correlation = den === 0 ? 0 : +(num / den).toFixed(4);

  res.json({
    symbol1: s1,
    symbol2: s2,
    days,
    correlation,
    interpretation:
      correlation > 0.7
        ? "Strong positive correlation"
        : correlation > 0.3
          ? "Moderate correlation"
          : correlation > -0.3
            ? "Weak or no correlation"
            : correlation > -0.7
              ? "Moderate negative correlation"
              : "Strong negative correlation",
    data: dates.map((d) => ({ date: d, [s1]: map1[d], [s2]: map2[d] })),
  });
});

// GET /movers
router.get("/movers", (req, res) => {
  const rows = db
    .prepare(
      `
    SELECT symbol, date, close, daily_return FROM stock_data
    WHERE (symbol, date) IN (
      SELECT symbol, MAX(date) FROM stock_data GROUP BY symbol
    )
    ORDER BY daily_return DESC
  `,
    )
    .all();

  res.json({
    as_of: rows[0]?.date || null,
    top_gainers: rows.slice(0, 2),
    top_losers: rows.slice(-2).reverse(),
    all: rows,
  });
});

module.exports = router;
