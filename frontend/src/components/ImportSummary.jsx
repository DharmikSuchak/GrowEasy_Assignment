"use client";

/**
 * Import summary cards — displayed above the results table
 * showing total records, imported count, skipped count, and success rate.
 */
export default function ImportSummary({ results }) {
  if (!results) return null;

  const { totalRecords, totalImported, totalSkipped } = results;
  const successRate =
    totalRecords > 0
      ? Math.round((totalImported / totalRecords) * 100)
      : 0;

  const stats = [
    {
      label: "Total Records",
      value: totalRecords,
      color: "var(--color-primary)",
      bgColor: "var(--color-primary-light)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      label: "Imported",
      value: totalImported,
      color: "var(--color-success)",
      bgColor: "var(--color-success-light)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Skipped",
      value: totalSkipped,
      color: "var(--color-warning)",
      bgColor: "var(--color-warning-light)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      color:
        successRate >= 80
          ? "var(--color-success)"
          : successRate >= 50
          ? "var(--color-warning)"
          : "var(--color-error)",
      bgColor:
        successRate >= 80
          ? "var(--color-success-light)"
          : successRate >= 50
          ? "var(--color-warning-light)"
          : "var(--color-error-light)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card p-4 flex flex-col items-center text-center"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: stat.bgColor, color: stat.color }}
          >
            {stat.icon}
          </div>
          <span
            className="text-2xl font-bold mb-0.5"
            style={{ color: stat.color }}
          >
            {stat.value}
          </span>
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
