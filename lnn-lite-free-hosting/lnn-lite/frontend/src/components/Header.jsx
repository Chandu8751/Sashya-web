import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Menu, X, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Breaking News', to: '/breaking-news' },
  { label: 'Districts', to: '/districts' },
  { label: 'Jobs', to: '/category/jobs' },
  { label: 'Contact', to: '/contact' },
  { label: 'About', to: '/about' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { isStaff } = useAuth();

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
      isActive ? 'text-lnn-red' : 'text-lnn-ink hover:text-lnn-red'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-lnn-line bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center shrink-0">
          <BrandLogo size="md" showTagline />
        </Link>

        <form onSubmit={submitSearch} className="hidden max-w-md flex-1 items-center md:flex">
          <div className="flex w-full items-center rounded-full border border-lnn-line bg-lnn-mist px-4 py-2">
            <Search size={16} className="text-lnn-ink/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search news, districts, topics..."
              className="ml-2 w-full bg-transparent text-sm outline-none"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          <Link
            to="/live-tv"
            className="flex items-center gap-1.5 rounded-full bg-lnn-red px-4 py-2 text-sm font-bold uppercase tracking-wide text-white hover:bg-lnn-red-dark"
          >
            <Radio size={15} className="lnn-live-dot" />
            Live TV
          </Link>
          {isStaff && (
            <Link
              to="/admin"
              className="hidden rounded-full border border-lnn-ink px-4 py-2 text-sm font-semibold hover:border-lnn-red hover:text-lnn-red lg:inline-block"
            >
              Admin
            </Link>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded p-2 text-lnn-ink hover:bg-lnn-mist lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-lnn-line bg-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center px-4">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {open && (
        <div className="border-t border-lnn-line bg-white lg:hidden">
          <form onSubmit={submitSearch} className="px-4 py-3">
            <div className="flex items-center rounded-full border border-lnn-line bg-lnn-mist px-4 py-2">
              <Search size={16} className="text-lnn-ink/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search news..."
                className="ml-2 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </form>
          <div className="flex flex-col pb-2">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-lnn-line px-4 py-3 text-sm font-semibold uppercase tracking-wide text-lnn-ink hover:bg-lnn-mist"
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
            {isStaff && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-semibold uppercase tracking-wide text-lnn-red"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
