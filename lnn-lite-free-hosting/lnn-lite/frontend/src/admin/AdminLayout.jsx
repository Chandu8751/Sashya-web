import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Radio, Tag, MapPin, Settings as SettingsIcon, FileText, Users, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/articles', label: 'Articles', icon: Newspaper },
  { to: '/admin/breaking-news', label: 'Breaking News', icon: Radio },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/districts', label: 'Districts', icon: MapPin },
];

const ADMIN_ONLY_LINKS = [
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
  { to: '/admin/pages', label: 'Pages', icon: FileText },
  { to: '/admin/users', label: 'Users', icon: Users },
];

const ADMIN_ONLY_ROLES = ['admin'];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const links = ADMIN_ONLY_ROLES.includes(user?.role) ? [...LINKS, ...ADMIN_ONLY_LINKS] : LINKS;

  return (
    <div className="flex min-h-screen bg-lnn-mist">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-lnn-line bg-lnn-ink text-white md:flex">
        <div className="px-5 py-5">
          <BrandLogo size="sm" dark />
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-white/50">Admin Panel</p>
        </div>
        <nav className="flex-1 px-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-2.5 rounded px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-lnn-red text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4 text-xs text-white/60">
          <p className="font-semibold text-white">{user?.name}</p>
          <p className="capitalize">{user?.role?.replace('_', ' ')}</p>
          <div className="mt-3 flex items-center gap-3">
            <a href="/" className="flex items-center gap-1 hover:text-lnn-gold"><ExternalLink size={12} /> View site</a>
            <button onClick={logout} className="hover:text-lnn-gold">Logout</button>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-lnn-line bg-white px-4 py-3 md:hidden">
          <BrandLogo size="sm" showName={false} />
          <span className="font-display font-bold">Admin</span>
          <button onClick={logout} className="text-sm text-lnn-red">Logout</button>
        </div>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
