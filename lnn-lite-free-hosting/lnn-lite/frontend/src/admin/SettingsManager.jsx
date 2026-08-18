import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useSettings } from '../context/SettingsContext';
import { resolveImage } from '../components/ArticleCard';

const EMPTY = {
  siteName: '',
  shortName: '',
  tagline: '',
  social: { facebook: '', twitter: '', youtube: '', instagram: '' },
  contact: { phone: '', email: '', address: '' },
  liveTv: { streamUrl: '', note: '' },
};

export default function SettingsManager() {
  const { settings, reload } = useSettings() || {};
  const [form, setForm] = useState(EMPTY);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!settings) return;
    setForm({
      siteName: settings.siteName || '',
      shortName: settings.shortName || '',
      tagline: settings.tagline || '',
      social: { facebook: '', twitter: '', youtube: '', instagram: '', ...settings.social },
      contact: { phone: '', email: '', address: '', ...settings.contact },
      liveTv: { streamUrl: '', note: '', ...settings.liveTv },
    });
  }, [settings]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setSocial = (key) => (e) =>
    setForm((f) => ({ ...f, social: { ...f.social, [key]: e.target.value } }));
  const setContact = (key) => (e) =>
    setForm((f) => ({ ...f, contact: { ...f.contact, [key]: e.target.value } }));
  const setLiveTv = (key) => (e) =>
    setForm((f) => ({ ...f, liveTv: { ...f.liveTv, [key]: e.target.value } }));

  const onLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setRemoveLogo(false);
    setLogoPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    setSaved(false);
    try {
      const fd = new FormData();
      fd.append('siteName', form.siteName);
      fd.append('shortName', form.shortName);
      fd.append('tagline', form.tagline);
      fd.append('social', JSON.stringify(form.social));
      fd.append('contact', JSON.stringify(form.contact));
      fd.append('liveTv', JSON.stringify(form.liveTv));
      if (logoFile) fd.append('logo', logoFile);
      if (removeLogo) fd.append('removeLogo', 'true');

      await api.put('/settings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await reload();
      setLogoFile(null);
      setLogoPreview(null);
      setRemoveLogo(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setBusy(false);
    }
  };

  const currentLogo = logoPreview || (!removeLogo ? resolveImage(settings?.logoUrl) : null);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-display text-2xl font-bold text-lnn-ink">Site Settings</h1>
      <p className="mb-6 text-sm text-lnn-ink/60">
        Change the channel logo and name, and set the social media links shown in the top bar and footer.
      </p>

      <form onSubmit={submit} className="space-y-6 rounded-lg border border-lnn-line bg-white p-5">
        <section>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-lnn-ink/70">
            Branding
          </h2>
          <div className="space-y-4">
            <Field label="Channel / Site name">
              <input required value={form.siteName} onChange={set('siteName')} className="lnn-input" placeholder="Local News Network" />
            </Field>
            <Field label="Short name (shown in the logo badge when there's no image)">
              <input
                required
                maxLength={6}
                value={form.shortName}
                onChange={set('shortName')}
                className="lnn-input"
                placeholder="LNN"
              />
            </Field>
            <Field label="Tagline (shown under the name in the header)">
              <input value={form.tagline} onChange={set('tagline')} className="lnn-input" placeholder="Nandyal & Rayalaseema" />
            </Field>
            <Field label="Logo image">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-lnn-line bg-lnn-mist">
                  {currentLogo ? (
                    <img src={currentLogo} alt="Logo preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display text-xs font-bold text-lnn-ink/40">{form.shortName || 'LNN'}</span>
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input type="file" accept="image/*" onChange={onLogoChange} className="lnn-input" />
                  {settings?.logoUrl && !removeLogo && (
                    <button
                      type="button"
                      onClick={() => {
                        setRemoveLogo(true);
                        setLogoFile(null);
                        setLogoPreview(null);
                      }}
                      className="text-xs font-semibold text-lnn-red hover:underline"
                    >
                      Remove current logo (use the badge instead)
                    </button>
                  )}
                </div>
              </div>
            </Field>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-lnn-ink/70">
            Social Media Links
          </h2>
          <p className="mb-3 text-xs text-lnn-ink/50">
            Leave a field blank to hide that icon from the top bar and footer.
          </p>
          <div className="space-y-3">
            <Field label="Facebook URL">
              <input value={form.social.facebook} onChange={setSocial('facebook')} className="lnn-input" placeholder="https://facebook.com/yourpage" />
            </Field>
            <Field label="Twitter / X URL">
              <input value={form.social.twitter} onChange={setSocial('twitter')} className="lnn-input" placeholder="https://twitter.com/yourhandle" />
            </Field>
            <Field label="YouTube URL">
              <input value={form.social.youtube} onChange={setSocial('youtube')} className="lnn-input" placeholder="https://youtube.com/@yourchannel" />
            </Field>
            <Field label="Instagram URL">
              <input value={form.social.instagram} onChange={setSocial('instagram')} className="lnn-input" placeholder="https://instagram.com/yourhandle" />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-lnn-ink/70">
            Contact Info
          </h2>
          <div className="space-y-3">
            <Field label="Phone">
              <input value={form.contact.phone} onChange={setContact('phone')} className="lnn-input" />
            </Field>
            <Field label="Email">
              <input type="email" value={form.contact.email} onChange={setContact('email')} className="lnn-input" />
            </Field>
            <Field label="Address">
              <input value={form.contact.address} onChange={setContact('address')} className="lnn-input" />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-lnn-ink/70">
            Live TV
          </h2>
          <div className="space-y-3">
            <Field label="Stream embed URL (YouTube Live / Facebook Live / HLS player embed link)">
              <input
                value={form.liveTv.streamUrl}
                onChange={setLiveTv('streamUrl')}
                className="lnn-input"
                placeholder="https://www.youtube.com/embed/live_stream?channel=UCxxxxxxxxxxxx"
              />
            </Field>
            <Field label="Note shown under the player (optional)">
              <input
                value={form.liveTv.note}
                onChange={setLiveTv('note')}
                className="lnn-input"
                placeholder="e.g. Live broadcast 6 AM – 10 PM daily"
              />
            </Field>
          </div>
        </section>

        {error && <p className="text-sm text-lnn-red">{error}</p>}
        {saved && <p className="text-sm text-green-700">Settings saved.</p>}

        <div className="flex justify-end pt-2">
          <button
            disabled={busy}
            className="rounded-full bg-lnn-red px-6 py-2 text-sm font-semibold text-white hover:bg-lnn-red-dark disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Save Settings'}
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
