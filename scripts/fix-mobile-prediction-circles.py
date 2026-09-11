from pathlib import Path

css_path = Path('predictions-premium-v4.css')
html_path = Path('predictions.html')
marker = '/* Mobile prediction circles v6 */'
patch = r'''

/* Mobile prediction circles v6 */
@media (max-width: 700px) {
    body .prediction-tier-grid .prediction-tier-balls .number-ball {
        box-sizing: border-box !important;
        flex: 0 0 74px !important;
        width: 74px !important;
        height: 74px !important;
        min-width: 74px !important;
        min-height: 74px !important;
        max-width: 74px !important;
        max-height: 74px !important;
        aspect-ratio: 1 / 1 !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 50% !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 25px !important;
        line-height: 1 !important;
        transform: none !important;
    }

    body .prediction-tier-grid .prediction-tier-sure .number-ball,
    body .prediction-tier-grid .prediction-tier-sure .number-ball:nth-child(n) {
        background: linear-gradient(145deg,#20bd5a,#0b7d3c) !important;
        color: #fff !important;
    }

    body .prediction-tier-grid .prediction-tier-direct .number-ball,
    body .prediction-tier-grid .prediction-tier-direct .number-ball:nth-child(n) {
        background: linear-gradient(145deg,#e0a72c,#a96e05) !important;
        color: #fff !important;
    }

    body .prediction-tier-grid .prediction-tier-balls {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        gap: 14px !important;
    }

    body .prediction-tier-grid .prediction-tier {
        min-height: 142px !important;
        padding: 17px 10px 24px !important;
    }
}

@media (max-width: 390px) {
    body .prediction-tier-grid .prediction-tier-balls .number-ball {
        flex-basis: 68px !important;
        width: 68px !important;
        height: 68px !important;
        min-width: 68px !important;
        min-height: 68px !important;
        max-width: 68px !important;
        max-height: 68px !important;
        font-size: 23px !important;
    }

    body .prediction-tier-grid .prediction-tier-balls {
        gap: 10px !important;
    }
}
'''

css = css_path.read_text(encoding='utf-8')
if marker not in css:
    css_path.write_text(css.rstrip() + patch + '\n', encoding='utf-8')
    print('Added mobile circle correction.')
else:
    print('Mobile circle correction already present.')

html = html_path.read_text(encoding='utf-8')
old = 'predictions-premium-v4.css?v=5'
new = 'predictions-premium-v4.css?v=6'
if old in html:
    html = html.replace(old, new, 1)
    html_path.write_text(html, encoding='utf-8')
    print('Bumped predictions premium CSS to v6.')
elif new in html:
    print('Predictions premium CSS already at v6.')
else:
    raise SystemExit('Predictions premium stylesheet reference not found.')
