from pathlib import Path
import re

path = Path('predictions.html')
text = path.read_text(encoding='utf-8')
pattern = re.compile(r'\n\s*<p id="modern-prediction-range-status" class="prediction-range-status">.*?</p>', re.S)
updated, count = pattern.subn('', text, count=1)
if count == 0:
    print('Modern range status helper already absent.')
else:
    path.write_text(updated, encoding='utf-8')
    print('Removed Modern range status helper.')
