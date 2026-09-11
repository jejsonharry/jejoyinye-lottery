from pathlib import Path
import re

html_path = Path("admin.html")
js_path = Path("admin.js")
css_path = Path("admin-premium-v3.css")

html = html_path.read_text(encoding="utf-8")
js = js_path.read_text(encoding="utf-8")
css = css_path.read_text(encoding="utf-8")

# Remove the public-site shortcut from the secure admin header.
html = re.sub(
    r'\s*<a href="/" class="admin-view-site-btn">\s*View Website\s*</a>',
    "",
    html,
    count=1,
    flags=re.S,
)

# Upgrade the Agents tab heading and explanation.
html = re.sub(
    r'<h2>\s*Agent Applications\s*</h2>',
    '<h2>Agent Applications &amp; Onboarding</h2>',
    html,
    count=1,
    flags=re.S,
)
html = re.sub(
    r'<p>\s*Review and manage\s*prospective lottery agents\.\s*</p>',
    '<p>Review applications, verify applicant information, manage approval decisions and track onboarding progress across the agent network.</p>',
    html,
    count=1,
    flags=re.S,
)

agent_section = html.find('id="agents-tab"')
if agent_section == -1:
    raise SystemExit("Agents tab not found")

# Add a concise operational summary to the Agents tab.
if 'id="agent-tab-total"' not in html:
    tools_pos = html.find('<div class="admin-tools">', agent_section)
    if tools_pos == -1:
        raise SystemExit("Agents toolbar not found")
    summary = '''<div class="agent-network-summary" aria-label="Agent network summary">
                <article class="agent-summary-card">
                    <span>Active Applications</span>
                    <strong id="agent-tab-total">0</strong>
                    <small>Current non-archived records</small>
                </article>
                <article class="agent-summary-card pending">
                    <span>Pending Applications</span>
                    <strong id="agent-tab-pending">0</strong>
                    <small>Awaiting an application decision</small>
                </article>
                <article class="agent-summary-card approved">
                    <span>Approved Applications</span>
                    <strong id="agent-tab-approved">0</strong>
                    <small>Approved and ready for onboarding</small>
                </article>
                <article class="agent-summary-card onboarded">
                    <span>Onboarded Agents</span>
                    <strong id="agent-tab-onboarded">0</strong>
                    <small>Agents already fully onboarded</small>
                </article>
            </div>

            '''
    html = html[:tools_pos] + summary + html[tools_pos:]

# Add a separate onboarding-status filter, independent of application status.
if 'id="agent-onboarding-filter"' not in html:
    tail = html[agent_section:]
    match = re.search(
        r'(<div class="admin-form-group">\s*<label for="agent-status-filter">.*?</select>\s*</div>)',
        tail,
        flags=re.S,
    )
    if not match:
        raise SystemExit("Application status filter not found")
    onboarding_filter = '''

                <div class="admin-form-group">
                    <label for="agent-onboarding-filter">Agent Status</label>
                    <select id="agent-onboarding-filter">
                        <option value="all">All Agent Status</option>
                        <option value="pending">Pending Onboarding</option>
                        <option value="onboarded">Onboarded</option>
                    </select>
                </div>'''
    absolute_end = agent_section + match.end(1)
    html = html[:absolute_end] + onboarding_filter + html[absolute_end:]

# Cache bust after this UI/logic change.
html = re.sub(r'admin-premium-v3\.css\?v=\d+', 'admin-premium-v3.css?v=5', html, count=1)
html = re.sub(r'admin\.js\?v=\d+', 'admin.js?v=1410', html, count=1)

# Reference the new onboarding filter in JS.
if 'const agentOnboardingFilter' not in js:
    marker = '''const agentStatusFilter =
    document.getElementById(
        "agent-status-filter"
    );'''
    if marker not in js:
        raise SystemExit("agentStatusFilter reference not found")
    js = js.replace(
        marker,
        marker + '''


const agentOnboardingFilter =
    document.getElementById(
        "agent-onboarding-filter"
    );''',
        1,
    )

# Add onboarded calculation and the Agents-tab summary counters.
stats_start = js.find('function updateAgentStatistics()')
stats_end = js.find('// =========================================================\n// FILTER AGENTS', stats_start)
if stats_start == -1 or stats_end == -1:
    raise SystemExit("updateAgentStatistics block not found")
stats = js[stats_start:stats_end]

if 'const onboarded =' not in stats:
    archived_marker = '''    const archived =
        allApplications.filter('''
    if archived_marker not in stats:
        raise SystemExit("Archived calculation not found")
    onboarded = '''    const onboarded =
        active.filter(
            item => String(item.onboarding_status || "pending").toLowerCase() === "onboarded"
        );


'''
    stats = stats.replace(archived_marker, onboarded + archived_marker, 1)

if 'agent-tab-onboarded' not in stats:
    insert_before = '    if (applicationsCount) {'
    if insert_before not in stats:
        raise SystemExit("applicationsCount block not found")
    tab_stats = '''    const tabTotal = document.getElementById("agent-tab-total");
    const tabPending = document.getElementById("agent-tab-pending");
    const tabApproved = document.getElementById("agent-tab-approved");
    const tabOnboarded = document.getElementById("agent-tab-onboarded");

    if (tabTotal) tabTotal.textContent = String(active.length);
    if (tabPending) tabPending.textContent = String(pending.length);
    if (tabApproved) tabApproved.textContent = String(approved.length);
    if (tabOnboarded) tabOnboarded.textContent = String(onboarded.length);


'''
    stats = stats.replace(insert_before, tab_stats + insert_before, 1)

js = js[:stats_start] + stats + js[stats_end:]

# Extend existing application filtering with the new onboarding filter.
filter_start = js.find('function filterApplications()')
filter_end = js.find('// =========================================================\n// RENDER APPLICATIONS', filter_start)
if filter_start == -1 or filter_end == -1:
    raise SystemExit("filterApplications block not found")
filter_code = js[filter_start:filter_end]

if 'const onboardingFilterValue' not in filter_code:
    filtered_marker = '''    const filtered =
        allApplications.filter('''
    if filtered_marker not in filter_code:
        raise SystemExit("Filtered applications marker not found")
    onboarding_value = '''    const onboardingFilterValue =
        String(agentOnboardingFilter?.value || "all").toLowerCase();


'''
    filter_code = filter_code.replace(filtered_marker, onboarding_value + filtered_marker, 1)

    old_return = '''                return (

                    statusMatches

                    &&

                    searchMatches

                );'''
    new_return = '''                const onboardingStatus =
                    String(application.onboarding_status || "pending").toLowerCase();

                const onboardingMatches =
                    onboardingFilterValue === "all"
                    || onboardingStatus === onboardingFilterValue;

                return statusMatches && searchMatches && onboardingMatches;'''
    if old_return not in filter_code:
        raise SystemExit("filterApplications return block not found")
    filter_code = filter_code.replace(old_return, new_return, 1)

js = js[:filter_start] + filter_code + js[filter_end:]

# Polish application cards while preserving existing controls and approved-card behavior.
render_start = js.find('function renderApplications(')
render_end = js.find('// =========================================================\n// OPEN AGENT MODAL', render_start)
if render_start == -1 or render_end == -1:
    raise SystemExit("renderApplications block not found")
render = js[render_start:render_end]

if 'const onboardingStatus =' not in render:
    archived_decl = '''            const archived =
                application.archived ===
                true;'''
    if archived_decl not in render:
        raise SystemExit("Archived declaration not found in renderApplications")
    render = render.replace(
        archived_decl,
        archived_decl + '''


            const onboardingStatus =
                String(application.onboarding_status || "pending").toLowerCase();''',
        1,
    )

if '"agent-application-card"' not in render:
    class_marker = '''            card.className =
                "admin-card";'''
    if class_marker not in render:
        raise SystemExit("Agent card class marker not found")
    render = render.replace(
        class_marker,
        '''            card.className = [
                "admin-card",
                "agent-application-card",
                `application-${archived ? "archived" : status}`,
                `onboarding-${onboardingStatus}`
            ].join(" ");''',
        1,
    )

# Replace only the first card template inside renderApplications.
if 'agent-card-header' not in render:
    pattern = re.compile(r'            card\.innerHTML = `.*?\n            `;', re.S)
    template = '''            card.innerHTML = `
                <div class="agent-card-header">
                    <div class="agent-card-title">
                        <span class="agent-card-kicker">AGENT APPLICATION</span>
                        <h3>${escapeHTML(application.full_name)}</h3>
                        <span class="agent-card-location">${escapeHTML(application.city)}, ${escapeHTML(application.state)}</span>
                    </div>
                    <div class="agent-card-statuses">
                        <span class="application-status ${archived ? "status-archived" : `status-${escapeHTML(status)}`}">
                            ${archived ? "ARCHIVED" : escapeHTML(status.toUpperCase())}
                        </span>
                        <span class="agent-onboarding-badge onboarding-badge-${escapeHTML(onboardingStatus)}">
                            ${onboardingStatus === "onboarded" ? "ONBOARDED" : "PENDING ONBOARDING"}
                        </span>
                    </div>
                </div>

                <div class="agent-card-contact-grid">
                    <div class="agent-card-contact"><span>Phone</span><strong>${escapeHTML(application.phone)}</strong></div>
                    <div class="agent-card-contact"><span>Email</span><strong>${escapeHTML(application.email || "Not provided")}</strong></div>
                    <div class="agent-card-contact"><span>Submitted</span><strong>${escapeHTML(formatDateTime(application.created_at))}</strong></div>
                </div>

                <div class="agent-card-footer">
                    <div class="agent-card-progress">
                        <span class="agent-progress-dot ${status === "approved" ? "complete" : ""}"></span>
                        <span>Application ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : "under review"}</span>
                        <span class="agent-progress-line"></span>
                        <span class="agent-progress-dot ${onboardingStatus === "onboarded" ? "complete" : ""}"></span>
                        <span>${onboardingStatus === "onboarded" ? "Agent onboarded" : "Onboarding pending"}</span>
                    </div>

                    <div class="admin-actions agent-card-actions">
                        <button type="button" class="admin-dark-btn view-agent" data-id="${application.id}">View Details</button>
                        ${archived ? `
                            <button type="button" class="admin-restore-btn restore-agent" data-id="${application.id}">Restore</button>
                        ` : `
                            <button type="button" class="admin-archive-btn archive-agent" data-id="${application.id}">Archive</button>
                        `}
                        <button type="button" class="admin-danger-btn delete-agent" data-id="${escapeHTML(application.id)}">Delete</button>
                    </div>
                </div>
            `;'''
    render, count = pattern.subn(template, render, count=1)
    if count != 1:
        raise SystemExit("Agent card template not replaced")

js = js[:render_start] + render + js[render_end:]

# Listen to onboarding filter changes.
if 'agentOnboardingFilter\n        ?.addEventListener' not in js:
    event_marker = '''    agentStatusFilter
        ?.addEventListener(
            "change",
            filterApplications
        );'''
    if event_marker not in js:
        raise SystemExit("agentStatusFilter event listener not found")
    js = js.replace(
        event_marker,
        event_marker + '''


    agentOnboardingFilter
        ?.addEventListener(
            "change",
            filterApplications
        );''',
        1,
    )

# Premium visual treatment for Agents tab only.
if 'PREMIUM AGENT MANAGEMENT — V4' not in css:
    css += r'''

/* =========================================================
   PREMIUM AGENT MANAGEMENT — V4
========================================================= */
.agent-network-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:0 0 18px}.agent-summary-card{position:relative;overflow:hidden;min-height:116px;padding:18px;border:1px solid #dce6ef;border-radius:17px;background:linear-gradient(145deg,#fff,#f8fbff);box-shadow:0 10px 24px rgba(18,42,70,.055)}.agent-summary-card:after{content:"";position:absolute;width:82px;height:82px;right:-42px;top:-42px;border-radius:50%;background:rgba(37,99,235,.10)}.agent-summary-card.pending:after{background:rgba(245,158,11,.14)}.agent-summary-card.approved:after{background:rgba(22,163,74,.13)}.agent-summary-card.onboarded:after{background:rgba(13,139,79,.16)}.agent-summary-card span,.agent-summary-card small{display:block}.agent-summary-card span{color:#5f7087;font-size:11px;font-weight:900;letter-spacing:.3px;text-transform:uppercase}.agent-summary-card strong{display:block;margin:9px 0 5px;color:#0a1b35;font-size:28px;font-weight:950}.agent-summary-card small{color:#79889b;font-size:11px;line-height:1.4}
#agents-tab .admin-tools{grid-template-columns:2fr 1fr 1fr!important;margin-bottom:18px}#agent-applications-container{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:15px!important}.agent-application-card{display:flex;flex-direction:column;min-height:330px;padding:0!important;border-radius:20px!important;background:#fff!important}.agent-application-card:before{width:5px!important;background:linear-gradient(180deg,#1d6de0,#0d8b4f)!important}.agent-application-card.application-approved:before{background:linear-gradient(180deg,#17a05d,#087944)!important}.agent-application-card.application-pending:before{background:linear-gradient(180deg,#f3b72b,#d97706)!important}.agent-application-card.application-rejected:before{background:linear-gradient(180deg,#ef4444,#b91c1c)!important}.agent-application-card.application-archived:before{background:linear-gradient(180deg,#64748b,#334155)!important}
.agent-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:22px 22px 18px 25px;border-bottom:1px solid #e8eef4;background:linear-gradient(145deg,#fff,#f8fbfe)}.agent-card-title{min-width:0}.agent-card-kicker{display:block;margin-bottom:5px;color:#0d8b4f;font-size:9px;font-weight:950;letter-spacing:1.25px}.agent-card-title h3{margin:0 0 5px!important;color:#091a31!important;font-size:20px!important;font-weight:950!important}.agent-card-location{color:#718197;font-size:12px;font-weight:750}.agent-card-statuses{display:flex;flex-direction:column;align-items:flex-end;gap:7px;flex:0 0 auto}.agent-card-statuses .application-status{margin:0!important}.agent-onboarding-badge{display:inline-flex;align-items:center;justify-content:center;min-height:26px;padding:5px 9px;border:1px solid transparent;border-radius:999px;font-size:9px;font-weight:950;letter-spacing:.35px}.onboarding-badge-pending{color:#9a5a07;background:#fff7dc;border-color:#f9df94}.onboarding-badge-onboarded{color:#08733f;background:#e4f9ed;border-color:#bcebcf}
.agent-card-contact-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:18px 22px 4px 25px}.agent-card-contact{min-width:0;padding:12px;border:1px solid #e1e9f1;border-radius:12px;background:#f9fbfd}.agent-card-contact span,.agent-card-contact strong{display:block}.agent-card-contact span{margin-bottom:5px;color:#7b899b;font-size:9px;font-weight:900;letter-spacing:.55px;text-transform:uppercase}.agent-card-contact strong{overflow:hidden;color:#24384f;font-size:12px;font-weight:850;line-height:1.4;text-overflow:ellipsis}.agent-card-footer{margin-top:auto;padding:16px 22px 20px 25px}.agent-card-progress{display:flex;align-items:center;gap:7px;min-height:32px;padding:9px 11px;border:1px solid #e2eaf2;border-radius:11px;background:linear-gradient(145deg,#f8fbfd,#fff);color:#66768b;font-size:10px;font-weight:800}.agent-progress-dot{width:8px;height:8px;flex:0 0 auto;border-radius:50%;background:#c4cfdb;box-shadow:0 0 0 3px rgba(148,163,184,.12)}.agent-progress-dot.complete{background:#16a05d;box-shadow:0 0 0 3px rgba(22,160,93,.14)}.agent-progress-line{width:20px;height:1px;flex:0 0 auto;background:#ced8e2}.agent-card-actions{margin-top:13px!important;padding-top:13px;border-top:1px solid #edf1f5}
@media(max-width:1000px){.agent-network-summary{grid-template-columns:repeat(2,minmax(0,1fr))}#agents-tab .admin-tools{grid-template-columns:1fr 1fr!important}#agents-tab .admin-tools .admin-form-group:first-child{grid-column:1/-1}}@media(max-width:760px){.agent-network-summary{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.agent-summary-card{min-height:106px;padding:14px}.agent-summary-card strong{font-size:25px}#agents-tab .admin-tools{grid-template-columns:1fr!important}#agents-tab .admin-tools .admin-form-group:first-child{grid-column:auto}#agent-applications-container{grid-template-columns:1fr!important}.agent-card-header{padding:18px 16px 15px 19px}.agent-card-contact-grid{grid-template-columns:1fr 1fr;padding:15px 16px 3px 19px}.agent-card-contact:last-child{grid-column:1/-1}.agent-card-footer{padding:14px 16px 18px 19px}.agent-card-progress{flex-wrap:wrap}}@media(max-width:460px){.agent-card-header{flex-direction:column;gap:11px}.agent-card-statuses{flex-direction:row;flex-wrap:wrap;align-items:center}.agent-card-contact-grid{grid-template-columns:1fr}.agent-card-contact:last-child{grid-column:auto}.agent-card-actions{display:grid!important;grid-template-columns:1fr}.agent-card-actions button{width:100%}}
'''

html_path.write_text(html, encoding="utf-8")
js_path.write_text(js, encoding="utf-8")
css_path.write_text(css, encoding="utf-8")

# Hard validations: fail loudly rather than claim a partial update.
assert 'class="admin-view-site-btn"' not in html
assert 'id="agent-onboarding-filter"' in html
assert 'id="agent-tab-onboarded"' in html
assert 'agent-application-card' in js
assert 'agentOnboardingFilter' in js
assert 'PREMIUM AGENT MANAGEMENT — V4' in css
