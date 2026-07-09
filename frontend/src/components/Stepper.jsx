"use client";

import { STEPS } from "@/lib/constants";

/**
 * Horizontal stepper component showing the import progress.
 *
 * Each step shows its number (or a checkmark when complete),
 * label, and a connecting line that fills as steps are completed.
 */
export default function Stepper({ currentStep }) {
  return (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-8">
      {STEPS.map((step, index) => {
        const isComplete = currentStep > step.id;
        const isActive = currentStep === step.id;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
                style={{
                  background: isComplete
                    ? "var(--color-success)"
                    : isActive
                    ? "var(--color-primary)"
                    : "var(--bg-tertiary)",
                  color: isComplete || isActive
                    ? "var(--text-inverse)"
                    : "var(--text-tertiary)",
                  boxShadow: isActive ? "var(--shadow-glow)" : "none",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                }}
              >
                {isComplete ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className="text-xs font-medium whitespace-nowrap transition-colors duration-300"
                style={{
                  color: isActive
                    ? "var(--color-primary)"
                    : isComplete
                    ? "var(--color-success)"
                    : "var(--text-tertiary)",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div
                className="flex-1 h-0.5 mx-3 rounded-full transition-all duration-500"
                style={{
                  background: isComplete
                    ? "var(--color-success)"
                    : "var(--border-color)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
