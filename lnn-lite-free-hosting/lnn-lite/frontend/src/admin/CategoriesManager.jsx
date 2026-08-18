import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import api from '../api/axios';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/categories').then((res) => setCategories(res.data.categories)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    try {
      await api.post('/categories', { name: name.trim() });
      setName('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this category? Articles using it will keep the reference but it will no longer be selectable.')) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-lnn-ink">Categories</h1>

      <form onSubmit={add} className="mb-6 flex gap-3 rounded-lg border border-lnn-line bg-white p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name…"
          className="lnn-input flex-1"
        />
        <button className="flex items-center gap-1.5 rounded-full bg-lnn-red px-4 py-2 text-sm font-semibold text-white hover:bg-lnn-red-dark">
          <Plus size={16} /> Add
        </button>
      </form>
      {error && <p className="mb-3 text-sm text-lnn-red">{error}</p>}

      <div className="rounded-lg border border-lnn-line bg-white">
        {loading ? (
          <p className="px-4 py-8 text-center text-lnn-ink/50">Loading…</p>
        ) : (
          <ul className="divide-y divide-lnn-line">
            {categories.map((c) => (
              <li key={c._id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-lnn-ink">{c.name}</span>
                <button onClick={() => remove(c._id)} className="rounded p-1.5 text-lnn-red hover:bg-red-50" aria-label="Delete">
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
