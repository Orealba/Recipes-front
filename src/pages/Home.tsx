import { Header } from '../components/Header';
import { useState } from 'react';
import { supabase } from '../lib/supabase';


interface Recipe {
  id: string;
  name: string;
  total_time: string| null;
  recipe_yield: number | null;
}

export function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false);
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    const { data, error } = await supabase
    .from('recipes')
    .select('id, name, total_time, recipe_yield')
    .ilike('name', `%${searchQuery}%`);

  console.log('Respuesta:', data, error);

  if (!error && data) {
    setRecipes(data);
  setHasSearched(true);
  }
  setLoading(false);
};


  return (
    <div className="min-h-screen text-gray-900 font-sans bg-[#faf9f6]">
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Aquí llamamos al componente Header */}
        <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
  />
  {loading && <p>Buscando...</p>}
{recipes.length > 0 && (
  <p>{recipes.length} recetas encontradas</p>
)}
{!loading && hasSearched && recipes.length === 0 && (
  <p>No encontré esa receta. Prueba con otro ingrediente o nombre.</p>
)}


      </main>
    </div>
  );
}
