import { Clock, Users } from "lucide-react";

interface RecipesCardProps {
  name: string;
  total_time: string |null;
  recipe_yield: number |null;
  image_url: string | null;
}

export function RecipeCard ({name, total_time, recipe_yield, image_url} : RecipesCardProps) {
  return (
    <div className=" bg-white rounded-lg shadow-sm border-gray-200 overflow-hidden max-w-sm mx-auto w-full">
      <img src={image_url || 'https://img.hellofresh.com/f_auto,fl_lossy,h_640,q_auto,w_1200/hellofresh_s3/image/HF_Y23_R08_W32_ES_ESCFVQV0094-4_Main_R_high-3feb0424.jpg'}
      alt={name}
      className="w-ful aspect-square object-cover object-center"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
        <div className="flex gap-4 text-gray-500 text-sm">
          {total_time && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {total_time}
            </span>
          )}
          {recipe_yield && (
            <span className="flex items-center gap-1">
              <Users size={14} />
              {recipe_yield} porciones
            </span>
          )}
        </div>

      </div>

    </div>
  )
}