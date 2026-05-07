import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail').then(m => ({ default: m.RecipeDetail })));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-4">Cargando...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/recipe/:id' element={<RecipeDetail />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
