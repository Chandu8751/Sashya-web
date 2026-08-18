import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pin } from 'lucide-react';
import api from '../api/axios';

// Polls instead of using websockets — keeps this deployable on free hosts (Render,
// Vercel serverless, etc.) that don't handle long-lived socket connections well.
// A 20s interval keeps the ticker feeling live without hammering the API.
const POLL_INTERVAL_MS = 20000;

export default function BreakingNewsTicker() {
  const [items, setItems] = useState([]);

  const load = useCallback(() => {
    api
      .get('/breaking-news')
      .then((res) => setItems(res.data.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div className="flex items-stretch bg-lnn-ink text-white">
      <div className="flex shrink-0 items-center gap-2 bg-lnn-red px-4 py-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="lnn-live-dot absolute inline-flex h-full w-full rounded-full bg-white" />
        </span>
        <span className="font-display text-sm font-bold uppercase tracking-widest">Breaking</span>
      </div>
      <div className="relative flex flex-1 items-center overflow-hidden py-2.5">
        <div className="lnn-marquee-track flex w-max shrink-0 items-center gap-10 whitespace-nowrap px-6">
          {doubled.map((item, idx) => (
            <Link
              key={`${item._id}-${idx}`}
              to={item.link || '#'}
              className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-lnn-gold"
            >
              {item.isPinned && <Pin size={13} className="text-lnn-gold" />}
              {item.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
