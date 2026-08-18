import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Link as LinkIcon, Heart, MessageCircle, Eye } from 'lucide-react';
import { FacebookIcon, TwitterIcon } from '../components/SocialIcons';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { resolveImage, timeAgo } from '../components/ArticleCard';
import ArticleCard from '../components/ArticleCard';

export default function ArticlePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = () => {
    api
      .get(`/articles/${slug}`)
      .then((res) => {
        setArticle(res.data.article);
        setRelated(res.data.related);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const toggleLike = async () => {
    if (!user) return;
    const res = await api.put(`/articles/${article._id}/like`);
    setArticle((a) => ({ ...a, likes: Array(res.data.likesCount).fill(user._id) }));
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    const res = await api.post(`/articles/${article._id}/comments`, { text: commentText.trim() });
    setArticle((a) => ({ ...a, comments: res.data.comments }));
    setCommentText('');
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-lnn-ink/50">Loading article…</div>;
  }
  if (notFound || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Article not found</h1>
        <Link to="/" className="mt-3 inline-block text-lnn-red hover:underline">Back to home</Link>
      </div>
    );
  }

  const image = resolveImage(article.featuredImage);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 text-xs text-lnn-ink/50">
        <Link to="/" className="hover:text-lnn-red">Home</Link>
        {article.category && (
          <>
            {' / '}
            <Link to={`/category/${article.category.slug}`} className="hover:text-lnn-red">
              {article.category.name}
            </Link>
          </>
        )}
      </nav>

      {article.category && (
        <span className="mb-3 inline-block rounded bg-lnn-red px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {article.category.name}
        </span>
      )}
      <h1 className="font-display text-3xl font-bold leading-tight text-lnn-ink sm:text-4xl">
        {article.headline}
      </h1>
      {article.subtitle && <p className="mt-2 text-lg text-lnn-ink/60">{article.subtitle}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-lnn-line py-3 text-sm text-lnn-ink/60">
        <span className="font-semibold text-lnn-ink">{article.author?.name}</span>
        {article.district?.name && <span>· {article.district.name}</span>}
        <span>· {timeAgo(article.publishedAt || article.createdAt)}</span>
        <span className="ml-auto flex items-center gap-1"><Eye size={14} /> {article.views}</span>
      </div>

      {image && (
        <img src={image} alt={article.headline} className="mt-6 w-full rounded-lg object-cover" />
      )}

      {article.videoUrl && (
        <div className="mt-6 aspect-video overflow-hidden rounded-lg bg-black">
          <iframe
            src={article.videoUrl}
            title="Article video"
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      )}

      <div className="prose mt-6 max-w-none whitespace-pre-line text-base leading-relaxed text-lnn-ink/90">
        {article.description}
      </div>

      {article.gallery?.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {article.gallery.map((g, i) => (
            <img key={i} src={resolveImage(g)} alt="" className="aspect-square rounded object-cover" />
          ))}
        </div>
      )}

      {article.tags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map((t) => (
            <span key={t} className="rounded-full bg-lnn-mist px-3 py-1 text-xs text-lnn-ink/70">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-lnn-line py-4">
        <button
          onClick={toggleLike}
          disabled={!user}
          className="flex items-center gap-1.5 rounded-full border border-lnn-line px-4 py-2 text-sm font-semibold hover:border-lnn-red hover:text-lnn-red disabled:opacity-50"
        >
          <Heart size={16} /> {article.likes?.length || 0} Like
        </button>
        <span className="flex items-center gap-1.5 text-sm text-lnn-ink/60">
          <MessageCircle size={16} /> {article.comments?.length || 0} Comments
        </span>
        <div className="ml-auto flex items-center gap-2">
          <ShareBtn href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} icon={<FacebookIcon size={16} />} />
          <ShareBtn href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} icon={<TwitterIcon size={16} />} />
          <ShareBtn href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} icon={<Send size={16} />} />
          <button
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-lnn-line hover:border-lnn-red hover:text-lnn-red"
            aria-label="Copy link"
          >
            <LinkIcon size={16} />
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-6">
        <h3 className="font-display text-lg font-bold">Comments</h3>
        {user ? (
          <form onSubmit={submitComment} className="mt-3 flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 rounded-full border border-lnn-line px-4 py-2 text-sm outline-none focus:border-lnn-red"
            />
            <button className="rounded-full bg-lnn-red px-4 py-2 text-sm font-semibold text-white hover:bg-lnn-red-dark">
              Post
            </button>
          </form>
        ) : (
          <p className="mt-2 text-sm text-lnn-ink/60">
            <Link to="/login" className="text-lnn-red hover:underline">Log in</Link> to join the conversation.
          </p>
        )}
        <ul className="mt-4 space-y-3">
          {article.comments?.slice().reverse().map((c) => (
            <li key={c._id} className="rounded-lg bg-lnn-mist p-3 text-sm">
              <span className="font-semibold">{c.user?.name || 'User'}</span>
              <p className="mt-1 text-lnn-ink/80">{c.text}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-wide">Related News</h3>
          <div className="grid grid-cols-2 gap-4">
            {related.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShareBtn({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-lnn-line hover:border-lnn-red hover:text-lnn-red"
    >
      {icon}
    </a>
  );
}
