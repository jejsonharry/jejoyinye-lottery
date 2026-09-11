from pathlib import Path
import re

css_path = Path('homepage-premium-v2.css')
html_path = Path('index.html')

css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

pattern = re.compile(
    r'\n\.hero-content::after \{\n'
    r'    content: "LIVE RESULT CENTER";.*?\n\}\n',
    re.S,
)

css, count = pattern.subn('\n', css, count=1)
if count != 1:
    raise SystemExit('Live Result Center hero card CSS block not found')

# Cache-bust the homepage stylesheet so the removal appears immediately.
html = re.sub(r'homepage-premium-v2\.css\?v=\d+', 'homepage-premium-v2.css?v=2', html, count=1)

css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')

assert 'LIVE RESULT CENTER' not in css
