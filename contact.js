// ==========================================
// CONTACT FORM SUBMISSION SYSTEM
// SECURITY-HARDENED + RATE LIMITED + TURNSTILE
// ==========================================

const TURNSTILE_SITE_KEY = "0x4AAAAAAEwASh_aa_NyiR-D";
const contactForm = document.querySelector(".contact-form");

let contactTurnstileToken = "";
let contactTurnstileWidgetId = null;

function installContactHoneypot(form) {
    if (!form || form.querySelector('[name="website"]')) return;
    const wrap = document.createElement("div");
    wrap.setAttribute("aria-hidden", "true");
    wrap.style.position = "absolute";
    wrap.style.left = "-10000px";
    wrap.style.width = "1px";
    wrap.style.height = "1px";
    wrap.style.overflow = "hidden";
    const input = document.createElement("input");
    input.type = "text";
    input.name = "website";
    input.tabIndex = -1;
    input.autocomplete = "off";
    wrap.appendChild(input);
    form.appendChild(wrap);
}

function loadTurnstileScript() {
    if (window.turnstile) return Promise.resolve(window.turnstile);

    return new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-jols-turnstile="true"]');
        if (existing) {
            existing.addEventListener("load", () => resolve(window.turnstile), { once: true });
            existing.addEventListener("error", () => reject(new Error("Turnstile failed to load")), { once: true });
            return;
        }

        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.jolsTurnstile = "true";
        script.onload = () => resolve(window.turnstile);
        script.onerror = () => reject(new Error("Turnstile failed to load"));
        document.head.appendChild(script);
    });
}

async function installContactTurnstile() {
    if (!contactForm || document.getElementById("contact-turnstile")) return;

    const submitBtn = contactForm.querySelector(".submit-btn");
    if (!submitBtn) return;

    const container = document.createElement("div");
    container.id = "contact-turnstile";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.margin = "18px 0";
    submitBtn.parentNode.insertBefore(container, submitBtn);

    try {
        const turnstile = await loadTurnstileScript();
        contactTurnstileWidgetId = turnstile.render(container, {
            sitekey: TURNSTILE_SITE_KEY,
            action: "contact",
            theme: "auto",
            callback(token) {
                contactTurnstileToken = token;
            },
            "expired-callback"() {
                contactTurnstileToken = "";
            },
            "error-callback"() {
                contactTurnstileToken = "";
                alert("Security verification could not load. Please refresh the page and try again.");
            }
        });
    } catch (_) {
        alert("Security verification could not load. Please refresh the page and try again.");
    }
}

function resetContactTurnstile() {
    contactTurnstileToken = "";
    if (window.turnstile && contactTurnstileWidgetId !== null) {
        try { window.turnstile.reset(contactTurnstileWidgetId); } catch (_) {}
    }
}

if (contactForm) {
    installContactHoneypot(contactForm);
    installContactTurnstile();

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!contactTurnstileToken) {
            alert("Please complete the security verification before sending your message.");
            return;
        }

        const submitBtn = contactForm.querySelector(".submit-btn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending Message...";

        const payload = {
            name: document.getElementById("contact-name").value.trim(),
            phone: document.getElementById("contact-phone").value.trim(),
            email: document.getElementById("contact-email").value.trim(),
            subject: document.getElementById("subject").value,
            message: document.getElementById("contact-message").value.trim()
        };

        try {
            const website = contactForm.querySelector('[name="website"]')?.value || "";
            const { data, error } = await supabaseClient.functions.invoke("public-form-submit", {
                body: {
                    action: "contact",
                    payload,
                    website,
                    turnstile_token: contactTurnstileToken
                }
            });

            if (error) throw error;
            if (data?.ok !== true) throw new Error(data?.error || "Message rejected");

            alert("Thank you! Your message has been sent successfully. We will get back to you shortly.");
            contactForm.reset();
            resetContactTurnstile();
        } catch (error) {
            const lower = String(error?.message || "").toLowerCase();
            const message = lower.includes("too many")
                ? "Too many messages have been sent from this device. Please wait and try again later."
                : lower.includes("security") || lower.includes("turnstile")
                    ? "Security verification failed or expired. Please verify again and resend your message."
                    : "Message delivery failed. Please try again shortly.";
            alert(message);
            resetContactTurnstile();
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
    });
}
