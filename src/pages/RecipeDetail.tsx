import { RecipeHero } from "../components/RecipeDetail/RecipeHero";
import { useParams } from "react-router-dom";
import { RecipeInfo } from '../components/RecipeDetail/RecipeInfo';
import { recipes } from '../data/recipes'
import { RecipeDescription } from '../components/RecipeDetail/RecipeDescription';
interface Recipe {
  id: string;
  name: string;
  description: string;
  local_image_name: string;
  total_time: string;
  recipe_yield: number;
  difficulty: number;
  rich_ingredients: any[];
  ingredients_text: string[];
  instruction_steps: any[];
  instructions: string;
  utensils: any[];
  allergens: any[];
  nutrition: any;
  tags: any[];
  cuisines: any[];
}
export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();

  const recipe = id ? recipes.find(r => r.id === id) : null;
  if (!recipe) {
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
  )
}