import { useState } from 'react';

export default function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/subscribe', { method: 'POST', body: formData });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <p className="text-sm text-emerald-700 font-medium py-2">
        You're subscribed. Welcome aboard.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        className="flex-1 min-w-0 px-3.5 py-2.5 text-sm rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-4 py-2.5 text-sm font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-50 transition-all shrink-0"
      >
        {status === 'sending' ? 'Joining...' : 'Join'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-600 mt-1">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
