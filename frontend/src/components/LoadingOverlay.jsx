"use client";

/**
 * Loading overlay displayed while the AI processes CSV records.
 *
 * Shows a pulsing animation with a descriptive message so the user
 * knows the system is actively working.
 */
export default function LoadingOverlay() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-20">
      {/* Spinning ring */}
      <div className="relative mb-8">
        <div
          className="w-16 h-16 rounded-full border-4 border-t-transparent"
          style={{
            borderColor: "var(--border-color)",
            borderTopColor: "var(--color-primary)",
            animation: "spin-slow 1s linear infinite",
          }}
        />
        <div
          className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-transparent opacity-30"
          style={{
            borderColor: "transparent",
            borderTopColor: "var(--color-primary)",
            animation: "spin-slow 2s linear infinite reverse",
          }}
        />
      </div>

      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        Processing with AI
      </h3>
      <p
        className="text-sm mb-6 text-center max-w-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Extracting CRM records from your CSV. This may take a moment depending on
        the number of records.
      </p>

      {/* Pulsing dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: "var(--color-primary)",
              animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
