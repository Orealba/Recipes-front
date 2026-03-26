import { useState } from 'react';
import { supabase } from './lib/supabase';
import { Search, Utensils } from 'lucide-react';

function App() {
  const [busqueda, setBusqueda] = useState('');

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Recetas de Ore 🍳</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Busca por ingrediente o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#00cc88',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}>
          <Search size={20} />
        </button>
      </div>

      <div style={{ color: '#666' }}>
        {busqueda ? `Buscando: ${busqueda}...` : 'Escribe algo para empezar'}
      </div>
    </div>
  );
}

export default App;
