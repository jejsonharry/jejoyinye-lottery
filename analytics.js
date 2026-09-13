(function () {
    "use strict";

    const MEASUREMENT_ID = "G-SBK671R2HY";
    const CONSENT_KEY = "jols_analytics_consent";
    let analyticsLoaded = false;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
        window.dataLayer.push(arguments);
    };

    window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500
    });

    function readConsent() {
        try {
            return window.localStorage.getItem(CONSENT_KEY);
        } catch (_) {
            return null;
        }
    }

    function saveConsent(value) {
        try {
            window.localStorage.setItem(CONSENT_KEY, value);
        } catch (_) {}
    }

    function loadAnalytics() {
        if (analyticsLoaded) return;
        analyticsLoaded = true;

        const tag = document.createElement("script");
        tag.async = true;
        tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
        tag.referrerPolicy = "strict-origin-when-cross-origin";
        document.head.appendChild(tag);

        window.gtag("js", new Date());
        window.gtag("config", MEASUREMENT_ID, {
            send_page_view: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
        });
    }

    function grantConsent() {
        window.gtag("consent", "update", { analytics_storage: "granted" });
        saveConsent("granted");
        loadAnalytics();
    }

    function denyConsent() {
        const reloadRequired = analyticsLoaded;
        window.gtag("consent", "update", { analytics_storage: "denied" });
        saveConsent("denied");
        return reloadRequired;
    }

    function removeBanner() {
        document.getElementById("jols-analytics-consent")?.remove();
    }

    function showConsentBanner() {
        removeBanner();

        const banner = document.createElement("section");
        banner.id = "jols-analytics-consent";
        banner.className = "jols-consent";
        banner.setAttribute("role", "dialog");
        banner.setAttribute("aria-modal", "true");
        banner.setAttribute("aria-labelledby", "jols-consent-title");
        banner.innerHTML = `
            <div class="jols-consent-copy">
                <strong id="jols-consent-title">Help us improve JOLS</strong>
                <p>We use optional Google Analytics to understand visits and improve the website. We do not send your application, bank or NIN details to Analytics. <a href="privacy">Privacy Policy</a></p>
            </div>
            <div class="jols-consent-actions">
                <button type="button" data-consent="deny">Decline</button>
                <button type="button" class="jols-consent-accept" data-consent="grant">Allow analytics</button>
            </div>`;

        banner.addEventListener("click", function (event) {
            const action = event.target.closest("[data-consent]")?.dataset.consent;
            if (action === "grant") {
                grantConsent();
                removeBanner();
            } else if (action === "deny") {
                const reloadRequired = denyConsent();
                removeBanner();
                if (reloadRequired) window.location.reload();
            }
        });

        document.body.appendChild(banner);
    }

    window.jolsTrackEvent = function (eventName, parameters) {
        if (readConsent() !== "granted") return;
        loadAnalytics();
        window.gtag("event", eventName, parameters || {});
    };

    function linkLabel(link) {
        return (link.getAttribute("aria-label") || link.textContent || "link")
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 100);
    }

    function trackBusinessClick(event) {
        const shareButton = event.target.closest("[data-share-result]");
        if (shareButton) {
            window.jolsTrackEvent("result_share_click", {
                game_name: shareButton.dataset.shareGame || "unknown",
                lottery: shareButton.dataset.shareLottery || "unknown"
            });
            return;
        }

        const link = event.target.closest("a[href]");
        if (!link) return;

        const rawHref = link.getAttribute("href") || "";
        let eventName = "";

        if (/modernlotterynigeria\.com/i.test(rawHref)) {
            eventName = "play_online_click";
        } else if (/chat\.whatsapp\.com/i.test(rawHref)) {
            eventName = "whatsapp_community_click";
        } else if (/wa\.me/i.test(rawHref)) {
            eventName = "whatsapp_contact_click";
        } else if (/facebook\.com\/share/i.test(rawHref)) {
            eventName = "facebook_community_click";
        } else if (/(^|\/)agent-application(?:\.html)?(?:[?#]|$)/i.test(rawHref)) {
            eventName = "agent_application_start";
        }

        if (eventName) {
            window.jolsTrackEvent(eventName, {
                link_text: linkLabel(link),
                page_path: window.location.pathname
            });
        }
    }

    function addSettingsButton() {
        const footer = document.querySelector(".legal-footer-links, .footer-links");
        if (!footer || footer.querySelector("[data-analytics-settings]")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "jols-analytics-settings";
        button.dataset.analyticsSettings = "true";
        button.textContent = "Analytics settings";
        button.addEventListener("click", showConsentBanner);
        footer.appendChild(button);
    }

    function initialise() {
        const consent = readConsent();
        if (consent === "granted") loadAnalytics();
        if (consent === null) showConsentBanner();

        addSettingsButton();
        document.addEventListener("click", trackBusinessClick);

        document.getElementById("prediction-range-form")?.addEventListener("submit", function () {
            window.jolsTrackEvent("prediction_range_apply", {
                page_path: window.location.pathname
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialise, { once: true });
    } else {
        initialise();
    }
})();
