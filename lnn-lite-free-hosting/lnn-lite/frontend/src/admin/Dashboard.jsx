import { useEffect, useState } from 'react';
import { Newspaper, Radio, Tag, MapPin, Eye, MessageCircle } from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/articles', { params: { status: 'published', limit: 1 } }),
      api.get('/articles', { params: { status: 'draft', limit: 1 } }),
      api.get('/articles', { params: { status: 'pending', limit: 1 } }),
      api.get('/breaking-news/all'),
      api.get('/categories'),
      api.get('/districts'),
    ]).then(([published, draft, pending, breaking, categories, districts]) => {
      setStats({
        published: published.data.total,
        draft: draft.data.total,
        pending: pending.data.total,
        breaking: breaking.data.count,
        categories: categories.data.count,
        districts: districts.data.count,
      });
    });
  }, []);

  const cards = [
    { label: 'Published Articles', value: stats?.published, icon: Newspaper },
    { label: 'Draft Articles', value: stats?.draft, icon: Newspaper },
    { label: 'Pending Review', value: stats?.pending, icon: Eye },
    { label: 'Breaking News Items', value: stats?.breaking, icon: Radio },
    { label: 'Categories', value: stats?.categories, icon: Tag },
    { label: 'Districts', value: stats?.districts, icon: MapPin },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-lnn-ink">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-lnn-line bg-white p-4">
            <Icon size={18} className="mb-2 text-lnn-red" />
            <p className="font-display text-2xl font-bold text-lnn-ink">{value ?? '—'}</p>
            <p className="text-xs text-lnn-ink/60">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-lnn-line bg-white p-5 text-sm text-lnn-ink/70">
        <p className="mb-2 flex items-center gap-2 font-semibold text-lnn-ink">
          <MessageCircle size={16} className="text-lnn-red" /> Quick tips
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li>Create a category and a district first, then publish your first article.</li>
          <li>Pin a breaking news item to keep it first in the ticker.</li>
          <li>Reporters can only edit and delete their own articles; editors and admins can manage everything.</li>
        </ul>
      </div>
    </div>
  );
}
