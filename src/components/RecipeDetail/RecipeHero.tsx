interface RecipeHeroProps {
  image_url: string | null;
  name: string;
  description?: string | null;

}

export function RecipeHero({image_url, name}: RecipeHeroProps) {
  return (
    <div className="max-w-5xl mx-auto relative">
      <img src={image_url ? `/hellofresh_images/${image_url}` : '...'} alt={name} className="w-full h-80 object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
      <h1 className="text-3xl font-bold text-white   text-center inline-block bg-black/20 px- py-2 rounded-lg">{name}</h1>

      </div>

    </div>
  )
}