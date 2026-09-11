from pathlib import Path
import re

path = Path('predictions.html')
text = path.read_text(encoding='utf-8')
pattern = re.compile(r'\n\s*<span>\s*TODAY\'S GAMES\s*</span>\s*(?=<h2>\s*Daily Game Schedule)', re.S)
updated, count = pattern.subn('\n', text, count=1)
if count != 1:
    raise SystemExit(f"Expected to remove 1 TODAY'S GAMES schedule label, removed {count}.")
path.write_text(updated, encoding='utf-8')
print("Removed TODAY'S GAMES label above Daily Game Schedule.")
