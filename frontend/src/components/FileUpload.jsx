"use client";

import { useCallback, useState, useRef } from "react";
import { FILE_CONSTRAINTS } from "@/lib/constants";

/**
 * Drag-and-drop file upload component with fallback file picker.
 *
 * Visual feedback on drag-over, file info display after selection,
 * and validation before passing the file up.
 */
export default function FileUpload({ onFileSelect }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;

      // Basic validation (more thorough validation in the hook)
      if (!file.name.toLowerCase().endsWith(".csv")) {
        alert("Please upload a CSV file.");
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="animate-fade-in">
      <div
        className={`dropzone ${isDragOver ? "active" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
          {/* Upload icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300"
            style={{
              background: isDragOver
                ? "var(--color-primary)"
                : "var(--color-primary-light)",
              color: isDragOver
                ? "var(--text-inverse)"
                : "var(--color-primary)",
              transform: isDragOver ? "scale(1.1)" : "scale(1)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          {selectedFile ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {selectedFile.name}
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {formatFileSize(selectedFile.size)} · Click or drop to replace
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-base mb-1" style={{ color: "var(--text-primary)" }}>
                {isDragOver ? "Drop your CSV file here" : "Drag & drop your CSV file"}
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
                or click to browse · Max {FILE_CONSTRAINTS.maxSizeLabel}
              </p>
              <button
                type="button"
                className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--text-inverse)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                Select File
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={FILE_CONSTRAINTS.acceptedTypes}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload CSV file"
      />
    </div>
  );
}
