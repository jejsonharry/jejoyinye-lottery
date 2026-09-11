from pathlib import Path

path = Path('predictions.js')
text = path.read_text(encoding='utf-8')

replacements = []

replacements.append((
'''const MODERN_PREDICTION_ENGINE_LABEL = "Rolling 7-Day 60/30/10";''',
'''const MODERN_PREDICTION_ENGINE_LABEL = "Rolling 7-Day 60/30/10";
const MODERN_RANGE_PREDICTION_ENGINE_LABEL = "Custom Range 60/30/10";

// Refinement stays entirely inside the approved 60/30/10 method.
// The latest three draws of the SAME game lead the recency signal, while
// today's earlier games remain a smaller supporting context rather than
// growing stronger as more games are published through the day.
const MODERN_RECENT_SAME_GAME_BOOSTS = Object.freeze([1.45, 1.30, 1.15]);
const MODERN_TODAY_CONTEXT_BUDGET = Object.freeze({
    statisticalWinning: 1.20,
    statisticalMachine: 0.36,
    relationship: 0.90
});'''))

replacements.append((
'''    const signalResults = [
        ...todayResults.map(result => ({
            result,
            weight: 2.5
        })),
        ...contextResults.slice(0, 3).map((result, index) => ({
            result,
            weight: Math.max(0.75, 1.35 - (index * 0.20))
        })),
        ...results.slice(0, 5).map((result, index) => ({
            result,
            weight: Math.max(0.35, 1 - (index * 0.15))
        }))
    ];''',
'''    const sameGameSignals = results.slice(0, 5).map((result, index) => ({
        result,
        weight:
            MODERN_RECENT_SAME_GAME_BOOSTS[index]
            || Math.max(0.60, 0.90 - ((index - 3) * 0.15))
    }));

    const todaySignalWeight = todayResults.length
        ? MODERN_TODAY_CONTEXT_BUDGET.relationship / todayResults.length
        : 0;

    const contextSignalWeight = contextResults.length
        ? 0.45 / Math.min(contextResults.length, 3)
        : 0;

    const signalResults = [
        ...sameGameSignals,
        ...todayResults.map(result => ({
            result,
            weight: todaySignalWeight
        })),
        ...contextResults.slice(0, 3).map(result => ({
            result,
            weight: contextSignalWeight
        }))
    ];'''))

replacements.append((
'''            const recencyWeight =
                Math.max(
                    0.25,
                    1 -
                    (
                        index /
                        Math.max(
                            results.length,
                            1
                        )
                    ) *
                    0.75
                );''',
'''            const baseRecencyWeight =
                Math.max(
                    0.25,
                    1 -
                    (
                        index /
                        Math.max(
                            results.length,
                            1
                        )
                    ) *
                    0.75
                );

            const recencyWeight =
                baseRecencyWeight *
                (MODERN_RECENT_SAME_GAME_BOOSTS[index] || 1);'''))

replacements.append((
'''    // Same-day results carry extra recency weight because they reflect
    // the number activity immediately before the upcoming game.
    const todayWinningWeight = Math.min(
        3.5,
        Math.max(1.5, results.length * 0.04)
    );
    const todayMachineWeight = todayWinningWeight * 0.30;''',
'''    // Same-day games are supporting context. Their TOTAL budget is fixed,
    // so the signal cannot overpower same-game history later in the day or
    // when a long custom date range is selected.
    const todayWinningWeight = todayResults.length
        ? MODERN_TODAY_CONTEXT_BUDGET.statisticalWinning / todayResults.length
        : 0;
    const todayMachineWeight = todayResults.length
        ? MODERN_TODAY_CONTEXT_BUDGET.statisticalMachine / todayResults.length
        : 0;'''))

replacements.append((
'''    const selectedCandidates = useModernClassification
        ? selectBalancedModernCandidates(rankedNumbers)
        : rankedNumbers.slice(0, 5);''',
'''    // Strict method: the published five are the actual top five from the
    // final 60/30/10 weighted ranking. No post-score balancing replacement.
    const selectedCandidates = rankedNumbers.slice(0, 5);'''))

replacements.append((
'''            engineLabel: MODERN_PREDICTION_ENGINE_LABEL,''',
'''            engineLabel: customRangeActive
                ? MODERN_RANGE_PREDICTION_ENGINE_LABEL
                : MODERN_PREDICTION_ENGINE_LABEL,'''))

for old, new in replacements:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'Expected exactly one match, found {count}: {old[:80]!r}')
    text = text.replace(old, new, 1)

# Guardrails: keep the owner's approved weighting unchanged and make sure
# the inactive V2.2 archive remains disconnected from the live path.
assert 'statistical: 0.60' in text
assert 'classification: 0.30' in text
assert 'moving: 0.10' in text
assert 'const selectedCandidates = rankedNumbers.slice(0, 5);' in text
assert 'engineLabel: customRangeActive' in text
assert 'calculateCustomRangeV2Prediction(' in text  # archive retained only

path.write_text(text, encoding='utf-8')
