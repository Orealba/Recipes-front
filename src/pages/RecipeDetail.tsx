import { useState, useEffect } from "react";
import { RecipeHero } from "../components/RecipeDetail/RecipeHero";
import { useParams } from "react-router-dom";
import { RecipeInfo } from '../components/RecipeDetail/RecipeInfo';
import { RecipeDescription } from '../components/RecipeDetail/RecipeDescription';

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      const { recipes } = await import('../data/recipes');
      setRecipes(recipes);
      setLoading(false);
    };
    loadRecipes();
  }, []);

  const recipe = id ? recipes.find((r: any) => r.id === id) : null;

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
    </div>
  );
}