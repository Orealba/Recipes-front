interface RecipeInfoProps {
  total_time: string | null;
  calories: number | null;
  difficulty: number | null;
}
function formatTime(time: string | null): string {
  if (!time) return '-';
  // PT30M -> 30min, PT1H -> 1h
  return time.replace('PT', '').replace('H', 'h ').replace('M', 'min');
}
function formatDifficulty(level: number | null): string {
  if (!level) return '-';
  if (level === 1) return 'Fácil';
  if (level === 2) return 'Media';
  if (level === 3) return 'Difícil';
  return '-';
}
export function RecipeInfo({ total_time, calories, difficulty }: RecipeInfoProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="grid grid-cols-3 gap-4 w-fit mx-auto">
        <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-300">
          <p className="text-gray-500 text-sm mb-1">Tiempo total</p>
          <p className="text-xl font-semibold">{formatTime(total_time)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-300">
          <p className="text-gray-500 text-sm mb-1">Calorías</p>
          <p className="text-xl font-semibold">{calories ? `${calories} kcal` : '-'}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-300">
          <p className="text-gray-500 text-sm mb-1">Dificultad</p>
          <p className="text-xl font-semibold">{formatDifficulty(difficulty)}</p>
        </div>
      </div>
    </div>
  );
}