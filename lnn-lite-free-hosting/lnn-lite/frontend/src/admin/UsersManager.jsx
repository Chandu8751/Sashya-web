import { useEffect, useState } from 'react';
import { Plus, Trash2, KeyRound } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'reporter' };

export default function UsersManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [resetId, setResetId] = useState(null);
  const [resetPassword, setResetPassword] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/users').then((res) => setUsers(res.data.users)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const createUser = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      await api.post('/users', form);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const changeRole = async (u, role) => {
    await api.put(`/users/${u._id}`, { role });
    load();
  };

  const toggleActive = async (u) => {
    await api.put(`/users/${u._id}`, { isActive: !u.isActive });
    load();
  };

  const submitReset = async (e) => {
    e.preventDefault();
    if (!resetPassword.trim()) return;
    await api.put(`/users/${resetId}`, { password: resetPassword });
    setResetId(null);
    setResetPassword('');
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name}'s account? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${u._id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-lnn-ink">Users</h1>
      <p className="mb-6 text-sm text-lnn-ink/60">
        Create login accounts for your newsroom. <strong>Admin</strong> can manage
        everything; <strong>Reporter</strong> can create and edit their own articles
        (an admin publishes them); <strong>Viewer</strong> is the role public visitors
        get when they self-register — they can comment and like.
      </p>

      <form onSubmit={createUser} className="mb-6 rounded-lg border border-lnn-line bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="lnn-input"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="lnn-input"
          />
          <input
            required
            type="password"
            minLength={6}
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="lnn-input"
          />
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="lnn-input"
          >
            <option value="reporter">Reporter</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            disabled={creating}
            className="flex items-center gap-1.5 rounded-full bg-lnn-red px-4 py-2 text-sm font-semibold text-white hover:bg-lnn-red-dark disabled:opacity-60"
          >
            <Plus size={16} /> Create User
          </button>
          {error && <span className="text-sm text-lnn-red">{error}</span>}
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-lnn-line bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-lnn-line bg-lnn-mist text-left text-xs uppercase tracking-wide text-lnn-ink/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-lnn-ink/50">Loading…</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-b border-lnn-line last:border-0">
                  <td className="px-4 py-3 font-medium text-lnn-ink">
                    {u.name} {u._id === currentUser?.id && <span className="text-xs text-lnn-ink/40">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-lnn-ink/60">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u, e.target.value)}
                      className="rounded border border-lnn-line px-2 py-1 text-xs"
                    >
                      <option value="admin">Admin</option>
                      <option value="reporter">Reporter</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(u)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setResetId(u._id); setResetPassword(''); }}
                        className="rounded p-1.5 hover:bg-lnn-mist"
                        aria-label="Reset password"
                        title="Reset password"
                      >
                        <KeyRound size={15} />
                      </button>
                      <button onClick={() => remove(u)} className="rounded p-1.5 text-lnn-red hover:bg-red-50" aria-label="Delete">
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

      {resetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form onSubmit={submitReset} className="w-full max-w-sm rounded-lg bg-white p-5">
            <h2 className="mb-3 font-display text-lg font-bold text-lnn-ink">Reset password</h2>
            <input
              required
              type="password"
              minLength={6}
              autoFocus
              placeholder="New password (min 6 chars)"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              className="lnn-input"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setResetId(null)} className="rounded-full border border-lnn-line px-4 py-2 text-sm font-semibold hover:bg-lnn-mist">
                Cancel
              </button>
              <button className="rounded-full bg-lnn-red px-4 py-2 text-sm font-semibold text-white hover:bg-lnn-red-dark">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
