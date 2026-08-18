import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import api from '../api/axios';

export default function DistrictsList() {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    api.get('/districts').then((res) => setDistricts(res.data.districts));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 border-b-2 border-lnn-ink pb-2 font-display text-2xl font-bold uppercase tracking-wide">
        <span className="mr-2 inline-block h-4 w-1.5 bg-lnn-red align-middle" />
        All Districts
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {districts.map((d) => (
          <Link
            key={d._id}
            to={`/district/${d.slug}`}
            className="flex items-center gap-2 rounded-lg border border-lnn-line bg-white px-4 py-6 font-display font-semibold text-lnn-ink hover:border-lnn-red hover:text-lnn-red"
          >
            <MapPin size={18} className="text-lnn-red" />
            {d.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
