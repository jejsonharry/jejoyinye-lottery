from pathlib import Path
import re

html_path = Path("index.html")
js_path = Path("script.js")

html = html_path.read_text(encoding="utf-8")
js = js_path.read_text(encoding="utf-8")

# ---------------------------------------------------------
# Load the dedicated premium homepage stylesheet last.
# ---------------------------------------------------------
if 'homepage-premium-v2.css' not in html:
    marker = '<link rel="stylesheet" href="result-conversion.css?v=1">'
    if marker not in html:
        raise SystemExit("Homepage stylesheet insertion point not found")
    html = html.replace(
        marker,
        marker + '\n    <link rel="stylesheet" href="homepage-premium-v2.css?v=1">',
        1,
    )

# ---------------------------------------------------------
# Hero: make the message clearer, shorter and more useful.
# ---------------------------------------------------------
html = re.sub(
    r'<span class="hero-badge">\s*Daily Lottery Updates\s*</span>',
    '<span class="hero-badge">LIVE RESULTS • DATA INSIGHTS</span>',
    html,
    count=1,
    flags=re.S,
)

html = re.sub(
    r'<h2>\s*Your Premium Destination\s*For Lottery Results & Insights\s*</h2>',
    '<h2>Daily Lottery Results. Smarter Insights. More Opportunities.</h2>',
    html,
    count=1,
    flags=re.S,
)

html = re.sub(
    r'<p>\s*Get fast daily lottery results,\s*statistical analysis, number trends\s*and opportunities to join our\s*growing agent network\.\s*</p>',
    '<p>Follow Modern Billionaire and Ghana winning results, explore historical number trends, and access agent and online-play resources from one platform.</p>',
    html,
    count=1,
    flags=re.S,
)

# ---------------------------------------------------------
# Result and platform copy: Ghana publishes winning numbers
# only, so avoid implying machine numbers always exist.
# ---------------------------------------------------------
html = re.sub(
    r'<p>\s*Check the latest winning and\s*machine numbers published\s*on the platform\.\s*</p>',
    '<p>See the latest published winning numbers, with machine numbers displayed where applicable.</p>',
    html,
    count=1,
    flags=re.S,
)

html = re.sub(
    r'<h2>\s*Everything You Need\s*In One Place\s*</h2>',
    '<h2>Results, Insights &amp; Agent Access</h2>',
    html,
    count=1,
    flags=re.S,
)

html = re.sub(
    r'<p>\s*Explore lottery results,\s*statistical insights and\s*opportunities to become\s*part of our agent network\.\s*</p>',
    '<p>Move quickly between published results, number insights and agent opportunities from one focused platform.</p>',
    html,
    count=1,
    flags=re.S,
)

html = re.sub(
    r'<p>\s*Access Modern Billionaire\s*and Ghana results with\s*winning and machine numbers\.\s*</p>',
    '<p>Access Modern Billionaire and Ghana winning results, with machine numbers shown where they are officially provided.</p>',
    html,
    count=1,
    flags=re.S,
)

# Bump script cache so the Ghana-machine fix reaches browsers promptly.
html = re.sub(r'script\.js\?v=\d+', 'script.js?v=67', html, count=1)

# ---------------------------------------------------------
# Ghana does not publish machine numbers.
# Apply that rule to both full result cards and homepage cards,
# even when an older row in the database happens to contain them.
# ---------------------------------------------------------
def suppress_ghana_machine(source: str, function_name: str) -> str:
    start = source.find(f"function {function_name}(")
    if start == -1:
        raise SystemExit(f"{function_name} not found")

    next_separator = source.find("// =========================================================", start + 20)
    if next_separator == -1:
        next_separator = len(source)

    block = source[start:next_separator]
    old = '''    const machine =\n        parseJsonbBalls(\n            result.machine\n        );'''
    new = '''    const machine =\n        result.lottery === "ghana"\n            ? []\n            : parseJsonbBalls(\n                result.machine\n            );'''

    if old not in block:
        if 'result.lottery === "ghana"' in block:
            return source
        raise SystemExit(f"Machine-number declaration not found in {function_name}")

    block = block.replace(old, new, 1)
    return source[:start] + block + source[next_separator:]

js = suppress_ghana_machine(js, "createResultCard")
js = suppress_ghana_machine(js, "createHomeResultCard")

html_path.write_text(html, encoding="utf-8")
js_path.write_text(js, encoding="utf-8")

# ---------------------------------------------------------
# Validation
# ---------------------------------------------------------
assert 'homepage-premium-v2.css?v=1' in html
assert 'Daily Lottery Results. Smarter Insights. More Opportunities.' in html
assert 'Results, Insights &amp; Agent Access' in html
assert 'script.js?v=67' in html
assert js.count('result.lottery === "ghana"') >= 2
