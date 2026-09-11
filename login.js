const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("admin-email");
const passwordInput = document.getElementById("admin-password");
const loginButton = document.getElementById("login-btn");
const loginMessage = document.getElementById("login-message");
const loginButtonDefaultContent = loginButton.innerHTML;

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

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";
    loginMessage.innerHTML = "";

    try {
        await checkLoginRateLimit();

        const loginRequest = supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        const timeout = new Promise(function (_, reject) {
            setTimeout(function () {
                reject(new Error("Login request timed out."));
            }, 10000);
        });

        const { data, error } = await Promise.race([loginRequest, timeout]);

        if (error) throw error;

        if (data && data.session) {
            loginMessage.innerHTML = `
                <div class="publish-success">
                    Login successful.
                </div>
            `;

            window.location.replace("admin");
            return;
        }

        throw new Error("No login session was returned.");
    } catch (error) {
        const safeMessage = String(error?.message || "");
        const isRateLimit = safeMessage.startsWith("Too many login attempts") || safeMessage.startsWith("Login protection service");

        loginMessage.innerHTML = `
            <div class="login-error">
                ${isRateLimit ? safeMessage : "Unable to sign in. Check your email and password and try again."}
            </div>
        `;
    } finally {
        loginButton.disabled = false;
        loginButton.innerHTML = loginButtonDefaultContent;
    }
});
