import { Header } from '../components/Header';

export function Home() {
  return (
    <div className="min-h-screen text-gray-900 font-sans bg-[#faf9f6]">
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Aquí llamamos al componente Header */}
        <Header />

        {/* Aquí abajo irán luego los componentes de las categorías y las tarjetas */}
      </main>
    </div>
  );
}
