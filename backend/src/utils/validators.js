/**
 * Input validation helpers.
 *
 * Centralised validation keeps controllers thin and ensures
 * consistent error messages across the API.
 */

const ALLOWED_MIME_TYPES = ["text/csv", "application/vnd.ms-excel"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Validates that the uploaded file looks like a legitimate CSV.
 * Returns an error message string if invalid, or null if valid.
 */
function validateCSVFile(file) {
  if (!file) {
    return "No file was uploaded. Please attach a CSV file.";
  }

  // Check extension (mime type from multer can be unreliable)
  const originalName = file.originalname || "";
  if (!originalName.toLowerCase().endsWith(".csv")) {
    return "Invalid file type. Only .csv files are accepted.";
  }

  // Secondary MIME-type check — but extension takes priority since MIME
  // detection varies wildly across browsers and upload clients.
  const permissiveMimeTypes = [
    ...ALLOWED_MIME_TYPES,
    "text/plain",
    "application/octet-stream",
  ];
  if (file.mimetype && !permissiveMimeTypes.includes(file.mimetype)) {
    return "Invalid file type. Only CSV files are accepted.";
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return `File too large (${sizeMB} MB). Maximum allowed size is 10 MB.`;
  }

  return null;
}

/**
 * Checks whether a parsed CSV has at least some usable data.
 */
function validateParsedRecords(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return "The CSV file is empty or contains no valid records.";
  }
  return null;
}

module.exports = { validateCSVFile, validateParsedRecords };
