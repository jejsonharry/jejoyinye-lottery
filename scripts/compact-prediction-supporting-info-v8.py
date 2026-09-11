from pathlib import Path

css_path = Path('predictions-premium-v4.css')
html_path = Path('predictions.html')
marker = '/* Prediction supporting information compact v8 */'
patch = r'''

/* Prediction supporting information compact v8 */
body .prediction-number-area .prediction-analysis-summary {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 8px !important;
    margin: 13px 0 0 !important;
    padding: 8px !important;
    border: 1px solid rgba(148,163,184,.18) !important;
    border-radius: 14px !important;
    background: rgba(248,250,252,.66) !important;
}

body .prediction-number-area .ghana-analysis-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
}

body .prediction-number-area .analysis-summary-card {
    min-height: 58px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 4px !important;
    padding: 8px 7px !important;
    border: 1px solid rgba(226,232,240,.9) !important;
    border-radius: 10px !important;
    background: rgba(255,255,255,.82) !important;
    box-shadow: none !important;
    text-align: center !important;
}

body .prediction-number-area .analysis-summary-card span {
    color: #7a8a9e !important;
    font-size: 7px !important;
    font-weight: 900 !important;
    line-height: 1.2 !important;
    letter-spacing: .055em !important;
    text-transform: uppercase !important;
}

body .prediction-number-area .analysis-summary-card strong {
    color: #1d3145 !important;
    font-size: 9px !important;
    font-weight: 900 !important;
    line-height: 1.35 !important;
}

body .next-prediction-card > .prediction-run-details {
    gap: 6px !important;
    margin: 8px 0 !important;
    padding: 7px !important;
    border-radius: 12px !important;
    background: rgba(244,247,250,.78) !important;
}

body .next-prediction-card > .prediction-run-details > div {
    min-height: 49px !important;
    padding: 7px 8px !important;
    border-radius: 9px !important;
}

body .next-prediction-card > .prediction-run-details span {
    font-size: 7px !important;
    letter-spacing: .065em !important;
}

body .next-prediction-card > .prediction-run-details strong {
    margin-top: 2px !important;
    font-size: 9px !important;
    line-height: 1.3 !important;
}

body .next-prediction-card > .prediction-range-filter.prediction-range-panel {
    margin: 6px 0 2px !important;
    padding: 11px !important;
    border-radius: 13px !important;
    background: rgba(248,250,252,.84) !important;
}

body .prediction-range-heading {
    margin-bottom: 8px !important;
}

body .prediction-range-heading span {
    font-size: 8px !important;
}

body .prediction-range-heading strong {
    font-size: 10px !important;
}

body .prediction-range-field label {
    font-size: 8px !important;
}

body .prediction-range-field input,
body .prediction-range-apply,
body .prediction-range-reset {
    min-height: 40px !important;
}

body .prediction-share-btn {
    margin-bottom: 0 !important;
}

@media (max-width: 700px) {
    body .prediction-number-area .prediction-analysis-summary,
    body .prediction-number-area .ghana-analysis-summary {
        grid-template-columns: 1fr !important;
        gap: 5px !important;
        padding: 6px !important;
        margin-top: 10px !important;
    }

    body .prediction-number-area .analysis-summary-card {
        min-height: 0 !important;
        display: grid !important;
        grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr) !important;
        align-items: center !important;
        gap: 9px !important;
        padding: 8px 9px !important;
        text-align: left !important;
    }

    body .prediction-number-area .analysis-summary-card span {
        font-size: 7px !important;
        line-height: 1.25 !important;
    }

    body .prediction-number-area .analysis-summary-card strong {
        font-size: 9px !important;
        line-height: 1.3 !important;
        text-align: right !important;
    }

    body .next-prediction-card > .prediction-run-details {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 4px !important;
        padding: 5px !important;
    }

    body .next-prediction-card > .prediction-run-details > div,
    body .next-prediction-card > .prediction-run-details > div:last-child {
        grid-column: auto !important;
        min-height: 45px !important;
        padding: 6px 4px !important;
        text-align: center !important;
    }

    body .next-prediction-card > .prediction-run-details span {
        font-size: 6px !important;
    }

    body .next-prediction-card > .prediction-run-details strong {
        font-size: 8px !important;
    }

    body .next-prediction-card > .prediction-range-filter.prediction-range-panel {
        padding: 9px !important;
    }

    body .prediction-range-field input,
    body .prediction-range-apply,
    body .prediction-range-reset {
        min-height: 38px !important;
        font-size: 10px !important;
    }
}
'''

css = css_path.read_text(encoding='utf-8')
if marker not in css:
    css_path.write_text(css.rstrip() + patch + '\n', encoding='utf-8')
    print('Added compact supporting-information styles.')
else:
    print('Compact supporting-information styles already present.')

html = html_path.read_text(encoding='utf-8')
old = 'predictions-premium-v4.css?v=7'
new = 'predictions-premium-v4.css?v=8'
if old in html:
    html = html.replace(old, new, 1)
    html_path.write_text(html, encoding='utf-8')
    print('Bumped predictions premium CSS to v8.')
elif new in html:
    print('Predictions premium CSS already at v8.')
else:
    raise SystemExit('Predictions premium stylesheet reference not found.')
