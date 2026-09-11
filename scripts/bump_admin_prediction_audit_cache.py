from pathlib import Path

path = Path('admin.html')
text = path.read_text(encoding='utf-8')
text = text.replace('admin-prediction-audit-v1.css?v=1', 'admin-prediction-audit-v1.css?v=2')
text = text.replace('admin-prediction-audit-v1.js?v=1', 'admin-prediction-audit-v1.js?v=2')
assert 'admin-prediction-audit-v1.css?v=2' in text
assert 'admin-prediction-audit-v1.js?v=2' in text
path.write_text(text, encoding='utf-8')
