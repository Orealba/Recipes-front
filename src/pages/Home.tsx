import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useState, useEffect, useRef } from "react";
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

const CATEGORY_LABELS: Record<string, string> = {
  rapidas: 'Rápidas', pollo: 'Pollo', cerdo: 'Cerdo',
  ternera: 'Ternera', pescado: 'Pescado',
  vegetariano: 'Vegetariano', vegano: 'Vegano',
};
const CATEGORY_KEYS = ['rapidas', 'pollo', 'cerdo', 'ternera', 'pescado', 'vegetariano', 'vegano'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
const STOP_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'de', 'del', 'en', 'con', 'sin', 'por', 'para', 'a', 'ante',
  'bajo', 'contra', 'desde', 'durante', 'entre', 'hacia',
  'hasta', 'mediante', 'segun', 'so', 'sobre', 'tras',
  'y', 'e', 'o', 'u', 'que', 'al', 'lo', 'le', 'se', 'no', 'es',
  'su', 'sus', 'tu', 'mi', 'él', 'ella', 'ello',
]);
function tokenize(text: string): string[] {
  return normalize(text).split(/\s+/).filter(t => t.length > 1 && !STOP_WORDS.has(t));
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

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}
function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
        active
          ? 'bg-[#c45a36] text-white border-[#c45a36]'
          : 'bg-white text-gray-600 border-gray-300 hover:border-[#c45a36] hover:text-[#c45a36]'
      }`}
    >
      {label}
    </button>
  );
}

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [quickRecipes, setQuickRecipes] = useState<Recipe[]>([]);
  const [chickenRecipes, setChickenRecipes] = useState<Recipe[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);

  const catIdxRef = useRef<Record<string, { recipes: string[] }> | null>(null);
  const metaRef = useRef<Record<string, any> | null>(null);
  const allResultsRef = useRef<Recipe[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categoryFilterActive = selectedCategories.length > 0;

  useEffect(() => {
    const loadSections = async () => {
      const [metaRes, catRes] = await Promise.all([
        fetch('/recipes-meta.json'),
        fetch('/categories-index.json'),
      ]);
      const meta = await metaRes.json();
      const catIdx = await catRes.json();
      metaRef.current = meta;
      catIdxRef.current = catIdx;

      const pick = (ids: string[], n: number) =>
        shuffle(ids).slice(0, n).map(id => metaToRecipe(meta, id));

      if (catIdx.rapidas) setQuickRecipes(pick(catIdx.rapidas.recipes, 3));
      if (catIdx.pollo) setChickenRecipes(pick(catIdx.pollo.recipes, 3));

      const allIds = Object.keys(meta);
      setRandomRecipes(pick(allIds, 3));
    };
    loadSections();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setHasSearched(false);
      setRecipes([]);
      allResultsRef.current = [];
    }
  }, [searchQuery]);

  useEffect(() => {
    const shouldFilter = hasSearched || categoryFilterActive;
    if (!shouldFilter) {
      setRecipes([]);
      return;
    }

    let base: Recipe[] = [];

    if (hasSearched) {
      base = [...allResultsRef.current];
    } else if (metaRef.current) {
      base = Object.keys(metaRef.current).map(id => metaToRecipe(metaRef.current!, id));
    }

    if (selectedCategories.length > 0 && catIdxRef.current) {
      base = base.filter(r =>
        selectedCategories.every(cat =>
          catIdxRef.current![cat]?.recipes.includes(r.id)
        )
      );
    }

    setRecipes(base);
  }, [hasSearched, categoryFilterActive, selectedCategories]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setRecipes([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);

    const { recipesIndex } = await import("../data/recipes-index");
    const tokens = tokenize(searchQuery);
    if (tokens.length === 0) {
      setRecipes([]);
      return;
    }
    const filtered = recipesIndex
      .filter((recipe) => {
        const name = normalize(recipe.name);
        const ingredients = (recipe.ingredients || []).map(normalize);
        return tokens.some(token =>
          name.includes(token) || ingredients.some(ing => ing.includes(token))
        );
      })
      .map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        total_time: recipe.total_time,
        recipe_yield: recipe.recipe_yield,
        image_url: null,
        local_image_name: recipe.local_image_name,
      }));
    allResultsRef.current = filtered;
    setRecipes(filtered);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const showSections = !hasSearched && !categoryFilterActive;
  const showFilteredResults = hasSearched || categoryFilterActive;

  return (
    <div className="min-h-screen text-gray-900 font-sans bg-[#faf9f6]">
      <main className="max-w-5xl mx-auto px-6 py-16">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />

        {/* Chips de categoría — siempre visibles */}
        <div className="mt-8 mb-8">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_KEYS.map(key => (
              <FilterChip
                key={key}
                label={CATEGORY_LABELS[key]}
                active={selectedCategories.includes(key)}
                onClick={() => toggleCategory(key)}
              />
            ))}
          </div>
        </div>

        {/* Resultados de búsqueda o filtro */}
        {showFilteredResults && (
          <div className="mb-10">
            {hasSearched && (
              <h2 className="text-xl font-semibold mb-4">
                Resultados de "{searchQuery}"
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {recipes.length} recetas
                </span>
              </h2>
            )}

            {categoryFilterActive && !hasSearched && (
              <h2 className="text-xl font-semibold mb-4">
                {selectedCategories.map(c => CATEGORY_LABELS[c]).join(', ')}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {recipes.length} recetas
                </span>
              </h2>
            )}

            {recipes.length === 0 ? (
              <p className="text-gray-500">
                Ninguna receta coincide con los filtros seleccionados.
              </p>
            ) : (
              <RecipeGrid recipes={recipes} />
            )}
          </div>
        )}

        {/* Secciones del home */}
        {showSections && (
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
