import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RecipeGrid } from '../components/RecipeGrid';

const CATEGORY_LABELS: Record<string, string> = {
  rapidas: 'Rápidas',
  pollo: 'Pollo',
  pescado: 'Pescado',
  vegetariano: 'Vegetariano',
  cerdo: 'Cerdo',
  ternera: 'Ternera',
};

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!slug) { setLoading(false); return; }

      const [catRes, metaRes] = await Promise.all([
        fetch('/categories-index.json'),
        fetch('/recipes-meta.json'),
      ]);
      const catIdx = await catRes.json();
      const meta = await metaRes.json();

      const catData = catIdx[slug];
      if (!catData) { setLoading(false); return; }

      setCount(catData.count);
      const items = catData.recipes.map((id: string) => {
        const m = meta[id];
        return {
          id,
          name: m?.name ?? '',
          total_time: m?.total_time ?? null,
          recipe_yield: 2,
          image_url: null,
          local_image_name: m?.local_image_name ?? null,
        };
      });
      setRecipes(items);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) return <div className="p-4">Cargando...</div>;

  const label = CATEGORY_LABELS[slug || ''] || slug;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{label}</h1>
      <p className="text-gray-500 mb-8">{count} recetas</p>
      <RecipeGrid recipes={recipes} />
    </main>
  );
}
