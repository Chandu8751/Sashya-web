import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, CloudSun, Phone, Mail } from 'lucide-react';
import api from '../api/axios';
import ArticleCard from '../components/ArticleCard';
import { EmptyState } from './Home';
import { resolveImage } from '../components/ArticleCard';

export default function DistrictPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/districts/${slug}`)
      .then((res) => setData(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="px-4 py-16 text-center text-lnn-ink/50">Loading…</div>;
  if (notFound || !data) return <div className="px-4 py-16 text-center">District not found.</div>;

  const { district, articles, reporters } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-lnn-ink">{district.name} District</h1>
      <p className="text-sm text-lnn-ink/50">{district.state}</p>

      {district.emergencyAlert && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-lnn-red bg-red-50 p-3 text-sm text-lnn-red-dark">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <span>{district.emergencyAlert}</span>
        </div>
      )}
      {district.weatherInfo && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-lnn-line bg-lnn-mist p-3 text-sm text-lnn-ink/80">
          <CloudSun size={18} className="mt-0.5 shrink-0 text-lnn-red" />
          <span>{district.weatherInfo}</span>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 border-b-2 border-lnn-ink pb-2 font-display text-xl font-bold uppercase tracking-wide">
            Latest News
          </h2>
          {articles.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {articles.map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          ) : (
            <EmptyState title="No stories yet" body="News from this district will appear here." />
          )}
        </div>

        <div>
          <h2 className="mb-4 border-b-2 border-lnn-ink pb-2 font-display text-xl font-bold uppercase tracking-wide">
            Reporters
          </h2>
          <div className="space-y-4">
            {reporters.length > 0 ? (
              reporters.map((r) => (
                <div key={r._id} className="flex gap-3 rounded-lg border border-lnn-line p-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-lnn-mist">
                    {r.photo && <img src={resolveImage(r.photo)} alt={r.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-semibold text-lnn-ink">
                      {r.name}
                      {r.isLive && (
                        <span className="rounded bg-lnn-red px-1.5 py-0.5 text-[10px] font-bold text-white">LIVE</span>
                      )}
                    </p>
                    <p className="text-xs text-lnn-ink/50">{r.designation}</p>
                    <div className="mt-1 flex flex-col gap-0.5 text-xs text-lnn-ink/60">
                      {r.phone && <span className="flex items-center gap-1"><Phone size={11} /> {r.phone}</span>}
                      {r.email && <span className="flex items-center gap-1"><Mail size={11} /> {r.email}</span>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No reporters listed" body="Add reporter profiles from the admin dashboard." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
