"use strict";


// =========================================================
// JEJOYINYE LOTTERY SERVICES
// ADMIN DASHBOARD
// VERSION 1400
// =========================================================

console.log(
    "JEJOYINYE ADMIN VERSION 1400 LOADED"
);


// =========================================================
// TABLES
// =========================================================

const TABLES = {
    results: "results",
    agents: "agent_applications",
    messages: "messages"
};


// =========================================================
// GAMES
// =========================================================

const ADMIN_GAMES = {

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
// PAGE ELEMENTS
// =========================================================

const lotterySelect =
    document.getElementById(
        "admin-lottery"
    );


const gameSelect =
    document.getElementById(
        "admin-game"
    );


const dateInput =
    document.getElementById(
        "admin-date"
    );


const resultForm =
    document.getElementById(
        "result-entry-form"
    );

const machineNumberHelp =
    document.getElementById("machine-number-help");

const machineInputs =
    Array.from(document.querySelectorAll(".machine-input"));


const publishButton =
    document.getElementById(
        "publish-btn"
    );


const cancelEditButton =
    document.getElementById(
        "cancel-edit-btn"
    );


const adminMessage =
    document.getElementById(
        "admin-message"
    );


const logoutButton =
    document.getElementById(
        "logout-btn"
    );


const resultsContainer =
    document.getElementById(
        "published-results-container"
    );

const resultSearchInput = document.getElementById("admin-result-search");
const resultLotteryFilter = document.getElementById("admin-result-lottery-filter");
const resultGameFilter = document.getElementById("admin-result-game-filter");
const resultDateFilter = document.getElementById("admin-result-date-filter");
const resultFilterCount = document.getElementById("admin-result-filter-count");
const clearResultFiltersButton = document.getElementById("clear-result-filters");


const applicationsContainer =
    document.getElementById(
        "agent-applications-container"
    );


const messagesContainer =
    document.getElementById(
        "contact-messages-container"
    );


const agentSearch =
    document.getElementById(
        "agent-search"
    );


const agentStatusFilter =
    document.getElementById(
        "agent-status-filter"
    );


const resultsCount =
    document.getElementById(
        "admin-results-count"
    );


const applicationsCount =
    document.getElementById(
        "admin-applications-count"
    );


const pendingCount =
    document.getElementById(
        "admin-pending-count"
    );


const archivedCount =
    document.getElementById(
        "admin-archived-count"
    );


const messagesCount =
    document.getElementById(
        "admin-messages-count"
    );


const unreadMessagesCount = document.getElementById("admin-unread-messages-count");
const unreadTabCount = document.getElementById("admin-unread-tab-count");


// =========================================================
// MODAL
// =========================================================

const agentModal =
    document.getElementById(
        "agent-details-modal"
    );


const agentModalContent =
    document.getElementById(
        "agent-modal-content"
    );


const closeAgentModalButton =
    document.getElementById(
        "close-agent-modal"
    );


const modalApproveButton =
    document.getElementById(
        "modal-approve-agent"
    );


const modalRejectButton =
    document.getElementById(
        "modal-reject-agent"
    );


const modalArchiveButton =
    document.getElementById(
        "modal-archive-agent"
    );


const modalRestoreButton =
    document.getElementById(
        "modal-restore-agent"
    );


// =========================================================
// STATE
// =========================================================

let editingResult =
    null;

let allAdminResults = [];


let allApplications =
    [];


let selectedApplication =
    null;


let inactivityTimer =
    null;


const INACTIVITY_LIMIT =
    15 * 60 * 1000;


let allMessages = [];
let currentMessageFilter = "inbox";
let messageRefreshTimer = null;
let messageLoadInProgress = false;
const MESSAGE_REFRESH_INTERVAL = 60 * 1000;

// =========================================================
// ANALYTICS
// =========================================================
let analyticsRange = "30";
let analyticsLoaded = false;

function setAnalyticsText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value);
}

function analyticsStartDate(days) {
    const date = new Date();
    date.setDate(date.getDate() - (Number(days) - 1));
    return date.toISOString().slice(0, 10);
}

async function countResultsForAnalytics(lottery = null, range = "all") {
    let query = supabaseClient.from(TABLES.results).select("*", { count: "exact", head: true });
    if (lottery) query = query.eq("lottery", lottery);
    if (range !== "all") query = query.gte("draw_date", analyticsStartDate(range));
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
}

function renderAnalyticsActivity() {
    const container = document.getElementById("analytics-recent-activity");
    if (!container) return;
    const activity = [];
    allAdminResults.slice(0, 4).forEach(item => activity.push({
        date: item.draw_date || "",
        title: `${item.game || "Lottery"} result`,
        detail: item.lottery === "modern-billionaire" ? "Modern Billionaire" : "Ghana Games"
    }));
    allApplications.slice(0, 3).forEach(item => activity.push({
        date: item.created_at || "",
        title: "Agent application",
        detail: item.full_name || "New applicant"
    }));
    allMessages.slice(0, 3).forEach(item => activity.push({
        date: item.created_at || "",
        title: "Customer message",
        detail: item.name || item.full_name || "Website visitor"
    }));
    activity.sort((a,b) => new Date(b.date || 0) - new Date(a.date || 0));
    const latest = activity.slice(0, 7);
    if (!latest.length) { container.innerHTML = '<div class="admin-empty">No recent activity found.</div>'; return; }
    container.innerHTML = latest.map(item => `
        <div class="analytics-activity-item">
            <div><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.detail)}</span></div>
            <time>${escapeHTML(item.date ? formatDateTime(item.date) : "")}</time>
        </div>`).join("");
}

function renderAgentAnalytics() {
    const active = allApplications.filter(item => item.archived !== true);
    const countStatus = status => active.filter(item => String(item.status || "pending").toLowerCase() === status).length;
    setAnalyticsText("analytics-agent-total", allApplications.length);
    setAnalyticsText("analytics-agent-pending", `${countStatus("pending")} pending`);
    setAnalyticsText("analytics-approved-count", countStatus("approved"));
    setAnalyticsText("analytics-pending-count", countStatus("pending"));
    setAnalyticsText("analytics-rejected-count", countStatus("rejected"));
    setAnalyticsText("analytics-archived-count", allApplications.filter(item => item.archived === true).length);
}

function renderMessageAnalytics() {
    const inbox = allMessages.filter(item => item.archived !== true);
    const unread = inbox.filter(item => item.is_read !== true);
    setAnalyticsText("analytics-message-total", allMessages.length);
    setAnalyticsText("analytics-message-unread", `${unread.length} unread`);
}

async function loadAnalytics() {
    const refresh = document.getElementById("analytics-refresh");
    if (refresh) { refresh.disabled = true; refresh.textContent = "Refreshing..."; }
    try {
        const [total, period, modern, ghana] = await Promise.all([
            countResultsForAnalytics(null, "all"),
            countResultsForAnalytics(null, analyticsRange),
            countResultsForAnalytics("modern-billionaire", analyticsRange),
            countResultsForAnalytics("ghana", analyticsRange)
        ]);
        setAnalyticsText("analytics-total-results", total.toLocaleString());
        setAnalyticsText("analytics-period-results", period.toLocaleString());
        setAnalyticsText("analytics-lottery-total", period.toLocaleString());
        setAnalyticsText("analytics-modern-count", modern.toLocaleString());
        setAnalyticsText("analytics-ghana-count", ghana.toLocaleString());
        setAnalyticsText("analytics-period-label", analyticsRange === "all" ? "All time" : `Last ${analyticsRange} days`);
        const max = Math.max(modern, ghana, 1);
        const modernBar = document.getElementById("analytics-modern-bar");
        const ghanaBar = document.getElementById("analytics-ghana-bar");
        if (modernBar) modernBar.style.width = `${(modern / max) * 100}%`;
        if (ghanaBar) ghanaBar.style.width = `${(ghana / max) * 100}%`;
        renderAgentAnalytics();
        renderMessageAnalytics();
        renderAnalyticsActivity();
        analyticsLoaded = true;
    } catch (error) {
        console.error("Analytics error:", error);
        const container = document.getElementById("analytics-recent-activity");
        if (container) container.innerHTML = `<div class="admin-error-message">${escapeHTML(error.message || "Unable to load analytics.")}</div>`;
    } finally {
        if (refresh) { refresh.disabled = false; refresh.textContent = "Refresh"; }
    }
}



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
// TAB SYSTEM
// =========================================================

function openAdminTab(tabId) {

    document
        .querySelectorAll(".admin-tab-content")
        .forEach(section => {
            section.classList.remove("active");
        });


    document
        .querySelectorAll(".admin-tab-button")
        .forEach(button => {
            button.classList.remove("active");
        });


    const selectedTab =
        document.getElementById(tabId);


    if (selectedTab) {
        selectedTab.classList.add("active");
    }


    const selectedButton =
        document.querySelector(
            `.admin-tab-button[data-tab="${tabId}"]`
        );


    if (selectedButton) {
        selectedButton.classList.add("active");
    }


    // Automatically reload messages
    // whenever Messages tab is opened
    if (tabId === "messages-tab") {

        loadContactMessages();
    }


    // Reload agents whenever Agents tab is opened
    if (tabId === "agents-tab") {

        loadAgentApplications();
    }


    // Reload results whenever Results tab is opened
    if (tabId === "results-tab") {

        loadResults();
    }

    if (tabId === "analytics-tab") {
        loadAnalytics();
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =========================================================
// AUTHENTICATION
// =========================================================

async function checkAuthentication() {

    try {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) throw error;

        if (!data?.session) {
            window.location.replace("login.html");
            return false;
        }

        // Security v1400: authentication alone is not enough.
        // The signed-in user must also be active in public.admin_users.
        const { data: isAdmin, error: adminError } =
            await supabaseClient.rpc("is_admin");

        if (adminError) throw adminError;

        if (isAdmin !== true) {
            console.warn("Admin access denied for authenticated user.");
            await supabaseClient.auth.signOut();
            window.location.replace("login.html");
            return false;
        }

        return true;

    } catch (error) {
        console.error("Admin authentication error:", error);
        try {
            await supabaseClient.auth.signOut();
        } catch (signOutError) {
            console.error("Sign-out error:", signOutError);
        }
        window.location.replace("login.html");
        return false;
    }
}



// =========================================================
// ADMIN MESSAGE
// =========================================================

function showSuccess(message) {

    if (!adminMessage) {

        return;
    }


    adminMessage.innerHTML = `

        <div class="admin-success-message">

            ${escapeHTML(
                message
            )}

        </div>

    `;
}


function showError(message) {

    if (!adminMessage) {

        return;
    }


    adminMessage.innerHTML = `

        <div class="admin-error-message">

            ${escapeHTML(
                message
            )}

        </div>

    `;
}


function clearMessage() {

    if (adminMessage) {

        adminMessage.innerHTML =
            "";
    }
}


// =========================================================
// DATE FORMATTING
// =========================================================

function formatDateTime(value) {

    if (!value) {

        return "N/A";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);
    }


    return date.toLocaleString(

        "en-GB",

        {

            day:
                "numeric",

            month:
                "short",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"

        }

    );
}


function formatDrawDate(value) {

    if (!value) {

        return "N/A";
    }


    const date =
        new Date(
            `${value}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);
    }


    return date.toLocaleDateString(

        "en-GB",

        {

            day:
                "numeric",

            month:
                "long",

            year:
                "numeric"

        }

    );
}


// =========================================================
// PARSE NUMBER ARRAYS
// =========================================================

function parseNumberArray(value) {

    if (
        Array.isArray(value)
    ) {

        return value

            .map(Number)

            .filter(
                Number.isInteger
            );
    }


    if (
        typeof value ===
        "string"
    ) {

        try {

            const parsed =
                JSON.parse(value);


            if (
                Array.isArray(parsed)
            ) {

                return parsed

                    .map(Number)

                    .filter(
                        Number.isInteger
                    );
            }

        }


        catch {

            const numbers =
                value.match(
                    /\d+/g
                );


            return numbers

                ? numbers.map(Number)

                : [];
        }
    }


    if (
        value &&
        typeof value ===
        "object"
    ) {

        return Object
            .values(value)

            .map(Number)

            .filter(
                Number.isInteger
            );
    }


    return [];
}


// =========================================================
// LOAD GAMES
// =========================================================

function loadGames(lottery) {

    if (!gameSelect) {

        return;
    }


    gameSelect.innerHTML = `

        <option value="">
            Select Game
        </option>

    `;


    const games =
        ADMIN_GAMES[
            lottery
        ];


    if (!games) {

        return;
    }


    games.forEach(
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

function updateMachineNumberRequirement() {

    const isGhana = lotterySelect?.value === "ghana";

    machineInputs.forEach(input => {
        input.required = !isGhana;
        input.disabled = isGhana;
        input.placeholder = isGhana ? "N/A" : "";

        if (isGhana) {
            input.value = "";
        }
    });

    if (machineNumberHelp) {
        machineNumberHelp.textContent = isGhana
            ? "Ghana Games publishes winning numbers only. Machine numbers are not required."
            : "Enter five numbers between 1 and 90.";
    }
}


// =========================================================
// RESULT VALIDATION
// =========================================================

function numbersAreValid(
    numbers
) {

    return (

        numbers.length ===
        5

        &&

        numbers.every(
            number =>

                Number.isInteger(
                    number
                )

                &&

                number >=
                1

                &&

                number <=
                90
        )

    );
}


function hasDuplicates(
    numbers
) {

    return (

        new Set(
            numbers
        ).size

        !==

        numbers.length

    );
}


// =========================================================
// RESET RESULT FORM
// =========================================================

function resetResultForm() {

    editingResult =
        null;


    resultForm?.reset();

    updateMachineNumberRequirement();


    if (gameSelect) {

        gameSelect.innerHTML = `

            <option value="">
                Select lottery first
            </option>

        `;
    }


    if (publishButton) {

        publishButton.textContent =
            "Publish Result";
    }


    if (cancelEditButton) {

        cancelEditButton.hidden =
            true;
    }
}


// =========================================================
// SAVE RESULT
// =========================================================

async function saveResult(event) {

    event.preventDefault();


    clearMessage();


    const winning =
        Array
            .from(
                document.querySelectorAll(
                    ".winning-input"
                )
            )

            .map(
                input =>
                    Number(
                        input.value
                    )
            );


    const isGhana = lotterySelect.value === "ghana";

    const machine = isGhana
        ? []
        : machineInputs.map(input => Number(input.value));


    if (
        !lotterySelect.value
        ||
        !gameSelect.value
        ||
        !dateInput.value
    ) {

        showError(
            "Select lottery, game and draw date."
        );


        return;
    }


    if (
        !numbersAreValid(
            winning
        )

        ||

        (!isGhana && !numbersAreValid(machine))
    ) {

        showError(
            "Enter five valid numbers between 1 and 90."
        );


        return;
    }


    if (
        hasDuplicates(
            winning
        )

        ||

        (!isGhana && hasDuplicates(machine))
    ) {

        showError(
            "Duplicate numbers are not allowed within the same set."
        );


        return;
    }


    const payload = {

        lottery:
            lotterySelect.value,

        game:
            gameSelect.value,

        draw_date:
            dateInput.value,

        winning,

        machine

    };


    publishButton.disabled =
        true;


    publishButton.textContent =
        "Saving...";


    try {


        if (editingResult) {


            const {
                error
            } =
                await supabaseClient

                    .from(
                        TABLES.results
                    )

                    .update(
                        payload
                    )

                    .eq(
                        "lottery",
                        editingResult.lottery
                    )

                    .eq(
                        "game",
                        editingResult.game
                    )

                    .eq(
                        "draw_date",
                        editingResult.draw_date
                    );


            if (error) {

                throw error;
            }


            showSuccess(
                "Result updated successfully."
            );

        }


        else {


            const {
                error
            } =
                await supabaseClient

                    .from(
                        TABLES.results
                    )

                    .insert(
                        [
                            payload
                        ]
                    );


            if (error) {

                throw error;
            }


            showSuccess(
                "Result published successfully."
            );

        }


        resetResultForm();


        await loadResults();

    }


    catch (error) {


        console.error(
            "Save result error:",
            error
        );


        showError(

            "Unable to save result: "

            +

            (
                error.message
                ||
                "Unknown error"
            )

        );

    }


    finally {


        publishButton.disabled =
            false;


        publishButton.textContent =
            "Publish Result";

    }
}


// =========================================================
// LOAD RESULTS
// =========================================================

async function loadResults() {

    if (!resultsContainer) {

        return;
    }


    resultsContainer.innerHTML = `

        <p class="admin-loading">
            Loading results...
        </p>

    `;


    try {


        const {
            data,
            error
        } =
            await supabaseClient

                .from(
                    TABLES.results
                )

                .select(
                    "lottery, game, draw_date, winning, machine, created_at"
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
                    120
                );


        if (error) {

            throw error;
        }


        const results =
            data || [];


        if (resultsCount) {

            resultsCount.textContent =
                String(
                    results.length
                );
        }


        allAdminResults = results;

        populateAdminResultGameFilter();
        applyAdminResultFilters();

    }


    catch (error) {


        console.error(
            "Load results error:",
            error
        );


        resultsContainer.innerHTML = `

            <div class="admin-error-message">

                ${escapeHTML(
                    error.message
                    ||
                    "Unable to load results."
                )}

            </div>

        `;

    }
}


// =========================================================
// RESULT MANAGEMENT FILTERS
// =========================================================
function populateAdminResultGameFilter() {
    if (!resultGameFilter) return;
    const currentValue = resultGameFilter.value;
    const games = [...new Set(allAdminResults.map(r => String(r.game || "").trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    resultGameFilter.innerHTML = '<option value="all">All Games</option>';
    games.forEach(game => { const option=document.createElement("option"); option.value=game; option.textContent=game; resultGameFilter.appendChild(option); });
    if (games.includes(currentValue)) resultGameFilter.value=currentValue;
}

function applyAdminResultFilters() {
    let filtered=[...allAdminResults];
    const searchText=String(resultSearchInput?.value || "").trim().toLowerCase();
    if(searchText){filtered=filtered.filter(result=>{const lotteryName=result.lottery==="modern-billionaire"?"Modern Billionaire":"Ghana Games"; return `${result.game||""} ${result.lottery||""} ${lotteryName} ${result.draw_date||""}`.toLowerCase().includes(searchText);});}
    const lottery=resultLotteryFilter?.value || "all"; if(lottery!=="all") filtered=filtered.filter(r=>r.lottery===lottery);
    const game=resultGameFilter?.value || "all"; if(game!=="all") filtered=filtered.filter(r=>r.game===game);
    const drawDate=resultDateFilter?.value || ""; if(drawDate) filtered=filtered.filter(r=>r.draw_date===drawDate);
    if(resultFilterCount) resultFilterCount.textContent=`Showing ${filtered.length} of ${allAdminResults.length} results`;
    renderResults(filtered);
}

function clearAdminResultFilters(){
    if(resultSearchInput) resultSearchInput.value="";
    if(resultLotteryFilter) resultLotteryFilter.value="all";
    if(resultGameFilter) resultGameFilter.value="all";
    if(resultDateFilter) resultDateFilter.value="";
    applyAdminResultFilters();
}

// =========================================================
// RENDER RESULTS
// =========================================================

function renderResults(
    results
) {

    if (!resultsContainer) {

        return;
    }


    if (!results.length) {


        resultsContainer.innerHTML = `

            <div class="admin-empty">

                No results found.

            </div>

        `;


        return;
    }


    resultsContainer.innerHTML =
        "";


    results.forEach(
        (
            result,
            index
        ) => {


            const winning =
                parseNumberArray(
                    result.winning
                );


            const machine =
                parseNumberArray(
                    result.machine
                );


            const winningHTML =
                winning

                    .map(
                        number => `

                            <span
                                class="
                                    admin-ball
                                    admin-ball-winning
                                "
                            >
                                ${String(number)
                                    .padStart(
                                        2,
                                        "0"
                                    )}
                            </span>

                        `
                    )

                    .join("");


            const machineHTML =
                machine

                    .map(
                        number => `

                            <span
                                class="
                                    admin-ball
                                    admin-ball-machine
                                "
                            >
                                ${String(number)
                                    .padStart(
                                        2,
                                        "0"
                                    )}
                            </span>

                        `
                    )

                    .join("");


            const lotteryName =

                result.lottery ===
                "modern-billionaire"

                    ? "Modern Billionaire"

                    : "Ghana Games";


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "admin-card";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(
                        result.game
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        lotteryName
                    )}
                </p>


                <p class="admin-muted">

                    ${escapeHTML(
                        formatDrawDate(
                            result.draw_date
                        )
                    )}

                </p>


                <div>

                    <strong>
                        Winning Numbers
                    </strong>

                    <div>
                        ${winningHTML}
                    </div>

                </div>


                <div
                    style="
                        margin-top:15px;
                    "
                >

                    <strong>
                        Machine Numbers
                    </strong>

                    <div>
                        ${machineHTML}
                    </div>

                </div>


                <div class="admin-actions">


                    <button
                        type="button"
                        class="
                            admin-success-btn
                            edit-result
                        "
                        data-index="${index}"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="
                            admin-danger-btn
                            delete-result
                        "
                        data-index="${index}"
                    >
                        Delete
                    </button>


                </div>

            `;


            resultsContainer
                .appendChild(
                    card
                );

        }
    );


    resultsContainer
        .querySelectorAll(
            ".edit-result"
        )

        .forEach(
            button => {


                button.addEventListener(
                    "click",
                    () => {


                        const index =
                            Number(
                                button.dataset.index
                            );


                        startEditingResult(
                            results[
                                index
                            ]
                        );

                    }
                );

            }
        );


    resultsContainer
        .querySelectorAll(
            ".delete-result"
        )

        .forEach(
            button => {


                button.addEventListener(
                    "click",
                    () => {


                        const index =
                            Number(
                                button.dataset.index
                            );


                        deleteResult(
                            results[
                                index
                            ]
                        );

                    }
                );

            }
        );

}


// =========================================================
// EDIT RESULT
// =========================================================

function startEditingResult(
    result
) {

    if (!result) {

        return;
    }


    editingResult = {

        lottery:
            result.lottery,

        game:
            result.game,

        draw_date:
            result.draw_date

    };


    openAdminTab(
        "results-tab"
    );


    lotterySelect.value =
        result.lottery;


    loadGames(
        result.lottery
    );

    updateMachineNumberRequirement();


    if (
        result.game ===
        "Golden Night"
    ) {


        const option =
            document.createElement(
                "option"
            );


        option.value =
            "Golden Night";


        option.textContent =
            "Golden Night";


        gameSelect.appendChild(
            option
        );

    }


    gameSelect.value =
        result.game;


    dateInput.value =
        result.draw_date;


    const winning =
        parseNumberArray(
            result.winning
        );


    const machine =
        parseNumberArray(
            result.machine
        );


    document
        .querySelectorAll(
            ".winning-input"
        )

        .forEach(
            (
                input,
                index
            ) => {

                input.value =
                    winning[
                        index
                    ]
                    ??
                    "";

            }
        );


    document
        .querySelectorAll(
            ".machine-input"
        )

        .forEach(
            (
                input,
                index
            ) => {

                input.value =
                    machine[
                        index
                    ]
                    ??
                    "";

            }
        );


    publishButton.textContent =
        "Update Result";


    cancelEditButton.hidden =
        false;


    window.scrollTo({

        top:
            0,

        behavior:
            "smooth"

    });
}


// =========================================================
// DELETE RESULT
// =========================================================

async function deleteResult(
    result
) {


    const confirmed =
        window.confirm(

            `Delete ${result.game} result for ${result.draw_date}?`

        );


    if (!confirmed) {

        return;
    }


    try {


        const {
            error
        } =
            await supabaseClient

                .from(
                    TABLES.results
                )

                .delete()

                .eq(
                    "lottery",
                    result.lottery
                )

                .eq(
                    "game",
                    result.game
                )

                .eq(
                    "draw_date",
                    result.draw_date
                );


        if (error) {

            throw error;
        }


        showSuccess(
            "Result deleted successfully."
        );


        await loadResults();

    }


    catch (error) {


        console.error(
            "Delete result error:",
            error
        );


        showError(

            "Unable to delete result: "

            +

            (
                error.message
                ||
                "Unknown error"
            )

        );

    }
}


// =========================================================
// LOAD AGENT APPLICATIONS
// =========================================================

async function loadAgentApplications() {

    if (!applicationsContainer) {

        return;
    }


    applicationsContainer.innerHTML = `

        <p class="admin-loading">
            Loading applications...
        </p>

    `;


    try {


        const {
            data,
            error
        } =
            await supabaseClient

                .from(
                    TABLES.agents
                )

                .select(`

                    id,
                    full_name,
                    phone,
                    email,
                    nin,
                    state,
                    city,
                    business_address,
                    bank_name,
                    account_name,
                    account_number,
                    lottery_experience,
                    additional_information,
                    status,
                    archived,
                    created_at

                `)

                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (error) {

            throw error;
        }


        allApplications =
            data || [];


        updateAgentStatistics();


        filterApplications();

    }


    catch (error) {


        console.error(
            "Agent application error:",
            error
        );


        applicationsContainer.innerHTML = `

            <div class="admin-error-message">

                ${escapeHTML(
                    error.message
                    ||
                    "Unable to load applications."
                )}

            </div>

        `;

    }
}


// =========================================================
// AGENT STATISTICS
// =========================================================

function updateAgentStatistics() {


    const active =
        allApplications.filter(

            item =>
                item.archived !==
                true

        );


    const pending =
        active.filter(

            item =>
                String(
                    item.status
                    ||
                    "pending"
                ).toLowerCase()
                ===
                "pending"

        );


    const archived =
        allApplications.filter(

            item =>
                item.archived ===
                true

        );


    if (applicationsCount) {

        applicationsCount.textContent =
            String(
                active.length
            );
    }


    if (pendingCount) {

        pendingCount.textContent =
            String(
                pending.length
            );
    }


    if (archivedCount) {

        archivedCount.textContent =
            String(
                archived.length
            );
    }

}


// =========================================================
// FILTER AGENTS
// =========================================================

function filterApplications() {


    const searchValue =
        String(
            agentSearch?.value
            ||
            ""
        )

            .trim()

            .toLowerCase();


    const filterValue =
        String(
            agentStatusFilter?.value
            ||
            "all"
        )

            .toLowerCase();


    const filtered =
        allApplications.filter(

            application => {


                const status =
                    String(
                        application.status
                        ||
                        "pending"
                    )

                        .toLowerCase();


                const archived =
                    application.archived ===
                    true;


                let statusMatches =
                    false;


                if (
                    filterValue ===
                    "archived"
                ) {


                    statusMatches =
                        archived;

                }


                else if (
                    filterValue ===
                    "all"
                ) {


                    statusMatches =
                        !archived;

                }


                else {


                    statusMatches =

                        !archived

                        &&

                        status ===
                        filterValue;

                }


                const searchable =
                    [

                        application.full_name,

                        application.phone,

                        application.email,

                        application.state,

                        application.city

                    ]

                        .filter(Boolean)

                        .join(" ")

                        .toLowerCase();


                const searchMatches =

                    !searchValue

                    ||

                    searchable.includes(
                        searchValue
                    );


                return (

                    statusMatches

                    &&

                    searchMatches

                );

            }

        );


    renderApplications(
        filtered
    );

}


// =========================================================
// RENDER APPLICATIONS
// =========================================================

function renderApplications(
    applications
) {


    if (!applicationsContainer) {

        return;
    }


    if (!applications.length) {


        applicationsContainer.innerHTML = `

            <div class="admin-empty">

                No applications found.

            </div>

        `;


        return;
    }


    applicationsContainer.innerHTML =
        "";


    applications.forEach(

        application => {


            const status =
                String(
                    application.status
                    ||
                    "pending"
                )

                    .toLowerCase();


            const archived =
                application.archived ===
                true;


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "admin-card";


            card.innerHTML = `


                <h3>

                    ${escapeHTML(
                        application.full_name
                    )}

                </h3>


                <p>

                    <strong>
                        Phone:
                    </strong>

                    ${escapeHTML(
                        application.phone
                    )}

                </p>


                <p>

                    <strong>
                        Email:
                    </strong>

                    ${escapeHTML(
                        application.email
                        ||
                        "Not provided"
                    )}

                </p>


                <p>

                    <strong>
                        Location:
                    </strong>

                    ${escapeHTML(
                        application.city
                    )},

                    ${escapeHTML(
                        application.state
                    )}

                </p>


                <span
                    class="
                        application-status

                        ${
                            archived

                                ? "status-archived"

                                : `status-${escapeHTML(status)}`
                        }
                    "
                >

                    ${
                        archived

                            ? "ARCHIVED"

                            : escapeHTML(
                                status.toUpperCase()
                            )
                    }

                </span>


                <p class="admin-muted">

                    Submitted:

                    ${escapeHTML(
                        formatDateTime(
                            application.created_at
                        )
                    )}

                </p>


                <div class="admin-actions">


                    <button
                        type="button"
                        class="
                            admin-dark-btn
                            view-agent
                        "
                        data-id="${application.id}"
                    >

                        View Details

                    </button>


                    ${
                        archived

                            ? `

                                <button
                                    type="button"
                                    class="
                                        admin-restore-btn
                                        restore-agent
                                    "
                                    data-id="${application.id}"
                                >

                                    Restore

                                </button>

                            `

                            : `

                                <button
                                    type="button"
                                    class="
                                        admin-archive-btn
                                        archive-agent
                                    "
                                    data-id="${application.id}"
                                >

                                    Archive

                                </button>

                            `
                    }


                </div>

            `;


            applicationsContainer
                .appendChild(
                    card
                );

        }

    );


    applicationsContainer
        .querySelectorAll(
            ".view-agent"
        )

        .forEach(
            button => {


                button.addEventListener(
                    "click",
                    () => {

                        openAgentModal(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    applicationsContainer
        .querySelectorAll(
            ".archive-agent"
        )

        .forEach(
            button => {


                button.addEventListener(
                    "click",
                    () => {

                        archiveAgentApplication(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    applicationsContainer
        .querySelectorAll(
            ".restore-agent"
        )

        .forEach(
            button => {


                button.addEventListener(
                    "click",
                    () => {

                        restoreAgentApplication(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


// =========================================================
// OPEN AGENT MODAL
// =========================================================

function openAgentModal(id) {


    const application =
        allApplications.find(

            item =>
                String(
                    item.id
                )
                ===
                String(id)

        );


    if (
        !application
        ||
        !agentModal
        ||
        !agentModalContent
    ) {

        return;
    }


    selectedApplication =
        application;


    const archived =
        application.archived ===
        true;


    const status =
        String(
            application.status
            ||
            "pending"
        )

            .toLowerCase();


    agentModalContent.innerHTML = `


        <div class="agent-detail-grid">


            <div class="agent-detail">

                <span>
                    Full Name
                </span>

                <strong>
                    ${escapeHTML(
                        application.full_name
                    )}
                </strong>

            </div>


            <div class="agent-detail">

                <span>
                    Phone
                </span>

                <strong>
                    ${escapeHTML(
                        application.phone
                    )}
                </strong>

            </div>


            <div class="agent-detail">

                <span>
                    Email
                </span>

                <strong>

                    ${escapeHTML(
                        application.email
                        ||
                        "Not provided"
                    )}

                </strong>

            </div>


            <div class="agent-detail">

                <span>
                    Status
                </span>

                <strong>

                    ${
                        archived

                            ? "ARCHIVED"

                            : escapeHTML(
                                status.toUpperCase()
                            )
                    }

                </strong>

            </div>


            <div class="agent-detail">

                <span>
                    State
                </span>

                <strong>
                    ${escapeHTML(
                        application.state
                    )}
                </strong>

            </div>


            <div class="agent-detail">

                <span>
                    City
                </span>

                <strong>
                    ${escapeHTML(
                        application.city
                    )}
                </strong>

            </div>


            <div class="agent-detail full">

                <span>
                    Business Address
                </span>

                <strong>

                    ${escapeHTML(
                        application.business_address
                        ||
                        "Not provided"
                    )}

                </strong>

            </div>


            <div class="agent-detail full">

                <span>
                    Lottery Experience
                </span>

                <strong>

                    ${escapeHTML(
                        application.lottery_experience
                        ||
                        "Not provided"
                    )}

                </strong>

            </div>


            <div class="agent-detail full">

                <span>
                    Additional Information
                </span>

                <strong>

                    ${escapeHTML(
                        application.additional_information
                        ||
                        "None"
                    )}

                </strong>

            </div>


        </div>



        <div class="agent-sensitive">


            <h3>
                Private Applicant Information
            </h3>


            <p>
                Identification and banking
                information should remain private.
            </p>


            <div class="agent-detail-grid">


                <div class="agent-detail">

                    <span>
                        NIN
                    </span>

                    <strong>

                        ${escapeHTML(
                            application.nin
                            ||
                            "Not provided"
                        )}

                    </strong>

                </div>


                <div class="agent-detail">

                    <span>
                        Bank Name
                    </span>

                    <strong>

                        ${escapeHTML(
                            application.bank_name
                            ||
                            "Not provided"
                        )}

                    </strong>

                </div>


                <div class="agent-detail">

                    <span>
                        Account Name
                    </span>

                    <strong>

                        ${escapeHTML(
                            application.account_name
                            ||
                            "Not provided"
                        )}

                    </strong>

                </div>


                <div class="agent-detail">

                    <span>
                        Account Number
                    </span>

                    <strong>

                        ${escapeHTML(
                            application.account_number
                            ||
                            "Not provided"
                        )}

                    </strong>

                </div>


            </div>


        </div>

    `;


    modalApproveButton.disabled =

        archived

        ||

        status ===
        "approved";


    modalRejectButton.disabled =

        archived

        ||

        status ===
        "rejected";


    modalArchiveButton.hidden =
        archived;


    modalRestoreButton.hidden =
        !archived;


    agentModal.classList.add(
        "open"
    );


    agentModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );

}


// =========================================================
// CLOSE MODAL
// =========================================================

function closeAgentModal() {


    selectedApplication =
        null;


    agentModal
        ?.classList
        .remove(
            "open"
        );


    agentModal
        ?.setAttribute(
            "aria-hidden",
            "true"
        );


    document.body.classList.remove(
        "modal-open"
    );

}


// =========================================================
// UPDATE AGENT STATUS
// =========================================================

async function updateAgentStatus(
    id,
    status
) {


    const confirmed =
        window.confirm(

            `Are you sure you want to ${status} this application?`

        );


    if (!confirmed) {

        return;
    }


    try {


        const {
            error
        } =
            await supabaseClient

                .from(
                    TABLES.agents
                )

                .update(
                    {
                        status
                    }
                )

                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;
        }


        closeAgentModal();


        showSuccess(
            `Application ${status} successfully.`
        );


        await loadAgentApplications();

    }


    catch (error) {


        console.error(
            "Agent update error:",
            error
        );


        showError(

            "Unable to update application: "

            +

            (
                error.message
                ||
                "Unknown error"
            )

        );

    }

}


// =========================================================
// ARCHIVE APPLICATION
// =========================================================

async function archiveAgentApplication(
    id
) {


    const confirmed =
        window.confirm(
            "Archive this application?"
        );


    if (!confirmed) {

        return;
    }


    try {


        const {
            error
        } =
            await supabaseClient

                .from(
                    TABLES.agents
                )

                .update(
                    {
                        archived:
                            true
                    }
                )

                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;
        }


        closeAgentModal();


        await loadAgentApplications();

    }


    catch (error) {


        console.error(
            "Archive error:",
            error
        );


        showError(

            "Unable to archive application: "

            +

            (
                error.message
                ||
                "Unknown error"
            )

        );

    }

}


// =========================================================
// RESTORE APPLICATION
// =========================================================

async function restoreAgentApplication(
    id
) {


    const confirmed =
        window.confirm(
            "Restore this application?"
        );


    if (!confirmed) {

        return;
    }


    try {


        const {
            error
        } =
            await supabaseClient

                .from(
                    TABLES.agents
                )

                .update(
                    {
                        archived:
                            false
                    }
                )

                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;
        }


        closeAgentModal();


        await loadAgentApplications();

    }


    catch (error) {


        console.error(
            "Restore error:",
            error
        );


        showError(

            "Unable to restore application: "

            +

            (
                error.message
                ||
                "Unknown error"
            )

        );

    }

}


// =========================================================
// LOAD CUSTOMER MESSAGES
// =========================================================

// =========================================================
// LOAD CUSTOMER MESSAGES
// =========================================================

async function loadContactMessages(options = {}) {
    const silent = options.silent === true;
    if (!messagesContainer || messageLoadInProgress) return;

    messageLoadInProgress = true;
    if (!silent) {
        messagesContainer.innerHTML = `<p class="admin-loading">Loading customer messages...</p>`;
    }

    try {
        const { data, error } = await supabaseClient
            .from(TABLES.messages)
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        allMessages = Array.isArray(data) ? data : [];
        updateMessageStatistics();
        filterMessages();
    } catch (error) {
        console.error("MESSAGE LOAD ERROR:", error);
        if (!silent || !allMessages.length) {
            messagesContainer.innerHTML = `<div class="admin-error-message"><strong>Messages could not be loaded.</strong><br><br>${escapeHTML(error?.message || "Unknown error")}</div>`;
        }
    } finally {
        messageLoadInProgress = false;
    }
}

function updateMessageStatistics() {
    const unread = allMessages.filter(m => m.archived !== true && m.is_read !== true).length;
    const active = allMessages.filter(m => m.archived !== true).length;
    if (messagesCount) messagesCount.textContent = String(active);
    if (unreadMessagesCount) unreadMessagesCount.textContent = String(unread);
    if (unreadTabCount) {
        unreadTabCount.textContent = unread ? String(unread) : "";
        unreadTabCount.dataset.count = String(unread);
    }
}

function filterMessages() {
    let filtered = allMessages;
    if (currentMessageFilter === "inbox") filtered = allMessages.filter(m => m.archived !== true);
    else if (currentMessageFilter === "unread") filtered = allMessages.filter(m => m.archived !== true && m.is_read !== true);
    else if (currentMessageFilter === "archived") filtered = allMessages.filter(m => m.archived === true);
    renderMessages(filtered);
}

function setMessageFilter(filter) {
    currentMessageFilter = filter || "inbox";
    document.querySelectorAll("[data-message-filter]").forEach(button => {
        button.classList.toggle("active", button.dataset.messageFilter === currentMessageFilter);
    });
    filterMessages();
}

function normaliseWhatsAppNumber(value) {
    let number = String(value || "").replace(/\D/g, "");
    if (!number) return "";
    if (number.startsWith("0")) number = "234" + number.slice(1);
    return number;
}

function renderMessages(messages) {
    if (!messagesContainer) return;
    if (!messages.length) {
        const text = currentMessageFilter === "archived" ? "No archived messages." : currentMessageFilter === "unread" ? "No unread messages." : "No customer messages found.";
        messagesContainer.innerHTML = `<div class="admin-empty"><h3>${escapeHTML(text)}</h3><p>Messages submitted through the Contact page will appear here.</p></div>`;
        return;
    }

    messagesContainer.innerHTML = "";
    messages.forEach(message => {
        const id = message?.id ?? null;
        const senderName = message.name || message.full_name || message.fullname || "Website Visitor";
        const senderPhone = message.phone || message.phone_number || "Not provided";
        const senderEmail = message.email || "Not provided";
        const subject = message.subject || "General Inquiry";
        const body = message.message || message.body || message.content || "No message content";
        const isRead = message.is_read === true;
        const archived = message.archived === true;
        const waNumber = normaliseWhatsAppNumber(senderPhone);
        const whatsappUrl = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${senderName}, thank you for contacting Jejoyinye Lottery Services.`)}` : "";
        const emailUrl = senderEmail !== "Not provided" ? `mailto:${encodeURIComponent(senderEmail)}?subject=${encodeURIComponent(`Re: ${subject}`)}` : "";

        const card = document.createElement("article");
        card.className = ["admin-card","message-card",isRead ? "read" : "unread",archived ? "archived" : ""].filter(Boolean).join(" ");
        card.innerHTML = `
            <div class="message-card-top">
                <div><h3>${escapeHTML(senderName)}</h3><p class="admin-muted">Submitted: ${escapeHTML(formatDateTime(message.created_at))}</p></div>
                <div>${archived ? '<span class="message-status-badge archived">ARCHIVED</span>' : isRead ? '<span class="message-status-badge read">READ</span>' : '<span class="message-status-badge unread">NEW</span>'}</div>
            </div>
            <p><strong>Phone:</strong> ${escapeHTML(senderPhone)}</p>
            <p><strong>Email:</strong> ${escapeHTML(senderEmail)}</p>
            <p><strong>Subject:</strong> ${escapeHTML(subject)}</p>
            <div class="customer-message-body">${escapeHTML(body)}</div>
            <div class="message-contact-links">
                ${whatsappUrl ? `<a class="message-contact-link message-whatsapp-link" href="${escapeHTML(whatsappUrl)}" target="_blank" rel="noopener noreferrer">WhatsApp Reply</a>` : ""}
                ${emailUrl ? `<a class="message-contact-link message-email-link" href="${escapeHTML(emailUrl)}">Email Reply</a>` : ""}
            </div>
            <div class="admin-actions">
                ${id !== null ? `
                    <button type="button" class="admin-secondary-btn message-toggle-read" data-message-id="${escapeHTML(id)}" data-message-read="${isRead}">${isRead ? "Mark Unread" : "Mark Read"}</button>
                    <button type="button" class="${archived ? "admin-restore-btn" : "admin-archive-btn"} message-toggle-archive" data-message-id="${escapeHTML(id)}" data-message-archived="${archived}">${archived ? "Restore" : "Archive"}</button>
                    <button type="button" class="admin-danger-btn message-delete" data-message-id="${escapeHTML(id)}">Delete</button>
                ` : '<span class="admin-muted">This message has no database ID, so management actions are unavailable.</span>'}
            </div>`;
        messagesContainer.appendChild(card);
    });
}

async function updateMessage(messageId, patch, successText) {
    if (messageId === null || messageId === undefined || messageId === "") return showError("This message does not have a valid database ID.");
    try {
        const { error } = await supabaseClient.from(TABLES.messages).update(patch).eq("id", messageId);
        if (error) throw error;
        showSuccess(successText);
        await loadContactMessages({ silent: true });
    } catch (error) {
        console.error("Message update error:", error);
        showError("Unable to update message: " + (error?.message || "Unknown error"));
    }
}

async function toggleMessageRead(messageId, currentlyRead) {
    await updateMessage(messageId, { is_read: !currentlyRead }, currentlyRead ? "Message marked as unread." : "Message marked as read.");
}

async function toggleMessageArchive(messageId, currentlyArchived) {
    await updateMessage(messageId, { archived: !currentlyArchived }, currentlyArchived ? "Message restored to inbox." : "Message archived.");
}

async function deleteMessage(messageId) {
    if (!window.confirm("Delete this customer message permanently? This cannot be undone.")) return;
    try {
        const { error } = await supabaseClient.from(TABLES.messages).delete().eq("id", messageId);
        if (error) throw error;
        showSuccess("Customer message deleted permanently.");
        await loadContactMessages({ silent: true });
    } catch (error) {
        console.error("Delete message error:", error);
        showError("Unable to delete message: " + (error?.message || "Unknown error"));
    }
}

function startMessageAutoRefresh() {
    clearInterval(messageRefreshTimer);
    messageRefreshTimer = setInterval(() => {
        const tab = document.getElementById("messages-tab");
        if (document.visibilityState === "visible" && tab?.classList.contains("active")) {
            loadContactMessages({ silent: true });
        }
    }, MESSAGE_REFRESH_INTERVAL);
}


// =========================================================
// LOGOUT
// =========================================================

async function logoutAdmin() {


    try {


        await supabaseClient
            .auth
            .signOut();


    }


    catch (error) {


        console.error(
            "Logout error:",
            error
        );

    }


    window.location.replace(
        "login.html"
    );

}


// =========================================================
// INACTIVITY LOGOUT
// =========================================================

function resetInactivityTimer() {


    clearTimeout(
        inactivityTimer
    );


    inactivityTimer =
        setTimeout(

            logoutAdmin,

            INACTIVITY_LIMIT

        );

}


// =========================================================
// EVENTS
// =========================================================

function attachEvents() {

    document.querySelectorAll("[data-analytics-range]").forEach(button => {
        button.addEventListener("click", () => {
            analyticsRange = button.dataset.analyticsRange || "30";
            document.querySelectorAll("[data-analytics-range]").forEach(item => item.classList.toggle("active", item === button));
            loadAnalytics();
        });
    });

    document.getElementById("analytics-refresh")?.addEventListener("click", loadAnalytics);


    // TAB BUTTONS

    document
        .querySelectorAll(
            ".admin-tab-button"
        )

        .forEach(
            button => {


                button.addEventListener(
                    "click",
                    () => {


                        openAdminTab(
                            button.dataset.tab
                        );

                    }
                );

            }
        );


    // DASHBOARD SHORTCUTS

    document
        .querySelectorAll(
            "[data-open-tab]"
        )

        .forEach(
            button => {


                button.addEventListener(
                    "click",
                    () => {


                        openAdminTab(
                            button.dataset.openTab
                        );

                    }
                );

            }
        );


    lotterySelect
        ?.addEventListener(
            "change",
            () => {


                loadGames(
                    lotterySelect.value
                );

                updateMachineNumberRequirement();

            }
        );

    updateMachineNumberRequirement();


    resultForm
        ?.addEventListener(
            "submit",
            saveResult
        );


    cancelEditButton
        ?.addEventListener(
            "click",
            () => {


                resetResultForm();


                clearMessage();

            }
        );


    logoutButton
        ?.addEventListener(
            "click",
            logoutAdmin
        );


    agentSearch
        ?.addEventListener(
            "input",
            filterApplications
        );


    agentStatusFilter
        ?.addEventListener(
            "change",
            filterApplications
        );


    closeAgentModalButton
        ?.addEventListener(
            "click",
            closeAgentModal
        );


    agentModal
        ?.querySelector(
            ".agent-modal-overlay"
        )

        ?.addEventListener(
            "click",
            closeAgentModal
        );


    modalApproveButton
        ?.addEventListener(
            "click",
            () => {


                if (!selectedApplication) {

                    return;
                }


                updateAgentStatus(

                    selectedApplication.id,

                    "approved"

                );

            }
        );


    modalRejectButton
        ?.addEventListener(
            "click",
            () => {


                if (!selectedApplication) {

                    return;
                }


                updateAgentStatus(

                    selectedApplication.id,

                    "rejected"

                );

            }
        );


    modalArchiveButton
        ?.addEventListener(
            "click",
            () => {


                if (!selectedApplication) {

                    return;
                }


                archiveAgentApplication(
                    selectedApplication.id
                );

            }
        );


    modalRestoreButton
        ?.addEventListener(
            "click",
            () => {


                if (!selectedApplication) {

                    return;
                }


                restoreAgentApplication(
                    selectedApplication.id
                );

            }
        );


    document.querySelectorAll("[data-message-filter]").forEach(button => {
        button.addEventListener("click", () => setMessageFilter(button.dataset.messageFilter));
    });

    messagesContainer?.addEventListener("click", event => {
        const readButton = event.target.closest(".message-toggle-read");
        if (readButton) {
            toggleMessageRead(readButton.dataset.messageId, readButton.dataset.messageRead === "true");
            return;
        }
        const archiveButton = event.target.closest(".message-toggle-archive");
        if (archiveButton) {
            toggleMessageArchive(archiveButton.dataset.messageId, archiveButton.dataset.messageArchived === "true");
            return;
        }
        const deleteButton = event.target.closest(".message-delete");
        if (deleteButton) deleteMessage(deleteButton.dataset.messageId);
    });


    document.addEventListener(
        "keydown",
        event => {


            if (
                event.key ===
                "Escape"
            ) {


                closeAgentModal();

            }

        }
    );


    [
        "mousedown",
        "keydown",
        "touchstart",
        "click"
    ]

        .forEach(
            eventName => {


                window.addEventListener(

                    eventName,

                    resetInactivityTimer,

                    {
                        passive:
                            true
                    }

                );

            }
        );

}


// =========================================================
// INITIALISE ADMIN
// =========================================================

async function initialiseAdmin() {


    if (
        typeof supabaseClient ===
        "undefined"
    ) {


        document.body.innerHTML = `

            <div
                style="
                    max-width:700px;
                    margin:80px auto;
                    padding:30px;
                    background:#fee2e2;
                    color:#991b1b;
                    border-radius:15px;
                    font-family:Arial,sans-serif;
                "
            >

                <h2>
                    Supabase Connection Error
                </h2>

                <p>
                    Check that supabase.js
                    is loading correctly.
                </p>

            </div>

        `;


        return;
    }


    const authenticated =
        await checkAuthentication();


    if (!authenticated) {

        return;
    }


    attachEvents();


    resetInactivityTimer();


    startMessageAutoRefresh();


    await Promise.allSettled(
        [

            loadResults(),

            loadAgentApplications(),

            loadContactMessages()

        ]
    );


    console.log(
        "ADMIN DASHBOARD READY"
    );

}


// =========================================================
// START
// =========================================================

initialiseAdmin();




// =========================================================
// RESULT FILTER EVENTS
// =========================================================
if (resultSearchInput) resultSearchInput.addEventListener("input", applyAdminResultFilters);
if (resultLotteryFilter) resultLotteryFilter.addEventListener("change", applyAdminResultFilters);
if (resultGameFilter) resultGameFilter.addEventListener("change", applyAdminResultFilters);
if (resultDateFilter) resultDateFilter.addEventListener("change", applyAdminResultFilters);
if (clearResultFiltersButton) clearResultFiltersButton.addEventListener("click", clearAdminResultFilters);
