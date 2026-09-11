from pathlib import Path

pred_path = Path('predictions.js')
html_path = Path('predictions.html')

pred = pred_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

# 1) Give the new engine enough same-game history for the 90-draw conversion feature.
old = 'shiftDateString(game.drawDate, -7)'
if old in pred:
    pred = pred.replace(old, 'shiftDateString(game.drawDate, -90)', 1)

# 2) Retire the public Modern labels from 60/30/10.
pred = pred.replace(
    '// MODERN BILLIONAIRE PREDICTION METHOD\n// 60% statistics + 30% classification + 10% moving numbers',
    '// LEGACY MODERN SCORER\n// Retained only as an inactive comparison/archive. Live Modern forecasts use Evidence Fusion v1.'
)
pred = pred.replace(
    'const MODERN_PREDICTION_ENGINE_LABEL = "Rolling 7-Day 60/30/10";',
    'const MODERN_PREDICTION_ENGINE_LABEL = "Evidence Fusion v1 • EF-F";'
)
pred = pred.replace(
    'const MODERN_RANGE_PREDICTION_ENGINE_LABEL = "Custom Range 60/30/10";',
    'const MODERN_RANGE_PREDICTION_ENGINE_LABEL = "Evidence Fusion v1 • Custom Range";'
)
pred = pred.replace(
    '// Refinement stays entirely inside the approved 60/30/10 method.\n// The latest three draws of the SAME game lead the recency signal, while\n// today\'s earlier games remain a smaller supporting context rather than\n// growing stronger as more games are published through the day.',
    '// Legacy R1 constants below are retained for historical comparison only.\n// They are no longer used by the active Modern Billionaire prediction path.'
)

# 3) Add the live adapter that connects predictions.js to the shared Evidence Fusion core.
marker = '// =========================================================\n// STRENGTH LABEL\n// ========================================================='
adapter = r'''
// =========================================================
// MODERN BILLIONAIRE — EVIDENCE FUSION v1 (ACTIVE)
// EF-F profile selected after chronological walk-forward validation.
// 45% recent same-game evidence
// 20% machine -> future-winning conversion
// 20% cross-confirmation (same-game + controlled same-day evidence)
// 10% classification support
// 5% moving-number support
// plus a small multi-signal evidence-breadth bonus.
// =========================================================

function calculateModernEvidenceFusionPrediction(
    history,
    todayResults = [],
    drawDate = "",
    rangeMode = false
) {
    const engine = globalThis.JolsModernEvidenceEngine;

    if (!engine || typeof engine.predict !== "function") {
        throw new Error("Modern Evidence Fusion engine core is unavailable");
    }

    return engine.predict({
        history,
        todayResults,
        drawDate,
        rangeMode,
        classificationChart: MODERN_CLASSIFICATION_CHART,
        movingGraph: MODERN_MOVING_GRAPH
    });
}

'''
if 'function calculateModernEvidenceFusionPrediction(' not in pred:
    if marker not in pred:
        raise SystemExit('Could not find prediction strength marker for engine adapter insertion')
    pred = pred.replace(marker, adapter + marker, 1)

# 4) Replace the active Modern call. The legacy scorer remains inactive for comparison/Ghana compatibility.
old_call = '''        const predictionData =
            calculateStatisticalPrediction(
                history,
                todayResults,
                true,
                MODERN_PREDICTION_WEIGHTS
            );'''
new_call = '''        const predictionData =
            calculateModernEvidenceFusionPrediction(
                history,
                todayResults,
                nextGame.drawDate,
                customRangeActive
            );'''
if old_call in pred:
    pred = pred.replace(old_call, new_call, 1)
elif 'calculateModernEvidenceFusionPrediction(' not in pred[pred.find('async function displayNextGamePrediction'):]:
    raise SystemExit('Active Modern prediction call was not found')

# 5) Update range/share language so no active user-facing text claims 60/30/10.
pred = pred.replace('Fixed 60/30/10 forecast', 'Evidence Fusion forecast')
pred = pred.replace('Previous 7 completed days plus today\'s earlier games', 'Recent same-game evidence, machine conversion and controlled same-day context')
pred = pred.replace('Fixed 60/30/10 range', 'Evidence Fusion range')
pred = pred.replace(
    'Using the previous 7 completed days plus today\'s earlier Modern games.',
    'Using recent same-game evidence, machine conversion and controlled same-day context.'
)

# 6) Make the analysis panel reflect the new evidence components while keeping existing DOM structure.
old_recent = '''                                    <div>\n\n                                        <span>\n                                            Recent Activity Score\n                                        </span>\n\n                                        <strong>\n                                            ${item.recentScore.toFixed(\n                                                1\n                                            )}\n                                        </strong>\n\n                                    </div>'''
new_recent = '''                                    <div>\n\n                                        <span>\n                                            Same-Game Evidence\n                                        </span>\n\n                                        <strong>\n                                            ${Number(item.sameGameScoreNormalized ?? item.recentScore ?? 0).toFixed(1)}\n                                        </strong>\n\n                                    </div>\n\n                                    <div>\n\n                                        <span>\n                                            Machine → Winning Conversion\n                                        </span>\n\n                                        <strong>\n                                            ${Number(item.machineConversionScoreNormalized ?? 0).toFixed(1)}\n                                        </strong>\n\n                                    </div>\n\n                                    <div>\n\n                                        <span>\n                                            Cross Confirmation\n                                        </span>\n\n                                        <strong>\n                                            ${Number(item.crossConfirmationScoreNormalized ?? 0).toFixed(1)}\n                                        </strong>\n\n                                    </div>'''
if old_recent in pred:
    pred = pred.replace(old_recent, new_recent, 1)

# 7) Load shared core before predictions.js and bump cache versions.
old_script = '''    <!-- PREDICTIONS ENGINE -->\n    <script\n        src="predictions.js?v=37"\n        defer\n    ></script>'''
new_script = '''    <!-- PREDICTIONS ENGINE -->\n    <script\n        src="modern-evidence-engine-core.js?v=1"\n        defer\n    ></script>\n    <script\n        src="predictions.js?v=38"\n        defer\n    ></script>'''
if old_script in html:
    html = html.replace(old_script, new_script, 1)
elif 'modern-evidence-engine-core.js' not in html:
    raise SystemExit('Predictions script block not found')

pred_path.write_text(pred, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
print('Installed Modern Evidence Fusion v1 into public prediction path.')
