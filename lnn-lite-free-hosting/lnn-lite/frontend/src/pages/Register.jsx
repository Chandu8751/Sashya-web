import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-1 font-display text-2xl font-bold text-lnn-ink">Create your account</h1>
      <p className="mb-6 text-sm text-lnn-ink/60">Comment, like, and follow news that matters to you.</p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-lnn-ink">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-lnn-line px-3 py-2 outline-none focus:border-lnn-red"
          />
        </div>
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
            minLength={6}
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
          {busy ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-lnn-ink/60">
        Already have an account? <Link to="/login" className="font-semibold text-lnn-red hover:underline">Log in</Link>
      </p>
    </div>
  );
}
