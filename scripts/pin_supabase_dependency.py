from pathlib import Path

OLD = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
NEW = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0"

changed = []
for path in Path('.').glob('*.html'):
    text = path.read_text(encoding='utf-8')
    if OLD not in text:
        continue
    updated = text.replace(OLD, NEW)
    if updated != text:
        path.write_text(updated, encoding='utf-8')
        changed.append(str(path))

print(f"Updated {len(changed)} HTML file(s).")
for item in changed:
    print(item)
