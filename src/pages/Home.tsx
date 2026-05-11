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
  difficulty?: number;
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
function parseMinutes(time: string): number {
  if (!time) return 0;
  const m = time.match(/^PT?(\d+)M?$/i) || time.match(/^(\d+)m$/);
  return m ? parseInt(m[1]) : 0;
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
  const [isSearching, setIsSearching] = useState(false);
  const [quickRecipes, setQuickRecipes] = useState<Recipe[]>([]);
  const [chickenRecipes, setChickenRecipes] = useState<Recipe[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);

  const catIdxRef = useRef<Record<string, { recipes: string[] }> | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(0);
  const [selectedMaxTime, setSelectedMaxTime] = useState<number>(0);
  const allResultsRef = useRef<Recipe[]>([]);

  useEffect(() => {
    const loadSections = async () => {
      const [metaRes, catRes] = await Promise.all([
        fetch('/recipes-meta.json'),
        fetch('/categories-index.json'),
      ]);
      const meta = await metaRes.json();
      const catIdx = await catRes.json();
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
      setSelectedCategories([]);
      setSelectedDifficulty(0);
      setSelectedMaxTime(0);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (allResultsRef.current.length === 0) return;
    let filtered = [...allResultsRef.current];

    if (selectedCategories.length > 0 && catIdxRef.current) {
      filtered = filtered.filter(r =>
        selectedCategories.some(cat =>
          catIdxRef.current![cat]?.recipes.includes(r.id)
        )
      );
    }

    if (selectedDifficulty > 0) {
      filtered = filtered.filter(r => r.difficulty !== undefined && r.difficulty <= selectedDifficulty);
    }

    if (selectedMaxTime > 0) {
      filtered = filtered.filter(r => {
        const m = parseMinutes(r.total_time ?? '');
        return m > 0 && m <= selectedMaxTime;
      });
    }

    setRecipes(filtered);
  }, [selectedCategories, selectedDifficulty, selectedMaxTime]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setRecipes([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setIsSearching(true);
    setSelectedCategories([]);
    setSelectedDifficulty(0);
    setSelectedMaxTime(0);

    const { recipesIndex } = await import("../data/recipes-index");
    const tokens = tokenize(searchQuery);
    if (tokens.length === 0) {
      setRecipes([]);
      setIsSearching(false);
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
        difficulty: recipe.difficulty,
      }));
    allResultsRef.current = filtered;
    setRecipes(filtered);
    setIsSearching(false);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen text-gray-900 font-sans bg-[#faf9f6]">
      <main className="max-w-5xl mx-auto px-6 py-16">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(v => !v)}
        />
        {/* Si hay búsqueda activa, mostrar resultados */}
        {hasSearched && (
          <div>
            {isSearching ? (
              <p className="text-gray-500 mt-8">Buscando recetas...</p>
            ) : recipes.length === 0 && allResultsRef.current.length === 0 ? (
              <p className="text-gray-500 mt-8">
                No encontré esa receta. Prueba con otro ingrediente o nombre.
              </p>
            ) : (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">
                  Resultados de "{searchQuery}"
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {recipes.length} recetas
                  </span>
                </h2>

                {/* Filtros */}
                {showFilters && <div className="flex flex-wrap gap-6 mb-6 p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Categoría</p>
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
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Dificultad</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: 0, label: 'Cualquiera' },
                        { value: 1, label: 'Fácil' },
                        { value: 2, label: 'Media' },
                        { value: 3, label: 'Difícil' },
                      ].map(({ value, label }) => (
                        <FilterChip
                          key={value}
                          label={label}
                          active={selectedDifficulty === value}
                          onClick={() => setSelectedDifficulty(selectedDifficulty === value ? 0 : value)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Tiempo máx</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: 0, label: 'Cualquiera' },
                        { value: 15, label: '15 min' },
                        { value: 30, label: '30 min' },
                        { value: 45, label: '45 min' },
                      ].map(({ value, label }) => (
                        <FilterChip
                          key={value}
                          label={label}
                          active={selectedMaxTime === value}
                          onClick={() => setSelectedMaxTime(selectedMaxTime === value ? 0 : value)}
                        />
                      ))}
                    </div>
                  </div>
                </div>}

                {recipes.length === 0 ? (
                  <p className="text-gray-500 mt-4">
                    Ninguna receta coincide con los filtros seleccionados.
                  </p>
                ) : (
                  <RecipeGrid recipes={recipes} />
                )}
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
