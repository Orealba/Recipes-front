import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const categories = [
  { slug: 'rapidas', label: 'Rápidas' },
  { slug: 'pollo', label: 'Pollo' },
  { slug: 'pescado', label: 'Pescado' },
  { slug: 'vegetariano', label: 'Vegetariano' },
  { slug: 'cerdo', label: 'Cerdo' },
  { slug: 'ternera', label: 'Ternera' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        <Link to="/" className="text-lg font-bold text-gray-900 tracking-tight">
          Mil bocados
        </Link>

        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex items-center gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
              className="text-sm text-gray-600 hover:text-[#c45a36] font-medium transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 pb-4 pt-2">
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/categoria/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="text-sm text-gray-600 hover:text-[#c45a36] font-medium py-2 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
