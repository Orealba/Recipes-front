import os
import json
# Rutas
images_folder = '../../public/hellofresh_images/'
index_file = 'recipes-index.ts'
output_file = 'recipes-index.ts'
# 1. Obtener nombres de imágenes válidas (>1KB)
valid_images = set()
for filename in os.listdir(images_folder):
    if filename.endswith('.jpg'):
        filepath = os.path.join(images_folder, filename)
        size = os.path.getsize(filepath)
        if size > 1000:
            valid_images.add(filename)
print(f'Imágenes válidas encontradas: {len(valid_images)}')
# 2. Leer solo la parte JSON del archivo
with open(index_file, 'r', encoding='utf-8') as f:
    content = f.read()
# Encontrar dónde empieza y termina el JSON
start = content.find('export const recipesIndex = ') + len('export const recipesIndex = ')
json_content = content[start:].strip()
if json_content.endswith(';'):
    json_content = json_content[:-1]
recipes = json.loads(json_content)
print(f'Recetas en índice: {len(recipes)}')
# 3. Filtrar recetas con imagen válida
filtered_recipes = []
for recipe in recipes:
    local_name = recipe.get('local_image_name', '')
    if local_name in valid_images:
        filtered_recipes.append(recipe)
print(f'Recetas con imagen válida: {len(filtered_recipes)}')
# 4. Guardar índice filtrado
output = 'export const recipesIndex = ' + json.dumps(filtered_recipes, ensure_ascii=False, indent=2) + ';\n'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(output)
print('Índice filtrado guardado')