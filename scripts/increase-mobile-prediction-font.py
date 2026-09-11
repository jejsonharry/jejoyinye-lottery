from pathlib import Path

css_path = Path('predictions-premium-v4.css')
html_path = Path('predictions.html')
marker = '/* Mobile prediction number font v7 */'
patch = r'''

/* Mobile prediction number font v7 */
@media (max-width: 700px) {
    body .prediction-tier-grid .prediction-tier-balls .number-ball {
        font-size: 34px !important;
        font-weight: 950 !important;
        letter-spacing: -.02em !important;
        text-shadow: 0 2px 8px rgba(0,0,0,.16) !important;
    }
}

@media (max-width: 390px) {
    body .prediction-tier-grid .prediction-tier-balls .number-ball {
        font-size: 31px !important;
    }
}
'''

css = css_path.read_text(encoding='utf-8')
if marker not in css:
    css_path.write_text(css.rstrip() + patch + '\n', encoding='utf-8')
    print('Increased mobile prediction number font size.')
else:
    print('Mobile prediction number font rule already present.')

html = html_path.read_text(encoding='utf-8')
old = 'predictions-premium-v4.css?v=6'
new = 'predictions-premium-v4.css?v=7'
if old in html:
    html = html.replace(old, new, 1)
    html_path.write_text(html, encoding='utf-8')
    print('Bumped predictions premium CSS to v7.')
elif new in html:
    print('Predictions premium CSS already at v7.')
else:
    raise SystemExit('Predictions premium stylesheet reference not found.')
