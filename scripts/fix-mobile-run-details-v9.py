from pathlib import Path

css_path = Path('predictions-premium-v4.css')
html_path = Path('predictions.html')
marker = '/* Mobile run details readability v9 */'
patch = r'''

/* Mobile run details readability v9 */
@media (max-width: 700px) {
    body .next-prediction-card > .prediction-run-details {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 6px !important;
        padding: 7px !important;
        margin: 10px 0 8px !important;
    }

    body .next-prediction-card > .prediction-run-details > div,
    body .next-prediction-card > .prediction-run-details > div:last-child {
        display: grid !important;
        grid-template-columns: minmax(92px, .8fr) minmax(0, 1.6fr) !important;
        align-items: center !important;
        gap: 12px !important;
        min-height: 0 !important;
        padding: 10px 12px !important;
        text-align: left !important;
        border-radius: 10px !important;
    }

    body .next-prediction-card > .prediction-run-details span {
        font-size: 7px !important;
        line-height: 1.2 !important;
        letter-spacing: .08em !important;
        white-space: normal !important;
        word-break: normal !important;
        overflow-wrap: normal !important;
    }

    body .next-prediction-card > .prediction-run-details strong {
        margin: 0 !important;
        font-size: 10px !important;
        line-height: 1.35 !important;
        text-align: right !important;
        white-space: normal !important;
        word-break: normal !important;
        overflow-wrap: break-word !important;
    }
}
'''

css = css_path.read_text(encoding='utf-8')
if marker not in css:
    css_path.write_text(css.rstrip() + patch + '\n', encoding='utf-8')
    print('Added mobile run-details readability fix.')
else:
    print('Mobile run-details readability fix already present.')

html = html_path.read_text(encoding='utf-8')
old = 'predictions-premium-v4.css?v=8'
new = 'predictions-premium-v4.css?v=9'
if old in html:
    html = html.replace(old, new, 1)
    html_path.write_text(html, encoding='utf-8')
    print('Bumped predictions premium CSS to v9.')
elif new in html:
    print('Predictions premium CSS already at v9.')
else:
    raise SystemExit('Predictions premium stylesheet reference not found.')
