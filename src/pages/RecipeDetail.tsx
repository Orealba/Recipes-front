import { useState, useEffect } from "react";
import { RecipeHero } from "../components/RecipeDetail/RecipeHero";
import { useParams } from "react-router-dom";
import { RecipeInfo } from '../components/RecipeDetail/RecipeInfo';
import { RecipeDescription } from '../components/RecipeDetail/RecipeDescription';
import { RecipeAllergens } from '../components/RecipeDetail/RecipeAllergens';
import { RecipeIngredients } from '../components/RecipeDetail/RecipeIngredients';
import { RecipeSteps } from '../components/RecipeDetail/RecipeSteps';
import { RecipeNutrition } from '../components/RecipeDetail/RecipeNutrition';

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) { setLoading(false); return; }
      const res = await fetch(`/recipes/${id}.json`);
      if (!res.ok) { setLoading(false); return; }
      const recipe = await res.json();
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
        calories={(() => {
          const n = recipe.nutrition;
          if (!n) return null;
          if (Array.isArray(n)) {
            const kcal = n.find((i: any) => i.name?.includes('kcal'));
            return kcal?.amount ?? null;
          }
          return n.calories ?? null;
        })()}
        difficulty={recipe.difficulty}
      />
      <RecipeDescription description={recipe.description} />
      <RecipeAllergens allergens={recipe.allergens || []} />
      <RecipeIngredients ingredients={recipe.ingredients_text || []} baseYield={recipe.recipe_yield || 2} />
      <RecipeSteps steps={recipe.instruction_steps || []} />
      <RecipeNutrition nutrition={recipe.nutrition || null} />
    </div>
  );
}