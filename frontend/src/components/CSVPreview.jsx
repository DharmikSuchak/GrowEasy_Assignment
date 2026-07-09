"use client";

/**
 * CSV preview table with sticky headers, horizontal/vertical scroll,
 * and zebra-striped rows. Shows the first 100 rows from the uploaded file
 * so the user can verify before sending to the AI.
 */
export default function CSVPreview({ previewData, onConfirm, onBack }) {
  if (!previewData) return null;

  const { headers, rows, totalRows } = previewData;

  return (
    <div className="animate-fade-in">
      {/* Header bar */}
      <div
        className="flex items-center justify-between mb-4 px-1"
      >
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Preview
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Showing {rows.length} of {totalRows} rows · {headers.length} columns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
            }}
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "var(--color-primary)",
              color: "var(--text-inverse)",
            }}
          >
            Confirm Import
          </button>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "50px" }}>#</th>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td
                  style={{
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "0.75rem",
                  }}
                >
                  {rowIndex + 1}
                </td>
                {headers.map((header) => (
                  <td key={header} title={row[header] || ""}>
                    {row[header] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
