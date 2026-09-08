import { readFile } from "node:fs/promises";

const SUPABASE_URL = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_KEY = String(
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
).trim();

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required.");
}

const MODERN = [
    ["Powerball", 540, 535, "9:00 AM"],
    ["Awoof", 660, 655, "11:00 AM"],
    ["Biggest Bet", 780, 775, "1:00 PM"],
    ["Gold Rush", 900, 895, "3:00 PM"],
    ["Lucky Dollar", 1020, 1015, "5:00 PM"],
    ["Blessing", 1080, 1075, "6:00 PM"],
    ["Owo Time", 1140, 1135, "7:00 PM"],
    ["Modern Bingo", 1200, 1195, "8:00 PM"],
    ["Bonus Cash", 1260, 1255, "9:00 PM"],
    ["Hero", 1320, 1315, "10:00 PM"],
    ["Golden", 1380, 1375, "11:00 PM"],
    ["Queen", 1440, 1435, "12:00 AM"]
].map(([game, drawMinutes, closeMinutes, drawTime]) => ({
    lottery: "modern-billionaire", game, drawMinutes, closeMinutes, drawTime
}));

const GHANA = {
    0: ["ASEDA", 1150, "7:10 PM"],
    1: ["Monday Special", 1270, "9:10 PM"],
    2: ["Lucky Tuesday", 1270, "9:10 PM"],
    3: ["Mid Week", 1270, "9:10 PM"],
    4: ["Thursday Fortune", 1270, "9:10 PM"],
    5: ["Friday Bonanza", 1270, "9:10 PM"],
    6: ["National", 1270, "9:10 PM"]
};

const PROFILES = [
    { name: "balanced", frequency: .24, recency: .22, transition: .15, machine: .08, gap: .06, classification: .18, moving: .07 },
    { name: "recent", frequency: .16, recency: .34, transition: .14, machine: .08, gap: .04, classification: .17, moving: .07 },
    { name: "frequency", frequency: .38, recency: .16, transition: .10, machine: .08, gap: .04, classification: .17, moving: .07 },
    { name: "relationship", frequency: .16, recency: .16, transition: .20, machine: .07, gap: .04, classification: .27, moving: .10 }
];

function templateConstant(source, name) {
    const marker = `const ${name} = \``;
    const start = source.indexOf(marker);
    if (start < 0) return "";
    const valueStart = start + marker.length;
    const valueEnd = source.indexOf("`;", valueStart);
    return valueEnd < 0 ? "" : source.slice(valueStart, valueEnd);
}

async function loadChartRelationships() {
    const source = await readFile(new URL("../predictions.js", import.meta.url), "utf8");
    const classification = {};
    templateConstant(source, "MODERN_CLASSIFICATION_ROWS")
        .trim().split(/\n+/).filter(Boolean).forEach(line => {
            const values = line.trim().split(/\s+/).map(Number);
            const number = values.shift();
            classification[number] = values.filter(target => target >= 1 && target <= 90);
        });

    const movingSets = Object.fromEntries(
        Array.from({ length: 90 }, (_, index) => [index + 1, new Set()])
    );
    templateConstant(source, "MODERN_MOVING_ROWS")
        .trim().split(/\n+/).filter(Boolean).forEach(line => {
            line.split(";").forEach(entry => {
                const [sourceText, targetsText = ""] = entry.split(":");
                const sourceNumber = Number(sourceText);
                targetsText.split(",").map(Number).forEach(target => {
                    if (sourceNumber >= 1 && sourceNumber <= 90 && target >= 1 && target <= 90 && sourceNumber !== target) {
                        movingSets[sourceNumber].add(target);
                        movingSets[target].add(sourceNumber);
                    }
                });
            });
        });

    return {
        classification,
        moving: Object.fromEntries(
            Object.entries(movingSets).map(([number, values]) => [number, [...values]])
        )
    };
}

const CHART_RELATIONSHIPS = await loadChartRelationships();

function lagosNow() {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit",
        weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
    const weekdays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
        date: `${value.year}-${value.month}-${value.day}`,
        weekday: weekdays[value.weekday],
        minutes: Number(value.hour) * 60 + Number(value.minute)
    };
}

function headers(extra = {}) {
    const result = { apikey: SUPABASE_KEY, "Content-Type": "application/json", ...extra };
    if (SUPABASE_KEY.startsWith("eyJ")) result.Authorization = `Bearer ${SUPABASE_KEY}`;
    return result;
}

async function request(path, options = {}) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        ...options, headers: headers(options.headers)
    });
    if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

function numbers(value) {
    if (Array.isArray(value)) return value.map(Number).filter(n => n >= 1 && n <= 90);
    if (typeof value === "string") {
        try { return numbers(JSON.parse(value)); } catch { return (value.match(/\d+/g) || []).map(Number); }
    }
    return [];
}

function normalize(rows, key) {
    const max = Math.max(0, ...rows.map(row => row[key]));
    rows.forEach(row => { row[key] = max ? row[key] * 100 / max : 0; });
}

function rank(history, context, profile) {
    const rows = Array.from({ length: 90 }, (_, index) => ({
        number: index + 1, frequency: 0, recency: 0, transition: 0, machine: 0, gap: 0,
        classification: 0, moving: 0
    }));
    const byNumber = Object.fromEntries(rows.map(row => [row.number, row]));
    const recentSignals = [...context, ...history.slice(0, 3)];
    const signalNumbers = recentSignals.flatMap(item => numbers(item.winning));
    const pairCounts = new Map();

    history.slice(0, 120).forEach((draw, index) => {
        const decay = Math.exp(-index / 24);
        const winning = numbers(draw.winning);
        winning.forEach(number => {
            byNumber[number].frequency += 1;
            byNumber[number].recency += decay;
        });
        numbers(draw.machine).forEach(number => { byNumber[number].machine += decay; });
        for (const source of winning) for (const target of winning) {
            if (source !== target) pairCounts.set(`${source}:${target}`, (pairCounts.get(`${source}:${target}`) || 0) + decay);
        }
    });

    rows.forEach(row => {
        const lastIndex = history.findIndex(draw => numbers(draw.winning).includes(row.number));
        row.gap = Math.min(lastIndex < 0 ? history.length : lastIndex, 30);
        row.transition = signalNumbers.reduce(
            (sum, source) => sum + (pairCounts.get(`${source}:${row.number}`) || 0), 0
        );
    });
    signalNumbers.forEach(source => {
        (CHART_RELATIONSHIPS.classification[source] || []).forEach(target => {
            byNumber[target].classification += 1;
        });
        (CHART_RELATIONSHIPS.moving[source] || []).forEach(target => {
            byNumber[target].moving += 1;
        });
    });

    context.forEach((draw, index) => {
        const boost = Math.max(.8, 2.2 - index * .25);
        numbers(draw.winning).forEach(number => { byNumber[number].recency += boost; });
        numbers(draw.machine).forEach(number => { byNumber[number].machine += boost * .35; });
    });

    for (const key of ["frequency", "recency", "transition", "machine", "gap", "classification", "moving"]) normalize(rows, key);
    rows.forEach(row => {
        row.totalScore = Object.entries(profile)
            .filter(([key]) => key !== "name")
            .reduce((sum, [key, weight]) => sum + row[key] * weight, 0);
    });
    return rows.sort((a, b) => b.totalScore - a.totalScore || a.number - b.number);
}

function backtest(history, profile) {
    const chronological = [...history].reverse();
    const start = Math.max(30, chronological.length - 60);
    let draws = 0, hits = 0, sureHits = 0, anyHitDraws = 0;
    for (let index = start; index < chronological.length; index += 1) {
        const training = chronological.slice(0, index).reverse();
        const predicted = rank(training, [], profile).slice(0, 5).map(row => row.number);
        const sure = predicted.slice(0, 2);
        const actual = numbers(chronological[index].winning);
        const drawHits = predicted.filter(number => actual.includes(number)).length;
        hits += drawHits;
        sureHits += sure.filter(number => actual.includes(number)).length;
        anyHitDraws += drawHits > 0 ? 1 : 0;
        draws += 1;
    }
    return {
        ...profile, draws, hits, sureHits, anyHitDraws,
        score: draws ? (hits + sureHits * .5 + anyHitDraws * .2) / draws : 0,
        hitRate: draws ? hits / (draws * 5) : 0
    };
}

async function fetchHistory(lottery, game, drawDate) {
    const query = new URLSearchParams({
        select: "game,lottery,draw_date,winning,machine",
        lottery: `eq.${lottery}`, game: `ilike.${game}`, draw_date: `lt.${drawDate}`,
        order: "draw_date.desc", limit: "500"
    });
    return await request(`results?${query}`) || [];
}

async function fetchContext(drawDate, beforeMinutes) {
    const eligible = MODERN.filter(game => game.drawMinutes < beforeMinutes).map(game => game.game);
    if (!eligible.length) return [];
    const query = new URLSearchParams({
        select: "game,lottery,draw_date,winning,machine",
        lottery: "eq.modern-billionaire", draw_date: `eq.${drawDate}`,
        game: `in.(${eligible.map(game => `\"${game}\"`).join(",")})`, order: "id.desc"
    });
    return await request(`results?${query}`) || [];
}

function gamesToSnapshot(now) {
    const games = [];
    MODERN.forEach((game, index) => {
        const windowStart = index === 0 ? 0 : MODERN[index - 1].drawMinutes + 1;
        if (now.minutes >= windowStart && now.minutes < game.closeMinutes) games.push(game);
    });
    const ghana = GHANA[now.weekday];
    if (ghana) {
        const [game, drawMinutes, drawTime] = ghana;
        const windowStart = drawMinutes < 1200 ? 1081 : 1201;
        if (now.minutes >= windowStart && now.minutes < drawMinutes - 5) {
            games.push({ lottery: "ghana", game, drawMinutes, closeMinutes: drawMinutes - 5, drawTime });
        }
    }
    return games;
}

async function createSnapshot(game, now) {
    const history = await fetchHistory(game.lottery, game.game, now.date);
    if (history.length < 30) {
        console.log(`${game.game}: skipped; only ${history.length} historical draws.`);
        return;
    }
    const context = game.lottery === "modern-billionaire" || game.drawMinutes > 1200
        ? await fetchContext(now.date, game.drawMinutes) : [];
    const tests = PROFILES.map(profile => backtest(history, profile));
    tests.sort((a, b) => b.score - a.score || b.draws - a.draws);
    const selected = tests[0];
    const ranked = rank(history, context, selected);
    const top = ranked.slice(0, 5);
    const payload = {
        lottery: game.lottery, game: game.game, draw_date: now.date, draw_time: game.drawTime,
        engine_version: "v2.1", engine_profile: selected.name,
        range_from: history.at(-1)?.draw_date || null, range_to: history[0]?.draw_date || null,
        sure_numbers: top.slice(0, 2).map(row => row.number),
        direct_numbers: top.slice(2).map(row => row.number),
        all_numbers: top.map(row => row.number),
        score_details: top.map(row => ({
            number: row.number, totalScore: Number(row.totalScore.toFixed(3)),
            frequency: Number(row.frequency.toFixed(3)), recency: Number(row.recency.toFixed(3)),
            transition: Number(row.transition.toFixed(3)), machine: Number(row.machine.toFixed(3)),
            gap: Number(row.gap.toFixed(3)), classification: Number(row.classification.toFixed(3)),
            moving: Number(row.moving.toFixed(3))
        })),
        weights: Object.fromEntries(Object.entries(selected).filter(([key]) =>
            ["frequency", "recency", "transition", "machine", "gap", "classification", "moving"].includes(key))),
        historical_draws: history.length, backtest_draws: selected.draws,
        backtest_score: Number(selected.score.toFixed(4)),
        backtest_hit_rate: Number(selected.hitRate.toFixed(4))
    };
    const query = new URLSearchParams({ on_conflict: "lottery,game,draw_date" });
    await request(`prediction_snapshots?${query}`, {
        method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
        body: JSON.stringify(payload)
    });
    console.log(`${game.game}: V2.1 snapshot ready (${selected.name}, ${selected.draws} backtest draws).`);
}

const now = lagosNow();
const games = gamesToSnapshot(now);
if (!games.length) console.log("No prediction snapshot window is currently open.");
for (const game of games) await createSnapshot(game, now);
