/**
 * Rate-limiting middleware.
 *
 * Prevents abuse of the AI extraction endpoint — each IP gets a
 * limited number of requests per window.
 */

const rateLimit = require("express-rate-limit");

const importLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message:
        "Too many import requests. Please wait a few minutes before trying again.",
    },
  },
});

module.exports = { importLimiter };
