interface RecipeHeroProps {
  image_url: string | null;
  name: string;
  description: string | null;

}

export function RecipeHero({image_url, name, description}: RecipeHeroProps) {
  return (
    <div className="relative  ">
      <img src={image_url || 'https://img.hellofresh.com/f_auto,fl_lossy,h_640,q_auto,w_1200/hellofresh_s3/image/HF_Y23_R08_W32_ES_ESCFVQV0094-4_Main_R_high-3feb0424.jpg'} alt={name} className="w-full h-80 object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
      <h1 className="text-3xl font-bold text-white mb-2 text-center inline-block bg-black/40 px-4 py-2 rounded-lg">{name}</h1>

      </div>

    </div>
  )
}