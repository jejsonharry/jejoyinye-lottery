from pathlib import Path

admin_js = Path("admin.js")
text = admin_js.read_text(encoding="utf-8")

anchor = '''            applicationsContainer
                .appendChild(
                    card
                );'''

replacement = '''            // Approved applications are intentionally read-only in the list.
            // Keep only the APPROVED status badge and View Details action visible.
            if (!archived && status === "approved") {
                card
                    .querySelectorAll(".archive-agent, .restore-agent, .delete-agent")
                    .forEach(button => button.remove());
            }


            applicationsContainer
                .appendChild(
                    card
                );'''

if replacement not in text:
    if anchor not in text:
        raise SystemExit("Could not find agent card append anchor in admin.js")
    text = text.replace(anchor, replacement, 1)

admin_js.write_text(text, encoding="utf-8")

# Bump the browser cache key so the new admin behaviour loads immediately.
admin_html = Path("admin.html")
html = admin_html.read_text(encoding="utf-8")
html = html.replace('admin.js?v=1406', 'admin.js?v=1407')
admin_html.write_text(html, encoding="utf-8")
