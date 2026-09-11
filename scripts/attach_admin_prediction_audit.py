from pathlib import Path

path = Path('admin.html')
text = path.read_text(encoding='utf-8')

css = '<link rel="stylesheet" href="admin-prediction-audit-v1.css?v=1">'
js = '<script src="admin-prediction-audit-v1.js?v=1" defer></script>'

if css not in text:
    marker = '<link rel="icon" href="Images/jols-logo.png" type="image/png">'
    if marker not in text:
        raise SystemExit('CSS insertion marker not found')
    text = text.replace(marker, marker + '\n' + css, 1)

if js not in text:
    marker = '<script src="admin.js?v=1410" defer></script>'
    if marker not in text:
        raise SystemExit('JS insertion marker not found')
    text = text.replace(marker, marker + '\n' + js, 1)

path.write_text(text, encoding='utf-8')
