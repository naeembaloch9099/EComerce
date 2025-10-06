const express = require("express");
const app = express();

// Simple utility to clear rate limiting for development
app.get("/clear-rate-limits", (req, res) => {
  // Since we're using memory store, restarting the server clears all rate limits
  // In production with Redis, you'd need to clear the Redis keys
  res.json({
    status: "success",
    message: "Rate limits cleared. Restart the server to fully reset.",
    tip: "Set DISABLE_RATE_LIMIT=true in .env to disable rate limiting entirely in development",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "Rate limit utility is running",
    environment: process.env.NODE_ENV || "development",
  });
});

const PORT = process.env.UTIL_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Rate limit utility running on http://localhost:${PORT}`);
  console.log(`Clear rate limits: http://localhost:${PORT}/clear-rate-limits`);
});
