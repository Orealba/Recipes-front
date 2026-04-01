import { Search, SlidersHorizontal } from 'lucide-react';
import React, { useState } from 'react';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        console.log('Buscar:', searchQuery);
      }
  };
  return (
    <header className="flex flex-col items-center text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
        Libro de recetas
      </h1>

      <p className="text-gray-500 max-w-2xl text-lg mb-10">
        Encuentra recetas deliciosas paso a paso. Solo escribe el nombre de un
        plato o los ingredientes que tienes en casa para empezar.
      </p>

      {/* Contenedor de la barra de búsqueda */}
      <div className="w-full max-w-2xl flex shadow-sm rounded-md border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center pl-4 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar recetas, ingredientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 py-4 px-3 text-gray-700 outline-none w-full bg-transparent"
        />
        <button className="bg-[#c45a36] text-white px-8 py-4 font-semibold hover:bg-[#a84c2e] transition-colors">
          Buscar
        </button>
      </div>

      {/* Botón de Filtros */}
      <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mt-4 text-sm font-medium transition-colors">
        <SlidersHorizontal size={16} />
        <span>Filtros (Próximamente)</span>
      </button>
    </header>
  );
}
