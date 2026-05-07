interface NutritionItem {
  name: string;
  unit: string;
  amount: number;
}

interface RecipeNutritionProps {
  nutrition: NutritionItem[] | Record<string, any> | null;
}

export function RecipeNutrition({ nutrition }: RecipeNutritionProps) {
  if (!nutrition) return null;

  let items: NutritionItem[];

  if (Array.isArray(nutrition)) {
    items = nutrition;
  } else {
    const map: Record<string, { name: string; key: string }> = {
      calories: { name: 'Calorías', key: 'calories' },
      fatContent: { name: 'Grasas', key: 'fatContent' },
      saturatedFatContent: { name: 'de las cuales saturadas', key: 'saturatedFatContent' },
      carbohydrateContent: { name: 'Carbohidratos', key: 'carbohydrateContent' },
      sugarContent: { name: 'de los cuales azúcares', key: 'sugarContent' },
      fiberContent: { name: 'Fibra', key: 'fiberContent' },
      proteinContent: { name: 'Proteínas', key: 'proteinContent' },
      sodiumContent: { name: 'Sodio', key: 'sodiumContent' },
    };
    items = [];
    for (const [key, meta] of Object.entries(map)) {
      const val = nutrition[key];
      if (val != null) {
        const unit = key === 'calories' ? 'kcal' : key.includes('Content') ? 'g' : '';
        items.push({ name: meta.name, unit, amount: val });
      }
    }
  }

  if (items.length === 0) return null;

  const findNamed = (name: string) => items.find(i => i.name === name || i.name.includes(name));

  const energyKcal = findNamed('kcal') ?? findNamed('Calorías');
  const fat = findNamed('Grasas');
  const saturates = findNamed('saturadas');
  const carbs = findNamed('Carbohidratos');
  const sugars = findNamed('azúcares');
  const fiber = findNamed('Fibra');
  const protein = findNamed('Proteínas');
  const sodium = findNamed('Sodio');

  const rows = [energyKcal, fat, saturates, carbs, sugars, fiber, protein, sodium].filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Información nutricional</h2>
      <div className="border-2 border-gray-300 p-4 max-w-md rounded-lg">
        {rows.map((item, i) => {
          const isSub = item!.name.startsWith('de');
          return (
            <div
              key={i}
              className={`flex justify-between py-1.5 ${i < rows.length - 1 ? 'border-b border-gray-200' : ''} ${isSub ? 'pl-4 text-sm' : ''}`}
            >
              <span className={isSub ? 'text-gray-500' : 'font-medium'}>{item!.name}</span>
              <span>{item!.amount} {item!.unit}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
