from pathlib import Path
import re

path = Path("admin.html")
text = path.read_text(encoding="utf-8")

# Remove the helper paragraph under Official Result Publishing.
text, c1 = re.subn(
    r'(<h2>\s*Official Result Publishing\s*</h2>)\s*<p>.*?</p>',
    r'\1',
    text,
    count=1,
    flags=re.S,
)

# Remove the helper paragraph under Winning Numbers.
text, c2 = re.subn(
    r'(<h3>\s*Winning Numbers\s*</h3>)\s*<p>.*?</p>',
    r'\1',
    text,
    count=1,
    flags=re.S,
)

# Keep the machine-number helper element for JS compatibility, but hide all copy from the UI.
text, c3 = re.subn(
    r'(<h3>\s*Machine Numbers\s*</h3>)\s*<p\s+id="machine-number-help">.*?</p>',
    r'\1\n                    <p id="machine-number-help" hidden></p>',
    text,
    count=1,
    flags=re.S,
)

# Remove the helper paragraph under Result Database & Records.
text, c4 = re.subn(
    r'(<h2>\s*Result Database &amp; Records\s*</h2>)\s*<p>.*?</p>',
    r'\1',
    text,
    count=1,
    flags=re.S,
)

if (c1, c2, c3, c4) != (1, 1, 1, 1):
    raise SystemExit(f"Unexpected replacement counts: {(c1, c2, c3, c4)}")

path.write_text(text, encoding="utf-8")
