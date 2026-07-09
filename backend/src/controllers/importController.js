/**
 * Import controller — orchestrates the CSV-to-CRM pipeline.
 *
 * Flow:
 *   1. Validate uploaded file
 *   2. Parse CSV into records
 *   3. Send records to AI in batches
 *   4. Return structured results
 */

const { parseCSV } = require("../services/csvParser");
const { extractAllRecords } = require("../services/aiExtractor");
const { validateCSVFile, validateParsedRecords } = require("../utils/validators");
const logger = require("../utils/logger");

async function handleImport(req, res, next) {
  try {
    // --- Step 1: Validate uploaded file ---
    const fileError = validateCSVFile(req.file);
    if (fileError) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_FILE", message: fileError },
      });
    }

    logger.info("CSV upload received", {
      filename: req.file.originalname,
      sizeBytes: req.file.size,
    });

    // --- Step 2: Parse CSV ---
    const { headers, records } = parseCSV(req.file.buffer);

    const recordsError = validateParsedRecords(records);
    if (recordsError) {
      return res.status(400).json({
        success: false,
        error: { code: "EMPTY_CSV", message: recordsError },
      });
    }

    // --- Step 3: AI extraction (batched) ---
    const extractionResult = await extractAllRecords(headers, records);

    // --- Step 4: Return structured response ---
    const response = {
      success: true,
      data: {
        totalRecords: records.length,
        totalImported: extractionResult.imported.length,
        totalSkipped: extractionResult.skipped.length,
        totalBatches: extractionResult.totalBatches,
        imported: extractionResult.imported,
        skipped: extractionResult.skipped,
      },
    };

    logger.info("Import complete", {
      totalRecords: records.length,
      imported: extractionResult.imported.length,
      skipped: extractionResult.skipped.length,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = { handleImport };
