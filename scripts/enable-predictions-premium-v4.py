from pathlib import Path

path = Path('predictions.html')
text = path.read_text(encoding='utf-8')
needle = '<link rel="stylesheet" href="predictions-polish.css?v=3">'
link = '<link rel="stylesheet" href="predictions-premium-v4.css?v=1">'
if link in text:
    print('predictions premium v4 already enabled')
elif needle in text:
    text = text.replace(needle, needle + '\n    ' + link, 1)
    path.write_text(text, encoding='utf-8')
    print('enabled predictions premium v4')
else:
    raise SystemExit('predictions polish stylesheet reference not found')
