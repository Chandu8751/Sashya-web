import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-bold text-lnn-red">404</p>
      <h1 className="mt-2 font-display text-xl font-bold text-lnn-ink">Page not found</h1>
      <p className="mt-1 text-sm text-lnn-ink/60">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="mt-6 rounded-full bg-lnn-red px-6 py-2.5 font-semibold text-white hover:bg-lnn-red-dark">
        Back to Home
      </Link>
    </div>
  );
}
