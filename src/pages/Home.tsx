import { Header } from '../components/Header';
import { useState, useEffect } from 'react';
import { RecipeGrid } from '../components/RecipeGrid';
import { recipesIndex } from '../data/recipes-index';
import { homeRecipes } from '../data/home-recipes';
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
  const [hasSearched, setHasSearched] = useState(false);
  // Obtener recetas para mostrar cuando no hay búsqueda
  const quickRecipes: Recipe[] = homeRecipes.quick.map(r => ({
    id: r.id,
    name: r.name,
    total_time: r.total_time,
    recipe_yield: r.recipe_yield,
    image_url: null,
    local_image_name: r.local_image_name
  }));
  const chickenRecipes: Recipe[] = homeRecipes.chicken.map(r => ({
    id: r.id,
    name: r.name,
    total_time: r.total_time,
    recipe_yield: r.recipe_yield,
    image_url: null,
    local_image_name: r.local_image_name
  }));
  const randomRecipes: Recipe[] = homeRecipes.random.map(r => ({
    id: r.id,
    name: r.name,
    total_time: r.total_time,
    recipe_yield: r.recipe_yield,
    image_url: null,
    local_image_name: r.local_image_name
  }));
  // Effect para detectar cuando se borra la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setHasSearched(false);
      setRecipes([]);
    }
  }, [searchQuery]);
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setRecipes([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    const query = searchQuery.toLowerCase();
    const filtered = recipesIndex
      .filter((recipe) => {
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
        local_image_name: recipe.local_image_name
      }));
    setRecipes(filtered);
  };
  return (
    <div className="min-h-screen text-gray-900 font-sans bg-[#faf9f6]">
      <main className="max-w-5xl mx-auto px-6 py-16">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />
        {/* Si hay búsqueda activa, mostrar resultados */}
        {hasSearched && (
          <div>
            {recipes.length === 0 ? (
              <p className="text-gray-500 mt-8">No encontré esa receta. Prueba con otro ingrediente o nombre.</p>
            ) : (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Resultados de "{searchQuery}"</h2>
                <RecipeGrid recipes={recipes} />
              </div>
            )}
          </div>
        )}
        {/* Si NO hay búsqueda activa, mostrar recetas por categorías */}
        {!hasSearched && (
          <div className="space-y-10">
            {quickRecipes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recetas rápidas</h2>
                <RecipeGrid recipes={quickRecipes} />
              </div>
            )}
            {chickenRecipes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Con pollo</h2>
                <RecipeGrid recipes={chickenRecipes} />
              </div>
            )}
            {randomRecipes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recomendadas para ti</h2>
                <RecipeGrid recipes={randomRecipes} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}