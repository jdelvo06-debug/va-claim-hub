import { useEffect, useState } from 'react';

interface Resource {
  id: number;
  title: string;
  url: string;
  condition_slug: string | null;
  category: string;
  description: string;
  submitter_name: string;
  submitter_email: string;
  status: string;
  created_at: string;
}

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

type Tab = 'resources' | 'subscribers' | 'contacts';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('resources');
  const [resources, setResources] = useState<Resource[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/resources').then((r) => r.json()),
      fetch('/api/admin/subscribers').then((r) => r.json()),
      fetch('/api/admin/contacts').then((r) => r.json()),
    ])
      .then(([res, subs, cts]) => {
        setResources(Array.isArray(res) ? res : []);
        setSubscribers(Array.isArray(subs) ? subs : []);
        setContacts(Array.isArray(cts) ? cts : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function updateResourceStatus(id: number, status: 'approved' | 'rejected') {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setResources((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-zinc-100 animate-pulse" />
        ))}
      </div>
    );
  }

  const pendingCount = resources.filter((r) => r.status === 'pending').length;
  const newContactsCount = contacts.filter((c) => c.status === 'new').length;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white">
          <p className="text-sm text-zinc-500 mb-1">Total Resources</p>
          <p className="text-3xl font-semibold tracking-tight">{resources.length}</p>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white">
          <p className="text-sm text-zinc-500 mb-1">Pending Review</p>
          <p className="text-3xl font-semibold tracking-tight text-amber-600">{pendingCount}</p>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white">
          <p className="text-sm text-zinc-500 mb-1">Newsletter Subscribers</p>
          <p className="text-3xl font-semibold tracking-tight text-emerald-600">
            {subscribers.length}
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white">
          <p className="text-sm text-zinc-500 mb-1">New Messages</p>
          <p className="text-3xl font-semibold tracking-tight text-blue-600">{newContactsCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-200">
        <button
          onClick={() => setTab('resources')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === 'resources'
              ? 'border-emerald-700 text-emerald-700'
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Resources ({resources.length})
        </button>
        <button
          onClick={() => setTab('subscribers')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === 'subscribers'
              ? 'border-emerald-700 text-emerald-700'
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Subscribers ({subscribers.length})
        </button>
        <button
          onClick={() => setTab('contacts')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === 'contacts'
              ? 'border-emerald-700 text-emerald-700'
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Messages ({contacts.length})
          {newContactsCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-500 rounded-full">
              {newContactsCount}
            </span>
          )}
        </button>
      </div>

      {/* Resources Table */}
      {tab === 'resources' && (
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-5 py-3 font-medium text-zinc-500">Title</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500 hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500 hidden lg:table-cell">
                  Submitted By
                </th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500">Date</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500">Status</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-zinc-900 hover:text-emerald-700 transition-colors"
                    >
                      {r.title}
                    </a>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-xs">
                      {r.description}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-zinc-600 hidden md:table-cell">{r.category}</td>
                  <td className="px-5 py-4 text-zinc-600 hidden lg:table-cell">
                    {r.submitter_name}
                  </td>
                  <td className="px-5 py-4 text-zinc-500 font-mono text-xs">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        r.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : r.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {r.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateResourceStatus(r.id, 'approved')}
                          disabled={actionLoading === r.id}
                          className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateResourceStatus(r.id, 'rejected')}
                          disabled={actionLoading === r.id}
                          className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {r.status === 'approved' && (
                      <button
                        onClick={() => updateResourceStatus(r.id, 'rejected')}
                        disabled={actionLoading === r.id}
                        className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}
                    {r.status === 'rejected' && (
                      <button
                        onClick={() => updateResourceStatus(r.id, 'approved')}
                        disabled={actionLoading === r.id}
                        className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {resources.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-zinc-400">
                    No resource submissions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Subscribers Table */}
      {tab === 'subscribers' && (
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-5 py-3 font-medium text-zinc-500">Email</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-5 py-4 text-zinc-900">{s.email}</td>
                  <td className="px-5 py-4 text-zinc-500 font-mono text-xs">
                    {new Date(s.subscribed_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-5 py-12 text-center text-zinc-400">
                    No subscribers yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Contacts Table */}
      {tab === 'contacts' && (
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-5 py-3 font-medium text-zinc-500">Name</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500 hidden md:table-cell">
                  Email
                </th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500">Message</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500">Date</th>
                <th className="text-left px-5 py-3 font-medium text-zinc-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-zinc-900">{c.name}</td>
                  <td className="px-5 py-4 text-zinc-600 hidden md:table-cell">
                    <a href={`mailto:${c.email}`} className="hover:text-emerald-700 transition-colors">
                      {c.email}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-zinc-600 max-w-xs">
                    <p className="truncate">{c.message}</p>
                  </td>
                  <td className="px-5 py-4 text-zinc-500 font-mono text-xs">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.status === 'new'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-zinc-400">
                    No contact messages yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
