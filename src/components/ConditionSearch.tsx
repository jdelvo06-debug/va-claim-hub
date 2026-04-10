import { useState, useMemo } from 'react';

interface Condition {
  id: string;
  title: string;
  description: string;
  category: string;
  commonRatings: string[];
}

const categoryLabels: Record<string, string> = {
  'mental-health': 'Mental Health',
  'auditory': 'Auditory',
  'respiratory': 'Respiratory',
  'musculoskeletal': 'Musculoskeletal',
  'neurological': 'Neurological',
  'digestive': 'Digestive',
  'cardiovascular': 'Cardiovascular',
};

export default function ConditionSearch({ conditions }: { conditions: Condition[] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(conditions.map((c) => c.category))].sort(),
    [conditions]
  );

  const filtered = useMemo(() => {
    let result = conditions;
    if (activeCategory) {
      result = result.filter((c) => c.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [conditions, query, activeCategory]);

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search conditions (e.g., PTSD, knee, tinnitus...)"
          className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeCategory === null
              ? 'bg-emerald-700 text-white'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeCategory === cat
                ? 'bg-emerald-700 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400 text-sm">No conditions found matching your search.</p>
          <button
            onClick={() => {
              setQuery('');
              setActiveCategory(null);
            }}
            className="text-sm text-emerald-700 hover:text-emerald-800 mt-2 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {filtered.map((condition) => (
            <a
              key={condition.id}
              href={`/conditions/${condition.id}`}
              className="group flex items-start justify-between py-5 gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider">
                    {categoryLabels[condition.category] || condition.category}
                  </span>
                </div>
                <h3 className="text-base font-medium text-zinc-900 group-hover:text-emerald-700 transition-colors">
                  {condition.title}
                </h3>
                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{condition.description}</p>
                <div className="flex gap-1.5 mt-2.5">
                  {condition.commonRatings.map((rating) => (
                    <span
                      key={rating}
                      className="inline-flex px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-500 bg-zinc-100 rounded"
                    >
                      {rating}
                    </span>
                  ))}
                </div>
              </div>
              <svg
                className="w-5 h-5 text-zinc-300 group-hover:text-emerald-600 transition-colors shrink-0 mt-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          ))}
        </div>
      )}

      <p className="text-xs text-zinc-400 mt-6 pt-4 border-t border-zinc-100">
        Showing {filtered.length} of {conditions.length} conditions
      </p>
    </div>
  );
}
