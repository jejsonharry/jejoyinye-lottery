"use strict";

(function () {
    const GAMES = [
        { game: "Powerball", time: "9:00 AM" },
        { game: "Awoof", time: "11:00 AM" },
        { game: "Biggest Bet", time: "1:00 PM" },
        { game: "Gold Rush", time: "3:00 PM" },
        { game: "Lucky Dollar", time: "5:00 PM" },
        { game: "Blessing", time: "6:00 PM" },
        { game: "Owo Time", time: "7:00 PM" },
        { game: "Modern Bingo", time: "8:00 PM" },
        { game: "Bonus Cash", time: "9:00 PM" },
        { game: "Hero", time: "10:00 PM" },
        { game: "Golden Night", time: "11:00 PM", aliases: ["Golden"] },
        { game: "Queen", time: "12:00 AM" }
    ];

    const COLORS = {
        forest: "#063d2d",
        green: "#07944c",
        greenDark: "#05723c",
        greenSoft: "#e8f7ef",
        amber: "#e78b17",
        amberDark: "#b96308",
        amberSoft: "#fff3df",
        ink: "#11251d",
        muted: "#61736b",
        line: "#d7e7df",
        surface: "#ffffff",
        background: "#f2f8f5"
    };

    let lastPosterBlob = null;
    let refreshTimer = null;
    let logoPromise = null;

    function getLagosToday() {
        const parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Africa/Lagos",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).formatToParts(new Date());
        const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
        return `${values.year}-${values.month}-${values.day}`;
    }

    function formatPosterDate(value) {
        if (!value) return "Date unavailable";
        const [year, month, day] = value.split("-").map(Number);
        const parsed = new Date(Date.UTC(year, month - 1, day));
        return new Intl.DateTimeFormat("en-GB", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "UTC"
        }).format(parsed);
    }

    function normalizeGame(value) {
        const normalized = String(value || "").trim().toLowerCase();
        if (normalized === "golden") return "golden night";
        return normalized;
    }

    function parseNumbers(value) {
        const numbers = Array.isArray(value)
            ? value
            : typeof value === "string"
                ? (value.match(/\d{1,2}/g) || [])
                : [];
        return numbers
            .map(Number)
            .filter(number => Number.isInteger(number) && number >= 1 && number <= 90)
            .slice(0, 5);
    }

    function roundedPath(ctx, x, y, width, height, radius) {
        const safeRadius = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + safeRadius, y);
        ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
        ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
        ctx.arcTo(x, y + height, x, y, safeRadius);
        ctx.arcTo(x, y, x + width, y, safeRadius);
        ctx.closePath();
    }

    function fillRoundedRect(ctx, x, y, width, height, radius, color) {
        roundedPath(ctx, x, y, width, height, radius);
        ctx.fillStyle = color;
        ctx.fill();
    }

    function strokeRoundedRect(ctx, x, y, width, height, radius, color, lineWidth = 1) {
        roundedPath(ctx, x, y, width, height, radius);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }

    function fitText(ctx, text, maxWidth, startSize, minimumSize = 18) {
        let size = startSize;
        while (size > minimumSize) {
            ctx.font = `800 ${size}px Arial, sans-serif`;
            if (ctx.measureText(text).width <= maxWidth) return size;
            size -= 1;
        }
        return minimumSize;
    }

    function drawNumberSet(ctx, numbers, x, y, color, softColor) {
        if (numbers.length < 5) {
            fillRoundedRect(ctx, x, y - 19, 145, 38, 19, softColor);
            ctx.fillStyle = color;
            ctx.font = "800 17px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("PENDING", x + 72.5, y + 1);
            return;
        }

        numbers.forEach((number, index) => {
            const centerX = x + 26 + (index * 58);
            ctx.beginPath();
            ctx.arc(centerX, y, 22, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.font = "800 18px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(number).padStart(2, "0"), centerX, y + 1);
        });
    }

    function loadLogo() {
        if (logoPromise) return logoPromise;
        logoPromise = new Promise(resolve => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => resolve(null);
            image.src = "Images/jols-logo.png";
        });
        return logoPromise;
    }

    async function fetchDailyResults(date) {
        const client = typeof supabaseClient !== "undefined" ? supabaseClient : null;
        if (!client) throw new Error("Results connection is not ready.");

        const { data, error } = await client
            .from("results")
            .select("game,draw_date,winning,machine,created_at")
            .eq("lottery", "modern-billionaire")
            .eq("draw_date", date)
            .order("created_at", { ascending: true });

        if (error) throw error;

        const byGame = new Map();
        (data || []).forEach(result => {
            byGame.set(normalizeGame(result.game), result);
        });

        return GAMES.map(schedule => {
            const result = byGame.get(normalizeGame(schedule.game));
            return {
                ...schedule,
                winning: parseNumbers(result?.winning),
                machine: parseNumbers(result?.machine)
            };
        });
    }

    async function drawPoster(canvas, date, rows) {
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        const completed = rows.filter(row => row.winning.length === 5 && row.machine.length === 5).length;
        const logo = await loadLogo();

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, width, height);

        const headerGradient = ctx.createLinearGradient(0, 0, width, 0);
        headerGradient.addColorStop(0, COLORS.forest);
        headerGradient.addColorStop(0.62, COLORS.greenDark);
        headerGradient.addColorStop(1, COLORS.green);
        ctx.fillStyle = headerGradient;
        ctx.fillRect(0, 0, width, 225);

        ctx.globalAlpha = 0.09;
        for (let index = 0; index < 8; index += 1) {
            ctx.beginPath();
            ctx.arc(790 + (index * 47), 32 + ((index % 3) * 74), 48, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        fillRoundedRect(ctx, 42, 42, 126, 126, 28, "#ffffff");
        if (logo) {
            const padding = 13;
            const ratio = Math.min((126 - padding * 2) / logo.width, (126 - padding * 2) / logo.height);
            const logoWidth = logo.width * ratio;
            const logoHeight = logo.height * ratio;
            ctx.drawImage(logo, 42 + ((126 - logoWidth) / 2), 42 + ((126 - logoHeight) / 2), logoWidth, logoHeight);
        }
        else {
            ctx.fillStyle = COLORS.greenDark;
            ctx.font = "900 34px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("JOLS", 105, 107);
        }

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 44px Arial, sans-serif";
        ctx.fillText("JOLS DAILY RESULTS", 198, 83);
        ctx.font = "800 27px Arial, sans-serif";
        ctx.fillStyle = "#d8ffea";
        ctx.fillText("MODERN BILLIONAIRE", 198, 122);
        ctx.font = "600 22px Arial, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(formatPosterDate(date), 198, 159);

        const statusText = completed === 12 ? "COMPLETE • 12/12" : `LIVE UPDATE • ${completed}/12`;
        fillRoundedRect(ctx, 788, 160, 244, 42, 21, completed === 12 ? "#ffffff" : "#fff2d8");
        ctx.fillStyle = completed === 12 ? COLORS.greenDark : COLORS.amberDark;
        ctx.font = "900 16px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(statusText, 910, 182);

        const tableX = 38;
        const tableY = 254;
        const tableWidth = 1004;
        const headerHeight = 62;
        const rowHeight = 70;
        const gameWidth = 260;
        const numberWidth = 372;
        const tableHeight = headerHeight + (rowHeight * GAMES.length);

        ctx.shadowColor = "rgba(6, 61, 45, 0.10)";
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 8;
        fillRoundedRect(ctx, tableX, tableY, tableWidth, tableHeight, 26, COLORS.surface);
        ctx.shadowColor = "transparent";
        strokeRoundedRect(ctx, tableX, tableY, tableWidth, tableHeight, 26, COLORS.line, 2);

        fillRoundedRect(ctx, tableX + 2, tableY + 2, tableWidth - 4, headerHeight - 2, 24, COLORS.forest);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 17px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("GAME / DRAW TIME", tableX + 28, tableY + 32);
        ctx.fillStyle = "#aef0ca";
        ctx.fillText("WINNING NUMBERS", tableX + gameWidth + 34, tableY + 32);
        ctx.fillStyle = "#ffd79f";
        ctx.fillText("MACHINE NUMBERS", tableX + gameWidth + numberWidth + 34, tableY + 32);

        rows.forEach((row, index) => {
            const rowTop = tableY + headerHeight + (index * rowHeight);
            const centerY = rowTop + (rowHeight / 2);

            if (index % 2 === 1) {
                ctx.fillStyle = "#f8fbf9";
                ctx.fillRect(tableX + 2, rowTop, tableWidth - 4, rowHeight);
            }

            if (index > 0) {
                ctx.strokeStyle = COLORS.line;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(tableX + 18, rowTop);
                ctx.lineTo(tableX + tableWidth - 18, rowTop);
                ctx.stroke();
            }

            ctx.fillStyle = COLORS.ink;
            const gameSize = fitText(ctx, row.game, gameWidth - 48, 21, 16);
            ctx.font = `800 ${gameSize}px Arial, sans-serif`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(row.game, tableX + 28, centerY - 9);
            ctx.fillStyle = COLORS.muted;
            ctx.font = "700 14px Arial, sans-serif";
            ctx.fillText(row.time, tableX + 28, centerY + 15);

            drawNumberSet(ctx, row.winning, tableX + gameWidth + 26, centerY, COLORS.green, COLORS.greenSoft);
            drawNumberSet(ctx, row.machine, tableX + gameWidth + numberWidth + 26, centerY, COLORS.amber, COLORS.amberSoft);
        });

        const footerY = 1192;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = COLORS.forest;
        ctx.font = "900 25px Arial, sans-serif";
        ctx.fillText("jolslottery.com", width / 2, footerY + 23);
        ctx.fillStyle = COLORS.muted;
        ctx.font = "600 16px Arial, sans-serif";
        ctx.fillText("Official results update • Play responsibly • 18+", width / 2, footerY + 57);
        ctx.font = "600 14px Arial, sans-serif";
        ctx.fillText("Results are provided for information and sharing purposes.", width / 2, footerY + 85);

        return completed;
    }

    function canvasToBlob(canvas) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (blob) resolve(blob);
                else reject(new Error("The poster image could not be created."));
            }, "image/png", 1);
        });
    }

    function setStatus(message, tone = "neutral") {
        const status = document.getElementById("daily-results-poster-status");
        if (!status) return;
        status.textContent = message;
        status.dataset.tone = tone;
    }

    async function buildPoster() {
        const dateInput = document.getElementById("daily-results-poster-date");
        const canvas = document.getElementById("daily-results-poster-canvas");
        const downloadButton = document.getElementById("download-daily-results-poster");
        const shareButton = document.getElementById("share-daily-results-poster");
        if (!dateInput || !canvas || !dateInput.value) return;

        lastPosterBlob = null;
        if (downloadButton) downloadButton.disabled = true;
        if (shareButton) shareButton.disabled = true;
        setStatus("Preparing the daily results poster…");

        try {
            const rows = await fetchDailyResults(dateInput.value);
            const completed = await drawPoster(canvas, dateInput.value, rows);
            lastPosterBlob = await canvasToBlob(canvas);

            if (downloadButton) downloadButton.disabled = false;
            if (shareButton) shareButton.disabled = false;
            setStatus(
                completed === 12
                    ? "Complete poster ready — all 12 Modern results are included."
                    : `${completed} of 12 results included. Missing draws are marked Pending.`,
                completed === 12 ? "success" : "neutral"
            );
        }
        catch (error) {
            console.error("Daily results poster error:", error);
            setStatus(error.message || "Unable to prepare the poster.", "error");
        }
    }

    function filenameForDate(date) {
        return `jols-modern-results-${date}.png`;
    }

    function downloadPoster() {
        const date = document.getElementById("daily-results-poster-date")?.value || getLagosToday();
        if (!lastPosterBlob) return;
        const url = URL.createObjectURL(lastPosterBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filenameForDate(date);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus("Poster downloaded successfully.", "success");
    }

    async function sharePoster() {
        const date = document.getElementById("daily-results-poster-date")?.value || getLagosToday();
        if (!lastPosterBlob) return;
        const file = new File([lastPosterBlob], filenameForDate(date), { type: "image/png" });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({
                    title: `JOLS Modern Results — ${formatPosterDate(date)}`,
                    text: "Modern Billionaire daily results from JOLS Lottery.",
                    files: [file]
                });
                setStatus("Share window opened successfully.", "success");
                return;
            }
            catch (error) {
                if (error?.name === "AbortError") return;
                console.error("Poster share error:", error);
            }
        }

        downloadPoster();
        setStatus("Direct sharing is unavailable here, so the poster was downloaded for you.", "neutral");
    }

    function scheduleRefresh() {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(buildPoster, 500);
    }

    function activate() {
        const card = document.getElementById("daily-results-poster-card");
        if (!card) return;

        const dateInput = document.getElementById("daily-results-poster-date");
        const generateButton = document.getElementById("generate-daily-results-poster");
        const downloadButton = document.getElementById("download-daily-results-poster");
        const shareButton = document.getElementById("share-daily-results-poster");
        const resultDateFilter = document.getElementById("admin-result-date-filter");
        const resultsContainer = document.getElementById("published-results-container");

        dateInput.value = getLagosToday();
        generateButton?.addEventListener("click", buildPoster);
        downloadButton?.addEventListener("click", downloadPoster);
        shareButton?.addEventListener("click", sharePoster);
        dateInput.addEventListener("change", buildPoster);

        resultDateFilter?.addEventListener("change", () => {
            if (!resultDateFilter.value) return;
            dateInput.value = resultDateFilter.value;
            buildPoster();
        });

        if (resultsContainer) {
            const observer = new MutationObserver(() => {
                if (document.getElementById("results-tab")?.classList.contains("active")) {
                    scheduleRefresh();
                }
            });
            observer.observe(resultsContainer, { childList: true, subtree: true });
        }

        document.addEventListener("click", event => {
            if (event.target.closest('[data-tab="results-tab"], [data-open-tab="results-tab"]')) {
                scheduleRefresh();
            }
        });

        buildPoster();
    }

    document.addEventListener("DOMContentLoaded", activate);
})();
