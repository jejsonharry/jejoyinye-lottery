from pathlib import Path
import re

path = Path('predictions.html')
text = path.read_text(encoding='utf-8')

pattern = re.compile(r'\n\s*<p class="prediction-small-note">.*?</p>\n', re.S)
updated, count = pattern.subn('\n', text)

if count == 0:
    print('No prediction-small-note blocks found; nothing to change.')
else:
    path.write_text(updated, encoding='utf-8')
    print(f'Removed {count} prediction note block(s).')
