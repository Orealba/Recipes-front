import json

def generate_recipes_data():
    ts_path = 'src/data/recipes.ts'
    jsonl_path = 'public/recipes.jsonl'
    idx_path = 'public/recipes.idx.json'

    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()

    prefix = 'export const recipes = '
    if not content.startswith(prefix):
        raise ValueError('Unexpected recipes.ts format')

    content = content[len(prefix):]
    if content.endswith(';\n'):
        content = content[:-2]

    recipes = json.loads(content)

    with open(jsonl_path, 'w', encoding='utf-8') as f:
        index = {}
        for recipe in recipes:
            line = json.dumps(recipe, ensure_ascii=False) + '\n'
            offset = f.tell()
            f.write(line)
            end = f.tell()
            index[recipe['id']] = { 'offset': offset, 'length': end - offset }

    with open(idx_path, 'w', encoding='utf-8') as f:
        json.dump(index, f)

    print(f'Generated {len(recipes)} recipes -> {jsonl_path} + {idx_path}')
    return recipes


def generate_categories_index(recipes):
    FISH_TYPES = {'salmon', 'salmon-mince', 'hake-fillet', 'hake-and-shrimp-burger', 'cod-burger', 'skin-on-cod', 'king-prawns', 'shrimps', 'shrimp-and-turnip-soup', 'squid'}
    FISH_KEYWORDS = ['salmón', 'bacalao', 'merluza', 'lubina', 'dorada', 'rape', 'pulpo', 'langostino', 'gamba', 'atún', 'anchoa', 'boquerón', 'mejillón', 'calamar', 'sepia', 'rodaballo', 'trucha', 'caballa', 'marisco', 'pescado']

    index = {}
    for recipe in recipes:
        name_lower = recipe.get('name', '').lower()
        ings = recipe.get('rich_ingredients', [])
        tags = [t.get('type', '') for t in recipe.get('tags', [])]

        cats = set()
        if 'quick' in tags:
            cats.add('rapidas')
        if 'veggie' in tags or 'vegetarian' in tags:
            cats.add('vegetariano')
        if 'vegan' in tags:
            cats.add('vegano')

        for ing in ings:
            name = ing.get('name', '').lower()
            typ = ing.get('type', '').lower()
            if 'pollo' in name or typ == 'chicken':
                cats.add('pollo')
            if 'cerdo' in name or 'pork' in typ:
                cats.add('cerdo')
            if 'ternera' in name or 'res' in name or 'beef' in typ or 'veal' in typ:
                cats.add('ternera')
            if typ in FISH_TYPES or any(kw in name for kw in FISH_KEYWORDS):
                cats.add('pescado')

        for c in cats:
            index.setdefault(c, []).append(recipe['id'])

    output = {}
    for cat, ids in sorted(index.items()):
        output[cat] = { 'count': len(ids), 'recipes': ids }

    path = 'public/categories-index.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(output, f)

    for cat, data in sorted(output.items()):
        print(f'  {cat}: {data["count"]} recetas')
    print(f'Generated -> {path}')


def generate_recipes_meta(recipes):
    meta = {}
    for r in recipes:
        meta[r['id']] = {
            'name': r.get('name', ''),
            'local_image_name': r.get('local_image_name', ''),
            'total_time': r.get('total_time', ''),
            'difficulty': r.get('difficulty', 1),
        }

    path = 'public/recipes-meta.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(meta, f)

    print(f'Generated {len(meta)} entries -> {path}')


if __name__ == '__main__':
    recipes = generate_recipes_data()
    print()
    generate_categories_index(recipes)
    print()
    generate_recipes_meta(recipes)
