import { RecipeHero } from "../components/RecipeDetail/RecipeHero";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { RecipeDescription } from '../components/RecipeDetail/RecipeDescription';

interface Recipe {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;

}

export function RecipeDetail() {
  const {id} = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      const {data, error} =await supabase
      .from('recipes')
      .select('id, name, image_url, description')
      .eq('id', id)
      .single();

      console.log('data:', data);
      console.log('error:', error);
      if (error) {
        console.error('Error fetching recipe', error);
        return
      }
      setRecipe(data);

    };
    fetchRecipe()
  }, [id]);
  if (!recipe){
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="mx-w-4xl max-auto">
      <RecipeHero
      image_url={recipe.image_url}
  name={recipe.name}
  description={recipe.description}
    ></RecipeHero>
    <RecipeDescription description={recipe.description} />
    </div>
  )
}
