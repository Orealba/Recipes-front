import json, os

def _valid_images_set():
    img_dir = os.path.join(os.path.dirname(__file__), '../../public/hellofresh_images')
    valid = set()
    for fname in os.listdir(img_dir):
        path = os.path.join(img_dir, fname)
        if os.path.isfile(path) and os.path.getsize(path) > 1024:
            valid.add(fname)
    return valid

input_file = 'hellofresh_es_recipes.jsonl'
output_file = 'recipes-index.ts'
recipes = []
valid_images = _valid_images_set()

def get_first_cuisine(cuisines):
    if not cuisines:
        return ''
    if isinstance(cuisines, list) and len(cuisines) > 0:
        if isinstance(cuisines[0], dict):
            return cuisines[0].get('name', '')
        return str(cuisines[0])
    if isinstance(cuisines, str):
        return cuisines
    return ''

total = 0
with open(input_file, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        url = data.get('url', '')
        slug = url.split('/')[-1] if url else ''

        local_image_name = data.get('local_image_name', '')
        if local_image_name not in valid_images:
            continue

        instruction_steps = data.get('instructionSteps')
        if not isinstance(instruction_steps, list) or len(instruction_steps) == 0:
            continue

        rich_ingredients = data.get('richIngredients', [])
        ingredient_names = [i.get('name', '') for i in rich_ingredients] if rich_ingredients else []

        recipe = {
            'id': slug,
            'name': data.get('name', ''),
            'local_image_name': local_image_name,
            'total_time': data.get('totalTime', ''),
            'recipe_yield': data.get('recipeYield', 2),
            'difficulty': data.get('difficulty', 1),
            'ingredients': ingredient_names,
            'tags': [t.get('name', '') for t in data.get('tags', [])],
            'cuisine': get_first_cuisine(data.get('cuisines'))
        }
        recipes.append(recipe)
        total += 1

with open(output_file, 'w', encoding='utf-8') as f:
    f.write('export const recipesIndex = ' + json.dumps(recipes, ensure_ascii=False, indent=2) + ';\n')
print(f'Generated {len(recipes)} recipes (filtered by valid image and steps)')