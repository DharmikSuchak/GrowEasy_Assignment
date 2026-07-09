const dotenv = require("dotenv");
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Gemini AI configuration
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-flash-lite-latest",

  // Upload constraints
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  maxRecordsPerBatch: 25,

  // AI retry settings
  maxRetries: 3,
  retryBaseDelay: 1000, // ms

  // CORS
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000"],
};

module.exports = config;
