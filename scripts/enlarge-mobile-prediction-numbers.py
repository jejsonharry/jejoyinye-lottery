from pathlib import Path

css_path = Path('predictions-premium-v4.css')
html_path = Path('predictions.html')
marker = '/* Mobile forecast emphasis v5 */'
patch = r'''

/* Mobile forecast emphasis v5 */
@media (max-width: 700px) {
    body .prediction-number-area {
        padding: 16px 8px 14px !important;
    }

    body .prediction-balls.prediction-tier-grid {
        grid-template-columns: 1fr !important;
        gap: 14px !important;
        width: 100% !important;
        margin: 15px auto 16px !important;
    }

    body .prediction-tier-grid .prediction-tier {
        width: 100% !important;
        min-height: 148px !important;
        padding: 18px 12px 25px !important;
        gap: 17px !important;
        border-radius: 18px !important;
    }

    body .prediction-tier-grid .prediction-tier-title {
        font-size: 14px !important;
        line-height: 1.15 !important;
        letter-spacing: .08em !important;
    }

    body .prediction-tier-grid .prediction-tier-balls {
        gap: 16px !important;
    }

    body .prediction-tier-grid .prediction-tier-balls .number-ball {
        width: 82px !important;
        height: 82px !important;
        min-width: 82px !important;
        min-height: 82px !important;
        font-size: 28px !important;
        line-height: 1 !important;
        border-width: 3px !important;
        box-shadow: 0 12px 27px rgba(15,23,42,.16) !important;
    }

    body .prediction-tier-grid .number-ball::after {
        bottom: -20px !important;
        padding: 3px 7px !important;
        font-size: 7px !important;
        letter-spacing: .07em !important;
    }

    body .prediction-tier-grid .prediction-tier-sure .number-ball,
    body .prediction-tier-grid .prediction-tier-sure .number-ball:nth-child(n) {
        background: linear-gradient(145deg,#20bd5a,#0b7d3c) !important;
    }

    body .prediction-tier-grid .prediction-tier-direct .number-ball,
    body .prediction-tier-grid .prediction-tier-direct .number-ball:nth-child(n) {
        background: linear-gradient(145deg,#e0a72c,#a96e05) !important;
    }

    body .prediction-number-area > .forecast-countdown {
        margin-bottom: 14px !important;
    }

    body .prediction-share-btn {
        min-height: 50px !important;
        font-size: 12px !important;
        margin-top: 4px !important;
    }
}

@media (max-width: 390px) {
    body .prediction-tier-grid .prediction-tier-balls {
        gap: 11px !important;
    }

    body .prediction-tier-grid .prediction-tier-balls .number-ball {
        width: 72px !important;
        height: 72px !important;
        min-width: 72px !important;
        min-height: 72px !important;
        font-size: 24px !important;
    }
}
'''

css = css_path.read_text(encoding='utf-8')
if marker not in css:
    css_path.write_text(css.rstrip() + patch + '\n', encoding='utf-8')
    print('Added mobile forecast emphasis styles.')
else:
    print('Mobile forecast emphasis styles already present.')

html = html_path.read_text(encoding='utf-8')
old = 'predictions-premium-v4.css?v=4'
new = 'predictions-premium-v4.css?v=5'
if old in html:
    html = html.replace(old, new, 1)
    html_path.write_text(html, encoding='utf-8')
    print('Bumped premium predictions CSS to v5.')
elif new in html:
    print('Premium predictions CSS already at v5.')
else:
    raise SystemExit('Premium predictions stylesheet reference not found.')
