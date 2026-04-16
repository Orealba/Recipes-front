import { Header } from '../components/Header';
import { useState } from 'react';
import { RecipeGrid } from '../components/RecipeGrid';
import { recipesIndex } from '../data/recipes-index';
export interface Recipe {
  id: string;
  name: string;
  total_time: string | null;
  recipe_yield: number | null;
  image_url: string | null;
  ingredients?: string[];
  local_image_name?: string;
}
export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    const query = searchQuery.toLowerCase();
    const filtered: Recipe[] = recipesIndex
  .filter((recipe) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = recipe.name.toLowerCase().includes(query);
    const ingredientMatch = recipe.ingredients?.some((ing) =>
      ing.toLowerCase().includes(query)
    );
    return nameMatch || ingredientMatch;
  })
  .map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    total_time: recipe.total_time,
    recipe_yield: recipe.recipe_yield,
    image_url: null,
    local_image_name: recipe.local_image_name,
    ingredients: recipe.ingredients
  }));

    setRecipes(filtered);
    setHasSearched(true);
    setLoading(false);
  };
  return (
    <div className="min-h-screen text-gray-900 font-sans bg-[#faf9f6]">
      <main className="max-w-5xl mx-auto px-6 py-16">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />
        {loading && <p>Buscando...</p>}

        {!loading && hasSearched && recipes.length === 0 && (
          <p>No encontré esa receta. Prueba con otro ingrediente o nombre.</p>
        )}
        <RecipeGrid recipes={recipes} />
      </main>
    </div>
  );
}