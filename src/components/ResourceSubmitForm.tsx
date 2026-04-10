import { useState } from 'react';

const categories = [
  { value: 'general', label: 'General Resource' },
  { value: 'nexus-letter', label: 'Nexus Letter Service/Template' },
  { value: 'dbq', label: 'DBQ Resource' },
  { value: 'cp-exam', label: 'C&P Exam Resource' },
  { value: 'legal', label: 'Legal / VSO Resource' },
  { value: 'tool', label: 'Tool or Calculator' },
];

export default function ResourceSubmitForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/submit-resource', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.ok) {
        setStatus('sent');
      } else {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
        <h3 className="text-lg font-semibold text-emerald-900 mb-2">Resource Submitted</h3>
        <p className="text-sm text-emerald-700">
          Thank you for contributing. Your submission will be reviewed before being published.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="submitterName" className="block text-sm font-medium text-zinc-700">
            Your Name
          </label>
          <input
            id="submitterName"
            name="submitterName"
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
            placeholder="Marcus Rivera"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="submitterEmail" className="block text-sm font-medium text-zinc-700">
            Your Email
          </label>
          <input
            id="submitterEmail"
            name="submitterEmail"
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
            placeholder="marcus@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
          Resource Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
          placeholder="e.g., PTSD Nexus Letter Template from Dr. Chen"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="url" className="block text-sm font-medium text-zinc-700">
          Resource URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-zinc-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="conditionSlug" className="block text-sm font-medium text-zinc-700">
            Related Condition <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            id="conditionSlug"
            name="conditionSlug"
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
            placeholder="e.g., PTSD, sleep apnea, knee"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all resize-none"
          placeholder="Briefly describe this resource and why it's helpful for veterans..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-6 py-3.5 text-sm font-medium text-white bg-emerald-700 rounded-xl hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {status === 'sending' ? 'Submitting...' : 'Submit Resource'}
      </button>

      {status === 'error' && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}
    </form>
  );
}
