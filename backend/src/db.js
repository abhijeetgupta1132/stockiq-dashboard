// db.js
// Sets up SQLite database connection and creates tables

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const db = new Database(path.join(dataDir, "stocks.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    symbol    TEXT PRIMARY KEY,
    yf_ticker TEXT,
    exchange  TEXT
  );

  CREATE TABLE IF NOT EXISTS stock_data (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol           TEXT,
    date             TEXT,
    open             REAL,
    high             REAL,
    low              REAL,
    close            REAL,
    volume           INTEGER,
    daily_return     REAL,
    ma_7             REAL,
    high_52w         REAL,
    low_52w          REAL,
    volatility_score REAL
  );
`);

module.exports = db;
