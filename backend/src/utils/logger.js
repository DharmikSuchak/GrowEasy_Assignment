/**
 * Structured logger utility.
 *
 * Keeps logging consistent across the backend — timestamps, log levels,
 * and contextual prefixes so that debugging production issues is painless.
 */

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const currentLevel =
  LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.debug;

function formatTimestamp() {
  return new Date().toISOString();
}

function log(level, message, meta = {}) {
  if (LOG_LEVELS[level] > currentLevel) return;

  const entry = {
    timestamp: formatTimestamp(),
    level: level.toUpperCase(),
    message,
    ...(Object.keys(meta).length > 0 && { meta }),
  };

  const output = JSON.stringify(entry);

  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

const logger = {
  info: (msg, meta) => log("info", msg, meta),
  warn: (msg, meta) => log("warn", msg, meta),
  error: (msg, meta) => log("error", msg, meta),
  debug: (msg, meta) => log("debug", msg, meta),
};

module.exports = logger;
