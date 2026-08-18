import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import PublicLayout from './components/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import DistrictPage from './pages/DistrictPage';
import DistrictsList from './pages/DistrictsList';
import LiveTV from './pages/LiveTV';
import BreakingNewsPage from './pages/BreakingNewsPage';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StaticPage from './pages/StaticPage';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ArticlesList from './admin/ArticlesList';
import ArticleForm from './admin/ArticleForm';
import BreakingNewsManager from './admin/BreakingNewsManager';
import CategoriesManager from './admin/CategoriesManager';
import DistrictsManager from './admin/DistrictsManager';
import SettingsManager from './admin/SettingsManager';
import PagesManager from './admin/PagesManager';
import UsersManager from './admin/UsersManager';

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/district/:slug" element={<DistrictPage />} />
            <Route path="/districts" element={<DistrictsList />} />
            <Route path="/live-tv" element={<LiveTV />} />
            <Route path="/breaking-news" element={<BreakingNewsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<StaticPage slug="about" />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<StaticPage slug="privacy" />} />
            <Route path="/terms" element={<StaticPage slug="terms" />} />
            <Route path="/careers" element={<StaticPage slug="careers" />} />
            <Route path="/advertise" element={<StaticPage slug="advertise" />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<ArticlesList />} />
            <Route path="articles/new" element={<ArticleForm />} />
            <Route path="articles/:id/edit" element={<ArticleForm />} />
            <Route path="breaking-news" element={<BreakingNewsManager />} />
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="districts" element={<DistrictsManager />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="pages" element={<PagesManager />} />
            <Route path="users" element={<UsersManager />} />
          </Route>
        </Routes>
      </SettingsProvider>
    </AuthProvider>
  );
}
