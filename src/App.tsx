import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail').then(m => ({ default: m.RecipeDetail })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div className="p-4">Cargando...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/recipe/:id' element={<RecipeDetail />} />
          <Route path='/categoria/:slug' element={<CategoryPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
