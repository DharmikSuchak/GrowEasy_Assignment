/**
 * AI extraction service — Gemini integration.
 *
 * Sends batches of CSV records to Google Gemini and receives
 * structured CRM data back. Includes retry logic with exponential
 * backoff for transient failures.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config");
const logger = require("../utils/logger");
const {
  SYSTEM_INSTRUCTION,
  buildExtractionPrompt,
} = require("../prompts/crmExtraction");

// Initialise the Gemini client once at module load
const genAI = new GoogleGenerativeAI(config.geminiApiKey);

/**
 * Extracts CRM records from a single batch via Gemini.
 *
 * @param {string[]} headers - Column names from the CSV
 * @param {object[]} batch - Slice of raw CSV records
 * @returns {Promise<{ imported: object[], skipped: object[] }>}
 */
async function extractBatch(headers, batch) {
  const model = genAI.getGenerativeModel({
    model: config.geminiModel,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1, // low temperature for deterministic extraction
    },
  });

  const prompt = buildExtractionPrompt(headers, batch);

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Parse and validate the AI response
  const parsed = JSON.parse(responseText);

  if (!parsed.imported || !Array.isArray(parsed.imported)) {
    throw new Error("AI response missing 'imported' array.");
  }
  if (!parsed.skipped) {
    parsed.skipped = [];
  }

  return {
    imported: parsed.imported,
    skipped: parsed.skipped,
  };
}

/**
 * Delays execution for a given duration (used for retry backoff).
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extracts CRM records from a batch with automatic retries.
 *
 * Uses exponential backoff: wait 1s, 2s, 4s between retries.
 *
 * @param {string[]} headers
 * @param {object[]} batch
 * @param {number} batchIndex - For logging context
 * @returns {Promise<{ imported: object[], skipped: object[] }>}
 */
async function extractBatchWithRetry(headers, batch, batchIndex) {
  let lastError;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      logger.info(`Batch ${batchIndex + 1}: attempt ${attempt}`, {
        recordCount: batch.length,
      });

      const result = await extractBatch(headers, batch);

      logger.info(`Batch ${batchIndex + 1}: extraction complete`, {
        imported: result.imported.length,
        skipped: result.skipped.length,
      });

      return result;
    } catch (error) {
      lastError = error;
      logger.warn(`Batch ${batchIndex + 1}: attempt ${attempt} failed`, {
        error: error.message,
      });

      if (attempt < config.maxRetries) {
        const backoff = config.retryBaseDelay * Math.pow(2, attempt - 1);
        logger.info(`Retrying batch ${batchIndex + 1} in ${backoff}ms...`);
        await delay(backoff);
      }
    }
  }

  // All retries exhausted — return the batch as skipped
  logger.error(`Batch ${batchIndex + 1}: all retries exhausted`, {
    error: lastError.message,
  });

  const skippedRecords = batch.map((record) => ({
    ...record,
    reason: `AI extraction failed after ${config.maxRetries} attempts: ${lastError.message}`,
  }));

  return { imported: [], skipped: skippedRecords };
}

/**
 * Processes all records by splitting them into batches and extracting
 * CRM data from each batch in sequence.
 *
 * @param {string[]} headers - CSV column names
 * @param {object[]} records - All parsed CSV records
 * @returns {Promise<{ imported: object[], skipped: object[], totalBatches: number }>}
 */
async function extractAllRecords(headers, records) {
  const batchSize = config.maxRecordsPerBatch;
  const batches = [];

  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }

  logger.info("Starting AI extraction", {
    totalRecords: records.length,
    batchSize,
    totalBatches: batches.length,
  });

  const allImported = [];
  const allSkipped = [];

  // Process batches sequentially to avoid rate-limit issues
  for (let i = 0; i < batches.length; i++) {
    const result = await extractBatchWithRetry(headers, batches[i], i);
    allImported.push(...result.imported);
    allSkipped.push(...result.skipped);
  }

  return {
    imported: allImported,
    skipped: allSkipped,
    totalBatches: batches.length,
  };
}

module.exports = { extractAllRecords };
