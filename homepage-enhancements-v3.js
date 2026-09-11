"use strict";

(function () {
    const modernSchedule = [
        ["Powerball", 9, 0],
        ["Awoof", 11, 0],
        ["Biggest Bet", 13, 0],
        ["Gold Rush", 15, 0],
        ["Lucky Dollar", 17, 0],
        ["Blessing", 18, 0],
        ["Owo Time", 19, 0],
        ["Modern Bingo", 20, 0],
        ["Bonus Cash", 21, 0],
        ["Hero", 22, 0],
        ["Golden", 23, 0],
        ["Queen", 24, 0]
    ];

    const ghanaSchedule = {
        0: ["ASEDA", 19, 10],
        1: ["Monday Special", 21, 10],
        2: ["Lucky Tuesday", 21, 10],
        3: ["Mid Week", 21, 10],
        4: ["Thursday Fortune", 21, 10],
        5: ["Friday Bonanza", 21, 10],
        6: ["National", 21, 10]
    };

    function lagosParts() {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Africa/Lagos",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        });
        const values = {};
        formatter.formatToParts(new Date()).forEach(part => {
            if (part.type !== "literal") values[part.type] = part.value;
        });
        const weekday = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        return {
            weekday: weekday[values.weekday],
            hour: Number(values.hour),
            minute: Number(values.minute)
        };
    }

    function formatTime(hour, minute) {
        const normalized = hour % 24;
        const suffix = normalized >= 12 ? "PM" : "AM";
        const displayHour = normalized % 12 || 12;
        return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
    }

    function nextModernDraw(parts) {
        const now = (parts.hour * 60) + parts.minute;
        for (const [game, hour, minute] of modernSchedule) {
            const drawMinutes = hour === 24 ? 24 * 60 : (hour * 60) + minute;
            if (now < drawMinutes) {
                return { game, hour, minute, status: "Upcoming" };
            }
        }
        return { game: "Powerball", hour: 9, minute: 0, status: "Tomorrow" };
    }

    function todayGhanaDraw(parts) {
        const draw = ghanaSchedule[parts.weekday];
        if (!draw) return null;
        const [game, hour, minute] = draw;
        const now = (parts.hour * 60) + parts.minute;
        const drawMinutes = (hour * 60) + minute;
        return {
            game,
            hour,
            minute,
            status: now >= drawMinutes ? "Draw time passed" : "Upcoming"
        };
    }

    function cardLooksPublished(lotteryText, game) {
        const cards = Array.from(document.querySelectorAll("#home-results-container .home-result-card"));
        const wantedLottery = lotteryText.toLowerCase();
        const wantedGame = game.toLowerCase();
        return cards.some(card => {
            const text = card.textContent.toLowerCase();
            return text.includes(wantedLottery) && text.includes(wantedGame);
        });
    }

    function renderSchedule() {
        const modernGame = document.getElementById("home-next-modern-game");
        const modernTime = document.getElementById("home-next-modern-time");
        const modernStatus = document.getElementById("home-next-modern-status");
        const ghanaGame = document.getElementById("home-today-ghana-game");
        const ghanaTime = document.getElementById("home-today-ghana-time");
        const ghanaStatus = document.getElementById("home-today-ghana-status");
        if (!modernGame || !modernTime || !modernStatus || !ghanaGame || !ghanaTime || !ghanaStatus) return;

        const parts = lagosParts();
        const modern = nextModernDraw(parts);
        const ghana = todayGhanaDraw(parts);

        modernGame.textContent = modern.game;
        modernTime.textContent = formatTime(modern.hour, modern.minute);
        modernStatus.textContent = modern.status;
        modernStatus.className = "home-draw-status is-awaiting";

        if (ghana) {
            ghanaGame.textContent = ghana.game;
            ghanaTime.textContent = formatTime(ghana.hour, ghana.minute);
            const published = cardLooksPublished("Ghana Games", ghana.game);
            ghanaStatus.textContent = published ? "Published" : ghana.status;
            ghanaStatus.className = `home-draw-status ${published ? "is-published" : "is-awaiting"}`;
        }
    }

    function updateFreshness() {
        const target = document.getElementById("home-results-updated");
        if (!target) return;
        const text = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Africa/Lagos",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(new Date());
        target.textContent = `Last updated: ${text}`;
    }

    function observeResults() {
        const results = document.getElementById("home-results-container");
        if (!results) return;
        const observer = new MutationObserver(() => {
            updateFreshness();
            renderSchedule();
        });
        observer.observe(results, { childList: true, subtree: true });
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderSchedule();
        updateFreshness();
        observeResults();
        setInterval(renderSchedule, 60000);
        setInterval(updateFreshness, 60000);
    });
})();
