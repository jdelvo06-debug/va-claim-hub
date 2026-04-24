import { useState } from 'react';

function computeCombined(ratings: number[]): number {
  const sorted = [...ratings].sort((a, b) => b - a);
  let remaining = 100;
  let combined = 0;
  for (const r of sorted) {
    const added = remaining * (r / 100);
    combined += added;
    remaining -= added;
  }
  return combined;
}

function roundToVA(value: number): number {
  // Round to nearest 10, with 5+ rounding up
  return Math.round(value / 10) * 10;
}

const COMPENSATION_2026: Record<number, number> = {
  0: 0,
  10: 175.51,
  20: 346.95,
  30: 537.42,
  40: 774.16,
  50: 1102.04,
  60: 1395.93,
  70: 1759.19,
  80: 2044.89,
  90: 2297.96,
  100: 3831.30,
};

export default function CombinedRatingsCalculator() {
  const [inputs, setInputs] = useState<string[]>(['', '']);

  function addRating() {
    setInputs((prev) => [...prev, '']);
  }

  function removeRating(index: number) {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRating(index: number, value: string) {
    setInputs((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  const parsed = inputs
    .map((v) => parseFloat(v))
    .filter((v) => !isNaN(v) && v > 0 && v <= 100);

  const validRatings = parsed.filter((v) => v % 10 === 0);
  const hasInvalid = parsed.some((v) => v % 10 !== 0);

  const rawCombined = validRatings.length > 0 ? computeCombined(validRatings) : null;
  const rounded = rawCombined !== null ? roundToVA(rawCombined) : null;
  const compensation = rounded !== null ? COMPENSATION_2026[Math.min(rounded, 100)] ?? null : null;

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4">
        <h2 className="text-base font-semibold text-zinc-900">Enter Your Ratings</h2>
        <p className="text-sm text-zinc-500">
          Enter each individual service-connected disability rating as a multiple of 10 (10, 20, 30 … 100).
        </p>

        <div className="space-y-3">
          {inputs.map((value, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="10"
                  placeholder="e.g. 50"
                  value={value}
                  onChange={(e) => updateRating(index, e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 pointer-events-none">
                  %
                </span>
              </div>
              {inputs.length > 1 && (
                <button
                  onClick={() => removeRating(index)}
                  className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                  aria-label="Remove rating"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addRating}
          className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add another rating
        </button>

        {hasInvalid && (
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            VA ratings must be multiples of 10 (10%, 20%, 30%…). Non-standard values are excluded from the calculation.
          </p>
        )}
      </div>

      {/* Results */}
      {rawCombined !== null && rounded !== null ? (
        <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50 space-y-5">
          <h2 className="text-base font-semibold text-emerald-900">Your Combined Rating</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-emerald-100">
              <p className="text-xs text-zinc-500 mb-1">Raw Combined</p>
              <p className="text-2xl font-bold text-zinc-900">{rawCombined.toFixed(1)}%</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-emerald-100">
              <p className="text-xs text-zinc-500 mb-1">Rounded (VA Final)</p>
              <p className="text-2xl font-bold text-emerald-700">{rounded}%</p>
            </div>
            {compensation !== null && (
              <div className="bg-white rounded-xl p-4 border border-emerald-100">
                <p className="text-xs text-zinc-500 mb-1">Est. Monthly (single, no dependents)</p>
                <p className="text-2xl font-bold text-zinc-900">${compensation.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Step-by-step */}
          <div className="bg-white rounded-xl p-4 border border-emerald-100 space-y-2">
            <p className="text-xs font-medium text-zinc-700 mb-3">Step-by-step calculation</p>
            {(() => {
              const sorted = [...validRatings].sort((a, b) => b - a);
              const steps: { rating: number; added: number; running: number }[] = [];
              let remaining = 100;
              let running = 0;
              for (const r of sorted) {
                const added = remaining * (r / 100);
                running += added;
                remaining -= added;
                steps.push({ rating: r, added, running });
              }
              return steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-zinc-600 font-mono">
                  <span className="w-5 text-zinc-400">{i + 1}.</span>
                  <span className="bg-zinc-100 px-2 py-0.5 rounded">{step.rating}%</span>
                  <span className="text-zinc-400">→ adds {step.added.toFixed(1)} pts</span>
                  <span className="text-zinc-400">→ running total:</span>
                  <span className="font-semibold text-zinc-800">{step.running.toFixed(1)}%</span>
                </div>
              ));
            })()}
            <div className="pt-2 border-t border-zinc-100 flex items-center gap-2 text-xs font-mono">
              <span className="w-5" />
              <span className="text-zinc-500">Final: {rawCombined.toFixed(1)}% → rounds to</span>
              <span className="font-bold text-emerald-700">{rounded}%</span>
            </div>
          </div>

          {rounded < 100 && (
            <p className="text-xs text-zinc-500">
              <strong>Note:</strong> VA combined ratings never mathematically reach 100% through addition alone — each additional rating applies to the remaining "whole person" percentage.{' '}
              <a href="/blog/how-combined-ratings-work" className="text-emerald-700 hover:underline">
                Learn how combined ratings work →
              </a>
            </p>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50 text-center text-sm text-zinc-400">
          Enter at least one rating above to see your combined result.
        </div>
      )}

      {/* Educational callout */}
      <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-2">
        <h3 className="text-sm font-semibold text-zinc-800">About This Calculator</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          This calculator uses the VA whole-person combined ratings formula (38 CFR 4.25) and 2026 single-veteran compensation rates. It does not account for dependent adjustments, the bilateral factor, or Special Monthly Compensation (SMC). Consult a VSO or accredited VA attorney for official benefit calculations.
        </p>
        <div className="flex gap-4 pt-1">
          <a href="/blog/how-combined-ratings-work" className="text-xs text-emerald-700 hover:underline">
            How combined ratings work →
          </a>
          <a href="/blog/what-is-tdiu" className="text-xs text-emerald-700 hover:underline">
            What is TDIU? →
          </a>
        </div>
      </div>
    </div>
  );
}
