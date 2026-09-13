(function (root) {
    "use strict";

    const PROFILE = Object.freeze({
        id: "evidence-fusion-v1.2-ef-r",
        label: "Evidence Fusion v1.2",
        weights: Object.freeze({
            sameGame: 0.40,
            machineConversion: 0.15,
            crossConfirmation: 0.10,
            classification: 0.10,
            moving: 0.10,
            reentry: 0.15
        }),
        breadthBonus: 2,
        conversionHorizonDraws: 3,
        conversionPriorStrength: 6,
        defaultHistoryDays: 90,
        recentSameGameDays: 7,
        recentRelationshipDraws: 5,
        reentryHistoryDraws: 90,
        reentryGapCap: 12
    });

    function parseNumbers(value) {
        if (Array.isArray(value)) {
            return value
                .map(Number)
                .filter(number => Number.isInteger(number) && number >= 1 && number <= 90);
        }

        if (typeof value === "string") {
            return (value.match(/\b\d{1,2}\b/g) || [])
                .map(Number)
                .filter(number => number >= 1 && number <= 90);
        }

        return [];
    }

    function shiftDate(value, days) {
        const [year, month, day] = String(value || "")
            .split("-")
            .map(Number);

        if (![year, month, day].every(Number.isFinite)) {
            return "";
        }

        const date = new Date(Date.UTC(year, month - 1, day));
        date.setUTCDate(date.getUTCDate() + days);

        return (
            `${date.getUTCFullYear()}-` +
            `${String(date.getUTCMonth() + 1).padStart(2, "0")}-` +
            `${String(date.getUTCDate()).padStart(2, "0")}`
        );
    }

    function normalizeRows(rows, sourceProperty, targetProperty) {
        const maximum = Math.max(
            0,
            ...rows.map(row => Number(row[sourceProperty] || 0))
        );

        rows.forEach(row => {
            row[targetProperty] = maximum > 0
                ? (Number(row[sourceProperty] || 0) / maximum) * 100
                : 0;
        });
    }

    function canonicalizeHistory(history) {
        const grouped = new Map();

        (Array.isArray(history) ? history : []).forEach(result => {
            const drawDate = String(result?.draw_date || "").slice(0, 10);
            if (!drawDate) return;

            if (!grouped.has(drawDate)) grouped.set(drawDate, []);

            grouped.get(drawDate).push({
                ...result,
                draw_date: drawDate,
                winning: parseNumbers(result.winning),
                machine: parseNumbers(result.machine)
            });
        });

        const clean = [];
        let ambiguousDatesExcluded = 0;

        grouped.forEach(group => {
            const variants = new Map();
            group.forEach(result => {
                const signature = JSON.stringify([result.winning, result.machine]);
                if (!variants.has(signature)) variants.set(signature, result);
            });

            if (variants.size > 1) {
                ambiguousDatesExcluded += 1;
                return;
            }

            clean.push([...variants.values()][0]);
        });

        clean.sort((left, right) =>
            String(right.draw_date).localeCompare(String(left.draw_date))
        );

        return { rows: clean, ambiguousDatesExcluded };
    }

    function buildRelationshipScores(recentHistory, todayResults, classificationChart, movingGraph) {
        const rows = Array.from({ length: 90 }, (_, index) => ({
            number: index + 1,
            classificationRaw: 0,
            movingRaw: 0
        }));
        const byNumber = Object.fromEntries(rows.map(row => [row.number, row]));

        function add(sourceNumber, weight) {
            const classification = classificationChart?.[sourceNumber];
            if (classification) {
                new Set(Object.values(classification)).forEach(target => {
                    const targetNumber = Number(target);
                    if (byNumber[targetNumber]) byNumber[targetNumber].classificationRaw += weight;
                });
            }

            new Set(movingGraph?.[sourceNumber] || []).forEach(target => {
                const targetNumber = Number(target);
                if (byNumber[targetNumber]) byNumber[targetNumber].movingRaw += weight;
            });
        }

        const relationshipBoosts = [1.45, 1.30, 1.15, 0.90, 0.75];
        recentHistory.slice(0, PROFILE.recentRelationshipDraws).forEach((result, index) => {
            const weight = relationshipBoosts[index] || 0.60;
            parseNumbers(result.winning).forEach(number => add(number, weight));
            parseNumbers(result.machine).forEach(number => add(number, weight * 0.45));
        });

        const contextWeight = todayResults.length ? 0.90 / todayResults.length : 0;
        todayResults.forEach(result => {
            parseNumbers(result.winning).forEach(number => add(number, contextWeight));
            parseNumbers(result.machine).forEach(number => add(number, contextWeight * 0.45));
        });

        normalizeRows(rows, "classificationRaw", "classification");
        normalizeRows(rows, "movingRaw", "moving");
        return Object.fromEntries(rows.map(row => [row.number, row]));
    }

    function buildMachineConversionRates(chronologicalHistory) {
        const baselineProbability = 1 - Math.pow(85 / 90, PROFILE.conversionHorizonDraws);
        const priorStrength = PROFILE.conversionPriorStrength;
        const output = {};

        for (let number = 1; number <= 90; number++) {
            let opportunities = 0;
            let conversions = 0;

            for (let index = 0; index < chronologicalHistory.length - 1; index++) {
                const source = chronologicalHistory[index];
                if (!parseNumbers(source.machine).includes(number)) continue;

                opportunities += 1;
                let converted = false;
                for (
                    let futureIndex = index + 1;
                    futureIndex <= Math.min(index + PROFILE.conversionHorizonDraws, chronologicalHistory.length - 1);
                    futureIndex++
                ) {
                    if (parseNumbers(chronologicalHistory[futureIndex].winning).includes(number)) {
                        converted = true;
                        break;
                    }
                }
                if (converted) conversions += 1;
            }

            output[number] = {
                rate: (conversions + priorStrength * baselineProbability) / (opportunities + priorStrength),
                opportunities,
                conversions
            };
        }

        return output;
    }

    function buildReentryRaw(number, orderedHistory, recentHistory) {
        const recentSeen = recentHistory.some(result =>
            parseNumbers(result.winning).includes(number) || parseNumbers(result.machine).includes(number)
        );
        if (recentSeen) return 0;

        const historyWindow = orderedHistory.slice(0, PROFILE.reentryHistoryDraws);
        let olderWins = 0;
        let olderMachines = 0;
        let gapDraws = historyWindow.length;
        let found = false;

        for (let index = 0; index < historyWindow.length; index++) {
            const result = historyWindow[index];
            const inWinning = parseNumbers(result.winning).includes(number);
            const inMachine = parseNumbers(result.machine).includes(number);

            if (inWinning) olderWins += 1;
            if (inMachine) olderMachines += 1;
            if (!found && (inWinning || inMachine)) {
                gapDraws = index + 1;
                found = true;
            }
        }

        if (!found || (olderWins + olderMachines) === 0) return 0;

        const gapFactor = Math.min(gapDraws, PROFILE.reentryGapCap) / PROFILE.reentryGapCap;
        const historyStrength = Math.log1p((2.2 * olderWins) + (0.7 * olderMachines));
        return gapFactor * historyStrength;
    }

    function predict(options = {}) {
        const {
            history = [],
            todayResults = [],
            drawDate = "",
            classificationChart = {},
            movingGraph = {},
            rangeMode = false
        } = options;

        const canonical = canonicalizeHistory(history);
        const orderedHistory = canonical.rows;

        const recentCutoff = drawDate ? shiftDate(drawDate, -PROFILE.recentSameGameDays) : "";
        const recentHistory = rangeMode || !recentCutoff
            ? orderedHistory.slice(0, 7)
            : orderedHistory.filter(result =>
                result.draw_date >= recentCutoff && result.draw_date < drawDate
            );

        const conversionHistory = orderedHistory.slice(0, 90).slice().reverse();
        const conversionRates = buildMachineConversionRates(conversionHistory);
        const relationshipByNumber = buildRelationshipScores(
            recentHistory,
            todayResults,
            classificationChart,
            movingGraph
        );

        const uniqueTodayNumbers = new Set(
            todayResults.flatMap(result => [
                ...parseNumbers(result.winning),
                ...parseNumbers(result.machine)
            ])
        ).size;

        const sameDayCoverageFactor = Math.max(0.25, 1 - (0.80 * (uniqueTodayNumbers / 90)));
        const rows = [];

        for (let number = 1; number <= 90; number++) {
            let winningRecency = 0;
            let machineRecency = 0;
            let winningFrequency = 0;
            let machineFrequency = 0;
            let recentMachineSignal = 0;

            recentHistory.forEach((result, index) => {
                const decay = Math.exp(-0.38 * index);
                const winning = parseNumbers(result.winning);
                const machine = parseNumbers(result.machine);

                if (winning.includes(number)) {
                    winningRecency += decay;
                    winningFrequency += 1;
                }
                if (machine.includes(number)) {
                    machineRecency += decay;
                    machineFrequency += 1;
                    if (index < 3) recentMachineSignal += decay;
                }
            });

            const sameGameRaw =
                (3.0 * Math.log1p(2 * winningRecency)) +
                (0.95 * Math.log1p(2 * machineRecency)) +
                (0.55 * Math.log1p(winningFrequency)) +
                (0.20 * Math.log1p(machineFrequency));

            let sameDayRaw = 0;
            let todayFrequency = 0;
            todayResults.forEach(result => {
                if (parseNumbers(result.winning).includes(number)) {
                    sameDayRaw += 1;
                    todayFrequency += 1;
                }
                if (parseNumbers(result.machine).includes(number)) {
                    sameDayRaw += 0.35;
                    todayFrequency += 0.35;
                }
            });
            sameDayRaw = (sameDayRaw / Math.max(1, todayResults.length)) * sameDayCoverageFactor;

            const conversion = conversionRates[number];
            const machineConversionRaw = recentMachineSignal * conversion.rate;
            const relationship = relationshipByNumber[number] || {};
            const reentryRaw = buildReentryRaw(number, orderedHistory, recentHistory);

            rows.push({
                number,
                winningFrequency,
                machineFrequency,
                todayFrequency,
                recentScore: sameGameRaw,
                sameGameRaw,
                sameDayRaw,
                machineConversionRaw,
                reentryRaw,
                conversionRate: conversion.rate,
                conversionOpportunities: conversion.opportunities,
                conversionHits: conversion.conversions,
                classificationScoreNormalized: Number(relationship.classification || 0),
                movingScoreNormalized: Number(relationship.moving || 0),
                totalScore: 0
            });
        }

        normalizeRows(rows, "sameGameRaw", "sameGameScoreNormalized");
        normalizeRows(rows, "sameDayRaw", "sameDayScoreNormalized");
        normalizeRows(rows, "machineConversionRaw", "machineConversionScoreNormalized");
        normalizeRows(rows, "reentryRaw", "reentryScoreNormalized");

        rows.forEach(row => {
            row.crossConfirmationScoreNormalized = Math.sqrt(
                row.sameGameScoreNormalized * row.sameDayScoreNormalized
            );

            row.evidenceBreadth = [
                row.sameGameScoreNormalized >= 45,
                row.machineConversionScoreNormalized >= 40,
                row.crossConfirmationScoreNormalized >= 35,
                row.classificationScoreNormalized >= 45,
                row.movingScoreNormalized >= 45,
                row.reentryScoreNormalized >= 45
            ].filter(Boolean).length;

            row.statisticalScoreNormalized = row.sameGameScoreNormalized;
            row.totalScore =
                (row.sameGameScoreNormalized * PROFILE.weights.sameGame) +
                (row.machineConversionScoreNormalized * PROFILE.weights.machineConversion) +
                (row.crossConfirmationScoreNormalized * PROFILE.weights.crossConfirmation) +
                (row.classificationScoreNormalized * PROFILE.weights.classification) +
                (row.movingScoreNormalized * PROFILE.weights.moving) +
                (row.reentryScoreNormalized * PROFILE.weights.reentry) +
                (row.evidenceBreadth * PROFILE.breadthBonus);
        });

        rows.sort((left, right) =>
            right.totalScore !== left.totalScore
                ? right.totalScore - left.totalScore
                : left.number - right.number
        );

        const selected = rows.slice(0, 5);
        const scoreMap = Object.fromEntries(rows.map(row => [row.number, row]));

        return {
            profile: PROFILE,
            predictedNumbers: selected.map(row => row.number).sort((left, right) => left - right),
            rankedData: rows,
            scoreMap,
            diagnostics: {
                recentHistoryDraws: recentHistory.length,
                conversionHistoryDraws: conversionHistory.length,
                todayContextDraws: todayResults.length,
                uniqueTodayNumbers,
                sameDayCoverageFactor,
                ambiguousDatesExcluded: canonical.ambiguousDatesExcluded
            }
        };
    }

    root.JolsModernEvidenceEngine = Object.freeze({ PROFILE, predict, parseNumbers });
})(typeof globalThis !== "undefined" ? globalThis : window);
