import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading, isStaff } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-lnn-ink/50">Loading…</div>;
  }
  if (!user || !isStaff) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
