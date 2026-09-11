from pathlib import Path
import re

path = Path("admin.html")
text = path.read_text(encoding="utf-8")

# Update only the dedicated admin header branding.
header_pattern = re.compile(
    r'<header class="admin-control-header">.*?</header>',
    re.S,
)

header = '''<header class="admin-control-header">
    <div class="admin-control-header-inner">
        <a href="/" class="admin-control-brand" aria-label="Open Jejoyinye Lottery Services website">
            <img src="Images/jols-logo.png" alt="Jejoyinye Lottery Services" class="admin-control-logo">
            <span class="admin-control-brand-copy">
                <small>JOLS SECURE ADMIN</small>
                <strong>JEJOYINYE LOTTERY SERVICES</strong>
            </span>
        </a>
        <div class="admin-control-actions">
            <a href="/" class="admin-view-site-btn">View Website</a>
            <button type="button" id="logout-btn" class="admin-header-logout">Logout</button>
        </div>
    </div>
</header>'''

text, header_count = header_pattern.subn(header, text, count=1)
if header_count != 1:
    raise SystemExit("Could not find the dedicated admin header.")

# Remove the descriptive sentence below Administrator Dashboard.
text = re.sub(
    r'(<h2>\s*Administrator Dashboard\s*</h2>)\s*<p>.*?</p>',
    r'\1',
    text,
    count=1,
    flags=re.S,
)

# Header refinements plus one-row mobile admin tabs.
header_css = '''<style id="admin-header-tuning">
.admin-control-header-inner {
    min-height: 94px !important;
}

.admin-control-brand {
    gap: 16px !important;
}

.admin-control-logo {
    width: 78px !important;
    height: 78px !important;
    object-fit: contain !important;
    flex: 0 0 auto !important;
    filter: drop-shadow(0 9px 18px rgba(0,0,0,.38)) contrast(1.1) saturate(1.1) !important;
}

.admin-control-brand-copy small {
    display: block !important;
    color: #bfdbfe !important;
    font-size: 15px !important;
    font-weight: 950 !important;
    line-height: 1.05 !important;
    letter-spacing: 1.7px !important;
}

.admin-control-brand-copy strong {
    display: block !important;
    margin-top: 6px !important;
    color: #ffffff !important;
    font-size: 22px !important;
    font-weight: 950 !important;
    line-height: 1.08 !important;
    letter-spacing: .1px !important;
    max-width: none !important;
}

.admin-dashboard-body .admin-top-compact h2 {
    margin-bottom: 0 !important;
}

@media (max-width: 760px) {
    .admin-control-header-inner {
        min-height: 82px !important;
        gap: 10px !important;
    }

    .admin-control-brand {
        gap: 10px !important;
    }

    .admin-control-logo {
        width: 64px !important;
        height: 64px !important;
    }

    .admin-control-brand-copy small {
        display: block !important;
        font-size: 11px !important;
        letter-spacing: 1.05px !important;
    }

    .admin-control-brand-copy strong {
        font-size: 14px !important;
        max-width: 205px !important;
    }

    /* Keep Dashboard, Analytics, Results, Agents and Messages on one row. */
    .admin-dashboard-body .admin-tabs {
        display: grid !important;
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
        width: 100% !important;
        overflow: visible !important;
        gap: 3px !important;
        padding: 5px !important;
    }

    .admin-dashboard-body .admin-tab-button {
        flex: initial !important;
        width: 100% !important;
        min-width: 0 !important;
        min-height: 40px !important;
        padding: 9px 3px !important;
        font-size: 10px !important;
        line-height: 1.1 !important;
        white-space: nowrap !important;
        text-align: center !important;
        overflow: hidden !important;
        text-overflow: clip !important;
    }

    #admin-unread-tab-count {
        position: absolute !important;
        top: 2px !important;
        right: 2px !important;
        min-width: 15px !important;
        width: 15px !important;
        height: 15px !important;
        padding: 0 !important;
        margin: 0 !important;
        font-size: 8px !important;
    }
}

@media (max-width: 480px) {
    .admin-control-header-inner {
        min-height: 78px !important;
        width: 96% !important;
    }

    .admin-control-brand {
        gap: 7px !important;
    }

    .admin-control-logo {
        width: 58px !important;
        height: 58px !important;
    }

    .admin-control-brand-copy small {
        display: block !important;
        font-size: 10px !important;
        letter-spacing: .7px !important;
    }

    .admin-control-brand-copy strong {
        font-size: 11px !important;
        max-width: 135px !important;
        line-height: 1.1 !important;
    }

    .admin-view-site-btn,
    .admin-header-logout {
        min-height: 34px !important;
        padding: 7px 8px !important;
    }

    .admin-dashboard-body .admin-tabs {
        gap: 2px !important;
        padding: 4px !important;
    }

    .admin-dashboard-body .admin-tab-button {
        min-height: 38px !important;
        padding: 8px 1px !important;
        font-size: 9px !important;
        letter-spacing: -0.1px !important;
    }
}
</style>'''

if 'id="admin-header-tuning"' in text:
    text = re.sub(
        r'<style id="admin-header-tuning">.*?</style>',
        header_css,
        text,
        count=1,
        flags=re.S,
    )
else:
    text = text.replace('</head>', header_css + '\n\n</head>', 1)

path.write_text(text, encoding="utf-8")
