from pathlib import Path
import re

path = Path('index.html')
html = path.read_text(encoding='utf-8')

# Load enhancement assets.
html = html.replace(
    '<link rel="stylesheet" href="homepage-premium-v2.css?v=2">',
    '<link rel="stylesheet" href="homepage-premium-v2.css?v=2">\n    <link rel="stylesheet" href="homepage-enhancements-v3.css?v=1">',
    1,
)
html = html.replace(
    '<script src="script.js?v=68" defer></script>',
    '<script src="script.js?v=68" defer></script>\n  <script src="homepage-enhancements-v3.js?v=1" defer></script>',
    1,
)

# Rename AI wording.
html = html.replace('''        <h3>\n                AI Insights\n            </h3>''', '''        <h3>\n                Data &amp; Number Insights\n            </h3>''', 1)
html = html.replace('''            Explore Insights →''', '''            Explore Number Insights →''', 1)
html = html.replace('''     AI INSIGHT SECTION''', '''     DATA INSIGHT SECTION''', 1)

# Insert today's draw schedule below the quick stats section.
marker = '''</section>\n\n\n<!-- =====================================================\n     ONLINE PLAYER PROMOTION'''
schedule = '''</section>\n\n\n<!-- =====================================================\n     TODAY'S DRAW SCHEDULE\n===================================================== -->\n<section class="home-draw-center" aria-labelledby="home-draw-title">\n    <div class="home-draw-heading">\n        <div class="home-draw-heading-copy">\n            <span>DRAW SCHEDULE</span>\n            <h2 id="home-draw-title">Today’s Draw Schedule</h2>\n        </div>\n        <p>Quick Lagos-time view of the next Modern Billionaire draw and today’s Ghana game.</p>\n    </div>\n\n    <div class="home-draw-grid">\n        <article class="home-draw-card modern">\n            <div>\n                <span class="home-draw-label">Next Modern Billionaire Draw</span>\n                <h3 id="home-next-modern-game">Loading...</h3>\n                <div class="home-draw-meta">12 daily games • Lagos time</div>\n            </div>\n            <div class="home-draw-time">\n                <strong id="home-next-modern-time">--:--</strong>\n                <span id="home-next-modern-status" class="home-draw-status is-awaiting">Checking</span>\n            </div>\n        </article>\n\n        <article class="home-draw-card ghana">\n            <div>\n                <span class="home-draw-label">Today’s Ghana Game</span>\n                <h3 id="home-today-ghana-game">Loading...</h3>\n                <div class="home-draw-meta">Weekly Ghana schedule • Lagos time</div>\n            </div>\n            <div class="home-draw-time">\n                <strong id="home-today-ghana-time">--:--</strong>\n                <span id="home-today-ghana-status" class="home-draw-status is-awaiting">Checking</span>\n            </div>\n        </article>\n    </div>\n</section>\n\n\n<!-- =====================================================\n     ONLINE PLAYER PROMOTION'''
if marker not in html:
    raise SystemExit('Quick stats insertion point not found')
html = html.replace(marker, schedule, 1)

# Add freshness indicator under Latest Lottery Results description.
results_copy = '''        <p>See the latest published winning numbers, with machine numbers displayed where applicable.</p>'''
results_new = '''        <p>See the latest published winning and machine numbers from Modern Billionaire and Ghana games.</p>\n        <div id="home-results-updated" class="home-results-updated">Last updated: checking...</div>'''
if results_copy not in html:
    raise SystemExit('Latest results copy not found')
html = html.replace(results_copy, results_new, 1)

# Replace old footer + separate legal row + large Facebook pill.
footer_start = html.find('<footer class="premium-footer">')
facebook_start = html.find('<a class="facebook-community-btn"', footer_start)
body_end = html.find('</body>', facebook_start)
if footer_start == -1 or facebook_start == -1 or body_end == -1:
    raise SystemExit('Footer block not found')

new_footer = '''<footer class="premium-footer homepage-footer-v3">\n    <div class="footer-inner footer-grid">\n        <div class="footer-brand">\n            <h3>JEJOYINYE LOTTERY SERVICES</h3>\n            <p>Daily lottery results, number insights, online-player access and agent support from one focused platform.</p>\n            <a class="footer-support-link" href="contact">Contact Customer Support</a>\n        </div>\n\n        <div class="footer-column">\n            <h4>Explore</h4>\n            <a href="/">Home</a>\n            <a href="results">Results</a>\n            <a href="predictions">Predictions</a>\n            <a href="play-online">Play Online</a>\n        </div>\n\n        <div class="footer-column">\n            <h4>Network</h4>\n            <a href="agent">Become an Agent</a>\n            <a href="contact">Contact</a>\n            <a href="https://www.facebook.com/share/1Hs5FSoJJ3/" target="_blank" rel="noopener noreferrer">Facebook Community</a>\n        </div>\n\n        <div class="footer-column">\n            <h4>Legal &amp; Safety</h4>\n            <a href="privacy">Privacy Policy</a>\n            <a href="terms">Terms of Use</a>\n            <a href="responsible-gaming">Responsible Gaming</a>\n            <p class="footer-responsible">Adults 18+ only. Lottery play involves risk; play responsibly.</p>\n        </div>\n    </div>\n\n    <div class="footer-bottom">\n        <p>&copy; 2026 Jejoyinye Lottery Services. All Rights Reserved.</p>\n    </div>\n</footer>\n\n<a class="facebook-community-btn" href="https://www.facebook.com/share/1Hs5FSoJJ3/" target="_blank" rel="noopener noreferrer" aria-label="Open JOLS Facebook community">\n    <span class="facebook-community-icon" aria-hidden="true">f</span>\n    <strong>Facebook Group</strong>\n</a>\n\n\n'''
html = html[:footer_start] + new_footer + html[body_end:]

path.write_text(html, encoding='utf-8')

assert 'home-draw-center' in html
assert 'home-results-updated' in html
assert 'homepage-enhancements-v3.css?v=1' in html
assert 'homepage-enhancements-v3.js?v=1' in html
assert 'Data &amp; Number Insights' in html
assert 'legal-footer-links' not in html
