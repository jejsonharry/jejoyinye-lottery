"use strict";

// =========================================================
// JEJOYINYE LOTTERY SERVICES
// COMPLETE WEBSITE SCRIPT
// VERSION 30
// =========================================================

console.log("JEJOYINYE SCRIPT VERSION 30 LOADED");


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
        "Monday Special",
        "Lucky Tuesday",
        "Mid Week",
        "Thursday Fortune",
        "Friday Bonanza",
        "National",
        "ASEDA"
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
        "Monday Special",
        "Lucky Tuesday",
        "Mid Week",
        "Thursday Fortune",
        "Friday Bonanza",
        "National",
        "ASEDA"
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
        drawMinutes: (19 * 60) + 15,
        displayTime: "7:15 PM"
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

const RESULTS_PER_PAGE = 120;

const DATABASE_BATCH_SIZE = 1000;

let currentPage = 1;

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


    if (
        clean.toLowerCase() ===
        "golden night"
    ) {

        return "Golden";
    }


    return clean;
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

        if (
            normalizeGameName(
                selectedGame
            ) ===
            "Golden"
        ) {

            query =
                query.in(
                    "game",
                    [
                        "Golden",
                        "Golden Night"
                    ]
                );
        }

        else {

            query =
                query.eq(
                    "game",
                    selectedGame
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


    return query;
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

function sortLotteryResults(
    results
) {

    return [
        ...results
    ].sort(
        (a, b) => {

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

function createResultCard(
    result
) {

    const winning =
        parseJsonbBalls(
            result.winning
        );


    const machine =
        parseJsonbBalls(
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

        </article>

    `;
}


// =========================================================
// RESULTS PAGINATION
// =========================================================

function createPagination() {

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                allFilteredResults.length /
                RESULTS_PER_PAGE
            )
        );


    return `

        <div
            class="results-pagination"
            style="grid-column:1/-1;"
        >

            <button
                type="button"
                id="previous-results-page"
                ${
                    currentPage <= 1
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
                Page ${currentPage}
                of ${totalPages}
            </span>


            <button
                type="button"
                id="next-results-page"
                ${
                    currentPage >=
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
    lottery
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


    const title =
        isGhana
            ? "Ghana Results"
            : "Modern Billionaire Results";


    const groupClass =
        isGhana
            ? "ghana-results-group"
            : "modern-results-group";


    return `

        <section
            class="lottery-results-group ${groupClass}"
        >

            <div class="lottery-results-heading">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <span>
                    ${results.length}
                    ${results.length === 1 ? "result" : "results"}
                    on this page
                </span>

            </div>

            <div class="lottery-results-list">

                ${results
                    .map(createResultCard)
                    .join("")}

            </div>

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


    const totalResults =
        allFilteredResults.length;


    const totalPages =
        Math.ceil(
            totalResults /
            RESULTS_PER_PAGE
        );


    if (
        currentPage >
        totalPages
    ) {

        currentPage =
            totalPages;
    }


    if (
        currentPage < 1
    ) {

        currentPage = 1;
    }


    const startIndex =
        (
            currentPage -
            1
        ) *
        RESULTS_PER_PAGE;


    const endIndex =
        Math.min(
            startIndex +
            RESULTS_PER_PAGE,
            totalResults
        );


    const pageResults =
        allFilteredResults.slice(
            startIndex,
            endIndex
        );


    const modernResults =
        pageResults.filter(
            result =>
                result.lottery ===
                "modern-billionaire"
        );


    const ghanaResults =
        pageResults.filter(
            result =>
                result.lottery ===
                "ghana"
        );


    resultsContainer.innerHTML =

        createLotteryResultsGroup(
            modernResults,
            "modern-billionaire"
        )

        +

        createLotteryResultsGroup(
            ghanaResults,
            "ghana"
        )

        +

        createPagination();


    if (resultsDateLabel) {

        resultsDateLabel.textContent =
            `Showing ${
                startIndex + 1
            } - ${
                endIndex
            } of ${
                totalResults
            } Results`;
    }


    const previousButton =
        document.getElementById(
            "previous-results-page"
        );


    const nextButton =
        document.getElementById(
            "next-results-page"
        );


    previousButton
        ?.addEventListener(
            "click",
            function () {

                if (
                    currentPage > 1
                ) {

                    currentPage--;

                    renderCurrentPage();

                    scrollToResults();
                }
            }
        );


    nextButton
        ?.addEventListener(
            "click",
            function () {

                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderCurrentPage();

                    scrollToResults();
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


        const results =
            await fetchAllFilteredSupabaseResults();


        console.log(
            "Results received:",
            results.length
        );


        allFilteredResults =
            sortLotteryResults(
                results
            );


        currentPage = 1;


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
        parseJsonbBalls(
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

            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            )

            .order(
                "draw_date",
                {
                    ascending:
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
// RESULTS PAGE EVENTS
// =========================================================

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

            displayResults();
        }
    );


resetButton
    ?.addEventListener(
        "click",
        function () {

            if (lotteryType) {
                lotteryType.value = "";
            }


            buildGameDropdown();


            if (gameSelect) {
                gameSelect.value = "";
            }


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


            currentPage = 1;
            displayResults();
        }
    );


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

        if (resultsContainer) {

            buildGameDropdown();


            await displayResults();
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


        console.log(
            "JEJOYINYE WEBSITE READY"
        );
    }
);
