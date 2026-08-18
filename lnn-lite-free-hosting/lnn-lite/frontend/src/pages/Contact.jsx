import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { settings } = useSettings() || {};
  const contact = settings?.contact || {};
  const siteName = settings?.siteName || 'Local News Network';

  const submit = (e) => {
    e.preventDefault();
    // Wire this up to a backend contact endpoint or email service when ready.
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold text-lnn-ink">Contact Us</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {contact.address && <InfoRow icon={<MapPin size={18} />} text={contact.address} />}
          {contact.phone && <InfoRow icon={<Phone size={18} />} text={contact.phone} />}
          {contact.email && <InfoRow icon={<Mail size={18} />} text={contact.email} />}
          <InfoRow icon={<Clock size={18} />} text="Office hours: Mon–Sat, 9:00 AM – 7:00 PM" />
          <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-lnn-line">
            <iframe
              title={`${siteName} office location`}
              className="h-full w-full"
              src="https://www.google.com/maps?q=Nandyal,Andhra+Pradesh&output=embed"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input required placeholder="Your name" className="w-full rounded-lg border border-lnn-line px-3 py-2 outline-none focus:border-lnn-red" />
          <input required type="email" placeholder="Email address" className="w-full rounded-lg border border-lnn-line px-3 py-2 outline-none focus:border-lnn-red" />
          <textarea required rows={5} placeholder="Message" className="w-full rounded-lg border border-lnn-line px-3 py-2 outline-none focus:border-lnn-red" />
          <button className="rounded-full bg-lnn-red px-6 py-2.5 font-semibold text-white hover:bg-lnn-red-dark">
            Send Message
          </button>
          {sent && <p className="text-sm text-green-700">Thanks — we'll get back to you shortly.</p>}
        </form>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-lnn-ink/80">
      <span className="text-lnn-red">{icon}</span>
      {text}
    </div>
  );
}
