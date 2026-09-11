from pathlib import Path

css_path = Path('predictions-premium-v4.css')
html_path = Path('predictions.html')
marker = '/* JOLS Predictions v3 — forecast-first hierarchy */'
patch = r'''

/* JOLS Predictions v3 — forecast-first hierarchy */

/* The forecast is the primary content when a visitor opens the page. */
body .next-prediction-card {
    display: flex !important;
    flex-direction: column !important;
}
body .next-prediction-card > .prediction-card-top { order: 1 !important; }
body .next-prediction-card > h2 { order: 2 !important; }
body .next-prediction-card > #next-game-drawtime,
body .next-prediction-card > #ghana-game-drawtime { order: 3 !important; }
body .next-prediction-card > .prediction-number-area { order: 4 !important; }
body .next-prediction-card > .prediction-countdown-box { order: 5 !important; }
body .next-prediction-card > .prediction-run-details { order: 6 !important; }
body .next-prediction-card > .prediction-range-filter { order: 7 !important; }

/* Turn the forecast block into the strongest visual surface on each card. */
body .next-prediction-card .prediction-number-area {
    margin: 18px 0 12px !important;
    padding: 24px 20px 20px !important;
    border: 1px solid rgba(34,197,94,.34) !important;
    border-radius: 22px !important;
    background:
        radial-gradient(circle at 12% 10%, rgba(34,197,94,.13), transparent 34%),
        radial-gradient(circle at 90% 5%, rgba(212,154,23,.10), transparent 30%),
        linear-gradient(145deg,#f4fff8 0%,#ffffff 58%,#f9fbfd 100%) !important;
    box-shadow: 0 18px 38px rgba(9,54,31,.10) !important;
}
body .ghana-prediction-card .prediction-number-area {
    border-color: rgba(212,154,23,.36) !important;
    background:
        radial-gradient(circle at 12% 10%, rgba(212,154,23,.13), transparent 34%),
        radial-gradient(circle at 90% 5%, rgba(34,197,94,.08), transparent 30%),
        linear-gradient(145deg,#fffaf0 0%,#ffffff 58%,#f9fbfd 100%) !important;
    box-shadow: 0 18px 38px rgba(117,76,5,.09) !important;
}
body .prediction-number-label {
    min-height: 34px !important;
    padding: 8px 15px !important;
    border-radius: 999px !important;
    background: linear-gradient(135deg,#071b2e,#0c3a5b) !important;
    color: #ffffff !important;
    font-size: 10px !important;
    letter-spacing: .12em !important;
    box-shadow: 0 9px 20px rgba(7,27,46,.16) !important;
}

/* Larger, easier-to-scan forecast balls. */
body .prediction-tier-grid .number-ball {
    width: 70px !important;
    height: 70px !important;
    font-size: 23px !important;
    border-width: 3px !important;
}
body .prediction-tier-grid .prediction-tier {
    min-height: 156px !important;
    padding: 18px 14px 22px !important;
}
body .prediction-tier-title {
    font-size: 12px !important;
    letter-spacing: .07em !important;
}
body .prediction-balls.prediction-tier-grid {
    width: min(700px,100%) !important;
    gap: 14px !important;
    margin: 22px auto 21px !important;
}

/* Supporting information is quieter so it cannot compete with the forecast. */
body .next-prediction-card .prediction-countdown-box {
    min-height: 82px !important;
    margin: 8px 0 12px !important;
    padding: 10px 14px !important;
}
body .next-prediction-card #countdown-timer,
body .next-prediction-card #ghana-countdown-timer {
    font-size: clamp(24px,3.3vw,31px) !important;
}
body .next-prediction-card .prediction-run-details {
    margin: 9px 0 10px !important;
    opacity: .96;
}
body .next-prediction-card .prediction-range-filter.prediction-range-panel {
    margin: 7px 0 4px !important;
}

/* Keep methodology visible but secondary. */
body .prediction-number-area .prediction-analysis-summary {
    margin-top: 20px !important;
    border-color: rgba(148,163,184,.20) !important;
    background: rgba(248,250,252,.72) !important;
}
body .prediction-number-area .prediction-small-note {
    margin-top: 12px !important;
    opacity: .88;
}

/* Make the game identity lead directly into the forecast. */
body .next-prediction-card > h2 {
    margin-bottom: 2px !important;
}
body .next-prediction-card > #next-game-drawtime,
body .next-prediction-card > #ghana-game-drawtime {
    margin-bottom: 0 !important;
}

@media (max-width: 1120px) {
    body .prediction-cards-grid {
        width: min(880px,100%) !important;
    }
}

@media (max-width: 700px) {
    body .next-prediction-card .prediction-number-area {
        margin-top: 14px !important;
        padding: 18px 10px 16px !important;
        border-radius: 18px !important;
    }
    body .prediction-number-label {
        min-height: 30px !important;
        padding: 6px 11px !important;
        font-size: 8px !important;
    }
    body .prediction-balls.prediction-tier-grid {
        margin: 17px auto 15px !important;
    }
    body .prediction-tier-grid .prediction-tier {
        min-height: 122px !important;
        padding: 14px 10px 19px !important;
    }
    body .prediction-tier-grid .number-ball {
        width: clamp(54px,15vw,62px) !important;
        height: clamp(54px,15vw,62px) !important;
        font-size: clamp(18px,5vw,21px) !important;
    }
    body .prediction-tier-title {
        font-size: 10px !important;
    }
    body .next-prediction-card .prediction-countdown-box {
        min-height: 76px !important;
    }
}
'''

css = css_path.read_text(encoding='utf-8')
if marker not in css:
    css_path.write_text(css.rstrip() + patch + '\n', encoding='utf-8')
    print('added forecast-first hierarchy CSS')
else:
    print('forecast-first hierarchy already present')

html = html_path.read_text(encoding='utf-8')
old = 'predictions-premium-v4.css?v=2'
new = 'predictions-premium-v4.css?v=3'
if old in html:
    html = html.replace(old, new)
    html_path.write_text(html, encoding='utf-8')
    print('bumped predictions premium asset to v3')
elif new in html:
    print('predictions premium asset already at v3')
else:
    raise SystemExit('predictions premium stylesheet reference not found')
