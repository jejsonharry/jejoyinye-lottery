from pathlib import Path

PAGES = [
    "index.html",
    "results.html",
    "predictions.html",
    "play-online.html",
    "agent.html",
    "contact.html",
]

for name in PAGES:
    path = Path(name)
    text = path.read_text(encoding="utf-8")
    old = 'public-mobile-nav-final-v11.css?v=14'
    new = 'public-mobile-nav-final-v11.css?v=15'
    if old in text:
        text = text.replace(old, new)
        path.write_text(text, encoding="utf-8")
        print(f"updated {name}")
    elif new in text:
        print(f"already updated {name}")
    else:
        raise SystemExit(f"nav stylesheet reference not found in {name}")
