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

stylesheet = '<link rel="stylesheet" href="public-nav-and-home-mobile-v1.css?v=1">'

for name in pages:
    path = Path(name)
    text = path.read_text(encoding='utf-8')

    if stylesheet not in text:
        # place after first style.css link, whether multiline or one-line
        m = re.search(r'<link[^>]+href="style\.css(?:\?v=\d+)?"[^>]*>', text, re.I | re.S)
        if not m:
            raise SystemExit(f'style.css link not found in {name}')
        text = text[:m.end()] + '\n    ' + stylesheet + text[m.end():]

    # Standardize nav markup on legacy public pages.
    if name == 'results.html':
        old = '''<nav>\n    <a href="/">Home</a>\n    <a href="results" class="active">Results</a>\n    <a href="predictions">Predictions</a>\n    <a href="play-online">Play Online</a>\n    <a href="agent">Become an Agent</a>\n    <a href="contact">Contact</a>\n</nav>'''
        new = '''<nav class="premium-nav">\n    <div class="nav-inner">\n        <a href="/">Home</a>\n        <a href="results" class="active" aria-current="page">Results</a>\n        <a href="predictions">Predictions</a>\n        <a href="play-online">Play Online</a>\n        <a href="agent">Become an Agent</a>\n        <a href="contact">Contact</a>\n    </div>\n</nav>'''
        if old in text:
            text = text.replace(old, new, 1)

    if name == 'agent.html':
        pattern = re.compile(r'''<nav>\s*<a href="/">\s*Home\s*</a>\s*<a href="results">\s*Results\s*</a>\s*<a href="predictions">\s*Predictions\s*</a>\s*<a href="play-online">Play Online</a>\s*<a\s*href="agent"\s*class="active"\s*>\s*Become an Agent\s*</a>\s*<a href="contact">\s*Contact\s*</a>\s*</nav>''', re.S)
        replacement = '''<nav class="premium-nav">\n    <div class="nav-inner">\n        <a href="/">Home</a>\n        <a href="results">Results</a>\n        <a href="predictions">Predictions</a>\n        <a href="play-online">Play Online</a>\n        <a href="agent" class="active" aria-current="page">Become an Agent</a>\n        <a href="contact">Contact</a>\n    </div>\n</nav>'''
        text, count = pattern.subn(replacement, text, count=1)
        if count != 1 and 'class="premium-nav"' not in text:
            raise SystemExit('Agent nav markup not found')

    if name == 'contact.html':
        old = '''<nav>\n    <a href="/">Home</a>\n    <a href="results">Results</a>\n    <a href="predictions">Predictions</a>\n    <a href="play-online">Play Online</a>\n    <a href="agent">Become an Agent</a>\n    <a href="contact" class="active">Contact</a>\n</nav>'''
        new = '''<nav class="premium-nav">\n    <div class="nav-inner">\n        <a href="/">Home</a>\n        <a href="results">Results</a>\n        <a href="predictions">Predictions</a>\n        <a href="play-online">Play Online</a>\n        <a href="agent">Become an Agent</a>\n        <a href="contact" class="active" aria-current="page">Contact</a>\n    </div>\n</nav>'''
        if old not in text and 'class="premium-nav"' not in text:
            raise SystemExit('Contact nav markup not found')
        text = text.replace(old, new, 1)

    path.write_text(text, encoding='utf-8')

# Cache-bust the homepage enhancement stylesheet too, to ensure the new mobile rules are fetched.
index = Path('index.html')
text = index.read_text(encoding='utf-8')
text = re.sub(r'homepage-enhancements-v3\.css\?v=\d+', 'homepage-enhancements-v3.css?v=2', text, count=1)
index.write_text(text, encoding='utf-8')

# Assertions
for name in pages:
    text = Path(name).read_text(encoding='utf-8')
    assert 'public-nav-and-home-mobile-v1.css?v=1' in text, name
    assert 'class="premium-nav"' in text, name
    assert 'class="nav-inner"' in text, name

home = Path('index.html').read_text(encoding='utf-8')
assert 'id="home-next-modern-game"' in home
assert 'id="home-results-container"' in home
