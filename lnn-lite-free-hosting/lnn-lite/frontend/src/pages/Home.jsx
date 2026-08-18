import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import CategoryNav from '../components/CategoryNav';
import ArticleCard from '../components/ArticleCard';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtNews, setDistrictNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/categories'),
      api.get('/articles', { params: { featured: 'true', limit: 4 } }),
      api.get('/articles', { params: { limit: 9 } }),
      api.get('/districts'),
    ])
      .then(([cats, feat, lat, dist]) => {
        if (!mounted) return;
        setCategories(cats.data.categories);
        setFeatured(feat.data.articles);
        setLatest(lat.data.articles);
        setDistricts(dist.data.districts);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (districts.length === 0) return;
    api
      .get('/districts/' + districts[0].slug)
      .then((res) => setDistrictNews(res.data.articles.slice(0, 4)))
      .catch(() => {});
  }, [districts]);

  const [mainFeature, ...sideFeatures] = featured;

  return (
    <div>
      <CategoryNav categories={categories} />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="h-80 animate-pulse rounded-lg bg-lnn-mist lg:col-span-2" />
            <div className="grid grid-rows-3 gap-4">
              <div className="h-24 animate-pulse rounded-lg bg-lnn-mist" />
              <div className="h-24 animate-pulse rounded-lg bg-lnn-mist" />
              <div className="h-24 animate-pulse rounded-lg bg-lnn-mist" />
            </div>
          </div>
        ) : mainFeature ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ArticleCard article={mainFeature} size="lg" />
            </div>
            <div className="flex flex-col gap-4">
              {sideFeatures.slice(0, 3).map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No featured stories yet"
            body="Once your team publishes and marks stories as featured, they'll headline this space."
          />
        )}
      </section>

      {/* Latest headlines */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionHeading title="Top Headlines" to="/category/local-news" />
        {loading ? (
          <GridSkeleton />
        ) : latest.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {latest.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        ) : (
          <EmptyState title="No news published yet" body="Published articles will appear here as soon as your newsroom adds them." />
        )}
      </section>

      {/* District spotlight */}
      {districts[0] && (
        <section className="bg-lnn-mist py-8">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading title={`${districts[0].name} District News`} to={`/district/${districts[0].slug}`} />
            {districtNews.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {districtNews.map((a) => (
                  <ArticleCard key={a._id} article={a} />
                ))}
              </div>
            ) : (
              <EmptyState title="No district stories yet" body="Check back soon for local updates from this district." />
            )}
          </div>
        </section>
      )}

      {/* Districts strip */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionHeading title="Browse by District" to="/districts" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {districts.map((d) => (
            <Link
              key={d._id}
              to={`/district/${d.slug}`}
              className="rounded-lg border border-lnn-line bg-white px-4 py-6 text-center font-display font-semibold text-lnn-ink hover:border-lnn-red hover:text-lnn-red"
            >
              {d.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ title, to }) {
  return (
    <div className="mb-4 flex items-center justify-between border-b-2 border-lnn-ink pb-2">
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-lnn-ink">
        <span className="mr-2 inline-block h-4 w-1.5 bg-lnn-red align-middle" />
        {title}
      </h2>
      {to && (
        <Link to={to} className="text-sm font-semibold text-lnn-red hover:underline">
          View all
        </Link>
      )}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-52 animate-pulse rounded-lg bg-lnn-mist" />
      ))}
    </div>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="rounded-lg border border-dashed border-lnn-line bg-lnn-mist/50 px-6 py-10 text-center">
      <p className="font-display font-semibold text-lnn-ink">{title}</p>
      <p className="mt-1 text-sm text-lnn-ink/60">{body}</p>
    </div>
  );
}

export { SectionHeading, EmptyState, GridSkeleton };
