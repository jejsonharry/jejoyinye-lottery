from pathlib import Path
import re

path = Path('predictions.html')
text = path.read_text(encoding='utf-8')
original = text

# Remove Modern "Previous 7-Day Draws Analysed" summary card.
text, modern_count = re.subn(
    r'\n\s*<div class="analysis-summary-card">\s*<span>Previous 7-Day Draws Analysed</span>\s*<strong id="analysis-draw-count">.*?</strong>\s*</div>',
    '',
    text,
    count=1,
    flags=re.S,
)

# Remove Generated detail cards from both Modern and Ghana run details.
text, generated_count = re.subn(
    r'\n\s*<div>\s*<span>Generated</span>\s*<strong id="(?:modern|ghana)-generated-time">.*?</strong>\s*</div>',
    '',
    text,
    flags=re.S,
)

# Remove Ghana range helper/status line.
text, ghana_status_count = re.subn(
    r'\n\s*<p id="ghana-prediction-range-status" class="prediction-range-status">.*?</p>',
    '',
    text,
    count=1,
    flags=re.S,
)

if text != original:
    path.write_text(text, encoding='utf-8')

print(f'Removed Modern analysed card: {modern_count}')
print(f'Removed Generated cards: {generated_count}')
print(f'Removed Ghana helper line: {ghana_status_count}')
