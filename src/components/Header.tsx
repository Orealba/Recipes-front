import { Search, SlidersHorizontal } from 'lucide-react';


interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}
export function Header({ searchQuery, onSearchChange, onSearch }: HeaderProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    onSearch();
  }
};
  return (
    <header className="flex flex-col items-center text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
        Mil bocados
      </h1>

      <p className="text-gray-500 max-w-2xl text-lg mb-10">
        Tu buscador gastronómico con más de mil recetas de todo tipo. El recetario digital definitivo para descubrir tu próximo bocado favorito.
      </p>


      <div className="w-full max-w-2xl flex shadow-sm rounded-md border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center pl-4 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar recetas, ingredientes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 py-4 px-3 text-gray-700 outline-none w-full bg-transparent"
        />
        <button onClick={onSearch} className="bg-[#c45a36] text-white px-8 py-4 font-semibold hover:bg-[#a84c2e] transition-colors">
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
