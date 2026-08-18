import { Link } from 'react-router-dom';

export default function CategoryNav({ categories = [] }) {
  if (categories.length === 0) return null;
  return (
    <div className="border-b border-lnn-line bg-lnn-mist">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5">
        {categories.map((c) => (
          <Link
            key={c._id}
            to={`/category/${c.slug}`}
            className="shrink-0 rounded-full border border-lnn-line bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-lnn-ink hover:border-lnn-red hover:text-lnn-red"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
