"use client";

import { useState } from "react";
import { CRM_FIELDS, STATUS_STYLES } from "@/lib/constants";

/**
 * Results table displaying AI-extracted CRM records.
 *
 * Features:
 *  - Toggle between Imported and Skipped tabs
 *  - Sticky headers with horizontal/vertical scroll
 *  - Color-coded CRM status badges
 *  - Responsive layout
 */
export default function ResultsTable({ results, onReset }) {
  const [activeTab, setActiveTab] = useState("imported");

  if (!results) return null;

  const { imported, skipped } = results;
  const records = activeTab === "imported" ? imported : skipped;

  return (
    <div className="animate-fade-in">
      {/* Tab bar + reset button */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--border-color)" }}
        >
          <button
            onClick={() => setActiveTab("imported")}
            className="px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{
              background:
                activeTab === "imported"
                  ? "var(--color-primary)"
                  : "var(--bg-card)",
              color:
                activeTab === "imported"
                  ? "var(--text-inverse)"
                  : "var(--text-secondary)",
            }}
          >
            Imported ({imported.length})
          </button>
          <button
            onClick={() => setActiveTab("skipped")}
            className="px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{
              background:
                activeTab === "skipped"
                  ? "var(--color-warning)"
                  : "var(--bg-card)",
              color:
                activeTab === "skipped"
                  ? "var(--text-inverse)"
                  : "var(--text-secondary)",
              borderLeft: "1px solid var(--border-color)",
            }}
          >
            Skipped ({skipped.length})
          </button>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80"
          style={{
            background: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
          }}
        >
          Import Another
        </button>
      </div>

      {/* Table */}
      {records.length === 0 ? (
        <div
          className="glass-card flex flex-col items-center justify-center py-12 text-center"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-3"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="15" x2="16" y2="15" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
          <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
            No {activeTab} records
          </p>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            {activeTab === "skipped"
              ? "All records were imported successfully!"
              : "No records could be extracted. Try a different CSV."}
          </p>
        </div>
      ) : (
        <div className="data-table-wrapper" style={{ maxHeight: "500px" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>#</th>
                {activeTab === "imported" ? (
                  CRM_FIELDS.map((field) => (
                    <th key={field.key}>{field.label}</th>
                  ))
                ) : (
                  <>
                    <th>Record Data</th>
                    <th>Reason</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td
                    style={{
                      color: "var(--text-tertiary)",
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {index + 1}
                  </td>
                  {activeTab === "imported" ? (
                    CRM_FIELDS.map((field) => (
                      <td key={field.key} title={record[field.key] || ""}>
                        {field.key === "crm_status" && record[field.key] ? (
                          <span
                            className={`badge ${
                              STATUS_STYLES[record[field.key]]?.className || "badge-info"
                            }`}
                          >
                            {STATUS_STYLES[record[field.key]]?.label ||
                              record[field.key]}
                          </span>
                        ) : (
                          record[field.key] || "—"
                        )}
                      </td>
                    ))
                  ) : (
                    <>
                      <td
                        style={{
                          whiteSpace: "normal",
                          maxWidth: "400px",
                          fontSize: "0.8rem",
                        }}
                      >
                        {JSON.stringify(record, null, 0).slice(0, 200)}
                        {JSON.stringify(record).length > 200 ? "..." : ""}
                      </td>
                      <td
                        style={{
                          whiteSpace: "normal",
                          maxWidth: "300px",
                          color: "var(--color-warning)",
                        }}
                      >
                        {record.reason || "Unknown reason"}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
