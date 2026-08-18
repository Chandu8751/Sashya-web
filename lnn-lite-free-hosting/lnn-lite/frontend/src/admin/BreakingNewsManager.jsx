import { useEffect, useState } from 'react';
import { Pin, Trash2, Plus } from 'lucide-react';
import api from '../api/axios';

export default function BreakingNewsManager() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/breaking-news/all').then((res) => setItems(res.data.items)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const add = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      await api.post('/breaking-news', { text: text.trim(), link: link.trim() });
      setText('');
      setLink('');
      load();
    } finally {
      setBusy(false);
    }
  };

  const togglePin = async (item) => {
    await api.put(`/breaking-news/${item._id}/pin`);
    load();
  };

  const toggleActive = async (item) => {
    await api.put(`/breaking-news/${item._id}`, { isActive: !item.isActive });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this breaking news item?')) return;
    await api.delete(`/breaking-news/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-lnn-ink">Breaking News</h1>

      <form onSubmit={add} className="mb-6 flex flex-col gap-3 rounded-lg border border-lnn-line bg-white p-4 sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Breaking news text…"
          className="lnn-input flex-1"
          required
        />
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Link (optional, /article/slug)"
          className="lnn-input sm:w-64"
        />
        <button
          disabled={busy}
          className="flex items-center justify-center gap-1.5 rounded-full bg-lnn-red px-4 py-2 text-sm font-semibold text-white hover:bg-lnn-red-dark disabled:opacity-60"
        >
          <Plus size={16} /> Add
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-lnn-line bg-white">
        {loading ? (
          <p className="px-4 py-8 text-center text-lnn-ink/50">Loading…</p>
        ) : items.length === 0 ? (
          <p className="px-4 py-8 text-center text-lnn-ink/50">No breaking news items yet.</p>
        ) : (
          <ul className="divide-y divide-lnn-line">
            {items.map((item) => (
              <li key={item._id} className="flex items-center gap-3 px-4 py-3">
                <button
                  onClick={() => togglePin(item)}
                  className={`rounded p-1.5 ${item.isPinned ? 'bg-lnn-red text-white' : 'text-lnn-ink/40 hover:bg-lnn-mist'}`}
                  title="Pin to top"
                >
                  <Pin size={15} />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-lnn-ink">{item.text}</p>
                  <p className="text-xs text-lnn-ink/50">by {item.createdBy?.name} · {new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-lnn-ink/60">
                  <input type="checkbox" checked={item.isActive} onChange={() => toggleActive(item)} />
                  Active
                </label>
                <button onClick={() => remove(item._id)} className="rounded p-1.5 text-lnn-red hover:bg-red-50" aria-label="Delete">
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
