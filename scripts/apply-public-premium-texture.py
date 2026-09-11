from pathlib import Path

PAGES = [
    "index.html",
    "results.html",
    "predictions.html",
    "play-online.html",
    "agent.html",
    "contact.html",
]

LINK = '    <link rel="stylesheet" href="public-premium-texture-v1.css?v=1">\n'

for name in PAGES:
    path = Path(name)
    text = path.read_text(encoding="utf-8")
    if "public-premium-texture-v1.css" in text:
        continue
    marker = "</head>"
    if marker not in text:
        raise SystemExit(f"Missing </head> in {name}")
    text = text.replace(marker, LINK + marker, 1)
    path.write_text(text, encoding="utf-8")
    print(f"updated {name}")
