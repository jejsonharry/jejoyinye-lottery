"use strict";

const MODERN_RESULTS_API =
    "https://api.modernlotterynigeria.com/9999/third/gameissue/getIssues";

const LOTTERY = "modern-billionaire";

const GAME_BY_MERCHANT_ID = Object.freeze({
    "21": "Powerball",
    "22": "Awoof",
    "23": "Biggest Bet",
    "24": "Gold Rush",
    "25": "Lucky Dollar",
    "31": "Blessing",
    "32": "Owo Time",
    "26": "Modern Bingo",
    "27": "Bonus Cash",
    "28": "Hero",
    "29": "Golden",
    "30": "Queen"
});

// Older official records used merchantId 2 for every Modern Billionaire game.
// Their published spin time is stable and identifies the individual game.
const GAME_BY_SPIN_TIME = Object.freeze({
    "09:00:00": "Powerball",
    "11:00:00": "Awoof",
    "13:00:00": "Biggest Bet",
    "15:00:00": "Gold Rush",
    "17:00:00": "Lucky Dollar",
    "18:00:00": "Blessing",
    "19:00:00": "Owo Time",
    "20:00:00": "Modern Bingo",
    "21:00:00": "Bonus Cash",
    "22:00:00": "Hero",
    "23:00:00": "Golden",
    "23:59:59": "Queen",
    "00:00:00": "Queen"
});

const SUPABASE_URL = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_SECRET_KEY = String(
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ""
).trim();
const START_DATE = String(process.env.START_DATE || "").trim();
const END_DATE = String(process.env.END_DATE || "").trim();
const LOOKBACK_DAYS = Math.max(0, Number(process.env.LOOKBACK_DAYS || 1));
const IMPORT_CONCURRENCY = Math.min(
    4,
    Math.max(1, Number(process.env.IMPORT_CONCURRENCY || 2))
);
const MAX_RANGE_DAYS = 400;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw new Error(
        "SUPABASE_URL and a SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY) must be configured as GitHub Actions secrets."
    );
}

function isoDateInLagos(date = new Date()) {
    // Nigeria stays on UTC+1 throughout the year.
    return new Date(date.getTime() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
}

function addDays(isoDate, days) {
    const date = new Date(`${isoDate}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}

function isIsoDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function buildDateRange() {
    const today = isoDateInLagos();
    const start = START_DATE || addDays(today, -LOOKBACK_DAYS);
    const end = END_DATE || today;

    if (!isIsoDate(start) || !isIsoDate(end)) {
        throw new Error("START_DATE and END_DATE must use YYYY-MM-DD format.");
    }

    if (start > end) {
        throw new Error("START_DATE cannot be later than END_DATE.");
    }

    const dates = [];
    for (let date = start; date <= end; date = addDays(date, 1)) {
        dates.push(date);
        if (dates.length > MAX_RANGE_DAYS) {
            throw new Error(
                `A single run is limited to ${MAX_RANGE_DAYS} days. Run historical imports one year at a time.`
            );
        }
    }

    return dates;
}

function parseNumbers(value) {
    const numbers = String(value || "")
        .split(/[^0-9]+/)
        .filter(Boolean)
        .map(Number);

    if (
        numbers.length !== 5 ||
        numbers.some(number => !Number.isInteger(number) || number < 1 || number > 90) ||
        new Set(numbers).size !== numbers.length
    ) {
        return [];
    }

    return numbers;
}

function gameForRecord(record) {
    const currentGame = GAME_BY_MERCHANT_ID[String(record?.merchantId)];
    if (currentGame) return currentGame;

    const spinTime = String(record?.spinTime || "");
    const time = spinTime.match(/(\d{2}:\d{2}:\d{2})$/)?.[1] || "";
    return GAME_BY_SPIN_TIME[time] || "";
}

function sameNumbers(left, right) {
    const normalise = value => {
        if (Array.isArray(value)) return value.map(Number);
        if (typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) return parsed.map(Number);
            } catch {
                return parseNumbers(value);
            }
        }
        return [];
    };

    return JSON.stringify(normalise(left)) === JSON.stringify(normalise(right));
}

async function fetchWithRetry(url, options = {}, attempts = 3) {
    let lastError;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(30000)
            });

            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }

            return response;
        } catch (error) {
            lastError = error;
            if (attempt < attempts) {
                await new Promise(resolve => setTimeout(resolve, attempt * 1500));
            }
        }
    }

    throw lastError;
}

async function fetchOfficialResults(drawDate) {
    const query = new URLSearchParams({
        issueDate: drawDate,
        current: "1",
        size: "20",
        merchantId: "21"
    });

    const response = await fetchWithRetry(`${MODERN_RESULTS_API}?${query}`, {
        headers: {
            Authorization: "Bearer",
            Accept: "application/json"
        }
    });
    const payload = await response.json();

    if (payload?.code !== 0 || !Array.isArray(payload?.data?.records)) {
        throw new Error(payload?.msg || `Unexpected official API response for ${drawDate}`);
    }

    return payload.data.records
        .filter(record => record?.statusFlag === "F" && record?.result)
        .map(record => ({
            lottery: LOTTERY,
            game: gameForRecord(record),
            draw_date: String(record.issueDate || drawDate).slice(0, 10),
            winning: parseNumbers(record.result),
            machine: parseNumbers(record.mach)
        }))
        .filter(record => record.game && record.winning.length === 5 && record.machine.length === 5);
}

function supabaseHeaders(extra = {}) {
    const headers = {
        apikey: SUPABASE_SECRET_KEY,
        "Content-Type": "application/json",
        ...extra
    };

    // Legacy service-role JWTs use Authorization. New sb_secret keys use apikey.
    if (SUPABASE_SECRET_KEY.startsWith("eyJ")) {
        headers.Authorization = `Bearer ${SUPABASE_SECRET_KEY}`;
    }

    return headers;
}

function resultFilter(record) {
    const params = new URLSearchParams({
        lottery: `eq.${record.lottery}`,
        game: `eq.${record.game}`,
        draw_date: `eq.${record.draw_date}`
    });
    return params.toString();
}

async function findExistingResults(drawDate) {
    const params = new URLSearchParams({
        lottery: `eq.${LOTTERY}`,
        draw_date: `eq.${drawDate}`
    });
    const response = await fetchWithRetry(
        `${SUPABASE_URL}/rest/v1/results?${params}&select=game,winning,machine`,
        { headers: supabaseHeaders() }
    );
    const rows = await response.json();
    return new Map(
        (Array.isArray(rows) ? rows : []).map(row => [String(row.game || ""), row])
    );
}

async function saveResult(record, existing) {
    if (
        existing &&
        sameNumbers(existing.winning, record.winning) &&
        sameNumbers(existing.machine, record.machine)
    ) {
        return "skipped";
    }

    const path = existing
        ? `${SUPABASE_URL}/rest/v1/results?${resultFilter(record)}`
        : `${SUPABASE_URL}/rest/v1/results`;

    await fetchWithRetry(path, {
        method: existing ? "PATCH" : "POST",
        headers: supabaseHeaders({ Prefer: "return=minimal" }),
        body: JSON.stringify(existing ? {
            winning: record.winning,
            machine: record.machine
        } : record)
    });

    return existing ? "updated" : "inserted";
}

async function syncDate(drawDate) {
    const [officialResults, existingResults] = await Promise.all([
        fetchOfficialResults(drawDate),
        findExistingResults(drawDate)
    ]);
    const totals = { dates: 1, found: officialResults.length, inserted: 0, updated: 0, skipped: 0 };

    for (const record of officialResults) {
        const status = await saveResult(record, existingResults.get(record.game));
        totals[status] += 1;
    }

    console.log(
        `${drawDate}: ${officialResults.length} official result(s), ` +
        `${totals.inserted} inserted, ${totals.updated} updated, ${totals.skipped} unchanged.`
    );
    return totals;
}

async function runPool(items, worker, concurrency) {
    const results = new Array(items.length);
    let nextIndex = 0;

    async function runWorker() {
        while (nextIndex < items.length) {
            const index = nextIndex;
            nextIndex += 1;
            results[index] = await worker(items[index]);
        }
    }

    await Promise.all(
        Array.from({ length: Math.min(concurrency, items.length) }, runWorker)
    );
    return results;
}

const dates = buildDateRange();
console.log(`Synchronising ${dates.length} date(s): ${dates[0]} to ${dates.at(-1)}`);

const summaries = await runPool(dates, syncDate, IMPORT_CONCURRENCY);
const total = summaries.reduce(
    (sum, item) => {
        Object.keys(sum).forEach(key => { sum[key] += item[key]; });
        return sum;
    },
    { dates: 0, found: 0, inserted: 0, updated: 0, skipped: 0 }
);

console.log("Import completed:", total);
