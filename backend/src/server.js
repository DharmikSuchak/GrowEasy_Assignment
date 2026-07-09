/**
 * Express application entry point.
 *
 * Sets up middleware stack, mounts routes, and starts the HTTP server.
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const importRoutes = require("./routes/importRoutes");

const app = express();

// ─── Security Headers ───
app.use(helmet());

// ─── CORS ───
app.use(
  cors({
    origin: config.allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    maxAge: 86400, // cache preflight for 24 hours
  })
);

// ─── Request Logging ───
app.use(morgan("short"));

// ─── Body Parsers ───
app.use(express.json({ limit: "1mb" }));

// ─── Health Check ───
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Routes ───
app.use("/api", importRoutes);

// ─── 404 Handler ───
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested endpoint does not exist.",
    },
  });
});

// ─── Global Error Handler ───
app.use(errorHandler);

// ─── Start Server ───
const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`, {
    env: config.nodeEnv,
    allowedOrigins: config.allowedOrigins,
  });
});

// ─── Graceful Shutdown ───
function shutdown(signal) {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = app;
