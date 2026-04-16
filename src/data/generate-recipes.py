import json
input_file = 'hellofresh_es_recipes.jsonl'
output_file = 'recipes.ts'
recipes = []
with open(input_file, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        url = data.get('url', '')
        slug = url.split('/')[-1] if url else ''

        recipe = {
            'id': slug,
            'name': data.get('name', ''),
            'description': data.get('description', ''),
            'local_image_name': data.get('local_image_name', ''),
            'total_time': data.get('totalTime', ''),
            'recipe_yield': data.get('recipeYield', 2),
            'difficulty': data.get('difficulty', 1),
            'rich_ingredients': data.get('richIngredients', []),
            'ingredients_text': data.get('ingredientsText', []),
            'instruction_steps': data.get('instructionSteps', []),
            'instructions': data.get('instructions', ''),
            'utensils': data.get('utensils', []),
            'allergens': data.get('allergens', []),
            'tags': data.get('tags', []),
            'cuisines': data.get('cuisines', []),
            'nutrition': data.get('nutrition', {}),
            'aggregate_rating': data.get('aggregateRating', {})
        }
        recipes.append(recipe)
with open(output_file, 'w', encoding='utf-8') as f:
    f.write('export const recipes = ' + json.dumps(recipes, ensure_ascii=False, indent=2) + ';\n')
print(f'Generated {len(recipes)} recipes')