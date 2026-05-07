import json, re, os

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

print(f'Generated {len(recipes)} recipes → {jsonl_path} + {idx_path}')
