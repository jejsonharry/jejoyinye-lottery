from pathlib import Path
import re

PAGES = [
    "index.html",
    "results.html",
    "predictions.html",
    "play-online.html",
    "agent.html",
    "contact.html",
]

ORDER = [
    ("/", "Home"),
    ("results", "Results"),
    ("predictions", "Predictions"),
    ("contact", "Contact"),
    ("agent", "Become an Agent"),
    ("play-online", "Play Online"),
]

NAV_RE = re.compile(r'<nav class="premium-nav">\s*<div class="nav-inner">.*?</div>\s*</nav>', re.S)
A_RE = re.compile(r'<a href="([^"]+)"([^>]*)>(.*?)</a>', re.S)

for page in PAGES:
    path = Path(page)
    text = path.read_text(encoding="utf-8")
    m = NAV_RE.search(text)
    if not m:
        raise SystemExit(f"premium nav not found in {page}")

    existing = {}
    for href, attrs, label in A_RE.findall(m.group(0)):
        existing[href] = (attrs, re.sub(r'\s+', ' ', label).strip())

    lines = ['<nav class="premium-nav">', '    <div class="nav-inner">']
    for href, label in ORDER:
        attrs, _ = existing.get(href, ('', label))
        # Preserve active state only for the page that already had it.
        attrs = attrs.strip()
        attr_text = f" {attrs}" if attrs else ""
        lines.append(f'        <a href="{href}"{attr_text}>{label}</a>')
    lines += ['    </div>', '</nav>']
    new_nav = "\n".join(lines)
    new_text = text[:m.start()] + new_nav + text[m.end():]
    path.write_text(new_text, encoding="utf-8")
    print(f"updated {page}")
