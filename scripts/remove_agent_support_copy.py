from pathlib import Path

path = Path("admin.html")
text = path.read_text(encoding="utf-8")

targets = [
    "Review prospective agents, manage application decisions and track each approved agent from pending onboarding to fully onboarded status.",
    "Manage website enquiries from a focused support inbox with read status, direct reply tools, archiving and controlled record management.",
]

for target in targets:
    wrapped = f"<p>\n                    {target}\n                </p>"
    compact = f"<p>{target}</p>"
    if wrapped in text:
        text = text.replace(wrapped, "", 1)
    elif compact in text:
        text = text.replace(compact, "", 1)
    else:
        raise SystemExit(f"Target paragraph not found: {target}")

path.write_text(text, encoding="utf-8")

for target in targets:
    assert target not in text
