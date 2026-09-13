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

const upcomingGamesList =
    document.getElementById("upcoming-games-list");

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

let predictionDateRange = { from: "", to: "" };


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

        if (predictionDateRange.from) {
            query = query.gte("draw_date", predictionDateRange.from);
        }

        if (predictionDateRange.to) {
            query = query.lte("draw_date", predictionDateRange.to);
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
// GHANA HISTORY FALLBACK
// Uses all Ghana winning results when a scheduled game has
// no saved history in the selected period.
// =========================================================

async function fetchGhanaFallbackHistory() {
    try {
        let query = supabaseClient
            .from("results")
            .select("game, lottery, draw_date, winning, machine")
            .eq("lottery", "ghana");

        if (predictionDateRange.from) {
            query = query.gte("draw_date", predictionDateRange.from);
        }

        if (predictionDateRange.to) {
            query = query.lte("draw_date", predictionDateRange.to);
        }

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
// TODAY'S EARLIER PUBLISHED GAMES
// =========================================================

async function fetchTodaysEarlierResults(game) {

    if (!game || game.drawDate !== getTodayDateString()) {
        return [];
    }

    const earlierGameNames = getTodaysGames()
        .filter(item =>
            item.lottery === game.lottery &&
            item.drawMinutes < game.drawMinutes
        )
        .flatMap(item => item.databaseNames || [item.game]);

    if (!earlierGameNames.length) {
        return [];
    }

    try {
        const { data, error } = await supabaseClient
            .from("results")
            .select("game, lottery, draw_date, winning, machine")
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
// MODERN BILLIONAIRE CLASSIFICATION CHART
// 60% statistics + 30% classification + 10% moving numbers
// =========================================================

const MODERN_PREDICTION_WEIGHTS = Object.freeze({
    statistical: 0.60,
    classification: 0.30,
    moving: 0.10
});

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
    todayResults,
    predictionWeights = MODERN_PREDICTION_WEIGHTS,
    contextResults = [],
    includeMachineRelationships = true
) {
    const signalResults = [
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
    ];

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
    todayResults = [],
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

            todayFrequency: 0,

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

    // Same-day results carry extra recency weight because they reflect
    // the number activity immediately before the upcoming game.
    const todayWinningWeight = Math.max(7, results.length * 0.09);
    const todayMachineWeight = Math.max(2, results.length * 0.025);

    todayResults.forEach(result => {
        const winningNumbers = parsePredictionNumbers(result.winning);
        const machineNumbers = parsePredictionNumbers(result.machine);

        winningNumbers.forEach(number => {
            scoreMap[number].todayFrequency += 1;
            scoreMap[number].recentScore += todayWinningWeight;
        });

        machineNumbers.forEach(number => {
            scoreMap[number].todayFrequency += 0.35;
            scoreMap[number].recentScore += todayMachineWeight;
        });
    });


    Object.values(
        scoreMap
    ).forEach(item => {


        item.totalScore =

            (
                item.winningFrequency *
                3.5
            )

            +

            (
                item.machineFrequency *
                0.8
            )

            +

            item.recentScore;

    });


    if (useModernClassification) {
        applyModernClassificationRanking(
            scoreMap,
            results,
            todayResults,
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
                                            Recent Activity Score
                                        </span>

                                        <strong>
                                            ${item.recentScore.toFixed(
                                                1
                                            )}
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

        const [history, todayResults] = await Promise.all([
            fetchPredictionHistory(nextGame),
            fetchTodaysEarlierResults(nextGame)
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
                analysisTodayCount.textContent = todayResults.length;
            }


            return;

        }


        const predictionData =
            calculateStatisticalPrediction(
                history,
                todayResults,
                true
            );


        displayPredictionBalls(
            predictionData.predictedNumbers
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

            predictionDateRange = { from, to };

            if (predictionRangeStatus) {
                predictionRangeStatus.textContent = from || to
                    ? `Historical range: ${from || "earliest"} to ${to || "latest"}. Today's earlier games are also included.`
                    : "Using all historical results plus today's earlier published games.";
            }

            await Promise.all([
            displayNextGamePrediction(),
            displayGhanaPrediction()
        ]);
        });

        predictionRangeReset?.addEventListener("click", async () => {
            predictionRangeForm?.reset();
            predictionDateRange = { from: "", to: "" };

            if (predictionRangeStatus) {
                predictionRangeStatus.textContent = "Using all historical results plus today's earlier published games.";
            }

            await Promise.all([
            displayNextGamePrediction(),
            displayGhanaPrediction()
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


        // Pull in newly published earlier games without requiring a page reload.

        setInterval(
            function () {

                displayNextGamePrediction();
                displayGhanaPrediction();
            },
            120000
        );

    }
);
