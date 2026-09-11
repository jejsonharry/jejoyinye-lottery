from pathlib import Path

path = Path("admin.html")
text = path.read_text(encoding="utf-8")

old = '<p>Review publishing activity, agent pipeline performance, customer engagement and audited prediction-engine results from one reporting workspace.</p>'
if old not in text:
    raise SystemExit("Analytics intro paragraph not found")

text = text.replace(old, "", 1)
path.write_text(text, encoding="utf-8")

assert old not in text
