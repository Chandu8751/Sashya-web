import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { FacebookIcon, TwitterIcon, YoutubeIcon, InstagramIcon } from './SocialIcons';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const SOCIAL_ICONS = [
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'twitter', label: 'Twitter', Icon: TwitterIcon },
  { key: 'youtube', label: 'YouTube', Icon: YoutubeIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
];

export default function TopBar() {
  const { user, logout } = useAuth();
  const { settings } = useSettings() || {};
  const social = settings?.social || {};
  const activeSocial = SOCIAL_ICONS.filter(({ key }) => social[key]);
  const [now, setNow] = useState(new Date());
  const [lang, setLang] = useState('te');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-lnn-ink text-white text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5">
        <div className="hidden items-center gap-3 tabular sm:flex">
          <span>{dateStr}</span>
          <span className="text-white/40">|</span>
          <span>{timeStr} IST</span>
        </div>

        <div className="flex items-center gap-4">
          {activeSocial.length > 0 && (
            <div className="hidden items-center gap-2 text-white/70 sm:flex">
              {activeSocial.map(({ key, label, Icon }) => (
                <a
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hover:text-lnn-gold"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          )}

          <button
            onClick={() => setLang((l) => (l === 'te' ? 'en' : 'te'))}
            className="flex items-center gap-1 rounded border border-white/20 px-2 py-0.5 hover:border-lnn-gold hover:text-lnn-gold"
          >
            <Globe size={12} />
            {lang === 'te' ? 'తెలుగు' : 'English'}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="hover:text-lnn-gold">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-lnn-gold">Login</Link>
          )}
          <Link
            to="/login"
            className="rounded bg-lnn-red px-3 py-1 font-semibold tracking-wide hover:bg-lnn-red-light"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  );
}
