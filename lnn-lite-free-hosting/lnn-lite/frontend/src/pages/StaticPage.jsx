import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const TITLES = {
  about: 'About',
  advertise: 'Advertise',
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
  careers: 'Careers',
};

// Renders whichever slug is in the URL (mounted at /about, /advertise, /privacy,
// /terms, /careers). Content is edited from Admin → Pages — no code changes needed
// to update copy on any of these.
export default function StaticPage({ slug: slugProp }) {
  const params = useParams();
  const slug = slugProp || params.slug;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/pages/${slug}`)
      .then((res) => setPage(res.data.page))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-lnn-ink/50">Loading…</div>;
  }
  if (notFound || !page) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Page not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-4 font-display text-3xl font-bold text-lnn-ink">
        {page.title || TITLES[slug] || slug}
      </h1>
      <div className="whitespace-pre-line text-lnn-ink/80 leading-relaxed">{page.content}</div>
    </div>
  );
}
