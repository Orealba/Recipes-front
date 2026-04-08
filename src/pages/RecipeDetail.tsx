import { RecipeHero } from "../components/RecipeHero";
import { useParams } from "react-router-dom";


export function RecipeDetail() {
  const {id} = useParams();

  return (
    <div className="max-w-4xl max-auto">
      <RecipeHero
      image_url={null}
      name="Receta"
      description={null}
    ></RecipeHero>
    </div>
  )
}
