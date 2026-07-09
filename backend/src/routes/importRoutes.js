/**
 * Import route definitions.
 *
 * POST /api/import — accepts a CSV file and returns AI-extracted CRM records.
 */

const express = require("express");
const upload = require("../middleware/upload");
const { importLimiter } = require("../middleware/rateLimiter");
const { handleImport } = require("../controllers/importController");

const router = express.Router();

// Rate-limit the import endpoint, then accept a single file upload
router.post("/import", importLimiter, upload.single("file"), handleImport);

module.exports = router;
