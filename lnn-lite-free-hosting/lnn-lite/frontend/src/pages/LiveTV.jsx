import { Radio, Tv } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function LiveTV() {
  const { settings } = useSettings() || {};
  const streamUrl = settings?.liveTv?.streamUrl;
  const note = settings?.liveTv?.note;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-lnn-ink">
          <span className="mr-2 inline-block h-4 w-1.5 bg-lnn-red align-middle" />
          Live TV
        </h1>
        <span className="flex items-center gap-1.5 rounded-full bg-lnn-red px-3 py-1 text-sm font-semibold text-white">
          <Radio size={14} className="lnn-live-dot" /> Live
        </span>
      </div>

      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        {streamUrl ? (
          <iframe
            className="h-full w-full"
            src={streamUrl}
            title="Live TV"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-white/60">
            <Tv size={40} />
            <p className="text-sm">No live stream configured yet.</p>
            <p className="text-xs text-white/40">Set one from Admin → Settings → Live TV.</p>
          </div>
        )}
      </div>

      {note && <p className="mt-3 text-sm text-lnn-ink/60">{note}</p>}
    </div>
  );
}
