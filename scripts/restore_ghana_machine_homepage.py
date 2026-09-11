from pathlib import Path
import re

script_path = Path('script.js')
html_path = Path('index.html')

script = script_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

old = '''    const machine =
        result.lottery === "ghana"
            ? []
            : parseJsonbBalls(
                result.machine
            );'''

new = '''    const machine =
        parseJsonbBalls(
            result.machine
        );'''

# Only change the homepage result card function.
home_start = script.find('function createHomeResultCard(')
home_end = script.find('// =========================================================\n// FALLBACK LATEST MODERN RESULT', home_start)
if home_start == -1 or home_end == -1:
    raise SystemExit('Homepage result card function not found')

segment = script[home_start:home_end]
if old not in segment:
    raise SystemExit('Ghana machine-number suppression was not found in homepage renderer')
segment = segment.replace(old, new, 1)
script = script[:home_start] + segment + script[home_end:]

# Cache bust script.js on the homepage.
html = re.sub(r'script\.js\?v=\d+', 'script.js?v=68', html, count=1)

script_path.write_text(script, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')

assert 'result.lottery === "ghana"\n            ? []' not in segment
