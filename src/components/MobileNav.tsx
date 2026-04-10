import { useState } from 'react';

interface NavLink {
  href: string;
  label: string;
}

export default function MobileNav({ navLinks }: { navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-zinc-600 hover:text-zinc-900"
        aria-label="Toggle navigation menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-zinc-200 shadow-lg z-50">
          <nav className="flex flex-col p-4 gap-1 max-w-7xl mx-auto">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-base text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/submit-resource"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-3 text-base font-medium text-white bg-emerald-700 rounded-lg text-center"
            >
              Submit a Resource
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
