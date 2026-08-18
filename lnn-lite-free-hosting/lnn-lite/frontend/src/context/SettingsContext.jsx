import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const SettingsContext = createContext(null);

const DEFAULTS = {
  siteName: 'Local News Network',
  shortName: 'LNN',
  tagline: '',
  logoUrl: '',
  social: { facebook: '', twitter: '', youtube: '', instagram: '' },
  contact: { phone: '', email: '', address: '' },
  liveTv: { streamUrl: '', note: '' },
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    return api
      .get('/settings')
      .then((res) => setSettings(res.data.settings))
      .catch(() => {});
  }, []);

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [reload]);

  useEffect(() => {
    if (settings?.siteName) {
      document.title = `${settings.siteName} — District News, Live TV & Breaking Alerts`;
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, reload }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
