// =========================================================
// JEJOYINYE LOTTERY SERVICES
// COMPLETE PREDICTION ENGINE
// predictions.js
// Modern prediction engine v28
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

const nextGameSureBalls =
    document.getElementById("next-game-sure-balls");

const nextGameDirectBalls =
    document.getElementById("next-game-direct-balls");

const adaptiveWeightSummary =
    document.getElementById("adaptive-weight-summary");

const adaptivePatternSummary =
    document.getElementById("adaptive-pattern-summary");

const upcomingGamesList =
    document.getElementById("upcoming-games-list");

const aheadGamePredictions =
    document.getElementById("ahead-game-predictions");

const analysisDrawCount =
    document.getElementById("analysis-draw-count");

const analysisTodayCount =
    document.getElementById("analysis-today-count");

const predictionAnalysisList =
    document.getElementById("prediction-analysis-list");

const predictionRangeForm =
    document.getElementById("prediction-range-form");

const predictionFromDate =
    document.getElementById("prediction-from-date");

const predictionToDate =
    document.getElementById("prediction-to-date");

const predictionRangeReset =
    document.getElementById("prediction-range-reset");

const predictionRangeStatus =
    document.getElementById("prediction-range-status");

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

let modernPredictionDateRange = { from: "", to: "" };


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


// =========================================================
// PARSE DATABASE NUMBERS
// =========================================================

function parsePredictionNumbers(data) {

    if (
        data === null ||
        data === undefined
    ) {
        return [];
    }


    let numbers = [];


    if (Array.isArray(data)) {

        numbers = data;

    }

    else if (
        typeof data === "string"
    ) {

        const matches =
            data.match(/\d+/g);

        if (matches) {
            numbers = matches;
        }

    }

    else if (
        typeof data === "object"
    ) {

        const matches =
            JSON.stringify(data)
                .match(/\d+/g);

        if (matches) {
            numbers = matches;
        }

    }


    return numbers

        .map(number => Number(number))

        .filter(number =>
            Number.isInteger(number) &&
            number >= 1 &&
            number <= 90
        );
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

function getUpcomingModernPredictionGames(limit = 3) {

    const lagos =
        getLagosTime();


    const currentSeconds =

        (lagos.hour * 3600) +

        (lagos.minute * 60) +

        lagos.second;


    const today =
        getTodayDateString();


    const modernGamesToday =
        modernPredictionSchedule.map(
            game => ({
                ...game,
                drawDate: today
            })
        );

    const remainingToday = modernGamesToday.filter(
        game => (game.drawMinutes * 60) > currentSeconds
    );

    const tomorrow = getTomorrowDateString();
    const tomorrowGames = modernPredictionSchedule.map(
        game => ({
            ...game,
            drawDate: tomorrow,
            tomorrow: true
        })
    );

    return [...remainingToday, ...tomorrowGames].slice(0, limit);
}


function getNextPredictionGame() {

    return getUpcomingModernPredictionGames(1)[0] || null;
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

async function fetchPredictionHistory(game) {

    if (!game) {
        return [];
    }


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

        const rangeApplies =
            game.lottery === "modern-billionaire";

        if (rangeApplies && modernPredictionDateRange.from) {
            query = query.gte("draw_date", modernPredictionDateRange.from);
        }

        if (rangeApplies && modernPredictionDateRange.to) {
            query = query.lte("draw_date", modernPredictionDateRange.to);
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

                .limit(
                    rangeApplies
                        ? 45
                        : 500
                );


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
// GHANA HISTORY FALLBACK
// Uses all Ghana winning results when a scheduled game has
// no saved history. Modern's date range never filters Ghana.
// =========================================================

async function fetchGhanaFallbackHistory() {
    try {
        let query = supabaseClient
            .from("results")
            .select("game, lottery, draw_date, winning, machine")
            .eq("lottery", "ghana");

        const { data, error } = await query
            .order("draw_date", { ascending: false })
            .limit(500);

        if (error) {
            throw error;
        }

        return data || [];
    }

    catch (error) {
        console.error("Ghana fallback history error:", error);
        return [];
    }
}


// =========================================================
// PRESENT-DAY MODERN RESULTS
// Uses only actual Modern results already published today.
// =========================================================

async function fetchPresentDayModernResults() {
    try {
        const { data, error } = await supabaseClient
            .from("results")
            .select("game, lottery, draw_date, winning, machine")
            .eq("lottery", "modern-billionaire")
            .eq("draw_date", getTodayDateString())
            .limit(50);

        if (error) {
            throw error;
        }

        return data || [];
    }

    catch (error) {
        console.error("Present-day Modern results error:", error);
        return [];
    }
}


// =========================================================
// SHARED V28 SNAPSHOT ENGINE
// The default public prediction reads the same server-generated
// snapshot used by admin analytics. Custom date-range analysis can
// still use the browser fallback without changing the live snapshot.
// =========================================================

async function fetchModernPredictionSnapshot(game) {
    if (!game || game.lottery !== "modern-billionaire") {
        return null;
    }

    try {
        const { data, error } = await supabaseClient
            .from("prediction_snapshots")
            .select(
                "game,draw_date,engine_version,engine_profile," +
                "sure_numbers,direct_numbers,all_numbers,score_details," +
                "weights,historical_draws,generated_at,status"
            )
            .eq("lottery", "modern-billionaire")
            .eq("game", game.game)
            .eq("draw_date", game.drawDate)
            .eq("engine_version", "v28")
            .order("generated_at", { ascending: false })
            .limit(1);

        if (error) {
            throw error;
        }

        return Array.isArray(data) && data.length
            ? data[0]
            : null;
    }
    catch (error) {
        console.warn(
            "Shared v28 prediction snapshot unavailable:",
            error
        );
        return null;
    }
}

function numberArray(value) {
    return parsePredictionNumbers(value);
}

function numericValue(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number)
        ? number
        : fallback;
}

function snapshotToPredictionData(snapshot) {
    if (!snapshot) {
        return null;
    }

    const details = Array.isArray(snapshot.score_details)
        ? snapshot.score_details
        : [];

    const rankedData = details
        .map(detail => ({
            ...detail,
            number: numericValue(detail.number),
            totalScore: numericValue(detail.totalScore)
        }))
        .filter(detail => detail.number >= 1 && detail.number <= 90)
        .sort((a, b) =>
            numericValue(a.rank, 999) -
            numericValue(b.rank, 999)
        );

    const scoreMap = {};

    rankedData.forEach(item => {
        const classificationShares = [
            numericValue(item.weeklyClassificationAppliedShare),
            numericValue(item.monthlyClassificationAppliedShare),
            numericValue(item.presentDayClassificationAppliedShare)
        ];

        scoreMap[item.number] = {
            ...item,
            currentMonthScoreNormalized:
                numericValue(item.monthlySupportComponent),
            recentScoreNormalized:
                numericValue(item.weeklyComponent),
            presentDayScoreNormalized:
                numericValue(item.presentDayComponent),
            currentMonthClassificationScoreNormalized:
                numericValue(item.monthlySupportClassificationScore),
            recentClassificationScoreNormalized:
                numericValue(item.weeklyClassificationScore),
            presentDayClassificationScoreNormalized:
                numericValue(item.presentDayClassificationScore),
            currentMonthMovingScoreNormalized:
                numericValue(item.monthlySupportMovingScore),
            recentMovingScoreNormalized:
                numericValue(item.weeklyMovingScore),
            presentDayMovingScoreNormalized:
                numericValue(item.presentDayMovingScore),
            adaptiveClassificationShare:
                Math.max(...classificationShares),
            pairSupportNormalized:
                numericValue(item.pairSupportNormalized),
            previousGameCarryoverNormalized:
                numericValue(item.previousGameCarryoverNormalized),
            feedbackPenalty:
                numericValue(item.feedbackPenalty),
            feedbackHitCount:
                numericValue(item.feedbackHitCount),
            feedbackMissCount:
                numericValue(item.feedbackMissCount),
            totalScore:
                numericValue(item.totalScore)
        };
    });

    const weights = snapshot.weights || {};

    return {
        source: "shared-v28-snapshot",
        engineVersion: snapshot.engine_version || "v28",
        engineProfile: snapshot.engine_profile || "",
        predictedNumbers: numberArray(snapshot.all_numbers),
        sureNumbers: numberArray(snapshot.sure_numbers),
        directNumbers: numberArray(snapshot.direct_numbers),
        rankedData,
        scoreMap,
        recentDraws:
            numericValue(weights.recentTargetDraws, snapshot.historical_draws || 0),
        currentMonthDraws:
            numericValue(weights.currentMonthDraws),
        adaptiveWeights: {
            recent: numericValue(weights.weeklyTargetGame, 0.60),
            month: numericValue(weights.currentMonthSupport, 0.30),
            today: numericValue(weights.presentDayResults, 0.10),
            moving: numericValue(weights.movingShare, 0.10)
        },
        dailyPattern: {
            strength: numericValue(weights.dailyPatternStrength),
            repeatRate: numericValue(weights.dailyRepeatRate),
            movingConfirmation:
                numericValue(weights.dailyMovingConfirmation),
            classificationConfirmation:
                numericValue(weights.dailyClassificationConfirmation),
            averageHits:
                numericValue(weights.dailyPredictionAverageHits)
        }
    };
}

function renderNumberBalls(numbers, compact = false) {
    if (!numbers || !numbers.length) {
        return '<span class="prediction-group-empty">--</span>';
    }

    return numbers.map(number => `
        <span class="${compact ? "prediction-mini-ball" : "number-ball"}">
            ${String(number).padStart(2, "0")}
        </span>
    `).join("");
}

function displayPredictionGroups(predictionData) {
    displayPredictionBalls(
        predictionData?.predictedNumbers || []
    );

    if (nextGameSureBalls) {
        nextGameSureBalls.innerHTML =
            renderNumberBalls(
                predictionData?.sureNumbers ||
                predictionData?.rankedData
                    ?.slice(0, 2)
                    .map(item => item.number) ||
                [],
                true
            );
    }

    if (nextGameDirectBalls) {
        nextGameDirectBalls.innerHTML =
            renderNumberBalls(
                predictionData?.directNumbers ||
                predictionData?.rankedData
                    ?.slice(2, 5)
                    .map(item => item.number) ||
                [],
                true
            );
    }

    const weights = predictionData?.adaptiveWeights;

    if (adaptiveWeightSummary) {
        adaptiveWeightSummary.textContent = weights
            ? `7-Day ${Math.round(weights.recent * 100)}% • Month ${Math.round(weights.month * 100)}% • Today ${Math.round(weights.today * 100)}% • Moving ${Math.round(weights.moving * 100)}%`
            : "Adaptive weights calculated from live draw evidence";
    }

    if (adaptivePatternSummary) {
        const pattern = predictionData?.dailyPattern;
        adaptivePatternSummary.textContent = pattern
            ? `Daily pattern strength ${Math.round(pattern.strength * 100)}% • Movement confirmation ${Math.round(pattern.movingConfirmation * 100)}%`
            : "Daily pattern profile updates after each completed Modern draw";
    }
}


// =========================================================
// MODERN BILLIONAIRE CLASSIFICATION CHART
// 60% statistics + 30% classification + 10% moving numbers
// =========================================================

const MODERN_PREDICTION_WEIGHTS = Object.freeze({
    statistical: 0.60,
    classification: 0.30,
    moving: 0.10
});

// The target game remains the priority. Its previous seven calendar
// days carry 60%, wider current-month history supports with 30%, and
// results already released today carry 10%.
const MODERN_RESULTS_SOURCE_WEIGHTS = Object.freeze({
    currentMonth: 0.30,
    recentTargetGame: 0.60,
    presentDayResults: 0.10,
    weeklyIntervalDays: 7,
    previousMonthFallbackDraws: 7,
    previousMonthFallbackWeight: 0.35
});

// Moving numbers remain a controlled 10% signal. Classification is now
// adaptive: it is applied only when statistical and/or moving evidence
// corroborates the classification relationship for that candidate.
const MODERN_CLASSIFICATION_MAX_SHARE = 0.20;
const MODERN_CLASSIFICATION_MEDIUM_SHARE = 0.10;
const MODERN_MOVING_SHARE = 0.10;

const GHANA_PREDICTION_WEIGHTS = Object.freeze({
    statistical: 0.70,
    classification: 0.25,
    moving: 0.05
});

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

function getAdaptiveModernClassificationShare(
    actualScore,
    classificationScore,
    movingScore
) {
    // Ignore weak chart-only signals. Classification earns influence only
    // when it converges with direct statistics or the moving-number graph.
    if (classificationScore < 35) {
        return 0;
    }

    const strongStatisticalAgreement =
        actualScore >= 30 &&
        classificationScore >= 50;

    const strongMovingAgreement =
        movingScore >= 50 &&
        classificationScore >= 60;

    if (
        strongStatisticalAgreement ||
        strongMovingAgreement
    ) {
        return MODERN_CLASSIFICATION_MAX_SHARE;
    }

    const moderateStatisticalAgreement =
        actualScore >= 15 &&
        classificationScore >= 45;

    const moderateMovingAgreement =
        movingScore >= 30 &&
        classificationScore >= 70;

    if (
        moderateStatisticalAgreement ||
        moderateMovingAgreement
    ) {
        return MODERN_CLASSIFICATION_MEDIUM_SHARE;
    }

    return 0;
}

function blendModernAdaptiveComponent(
    actualScore,
    classificationScore,
    movingScore
) {
    const classificationShare =
        getAdaptiveModernClassificationShare(
            actualScore,
            classificationScore,
            movingScore
        );

    const actualShare =
        1 -
        MODERN_MOVING_SHARE -
        classificationShare;

    return {
        score:
            (actualScore * actualShare) +
            (classificationScore * classificationShare) +
            (movingScore * MODERN_MOVING_SHARE),
        classificationShare,
        actualShare
    };
}


function addModernRelationshipScores(scoreMap, sourceNumber, weight) {
    const relationships = MODERN_CLASSIFICATION_CHART[sourceNumber];

    if (relationships) {
        Object.values(relationships).forEach(target => {
            if (target >= 1 && target <= 90) {
                scoreMap[target].classificationScore += weight;
            }
        });
    }

    (MODERN_MOVING_GRAPH[sourceNumber] || []).forEach(target => {
        scoreMap[target].movingScore += weight;
    });
}

function applyModernClassificationRanking(
    scoreMap,
    results,
    _todayResults,
    predictionWeights = MODERN_PREDICTION_WEIGHTS,
    contextResults = [],
    includeMachineRelationships = true
) {
    function buildSourceSignals(sourceResults, priority) {
        if (!sourceResults.length || priority <= 0) {
            return [];
        }

        const recencyWeights = sourceResults.map(
            (_, index) => Math.max(0.40, 1 - (index * 0.20))
        );

        const totalWeight =
            recencyWeights.reduce((sum, weight) => sum + weight, 0) || 1;

        return sourceResults.map((result, index) => ({
            result,
            weight: priority * (recencyWeights[index] / totalWeight)
        }));
    }

    let signalResults;

    if (includeMachineRelationships) {
        const targetGameResults =
            results.slice(0, 3);

        signalResults = [
            ...buildSourceSignals(
                targetGameResults,
                1
            )
        ];
    }

    else {
        // Preserve the separate Ghana model and its winning-number-only rules.
        signalResults = [
            ...contextResults.slice(0, 3).map((result, index) => ({
                result,
                weight: Math.max(0.75, 1.35 - (index * 0.20))
            })),
            ...results.slice(0, 5).map((result, index) => ({
                result,
                weight: Math.max(0.35, 1 - (index * 0.15))
            }))
        ];
    }

    signalResults.forEach(({ result, weight }) => {
        parsePredictionNumbers(result.winning).forEach(number => {
            addModernRelationshipScores(scoreMap, number, weight);
        });

        if (includeMachineRelationships) {
            parsePredictionNumbers(result.machine).forEach(number => {
                addModernRelationshipScores(scoreMap, number, weight * 0.45);
            });
        }
    });

    Object.values(scoreMap).forEach(item => {
        item.statisticalScore = item.totalScore;
    });

    normalizePredictionComponent(scoreMap, "statisticalScore");
    normalizePredictionComponent(scoreMap, "classificationScore");
    normalizePredictionComponent(scoreMap, "movingScore");

    Object.values(scoreMap).forEach(item => {
        item.totalScore =
            (item.statisticalScoreNormalized * predictionWeights.statistical) +
            (item.classificationScoreNormalized * predictionWeights.classification) +
            (item.movingScoreNormalized * predictionWeights.moving);
    });
}


// =========================================================
// STATISTICAL PREDICTION ALGORITHM
// =========================================================

function calculateStatisticalPrediction(
    results,
    _todayResults = [],
    useModernClassification = false,
    predictionWeights = MODERN_PREDICTION_WEIGHTS,
    contextResults = [],
    includeMachineRelationships = true
) {

    const scoreMap = {};


    for (
        let number = 1;
        number <= 90;
        number++
    ) {

        scoreMap[number] = {

            number: number,

            winningFrequency: 0,

            machineFrequency: 0,

            recentScore: 0,

            statisticalScore: 0,

            classificationScore: 0,

            movingScore: 0,

            totalScore: 0

        };

    }


    results.forEach(
        (result, index) => {


            const winningNumbers =
                parsePredictionNumbers(
                    result.winning
                );


            const machineNumbers =
                parsePredictionNumbers(
                    result.machine
                );


            const recencyWeight =
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


            winningNumbers.forEach(
                number => {

                    scoreMap[
                        number
                    ].winningFrequency += 1;


                    scoreMap[
                        number
                    ].recentScore +=
                        2.4 *
                        recencyWeight;

                }
            );


            machineNumbers.forEach(
                number => {

                    scoreMap[
                        number
                    ].machineFrequency += 1;


                    scoreMap[
                        number
                    ].recentScore +=
                        0.7 *
                        recencyWeight;

                }
            );

        }
    );

    Object.values(
        scoreMap
    ).forEach(item => {


        item.targetGameScore =
            (item.winningFrequency * 3.5) +
            (item.machineFrequency * 0.8) +
            item.recentScore;

    });

    normalizePredictionComponent(scoreMap, "targetGameScore");

    Object.values(scoreMap).forEach(item => {
        item.totalScore =
            item.targetGameScoreNormalized;
    });


    if (useModernClassification) {
        applyModernClassificationRanking(
            scoreMap,
            results,
            [],
            predictionWeights,
            contextResults,
            includeMachineRelationships
        );
    }


    const rankedNumbers =
        Object.values(
            scoreMap
        )

            .sort(
                (a, b) => {

                    if (
                        b.totalScore !==
                        a.totalScore
                    ) {

                        return (
                            b.totalScore -
                            a.totalScore
                        );

                    }


                    return (
                        a.number -
                        b.number
                    );

                }
            );


    return {

        predictedNumbers:
            rankedNumbers

                .slice(0, 5)

                .map(
                    item =>
                        item.number
                )

                .sort(
                    (a, b) =>
                        a - b
                ),

        rankedData:
            rankedNumbers,

        scoreMap:
            scoreMap

    };

}


// =========================================================
// MODERN BROWSER FALLBACK — V28
// 60% same-game results from the previous seven calendar days,
// 30% wider current-month support and 10% today's published
// results. When the month has fewer than seven draws, prior-month
// draws support the monthly component at reduced strength.
// Moving numbers retain 10%. Classification contributes 0%, 10%
// or 20% only when statistics and/or moving evidence corroborate it.
// =========================================================

function calculateModernResultsPrediction(
    targetResults,
    presentDayResults = [],
    predictionDrawDate = getTodayDateString()
) {
    const scoreMap = {};
    const hasCustomRange = Boolean(
        modernPredictionDateRange.from ||
        modernPredictionDateRange.to
    );
    const referenceDate =
        modernPredictionDateRange.to ||
        predictionDrawDate ||
        getTodayDateString();
    const referenceMonth =
        String(referenceDate).slice(0, 7);

    const currentMonthResults = hasCustomRange
        ? targetResults
        : targetResults.filter(result => {
            const drawDate = String(result.draw_date || "");
            return drawDate.startsWith(referenceMonth) &&
                drawDate < referenceDate;
        });

    const previousMonthFallback =
        !hasCustomRange && currentMonthResults.length < 7
            ? targetResults
                .filter(result => {
                    const drawDate = String(result.draw_date || "");
                    return drawDate &&
                        !drawDate.startsWith(referenceMonth) &&
                        drawDate < referenceDate;
                })
                .slice(
                    0,
                    MODERN_RESULTS_SOURCE_WEIGHTS
                        .previousMonthFallbackDraws
                )
            : [];

    const monthlyPool = [
        ...currentMonthResults,
        ...previousMonthFallback
    ];
    const weeklyStart = new Date(`${referenceDate}T00:00:00Z`);
    weeklyStart.setUTCDate(
        weeklyStart.getUTCDate() -
        MODERN_RESULTS_SOURCE_WEIGHTS.weeklyIntervalDays
    );
    const weeklyStartDate = weeklyStart.toISOString().slice(0, 10);
    const recentPool = monthlyPool.filter(result => {
        const drawDate = String(result.draw_date || "");
        return drawDate >= weeklyStartDate &&
            drawDate < referenceDate;
    });
    const recentWeights = [
        1.60,
        1.45,
        1.30,
        1.15,
        1.00,
        0.85,
        0.70
    ];
    const fallbackSet = new Set(previousMonthFallback);

    for (let number = 1; number <= 90; number++) {
        scoreMap[number] = {
            number,
            winningFrequency: 0,
            machineFrequency: 0,
            todayWinningFrequency: 0,
            todayMachineFrequency: 0,
            monthlyWinningEvidence: 0,
            monthlyMachineEvidence: 0,
            currentMonthScore: 0,
            currentMonthClassificationScore: 0,
            currentMonthMovingScore: 0,
            recentScore: 0,
            recentClassificationScore: 0,
            recentMovingScore: 0,
            targetGameScore: 0,
            presentDayScore: 0,
            presentDayClassificationScore: 0,
            presentDayMovingScore: 0,
            totalScore: 0
        };
    }

    function addRelationshipSignals(
        classificationProperty,
        movingProperty,
        sourceNumber,
        weight
    ) {
        const relationships = MODERN_CLASSIFICATION_CHART[sourceNumber];

        if (relationships) {
            Object.values(relationships).forEach(target => {
                if (target >= 1 && target <= 90) {
                    scoreMap[target][classificationProperty] += weight;
                }
            });
        }

        (MODERN_MOVING_GRAPH[sourceNumber] || []).forEach(target => {
            scoreMap[target][movingProperty] += weight;
        });
    }

    monthlyPool.forEach(result => {
        const winningNumbers = parsePredictionNumbers(result.winning);
        const machineNumbers = parsePredictionNumbers(result.machine);
        const sourceWeight = fallbackSet.has(result)
            ? MODERN_RESULTS_SOURCE_WEIGHTS.previousMonthFallbackWeight
            : 1;

        winningNumbers.forEach(number => {
            scoreMap[number].winningFrequency += 1;
            scoreMap[number].monthlyWinningEvidence += sourceWeight;
            addRelationshipSignals(
                "currentMonthClassificationScore",
                "currentMonthMovingScore",
                number,
                sourceWeight
            );
        });

        machineNumbers.forEach(number => {
            scoreMap[number].machineFrequency += 1;
            scoreMap[number].monthlyMachineEvidence += sourceWeight;
            addRelationshipSignals(
                "currentMonthClassificationScore",
                "currentMonthMovingScore",
                number,
                sourceWeight * 0.25
            );
        });
    });

    // Saturating frequency performed better than raw linear frequency
    // in walk-forward checks. It keeps monthly evidence important while
    // preventing one repeatedly hot number from crowding out movement.
    Object.values(scoreMap).forEach(item => {
        item.currentMonthScore =
            (3.5 * Math.sqrt(item.monthlyWinningEvidence)) +
            (0.8 * Math.sqrt(item.monthlyMachineEvidence));
    });

    recentPool.forEach((result, index) => {
        const winningNumbers = parsePredictionNumbers(result.winning);
        const machineNumbers = parsePredictionNumbers(result.machine);
        const recencyWeight = recentWeights[index] || 0.70;

        winningNumbers.forEach(number => {
            scoreMap[number].recentScore += 3.5 * recencyWeight;
            addRelationshipSignals(
                "recentClassificationScore",
                "recentMovingScore",
                number,
                recencyWeight
            );
        });

        machineNumbers.forEach(number => {
            scoreMap[number].recentScore += 0.8 * recencyWeight;
            addRelationshipSignals(
                "recentClassificationScore",
                "recentMovingScore",
                number,
                recencyWeight * 0.25
            );
        });
    });

    presentDayResults.forEach(result => {
        parsePredictionNumbers(result.winning).forEach(number => {
            scoreMap[number].todayWinningFrequency += 1;
            addRelationshipSignals(
                "presentDayClassificationScore",
                "presentDayMovingScore",
                number,
                1
            );
        });

        parsePredictionNumbers(result.machine).forEach(number => {
            scoreMap[number].todayMachineFrequency += 1;
            addRelationshipSignals(
                "presentDayClassificationScore",
                "presentDayMovingScore",
                number,
                0.25
            );
        });
    });

    Object.values(scoreMap).forEach(item => {
        item.presentDayScore =
            (item.todayWinningFrequency * 3.0) +
            (item.todayMachineFrequency * 0.7);
    });

    normalizePredictionComponent(scoreMap, "currentMonthScore");
    normalizePredictionComponent(
        scoreMap,
        "currentMonthClassificationScore"
    );
    normalizePredictionComponent(scoreMap, "recentScore");
    normalizePredictionComponent(
        scoreMap,
        "recentClassificationScore"
    );
    normalizePredictionComponent(scoreMap, "presentDayScore");
    normalizePredictionComponent(
        scoreMap,
        "presentDayClassificationScore"
    );
    normalizePredictionComponent(scoreMap, "currentMonthMovingScore");
    normalizePredictionComponent(scoreMap, "recentMovingScore");
    normalizePredictionComponent(scoreMap, "presentDayMovingScore");

    Object.values(scoreMap).forEach(item => {
        const currentMonthBlend =
            blendModernAdaptiveComponent(
                item.currentMonthScoreNormalized,
                item.currentMonthClassificationScoreNormalized,
                item.currentMonthMovingScoreNormalized
            );

        const recentBlend =
            blendModernAdaptiveComponent(
                item.recentScoreNormalized,
                item.recentClassificationScoreNormalized,
                item.recentMovingScoreNormalized
            );

        const presentDayBlend =
            blendModernAdaptiveComponent(
                item.presentDayScoreNormalized,
                item.presentDayClassificationScoreNormalized,
                item.presentDayMovingScoreNormalized
            );

        item.currentMonthComponent =
            currentMonthBlend.score;
        item.currentMonthClassificationShare =
            currentMonthBlend.classificationShare;

        item.recentComponent =
            recentBlend.score;
        item.recentClassificationShare =
            recentBlend.classificationShare;

        item.presentDayComponent =
            presentDayBlend.score;
        item.presentDayClassificationShare =
            presentDayBlend.classificationShare;

        item.adaptiveClassificationShare =
            (item.recentClassificationShare *
                MODERN_RESULTS_SOURCE_WEIGHTS.recentTargetGame) +
            (item.currentMonthClassificationShare *
                MODERN_RESULTS_SOURCE_WEIGHTS.currentMonth) +
            (item.presentDayClassificationShare *
                MODERN_RESULTS_SOURCE_WEIGHTS.presentDayResults);

        item.targetGameScoreNormalized =
            (item.recentComponent * (2 / 3)) +
            (item.currentMonthComponent * (1 / 3));

        item.totalScore =
            (item.currentMonthComponent *
                MODERN_RESULTS_SOURCE_WEIGHTS.currentMonth) +
            (item.recentComponent *
                MODERN_RESULTS_SOURCE_WEIGHTS.recentTargetGame) +
            (item.presentDayComponent *
                MODERN_RESULTS_SOURCE_WEIGHTS.presentDayResults);
    });

    const rankedNumbers = Object.values(scoreMap).sort((a, b) => {
        if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
        }

        return a.number - b.number;
    });

    return {
        predictedNumbers: rankedNumbers
            .slice(0, 5)
            .map(item => item.number)
            .sort((a, b) => a - b),
        sureNumbers: rankedNumbers
            .slice(0, 2)
            .map(item => item.number),
        directNumbers: rankedNumbers
            .slice(2, 5)
            .map(item => item.number),
        rankedData: rankedNumbers,
        scoreMap,
        currentMonthDraws: currentMonthResults.length,
        fallbackDraws: previousMonthFallback.length,
        recentDraws: recentPool.length
    };
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

function displayPredictionBalls(
    numbers
) {

    if (!nextGameBalls) {
        return;
    }


    if (
        !numbers ||
        numbers.length < 5
    ) {

        nextGameBalls.innerHTML = `

            <span
                style="
                    color:#64748b;
                    font-weight:700;
                "
            >
                Insufficient historical data
            </span>

        `;


        return;

    }


    nextGameBalls.innerHTML =
        numbers

            .map(
                number => `

                    <span
                        class="number-ball"
                    >
                        ${String(
                            number
                        ).padStart(
                            2,
                            "0"
                        )}
                    </span>

                `
            )

            .join("");

}


function buildPredictionReasons(item) {
    const reasons = [];

    if (numericValue(item.recentScoreNormalized) >= 35) {
        reasons.push("7-day same-game frequency");
    }

    const movingSupport = Math.max(
        numericValue(item.recentMovingScoreNormalized),
        numericValue(item.currentMonthMovingScoreNormalized),
        numericValue(item.presentDayMovingScoreNormalized)
    );

    if (movingSupport > 0) {
        reasons.push("moving-number support");
    }

    if (numericValue(item.adaptiveClassificationShare) > 0) {
        reasons.push("classification confirmed");
    }

    if (numericValue(item.pairSupportNormalized) >= 25) {
        reasons.push("repeated pair relationship");
    }

    if (numericValue(item.previousGameCarryoverNormalized) > 0) {
        reasons.push("previous-game carryover");
    }

    if (numericValue(item.presentDayScoreNormalized) >= 25) {
        reasons.push("today's draw activity");
    }

    if (numericValue(item.feedbackPenalty) > 0) {
        reasons.push("recent-miss penalty applied");
    }

    if (!reasons.length) {
        reasons.push("combined statistical ranking");
    }

    return reasons.slice(0, 4);
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


                                <div class="prediction-reason-list">
                                    ${buildPredictionReasons(item)
                                        .map(reason => `
                                            <span class="prediction-reason-chip">
                                                ${reason}
                                            </span>
                                        `)
                                        .join("")}
                                </div>

                                <div
                                    class="
                                        analysis-stats
                                    "
                                >

                                    <div>

                                        <span>
                                            Target Winning Appearances
                                        </span>

                                        <strong>
                                            ${item.winningFrequency ?? "—"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Target Machine Appearances
                                        </span>

                                        <strong>
                                            ${item.machineFrequency ?? "—"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Today's Winning Activity
                                        </span>

                                        <strong>
                                            ${item.todayWinningFrequency ?? "—"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Today's Machine Activity
                                        </span>

                                        <strong>
                                            ${item.todayMachineFrequency ?? "—"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Current-Month Score
                                        </span>

                                        <strong>
                                            ${item.currentMonthScoreNormalized.toFixed(1)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Recent-Game Score
                                        </span>

                                        <strong>
                                            ${item.recentScoreNormalized.toFixed(1)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Present-Day Score
                                        </span>

                                        <strong>
                                            ${item.presentDayScoreNormalized.toFixed(1)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Classification Support
                                        </span>

                                        <strong>
                                            ${(
                                                (item.recentClassificationScoreNormalized * 0.60) +
                                                (item.currentMonthClassificationScoreNormalized * 0.30) +
                                                (item.presentDayClassificationScoreNormalized * 0.10)
                                            ).toFixed(1)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Classification Applied
                                        </span>

                                        <strong>
                                            ${(
                                                (item.adaptiveClassificationShare || 0) *
                                                100
                                            ).toFixed(0)}%
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Moving-Number Support
                                        </span>

                                        <strong>
                                            ${(
                                                (item.recentMovingScoreNormalized * 0.60) +
                                                (item.currentMonthMovingScoreNormalized * 0.30) +
                                                (item.presentDayMovingScoreNormalized * 0.10)
                                            ).toFixed(1)}
                                        </strong>

                                    </div>


                                    <div>
                                        <span>Pair Relationship</span>
                                        <strong>
                                            ${numericValue(item.pairSupportNormalized).toFixed(0)}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Previous-Game Carryover</span>
                                        <strong>
                                            ${numericValue(item.previousGameCarryoverNormalized).toFixed(0)}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Recent-Miss Penalty</span>
                                        <strong>
                                            ${numericValue(item.feedbackPenalty).toFixed(1)}
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
// BACKEND PREDICTION RECORD
// The database recalculates and freezes the official snapshot.
// Custom date-range previews are intentionally not audited.
// =========================================================

async function saveModernPredictionSnapshot(
    game,
    predictionType
) {
    if (
        !game ||
        game.lottery !== "modern-billionaire" ||
        modernPredictionDateRange.from ||
        modernPredictionDateRange.to
    ) {
        return;
    }

    try {
        const { error } = await supabaseClient.rpc(
            "record_modern_prediction_snapshot",
            {
                p_game: game.game,
                p_draw_date: game.drawDate,
                p_prediction_type: predictionType
            }
        );

        if (error) {
            throw error;
        }
    }
    catch (error) {
        console.warn(
            "Prediction snapshot could not be saved:",
            error
        );
    }
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

        const [history, presentDayResults, sharedSnapshot] = await Promise.all([
            fetchPredictionHistory(nextGame),
            fetchPresentDayModernResults(),
            modernPredictionDateRange.from || modernPredictionDateRange.to
                ? Promise.resolve(null)
                : fetchModernPredictionSnapshot(nextGame)
        ]);


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
                analysisTodayCount.textContent = presentDayResults.length;
            }

            return;

        }


        const predictionData =
            snapshotToPredictionData(sharedSnapshot) ||
            calculateModernResultsPrediction(
                history,
                presentDayResults,
                nextGame.drawDate
            );


        displayPredictionGroups(
            predictionData
        );


        displayPredictionAnalysis(
            predictionData,
            predictionData.recentDraws,
            presentDayResults.length
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
// DISPLAY AHEAD-GAME PREDICTIONS
// Shows the two games following the primary next draw.
// Each game uses its own history and today's published results.
// =========================================================

function formatAheadDrawDate(game) {
    if (game.drawDate === getTodayDateString()) {
        return "Today";
    }

    if (game.drawDate === getTomorrowDateString()) {
        return "Tomorrow";
    }

    return game.drawDate;
}


function renderAheadBalls(numbers) {
    if (!numbers || numbers.length < 5) {
        return `<span class="ahead-prediction-message">Insufficient historical data</span>`;
    }

    return numbers.map(number => `
        <span class="number-ball">
            ${String(number).padStart(2, "0")}
        </span>
    `).join("");
}


async function displayAheadGamePredictions() {
    if (!aheadGamePredictions) {
        return;
    }

    const aheadGames = getUpcomingModernPredictionGames(3).slice(1);

    if (!aheadGames.length) {
        aheadGamePredictions.innerHTML = `
            <p class="ahead-prediction-message">No later games are scheduled.</p>
        `;
        return;
    }

    aheadGamePredictions.innerHTML = aheadGames.map(game => `
        <article class="ahead-prediction-card">
            <span class="ahead-prediction-badge">EARLY PREDICTION</span>
            <h3>${game.game}</h3>
            <p>${formatAheadDrawDate(game)} • ${game.drawTime}</p>
            <div class="ahead-prediction-balls prediction-balls winning-numbers">
                <span class="ahead-prediction-message">Analysing game history...</span>
            </div>
        </article>
    `).join("");

    const presentDayResults = await fetchPresentDayModernResults();

    const predictionResults = await Promise.all(
        aheadGames.map(async game => {
            const [history, sharedSnapshot] = await Promise.all([
                fetchPredictionHistory(game),
                modernPredictionDateRange.from || modernPredictionDateRange.to
                    ? Promise.resolve(null)
                    : fetchModernPredictionSnapshot(game)
            ]);

            if (!history.length && !sharedSnapshot) {
                return { game, history, presentDayResults, predictionData: null };
            }

            return {
                game,
                history,
                presentDayResults,
                predictionData:
                    snapshotToPredictionData(sharedSnapshot) ||
                    calculateModernResultsPrediction(
                        history,
                        presentDayResults,
                        game.drawDate
                    )
            };
        })
    );

    aheadGamePredictions.innerHTML = predictionResults.map(result => `
        <article class="ahead-prediction-card">
            <span class="ahead-prediction-badge">EARLY PREDICTION</span>
            <h3>${result.game.game}</h3>
            <p>${formatAheadDrawDate(result.game)} • ${result.game.drawTime}</p>
            <div class="ahead-prediction-balls prediction-balls winning-numbers">
                ${renderAheadBalls(result.predictionData?.predictedNumbers)}
            </div>
            <div class="ahead-prediction-meta">
                <span>${result.predictionData?.recentDraws || 0} weekly draws analysed</span>
                <span>${result.presentDayResults.length} results published today</span>
            </div>
            <small>${result.predictionData?.adaptiveWeights
                ? `Adaptive: ${Math.round(result.predictionData.adaptiveWeights.recent * 100)}% 7-Day • ${Math.round(result.predictionData.adaptiveWeights.month * 100)}% Month • ${Math.round(result.predictionData.adaptiveWeights.today * 100)}% Today`
                : "Adaptive fallback • Classification + Moving Active"}</small>
        </article>
    `).join("");
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

        const gameHistory =
            await fetchPredictionHistory(
                ghanaGame
            );

        const allGhanaHistory =
            await fetchGhanaFallbackHistory();

        const history =
            gameHistory.length
                ? gameHistory
                : allGhanaHistory;

        const supportingGhanaHistory =
            gameHistory.length
                ? allGhanaHistory
                    .filter(result => result.game !== ghanaGame.game)
                    .slice(0, 3)
                : [];


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
            calculateStatisticalPrediction(
                history,
                [],
                true,
                GHANA_PREDICTION_WEIGHTS,
                supportingGhanaHistory,
                false
            );


        if (ghanaGameBalls) {

            ghanaGameBalls.innerHTML =

                predictionData
                    .predictedNumbers

                    .map(
                        number => `

                            <span class="number-ball">
                                ${String(number).padStart(2, "0")}
                            </span>

                        `
                    )

                    .join("");
        }

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
            displayAheadGamePredictions(),
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

        predictionRangeForm?.addEventListener("submit", async event => {
            event.preventDefault();

            let from = predictionFromDate?.value || "";
            let to = predictionToDate?.value || "";

            if (from && to && from > to) {
                [from, to] = [to, from];
                predictionFromDate.value = from;
                predictionToDate.value = to;
            }

            modernPredictionDateRange = { from, to };

            if (predictionRangeStatus) {
                predictionRangeStatus.textContent = from || to
                    ? `Modern Billionaire range: ${from || "earliest"} to ${to || "latest"}. Ghana remains unchanged.`
                    : "Modern Billionaire is using all history. Ghana remains unchanged.";
            }

            await Promise.all([
                displayNextGamePrediction(),
                displayAheadGamePredictions()
            ]);
        });

        predictionRangeReset?.addEventListener("click", async () => {
            predictionRangeForm?.reset();
            modernPredictionDateRange = { from: "", to: "" };

            if (predictionRangeStatus) {
                predictionRangeStatus.textContent = "Modern Billionaire is using all history. Ghana remains unchanged.";
            }

            await Promise.all([
                displayNextGamePrediction(),
                displayAheadGamePredictions()
            ]);
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
            displayAheadGamePredictions(),
            displayGhanaPrediction()
        ]);


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


        // Refresh predictions without requiring a page reload.

        setInterval(
            function () {

                displayNextGamePrediction();
                displayAheadGamePredictions();
                displayGhanaPrediction();
            },
            120000
        );

    }
);
