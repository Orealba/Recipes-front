import { useState, useEffect } from "react";
import { RecipeHero } from "../components/RecipeDetail/RecipeHero";
import { useParams } from "react-router-dom";
import { RecipeInfo } from '../components/RecipeDetail/RecipeInfo';
import { RecipeDescription } from '../components/RecipeDetail/RecipeDescription';
import { RecipeAllergens } from '../components/RecipeDetail/RecipeAllergens';
import { RecipeIngredients } from '../components/RecipeDetail/RecipeIngredients';
import { RecipeSteps } from '../components/RecipeDetail/RecipeSteps';

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) { setLoading(false); return; }
      const idxRes = await fetch('/recipes.idx.json');
      const idx = await idxRes.json();
      const entry = idx[id];
      if (!entry) { setLoading(false); return; }

      const end = entry.offset + entry.length - 1;
      const recipeRes = await fetch('/recipes.jsonl', {
        headers: { 'Range': `bytes=${entry.offset}-${end}` }
      });
      const text = await recipeRes.text();
      const recipe = JSON.parse(text);
      setRecipe(recipe);
      setLoading(false);
    };
    loadRecipe();
  }, [id]);

  if (loading || !recipe) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6">
      <RecipeHero
        image_url={recipe.local_image_name}
        name={recipe.name}
        description={null}
      />
      <RecipeInfo
        total_time={recipe.total_time}
        calories={recipe.nutrition?.calories}
        difficulty={recipe.difficulty}
      />
      <RecipeDescription description={recipe.description} />
      <RecipeAllergens allergens={recipe.allergens || []} />
      <RecipeIngredients ingredients={recipe.ingredients_text || []} baseYield={recipe.recipe_yield || 2} />
      <RecipeSteps steps={recipe.instruction_steps || []} />
    </div>
  );
}