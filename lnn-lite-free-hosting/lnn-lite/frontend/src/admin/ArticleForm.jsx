import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { resolveImage } from '../components/ArticleCard';

const EMPTY = {
  headline: '',
  subtitle: '',
  category: '',
  district: '',
  videoUrl: '',
  description: '',
  tags: '',
  status: 'draft',
  isFeatured: false,
};

export default function ArticleForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories));
    api.get('/districts').then((res) => setDistricts(res.data.districts));
  }, []);

  // Load the article for editing by scanning the admin list (keeps the API surface simple).
  useEffect(() => {
    if (!isEdit) return;
    api.get('/articles', { params: { limit: 1000 } }).then((res) => {
      const article = res.data.articles.find((a) => a._id === id);
      if (article) {
        setForm({
          headline: article.headline,
          subtitle: article.subtitle || '',
          category: article.category?._id || '',
          district: article.district?._id || '',
          videoUrl: article.videoUrl || '',
          description: article.description,
          tags: (article.tags || []).join(', '),
          status: article.status,
          isFeatured: article.isFeatured,
        });
        setExistingImage(article.featuredImage);
      }
    });
  }, [id, isEdit]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags') {
          v.split(',').map((t) => t.trim()).filter(Boolean).forEach((t) => fd.append('tags[]', t));
        } else {
          fd.append(k, v);
        }
      });
      if (imageFile) fd.append('featuredImage', imageFile);

      if (isEdit) {
        await api.put(`/articles/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/articles', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/admin/articles');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save article');
    } finally {
      setBusy(false);
    }
  };

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-lnn-ink">
        {isEdit ? 'Edit Article' : 'New Article'}
      </h1>

      <form onSubmit={submit} className="space-y-4 rounded-lg border border-lnn-line bg-white p-5">
        <Field label="Headline">
          <input required value={form.headline} onChange={set('headline')} className="lnn-input" />
        </Field>
        <Field label="Subtitle">
          <input value={form.subtitle} onChange={set('subtitle')} className="lnn-input" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select required value={form.category} onChange={set('category')} className="lnn-input">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="District">
            <select value={form.district} onChange={set('district')} className="lnn-input">
              <option value="">None</option>
              {districts.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Featured image">
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="lnn-input" />
          {existingImage && !imageFile && (
            <img src={resolveImage(existingImage)} alt="" className="mt-2 h-28 rounded object-cover" />
          )}
        </Field>

        <Field label="Video URL (YouTube/Facebook embed, optional)">
          <input value={form.videoUrl} onChange={set('videoUrl')} className="lnn-input" placeholder="https://www.youtube.com/embed/..." />
        </Field>

        <Field label="Description">
          <textarea required rows={8} value={form.description} onChange={set('description')} className="lnn-input" />
        </Field>

        <Field label="Tags (comma separated)">
          <input value={form.tags} onChange={set('tags')} className="lnn-input" placeholder="politics, nandyal, elections" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select value={form.status} onChange={set('status')} className="lnn-input">
              <option value="draft">Draft</option>
              <option value="pending">Pending Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-lnn-ink">
            <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} />
            Mark as featured (shown in homepage hero)
          </label>
        </div>

        {error && <p className="text-sm text-lnn-red">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="rounded-full border border-lnn-line px-5 py-2 text-sm font-semibold text-lnn-ink hover:bg-lnn-mist"
          >
            Cancel
          </button>
          <button
            disabled={busy}
            className="rounded-full bg-lnn-red px-6 py-2 text-sm font-semibold text-white hover:bg-lnn-red-dark disabled:opacity-60"
          >
            {busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-lnn-ink">{label}</label>
      {children}
    </div>
  );
}
