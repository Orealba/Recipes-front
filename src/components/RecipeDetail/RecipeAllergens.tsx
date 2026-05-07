import { AlertTriangle } from "lucide-react";

interface Allergen {
  type: string;
  name: string;
}

interface RecipeAllergensProps {
  allergens: Allergen[];
}

export function RecipeAllergens({ allergens }: RecipeAllergensProps) {
  if (!allergens || allergens.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <AlertTriangle size={20} className="text-[#c45a36]" />
        Alérgenos:
      </h2>
      <div className="flex flex-wrap gap-2">
        {allergens.map((allergen, index) => (
          <div
            key={index}
            className="bg-[#fce8e3] px-3 py-2 rounded-lg"
          >
            <span className="text-sm font-medium text-[#c45a36] uppercase">
              {allergen.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}