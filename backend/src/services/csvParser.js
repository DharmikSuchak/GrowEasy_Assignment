/**
 * CSV parsing service.
 *
 * Takes a raw file buffer and converts it into an array of record objects
 * using PapaParse. Handles encoding quirks and trims whitespace from
 * headers so the AI receives clean data.
 */

const Papa = require("papaparse");
const logger = require("../utils/logger");

/**
 * Parses a CSV buffer into structured records.
 *
 * @param {Buffer} fileBuffer - Raw CSV file contents
 * @returns {{ headers: string[], records: object[] }}
 */
function parseCSV(fileBuffer) {
  const csvString = fileBuffer.toString("utf-8");

  const result = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: "greedy", // skip lines that are entirely empty
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  if (result.errors.length > 0) {
    // Log warnings but don't fail — PapaParse can still return partial data
    logger.warn("CSV parsing encountered non-fatal issues", {
      errorCount: result.errors.length,
      firstError: result.errors[0],
    });
  }

  const headers = result.meta.fields || [];
  const records = result.data.filter((row) => {
    // Drop rows where every value is empty (common in trailing lines)
    return Object.values(row).some((val) => val !== "" && val != null);
  });

  logger.info("CSV parsed successfully", {
    headerCount: headers.length,
    recordCount: records.length,
  });

  return { headers, records };
}

module.exports = { parseCSV };
