// ==========================================
// SUPABASE CLIENT INITIALIZATION
// ==========================================

const SUPABASE_URL = "https://iedgznzmmfkdhgmkghwt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2ISlJFC6phcU5o60zOs1sg_ADZODm4l";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// ADMIN PRIVACY MASKING
// ==========================================
// On the admin dashboard, sensitive agent identity/banking fields are
// hidden by default and may be revealed only by an intentional click.
(function setupAdminPrivacyMasking() {
    const isAdminPage = Boolean(document.getElementById("agent-details-modal"));
    if (!isAdminPage) return;

    const originalValues = new WeakMap();

    const maskDigits = (value, visible = 4) => {
        const text = String(value || "").trim();
        if (!text || text === "Not provided") return text || "Not provided";
        const tail = text.slice(-visible);
        return `${"•".repeat(Math.max(4, text.length - visible))}${tail}`;
    };

    const maskName = value => {
        const text = String(value || "").trim();
        if (!text || text === "Not provided") return text || "Not provided";
        return text
            .split(/\s+/)
            .map(part => part.length <= 1 ? "•" : `${part[0]}${"•".repeat(Math.max(2, part.length - 1))}`)
            .join(" ");
    };

    const maskedValue = (label, value) => {
        const key = String(label || "").trim().toLowerCase();
        if (key === "nin" || key === "account number") return maskDigits(value, 4);
        if (key === "account name") return maskName(value);
        return value;
    };

    const applyPrivacyMasking = root => {
        const section = root?.querySelector?.(".agent-sensitive");
        if (!section || section.dataset.privacyMaskReady === "true") return;

        const protectedFields = [];
        section.querySelectorAll(".agent-detail").forEach(detail => {
            const label = detail.querySelector("span")?.textContent?.trim() || "";
            const valueElement = detail.querySelector("strong");
            const key = label.toLowerCase();

            if (!valueElement || !["nin", "account name", "account number"].includes(key)) return;

            const original = valueElement.textContent.trim();
            originalValues.set(valueElement, original);
            valueElement.textContent = maskedValue(label, original);
            protectedFields.push({ label, valueElement });
        });

        if (!protectedFields.length) return;

        section.dataset.privacyMaskReady = "true";
        section.dataset.privateDetailsVisible = "false";

        const notice = document.createElement("div");
        notice.style.display = "flex";
        notice.style.flexWrap = "wrap";
        notice.style.alignItems = "center";
        notice.style.gap = "10px";
        notice.style.margin = "14px 0 18px";

        const message = document.createElement("span");
        message.textContent = "Sensitive details are masked by default.";
        message.style.fontSize = "12px";
        message.style.color = "#64748b";

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Reveal private details";
        button.setAttribute("aria-pressed", "false");
        button.style.border = "0";
        button.style.borderRadius = "9px";
        button.style.padding = "9px 13px";
        button.style.cursor = "pointer";
        button.style.fontWeight = "800";
        button.style.background = "#0f172a";
        button.style.color = "#ffffff";

        button.addEventListener("click", () => {
            const revealing = section.dataset.privateDetailsVisible !== "true";

            protectedFields.forEach(({ label, valueElement }) => {
                const original = originalValues.get(valueElement) || "Not provided";
                valueElement.textContent = revealing ? original : maskedValue(label, original);
            });

            section.dataset.privateDetailsVisible = revealing ? "true" : "false";
            button.textContent = revealing ? "Hide private details" : "Reveal private details";
            button.setAttribute("aria-pressed", revealing ? "true" : "false");
            message.textContent = revealing
                ? "Private details are visible. Hide them when finished."
                : "Sensitive details are masked by default.";
        });

        notice.append(message, button);
        section.querySelector("p")?.after(notice);
    };

    const modalContent = document.getElementById("agent-modal-content");
    if (!modalContent) return;

    const observer = new MutationObserver(() => applyPrivacyMasking(modalContent));
    observer.observe(modalContent, { childList: true, subtree: true });
    applyPrivacyMasking(modalContent);
})();
