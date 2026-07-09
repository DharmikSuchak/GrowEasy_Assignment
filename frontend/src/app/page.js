"use client";

import { useCSVImport } from "@/hooks/useCSVImport";
import ThemeToggle from "@/components/ThemeToggle";
import Stepper from "@/components/Stepper";
import FileUpload from "@/components/FileUpload";
import CSVPreview from "@/components/CSVPreview";
import LoadingOverlay from "@/components/LoadingOverlay";
import ImportSummary from "@/components/ImportSummary";
import ResultsTable from "@/components/ResultsTable";

/**
 * Main application page — orchestrates the 4-step CSV import flow.
 *
 * Step 1: Upload CSV (drag-and-drop or file picker)
 * Step 2: Preview parsed data in a table
 * Step 3: Processing (AI extraction with loading indicator)
 * Step 4: Display extracted CRM records + summary stats
 */
export default function Home() {
  const {
    step,
    previewData,
    results,
    error,
    isProcessing,
    handleFileSelect,
    handleConfirmImport,
    handleReset,
    clearError,
  } = useCSVImport();

  return (
    <main className="flex-1 flex flex-col">
      {/* ─── Header ─── */}
      <header
        className="flex items-center justify-between px-6 py-4 transition-theme"
        style={{
          borderBottom: "1px solid var(--border-color)",
          background: "var(--bg-primary)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--color-primary)" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <h1
              className="text-base font-bold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              CSV Importer
            </h1>
            <p
              className="text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              GrowEasy CRM
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* ─── Content ─── */}
      <div className="flex-1 flex flex-col items-center px-4 py-8 md:px-8">
        {/* Stepper */}
        <Stepper currentStep={step} />

        {/* Error banner */}
        {error && (
          <div
            className="w-full max-w-3xl mb-6 px-4 py-3 rounded-lg flex items-center justify-between animate-fade-in"
            style={{
              background: "var(--color-error-light)",
              border: "1px solid var(--color-error)",
            }}
          >
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-error)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-error)" }}
              >
                {error}
              </span>
            </div>
            <button
              onClick={clearError}
              className="p-1 rounded hover:opacity-70 transition-opacity"
              aria-label="Dismiss error"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-error)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Main card */}
        <div className="w-full max-w-4xl glass-card p-6 md:p-8 animate-slide-up">
          {/* Step 1: Upload */}
          {step === 1 && <FileUpload onFileSelect={handleFileSelect} />}

          {/* Step 2: Preview */}
          {step === 2 && (
            <CSVPreview
              previewData={previewData}
              onConfirm={handleConfirmImport}
              onBack={handleReset}
            />
          )}

          {/* Step 3: Processing */}
          {step === 3 && isProcessing && <LoadingOverlay />}

          {/* Step 4: Results */}
          {step === 4 && results && (
            <>
              <ImportSummary results={results} />
              <ResultsTable results={results} onReset={handleReset} />
            </>
          )}
        </div>

        {/* Footer */}
        <p
          className="mt-8 text-xs"
          style={{ color: "var(--text-tertiary)" }}
        >
          Powered by AI · Built for GrowEasy CRM
        </p>
      </div>
    </main>
  );
}
