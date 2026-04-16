import { Clock, Users } from "lucide-react";


interface RecipesCardProps {
  id: string
  name: string;
  total_time: string |null;
  recipe_yield: number |null;
  local_image_name?: string | null;
}

export function RecipeCard ({id,name, total_time, recipe_yield, local_image_name }: RecipesCardProps) {
  return (
  <a href={`/recipe/${id}`} target="_blank" rel="noopener noreferrer" className="block">
    <div className=" bg-white rounded-lg shadow-sm border-gray-200 overflow-hidden max-w-sm mx-auto w-full">
      <img
          src={local_image_name ? `/hellofresh_images/${local_image_name}` : '/hellofresh_images/default.jpg'}
          alt={name}
          className="w-full aspect-square object-cover object-center"
        />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
        <div className="flex gap-4 text-gray-500 text-sm">
          {total_time && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {total_time.replace('PT', '').replace('H', 'h ').replace('M', 'min')}
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
    </a>
  )
}