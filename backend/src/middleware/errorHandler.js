/**
 * Global error-handling middleware for Express.
 *
 * Catches any error thrown or passed via next(err) and returns a
 * consistent JSON shape so the frontend always knows what to expect.
 */

const logger = require("../utils/logger");

function errorHandler(err, _req, res, _next) {
  // Multer-specific errors (file too large, wrong field name, etc.)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      error: {
        code: "FILE_TOO_LARGE",
        message: "File exceeds the 10 MB size limit.",
      },
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      error: {
        code: "UNEXPECTED_FIELD",
        message: "Unexpected file field. Use 'file' as the field name.",
      },
    });
  }

  // Default — internal server error
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong. Please try again later."
      : err.message || "Internal Server Error";

  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    statusCode,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message,
    },
  });
}

module.exports = errorHandler;
