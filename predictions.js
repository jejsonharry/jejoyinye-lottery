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
        drawMinutes: (19 * 60) + 15,
        drawTime: "7:15 PM"
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


    const games =
        getTodaysGames();


    for (
        const game of games
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

function updateCountdown(game) {

    if (
        !countdownTimer ||
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

        countdownTimer.textContent =
            "00:00:00";

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


    countdownTimer.textContent =

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
// STATISTICAL PREDICTION ALGORITHM
// =========================================================

function calculateStatisticalPrediction(
    results,
    todayResults = []
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
                todayResults
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


        await displayNextGamePrediction();


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

            await displayNextGamePrediction();
        });

        predictionRangeReset?.addEventListener("click", async () => {
            predictionRangeForm?.reset();
            predictionDateRange = { from: "", to: "" };

            if (predictionRangeStatus) {
                predictionRangeStatus.textContent = "Using all historical results plus today's earlier published games.";
            }

            await displayNextGamePrediction();
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


        await displayNextGamePrediction();


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
            displayNextGamePrediction,
            120000
        );

    }
);
