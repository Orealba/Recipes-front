interface RecipeDescriptionProps {
  description: string | null;
}
export function RecipeDescription({ description }: RecipeDescriptionProps) {
  if (!description) return null;
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Descripción:</h2>
      <p className="text-gray-600 text-lg leading-relaxed">
        {description}
      </p>
    </div>
  );
}