import json
import random
import os
input_file = 'hellofresh_es_recipes.jsonl'
output_file = 'home-recipes.ts'
images_folder = '../../public/hellofresh_images/'
# 1. Obtener nombres de imágenes válidas (>1KB)
valid_images = set()
for filename in os.listdir(images_folder):
    if filename.endswith('.jpg'):
        filepath = os.path.join(images_folder, filename)
        size = os.path.getsize(filepath)
        if size > 1000:
            valid_images.add(filename)
print(f'Imágenes válidas: {len(valid_images)}')
# 2. Leer todas las recetas
recipes = []
with open(input_file, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        url = data.get('url', '')
        slug = url.split('/')[-1] if url else ''
        local_image = data.get('local_image_name', '')

        # Solo incluir recetas con imagen válida
        if local_image not in valid_images:
            continue

        recipe = {
            'id': slug,
            'name': data.get('name', ''),
            'local_image_name': local_image,
            'total_time': data.get('totalTime', ''),
            'recipe_yield': data.get('recipeYield', 2),
            'difficulty': data.get('difficulty', 1),
            'ingredients': [i.get('name', '') for i in data.get('richIngredients', [])]
        }
        recipes.append(recipe)
print(f'Recetas con imagen válida: {len(recipes)}')
# 3. Filtrar por categorías
quick_recipes = [r for r in recipes if r['total_time'] and r['total_time'].replace('PT', '').replace('M', '').replace('H', '') <= '30'][:5]
chicken_recipes = [r for r in recipes if any('pollo' in i.lower() for i in r.get('ingredients', []))][:5]
random_recipes = random.sample([r for r in recipes if r not in quick_recipes and r not in chicken_recipes], 5)
home_data = {
    'quick': quick_recipes,
    'chicken': chicken_recipes,
    'random': random_recipes
}
# 4. Guardar
with open(output_file, 'w', encoding='utf-8') as f:
    f.write('export const homeRecipes = ' + json.dumps(home_data, ensure_ascii=False, indent=2) + ';\n')
print(f'Generated: {len(quick_recipes)} quick, {len(chicken_recipes)} chicken, {len(random_recipes)} random')