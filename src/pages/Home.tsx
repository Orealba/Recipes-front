import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RecipeGrid } from "../components/RecipeGrid";

export interface Recipe {
  id: string;
  name: string;
  total_time: string | null;
  recipe_yield: number | null;
  image_url: string | null;
  ingredients?: string[];
  local_image_name?: string;
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function metaToRecipe(meta: Record<string, any>, id: string): Recipe {
  return {
    id,
    name: meta[id].name,
    total_time: meta[id].total_time,
    recipe_yield: 2,
    image_url: null,
    local_image_name: meta[id].local_image_name,
  };
}
export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [quickRecipes, setQuickRecipes] = useState<Recipe[]>([]);
  const [chickenRecipes, setChickenRecipes] = useState<Recipe[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadSections = async () => {
      const [metaRes, catRes] = await Promise.all([
        fetch('/recipes-meta.json'),
        fetch('/categories-index.json'),
      ]);
      const meta = await metaRes.json();
      const catIdx = await catRes.json();

      const pick = (ids: string[], n: number) =>
        shuffle(ids).slice(0, n).map(id => metaToRecipe(meta, id));

      if (catIdx.rapidas) setQuickRecipes(pick(catIdx.rapidas.recipes, 3));
      if (catIdx.pollo) setChickenRecipes(pick(catIdx.pollo.recipes, 3));

      const allIds = Object.keys(meta);
      setRandomRecipes(pick(allIds, 3));
    };
    loadSections();
  }, []);
  // Effect para detectar cuando se borra la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setHasSearched(false);
      setRecipes([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setRecipes([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setIsSearching(true);

    const { recipesIndex } = await import("../data/recipes-index");
    const query = searchQuery.toLowerCase();
    const filtered = recipesIndex
      .filter((recipe) => {
        const nameMatch = recipe.name.toLowerCase().includes(query);
        const ingredientMatch = recipe.ingredients?.some((ing) =>
          ing.toLowerCase().includes(query),
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
      }));
    setRecipes(filtered);
    setIsSearching(false);
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
            {isSearching ? (
              <p className="text-gray-500 mt-8">Buscando recetas...</p>
            ) : recipes.length === 0 ? (
              <p className="text-gray-500 mt-8">
                No encontré esa receta. Prueba con otro ingrediente o nombre.
              </p>
            ) : (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">
                  Resultados de "{searchQuery}"
                </h2>
                <RecipeGrid recipes={recipes.slice(0, 3)} />
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
                <RecipeGrid recipes={quickRecipes.slice(0, 3)} />
                <div className="flex justify-center mt-4">
                  <Link to="/categoria/rapidas" className="px-6 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 inline-block">
                    Ver más
                  </Link>
                </div>
              </div>
            )}
            {chickenRecipes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Con pollo</h2>
                <RecipeGrid recipes={chickenRecipes.slice(0, 3)} />
                <div className="flex justify-center mt-4">
                  <Link to="/categoria/pollo" className="px-6 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 inline-block">
                    Ver más
                  </Link>
                </div>
              </div>
            )}
            {randomRecipes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Recomendadas para ti
                </h2>
                <RecipeGrid recipes={randomRecipes.slice(0, 3)} />
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
