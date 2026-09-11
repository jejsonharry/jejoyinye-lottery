const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("admin-email");
const passwordInput = document.getElementById("admin-password");
const loginButton = document.getElementById("login-btn");
const loginMessage = document.getElementById("login-message");
const loginButtonDefaultContent = loginButton.innerHTML;

function setLoginMessage(message, type = "error") {
    loginMessage.innerHTML = "";
    const box = document.createElement("div");
    box.className = type === "success" ? "publish-success" : "login-error";
    box.textContent = message;
    loginMessage.appendChild(box);
}

function createMfaInput() {
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "numeric";
    input.autocomplete = "one-time-code";
    input.maxLength = 6;
    input.placeholder = "Enter 6-digit code";
    input.setAttribute("aria-label", "Authenticator code");
    input.style.textAlign = "center";
    input.style.letterSpacing = ".35em";
    input.style.fontSize = "20px";
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 6);
    });
    return input;
}

function renderMfaPanel(title, description) {
    loginForm.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "admin-login-field";
    wrapper.style.display = "grid";
    wrapper.style.gap = "14px";

    const heading = document.createElement("h3");
    heading.textContent = title;
    heading.style.margin = "0";
    heading.style.fontSize = "20px";

    const copy = document.createElement("p");
    copy.textContent = description;
    copy.style.margin = "0";
    copy.style.lineHeight = "1.6";

    wrapper.append(heading, copy);
    loginForm.appendChild(wrapper);
    return wrapper;
}

function addSignOutButton(wrapper) {
    const signOut = document.createElement("button");
    signOut.type = "button";
    signOut.textContent = "Use another account";
    signOut.style.border = "0";
    signOut.style.background = "transparent";
    signOut.style.cursor = "pointer";
    signOut.style.textDecoration = "underline";
    signOut.style.padding = "8px";
    signOut.addEventListener("click", async () => {
        await supabaseClient.auth.signOut();
        window.location.reload();
    });
    wrapper.appendChild(signOut);
}

async function checkLoginRateLimit() {
    const response = await fetch(
        "https://iedgznzmmfkdhgmkghwt.supabase.co/functions/v1/admin-login-gate",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}"
        }
    );

    let data = {};
    try { data = await response.json(); } catch (_) {}

    if (response.status === 429) {
        const minutes = Math.max(1, Math.ceil(Number(data?.retry_after || 900) / 60));
        throw new Error(`Too many login attempts. Please wait about ${minutes} minute${minutes === 1 ? "" : "s"} and try again.`);
    }

    if (!response.ok || data?.ok !== true) {
        throw new Error("Login protection service is temporarily unavailable. Please try again shortly.");
    }
}

async function verifyTotpFactor(factorId, code) {
    const challenge = await supabaseClient.auth.mfa.challenge({ factorId });
    if (challenge.error) throw challenge.error;

    const verification = await supabaseClient.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code
    });

    if (verification.error) throw verification.error;
    return verification.data;
}

function showMfaChallenge(factorId) {
    const wrapper = renderMfaPanel(
        "Two-step verification",
        "Enter the 6-digit code from your authenticator app to open the Admin Dashboard."
    );

    const codeInput = createMfaInput();
    const verifyButton = document.createElement("button");
    verifyButton.type = "button";
    verifyButton.className = "admin-login-submit";
    verifyButton.textContent = "Verify and continue";

    verifyButton.addEventListener("click", async () => {
        const code = codeInput.value.trim();
        if (!/^\d{6}$/.test(code)) {
            setLoginMessage("Enter the 6-digit code from your authenticator app.");
            return;
        }

        verifyButton.disabled = true;
        verifyButton.textContent = "Verifying...";
        setLoginMessage("Verifying your security code...", "success");

        try {
            await verifyTotpFactor(factorId, code);
            setLoginMessage("Verification successful. Opening dashboard...", "success");
            window.location.replace("admin");
        } catch (_) {
            setLoginMessage("The authenticator code is incorrect or expired. Please try the current code.");
            verifyButton.disabled = false;
            verifyButton.textContent = "Verify and continue";
            codeInput.select();
        }
    });

    codeInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            verifyButton.click();
        }
    });

    wrapper.append(codeInput, verifyButton);
    addSignOutButton(wrapper);
    codeInput.focus();
}

async function showMfaEnrollment(existingFactors = []) {
    // Remove abandoned/unverified TOTP factors when possible so a fresh QR code
    // can be issued. Verified factors are never removed automatically.
    for (const factor of existingFactors.filter(item => item.status !== "verified")) {
        try {
            await supabaseClient.auth.mfa.unenroll({ factorId: factor.id });
        } catch (_) {}
    }

    const enrollment = await supabaseClient.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "JOLS Admin"
    });

    if (enrollment.error) throw enrollment.error;

    const factorId = enrollment.data.id;
    const qrCode = enrollment.data.totp?.qr_code;
    const secret = enrollment.data.totp?.secret || "";

    const wrapper = renderMfaPanel(
        "Secure your admin account",
        "Admin MFA is required. Scan this QR code with Google Authenticator, Microsoft Authenticator, Authy, 1Password or another TOTP app. Then enter the 6-digit code below."
    );

    if (qrCode) {
        const qrWrap = document.createElement("div");
        qrWrap.style.display = "grid";
        qrWrap.style.placeItems = "center";
        qrWrap.style.padding = "14px";
        qrWrap.style.background = "#ffffff";
        qrWrap.style.borderRadius = "14px";

        const qrImage = document.createElement("img");
        qrImage.src = qrCode;
        qrImage.alt = "QR code for JOLS Admin authenticator setup";
        qrImage.style.width = "220px";
        qrImage.style.maxWidth = "100%";
        qrImage.style.height = "auto";
        qrWrap.appendChild(qrImage);
        wrapper.appendChild(qrWrap);
    }

    if (secret) {
        const manual = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "Can't scan the QR code? Show setup key";
        summary.style.cursor = "pointer";

        const secretBox = document.createElement("code");
        secretBox.textContent = secret;
        secretBox.style.display = "block";
        secretBox.style.wordBreak = "break-all";
        secretBox.style.padding = "12px";
        secretBox.style.marginTop = "8px";
        secretBox.style.borderRadius = "8px";
        secretBox.style.background = "rgba(148,163,184,.14)";

        manual.append(summary, secretBox);
        wrapper.appendChild(manual);
    }

    const codeInput = createMfaInput();
    const enableButton = document.createElement("button");
    enableButton.type = "button";
    enableButton.className = "admin-login-submit";
    enableButton.textContent = "Enable MFA and continue";

    enableButton.addEventListener("click", async () => {
        const code = codeInput.value.trim();
        if (!/^\d{6}$/.test(code)) {
            setLoginMessage("Enter the 6-digit code shown in your authenticator app.");
            return;
        }

        enableButton.disabled = true;
        enableButton.textContent = "Enabling MFA...";
        setLoginMessage("Confirming your authenticator...", "success");

        try {
            await verifyTotpFactor(factorId, code);
            setLoginMessage("MFA enabled successfully. Opening dashboard...", "success");
            window.location.replace("admin");
        } catch (_) {
            setLoginMessage("The authenticator code could not be verified. Enter the current 6-digit code and try again.");
            enableButton.disabled = false;
            enableButton.textContent = "Enable MFA and continue";
            codeInput.select();
        }
    });

    codeInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            enableButton.click();
        }
    });

    wrapper.append(codeInput, enableButton);
    addSignOutButton(wrapper);
    codeInput.focus();
}

async function continueWithMfa() {
    const assurance = await supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance.error) throw assurance.error;

    if (assurance.data?.currentLevel === "aal2") {
        window.location.replace("admin");
        return;
    }

    const factors = await supabaseClient.auth.mfa.listFactors();
    if (factors.error) throw factors.error;

    const totpFactors = Array.isArray(factors.data?.totp) ? factors.data.totp : [];
    const verifiedFactor = totpFactors.find(factor => factor.status === "verified");

    if (verifiedFactor) {
        showMfaChallenge(verifiedFactor.id);
        return;
    }

    await showMfaEnrollment(totpFactors);
}

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";
    loginMessage.innerHTML = "";

    try {
        await checkLoginRateLimit();

        const loginRequest = supabaseClient.auth.signInWithPassword({ email, password });
        const timeout = new Promise(function (_, reject) {
            setTimeout(function () { reject(new Error("Login request timed out.")); }, 10000);
        });

        const { data, error } = await Promise.race([loginRequest, timeout]);
        if (error) throw error;
        if (!data?.session) throw new Error("No login session was returned.");

        passwordInput.value = "";
        setLoginMessage("Password accepted. Checking two-step verification...", "success");
        await continueWithMfa();
    } catch (error) {
        const safeMessage = String(error?.message || "");
        const isRateLimit = safeMessage.startsWith("Too many login attempts") || safeMessage.startsWith("Login protection service");

        setLoginMessage(
            isRateLimit
                ? safeMessage
                : "Unable to sign in or start two-step verification. Check your details and try again."
        );
    } finally {
        // These elements may have been replaced by the MFA panel after password login.
        if (document.body.contains(loginButton)) {
            loginButton.disabled = false;
            loginButton.innerHTML = loginButtonDefaultContent;
        }
    }
});
