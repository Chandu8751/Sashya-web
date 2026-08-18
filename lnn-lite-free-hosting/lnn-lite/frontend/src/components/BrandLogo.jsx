import { useSettings } from '../context/SettingsContext';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

function resolveLogo(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_ORIGIN}${url}`;
}

/**
 * size: 'sm' | 'md' | 'lg' — controls the badge/image size
 * showTagline: whether to render the tagline under the site name (desktop header only)
 * dark: use light text (for dark backgrounds like the footer/admin sidebar)
 */
export default function BrandLogo({ size = 'md', showTagline = false, dark = false, showName = true }) {
  const { settings } = useSettings() || {};
  const siteName = settings?.siteName || 'Local News Network';
  const shortName = settings?.shortName || 'LNN';
  const tagline = settings?.tagline || '';
  const logo = resolveLogo(settings?.logoUrl);

  const dims = { sm: 'h-9 w-9 text-base', md: 'h-11 w-11 text-xl', lg: 'h-14 w-14 text-2xl' }[size];
  const nameSize = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' }[size];

  return (
    <span className="flex items-center gap-2">
      {logo ? (
        <img src={logo} alt={siteName} className={`${dims} shrink-0 rounded object-cover`} />
      ) : (
        <span className={`flex ${dims} shrink-0 items-center justify-center rounded bg-lnn-red font-display font-bold text-white`}>
          {shortName}
        </span>
      )}
      {showName && (
        <span className="hidden flex-col leading-tight sm:flex">
          <span className={`font-display ${nameSize} font-bold ${dark ? 'text-white' : 'text-lnn-ink'}`}>
            {siteName}
          </span>
          {showTagline && tagline && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lnn-red">
              {tagline}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
