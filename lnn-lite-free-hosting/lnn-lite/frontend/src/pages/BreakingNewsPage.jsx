import { useEffect, useState } from 'react';
import { Pin, Clock } from 'lucide-react';
import api from '../api/axios';

export default function BreakingNewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/breaking-news')
      .then((res) => setItems(res.data.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 border-b-2 border-lnn-ink pb-2 font-display text-2xl font-bold uppercase tracking-wide">
        <span className="mr-2 inline-block h-4 w-1.5 bg-lnn-red align-middle" />
        Breaking News
      </h1>
      {loading ? (
        <p className="text-lnn-ink/50">Loading…</p>
      ) : items.length > 0 ? (
        <ul className="divide-y divide-lnn-line">
          {items.map((item) => (
            <li key={item._id} className="flex items-start gap-3 py-4">
              {item.isPinned && <Pin size={16} className="mt-0.5 shrink-0 text-lnn-red" />}
              <div>
                <p className="font-medium text-lnn-ink">{item.text}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-lnn-ink/50">
                  <Clock size={12} />
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lnn-ink/50">No breaking news right now.</p>
      )}
    </div>
  );
}
