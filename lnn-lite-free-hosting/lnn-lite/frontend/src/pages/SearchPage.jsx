import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ArticleCard from '../components/ArticleCard';
import { EmptyState, GridSkeleton } from './Home';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) {
      setArticles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get('/articles', { params: { search: q, limit: 20 } })
      .then((res) => setArticles(res.data.articles))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 border-b-2 border-lnn-ink pb-2 font-display text-2xl font-bold uppercase tracking-wide">
        Search results for "{q}"
      </h1>
      {loading ? (
        <GridSkeleton />
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {articles.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      ) : (
        <EmptyState title="No results found" body="Try a different keyword or browse categories instead." />
      )}
    </div>
  );
}
