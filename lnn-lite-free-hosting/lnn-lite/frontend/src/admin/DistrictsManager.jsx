import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import api from '../api/axios';

export default function DistrictsManager() {
  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState({ name: '', weatherInfo: '', emergencyAlert: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/districts').then((res) => setDistricts(res.data.districts)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setError('');
    try {
      await api.post('/districts', form);
      setForm({ name: '', weatherInfo: '', emergencyAlert: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add district');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this district?')) return;
    await api.delete(`/districts/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-lnn-ink">Districts</h1>

      <form onSubmit={add} className="mb-6 space-y-3 rounded-lg border border-lnn-line bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="District name"
            className="lnn-input"
          />
          <input
            value={form.weatherInfo}
            onChange={(e) => setForm((f) => ({ ...f, weatherInfo: e.target.value }))}
            placeholder="Weather info (optional)"
            className="lnn-input"
          />
          <input
            value={form.emergencyAlert}
            onChange={(e) => setForm((f) => ({ ...f, emergencyAlert: e.target.value }))}
            placeholder="Emergency alert (optional)"
            className="lnn-input"
          />
        </div>
        <button className="flex items-center gap-1.5 rounded-full bg-lnn-red px-4 py-2 text-sm font-semibold text-white hover:bg-lnn-red-dark">
          <Plus size={16} /> Add District
        </button>
      </form>
      {error && <p className="mb-3 text-sm text-lnn-red">{error}</p>}

      <div className="rounded-lg border border-lnn-line bg-white">
        {loading ? (
          <p className="px-4 py-8 text-center text-lnn-ink/50">Loading…</p>
        ) : (
          <ul className="divide-y divide-lnn-line">
            {districts.map((d) => (
              <li key={d._id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-lnn-ink">{d.name}</p>
                  {d.emergencyAlert && <p className="text-xs text-lnn-red">{d.emergencyAlert}</p>}
                </div>
                <button onClick={() => remove(d._id)} className="rounded p-1.5 text-lnn-red hover:bg-red-50" aria-label="Delete">
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
