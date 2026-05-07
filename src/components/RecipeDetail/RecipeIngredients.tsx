import { useState } from "react";

interface Ingredient {
  name: string;
}

interface RecipeIngredientsProps {
  ingredients: string[];
  baseYield: number;
}

function parseIngredient(ingredientText: string, multiplier: number): string {
  const match = ingredientText.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\s*(.+)$/);
  
  if (!match) {
    return ingredientText;
  }

  const [, quantity, unit, name] = match;
  const numQty = parseFloat(quantity);
  const scaledQty = numQty * multiplier;
  
  if (Number.isInteger(scaledQty)) {
    return `${scaledQty} ${unit || ''} ${name}`.trim();
  }
  
  return `${scaledQty.toFixed(1)} ${unit || ''} ${name}`.trim();
}

export function RecipeIngredients({ ingredients, baseYield }: RecipeIngredientsProps) {
  const [selectedYield, setSelectedYield] = useState(baseYield);
  
  const multiplier = selectedYield / baseYield;

  if (!ingredients || ingredients.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Ingredientes</h2>
      
      <div className="flex gap-2 mb-4">
        {[2, 4, 6].map((yield_) => (
          <button
            key={yield_}
            onClick={() => setSelectedYield(yield_)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedYield === yield_
                ? "bg-[#c45a36] text-white"
                : "bg-[#c45a36] text-white hover:bg-[#a84c2e]"
            }`}
          >
            {yield_} personas
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c45a36]"></span>
            <span className="text-gray-700">
              {parseIngredient(ingredient, multiplier)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}