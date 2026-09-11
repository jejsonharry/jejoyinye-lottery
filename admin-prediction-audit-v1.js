"use strict";

(function () {
    const TABLE = "prediction_snapshots";

    function esc(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function nums(value) {
        const values = Array.isArray(value)
            ? value
            : typeof value === "string"
                ? (value.match(/\d{1,2}/g) || [])
                : [];
        return values
            .map(Number)
            .filter(number => Number.isInteger(number) && number >= 1 && number <= 90);
    }

    function ballText(value) {
        const list = nums(value);
        return list.length
            ? list.map(number => String(number).padStart(2, "0")).join("-")
            : "—";
    }

    function formatDate(value) {
        if (!value) return "—";
        const parsed = new Date(`${String(value).slice(0, 10)}T00:00:00`);
        if (Number.isNaN(parsed.getTime())) return String(value);
        return parsed.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function currentRange() {
        const active = document.querySelector("[data-analytics-range].active");
        return active?.dataset.analyticsRange || "30";
    }

    function rangeStart(days) {
        const date = new Date();
        date.setDate(date.getDate() - (Number(days) - 1));
        return date.toISOString().slice(0, 10);
    }

    function getClient() {
        return typeof supabaseClient !== "undefined" ? supabaseClient : null;
    }

    function ensureCard() {
        const oldCard = document.querySelector(".prediction-accuracy-card");
        if (!oldCard) return null;

        oldCard.classList.add("prediction-audit-card");
        oldCard.innerHTML = `
            <div class="analytics-card-heading">
                <div>
                    <span>STRICT 60 / 30 / 10 ENGINE</span>
                    <h3>Prediction Performance Audit</h3>
                    <p class="audit-subtitle">Pre-draw forecasts are frozen before results and scored automatically after publication.</p>
                </div>
                <button type="button" id="prediction-audit-refresh" class="admin-secondary-btn">Refresh Audit</button>
            </div>

            <div class="prediction-audit-kpis">
                <article class="prediction-audit-kpi"><span>Saved Forecasts</span><strong id="audit-total">0</strong></article>
                <article class="prediction-audit-kpi"><span>Pending</span><strong id="audit-pending">0</strong></article>
                <article class="prediction-audit-kpi"><span>Evaluated</span><strong id="audit-evaluated">0</strong></article>
                <article class="prediction-audit-kpi"><span>Any Winning Hit</span><strong id="audit-any-hit">0%</strong></article>
                <article class="prediction-audit-kpi"><span>Average Hits</span><strong id="audit-average">0.00</strong></article>
            </div>

            <div class="prediction-audit-table-wrap">
                <table class="prediction-audit-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Game</th>
                            <th>2 Sure</th>
                            <th>3 Direct</th>
                            <th>Actual Winning</th>
                            <th>Sure Hits</th>
                            <th>Direct Hits</th>
                            <th>Total</th>
                            <th>Machine Support</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="prediction-audit-rows">
                        <tr><td colspan="10">Loading prediction audit...</td></tr>
                    </tbody>
                </table>
            </div>
        `;
        return oldCard;
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = String(value);
    }

    function showLoadError(message) {
        const tbody = document.getElementById("prediction-audit-rows");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="10">${esc(message)}</td></tr>`;
        }
    }

    async function loadAudit() {
        const card = document.querySelector(".prediction-audit-card");
        if (!card) return;

        const client = getClient();
        if (!client) {
            showLoadError("Prediction audit connection is not ready. Refresh this page and try again.");
            return;
        }

        const refresh = document.getElementById("prediction-audit-refresh");
        if (refresh) {
            refresh.disabled = true;
            refresh.textContent = "Refreshing...";
        }

        try {
            let query = client
                .from(TABLE)
                .select("draw_date,draw_time,game,engine_version,engine_profile,sure_numbers,direct_numbers,all_numbers,actual_winning,actual_machine,sure_winning_hits,direct_winning_hits,machine_support_hits,total_winning_hits,sure_hit_count,direct_hit_count,machine_support_count,status,generated_at,evaluated_at")
                .eq("lottery", "modern-billionaire")
                .order("draw_date", { ascending: false })
                .order("generated_at", { ascending: false })
                .limit(250);

            const range = currentRange();
            if (range !== "all") {
                query = query.gte("draw_date", rangeStart(range));
            }

            const { data, error } = await query;
            if (error) throw error;

            const rows = Array.isArray(data) ? data : [];
            const evaluated = rows.filter(item => item.status === "evaluated");
            const pending = rows.filter(item => item.status !== "evaluated");
            const anyHit = evaluated.filter(item => Number(item.total_winning_hits || 0) > 0).length;
            const average = evaluated.length
                ? evaluated.reduce((sum, item) => sum + Number(item.total_winning_hits || 0), 0) / evaluated.length
                : 0;

            setText("audit-total", rows.length);
            setText("audit-pending", pending.length);
            setText("audit-evaluated", evaluated.length);
            setText("audit-any-hit", evaluated.length ? `${Math.round((anyHit / evaluated.length) * 100)}%` : "0%");
            setText("audit-average", average.toFixed(2));

            const tbody = document.getElementById("prediction-audit-rows");
            if (!tbody) return;

            if (!rows.length) {
                tbody.innerHTML = '<tr><td colspan="10">No prediction snapshots found for this period.</td></tr>';
                return;
            }

            tbody.innerHTML = rows.map(item => {
                const isEvaluated = item.status === "evaluated";
                const totalHits = Number(item.total_winning_hits || 0);
                const sureHits = Number(item.sure_hit_count || 0);
                const directHits = Number(item.direct_hit_count || 0);
                const machineHits = Number(item.machine_support_count || 0);
                const resultClass = !isEvaluated
                    ? "audit-pending"
                    : totalHits > 0
                        ? "audit-hit"
                        : "audit-miss";

                return `
                    <tr>
                        <td>${esc(formatDate(item.draw_date))}<div class="audit-engine">${esc(item.draw_time || "")}</div></td>
                        <td><strong>${esc(item.game || "—")}</strong><div class="audit-engine">${esc(item.engine_version || item.engine_profile || "60/30/10")}</div></td>
                        <td class="audit-balls">${esc(ballText(item.sure_numbers))}</td>
                        <td class="audit-balls">${esc(ballText(item.direct_numbers))}</td>
                        <td class="audit-balls">${esc(ballText(item.actual_winning))}</td>
                        <td class="${resultClass}">${isEvaluated ? `${sureHits}/2` : "—"}</td>
                        <td class="${resultClass}">${isEvaluated ? `${directHits}/3` : "—"}</td>
                        <td class="${resultClass}">${isEvaluated ? `${totalHits}/5` : "—"}</td>
                        <td class="${resultClass}">${isEvaluated ? `${machineHits}/5` : "—"}</td>
                        <td><span class="audit-status ${isEvaluated ? "evaluated" : "pending"}">${isEvaluated ? "Evaluated" : "Pending"}</span></td>
                    </tr>
                `;
            }).join("");
        }
        catch (error) {
            console.error("Prediction audit load failed:", error);
            showLoadError(error.message || "Unable to load prediction audit.");
        }
        finally {
            if (refresh) {
                refresh.disabled = false;
                refresh.textContent = "Refresh Audit";
            }
        }
    }

    function activate() {
        ensureCard();

        document.addEventListener("click", event => {
            if (event.target.closest("#prediction-audit-refresh")) {
                loadAudit();
            }

            if (event.target.closest('[data-tab="analytics-tab"], [data-open-tab="analytics-tab"], [data-analytics-range]')) {
                setTimeout(loadAudit, 250);
            }
        });

        const analytics = document.getElementById("analytics-tab");
        if (analytics?.classList.contains("active")) {
            setTimeout(loadAudit, 350);
        }
    }

    document.addEventListener("DOMContentLoaded", activate);
})();