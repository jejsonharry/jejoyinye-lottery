"use strict";

// =========================================================
// JEJOYINYE LOTTERY SERVICES
// COMPLETE WEBSITE SCRIPT
// VERSION 35
// =========================================================

console.log("JEJOYINYE SCRIPT VERSION 35 LOADED");


// =========================================================
// GAME CONFIGURATION
// =========================================================

const lotteryGames = {

    "modern-billionaire": [
        "Powerball",
        "Awoof",
        "Biggest Bet",
        "Gold Rush",
        "Lucky Dollar",
        "Blessing",
        "Owo Time",
        "Modern Bingo",
        "Bonus Cash",
        "Hero",
        "Golden",
        "Queen"
    ],

    ghana: [
        "ASEDA",
        "Monday Special",
        "Lucky Tuesday",
        "Mid Week",
        "Thursday Fortune",
        "Friday Bonanza",
        "National"
    ]

};


// =========================================================
// RESULTS SORT ORDER
// =========================================================

const gameOrder = {

    "modern-billionaire": [
        "Powerball",
        "Awoof",
        "Biggest Bet",
        "Gold Rush",
        "Lucky Dollar",
        "Blessing",
        "Owo Time",
        "Modern Bingo",
        "Bonus Cash",
        "Hero",
        "Golden",
        "Queen"
    ],

    ghana: [
        "ASEDA",
        "Monday Special",
        "Lucky Tuesday",
        "Mid Week",
        "Thursday Fortune",
        "Friday Bonanza",
        "National"
    ]

};


// =========================================================
// MODERN BILLIONAIRE DRAW SCHEDULE
// LAGOS / NIGERIA TIME
// =========================================================

const modernDrawSchedule = [

    {
        game: "Powerball",
        databaseNames: ["Powerball"],
        drawMinutes: 9 * 60,
        displayTime: "9:00 AM"
    },

    {
        game: "Awoof",
        databaseNames: ["Awoof"],
        drawMinutes: 11 * 60,
        displayTime: "11:00 AM"
    },

    {
        game: "Biggest Bet",
        databaseNames: ["Biggest Bet"],
        drawMinutes: 13 * 60,
        displayTime: "1:00 PM"
    },

    {
        game: "Gold Rush",
        databaseNames: ["Gold Rush"],
        drawMinutes: 15 * 60,
        displayTime: "3:00 PM"
    },

    {
        game: "Lucky Dollar",
        databaseNames: ["Lucky Dollar"],
        drawMinutes: 17 * 60,
        displayTime: "5:00 PM"
    },

    {
        game: "Blessing",
        databaseNames: ["Blessing"],
        drawMinutes: 18 * 60,
        displayTime: "6:00 PM"
    },

    {
        game: "Owo Time",
        databaseNames: ["Owo Time"],
        drawMinutes: 19 * 60,
        displayTime: "7:00 PM"
    },

    {
        game: "Modern Bingo",
        databaseNames: ["Modern Bingo"],
        drawMinutes: 20 * 60,
        displayTime: "8:00 PM"
    },

    {
        game: "Bonus Cash",
        databaseNames: ["Bonus Cash"],
        drawMinutes: 21 * 60,
        displayTime: "9:00 PM"
    },

    {
        game: "Hero",
        databaseNames: ["Hero"],
        drawMinutes: 22 * 60,
        displayTime: "10:00 PM"
    },

    {
        game: "Golden",
        databaseNames: [
            "Golden",
            "Golden Night"
        ],
        drawMinutes: 23 * 60,
        displayTime: "11:00 PM"
    }

];


// =========================================================
// GHANA DRAW SCHEDULE
// 0 SUNDAY - 6 SATURDAY
// =========================================================

const ghanaDrawSchedule = {

    0: {
        game: "ASEDA",
        drawMinutes: (19 * 60) + 10,
        displayTime: "7:10 PM"
    },

    1: {
        game: "Monday Special",
        drawMinutes: (21 * 60) + 10,
        displayTime: "9:10 PM"
    },

    2: {
        game: "Lucky Tuesday",
        drawMinutes: (21 * 60) + 10,
        displayTime: "9:10 PM"
    },

    3: {
        game: "Mid Week",
        drawMinutes: (21 * 60) + 10,
        displayTime: "9:10 PM"
    },

    4: {
        game: "Thursday Fortune",
        drawMinutes: (21 * 60) + 10,
        displayTime: "9:10 PM"
    },

    5: {
        game: "Friday Bonanza",
        drawMinutes: (21 * 60) + 10,
        displayTime: "9:10 PM"
    },

    6: {
        game: "National",
        drawMinutes: (21 * 60) + 10,
        displayTime: "9:10 PM"
    }

};


// =========================================================
// RESULTS SETTINGS
// =========================================================

const RESULTS_PER_LOTTERY_PAGE = 20;

const DATABASE_BATCH_SIZE = 1000;

const DEFAULT_RESULTS_LOOKBACK_DAYS = 45;

let modernCurrentPage = 1;

let ghanaCurrentPage = 1;

let allFilteredResults = [];


// =========================================================
// PAGE ELEMENTS
// =========================================================

const lotteryType =
    document.getElementById(
        "lottery-type"
    );

const gameSelect =
    document.getElementById(
        "game-select"
    );

const yearSelect =
    document.getElementById(
        "year-select"
    );

const monthSelect =
    document.getElementById(
        "month-select"
    );

const dateInput =
    document.getElementById(
        "result-date"
    );

const endDateInput =
    document.getElementById(
        "result-end-date"
    );

const searchButton =
    document.querySelector(
        ".search-result-btn"
    );

const resetButton =
    document.querySelector(
        ".reset-result-btn"
    );

const resultsContainer =
    document.getElementById(
        "results-container"
    );

const resultsDateLabel =
    document.getElementById(
        "results-date-label"
    );

const homeResultsContainer =
    document.getElementById(
        "home-results-container"
    );

const resultsGameDirectory =
    document.getElementById(
        "results-game-directory"
    );

const resultsArchiveWorkspace =
    document.getElementById(
        "results-archive-workspace"
    );

const resultsArchiveLottery =
    document.getElementById(
        "results-archive-lottery"
    );

const resultsArchiveTitle =
    document.getElementById(
        "results-archive-title"
    );

const resultsDirectoryBack =
    document.getElementById(
        "results-directory-back"
    );

const resultsArchiveBackLink =
    document.getElementById(
        "results-archive-back-link"
    );

const resultsGameCards =
    document.querySelectorAll(
        "[data-results-lottery][data-results-game]"
    );

const resultsFolderButtons =
    document.querySelectorAll(
        "[data-results-folder]"
    );

const resultsFolderPanels =
    document.querySelectorAll(
        "[data-results-folder-panel]"
    );

const dailyModernResultsContainer =
    document.getElementById(
        "daily-modern-results-container"
    );

const dailyModernResultsLabel =
    document.getElementById(
        "daily-modern-results-label"
    );

const dailyGhanaResultsContainer =
    document.getElementById(
        "daily-ghana-results-container"
    );

const dailyGhanaResultsLabel =
    document.getElementById(
        "daily-ghana-results-label"
    );


// =========================================================
// SAFE HTML
// =========================================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// =========================================================
// NORMALIZE GAME NAME
// =========================================================

function normalizeGameName(game) {

    if (!game) {
        return "";
    }


    const clean =
        String(game).trim();


    const comparable =
        clean
            .toLowerCase()
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();


    const canonicalNames = {
        "power ball": "Powerball",
        "golden": "Golden",
        "golden night": "Golden",
        "mid week": "Mid Week",
        "midweek": "Mid Week",
        "thursday fortune": "Thursday Fortune",
        "fortune thursday": "Thursday Fortune",
        "national": "National",
        "national weekly": "National",
        "national weekly lotto": "National",
        "aseda": "ASEDA",
        "sunday aseda": "ASEDA"
    };


    if (canonicalNames[comparable]) {

        return canonicalNames[comparable];
    }


    return clean;
}


function getGameDatabaseNames(game) {

    const canonical =
        normalizeGameName(game);


    const aliases = {
        Powerball: [
            "Powerball",
            "Power Ball"
        ],
        Golden: [
            "Golden",
            "Golden Night"
        ],
        "Mid Week": [
            "Mid Week",
            "Mid-Week",
            "Midweek"
        ],
        "Thursday Fortune": [
            "Thursday Fortune",
            "Fortune Thursday"
        ],
        National: [
            "National",
            "National Weekly",
            "National Weekly Lotto"
        ],
        ASEDA: [
            "ASEDA",
            "Aseda",
            "Sunday Aseda"
        ]
    };


    return aliases[canonical] || [canonical];
}


// =========================================================
// LOTTERY DISPLAY NAME
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


    return lottery || "Lottery";
}


// =========================================================
// FORMAT DRAW DATE
// =========================================================

function formatResultDate(
    dateValue
) {

    if (!dateValue) {
        return "";
    }


    const date =
        new Date(
            `${dateValue}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateValue;
    }


    return date.toLocaleDateString(

        "en-GB",

        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }

    );
}


// =========================================================
// PARSE WINNING / MACHINE NUMBERS
// =========================================================

function parseJsonbBalls(data) {

    if (
        data === null ||
        data === undefined
    ) {

        return [];
    }


    let numbers = [];


    if (
        Array.isArray(data)
    ) {

        numbers = data;
    }


    else if (
        typeof data ===
        "string"
    ) {

        try {

            const parsed =
                JSON.parse(data);


            if (
                Array.isArray(parsed)
            ) {

                numbers = parsed;
            }

            else {

                const matches =
                    data.match(
                        /\d+/g
                    );


                if (matches) {

                    numbers =
                        matches;
                }
            }

        }

        catch {

            const matches =
                data.match(
                    /\d+/g
                );


            if (matches) {

                numbers =
                    matches;
            }
        }
    }


    else if (
        typeof data ===
        "object"
    ) {

        numbers =
            Object.values(data);
    }


    return numbers

        .map(
            number =>
                Number(number)
        )

        .filter(
            number =>
                Number.isInteger(
                    number
                ) &&
                number >= 0 &&
                number <= 90
        )

        .map(
            number =>
                String(number)
                    .padStart(
                        2,
                        "0"
                    )
        );
}


// =========================================================
// CREATE LOTTERY BALLS
// =========================================================

function createNumberBalls(
    numbers,
    type = "winning"
) {

    if (
        !Array.isArray(numbers) ||
        numbers.length === 0
    ) {

        return `
            <span
                style="
                    color:#94a3b8;
                    font-size:13px;
                "
            >
                Not available
            </span>
        `;
    }


    const winning =
        type ===
        "winning";


    const className =
        winning
            ? "number-ball winning-ball"
            : "number-ball machine-ball";


    const background =
        winning
            ? "#16a34a"
            : "#dc2626";


    return numbers

        .map(
            number => `

                <span
                    class="${className}"
                    style="
                        background:${background} !important;
                        background-color:${background} !important;
                        color:#ffffff !important;
                    "
                >
                    ${escapeHTML(
                        number
                    )}
                </span>

            `
        )

        .join("");
}


// =========================================================
// BUILD GAME DROPDOWN
// =========================================================

function buildGameDropdown() {

    if (
        !lotteryType ||
        !gameSelect
    ) {

        return;
    }


    const lottery =
        lotteryType.value;


    gameSelect.innerHTML = `
        <option value="">
            All Games
        </option>
    `;


    if (
        !lottery ||
        !lotteryGames[
            lottery
        ]
    ) {

        return;
    }


    lotteryGames[
        lottery
    ].forEach(
        game => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                game;


            option.textContent =
                game;


            gameSelect.appendChild(
                option
            );
        }
    );
}


// =========================================================
// APPLY SUPABASE FILTERS
// =========================================================

function applySupabaseFilters(
    query
) {

    const selectedLottery =
        lotteryType?.value
            ?.trim() || "";


    const selectedGame =
        gameSelect?.value
            ?.trim() || "";


    const selectedYear =
        yearSelect?.value
            ?.trim() || "";


    const selectedMonth =
        monthSelect?.value
            ?.trim() || "";


    let selectedDate =
        dateInput?.value
            ?.trim() || "";


    let selectedEndDate =
        endDateInput?.value
            ?.trim() || "";


    if (selectedLottery) {

        query =
            query.eq(
                "lottery",
                selectedLottery
            );
    }


    if (selectedGame) {

        const databaseGameNames =
            getGameDatabaseNames(
                selectedGame
            );


        if (
            databaseGameNames.length > 1
        ) {

            query =
                query.in(
                    "game",
                    databaseGameNames
                );
        }

        else {

            query =
                query.eq(
                    "game",
                    databaseGameNames[0]
                );
        }
    }


    if (
        selectedDate &&
        selectedEndDate &&
        selectedDate > selectedEndDate
    ) {

        [
            selectedDate,
            selectedEndDate
        ] = [
            selectedEndDate,
            selectedDate
        ];
    }


    if (selectedDate || selectedEndDate) {

        if (selectedDate) {

            query =
                query.gte(
                    "draw_date",
                    selectedDate
                );
        }


        if (selectedEndDate) {

            query =
                query.lte(
                    "draw_date",
                    selectedEndDate
                );
        }

        return query;
    }


    if (selectedYear) {

        const year =
            Number(
                selectedYear
            );


        if (
            Number.isInteger(year)
        ) {

            let startDate;
            let endDate;


            if (selectedMonth) {

                const month =
                    Number(
                        selectedMonth
                    );


                const lastDay =
                    new Date(
                        year,
                        month,
                        0
                    ).getDate();


                const monthText =
                    String(month)
                        .padStart(
                            2,
                            "0"
                        );


                startDate =
                    `${year}-${monthText}-01`;


                endDate =
                    `${year}-${monthText}-${String(
                        lastDay
                    ).padStart(
                        2,
                        "0"
                    )}`;
            }

            else {

                startDate =
                    `${year}-01-01`;


                endDate =
                    `${year}-12-31`;
            }


            query =
                query
                    .gte(
                        "draw_date",
                        startDate
                    )
                    .lte(
                        "draw_date",
                        endDate
                    );
        }
    }


    else if (!selectedGame) {

        query = query.gte(
            "draw_date",
            getDefaultResultsStartDate()
        );
    }


    return query;
}


// =========================================================
// DEFAULT RESULTS WINDOW
// Keep the unfiltered page lightweight. Older records remain
// available whenever a year or date range is selected.
// =========================================================

function getDefaultResultsStartDate() {

    const startDate =
        new Date(
            Date.now() -
            (
                DEFAULT_RESULTS_LOOKBACK_DAYS - 1
            ) * 24 * 60 * 60 * 1000
        );


    return startDate
        .toISOString()
        .slice(0, 10);
}


// =========================================================
// BUNDLED GHANA RESULT ARCHIVE
// =========================================================

let bundledGhanaResultsPromise = null;

function parseBundledGhanaResults(csvText) {
    return csvText
        .trim()
        .split(/\r?\n/)
        .slice(1)
        .map(line => {
            const [
                lottery,
                game,
                drawDate,
                winning,
                machine
            ] = line.split(",");

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

async function fetchBundledGhanaResults() {
    if (!bundledGhanaResultsPromise) {
        bundledGhanaResultsPromise =
            fetch("data/ghana-history.csv?v=6", {
                cache: "no-cache"
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(
                            "Ghana result archive could not be loaded"
                        );
                    }

                    return response.text();
                })
                .then(parseBundledGhanaResults)
                .catch(error => {
                    console.error(
                        "Bundled Ghana results error:",
                        error
                    );
                    bundledGhanaResultsPromise = null;
                    return [];
                });
    }

    return bundledGhanaResultsPromise;
}

function filterBundledGhanaResults(results) {
    const selectedLottery =
        lotteryType?.value?.trim() || "";

    const selectedGame =
        gameSelect?.value?.trim() || "";

    const selectedYear =
        yearSelect?.value?.trim() || "";

    const selectedMonth =
        monthSelect?.value?.trim() || "";

    let selectedDate =
        dateInput?.value?.trim() || "";

    let selectedEndDate =
        endDateInput?.value?.trim() || "";

    if (
        selectedLottery &&
        selectedLottery !== "ghana"
    ) {
        return [];
    }

    if (
        selectedDate &&
        selectedEndDate &&
        selectedDate > selectedEndDate
    ) {
        [selectedDate, selectedEndDate] =
            [selectedEndDate, selectedDate];
    }

    return results.filter(result => {
        const drawDate =
            String(result.draw_date || "");

        if (
            !selectedDate &&
            !selectedEndDate &&
            !selectedYear &&
            !selectedGame &&
            drawDate < getDefaultResultsStartDate()
        ) {
            return false;
        }

        if (
            selectedGame &&
            normalizeGameName(result.game).toUpperCase() !==
            normalizeGameName(selectedGame).toUpperCase()
        ) {
            return false;
        }

        if (
            selectedDate &&
            drawDate < selectedDate
        ) {
            return false;
        }

        if (
            selectedEndDate &&
            drawDate > selectedEndDate
        ) {
            return false;
        }

        if (
            !selectedDate &&
            !selectedEndDate &&
            selectedYear &&
            !drawDate.startsWith(
                `${selectedYear}-`
            )
        ) {
            return false;
        }

        if (
            !selectedDate &&
            !selectedEndDate &&
            selectedYear &&
            selectedMonth &&
            !drawDate.startsWith(
                `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-`
            )
        ) {
            return false;
        }

        return true;
    });
}

function mergeResultSources(primaryResults, fallbackResults) {
    const merged = new Map();

    primaryResults.forEach(result => {
            const key = [
                result.lottery,
                normalizeGameName(result.game).toUpperCase(),
                result.draw_date
            ].join("|");

            const existing = merged.get(key);

            if (!existing) {
                merged.set(key, result);
                return;
            }

            merged.set(key, {
                ...result,
                ...existing,
                winning:
                    parseJsonbBalls(existing.winning).length
                        ? existing.winning
                        : result.winning,
                machine:
                    parseJsonbBalls(existing.machine).length
                        ? existing.machine
                        : result.machine
            });
        });

    fallbackResults.forEach(result => {
        const key = [
            result.lottery,
            normalizeGameName(result.game).toUpperCase(),
            result.draw_date
        ].join("|");

        const existing = merged.get(key);

        if (!existing) {
            merged.set(key, result);
            return;
        }

        /*
         The bundled Ghana archive contains owner-verified historical data.
         Prefer each complete supplied number set over an older conflicting
         live row, while retaining a live value when the archive lacks it.
        */
        merged.set(key, {
            ...existing,
            ...result,
            winning:
                parseJsonbBalls(result.winning).length
                    ? result.winning
                    : existing.winning,
            machine:
                parseJsonbBalls(result.machine).length
                    ? result.machine
                    : existing.machine
        });
    });

    return [...merged.values()];
}


// =========================================================
// FETCH ALL FILTERED RESULTS
// =========================================================

async function fetchAllFilteredSupabaseResults() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        throw new Error(
            "Supabase connection is not available."
        );
    }


    let allResults = [];

    let from = 0;


    while (true) {

        const to =
            from +
            DATABASE_BATCH_SIZE -
            1;


        let query =
            supabaseClient

                .from(
                    "results"
                )

                .select(
                    "lottery, game, draw_date, winning, machine"
                )

                .order(
                    "draw_date",
                    {
                        ascending:
                            false
                    }
                );


        query =
            applySupabaseFilters(
                query
            );


        query =
            query.range(
                from,
                to
            );


        const {
            data,
            error
        } =
            await query;


        if (error) {

            throw error;
        }


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            break;
        }


        allResults.push(
            ...data
        );


        if (
            data.length <
            DATABASE_BATCH_SIZE
        ) {

            break;
        }


        from +=
            DATABASE_BATCH_SIZE;
    }


    return allResults;
}


// =========================================================
// SORT RESULTS
// =========================================================

function getGhanaWeekEndingSunday(dateValue) {
    const date = new Date(`${dateValue}T00:00:00Z`);

    if (Number.isNaN(date.getTime())) {
        return String(dateValue || "");
    }

    const daysUntilSunday =
        (7 - date.getUTCDay()) % 7;

    date.setUTCDate(
        date.getUTCDate() + daysUntilSunday
    );

    return date.toISOString().slice(0, 10);
}

function sortLotteryResults(
    results
) {

    return [
        ...results
    ].sort(
        (a, b) => {

            if (
                a.lottery === "ghana" &&
                b.lottery === "ghana"
            ) {
                const weekCompare =
                    getGhanaWeekEndingSunday(
                        b.draw_date
                    ).localeCompare(
                        getGhanaWeekEndingSunday(
                            a.draw_date
                        )
                    );

                if (weekCompare !== 0) {
                    return weekCompare;
                }

                const ghanaOrder =
                    gameOrder.ghana || [];

                const position = game => {
                    const index = ghanaOrder.indexOf(
                        normalizeGameName(game)
                    );

                    return index === -1
                        ? 999
                        : index;
                };

                const gameCompare =
                    position(a.game) -
                    position(b.game);

                if (gameCompare !== 0) {
                    return gameCompare;
                }
            }

            const dateCompare =
                String(
                    b.draw_date || ""
                ).localeCompare(
                    String(
                        a.draw_date || ""
                    )
                );


            if (
                dateCompare !== 0
            ) {

                return dateCompare;
            }


            const priority = {

                "modern-billionaire":
                    1,

                ghana:
                    2

            };


            const lotteryCompare =
                (
                    priority[
                        a.lottery
                    ] || 99
                )
                -
                (
                    priority[
                        b.lottery
                    ] || 99
                );


            if (
                lotteryCompare !== 0
            ) {

                return lotteryCompare;
            }


            const order =
                gameOrder[
                    a.lottery
                ] || [];


            const gameA =
                normalizeGameName(
                    a.game
                );


            const gameB =
                normalizeGameName(
                    b.game
                );


            const indexA =
                order.indexOf(
                    gameA
                );


            const indexB =
                order.indexOf(
                    gameB
                );


            return (
                indexA === -1
                    ? 999
                    : indexA
            )
            -
            (
                indexB === -1
                    ? 999
                    : indexB
            );
        }
    );
}


// =========================================================
// CREATE RESULTS PAGE CARD
// =========================================================

const RESULTS_SHARE_URL =
    "https://jolslottery.com/results?share=player-community-v1";

const PLAY_ONLINE_URL =
    "https://jolslottery.com/play-online";

const WHATSAPP_PLAYERS_COMMUNITY_URL =
    "https://chat.whatsapp.com/FL2C5b2emu8L50AG3qXuPw";


function createResultPlayerActions(
    extraClass = ""
) {
    return `
        <div class="result-player-actions ${extraClass}" aria-label="Player options">
            <p>Ready for the next draw?</p>
            <div class="result-player-action-links">
                <a
                    href="play-online"
                    class="result-play-online-link"
                    data-player-action="play-online"
                >
                    Play Online
                </a>
                <a
                    href="${WHATSAPP_PLAYERS_COMMUNITY_URL}"
                    class="result-community-link"
                    data-player-action="whatsapp-community"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Join Players Community
                </a>
            </div>
            <small>18+ only • Play responsibly</small>
        </div>
    `;
}

function createResultCard(
    result
) {

    const winning =
        parseJsonbBalls(
            result.winning
        );


    const machine =
        result.lottery === "ghana"
            ? []
            : parseJsonbBalls(
                result.machine
            );


    const winningBalls =
        createNumberBalls(
            winning,
            "winning"
        );


    const machineBalls =
        createNumberBalls(
            machine,
            "machine"
        );

    const machineSection = machine.length
        ? `
            <div class="result-number-group">
                <h4>Machine Numbers</h4>
                <div class="machine-numbers">${machineBalls}</div>
            </div>
        `
        : "";


    const game =
        normalizeGameName(
            result.game
        );


    const lottery =
        getLotteryDisplayName(
            result.lottery
        );


    const date =
        formatResultDate(
            result.draw_date
        );


    return `

        <article class="result-card${machine.length ? "" : " result-card-no-machine"}">

            <div class="result-top">

                <div class="result-game-info">

                    <h3>
                        ${escapeHTML(
                            game
                        )}
                    </h3>

                    <span class="lottery-name">
                        ${escapeHTML(
                            lottery
                        )}
                    </span>

                </div>

                <div class="result-meta">
                    <span class="draw-time">
                        ${escapeHTML(
                            date
                        )}
                    </span>

                    <span class="result-status">
                        Published
                    </span>

                    <button
                        type="button"
                        class="result-share-btn"
                        data-share-result
                        data-share-game="${escapeHTML(game)}"
                        data-share-lottery="${escapeHTML(lottery)}"
                        data-share-date="${escapeHTML(date)}"
                        data-share-winning="${escapeHTML(winning.join("-"))}"
                        data-share-machine="${escapeHTML(machine.join("-"))}"
                        data-share-url="${RESULTS_SHARE_URL}"
                        aria-label="Share ${escapeHTML(game)} result"
                    >
                        Share
                    </button>
                </div>

            </div>


            <div class="result-number-group">

                <h4>
                    Winning Numbers
                </h4>

                <div class="winning-numbers">
                    ${winningBalls}
                </div>

            </div>


            ${machineSection}

            ${createResultPlayerActions()}

        </article>

    `;
}


// =========================================================
// SHARE PUBLISHED RESULT
// =========================================================

function drawShareRoundedRect(
    context,
    x,
    y,
    width,
    height,
    radius
) {
    const safeRadius =
        Math.min(radius, width / 2, height / 2);

    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.lineTo(x + width - safeRadius, y);
    context.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + safeRadius
    );
    context.lineTo(
        x + width,
        y + height - safeRadius
    );
    context.quadraticCurveTo(
        x + width,
        y + height,
        x + width - safeRadius,
        y + height
    );
    context.lineTo(x + safeRadius, y + height);
    context.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - safeRadius
    );
    context.lineTo(x, y + safeRadius);
    context.quadraticCurveTo(x, y, x + safeRadius, y);
    context.closePath();
}


function loadResultShareLogo() {
    return new Promise(function (resolve, reject) {
        const image = new Image();

        image.onload = function () {
            resolve(image);
        };

        image.onerror = function () {
            reject(
                new Error("Share logo could not be loaded.")
            );
        };

        image.src =
            "/Images/jols-logo.png";
    });
}


function drawResultShareNumbers(
    context,
    numbers,
    startX,
    centerY,
    colour
) {
    numbers.slice(0, 5).forEach(
        function (number, index) {
            const centerX =
                startX + (index * 91);

            context.fillStyle =
                "rgba(255,255,255,0.10)";

            context.beginPath();
            context.arc(
                centerX,
                centerY,
                35,
                0,
                Math.PI * 2
            );
            context.fill();

            context.strokeStyle =
                colour;
            context.lineWidth =
                4;
            context.stroke();

            context.fillStyle =
                "#ffffff";
            context.font =
                "800 28px Arial, sans-serif";
            context.textAlign =
                "center";
            context.textBaseline =
                "middle";
            context.fillText(
                String(number).padStart(2, "0"),
                centerX,
                centerY + 1
            );
        }
    );
}


async function createResultShareFile({
    game,
    lottery,
    date,
    winning,
    machine
}) {
    const canvas =
        document.createElement("canvas");

    canvas.width =
        1200;
    canvas.height =
        630;

    const context =
        canvas.getContext("2d");

    if (!context) {
        throw new Error(
            "Result card canvas is unavailable."
        );
    }

    const background =
        context.createLinearGradient(
            0,
            0,
            1200,
            630
        );

    background.addColorStop(
        0,
        "#031d2a"
    );
    background.addColorStop(
        0.55,
        "#063f38"
    );
    background.addColorStop(
        1,
        "#0b6b45"
    );

    context.fillStyle =
        background;
    context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const gold =
        context.createLinearGradient(
            0,
            0,
            1200,
            0
        );

    gold.addColorStop(
        0,
        "#d99a16"
    );
    gold.addColorStop(
        0.5,
        "#ffd76a"
    );
    gold.addColorStop(
        1,
        "#d99a16"
    );

    context.fillStyle =
        gold;
    context.fillRect(
        0,
        0,
        1200,
        12
    );

    drawShareRoundedRect(
        context,
        65,
        76,
        320,
        430,
        38
    );
    context.fillStyle =
        "rgba(255,255,255,0.08)";
    context.fill();
    context.strokeStyle =
        "rgba(255,255,255,0.20)";
    context.lineWidth =
        2;
    context.stroke();

    try {
        const logo =
            await loadResultShareLogo();

        context.drawImage(
            logo,
            100,
            120,
            250,
            250
        );
    }
    catch (error) {
        console.warn(
            "Result share logo unavailable:",
            error
        );
    }

    context.fillStyle =
        "#f5c451";
    context.font =
        "800 22px Arial, sans-serif";
    context.textAlign =
        "center";
    context.textBaseline =
        "alphabetic";
    context.fillText(
        "JEJOYINYE",
        225,
        420
    );

    context.fillStyle =
        "#ffffff";
    context.font =
        "700 17px Arial, sans-serif";
    context.fillText(
        "LOTTERY SERVICES",
        225,
        449
    );

    context.fillStyle =
        "rgba(255,255,255,0.72)";
    context.font =
        "600 16px Arial, sans-serif";
    context.fillText(
        "jolslottery.com",
        225,
        480
    );

    context.textAlign =
        "left";

    context.fillStyle =
        "#f5c451";
    context.font =
        "800 22px Arial, sans-serif";
    context.fillText(
        String(lottery).toUpperCase(),
        445,
        112
    );

    context.fillStyle =
        "#ffffff";
    context.font =
        "800 48px Arial, sans-serif";

    const resultTitle =
        `${String(game).toUpperCase()} RESULT`;

    context.fillText(
        resultTitle.length > 28
            ? resultTitle.slice(0, 28)
            : resultTitle,
        445,
        177
    );

    context.fillStyle =
        "#d9eee7";
    context.font =
        "600 22px Arial, sans-serif";
    context.fillText(
        `Draw Date: ${date}`,
        445,
        219
    );

    context.fillStyle =
        "#56d88a";
    context.font =
        "800 22px Arial, sans-serif";
    context.fillText(
        "WINNING NUMBERS",
        445,
        277
    );

    drawResultShareNumbers(
        context,
        String(winning).split("-").filter(Boolean),
        480,
        331,
        "#42d37c"
    );

    if (machine) {
        context.fillStyle =
            "#ff7878";
        context.font =
            "800 22px Arial, sans-serif";
        context.textAlign =
            "left";
        context.fillText(
            "MACHINE NUMBERS",
            445,
            407
        );

        drawResultShareNumbers(
            context,
            String(machine).split("-").filter(Boolean),
            480,
            461,
            "#ff6b6b"
        );
    }
    else {
        context.fillStyle =
            "rgba(255,255,255,0.70)";
        context.font =
            "600 20px Arial, sans-serif";
        context.textAlign =
            "left";
        context.fillText(
            "Official winning numbers published",
            445,
            449
        );
    }

    context.fillStyle =
        "#ffffff";
    context.font =
        "800 21px Arial, sans-serif";
    context.textAlign =
        "left";
    context.fillText(
        "PLAY ONLINE: jolslottery.com/play-online",
        445,
        559
    );

    context.textAlign =
        "right";
    context.fillStyle =
        "#f5c451";
    context.font =
        "800 20px Arial, sans-serif";
    context.fillText(
        "18+ • Play responsibly",
        1135,
        559
    );

    const blob =
        await new Promise(function (resolve) {
            canvas.toBlob(
                resolve,
                "image/png",
                0.96
            );
        });

    if (!blob) {
        throw new Error(
            "Result card image could not be created."
        );
    }

    const safeGame =
        String(game)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

    return new File(
        [blob],
        `${safeGame || "lottery"}-result.png`,
        {
            type: "image/png"
        }
    );
}


async function sharePublishedResult(
    button
) {

    const game =
        button.dataset.shareGame ||
        "Lottery";

    const lottery =
        button.dataset.shareLottery ||
        "";

    const date =
        button.dataset.shareDate ||
        "";

    const winning =
        button.dataset.shareWinning ||
        "";

    const machine =
        button.dataset.shareMachine ||
        "";

    const shareUrl =
        button.dataset.shareUrl ||
        RESULTS_SHARE_URL;

    const formattedWinning =
        winning.replace(/-/g, " • ");

    const formattedMachine =
        machine.replace(/-/g, " • ");

    const lines = [
        `🎯 *${String(game).toUpperCase()} RESULT*`,
        `🎟️ ${lottery}`,
        "",
        `📅 *Date:* ${date}`,
        `🟢 *Winning:* ${formattedWinning}`
    ];

    if (formattedMachine) {
        lines.push(
            `🔴 *Machine:* ${formattedMachine}`
        );
    }

    lines.push(
        "",
        "🎮 *Play the next draw online:*",
        PLAY_ONLINE_URL,
        "",
        "💬 *Join our WhatsApp Players Community:*",
        WHATSAPP_PLAYERS_COMMUNITY_URL,
        "",
        "🔞 18+ only. Play responsibly.",
        "",
        "*View more results:*"
    );

    const text =
        lines.join("\n");

    const originalLabel =
        button.textContent;

    button.disabled =
        true;
    button.textContent =
        "Preparing...";

    let delayedLabelReset =
        false;

    const isIOSShareDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent)
        ||
        (
            navigator.platform === "MacIntel"
            &&
            navigator.maxTouchPoints > 1
        );

    try {

        if (
            navigator.share
            &&
            navigator.canShare
            &&
            typeof File !== "undefined"
        ) {
            try {
                const resultFile =
                    await createResultShareFile({
                        game,
                        lottery,
                        date,
                        winning,
                        machine
                    });

                if (
                    navigator.canShare({
                        files: [resultFile]
                    })
                ) {
                    if (
                        isIOSShareDevice
                        &&
                        navigator.clipboard?.writeText
                    ) {
                        try {
                            await navigator.clipboard.writeText(
                                `${text}\n${shareUrl}`
                            );
                        }
                        catch (clipboardError) {
                            console.warn(
                                "IOS SHARE CAPTION COPY FAILED:",
                                clipboardError
                            );
                        }
                    }

                    const imageShareData =
                        isIOSShareDevice
                            ? {
                                files: [resultFile]
                            }
                            : {
                                files: [resultFile],
                                title:
                                    `${game} Lottery Result`,
                                text:
                                    `${text}\n${shareUrl}`
                            };

                    await navigator.share(
                        imageShareData
                    );

                    return;
                }
            }
            catch (imageShareError) {
                if (
                    imageShareError
                    &&
                    imageShareError.name === "AbortError"
                ) {
                    return;
                }

                console.warn(
                    "RESULT IMAGE SHARE FALLBACK:",
                    imageShareError
                );
            }
        }

        if (navigator.share) {

            await navigator.share({
                title:
                    `${game} Lottery Result`,
                text,
                url:
                    shareUrl
            });

            return;
        }

        await navigator.clipboard.writeText(
            `${text}\n${shareUrl}`
        );

        button.textContent =
            "Copied!";

        delayedLabelReset =
            true;

        setTimeout(
            function () {
                button.textContent =
                    originalLabel;
            },
            1800
        );

    } catch (error) {

        if (
            error
            &&
            error.name === "AbortError"
        ) {
            return;
        }

        console.error(
            "RESULT SHARE FAILED:",
            error
        );
    }
    finally {
        button.disabled =
            false;

        if (!delayedLabelReset) {
            button.textContent =
                originalLabel;
        }
    }
}

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-share-result]"
            );

        if (!button) {
            return;
        }

        sharePublishedResult(
            button
        );
    }
);


// =========================================================
// RESULTS PAGINATION
// =========================================================

function createPagination(
    totalPages,
    page,
    lottery
) {

    const paginationKey =
        lottery === "ghana"
            ? "ghana"
            : "modern";

    const paginationLabel =
        lottery === "ghana"
            ? "Ghana results pages"
            : "Modern Billionaire results pages";


    return `

        <div
            class="results-pagination results-pagination-${paginationKey}"
            style="grid-column:1/-1;"
            aria-label="${paginationLabel}"
        >

            <button
                type="button"
                id="previous-${paginationKey}-results-page"
                ${
                    page <= 1
                        ? "disabled"
                        : ""
                }
            >
                Previous
            </button>


            <span
                style="
                    padding:10px 15px;
                    font-weight:800;
                    color:#475569;
                "
            >
                Page ${page}
                of ${totalPages}
            </span>


            <button
                type="button"
                id="next-${paginationKey}-results-page"
                ${
                    page >=
                    totalPages
                        ? "disabled"
                        : ""
                }
            >
                Next
            </button>

        </div>

    `;
}


// =========================================================
// RENDER CURRENT PAGE
// =========================================================

function createLotteryResultsGroup(
    results,
    lottery,
    pagination,
    totalResults = results.length,
    startIndex = 0
) {

    if (
        !Array.isArray(results) ||
        results.length === 0
    ) {

        return "";
    }


    const isGhana =
        lottery ===
        "ghana";


    const selectedArchiveGame =
        resultsArchiveWorkspace && gameSelect?.value
            ? getResultsArchiveGameName(gameSelect.value)
            : "";


    const title =
        selectedArchiveGame
            ? `${selectedArchiveGame} Results`
            : isGhana
                ? "Ghana Results"
                : "Modern Billionaire Results";


    const groupClass =
        isGhana
            ? "ghana-results-group"
            : "modern-results-group";


    const endIndex =
        startIndex + results.length;


    const resultsSummary =
        resultsArchiveWorkspace
            ? `Showing ${startIndex + 1}-${endIndex} of ${totalResults} published results`
            : `${results.length} ${results.length === 1 ? "result" : "results"} on this page`;


    return `

        <section
            class="lottery-results-group ${groupClass}"
        >

            <div class="lottery-results-heading">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <span>
                    ${resultsSummary}
                </span>

            </div>

            <div class="lottery-results-list">

                ${results
                    .map(createResultCard)
                    .join("")}

            </div>

            ${pagination}

        </section>

    `;
}


// =========================================================
// RENDER CURRENT PAGE
// =========================================================

function renderCurrentPage() {

    if (!resultsContainer) {

        return;
    }


    if (
        allFilteredResults.length ===
        0
    ) {

        resultsContainer.innerHTML = `

            <div
                class="no-results"
                style="grid-column:1/-1;"
            >

                <h3>
                    No Results Found
                </h3>

                <p>
                    Try changing your
                    search filters.
                </p>

            </div>

        `;


        if (resultsDateLabel) {

            resultsDateLabel.textContent =
                "No matching results";
        }


        return;
    }


    const allModernResults =
        sortLotteryResults(
            allFilteredResults.filter(
                result =>
                    result.lottery ===
                    "modern-billionaire"
            )
        );


    const allGhanaResults =
        sortLotteryResults(
            allFilteredResults.filter(
                result =>
                    result.lottery ===
                    "ghana"
            )
        );


    const hasCompleteHistoryFilter =
        Boolean(gameSelect?.value) &&
        Boolean(
            yearSelect?.value ||
            dateInput?.value ||
            endDateInput?.value
        );


    const showCompleteModernHistory =
        lotteryType?.value === "modern-billionaire" &&
        hasCompleteHistoryFilter;


    const showCompleteGhanaHistory =
        lotteryType?.value === "ghana" &&
        hasCompleteHistoryFilter;


    const modernPageSize =
        showCompleteModernHistory
            ? Math.max(1, allModernResults.length)
            : RESULTS_PER_LOTTERY_PAGE;


    const ghanaPageSize =
        showCompleteGhanaHistory
            ? Math.max(1, allGhanaResults.length)
            : RESULTS_PER_LOTTERY_PAGE;


    const modernTotalPages =
        Math.max(
            1,
            Math.ceil(
                allModernResults.length /
                modernPageSize
            )
        );

    const ghanaTotalPages =
        Math.max(
            1,
            Math.ceil(
                allGhanaResults.length /
                ghanaPageSize
            )
        );

    if (
        modernCurrentPage >
        modernTotalPages
    ) {

        modernCurrentPage =
            modernTotalPages;
    }


    if (
        modernCurrentPage < 1
    ) {

        modernCurrentPage = 1;
    }

    if (
        ghanaCurrentPage >
        ghanaTotalPages
    ) {

        ghanaCurrentPage =
            ghanaTotalPages;
    }


    if (
        ghanaCurrentPage < 1
    ) {

        ghanaCurrentPage = 1;
    }


    const modernStartIndex =
        (
            modernCurrentPage -
            1
        ) *
        modernPageSize;

    const ghanaStartIndex =
        (
            ghanaCurrentPage -
            1
        ) *
        ghanaPageSize;


    const modernResults =
        allModernResults.slice(
            modernStartIndex,
            modernStartIndex +
                modernPageSize
        );


    const ghanaResults =
        allGhanaResults.slice(
            ghanaStartIndex,
            ghanaStartIndex +
                ghanaPageSize
        );


    resultsContainer.innerHTML =

        createLotteryResultsGroup(
            modernResults,
            "modern-billionaire",
            showCompleteModernHistory
                ? ""
                : createPagination(
                    modernTotalPages,
                    modernCurrentPage,
                    "modern-billionaire"
                ),
            allModernResults.length,
            modernStartIndex
        )

        +

        createLotteryResultsGroup(
            ghanaResults,
            "ghana",
            showCompleteGhanaHistory
                ? ""
                : createPagination(
                    ghanaTotalPages,
                    ghanaCurrentPage,
                    "ghana"
                ),
            allGhanaResults.length,
            ghanaStartIndex
        );


    if (resultsDateLabel) {

        const selectedLottery =
            lotteryType?.value || "";

        const selectedResults =
            selectedLottery === "ghana"
                ? ghanaResults
                : modernResults;

        const selectedAllResults =
            selectedLottery === "ghana"
                ? allGhanaResults
                : allModernResults;

        const selectedStartIndex =
            selectedLottery === "ghana"
                ? ghanaStartIndex
                : modernStartIndex;

        const selectedPage =
            selectedLottery === "ghana"
                ? ghanaCurrentPage
                : modernCurrentPage;

        const selectedTotalPages =
            selectedLottery === "ghana"
                ? ghanaTotalPages
                : modernTotalPages;

        const selectedGameName =
            getResultsArchiveGameName(
                gameSelect?.value || ""
            );

        const periodLabel =
            yearSelect?.value
                ? ` for ${yearSelect.value}${monthSelect?.value ? `-${monthSelect.value}` : ""}`
                : dateInput?.value || endDateInput?.value
                    ? ` for the selected date range`
                    : "";

        const visibleStart =
            selectedResults.length
                ? selectedStartIndex + 1
                : 0;

        const visibleEnd =
            selectedStartIndex + selectedResults.length;

        resultsDateLabel.textContent =
            resultsArchiveWorkspace
                ? `${selectedGameName} • ${selectedAllResults.length} published results${periodLabel} • showing ${visibleStart}-${visibleEnd}`
                : hasCompleteHistoryFilter
                    ? `${selectedResults.length} published ${selectedGameName} results found${periodLabel}`
                    : `${selectedGameName} • ${selectedResults.length} results on page ${selectedPage}/${selectedTotalPages}`;
    }


    const previousModernButton =
        document.getElementById(
            "previous-modern-results-page"
        );


    const nextModernButton =
        document.getElementById(
            "next-modern-results-page"
        );

    const previousGhanaButton =
        document.getElementById(
            "previous-ghana-results-page"
        );

    const nextGhanaButton =
        document.getElementById(
            "next-ghana-results-page"
        );

    previousModernButton
        ?.addEventListener(
            "click",
            function () {

                if (
                    modernCurrentPage > 1
                ) {

                    modernCurrentPage--;

                    renderCurrentPage();

                    scrollToLotteryResults(
                        "modern-billionaire"
                    );
                }
            }
        );


    nextModernButton
        ?.addEventListener(
            "click",
            function () {

                if (
                    modernCurrentPage <
                    modernTotalPages
                ) {

                    modernCurrentPage++;

                    renderCurrentPage();

                    scrollToLotteryResults(
                        "modern-billionaire"
                    );
                }
            }
        );


    previousGhanaButton
        ?.addEventListener(
            "click",
            function () {

                if (
                    ghanaCurrentPage > 1
                ) {

                    ghanaCurrentPage--;

                    renderCurrentPage();

                    scrollToLotteryResults(
                        "ghana"
                    );
                }
            }
        );


    nextGhanaButton
        ?.addEventListener(
            "click",
            function () {

                if (
                    ghanaCurrentPage <
                    ghanaTotalPages
                ) {

                    ghanaCurrentPage++;

                    renderCurrentPage();

                    scrollToLotteryResults(
                        "ghana"
                    );
                }
            }
        );
}


// =========================================================
// SCROLL TO RESULTS
// =========================================================

function scrollToResults() {

    if (!resultsContainer) {

        return;
    }


    const section =
        resultsContainer.closest(
            ".results-section"
        );


    if (section) {

        section.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "start"
            }
        );
    }
}


function scrollToLotteryResults(
    lottery
) {

    const selector =
        lottery === "ghana"
            ? ".ghana-results-group"
            : ".modern-results-group";

    const group =
        resultsContainer
            ?.querySelector(selector);

    if (group) {
        group.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// =========================================================
// DISPLAY RESULTS PAGE
// =========================================================

async function displayResults() {

    if (!resultsContainer) {

        return;
    }


    resultsContainer.innerHTML = `

        <p
            style="
                grid-column:1/-1;
                text-align:center;
                padding:40px;
            "
        >
            Loading live results...
        </p>

    `;


    if (resultsDateLabel) {

        resultsDateLabel.textContent =
            "Loading Results...";
    }


    try {

        console.log(
            "Fetching lottery results..."
        );


        const [
            liveResult,
            bundledResult
        ] = await Promise.allSettled([
            fetchAllFilteredSupabaseResults(),
            lotteryType?.value === "ghana"
                ? fetchBundledGhanaResults()
                : Promise.resolve([])
        ]);

        const liveResults =
            liveResult.status === "fulfilled"
                ? liveResult.value
                : [];

        const bundledResults =
            bundledResult.status === "fulfilled"
                ? filterBundledGhanaResults(
                    bundledResult.value
                )
                : [];

        if (
            liveResult.status === "rejected" &&
            bundledResults.length === 0
        ) {
            throw liveResult.reason;
        }

        const results =
            mergeResultSources(
                liveResults,
                bundledResults
            );


        console.log(
            "Results received:",
            results.length
        );


        allFilteredResults =
            sortLotteryResults(
                results
            );


        modernCurrentPage = 1;
        ghanaCurrentPage = 1;


        renderCurrentPage();

    }


    catch (error) {

        console.error(
            "RESULTS SUPABASE ERROR:",
            error
        );


        const errorMessage =
            error?.message ||
            "Please refresh the page and try again.";


        resultsContainer.innerHTML = `

            <div
                class="no-results"
                style="grid-column:1/-1;"
            >

                <h3>
                    Unable To Load Results
                </h3>

                <p>
                    ${escapeHTML(
                        errorMessage
                    )}
                </p>

            </div>

        `;


        if (resultsDateLabel) {

            resultsDateLabel.textContent =
                "Loading Error";
        }
    }
}


// =========================================================
// LAGOS TIME
// =========================================================

function getLagosTimeParts() {

    const formatter =
        new Intl.DateTimeFormat(
            "en-GB",
            {
                timeZone:
                    "Africa/Lagos",

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit",

                weekday:
                    "short",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                hourCycle:
                    "h23"
            }
        );


    const parts =
        formatter.formatToParts(
            new Date()
        );


    const values = {};


    parts.forEach(
        part => {

            if (
                part.type !==
                "literal"
            ) {

                values[
                    part.type
                ] =
                    part.value;
            }
        }
    );


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

        year:
            Number(
                values.year
            ),

        month:
            Number(
                values.month
            ),

        day:
            Number(
                values.day
            ),

        weekday:
            weekdayMap[
                values.weekday
            ],

        hour:
            Number(
                values.hour
            ),

        minute:
            Number(
                values.minute
            )

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


function changeDateByDays(
    year,
    month,
    day,
    amount
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
        date.getUTCDate() +
        amount
    );


    return makeDateString(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate()
    );
}


function getPreviousDateString(
    year,
    month,
    day
) {

    return changeDateByDays(
        year,
        month,
        day,
        -1
    );
}


// =========================================================
// GET LATEST MODERN SCHEDULE
// =========================================================

function getLatestModernDraw() {

    const lagos =
        getLagosTimeParts();


    const currentMinutes =
        (
            lagos.hour *
            60
        )
        +
        lagos.minute;


    const today =
        makeDateString(
            lagos.year,
            lagos.month,
            lagos.day
        );


    const yesterday =
        getPreviousDateString(
            lagos.year,
            lagos.month,
            lagos.day
        );


    // Queen is the latest result
    // before Powerball begins.

    if (
        currentMinutes <
        9 * 60
    ) {

        return {

            lottery:
                "modern-billionaire",

            game:
                "Queen",

            databaseNames:
                ["Queen"],

            drawDate:
                yesterday,

            displayTime:
                "12:00 AM"

        };
    }


    let latestDraw =
        null;


    modernDrawSchedule
        .forEach(
            draw => {

                if (
                    currentMinutes >=
                    draw.drawMinutes
                ) {

                    latestDraw = {

                        lottery:
                            "modern-billionaire",

                        game:
                            draw.game,

                        databaseNames:
                            draw.databaseNames,

                        drawDate:
                            today,

                        displayTime:
                            draw.displayTime

                    };
                }
            }
        );


    return latestDraw;
}


// =========================================================
// GET GHANA SCHEDULE
// =========================================================

function getLatestGhanaDraw() {

    const lagos =
        getLagosTimeParts();


    const ghanaGame =
        ghanaDrawSchedule[
            lagos.weekday
        ];


    if (!ghanaGame) {

        return null;
    }


    const currentMinutes =
        (
            lagos.hour *
            60
        )
        +
        lagos.minute;


    if (
        currentMinutes <
        ghanaGame.drawMinutes
    ) {

        return null;
    }


    return {

        lottery:
            "ghana",

        game:
            ghanaGame.game,

        databaseNames:
            [
                ghanaGame.game
            ],

        drawDate:
            makeDateString(
                lagos.year,
                lagos.month,
                lagos.day
            ),

        displayTime:
            ghanaGame.displayTime

    };
}


// =========================================================
// FETCH SCHEDULED RESULT
// =========================================================

async function fetchScheduledResult(
    schedule
) {

    if (!schedule) {

        return null;
    }


    let query =
        supabaseClient

            .from(
                "results"
            )

            .select(
                "lottery, game, draw_date, winning, machine"
            )

            .eq(
                "lottery",
                schedule.lottery
            )

            .eq(
                "draw_date",
                schedule.drawDate
            );


    if (
        schedule.databaseNames
            .length > 1
    ) {

        query =
            query.in(
                "game",
                schedule.databaseNames
            );
    }

    else {

        query =
            query.eq(
                "game",
                schedule.databaseNames[
                    0
                ]
            );
    }


    const {
        data,
        error
    } =
        await query.limit(
            1
        );


    if (error) {

        throw error;
    }


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        return null;
    }


    return data[0];
}


// =========================================================
// HOMEPAGE RESULT CARD
// =========================================================

function createHomeResultCard(
    result,
    schedule
) {

    const winning =
        parseJsonbBalls(
            result.winning
        );


    const machine =
        result.lottery === "ghana"
            ? []
            : parseJsonbBalls(
                result.machine
            );


    const winningBalls =
        createNumberBalls(
            winning,
            "winning"
        );


    const machineBalls =
        createNumberBalls(
            machine,
            "machine"
        );

    const machineSection = machine.length
        ? `
            <div class="home-number-section">
                <h4>Machine Numbers</h4>
                <div class="machine-numbers">${machineBalls}</div>
            </div>
        `
        : "";


    const game =
        normalizeGameName(
            result.game
        );


    const lottery =
        getLotteryDisplayName(
            result.lottery
        );


    const date =
        formatResultDate(
            result.draw_date
        );


    return `

        <article class="home-result-card${machine.length ? "" : " home-result-card-no-machine"}">

            <div class="home-result-heading">

                <div>

                    <h3>
                        ${escapeHTML(
                            game
                        )}
                    </h3>

                    <span>
                        ${escapeHTML(
                            lottery
                        )}
                    </span>

                </div>


                <div
                    style="
                        text-align:right;
                    "
                >

                    <span>
                        ${escapeHTML(
                            date
                        )}
                    </span>


                    <div
                        style="
                            margin-top:5px;
                            color:#16a34a;
                            font-size:13px;
                            font-weight:800;
                        "
                    >
                        Draw:
                        ${escapeHTML(
                            schedule.displayTime
                        )}
                    </div>

                    <button
                        type="button"
                        class="result-share-btn home-result-share-btn"
                        data-share-result
                        data-share-game="${escapeHTML(game)}"
                        data-share-lottery="${escapeHTML(lottery)}"
                        data-share-date="${escapeHTML(date)}"
                        data-share-winning="${escapeHTML(winning.join("-"))}"
                        data-share-machine="${escapeHTML(machine.join("-"))}"
                        data-share-url="${RESULTS_SHARE_URL}"
                        aria-label="Share ${escapeHTML(game)} result"
                    >
                        Share
                    </button>

                </div>

            </div>


            <div class="home-number-section">

                <h4>
                    Winning Numbers
                </h4>

                <div class="winning-numbers">
                    ${winningBalls}
                </div>

            </div>


            ${machineSection}

            ${createResultPlayerActions("home-result-player-actions")}

        </article>

    `;
}


// =========================================================
// FALLBACK LATEST MODERN RESULT
// =========================================================

async function fetchLatestModernFallback() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "results"
            )

            .select(
                "lottery, game, draw_date, winning, machine"
            )

            .eq(
                "lottery",
                "modern-billionaire"
            )

            .order(
                "draw_date",
                {
                    ascending:
                        false
                }
            )

            .limit(
                30
            );


    if (error) {

        throw error;
    }


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        return null;
    }


    /*
     Select the newest result date, then choose
     the last published game in the official
     daily game order.
    */

    const newestDate =
        data[0].draw_date;


    const newestDateResults =
        data.filter(
            result =>
                result.draw_date ===
                newestDate
        );


    const order =
        gameOrder[
            "modern-billionaire"
        ] || [];


    const latestPublishedResult =
        [...newestDateResults]
            .sort(
                (a, b) => {

                    const indexA =
                        order.indexOf(
                            normalizeGameName(
                                a.game
                            )
                        );


                    const indexB =
                        order.indexOf(
                            normalizeGameName(
                                b.game
                            )
                        );


                    const positionA =
                        indexA === -1
                            ? -1
                            : indexA;


                    const positionB =
                        indexB === -1
                            ? -1
                            : indexB;


                    return (
                        positionB -
                        positionA
                    );
                }
            )[0];


    return (
        latestPublishedResult ||
        data[0] ||
        null
    );
}


// =========================================================
// FALLBACK LATEST GHANA RESULT
// =========================================================

async function fetchLatestGhanaFallback() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "results"
            )

            .select(
                "lottery, game, draw_date, winning, machine, created_at"
            )

            .eq(
                "lottery",
                "ghana"
            )

            /*
             Use the most recently published Ghana
             result. Empty timestamps must come last
             so older imported records cannot override
             a newly published result.
            */

            .order(
                "created_at",
                {
                    ascending:
                        false,
                    nullsFirst:
                        false
                }
            )

            .order(
                "draw_date",
                {
                    ascending:
                        false,
                    nullsFirst:
                        false
                }
            )

            .limit(
                1
            );


    if (error) {

        throw error;
    }


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        return null;
    }


    return data[0];
}


// =========================================================
// DISPLAY HOMEPAGE RESULTS
// =========================================================

async function displayHomepageResults() {

    if (!homeResultsContainer) {

        return;
    }


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        homeResultsContainer.innerHTML = `
            <div class="no-results">
                <h3>
                    Results Temporarily Unavailable
                </h3>
            </div>
        `;

        return;
    }


    homeResultsContainer.innerHTML = `
        <p
            style="
                grid-column:1/-1;
                text-align:center;
                padding:25px;
            "
        >
            Loading latest results...
        </p>
    `;


    try {

        const modernSchedule =
            getLatestModernDraw();


        const ghanaSchedule =
            getLatestGhanaDraw();


        let modernResult =
            null;


        let ghanaResult =
            null;


        if (modernSchedule) {

            modernResult =
                await fetchScheduledResult(
                    modernSchedule
                );
        }


        /*
         If the exact latest scheduled
         result has not been uploaded yet,
         keep a previously available
         Modern result on the homepage.
        */

        if (!modernResult) {

            modernResult =
                await fetchLatestModernFallback();
        }


        if (ghanaSchedule) {

            ghanaResult =
                await fetchScheduledResult(
                    ghanaSchedule
                );
        }


        /*
         If today's scheduled Ghana result is
         not available yet, show the newest
         Ghana result already published.
        */

        if (!ghanaResult) {

            ghanaResult =
                await fetchLatestGhanaFallback();
        }


        let html = "";


        if (modernResult) {

            const scheduleForCard =

                modernSchedule &&
                normalizeGameName(
                    modernResult.game
                ) ===
                normalizeGameName(
                    modernSchedule.game
                ) &&
                modernResult.draw_date ===
                modernSchedule.drawDate

                    ? modernSchedule

                    : {
                        displayTime:
                            "Published Result"
                    };


            html +=
                createHomeResultCard(
                    modernResult,
                    scheduleForCard
                );
        }


        if (ghanaResult) {

            const ghanaScheduleForCard =

                ghanaSchedule &&
                normalizeGameName(
                    ghanaResult.game
                ) ===
                normalizeGameName(
                    ghanaSchedule.game
                ) &&
                ghanaResult.draw_date ===
                ghanaSchedule.drawDate

                    ? ghanaSchedule

                    : {
                        displayTime:
                            "Published Result"
                    };


            html +=
                createHomeResultCard(
                    ghanaResult,
                    ghanaScheduleForCard
                );
        }


        if (!html) {

            homeResultsContainer.innerHTML = `

                <div
                    class="no-results"
                    style="grid-column:1/-1;"
                >

                    <h3>
                        No Result Available
                    </h3>

                    <p>
                        Latest results will
                        appear here once
                        published.
                    </p>

                </div>

            `;

            return;
        }


        homeResultsContainer.innerHTML =
            html;

    }


    catch (error) {

        console.error(
            "HOMEPAGE RESULTS ERROR:",
            error
        );


        homeResultsContainer.innerHTML = `

            <div
                class="no-results"
                style="grid-column:1/-1;"
            >

                <h3>
                    Results Temporarily Unavailable
                </h3>

                <p>
                    ${escapeHTML(
                        error?.message ||
                        "Please check again shortly."
                    )}
                </p>

            </div>

        `;
    }
}


// =========================================================
// DAILY MODERN RESULTS LANDING VIEW
// =========================================================

function createPendingDailyResultCard(game, drawDate) {
    const normalizedGame =
        normalizeGameName(game);

    const schedule =
        modernDrawSchedule.find(item =>
            item.game === normalizedGame
        );

    const displayTime =
        schedule?.displayTime ||
        (normalizedGame === "Queen" ? "12:00 AM" : "Pending");

    return `
        <article class="result-card daily-result-pending">
            <div class="result-top">
                <div class="result-game-info">
                    <h3>${escapeHTML(getResultsArchiveGameName(normalizedGame))}</h3>
                    <span class="lottery-name">${escapeHTML(displayTime)}</span>
                </div>
                <div class="result-meta">
                    <span class="draw-time">${escapeHTML(formatResultDate(drawDate))}</span>
                    <span class="result-status">Pending</span>
                </div>
            </div>
            <div class="daily-result-pending-message">
                Awaiting result publication
            </div>
        </article>
    `;
}


async function displayLatestDailyModernResults() {
    if (!dailyModernResultsContainer) {
        return;
    }

    dailyModernResultsContainer.innerHTML = `
        <p style="grid-column:1/-1;text-align:center;padding:28px;color:#64748b">
            Loading daily results...
        </p>
    `;

    try {
        const { data, error } =
            await supabaseClient
                .from("results")
                .select("lottery, game, draw_date, winning, machine")
                .eq("lottery", "modern-billionaire")
                .order("draw_date", { ascending: false })
                .limit(36);

        if (error) {
            throw error;
        }

        if (!Array.isArray(data) || data.length === 0) {
            dailyModernResultsContainer.innerHTML = `
                <div class="no-results" style="grid-column:1/-1">
                    <h3>No Daily Results Available</h3>
                    <p>Published Modern Billionaire results will appear here.</p>
                </div>
            `;

            if (dailyModernResultsLabel) {
                dailyModernResultsLabel.textContent =
                    "No published day is currently available";
            }

            return;
        }

        const latestDate =
            String(data[0].draw_date || "");

        const resultsByGame = new Map();

        data
            .filter(result =>
                String(result.draw_date || "") === latestDate
            )
            .forEach(result => {
                const key =
                    normalizeGameName(result.game).toUpperCase();

                if (key && !resultsByGame.has(key)) {
                    resultsByGame.set(key, result);
                }
            });

        const dailyResults =
            [...resultsByGame.values()];

        dailyModernResultsContainer.innerHTML =
            lotteryGames["modern-billionaire"]
                .map(game => {
                    const result =
                        resultsByGame.get(
                            normalizeGameName(game).toUpperCase()
                        );

                    return result
                        ? createResultCard(result)
                        : createPendingDailyResultCard(
                            game,
                            latestDate
                        );
                })
                .join("");

        if (dailyModernResultsLabel) {
            dailyModernResultsLabel.textContent =
                `${formatResultDate(latestDate)} • ${dailyResults.length} of 12 games published`;
        }
    }
    catch (error) {
        console.error(
            "DAILY MODERN RESULTS ERROR:",
            error
        );

        dailyModernResultsContainer.innerHTML = `
            <div class="no-results" style="grid-column:1/-1">
                <h3>Daily Results Temporarily Unavailable</h3>
                <p>Please refresh the page and try again.</p>
            </div>
        `;

        if (dailyModernResultsLabel) {
            dailyModernResultsLabel.textContent =
                "Unable to load the latest published day";
        }
    }
}


// =========================================================
// DAILY GHANA RESULT LANDING VIEW
// =========================================================

function getTodayGhanaDrawSchedule() {
    const lagos =
        getLagosTimeParts();

    const draw =
        ghanaDrawSchedule[lagos.weekday];

    if (!draw) {
        return null;
    }

    return {
        lottery: "ghana",
        game: draw.game,
        databaseNames:
            getGameDatabaseNames(draw.game),
        drawDate:
            makeDateString(
                lagos.year,
                lagos.month,
                lagos.day
            ),
        displayTime: draw.displayTime
    };
}


function createPendingDailyGhanaResultCard(schedule) {
    return `
        <article class="result-card result-card-no-machine daily-result-pending">
            <div class="result-top">
                <div class="result-game-info">
                    <h3>${escapeHTML(getResultsArchiveGameName(schedule.game))}</h3>
                    <span class="lottery-name">Ghana Games • ${escapeHTML(schedule.displayTime)}</span>
                </div>
                <div class="result-meta">
                    <span class="draw-time">${escapeHTML(formatResultDate(schedule.drawDate))}</span>
                    <span class="result-status">Pending</span>
                </div>
            </div>
            <div class="daily-result-pending-message">
                Awaiting result publication
            </div>
        </article>
    `;
}


async function displayLatestDailyGhanaResult() {
    if (!dailyGhanaResultsContainer) {
        return;
    }

    const schedule =
        getTodayGhanaDrawSchedule();

    if (!schedule) {
        if (dailyGhanaResultsLabel) {
            dailyGhanaResultsLabel.textContent = "";
        }

        dailyGhanaResultsContainer.innerHTML = `
            <div class="no-results" style="grid-column:1/-1">
                <h3>No Ghana Game Scheduled</h3>
            </div>
        `;
        return;
    }

    if (dailyGhanaResultsLabel) {
        dailyGhanaResultsLabel.textContent =
            formatResultDate(schedule.drawDate);
    }

    dailyGhanaResultsContainer.innerHTML = `
        <p style="grid-column:1/-1;text-align:center;padding:28px;color:#64748b">
            Loading Ghana result...
        </p>
    `;

    try {
        const [liveResult, bundledResult] =
            await Promise.allSettled([
                fetchScheduledResult(schedule),
                fetchBundledGhanaResults()
            ]);

        const liveResults =
            liveResult.status === "fulfilled" && liveResult.value
                ? [liveResult.value]
                : [];

        const bundledResults =
            bundledResult.status === "fulfilled"
                ? bundledResult.value.filter(result =>
                    result.draw_date === schedule.drawDate &&
                    normalizeGameName(result.game) ===
                        normalizeGameName(schedule.game)
                )
                : [];

        if (
            liveResult.status === "rejected" &&
            bundledResult.status === "rejected"
        ) {
            throw liveResult.reason;
        }

        const result =
            mergeResultSources(
                liveResults,
                bundledResults
            )[0] || null;

        dailyGhanaResultsContainer.innerHTML =
            result
                ? createResultCard(result)
                : createPendingDailyGhanaResultCard(schedule);

    }
    catch (error) {
        console.error(
            "DAILY GHANA RESULT ERROR:",
            error
        );

        dailyGhanaResultsContainer.innerHTML = `
            <div class="no-results" style="grid-column:1/-1">
                <h3>Ghana Result Temporarily Unavailable</h3>
                <p>Please refresh the page and try again.</p>
            </div>
        `;

    }
}


// =========================================================
// RESULTS PAGE EVENTS
// =========================================================

function setResultsFolderState(lottery, expanded) {
    resultsFolderButtons.forEach(button => {
        const isTarget =
            button.dataset.resultsFolder === lottery;

        if (isTarget) {
            button.setAttribute(
                "aria-expanded",
                expanded ? "true" : "false"
            );

            const action =
                button.querySelector(
                    ".results-directory-folder-action"
                );

            if (action) {
                action.textContent =
                    expanded ? "Close" : "Open";
            }
        }
    });

    resultsFolderPanels.forEach(panel => {
        if (panel.dataset.resultsFolderPanel === lottery) {
            panel.hidden = !expanded;
        }
    });
}


function openOnlyResultsFolder(lottery) {
    resultsFolderButtons.forEach(button => {
        const folder =
            button.dataset.resultsFolder;

        setResultsFolderState(
            folder,
            folder === lottery
        );
    });
}


resultsFolderButtons.forEach(button => {
    button.addEventListener("click", function () {
        const lottery =
            button.dataset.resultsFolder;

        const isExpanded =
            button.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
            setResultsFolderState(lottery, false);
        }
        else {
            openOnlyResultsFolder(lottery);
        }
    });
});

function getResultsArchiveGameName(game) {
    const normalized =
        normalizeGameName(game);

    if (normalized === "Golden") {
        return "Golden Night";
    }

    if (normalized === "ASEDA") {
        return "Aseda";
    }

    return normalized || "Game";
}


function getResultsArchiveLotteryName(lottery) {
    return lottery === "ghana"
        ? "Ghana Games"
        : "Modern Billionaire";
}


function clearResultsArchiveDates() {
    if (yearSelect) {
        yearSelect.value = "";
    }

    if (monthSelect) {
        monthSelect.value = "";
    }

    if (dateInput) {
        dateInput.value = "";
        dateInput.max = "2026-12-31";
    }

    if (endDateInput) {
        endDateInput.value = "";
        endDateInput.min = "2023-01-01";
    }
}


function updateResultsArchiveURL() {
    if (!lotteryType?.value || !gameSelect?.value) {
        window.history.replaceState(
            {},
            "",
            window.location.pathname
        );
        return;
    }

    const params = new URLSearchParams();

    params.set("lottery", lotteryType.value);
    params.set("game", getResultsArchiveGameName(gameSelect.value));

    if (yearSelect?.value) {
        params.set("year", yearSelect.value);
    }

    if (monthSelect?.value) {
        params.set("month", monthSelect.value);
    }

    if (dateInput?.value) {
        params.set("from", dateInput.value);
    }

    if (endDateInput?.value) {
        params.set("to", endDateInput.value);
    }

    window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
    );
}


function setActiveResultsGameCard(lottery, game) {
    const normalizedGame =
        normalizeGameName(game).toUpperCase();

    resultsGameCards.forEach(card => {
        const isActive =
            card.dataset.resultsLottery === lottery &&
            normalizeGameName(
                card.dataset.resultsGame
            ).toUpperCase() === normalizedGame;

        card.classList.toggle("is-active", isActive);
        card.setAttribute(
            "aria-pressed",
            isActive ? "true" : "false"
        );
    });
}


function findResultsGameOption(lottery, requestedGame) {
    const games = lotteryGames[lottery] || [];
    const normalizedRequested =
        normalizeGameName(requestedGame).toUpperCase();

    return games.find(game =>
        normalizeGameName(game).toUpperCase() ===
        normalizedRequested
    ) || "";
}


async function openResultsGameArchive(
    lottery,
    requestedGame,
    options = {}
) {
    if (
        !lotteryType ||
        !gameSelect ||
        !resultsArchiveWorkspace ||
        !lotteryGames[lottery]
    ) {
        return false;
    }

    const game =
        findResultsGameOption(
            lottery,
            requestedGame
        );

    if (!game) {
        return false;
    }

    if (options.clearDates !== false) {
        clearResultsArchiveDates();
    }

    lotteryType.value = lottery;
    buildGameDropdown();
    gameSelect.value = game;

    openOnlyResultsFolder(lottery);

    resultsArchiveWorkspace.hidden = false;

    if (resultsArchiveLottery) {
        resultsArchiveLottery.textContent =
            `${getResultsArchiveLotteryName(lottery)} Archive`;
    }

    if (resultsArchiveTitle) {
        resultsArchiveTitle.textContent =
            `${getResultsArchiveGameName(game)} Past Results`;
    }

    if (resultsArchiveBackLink) {
        const isGhana = lottery === "ghana";

        resultsArchiveBackLink.href = isGhana
            ? "ghana-results"
            : "modern-results";

        resultsArchiveBackLink.textContent = isGhana
            ? "← Ghana Games"
            : "← Modern Games";
    }

    setActiveResultsGameCard(lottery, game);

    if (options.updateURL !== false) {
        updateResultsArchiveURL();
    }

    await displayResults();

    if (options.scroll !== false) {
        resultsArchiveWorkspace.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    return true;
}


async function restoreResultsArchiveFromURL() {
    const params =
        new URLSearchParams(
            window.location.search
        );

    const lottery =
        params.get("lottery") || "";

    const requestedGame =
        params.get("game") || "";

    const game =
        findResultsGameOption(
            lottery,
            requestedGame
        );

    if (!game) {
        if (resultsArchiveWorkspace) {
            resultsArchiveWorkspace.hidden = true;
        }

        if (resultsContainer) {
            resultsContainer.innerHTML = "";
        }

        return false;
    }

    const selectedYear = params.get("year") || "";
    const selectedMonth = params.get("month") || "";
    const fromDate = params.get("from") || "";
    const toDate = params.get("to") || "";

    if (
        yearSelect &&
        [...yearSelect.options].some(
            option => option.value === selectedYear
        )
    ) {
        yearSelect.value = selectedYear;
    }

    if (
        monthSelect &&
        [...monthSelect.options].some(
            option => option.value === selectedMonth
        )
    ) {
        monthSelect.value = selectedMonth;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(fromDate) && dateInput) {
        dateInput.value = fromDate;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(toDate) && endDateInput) {
        endDateInput.value = toDate;
    }

    return openResultsGameArchive(
        lottery,
        game,
        {
            clearDates: false,
            updateURL: false,
            scroll: true
        }
    );
}


function closeResultsGameArchive() {
    if (resultsArchiveWorkspace) {
        resultsArchiveWorkspace.hidden = true;
    }

    if (resultsContainer) {
        resultsContainer.innerHTML = "";
    }

    if (lotteryType) {
        lotteryType.value = "";
    }

    buildGameDropdown();
    clearResultsArchiveDates();
    setActiveResultsGameCard("", "");
    updateResultsArchiveURL();

    resultsGameDirectory?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


resultsGameCards.forEach(card => {
    card.addEventListener("click", function () {
        openResultsGameArchive(
            card.dataset.resultsLottery,
            card.dataset.resultsGame
        );
    });
});


resultsDirectoryBack
    ?.addEventListener(
        "click",
        closeResultsGameArchive
    );

lotteryType
    ?.addEventListener(
        "change",
        function () {

            buildGameDropdown();
        }
    );


yearSelect
    ?.addEventListener(
        "change",
        function () {

            if (
                dateInput
            ) {

                dateInput.value =
                    "";
            }


            if (endDateInput) {

                endDateInput.value =
                    "";
            }
        }
    );


monthSelect
    ?.addEventListener(
        "change",
        function () {

            if (
                dateInput
            ) {

                dateInput.value =
                    "";
            }


            if (endDateInput) {

                endDateInput.value =
                    "";
            }
        }
    );


dateInput
    ?.addEventListener(
        "change",
        function () {

            if (
                !dateInput.value
            ) {

                return;
            }


            if (endDateInput) {

                endDateInput.min =
                    dateInput.value ||
                    "2023-01-01";
            }


            if (yearSelect) {

                yearSelect.value =
                    "";
            }


            if (monthSelect) {

                monthSelect.value =
                    "";
            }
        }
    );


endDateInput
    ?.addEventListener(
        "change",
        function () {

            if (
                !endDateInput.value
            ) {

                return;
            }


            if (dateInput) {

                dateInput.max =
                    endDateInput.value ||
                    "2026-12-31";
            }


            if (yearSelect) {

                yearSelect.value =
                    "";
            }


            if (monthSelect) {

                monthSelect.value =
                    "";
            }
        }
    );


searchButton
    ?.addEventListener(
        "click",
        function () {

            updateResultsArchiveURL();
            displayResults();
        }
    );


resetButton
    ?.addEventListener(
        "click",
        function () {
            clearResultsArchiveDates();
            modernCurrentPage = 1;
            ghanaCurrentPage = 1;
            updateResultsArchiveURL();
            displayResults();
        }
    );


// =========================================================
// LIVE RESULT UPDATES
// =========================================================

let resultsRealtimeChannel = null;
let liveResultsRefreshTimer = null;


function subscribeToLiveResultUpdates() {

    if (
        resultsRealtimeChannel ||
        typeof supabaseClient ===
            "undefined" ||
        (
            !resultsContainer &&
            !homeResultsContainer &&
            !dailyModernResultsContainer &&
            !dailyGhanaResultsContainer
        )
    ) {

        return;
    }


    resultsRealtimeChannel =
        supabaseClient

            .channel(
                "jols-live-results"
            )

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "results"
                },
                function () {

                    clearTimeout(
                        liveResultsRefreshTimer
                    );


                    liveResultsRefreshTimer =
                        setTimeout(
                            async function () {

                                if (dailyModernResultsContainer) {
                                    await displayLatestDailyModernResults();
                                }

                                if (dailyGhanaResultsContainer) {
                                    await displayLatestDailyGhanaResult();
                                }

                                if (
                                    resultsContainer &&
                                    !resultsArchiveWorkspace?.hidden
                                ) {

                                    await displayResults();
                                }


                                if (homeResultsContainer) {

                                    await displayHomepageResults();
                                }
                            },
                            700
                        );
                }
            )

            .subscribe(
                function (status) {

                    if (
                        status ===
                        "SUBSCRIBED"
                    ) {

                        console.log(
                            "LIVE RESULT UPDATES CONNECTED"
                        );
                    }
                }
            );
}


// =========================================================
// START WEBSITE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "JEJOYINYE WEBSITE STARTING..."
        );


        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            console.error(
                "supabaseClient is not defined. Check supabase.js."
            );


            if (resultsContainer) {

                resultsContainer.innerHTML = `

                    <div
                        class="no-results"
                        style="grid-column:1/-1;"
                    >

                        <h3>
                            Database Connection Error
                        </h3>

                        <p>
                            Supabase could not
                            be connected.
                        </p>

                    </div>

                `;
            }


            return;
        }


        // =============================================
        // RESULTS PAGE
        // =============================================

        if (
            resultsContainer ||
            dailyModernResultsContainer ||
            dailyGhanaResultsContainer
        ) {
            const resultPageTasks = [];

            if (dailyModernResultsContainer) {
                resultPageTasks.push(
                    displayLatestDailyModernResults()
                );
            }

            if (dailyGhanaResultsContainer) {
                resultPageTasks.push(
                    displayLatestDailyGhanaResult()
                );
            }

            if (resultsContainer) {
                resultPageTasks.push(
                    restoreResultsArchiveFromURL()
                );
            }

            await Promise.all(resultPageTasks);
        }


        // =============================================
        // HOMEPAGE
        // =============================================

        if (homeResultsContainer) {

            await displayHomepageResults();


            /*
             Refresh homepage result
             every 60 seconds.
            */

            setInterval(
                displayHomepageResults,
                60000
            );
        }


        subscribeToLiveResultUpdates();


        console.log(
            "JEJOYINYE WEBSITE READY"
        );
    }
);
