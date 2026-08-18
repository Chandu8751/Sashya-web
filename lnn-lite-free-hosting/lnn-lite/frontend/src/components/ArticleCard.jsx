import { Link } from 'react-router-dom';
import { Eye, MessageCircle } from 'lucide-react';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_ORIGIN}${url}`;
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ArticleCard({ article, size = 'md' }) {
  const image = resolveImage(article.featuredImage);
  const isLarge = size === 'lg';

  return (
    <Link
      to={`/article/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-lnn-line bg-white transition-shadow hover:shadow-md"
    >
      <div className={`relative overflow-hidden bg-lnn-mist ${isLarge ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-lnn-ink/20">
            LNN
          </div>
        )}
        {article.category?.name && (
          <span className="absolute left-2 top-2 rounded bg-lnn-red px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
            {article.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <h3
          className={`font-display font-semibold leading-snug text-lnn-ink group-hover:text-lnn-red ${
            isLarge ? 'text-2xl lnn-clamp-2' : 'text-base lnn-clamp-2'
          }`}
        >
          {article.headline}
        </h3>
        {isLarge && article.subtitle && (
          <p className="lnn-clamp-2 text-sm text-lnn-ink/60">{article.subtitle}</p>
        )}
        <div className="mt-auto flex items-center gap-3 text-xs text-lnn-ink/50">
          {article.district?.name && <span>{article.district.name}</span>}
          <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
          <span className="ml-auto flex items-center gap-1">
            <Eye size={12} /> {article.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} /> {article.comments?.length || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}

export { resolveImage, timeAgo };
