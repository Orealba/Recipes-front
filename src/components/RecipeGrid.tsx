import { RecipeCard } from './RecipeCard';
import type { Recipe } from '../pages/Home';

interface RecipeGridProps {
  recipes: Recipe[];
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          id={recipe.id}
          name={recipe.name}
          total_time={recipe.total_time}
          recipe_yield={recipe.recipe_yield}
          image_url={recipe.image_url}
        />
      ))}
    </div>
  );
}