// =========================================================
// JEJOYINYE LOTTERY SERVICES
// COMPLETE PREDICTION ENGINE
// predictions.js
// =========================================================


// =========================================================
// PAGE ELEMENTS
// =========================================================

const nextGameTitle =
    document.getElementById("next-game-title");

const nextGameDrawTime =
    document.getElementById("next-game-drawtime");

const countdownTimer =
    document.getElementById("countdown-timer");

const nextGameBalls =
    document.getElementById("next-game-balls");

const modernPredictionShareButton =
    document.querySelector('[data-share-prediction="modern"]');

const upcomingGamesList =
    document.getElementById("upcoming-games-list");

const analysisDrawCount =
    document.getElementById("analysis-draw-count");

const analysisTodayCount =
    document.getElementById("analysis-today-count");

const predictionAnalysisList =
    document.getElementById("prediction-analysis-list");

const modernPredictionRangeForm =
    document.getElementById("modern-prediction-range-form");

const modernPredictionFromDate =
    document.getElementById("modern-prediction-from-date");

const modernPredictionToDate =
    document.getElementById("modern-prediction-to-date");

const modernPredictionRangeReset =
    document.getElementById("modern-prediction-range-reset");

const modernPredictionRangeStatus =
    document.getElementById("modern-prediction-range-status");

const ghanaPredictionRangeForm =
    document.getElementById("ghana-prediction-range-form");

const ghanaPredictionFromDate =
    document.getElementById("ghana-prediction-from-date");

const ghanaPredictionToDate =
    document.getElementById("ghana-prediction-to-date");

const ghanaPredictionRangeReset =
    document.getElementById("ghana-prediction-range-reset");

const ghanaPredictionRangeStatus =
    document.getElementById("ghana-prediction-range-status");

const ghanaGameTitle =
    document.getElementById("ghana-game-title");

const ghanaGameDrawTime =
    document.getElementById("ghana-game-drawtime");

const ghanaCountdownTimer =
    document.getElementById("ghana-countdown-timer");

const ghanaGameBalls =
    document.getElementById("ghana-game-balls");

const ghanaAnalysisDrawCount =
    document.getElementById("ghana-analysis-draw-count");

const modernEngineVersion =
    document.getElementById("modern-engine-version");

const modernDataWindow =
    document.getElementById("modern-data-window");

const modernGeneratedTime =
    document.getElementById("modern-generated-time");

const ghanaEngineVersion =
    document.getElementById("ghana-engine-version");

const ghanaDataWindow =
    document.getElementById("ghana-data-window");

const ghanaGeneratedTime =
    document.getElementById("ghana-generated-time");

let modernPredictionDateRange = { from: "", to: "" };

let ghanaPredictionDateRange = { from: "", to: "" };

const PREDICTION_COOLDOWN_MS = 5 * 60 * 1000;

let modernPredictionCooldownTimer = null;

let modernPredictionCooldownUntil = 0;

let lastObservedModernResultKey = "";

let modernResultsRealtimeChannel = null;

const PREDICTIONS_SHARE_URL =
    "https://jolslottery.com/predictions";


function getDisplayedPredictionNumbers(container, selector = ".number-ball") {

    if (!container) {
        return [];
    }

    return Array.from(
        container.querySelectorAll(selector)
    )
        .map(ball => ball.textContent.trim())
        .filter(number => /^\d{1,2}$/.test(number));
}


function getDisplayedPredictionTiers(container) {
    return {
        sureNumbers: getDisplayedPredictionNumbers(
            container,
            ".prediction-tier-sure .number-ball"
        ),
        directSureNumbers: getDisplayedPredictionNumbers(
            container,
            ".prediction-tier-direct .number-ball"
        )
    };
}


async function shareGamePrediction(button) {

    const isGhana =
        button.dataset.sharePrediction === "ghana";

    const gameElement =
        isGhana ? ghanaGameTitle : nextGameTitle;

    const drawElement =
        isGhana ? ghanaGameDrawTime : nextGameDrawTime;

    const ballsElement =
        isGhana ? ghanaGameBalls : nextGameBalls;

    const {
        sureNumbers,
        directSureNumbers
    } = getDisplayedPredictionTiers(ballsElement);

    const numbers = [
        ...sureNumbers,
        ...directSureNumbers
    ];

    if (
        sureNumbers.length !== 2
        ||
        directSureNumbers.length !== 3
    ) {
        button.textContent = "Prediction Not Ready";
        setTimeout(
            () => button.textContent = "Share Prediction",
            1800
        );
        return;
    }

    const game =
        gameElement?.textContent.trim() || "Lottery";

    const drawDetails =
        drawElement?.textContent.trim() || "";

    const activeDateRange =
        isGhana
            ? ghanaPredictionDateRange
            : modernPredictionDateRange;

    const period =
        activeDateRange.from || activeDateRange.to
            ? `${activeDateRange.from || "earliest"} to ${activeDateRange.to || "latest"}`
            : isGhana
                ? "Scheduled weekday game's complete history"
                : "Recent same-game evidence, machine conversion and controlled same-day context";

    const forecastLabel = isGhana
        ? "Weekday game-pattern forecast"
        : "Evidence Fusion forecast";

    const text = [
        `${game} Game Prediction`,
        drawDetails,
        `2 Sure Numbers: ${sureNumbers.join("-")}`,
        `3 Direct Sure Numbers: ${directSureNumbers.join("-")}`,
        `${forecastLabel}: ${numbers.join("-")}`,
        `Historical period: ${period}`,
        "Statistical insight only — not a guaranteed result.",
        "View prediction details:"
    ].filter(Boolean).join("\n");

    try {
        if (navigator.share) {
            await navigator.share({
                title: `${game} Game Prediction`,
                text,
                url: PREDICTIONS_SHARE_URL
            });
            return;
        }

        await navigator.clipboard.writeText(
            `${text}\n${PREDICTIONS_SHARE_URL}`
        );

        button.textContent = "Copied!";
        setTimeout(
            () => button.textContent = "Share Prediction",
            1800
        );
    }
    catch (error) {
        if (error && error.name === "AbortError") {
            return;
        }

        console.error("PREDICTION SHARE FAILED:", error);
    }
}


document.addEventListener("click", function (event) {

    const button =
        event.target.closest("[data-share-prediction]");

    if (button) {
        shareGamePrediction(button);
    }
});


// =========================================================
// MODERN BILLIONAIRE SCHEDULE
// =========================================================

const modernPredictionSchedule = [

    {
        lottery: "modern-billionaire",
        game: "Powerball",
        databaseNames: ["Powerball"],
        closeMinutes: (8 * 60) + 55,
        drawMinutes: 9 * 60,
        closeTime: "8:55 AM",
        drawTime: "9:00 AM"
    },

    {
        lottery: "modern-billionaire",
        game: "Awoof",
        databaseNames: ["Awoof"],
        closeMinutes: (10 * 60) + 55,
        drawMinutes: 11 * 60,
        closeTime: "10:55 AM",
        drawTime: "11:00 AM"
    },

    {
        lottery: "modern-billionaire",
        game: "Biggest Bet",
        databaseNames: ["Biggest Bet"],
        closeMinutes: (12 * 60) + 55,
        drawMinutes: 13 * 60,
        closeTime: "12:55 PM",
        drawTime: "1:00 PM"
    },

    {
        lottery: "modern-billionaire",
        game: "Gold Rush",
        databaseNames: ["Gold Rush"],
        closeMinutes: (14 * 60) + 55,
        drawMinutes: 15 * 60,
        closeTime: "2:55 PM",
        drawTime: "3:00 PM"
    },

    {
        lottery: "modern-billionaire",
        game: "Lucky Dollar",
        databaseNames: ["Lucky Dollar"],
        closeMinutes: (16 * 60) + 55,
        drawMinutes: 17 * 60,
        closeTime: "4:55 PM",
        drawTime: "5:00 PM"
    },

    {
        lottery: "modern-billionaire",
        game: "Blessing",
        databaseNames: ["Blessing"],
        closeMinutes: (17 * 60) + 55,
        drawMinutes: 18 * 60,
        closeTime: "5:55 PM",
        drawTime: "6:00 PM"
    },

    {
        lottery: "modern-billionaire",
        game: "Owo Time",
        databaseNames: ["Owo Time"],
        closeMinutes: (18 * 60) + 55,
        drawMinutes: 19 * 60,
        closeTime: "6:55 PM",
        drawTime: "7:00 PM"
    },

    {
        lottery: "modern-billionaire",
        game: "Modern Bingo",
        databaseNames: ["Modern Bingo"],
        closeMinutes: (19 * 60) + 55,
        drawMinutes: 20 * 60,
        closeTime: "7:55 PM",
        drawTime: "8:00 PM"
    },

    {
        lottery: "modern-billionaire",
        game: "Bonus Cash",
        databaseNames: ["Bonus Cash"],
        closeMinutes: (20 * 60) + 55,
        drawMinutes: 21 * 60,
        closeTime: "8:55 PM",
        drawTime: "9:00 PM"
    },

    {
        lottery: "modern-billionaire",
        game: "Hero",
        databaseNames: ["Hero"],
        closeMinutes: (21 * 60) + 55,
        drawMinutes: 22 * 60,
        closeTime: "9:55 PM",
        drawTime: "10:00 PM"
    },

    {
        lottery: "modern-billionaire",
        game: "Golden",
        databaseNames: ["Golden", "Golden Night"],
        closeMinutes: (22 * 60) + 55,
        drawMinutes: 23 * 60,
        closeTime: "10:55 PM",
        drawTime: "11:00 PM"
    },

    {
        lottery: "modern-billionaire",
        game: "Queen",
        databaseNames: ["Queen"],
        closeMinutes: (23 * 60) + 55,
        drawMinutes: 24 * 60,
        closeTime: "11:55 PM",
        drawTime: "12:00 AM"
    }

];


// =========================================================
// GHANA SCHEDULE
// 0 = Sunday
// =========================================================

const ghanaPredictionSchedule = {

    0: {
        lottery: "ghana",
        game: "ASEDA",
        databaseNames: ["ASEDA"],
        drawMinutes: (19 * 60) + 10,
        drawTime: "7:10 PM"
    },

    1: {
        lottery: "ghana",
        game: "Monday Special",
        databaseNames: ["Monday Special"],
        drawMinutes: (21 * 60) + 10,
        drawTime: "9:10 PM"
    },

    2: {
        lottery: "ghana",
        game: "Lucky Tuesday",
        databaseNames: ["Lucky Tuesday"],
        drawMinutes: (21 * 60) + 10,
        drawTime: "9:10 PM"
    },

    3: {
        lottery: "ghana",
        game: "Mid Week",
        databaseNames: ["Mid Week"],
        drawMinutes: (21 * 60) + 10,
        drawTime: "9:10 PM"
    },

    4: {
        lottery: "ghana",
        game: "Thursday Fortune",
        databaseNames: ["Thursday Fortune"],
        drawMinutes: (21 * 60) + 10,
        drawTime: "9:10 PM"
    },

    5: {
        lottery: "ghana",
        game: "Friday Bonanza",
        databaseNames: ["Friday Bonanza"],
        drawMinutes: (21 * 60) + 10,
        drawTime: "9:10 PM"
    },

    6: {
        lottery: "ghana",
        game: "National",
        databaseNames: ["National"],
        drawMinutes: (21 * 60) + 10,
        drawTime: "9:10 PM"
    }

};


// =========================================================
// LAGOS TIME
// =========================================================

function getLagosTime() {

    const formatter =
        new Intl.DateTimeFormat(
            "en-GB",
            {
                timeZone: "Africa/Lagos",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hourCycle: "h23"
            }
        );


    const parts =
        formatter.formatToParts(new Date());


    const values = {};


    parts.forEach(part => {

        if (part.type !== "literal") {
            values[part.type] = part.value;
        }

    });


    const weekdayMap = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6
    };


    return {

        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day),
        weekday: weekdayMap[values.weekday],
        hour: Number(values.hour),
        minute: Number(values.minute),
        second: Number(values.second)

    };
}


// =========================================================
// DATE HELPERS
// =========================================================

function makeDateString(
    year,
    month,
    day
) {

    return (
        `${year}-` +
        `${String(month).padStart(2, "0")}-` +
        `${String(day).padStart(2, "0")}`
    );
}


function getTodayDateString() {

    const now =
        getLagosTime();


    return makeDateString(
        now.year,
        now.month,
        now.day
    );
}


function getTomorrowDateString() {

    const now =
        getLagosTime();


    const date =
        new Date(
            Date.UTC(
                now.year,
                now.month - 1,
                now.day
            )
        );


    date.setUTCDate(
        date.getUTCDate() + 1
    );


    return makeDateString(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate()
    );
}


function shiftDateString(dateString, numberOfDays) {
    const [year, month, day] = String(dateString)
        .split("-")
        .map(Number);

    if (![year, month, day].every(Number.isFinite)) {
        return "";
    }

    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() + numberOfDays);

    return makeDateString(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate()
    );
}


function formatPredictionDetailDate(dateValue) {

    const value = String(dateValue || "").slice(0, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return "Unavailable";
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC"
        }
    ).format(new Date(`${value}T00:00:00Z`));
}


function getPredictionDataWindow(history) {

    const dates = (Array.isArray(history) ? history : [])
        .map(result => String(result?.draw_date || "").slice(0, 10))
        .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
        .sort();

    if (!dates.length) {
        return "No records available";
    }

    const first = formatPredictionDetailDate(dates[0]);
    const last = formatPredictionDetailDate(dates[dates.length - 1]);

    return first === last ? first : `${first} – ${last}`;
}


function formatPredictionGeneratedTime(value) {

    const date = value ? new Date(value) : new Date();

    if (Number.isNaN(date.getTime())) {
        return "Unavailable";
    }

    return `${new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
            timeZone: "Africa/Lagos"
        }
    ).format(date)} WAT`;
}


function updatePredictionRunDetails({
    engineElement,
    windowElement,
    generatedElement,
    engineLabel,
    history,
    generatedAt
}) {

    if (engineElement) {
        engineElement.textContent = engineLabel;
    }

    if (windowElement) {
        windowElement.textContent = getPredictionDataWindow(history);
    }

    if (generatedElement) {
        generatedElement.textContent = formatPredictionGeneratedTime(generatedAt);
    }
}


function getSavedEngineLabel(snapshot, fallbackLabel) {

    if (!snapshot) {
        return fallbackLabel;
    }

    const version = String(snapshot.engine_version || "v2").toUpperCase();
    const profile = String(snapshot.engine_profile || "balanced")
        .replace(/(^|[-_\s])\w/g, match => match.toUpperCase());

    return `${version} Saved (${profile})`;
}


// =========================================================
// PARSE DATABASE NUMBERS
// =========================================================

function parsePredictionNumbers(data) {
    if (data === null || data === undefined) {
        return [];
    }

    if (Array.isArray(data)) {
        return data
            .map(Number)
            .filter(number =>
                Number.isInteger(number) &&
                number >= 1 &&
                number <= 90
            );
    }

    if (typeof data === "string") {
        const matches = data.match(/\b\d{1,2}\b/g) || [];

        return matches
            .map(Number)
            .filter(number =>
                Number.isInteger(number) &&
                number >= 1 &&
                number <= 90
            );
    }

    return [];
}


// =========================================================
// TODAY'S SCHEDULE
// =========================================================

function getTodaysGames() {

    const lagos =
        getLagosTime();


    const today =
        getTodayDateString();


    const games =
        modernPredictionSchedule.map(
            game => ({
                ...game,
                drawDate: today
            })
        );


    const ghanaGame =
        ghanaPredictionSchedule[
            lagos.weekday
        ];


    if (ghanaGame) {

        games.push({
            ...ghanaGame,
            drawDate: today
        });

    }


    return games.sort(
        (a, b) =>
            a.drawMinutes -
            b.drawMinutes
    );
}


// =========================================================
// NEXT GAME
// =========================================================

function getNextPredictionGame() {

    const lagos =
        getLagosTime();


    const currentSeconds =

        (lagos.hour * 3600) +

        (lagos.minute * 60) +

        lagos.second;


    const today =
        getTodayDateString();


    const modernGames =
        modernPredictionSchedule.map(
            game => ({
                ...game,
                drawDate: today
            })
        );


    for (
        const game of modernGames
    ) {

        const gameSeconds =
            game.drawMinutes * 60;


        if (
            gameSeconds >
            currentSeconds
        ) {

            return game;
        }
    }


    return {

        ...modernPredictionSchedule[0],

        drawDate:
            getTomorrowDateString(),

        tomorrow:
            true

    };
}


// =========================================================
// TODAY'S GHANA PREDICTION GAME
// =========================================================

function getGhanaPredictionGame() {

    const lagos =
        getLagosTime();


    const ghanaGame =
        ghanaPredictionSchedule[
            lagos.weekday
        ];


    if (!ghanaGame) {

        return null;
    }


    return {

        ...ghanaGame,

        drawDate:
            getTodayDateString()

    };
}


// =========================================================
// COUNTDOWN TARGET
// =========================================================

function getTargetTimestamp(game) {

    if (!game) {
        return null;
    }


    const [
        year,
        month,
        day
    ] =
        game.drawDate
            .split("-")
            .map(Number);


    let targetYear = year;
    let targetMonth = month;
    let targetDay = day;

    let minutes =
        game.drawMinutes;


    if (
        minutes >= 1440
    ) {

        const date =
            new Date(
                Date.UTC(
                    year,
                    month - 1,
                    day
                )
            );


        date.setUTCDate(
            date.getUTCDate() + 1
        );


        targetYear =
            date.getUTCFullYear();

        targetMonth =
            date.getUTCMonth() + 1;

        targetDay =
            date.getUTCDate();

        minutes = 0;

    }


    const hour =
        Math.floor(
            minutes / 60
        );


    const minute =
        minutes % 60;


    // Lagos is UTC+1

    return Date.UTC(
        targetYear,
        targetMonth - 1,
        targetDay,
        hour - 1,
        minute,
        0
    );
}


// =========================================================
// COUNTDOWN
// =========================================================

function updateCountdown(
    game,
    timerElement = countdownTimer
) {

    if (
        !timerElement ||
        !game
    ) {
        return;
    }


    const target =
        getTargetTimestamp(game);


    let difference =
        target - Date.now();


    if (
        difference <= 0
    ) {

        timerElement.textContent =
            "Draw Completed";

        return;
    }


    const seconds =
        Math.floor(
            difference / 1000
        );


    const hours =
        Math.floor(
            seconds / 3600
        );


    const minutes =
        Math.floor(
            (seconds % 3600) /
            60
        );


    const remainingSeconds =
        seconds % 60;


    timerElement.textContent =

        `${String(hours).padStart(2, "0")}:` +

        `${String(minutes).padStart(2, "0")}:` +

        `${String(remainingSeconds).padStart(2, "0")}`;

}


// =========================================================
// FETCH HISTORICAL RESULTS
// =========================================================

async function fetchPredictionHistory(
    game,
    dateRange = null
) {

    if (!game) {
        return [];
    }


    const activeDateRange =
        dateRange || (
            game.lottery === "ghana"
                ? ghanaPredictionDateRange
                : modernPredictionDateRange
        );


    try {

        let query =
            supabaseClient

                .from("results")

                .select(
                    "game, lottery, draw_date, winning, machine"
                )

                .eq(
                    "lottery",
                    game.lottery
                );


        if (
            game.databaseNames &&
            game.databaseNames.length > 1
        ) {

            query =
                query.in(
                    "game",
                    game.databaseNames
                );

        }

        else {

            query =
                query.eq(
                    "game",
                    game.databaseNames[0]
                );

        }

        const customRangeActive = Boolean(
            activeDateRange.from || activeDateRange.to
        );

        if (
            game.lottery === "modern-billionaire" &&
            !customRangeActive
        ) {
            query = query
                .gte(
                    "draw_date",
                    shiftDateString(game.drawDate, -90)
                )
                .lt("draw_date", game.drawDate);
        }

        else {
            if (activeDateRange.from) {
                query = query.gte("draw_date", activeDateRange.from);
            }

            if (activeDateRange.to) {
                query = query.lte("draw_date", activeDateRange.to);
            }
        }


        const {
            data,
            error
        } =
            await query

                .order(
                    "draw_date",
                    {
                        ascending: false
                    }
                )

                .limit(500);


        if (error) {
            throw error;
        }


        console.log(
            `Historical records found for ${game.game}:`,
            data ? data.length : 0
        );


        return data || [];

    }

    catch (error) {

        console.error(
            "Prediction history error:",
            error
        );


        return [];

    }

}


// =========================================================
// BUNDLED GHANA HISTORY
// Validated ASEDA and National winning + machine records.
// =========================================================

let bundledGhanaHistoryPromise = null;

function parseGhanaHistoryCsv(csvText) {
    return csvText
        .trim()
        .split(/\r?\n/)
        .slice(1)
        .map(line => {
            const [lottery, game, drawDate, winning, machine] =
                line.split(",");

            return {
                lottery,
                game,
                draw_date: drawDate,
                winning,
                machine
            };
        })
        .filter(result =>
            result.lottery === "ghana" &&
            result.game &&
            result.draw_date
        );
}

async function fetchBundledGhanaHistory() {
    if (!bundledGhanaHistoryPromise) {
        bundledGhanaHistoryPromise =
            fetch("data/ghana-history.csv?v=6", { cache: "no-cache" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Bundled Ghana history could not be loaded");
                    }

                    return response.text();
                })
                .then(parseGhanaHistoryCsv)
                .catch(error => {
                    console.error("Bundled Ghana history error:", error);
                    bundledGhanaHistoryPromise = null;
                    return [];
                });
    }

    return bundledGhanaHistoryPromise;
}

function mergeGhanaHistory(...collections) {
    const merged = new Map();

    collections
        .flat()
        .forEach(result => {
            if (!result || !result.game || !result.draw_date) {
                return;
            }

            const key =
                `${String(result.game).trim().toUpperCase()}|${result.draw_date}`;

            // The first collection is authoritative for overlapping draws.
            // Owner-verified bundled Ghana archives are passed first.
            if (!merged.has(key)) {
                merged.set(key, result);
            }
        });

    return [...merged.values()]
        .sort((a, b) =>
            String(b.draw_date).localeCompare(String(a.draw_date))
        );
}

function filterHistoryByDateRange(
    results,
    dateRange
) {
    const from = dateRange?.from || "";
    const to = dateRange?.to || "";

    return (Array.isArray(results) ? results : [])
        .filter(result => {
            const drawDate = String(result?.draw_date || "").slice(0, 10);

            if (from && drawDate < from) {
                return false;
            }

            if (to && drawDate > to) {
                return false;
            }

            return true;
        });
}

// =========================================================
// TODAY'S EARLIER PUBLISHED GAMES
// =========================================================

function getEarlierGameNamesForPrediction(game) {
    if (!game) {
        return [];
    }

    return getTodaysGames()
        .filter(item =>
            item.lottery === game.lottery &&
            item.drawMinutes < game.drawMinutes
        )
        .flatMap(item => item.databaseNames || [item.game]);
}

async function fetchTodaysEarlierResults(game) {

    if (!game || game.drawDate !== getTodayDateString()) {
        return [];
    }

    const earlierGameNames = getEarlierGameNamesForPrediction(game);

    if (!earlierGameNames.length) {
        return [];
    }

    try {
        const { data, error } = await supabaseClient
            .from("results")
            .select("game, lottery, draw_date, winning, machine, created_at")
            .eq("lottery", game.lottery)
            .eq("draw_date", game.drawDate)
            .in("game", [...new Set(earlierGameNames)]);

        if (error) {
            throw error;
        }

        return data || [];
    }

    catch (error) {
        console.error("Today's earlier results error:", error);
        return [];
    }
}


// =========================================================
// FIVE-MINUTE POST-RESULT COOLING PERIOD
// =========================================================

function getPublishedResultKey(result) {
    if (!result) {
        return "";
    }

    return [
        result.draw_date || "",
        result.lottery || "",
        result.game || "",
        result.created_at || ""
    ].join("|");
}

function getLatestPublishedResult(results) {
    return (Array.isArray(results) ? results : [])
        .filter(result => Number.isFinite(Date.parse(result?.created_at || "")))
        .sort((a, b) =>
            Date.parse(b.created_at) - Date.parse(a.created_at)
        )[0] || null;
}

function getPredictionCooldownState(results) {
    const latestResult = getLatestPublishedResult(results);
    const publishedAt = Date.parse(latestResult?.created_at || "");
    const expiresAt = Number.isFinite(publishedAt)
        ? publishedAt + PREDICTION_COOLDOWN_MS
        : 0;

    return {
        latestResult,
        expiresAt,
        active: expiresAt > Date.now()
    };
}

function stopModernPredictionCooldown() {
    if (modernPredictionCooldownTimer) {
        clearInterval(modernPredictionCooldownTimer);
        modernPredictionCooldownTimer = null;
    }

    modernPredictionCooldownUntil = 0;
}

function setModernPredictionShareDisabled(disabled) {
    if (!modernPredictionShareButton) {
        return;
    }

    modernPredictionShareButton.disabled = disabled;
    modernPredictionShareButton.setAttribute(
        "aria-disabled",
        String(disabled)
    );
}

function startModernPredictionCooldown(latestResult, expiresAt) {
    stopModernPredictionCooldown();

    modernPredictionCooldownUntil = expiresAt;
    setModernPredictionShareDisabled(true);

    const renderCooldown = () => {
        const remainingMilliseconds =
            Math.max(0, modernPredictionCooldownUntil - Date.now());

        if (remainingMilliseconds <= 0) {
            stopModernPredictionCooldown();
            setModernPredictionShareDisabled(false);
            displayNextGamePrediction();
            return;
        }

        const remainingSeconds = Math.ceil(remainingMilliseconds / 1000);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        const countdown =
            `${String(minutes).padStart(2, "0")}:` +
            `${String(seconds).padStart(2, "0")}`;

        if (nextGameBalls) {
            nextGameBalls.innerHTML = `
                <div class="prediction-cooldown" role="status" aria-live="polite">
                    <span class="prediction-cooldown-label">NEW RESULT PUBLISHED</span>
                    <strong>Updating the next forecast</strong>
                    <span class="prediction-cooldown-time">${countdown}</span>
                    <small>The five predicted numbers will appear after the five-minute analysis period.</small>
                </div>
            `;
        }

        if (predictionAnalysisList) {
            predictionAnalysisList.innerHTML = `
                <p class="analysis-loading prediction-cooldown-analysis">
                    The engine is analysing the newly published result before releasing its next five-number forecast.
                </p>
            `;
        }

        if (modernGeneratedTime) {
            modernGeneratedTime.textContent = `Available in ${countdown}`;
        }
    };

    renderCooldown();
    modernPredictionCooldownTimer = setInterval(renderCooldown, 1000);

    console.info(
        `Prediction paused after ${latestResult?.game || "a new result"} until`,
        new Date(expiresAt).toISOString()
    );
}

async function checkForNewPublishedModernResult() {
    const nextGame = getNextPredictionGame();

    if (!nextGame || nextGame.lottery !== "modern-billionaire") {
        return;
    }

    const todayResults = await fetchTodaysEarlierResults(nextGame);
    const latestResult = getLatestPublishedResult(todayResults);
    const latestKey = getPublishedResultKey(latestResult);

    if (!latestKey) {
        return;
    }

    if (latestKey !== lastObservedModernResultKey) {
        lastObservedModernResultKey = latestKey;
        await displayNextGamePrediction();
    }
}

async function subscribeToModernResultUpdates() {
    if (!supabaseClient?.channel) {
        return;
    }

    if (modernResultsRealtimeChannel) {
        const previousChannel = modernResultsRealtimeChannel;
        modernResultsRealtimeChannel = null;

        try {
            await supabaseClient.removeChannel(previousChannel);
        }

        catch (error) {
            console.warn("Previous prediction channel cleanup failed:", error);
        }
    }

    const handlePublishedResult = payload => {
        const result = payload?.new;
        const nextGame = getNextPredictionGame();

        if (
            !result ||
            !nextGame ||
            result.lottery !== nextGame.lottery ||
            String(result.draw_date || "").slice(0, 10) !== nextGame.drawDate
        ) {
            return;
        }

        const earlierGameNames = new Set(
            getEarlierGameNamesForPrediction(nextGame)
        );

        if (!earlierGameNames.has(result.game)) {
            return;
        }

        const resultKey = getPublishedResultKey(result);

        if (resultKey && resultKey !== lastObservedModernResultKey) {
            lastObservedModernResultKey = resultKey;
            displayNextGamePrediction();
        }
    };

    modernResultsRealtimeChannel = supabaseClient
        .channel("modern-prediction-result-updates")
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "results" },
            handlePublishedResult
        )
        .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "results" },
            handlePublishedResult
        )
        .subscribe();
}


// =========================================================
// MODERN EVIDENCE INPUT TABLES
// Classification and moving-number relationships used by Evidence Fusion v1.
// =========================================================

const MODERN_PREDICTION_ENGINE_LABEL = "Evidence Fusion v1 • EF-F";
const MODERN_RANGE_PREDICTION_ENGINE_LABEL = "Evidence Fusion v1 • Custom Range";

const GHANA_GAME_PATTERN_WEIGHTS = Object.freeze({
    statistical: 0.30,
    pattern: 0.50,
    moving: 0.20
});

const GHANA_PREDICTION_ENGINE_LABEL = "Weekday game pattern";

const MODERN_CLASSIFICATION_CATEGORY_NAMES = Object.freeze([
    "counterpart",
    "bonanza",
    "malta",
    "stringKey",
    "shadow",
    "partner",
    "equivalent",
    "code",
    "turning"
]);

const MODERN_CLASSIFICATION_ROWS = `1 46 74 89 58 04 03 08 00 10
2 47 08 88 65 08 09 07 09 20
3 48 17 87 57 00 01 06 08 30
4 49 36 86 76 01 02 05 07 40
5 50 35 85 19 07 10 04 06 50
6 51 65 84 90 09 08 03 05 60
7 52 57 83 54 05 06 02 04 70
8 53 02 82 43 02 05 01 03 80
9 54 81 23 26 06 10 02 09 90
10 55 85 80 63 03 09 00 01 00
11 56 59 79 32 44 07 88 00 11
12 57 48 78 75 40 12 87 09 21
13 58 78 78 69 18 11 86 08 31
14 59 30 76 26 41 18 85 07 41
15 60 51 75 68 21 10 84 06 51
16 61 54 74 59 49 17 83 05 61
17 62 03 73 81 45 14 82 04 71
18 63 24 72 47 46 15 81 03 81
19 64 22 71 25 46 16 80 02 91
20 65 86 70 66 83 22 79 01 02
21 66 61 69 85 84 25 78 90 12
22 67 42 68 67 88 20 77 99 22
23 68 19 87 80 24 12 76 98 32
24 69 18 66 45 81 23 75 97 42
25 70 80 65 51 87 21 74 96 52
26 71 62 64 14 89 28 73 95 62
27 72 32 63 63 85 29 72 94 72
28 73 71 62 52 82 26 71 93 82
29 74 72 61 38 86 27 70 92 92
30 75 14 60 78 03 38 69 91 03
31 76 37 59 88 04 35 68 90 13
32 77 27 58 71 08 34 67 89 23
33 78 05 57 80 33 36 66 88 33
34 79 73 56 67 01 32 65 87 43
35 80 88 55 53 07 31 64 86 53
36 81 04 54 09 39 33 63 85 63
37 82 91 53 72 05 39 62 84 73
38 83 35 52 29 06 30 61 83 83
39 84 58 51 69 06 30 60 82 93
40 85 43 50 86 08 41 59 81 04
41 86 79 49 77 14 40 58 80 14
42 87 22 48 55 18 48 57 79 24
43 88 40 47 60 10 46 56 78 34
44 89 76 46 61 11 47 55 77 44
45 90 47 45 24 17 49 54 76 54
46 01 90 44 62 19 43 53 75 64
47 02 45 43 18 15 52 74 74 74
48 03 12 42 16 42 51 73 84 84
49 04 68 41 16 50 50 72 49 49
50 05 83 40 89 73 49 61 05 05
51 06 16 39 25 74 48 60 15 15
52 07 66 38 28 78 47 69 25 25
53 08 70 37 36 70 58 68 35 35
54 09 16 36 07 71 57 67 45 45
55 10 58 35 42 77 44 66 55 55
56 11 60 34 79 79 34 65 65 65
57 12 07 33 03 75 55 64 75 75
58 13 55 32 01 72 54 63 85 85
59 14 11 31 16 76 53 62 59 59
60 15 56 30 44 94 63 39 51 06
61 16 21 29 22 93 50 50 16 16
62 17 29 28 46 98 61 37 59 26
63 18 28 27 27 90 60 36 58 36
64 19 67 26 16 96 35 57 46 46
65 20 06 25 65 02 33 56 56 56
66 21 24 24 50 97 68 55 66 66
67 22 63 23 24 99 67 54 76 76
68 23 49 22 14 92 66 53 86 86
69 24 31 21 06 93 65 52 96 96
70 25 20 20 26 88 64 51 07 07
71 26 82 19 18 84 75 50 17 17
72 27 23 18 37 58 74 49 27 27
73 28 34 17 61 85 73 48 37 37
74 29 01 16 49 51 72 47 47 47
75 30 77 15 12 57 71 46 57 57
76 31 44 14 04 59 70 45 67 67
77 32 75 13 41 55 72 22 44 77
78 33 18 12 30 52 70 21 43 57
79 34 41 11 56 76 20 42 77 79
80 35 25 10 33 23 89 19 31 08
81 36 09 09 10 28 85 18 30 18
82 37 84 08 70 28 88 17 29 28
83 38 50 07 10 20 15 16 28 38
84 39 23 06 7 21 14 37 48 48
85 40 10 05 64 27 81 14 36 58
86 41 20 04 40 29 87 13 35 68
87 42 64 03 29 25 86 12 34 78
88 43 9 02 31 22 82 11 33 88
89 44 9 01 50 26 80 10 32 89
90 45 46 06 63 09 69 21 09 09`;

const MODERN_CLASSIFICATION_CHART = Object.freeze(
    Object.fromEntries(
        MODERN_CLASSIFICATION_ROWS
            .trim()
            .split(/\n+/)
            .map(row => {
                const values = row.trim().split(/\s+/).map(Number);
                const number = values.shift();
                return [
                    number,
                    Object.freeze(
                        Object.fromEntries(
                            MODERN_CLASSIFICATION_CATEGORY_NAMES.map(
                                (category, index) => [category, values[index]]
                            )
                        )
                    )
                ];
            })
    )
);

const MODERN_MOVING_ROWS = `1:23,8,73;11:29,7,19;21:8,80,75;31:9,53,70;41:32,59,77;51:9,15,69;61:30,3,80;71:27,5,83;81:27,5,83
2:58,5,74;12:3,4,76;22:4,58,65;32:23,8,77;42:17,31,78;52:37,39,22;62:28,53,80;72:18,45,81;82:19,55,87
3:8,7,90;13:22,8,65;23:5,68,77;33:24,2,78;43:25,61,7;53:10,89,71;63:19,38,22;73:19,73,82;83:29,38,47
4:50,40,78;14:1,77,81;24:30,47,80;34:36,73,8;44:53,62,80;54:37,77,72;64:1,19,82;74:56,47,19;84:21,8,84
5:22,2,9;15:25,52,79;25:24,2,89;35:40,53,80;45:10,72,1;55:47,58,65;64:3,30,80;75:40,87,85;85:23,88,59
7:34,3,56;16:9,80,40;29:45,54,90;38:28,45,64;49:1,11,56;54:48,84,75;65:40,53,87;73:17,30,18;85:24,70,87
8:53,4,89;18:9,27,54;28:46,55,82;38:58,65,74;49:3,8,57;58:4,40,49;68:50,77,87;78:20,18,40;88:34,52,88
9:36,50,72;29:28,54,72;22:2,20,65;33:48,57,84;46:4,40,49;43:23,32,77;60:8,60,24;37:52,80,17;31:21,71,77
10:55,82,64;20:20,29,36;30:30,8,69;40:49,67,75;50:12,66,86;60:6,77,78;70:7,25,34;80:35,40,71;90:55,3,27`;

const MODERN_MOVING_GRAPH = (() => {
    const graph = Object.fromEntries(
        Array.from({ length: 90 }, (_, index) => [index + 1, new Set()])
    );

    MODERN_MOVING_ROWS
        .trim()
        .split(/\n+/)
        .forEach(row => {
            row.split(";").forEach(entry => {
                const [headingText, movesText] = entry.split(":");
                const heading = Number(headingText);
                const moves = movesText.split(",").map(Number);

                moves.forEach(move => {
                    if (
                        heading >= 1 && heading <= 90 &&
                        move >= 1 && move <= 90 &&
                        move !== heading
                    ) {
                        graph[heading].add(move);
                        graph[move].add(heading);
                    }
                });
            });
        });

    return Object.freeze(
        Object.fromEntries(
            Object.entries(graph).map(
                ([number, related]) => [
                    number,
                    Object.freeze([...related])
                ]
            )
        )
    );
})();

function normalizePredictionComponent(scoreMap, property) {
    const maximum = Math.max(
        0,
        ...Object.values(scoreMap).map(item => item[property] || 0)
    );

    Object.values(scoreMap).forEach(item => {
        item[`${property}Normalized`] =
            maximum > 0
                ? ((item[property] || 0) / maximum) * 100
                : 0;
    });
}

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

// =========================================================
// STRENGTH LABEL
// =========================================================

function getPredictionStrength(
    score,
    maxScore
) {

    if (
        !maxScore ||
        maxScore <= 0
    ) {

        return {
            label: "Cold",
            className:
                "analysis-cold"
        };

    }


    const ratio =
        score / maxScore;


    if (
        ratio >= 0.8
    ) {

        return {
            label: "Hot",
            className:
                "analysis-hot"
        };

    }


    if (
        ratio >= 0.55
    ) {

        return {
            label: "Warm",
            className:
                "analysis-warm"
        };

    }


    return {
        label: "Cold",
        className:
            "analysis-cold"
    };

}


// =========================================================
// DISPLAY BALLS
// =========================================================

function getPredictionTiers(predictionData) {
    const rankedNumbers =
        Array.isArray(predictionData?.rankedData)
            ? predictionData.rankedData
                .slice(0, 5)
                .map(item => Number(item.number))
                .filter(Number.isInteger)
            : [];

    return {
        sureNumbers: rankedNumbers.slice(0, 2),
        directSureNumbers: rankedNumbers.slice(2, 5)
    };
}


function predictionTierMarkup(predictionData) {
    const {
        sureNumbers,
        directSureNumbers
    } = getPredictionTiers(predictionData);

    if (
        sureNumbers.length !== 2
        ||
        directSureNumbers.length !== 3
    ) {
        return `

            <span
                style="
                    color:#64748b;
                    font-weight:700;
                "
            >
                Insufficient historical data
            </span>

        `;
    }

    const renderBalls = numbers =>
        numbers
            .map(
                number => `

                    <span class="number-ball">
                        ${String(number).padStart(2, "0")}
                    </span>

                `
            )
            .join("");

    return `

        <div class="prediction-tier prediction-tier-sure">
            <span class="prediction-tier-title">
                2 Sure Numbers
            </span>

            <div class="prediction-tier-balls">
                ${renderBalls(sureNumbers)}
            </div>
        </div>

        <div class="prediction-tier prediction-tier-direct">
            <span class="prediction-tier-title">
                3 Direct Sure Numbers
            </span>

            <div class="prediction-tier-balls">
                ${renderBalls(directSureNumbers)}
            </div>
        </div>

    `;
}


function displayPredictionBalls(
    predictionData,
    container = nextGameBalls
) {

    if (!container) {
        return;
    }

    container.classList.add("prediction-tier-grid");
    container.innerHTML = predictionTierMarkup(predictionData);

}


// =========================================================
// DISPLAY ANALYSIS
// =========================================================

function displayPredictionAnalysis(
    predictionData,
    historyCount,
    todayCount = 0
) {

    if (
        analysisDrawCount
    ) {

        analysisDrawCount.textContent =
            historyCount;

    }

    if (analysisTodayCount) {
        analysisTodayCount.textContent = todayCount;
    }


    if (
        !predictionAnalysisList ||
        !predictionData
    ) {

        return;

    }


    const predictedNumbers =
        predictionData.predictedNumbers;


    const scoreMap =
        predictionData.scoreMap;


    const maxScore =
        predictionData.rankedData.length
            ? predictionData.rankedData[0]
                .totalScore
            : 0;


    predictionAnalysisList.innerHTML =
        predictedNumbers

            .map(
                number => {


                    const item =
                        scoreMap[number];


                    const strength =
                        getPredictionStrength(
                            item.totalScore,
                            maxScore
                        );


                    return `

                        <article
                            class="
                                prediction-analysis-card
                            "
                        >

                            <div
                                class="
                                    analysis-number
                                "
                            >
                                ${String(
                                    number
                                ).padStart(
                                    2,
                                    "0"
                                )}
                            </div>


                            <div
                                class="
                                    analysis-details
                                "
                            >

                                <div
                                    class="
                                        analysis-top
                                    "
                                >

                                    <h4>
                                        Number
                                        ${String(
                                            number
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </h4>


                                    <span
                                        class="
                                            analysis-strength
                                            ${strength.className}
                                        "
                                    >
                                        ${strength.label}
                                    </span>

                                </div>


                                <div
                                    class="
                                        analysis-stats
                                    "
                                >

                                    <div>

                                        <span>
                                            Winning Appearances
                                        </span>

                                        <strong>
                                            ${item.winningFrequency}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Machine Appearances
                                        </span>

                                        <strong>
                                            ${item.machineFrequency}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Today's Activity
                                        </span>

                                        <strong>
                                            ${item.todayFrequency.toFixed(1)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Same-Game Evidence
                                        </span>

                                        <strong>
                                            ${Number(item.sameGameScoreNormalized ?? item.recentScore ?? 0).toFixed(1)}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Machine → Winning Conversion
                                        </span>

                                        <strong>
                                            ${Number(item.machineConversionScoreNormalized ?? 0).toFixed(1)}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Cross Confirmation
                                        </span>

                                        <strong>
                                            ${Number(item.crossConfirmationScoreNormalized ?? 0).toFixed(1)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Classification Score
                                        </span>

                                        <strong>
                                            ${item.classificationScoreNormalized.toFixed(1)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Moving Number Score
                                        </span>

                                        <strong>
                                            ${item.movingScoreNormalized.toFixed(1)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Overall Score
                                        </span>

                                        <strong>
                                            ${item.totalScore.toFixed(
                                                1
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </article>

                    `;

                }
            )

            .join("");

}


// =========================================================
// DISPLAY NAME
// =========================================================

function getLotteryDisplayName(
    lottery
) {

    if (
        lottery ===
        "modern-billionaire"
    ) {

        return "Modern Billionaire";

    }


    if (
        lottery ===
        "ghana"
    ) {

        return "Ghana Games";

    }


    return lottery;

}



// =========================================================
// DISPLAY NEXT GAME
// =========================================================

async function displayNextGamePrediction() {

    const nextGame =
        getNextPredictionGame();


    if (!nextGame) {
        return;
    }


    if (nextGameTitle) {

        nextGameTitle.textContent =
            nextGame.game;

    }


    if (nextGameDrawTime) {

        nextGameDrawTime.textContent =

            `${getLotteryDisplayName(
                nextGame.lottery
            )} • Draw Time: ${nextGame.drawTime}`;

    }


    if (nextGameBalls) {

        nextGameBalls.innerHTML = `

            <span
                style="
                    color:#64748b;
                    font-weight:700;
                "
            >
                Analysing historical results...
            </span>

        `;

    }


    if (
        predictionAnalysisList
    ) {

        predictionAnalysisList.innerHTML = `

            <p
                class="analysis-loading"
            >
                Analysing prediction data...
            </p>

        `;

    }


    updateCountdown(
        nextGame
    );


    try {

        const customRangeActive = hasCustomPredictionRange(
            modernPredictionDateRange
        );

        const [
            history,
            todayResults
        ] = await Promise.all([
            fetchPredictionHistory(nextGame),
            fetchTodaysEarlierResults(nextGame)
        ]);

        const latestTodayResult = getLatestPublishedResult(todayResults);

        if (latestTodayResult) {
            lastObservedModernResultKey =
                getPublishedResultKey(latestTodayResult);
        }


        updatePredictionRunDetails({
            engineElement: modernEngineVersion,
            windowElement: modernDataWindow,
            generatedElement: modernGeneratedTime,
            engineLabel: customRangeActive
                ? MODERN_RANGE_PREDICTION_ENGINE_LABEL
                : MODERN_PREDICTION_ENGINE_LABEL,
            history,
            generatedAt: null
        });

        const cooldownState = getPredictionCooldownState(todayResults);

        if (cooldownState.active) {
            if (analysisTodayCount) {
                analysisTodayCount.textContent = todayResults.length;
            }

            startModernPredictionCooldown(
                cooldownState.latestResult,
                cooldownState.expiresAt
            );
            return;
        }

        stopModernPredictionCooldown();
        setModernPredictionShareDisabled(false);


        if (
            history.length === 0
        ) {

            displayPredictionBalls([]);

            if (
                predictionAnalysisList
            ) {

                predictionAnalysisList.innerHTML = `

                    <p class="analysis-loading">
                        No historical records found for
                        this game.
                    </p>

                `;

            }


            if (
                analysisDrawCount
            ) {

                analysisDrawCount.textContent =
                    "0";

            }

            if (analysisTodayCount) {
                analysisTodayCount.textContent = todayResults.length;
            }


            return;

        }


        const predictionData =
            calculateModernEvidenceFusionPrediction(
                history,
                todayResults,
                nextGame.drawDate,
                customRangeActive
            );

        if (customRangeActive && nextGameDrawTime) {
            nextGameDrawTime.textContent =
                `${getLotteryDisplayName(nextGame.lottery)} • Draw Time: ${nextGame.drawTime} • Evidence Fusion range`;
        }


        displayPredictionBalls(
            predictionData
        );


        displayPredictionAnalysis(
            predictionData,
            history.length,
            todayResults.length
        );


        console.log(
            "Prediction generated:",
            predictionData.predictedNumbers
        );

    }

    catch (error) {

        console.error(
            "Prediction engine error:",
            error
        );


        if (nextGameBalls) {

            nextGameBalls.innerHTML = `

                <span
                    style="
                        color:#dc2626;
                        font-weight:700;
                    "
                >
                    Prediction temporarily unavailable
                </span>

            `;

        }

    }

}


// =========================================================
// GHANA WEEKDAY GAME-PATTERN PREDICTION
// Each scheduled game uses only its own historical results.
// 30% own-game statistics + 50% own-game pattern + 20% movement.
// =========================================================

function calculateGhanaGamePatternPrediction(results) {
    const scoreMap = {};

    for (let number = 1; number <= 90; number++) {
        scoreMap[number] = {
            number,
            statisticalScore: 0,
            patternScore: 0,
            movingScore: 0,
            totalScore: 0
        };
    }

    const orderedResults = [...results]
        .sort((a, b) =>
            String(b.draw_date || "").localeCompare(
                String(a.draw_date || "")
            )
        );

    const parsedDraws = orderedResults.map(result => ({
        winning: parsePredictionNumbers(result.winning),
        machine: parsePredictionNumbers(result.machine)
    }));

    parsedDraws.forEach((draw, index) => {
        const recencyWeight =
            Math.max(
                0.35,
                1 - (
                    index /
                    Math.max(parsedDraws.length, 1)
                ) * 0.65
            );

        draw.winning.forEach(number => {
            scoreMap[number].statisticalScore += 2.5 * recencyWeight;
        });

        draw.machine.forEach(number => {
            scoreMap[number].statisticalScore += 0.75 * recencyWeight;
        });
    });

    const latestWinningNumbers = parsedDraws[0]?.winning || [];
    const latestWinningSet = new Set(latestWinningNumbers);

    // Learn recurrence gaps separately for this weekday game.
    for (let number = 1; number <= 90; number++) {
        const appearances = [];

        parsedDraws.forEach((draw, index) => {
            if (draw.winning.includes(number)) {
                appearances.push(index);
            }
        });

        if (appearances.length >= 2) {
            const gaps = appearances
                .slice(0, -1)
                .map((index, position) =>
                    appearances[position + 1] - index
                );
            const averageGap =
                gaps.reduce((sum, gap) => sum + gap, 0) /
                Math.max(gaps.length, 1);
            const currentGap = appearances[0];
            const distance = Math.abs(currentGap - averageGap);

            scoreMap[number].patternScore +=
                Math.max(0, 2.5 - (distance / Math.max(averageGap, 1)));
        }
    }

    // Learn which numbers recur beside the latest game's number groups.
    parsedDraws.slice(1).forEach((draw, index) => {
        const recencyWeight = Math.max(0.3, 1 - (index * 0.025));
        const exactMatches = draw.winning
            .filter(number => latestWinningSet.has(number))
            .length;

        draw.winning.forEach(candidate => {
            const relatedAnchors = latestWinningNumbers
                .filter(anchor =>
                    anchor % 10 === candidate % 10 ||
                    Math.floor((anchor - 1) / 10) ===
                        Math.floor((candidate - 1) / 10)
                )
                .length;

            scoreMap[candidate].patternScore +=
                ((exactMatches * 0.8) + (relatedAnchors * 0.2)) *
                recencyWeight;
        });
    });

    // Learn draw-to-draw movements from this game only, then apply the
    // strongest historical movements to its latest winning numbers.
    const movementFrequency = new Map();

    for (let index = parsedDraws.length - 1; index > 0; index--) {
        const olderDraw = parsedDraws[index];
        const newerDraw = parsedDraws[index - 1];

        olderDraw.winning.forEach(source => {
            newerDraw.winning.forEach(target => {
                const movement = (target - source + 90) % 90;

                if (movement > 0) {
                    movementFrequency.set(
                        movement,
                        (movementFrequency.get(movement) || 0) + 1
                    );
                }
            });
        });
    }

    const strongestMovements = [...movementFrequency.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    latestWinningNumbers.forEach(source => {
        strongestMovements.forEach(([movement, frequency]) => {
            const target = ((source + movement - 1) % 90) + 1;
            scoreMap[target].movingScore += frequency;
        });
    });

    normalizePredictionComponent(scoreMap, "statisticalScore");
    normalizePredictionComponent(scoreMap, "patternScore");
    normalizePredictionComponent(scoreMap, "movingScore");

    Object.values(scoreMap).forEach(item => {
        item.totalScore =
            (item.statisticalScoreNormalized * GHANA_GAME_PATTERN_WEIGHTS.statistical) +
            (item.patternScoreNormalized * GHANA_GAME_PATTERN_WEIGHTS.pattern) +
            (item.movingScoreNormalized * GHANA_GAME_PATTERN_WEIGHTS.moving);
    });

    const rankedNumbers =
        Object.values(scoreMap)
            .sort((a, b) =>
                b.totalScore !== a.totalScore
                    ? b.totalScore - a.totalScore
                    : a.number - b.number
            );

    return {
        predictedNumbers:
            rankedNumbers
                .slice(0, 5)
                .map(item => item.number)
                .sort((a, b) => a - b),
        rankedData: rankedNumbers,
        scoreMap
    };
}


// =========================================================
// DISPLAY GHANA PREDICTION
// =========================================================

async function displayGhanaPrediction() {

    const ghanaGame =
        getGhanaPredictionGame();


    if (!ghanaGame) {

        return;
    }


    if (ghanaGameTitle) {

        ghanaGameTitle.textContent =
            ghanaGame.game;
    }


    if (ghanaGameDrawTime) {

        ghanaGameDrawTime.textContent =

            `Ghana Games • Draw Time: ${ghanaGame.drawTime}`;
    }


    updateCountdown(
        ghanaGame,
        ghanaCountdownTimer
    );


    if (ghanaGameBalls) {

        ghanaGameBalls.innerHTML = `

            <span style="color:#64748b;font-weight:700;">
                Analysing Ghana history...
            </span>

        `;
    }


    try {

        const [
            databaseGameHistory,
            bundledGhanaHistory
        ] = await Promise.all([
            fetchPredictionHistory(ghanaGame),
            fetchBundledGhanaHistory()
        ]);

        const filteredBundledGhanaHistory =
            filterHistoryByDateRange(
                bundledGhanaHistory,
                ghanaPredictionDateRange
            );

        const bundledGameHistory =
            filteredBundledGhanaHistory.filter(result =>
                String(result.game).trim().toUpperCase() ===
                String(ghanaGame.game).trim().toUpperCase()
            );

        const gameHistory =
            mergeGhanaHistory(
                bundledGameHistory,
                databaseGameHistory
            );

        const history = gameHistory;

        const ghanaRangeActive =
            hasCustomPredictionRange(
                ghanaPredictionDateRange
            );

        updatePredictionRunDetails({
            engineElement: ghanaEngineVersion,
            windowElement: ghanaDataWindow,
            generatedElement: ghanaGeneratedTime,
            engineLabel: GHANA_PREDICTION_ENGINE_LABEL,
            history,
            generatedAt: null
        });


        if (ghanaAnalysisDrawCount) {

            ghanaAnalysisDrawCount.textContent =
                String(history.length);
        }


        if (!history.length) {

            if (ghanaGameBalls) {

                ghanaGameBalls.innerHTML = `

                    <span style="color:#64748b;font-weight:700;">
                        Insufficient historical data
                    </span>

                `;
            }


            return;
        }


        const predictionData =
            calculateGhanaGamePatternPrediction(history);

        if (ghanaRangeActive && ghanaGameDrawTime) {
            ghanaGameDrawTime.textContent =
                `Ghana Games • Draw Time: ${ghanaGame.drawTime} • Weekday game-pattern range`;
        }


        displayPredictionBalls(
            predictionData,
            ghanaGameBalls
        );

    }


    catch (error) {

        console.error(
            "Ghana prediction error:",
            error
        );


        if (ghanaGameBalls) {

            ghanaGameBalls.innerHTML = `

                <span style="color:#dc2626;font-weight:700;">
                    Ghana prediction temporarily unavailable
                </span>

            `;
        }
    }
}


// =========================================================
// GAME STATUS
// =========================================================

function getGameStatus(
    game
) {

    const lagos =
        getLagosTime();


    const currentMinutes =

        (lagos.hour * 60) +

        lagos.minute;


    if (
        game.drawMinutes >
        currentMinutes
    ) {

        return "upcoming";

    }


    return "completed";

}


// =========================================================
// RENDER DAILY SCHEDULE
// =========================================================

function renderPredictionSchedule() {

    if (!upcomingGamesList) {
        return;
    }


    const games =
        getTodaysGames();


    const nextGame =
        getNextPredictionGame();


    upcomingGamesList.innerHTML =
        games

            .map(
                game => {


                    const status =
                        getGameStatus(
                            game
                        );


                    const isNext =
                        (
                            nextGame &&
                            nextGame.game ===
                                game.game &&
                            nextGame.lottery ===
                                game.lottery
                        );


                    let statusText =
                        "Completed";


                    let statusClass =
                        "schedule-completed";


                    if (isNext) {

                        statusText =
                            "Next Draw";

                        statusClass =
                            "schedule-next";

                    }

                    else if (
                        status ===
                        "upcoming"
                    ) {

                        statusText =
                            "Upcoming";

                        statusClass =
                            "schedule-upcoming";

                    }


                    const closeText =
                        game.closeTime
                            ? `
                                <span
                                    class="
                                        schedule-close
                                    "
                                >
                                    Sales Close:
                                    ${game.closeTime}
                                </span>
                            `
                            : "";


                    return `

                        <article
                            class="
                                prediction-schedule-card
                                ${statusClass}
                            "
                        >

                            <div
                                class="
                                    schedule-card-left
                                "
                            >

                                <span
                                    class="
                                        schedule-lottery
                                    "
                                >
                                    ${getLotteryDisplayName(
                                        game.lottery
                                    )}
                                </span>


                                <h3>
                                    ${game.game}
                                </h3>


                                ${closeText}

                            </div>


                            <div
                                class="
                                    schedule-card-right
                                "
                            >

                                <strong>
                                    ${game.drawTime}
                                </strong>


                                <span
                                    class="
                                        schedule-status
                                    "
                                >
                                    ${statusText}
                                </span>

                            </div>

                        </article>

                    `;

                }
            )

            .join("");

}


// =========================================================
// DETECT GAME CHANGE
// =========================================================

let activePredictionGameKey =
    "";


async function checkForGameChange() {

    const nextGame =
        getNextPredictionGame();


    if (!nextGame) {
        return;
    }


    const gameKey =

        `${nextGame.drawDate}-` +

        `${nextGame.lottery}-` +

        `${nextGame.game}`;


    if (
        gameKey !==
        activePredictionGameKey
    ) {

        activePredictionGameKey =
            gameKey;


        await Promise.all([
            displayNextGamePrediction(),
            displayGhanaPrediction()
        ]);


        renderPredictionSchedule();

    }


    updateCountdown(
        nextGame
    );

}


// =========================================================
// START ENGINE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        modernPredictionRangeForm?.addEventListener("submit", async event => {
            event.preventDefault();

            let from = modernPredictionFromDate?.value || "";
            let to = modernPredictionToDate?.value || "";

            if (from && to && from > to) {
                [from, to] = [to, from];
                modernPredictionFromDate.value = from;
                modernPredictionToDate.value = to;
            }

            modernPredictionDateRange = { from, to };

            if (modernPredictionRangeStatus) {
                modernPredictionRangeStatus.textContent = from || to
                    ? `Evidence Fusion range: ${from || "earliest"} to ${to || "latest"}. Ghana history is unchanged.`
                    : "Using recent same-game evidence, machine conversion and controlled same-day context.";
            }

            await displayNextGamePrediction();
        });

        modernPredictionRangeReset?.addEventListener("click", async () => {
            modernPredictionRangeForm?.reset();
            modernPredictionDateRange = { from: "", to: "" };

            if (modernPredictionRangeStatus) {
                modernPredictionRangeStatus.textContent = "Using recent same-game evidence, machine conversion and controlled same-day context.";
            }

            await displayNextGamePrediction();
        });

        ghanaPredictionRangeForm?.addEventListener("submit", async event => {
            event.preventDefault();

            let from = ghanaPredictionFromDate?.value || "";
            let to = ghanaPredictionToDate?.value || "";

            if (from && to && from > to) {
                [from, to] = [to, from];
                ghanaPredictionFromDate.value = from;
                ghanaPredictionToDate.value = to;
            }

            ghanaPredictionDateRange = { from, to };

            if (ghanaPredictionRangeStatus) {
                ghanaPredictionRangeStatus.textContent = from || to
                    ? `${getGhanaPredictionGame()?.game || "Ghana game"} pattern range: ${from || "earliest"} to ${to || "latest"}. Modern history is unchanged.`
                    : "Using all verified results for the scheduled Ghana game.";
            }

            await displayGhanaPrediction();
        });

        ghanaPredictionRangeReset?.addEventListener("click", async () => {
            ghanaPredictionRangeForm?.reset();
            ghanaPredictionDateRange = { from: "", to: "" };

            if (ghanaPredictionRangeStatus) {
                ghanaPredictionRangeStatus.textContent = "Using all verified results for the scheduled Ghana game.";
            }

            await displayGhanaPrediction();
        });


        renderPredictionSchedule();


        const nextGame =
            getNextPredictionGame();


        if (nextGame) {

            activePredictionGameKey =

                `${nextGame.drawDate}-` +

                `${nextGame.lottery}-` +

                `${nextGame.game}`;

        }


        await Promise.all([
            displayNextGamePrediction(),
            displayGhanaPrediction()
        ]);

        await subscribeToModernResultUpdates();

        window.addEventListener(
            "pagehide",
            function () {
                if (modernResultsRealtimeChannel) {
                    supabaseClient.removeChannel(modernResultsRealtimeChannel);
                    modernResultsRealtimeChannel = null;
                }
            },
            { once: true }
        );


        // Countdown every second

        setInterval(
            function () {

                const currentGame =
                    getNextPredictionGame();


                if (currentGame) {

                    updateCountdown(
                        currentGame
                    );

                }

                const currentGhanaGame =
                    getGhanaPredictionGame();


                if (currentGhanaGame) {

                    updateCountdown(
                        currentGhanaGame,
                        ghanaCountdownTimer
                    );
                }

            },
            1000
        );


        // Detect next game every 30 seconds

        setInterval(
            checkForGameChange,
            30000
        );


        // Refresh schedule every minute

        setInterval(
            renderPredictionSchedule,
            60000
        );


        // Pull in newly published earlier games without requiring a page reload.

        setInterval(
            function () {

                displayNextGamePrediction();
                displayGhanaPrediction();
            },
            120000
        );


        // Lightweight backup polling in case realtime delivery is unavailable.

        setInterval(
            checkForNewPublishedModernResult,
            20000
        );

    }
);
