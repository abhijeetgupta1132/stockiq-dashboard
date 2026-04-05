# 📈 StockIQ — Stock Data Intelligence Dashboard

> A full-stack financial data platform built for the JarNox Internship Assignment.
> Real NSE stock data · REST API · Interactive React Dashboard

---

## 🚀 Live Demo
- **Frontend:** https://stockiq.vercel.app
- **Backend API:** https://stockiq-api.onrender.com/api/companies

---

## 🗂️ Project Structure

```
stock_dashboard/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── db.js             # SQLite database setup
│   │   ├── dataPrep.js       # Data fetching + cleaning + metrics
│   │   └── routes.js         # All API endpoints
│   ├── data/                 # SQLite database (auto-generated)
│   ├── server.js             # Express server entry point
│   ├── package.json
│   └── .env
│
└── frontend/                 # React + Vite dashboard
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx       # Company watchlist + market movers
    │   │   ├── SummaryCards.jsx  # 6 metric cards
    │   │   ├── StockChart.jsx    # Price, return, volume charts
    │   │   ├── CompareChart.jsx  # Stock comparison + correlation
    │   │   └── Movers.jsx        # Top gainers & losers
    │   ├── App.jsx           # Root component
    │   ├── main.jsx          # React entry point
    │   └── index.css         # Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| Data Source | Yahoo Finance API (via axios) |
| Frontend | React 18 + Vite |
| Charts | Recharts |
| Deployment | Render (backend) + Vercel (frontend) |

---

## 📦 Library Equivalents

| Python (Preferred) | Node.js (Used) | Purpose |
|--------------------|----------------|---------|
| Pandas | JS `.map()` `.filter()` `.reduce()` | Data cleaning & transformation |
| NumPy | Custom `rollingMean()`, `rollingStd()` | Rolling calculations |
| Requests | axios | HTTP data fetching |
| Matplotlib / Plotly | Recharts | Data visualization |

> I have a strong background in Java Spring Boot and am currently learning Node.js,
> so I chose Express over Python/FastAPI. The same REST API design principles apply.

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | List all tracked companies |
| GET | `/api/data/:symbol` | Last 30 days OHLCV + metrics |
| GET | `/api/summary/:symbol` | 52-week high, low, avg close |
| GET | `/api/compare?symbol1=INFY&symbol2=TCS` | Compare two stocks |
| GET | `/api/movers` | Top gainers & losers |

---

## 📊 Computed Metrics

| Metric | Formula |
|--------|---------|
| Daily Return | `(Close - Open) / Open × 100` |
| 7-Day Moving Average | Rolling mean of Close, window = 7 |
| 52-Week High / Low | Rolling max/min over 252 trading days |
| Volatility Score | 14-day rolling std of daily return, normalised 0–100 |
| Correlation | Pearson r between two stocks' daily returns |

---

## 🛠️ Setup & Run Locally

### Prerequisites
- Node.js v18+
- npm

### Backend
```bash
cd backend
npm install
npm run prepare-data
npm start
```
Runs on: http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173

---

## 📡 Data Source

Data is fetched from **Yahoo Finance API** (free, no API key required).

- Covers **1 year** of daily OHLCV data per company
- Tracks: **RELIANCE, TCS, INFY, HDFCBANK, WIPRO**
- Reflects latest trading session end-of-day prices
- Refresh data anytime: `npm run prepare-data`

---

## 🎨 Dashboard Features

- ✅ Live clock + NSE Live badge
- ✅ Company watchlist with daily return pills
- ✅ Market Movers — Top Gainer and Top Loser
- ✅ 6 summary metric cards (52W High/Low, Avg, Volatility, Return, Date)
- ✅ Closing Price chart with 7-Day MA overlay
- ✅ Daily Return bar chart (green = gain, red = loss)
- ✅ Trading Volume chart
- ✅ Stock comparison with Pearson correlation score

---

## 👨‍💻 Author

**Your Name**
- Email: your@email.com
- GitHub: github.com/yourusername
