import { useEffect, useState } from 'react';
import api from '../api/axios';

const LABELS = {
  about: 'About',
  advertise: 'Advertise',
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
  careers: 'Careers',
};

export default function PagesManager() {
  const [pages, setPages] = useState([]);
  const [activeSlug, setActiveSlug] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/pages')
      .then((res) => {
        setPages(res.data.pages);
        if (!activeSlug && res.data.pages.length) selectPage(res.data.pages[0]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectPage = (page) => {
    setActiveSlug(page.slug);
    setForm({ title: page.title, content: page.content });
    setSaved(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await api.put(`/pages/${activeSlug}`, form);
      setPages((prev) => prev.map((p) => (p.slug === activeSlug ? res.data.page : p)));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-lnn-ink">Pages</h1>
      <p className="mb-6 text-sm text-lnn-ink/60">
        Edit the content shown on the About, Advertise, Privacy Policy, Terms of Use, and
        Careers pages (linked from the footer's Quick Links and Legal sections).
      </p>

      {loading ? (
        <p className="text-lnn-ink/50">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {pages.map((p) => (
              <button
                key={p.slug}
                onClick={() => selectPage(p)}
                className={`shrink-0 rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                  activeSlug === p.slug ? 'bg-lnn-red text-white' : 'border border-lnn-line bg-white text-lnn-ink/70 hover:border-lnn-red'
                }`}
              >
                {LABELS[p.slug] || p.slug}
              </button>
            ))}
          </div>

          <form onSubmit={save} className="space-y-4 rounded-lg border border-lnn-line bg-white p-5 md:col-span-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-lnn-ink">Page title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="lnn-input"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-lnn-ink">Content</label>
              <textarea
                required
                rows={12}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="lnn-input"
                placeholder="Leave a blank line between paragraphs."
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                disabled={saving}
                className="rounded-full bg-lnn-red px-6 py-2 text-sm font-semibold text-white hover:bg-lnn-red-dark disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Page'}
              </button>
              {saved && <span className="text-sm text-green-700">Saved.</span>}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
