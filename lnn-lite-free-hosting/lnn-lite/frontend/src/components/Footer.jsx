import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, YoutubeIcon, InstagramIcon } from './SocialIcons';
import BrandLogo from './BrandLogo';
import { useSettings } from '../context/SettingsContext';

const DISTRICTS = ['Nandyal', 'Kurnool', 'Anantapur', 'Kadapa', 'Chittoor'];

const SOCIAL_ICONS = [
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'twitter', label: 'Twitter', Icon: TwitterIcon },
  { key: 'youtube', label: 'YouTube', Icon: YoutubeIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
];

export default function Footer() {
  const { settings } = useSettings() || {};
  const siteName = settings?.siteName || 'Local News Network';
  const tagline = settings?.tagline || 'Nandyal and the Rayalaseema districts';
  const social = settings?.social || {};
  // Only render icons for platforms an admin has actually filled in a link for.
  const activeSocial = SOCIAL_ICONS.filter(({ key }) => social[key]);

  return (
    <footer className="mt-12 bg-lnn-ink text-white/80">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-3">
            <BrandLogo size="sm" dark />
          </div>
          <p className="text-sm text-white/60">
            Trusted local news, breaking alerts, and live coverage from {tagline}.
          </p>
          {activeSocial.length > 0 && (
            <div className="mt-4 flex gap-3">
              {activeSocial.map(({ key, label, Icon }) => (
                <a
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hover:text-lnn-gold"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-lnn-gold">Home</Link></li>
            <li><Link to="/breaking-news" className="hover:text-lnn-gold">Breaking News</Link></li>
            <li><Link to="/live-tv" className="hover:text-lnn-gold">Live TV</Link></li>
            <li><Link to="/about" className="hover:text-lnn-gold">About</Link></li>
            <li><Link to="/advertise" className="hover:text-lnn-gold">Advertise</Link></li>
            <li><Link to="/contact" className="hover:text-lnn-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-white">Districts</h4>
          <ul className="space-y-2 text-sm">
            {DISTRICTS.map((d) => (
              <li key={d}>
                <Link to={`/district/${d.toLowerCase()}`} className="hover:text-lnn-gold">{d}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-white">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-lnn-gold">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-lnn-gold">Terms of Use</Link></li>
            <li><Link to="/careers" className="hover:text-lnn-gold">Careers</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}
