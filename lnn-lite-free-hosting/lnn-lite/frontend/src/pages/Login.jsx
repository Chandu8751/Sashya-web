import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(email, password);
      const staffRoles = ['admin', 'reporter'];
      const dest = location.state?.from || (staffRoles.includes(user.role) ? '/admin' : '/');
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-1 font-display text-2xl font-bold text-lnn-ink">Log in to LNN</h1>
      <p className="mb-6 text-sm text-lnn-ink/60">Access your account to comment, like, and manage news.</p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-lnn-ink">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-lnn-line px-3 py-2 outline-none focus:border-lnn-red"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-lnn-ink">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-lnn-line px-3 py-2 outline-none focus:border-lnn-red"
          />
        </div>
        {error && <p className="text-sm text-lnn-red">{error}</p>}
        <button
          disabled={busy}
          className="w-full rounded-full bg-lnn-red py-2.5 font-semibold text-white hover:bg-lnn-red-dark disabled:opacity-60"
        >
          {busy ? 'Logging in…' : 'Log In'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-lnn-ink/60">
        New here? <Link to="/register" className="font-semibold text-lnn-red hover:underline">Create an account</Link>
      </p>

      <div className="mt-6 rounded-lg border border-lnn-line bg-lnn-mist p-3 text-xs text-lnn-ink/60">
        Seeded demo accounts — admin@lnn.local / Admin@123 · reporter@lnn.local / Reporter@123
      </div>
    </div>
  );
}
