/**
 * Multer configuration for CSV file uploads.
 *
 * Uses in-memory storage so we can pass the buffer directly to
 * PapaParse without writing temp files to disk.
 */

const multer = require("multer");
const config = require("../config");

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "text/plain",
    "application/octet-stream",
  ];
  const hasCSVExtension = file.originalname.toLowerCase().endsWith(".csv");

  if (hasCSVExtension || allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Only CSV files are allowed.");
    error.code = "INVALID_FILE_TYPE";
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
    files: 1,
  },
});

module.exports = upload;
