from pathlib import Path
import re

pages = [
    'index.html',
    'results.html',
    'predictions.html',
    'play-online.html',
    'agent.html',
    'contact.html',
]

link = '<link rel="stylesheet" href="public-nav-mobile-fit-v2.css?v=1">'

for page in pages:
    path = Path(page)
    html = path.read_text(encoding='utf-8')

    if 'public-nav-mobile-fit-v2.css' not in html:
        marker = '</head>'
        if marker not in html:
            raise SystemExit(f'</head> not found in {page}')
        html = html.replace(marker, f'    {link}\n{marker}', 1)

    # Cache-bust shared nav stylesheet if present.
    html = re.sub(r'public-nav-and-home-mobile-v1\.css\?v=\d+', 'public-nav-and-home-mobile-v1.css?v=2', html)

    path.write_text(html, encoding='utf-8')

for page in pages:
    html = Path(page).read_text(encoding='utf-8')
    assert 'public-nav-mobile-fit-v2.css?v=1' in html
