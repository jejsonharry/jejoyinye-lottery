from pathlib import Path
import re

path = Path('predictions.html')
text = path.read_text(encoding='utf-8')
original = text

patterns = [
    (
        'Upcoming Game Prediction heading',
        r'\n\s*<div class="prediction-section-heading">\s*<span>\s*NEXT DRAW\s*</span>\s*<h2>\s*Upcoming Game Prediction\s*</h2>\s*</div>',
        1,
    ),
    (
        'Modern run details',
        r'\n\s*<div class="prediction-run-details" aria-label="Modern prediction details">.*?</div>\s*</div>',
        1,
    ),
    (
        "Today's Earlier Games card",
        r'\n\s*<div class="analysis-summary-card">\s*<span>Today\'s Earlier Games</span>\s*<strong id="analysis-today-count">.*?</strong>\s*</div>',
        1,
    ),
    (
        'Ghana run details',
        r'\n\s*<div class="prediction-run-details" aria-label="Ghana prediction details">.*?</div>\s*</div>',
        1,
    ),
    (
        'Historical Draws Analysed card',
        r'\n\s*<div class="analysis-summary-card">\s*<span>Historical Draws Analysed</span>\s*<strong id="ghana-analysis-draw-count">.*?</strong>\s*</div>',
        1,
    ),
]

for label, pattern, expected in patterns:
    text, count = re.subn(pattern, '', text, count=expected, flags=re.S)
    print(f'{label}: removed {count}')
    if count != expected:
        raise SystemExit(f'Expected to remove {expected} instance of {label}, found {count}.')

if text != original:
    path.write_text(text, encoding='utf-8')
    print('Predictions page cleanup applied.')
else:
    print('No changes applied.')
