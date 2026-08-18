import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['all', 'draft', 'pending', 'published', 'archived'];

export default function ArticlesList() {
  const { user } = useAuth();
  const [status, setStatus] = useState('all');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const isReporterOnly = user?.role === 'reporter';

  const load = () => {
    setLoading(true);
    const endpoint = isReporterOnly ? '/articles/mine' : '/articles';
    const params = isReporterOnly ? {} : status === 'all' ? { limit: 100 } : { status, limit: 100 };
    api
      .get(endpoint, { params })
      .then((res) => setArticles(res.data.articles))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async (id) => {
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    await api.delete(`/articles/${id}`);
    setArticles((a) => a.filter((x) => x._id !== id));
  };

  const setArticleStatus = async (article, newStatus) => {
    await api.put(`/articles/${article._id}`, { status: newStatus });
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-lnn-ink">Articles</h1>
        <Link
          to="/admin/articles/new"
          className="flex items-center gap-1.5 rounded-full bg-lnn-red px-4 py-2 text-sm font-semibold text-white hover:bg-lnn-red-dark"
        >
          <Plus size={16} /> New Article
        </Link>
      </div>

      {!isReporterOnly && (
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                status === s ? 'bg-lnn-red text-white' : 'border border-lnn-line bg-white text-lnn-ink/70'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-lnn-line bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-lnn-line bg-lnn-mist text-left text-xs uppercase tracking-wide text-lnn-ink/60">
            <tr>
              <th className="px-4 py-3">Headline</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-lnn-ink/50">Loading…</td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-lnn-ink/50">No articles found.</td></tr>
            ) : (
              articles.map((a) => (
                <tr key={a._id} className="border-b border-lnn-line last:border-0">
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-lnn-ink">{a.headline}</td>
                  <td className="px-4 py-3 text-lnn-ink/60">{a.category?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3 text-lnn-ink/60"><span className="flex items-center gap-1"><Eye size={13}/>{a.views}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {a.status !== 'published' && (
                        <button
                          onClick={() => setArticleStatus(a, 'published')}
                          className="rounded border border-lnn-line px-2 py-1 text-xs font-semibold hover:border-lnn-red hover:text-lnn-red"
                        >
                          Publish
                        </button>
                      )}
                      {a.status === 'published' && (
                        <button
                          onClick={() => setArticleStatus(a, 'archived')}
                          className="rounded border border-lnn-line px-2 py-1 text-xs font-semibold hover:border-lnn-red hover:text-lnn-red"
                        >
                          Archive
                        </button>
                      )}
                      <Link to={`/admin/articles/${a._id}/edit`} className="rounded p-1.5 hover:bg-lnn-mist" aria-label="Edit">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => remove(a._id)} className="rounded p-1.5 text-lnn-red hover:bg-red-50" aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-amber-100 text-amber-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${colors[status] || ''}`}>
      {status}
    </span>
  );
}
