from pathlib import Path
import re

path = Path('predictions.html')
text = path.read_text(encoding='utf-8')
original = text

# Remove the full Upcoming Game Prediction section heading block.
text, n_heading = re.subn(
    r'\n\s*<div class="prediction-section-heading">\s*<span>\s*NEXT DRAW\s*</span>\s*<h2>\s*Upcoming Game Prediction\s*</h2>\s*</div>',
    '',
    text,
    count=1,
    flags=re.S,
)

# Remove the Modern "Today\'s Earlier Games" summary card.
text, n_today = re.subn(
    r'\n\s*<div class="analysis-summary-card">\s*<span>Today\'s Earlier Games</span>\s*<strong id="analysis-today-count">.*?</strong>\s*</div>',
    '',
    text,
    count=1,
    flags=re.S,
)

# Remove Ghana "Historical Draws Analysed" summary card.
text, n_hist = re.subn(
    r'\n\s*<div class="analysis-summary-card">\s*<span>Historical Draws Analysed</span>\s*<strong id="ghana-analysis-draw-count">.*?</strong>\s*</div>',
    '',
    text,
    count=1,
    flags=re.S,
)

if text != original:
    path.write_text(text, encoding='utf-8')

print(f'Removed heading: {n_heading}')
print(f'Removed today card: {n_today}')
print(f'Removed Ghana history card: {n_hist}')

if n_heading != 1 or n_today != 1 or n_hist != 1:
    raise SystemExit('One or more requested elements were not found exactly once.')
