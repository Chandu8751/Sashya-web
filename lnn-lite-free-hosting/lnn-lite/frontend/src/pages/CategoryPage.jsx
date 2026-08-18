import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ArticleCard from '../components/ArticleCard';
import { EmptyState, GridSkeleton } from './Home';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((res) => {
      setCategory(res.data.categories.find((c) => c.slug === slug) || { name: slug });
    });
  }, [slug]);

  useEffect(() => {
    if (!category?._id) return;
    setLoading(true);
    api
      .get('/articles', { params: { category: category._id, page, limit: 12 } })
      .then((res) => {
        setArticles(res.data.articles);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [category, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 border-b-2 border-lnn-ink pb-2 font-display text-2xl font-bold uppercase tracking-wide">
        <span className="mr-2 inline-block h-4 w-1.5 bg-lnn-red align-middle" />
        {category?.name || slug}
      </h1>
      {loading ? (
        <GridSkeleton />
      ) : articles.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {articles.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
          {pages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-8 w-8 rounded-full text-sm font-semibold ${
                    page === i + 1 ? 'bg-lnn-red text-white' : 'border border-lnn-line hover:border-lnn-red'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <EmptyState title="No stories in this category yet" body="Check back soon, or browse other categories from the nav." />
      )}
    </div>
  );
}
