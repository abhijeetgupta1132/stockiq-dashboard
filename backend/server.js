// server.js
// Starts the Express API server

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" })); // Vite React default port
app.use(express.json());
app.use("/api", routes); // All routes prefixed with /api

app.listen(PORT, () => {
  console.log(`✅ Backend running → http://localhost:${PORT}`);
  console.log(`🔌 API ready      → http://localhost:${PORT}/api/companies`);
});
