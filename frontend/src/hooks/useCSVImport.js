"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { importCSV } from "@/lib/api";
import { FILE_CONSTRAINTS } from "@/lib/constants";

/**
 * Custom hook that manages the entire CSV import flow.
 *
 * States: idle → previewing → processing → complete
 *         (any state can transition to → error)
 */
export function useCSVImport() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Validates and sets the uploaded file, then parses it for preview.
   */
  const handleFileSelect = useCallback((selectedFile) => {
    setError(null);

    // Validate file type
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return;
    }

    // Validate file size
    if (selectedFile.size > FILE_CONSTRAINTS.maxSizeBytes) {
      setError(`File is too large. Maximum size is ${FILE_CONSTRAINTS.maxSizeLabel}.`);
      return;
    }

    setFile(selectedFile);

    // Parse client-side for preview only
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: "greedy",
      preview: 100, // only parse first 100 rows for preview
      complete: (result) => {
        if (result.data.length === 0) {
          setError("The CSV file appears to be empty.");
          setFile(null);
          return;
        }

        setPreviewData({
          headers: result.meta.fields || [],
          rows: result.data,
          totalRows: result.data.length,
        });
        setStep(2);
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
        setFile(null);
      },
    });
  }, []);

  /**
   * Sends the CSV file to the backend for AI extraction.
   */
  const handleConfirmImport = useCallback(async () => {
    if (!file) return;

    setError(null);
    setIsProcessing(true);
    setStep(3);

    try {
      const response = await importCSV(file);
      setResults(response.data);
      setStep(4);
    } catch (err) {
      setError(err.message || "Import failed. Please try again.");
      setStep(2); // go back to preview so they can retry
    } finally {
      setIsProcessing(false);
    }
  }, [file]);

  /**
   * Resets the entire flow back to step 1.
   */
  const handleReset = useCallback(() => {
    setStep(1);
    setFile(null);
    setPreviewData(null);
    setResults(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  /**
   * Clears the current error.
   */
  const clearError = useCallback(() => setError(null), []);

  return {
    step,
    file,
    previewData,
    results,
    error,
    isProcessing,
    handleFileSelect,
    handleConfirmImport,
    handleReset,
    clearError,
  };
}
