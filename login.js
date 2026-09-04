const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("admin-email");
const passwordInput = document.getElementById("admin-password");
const loginButton = document.getElementById("login-btn");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";

    loginMessage.innerHTML = "";

    try {
        const loginRequest =
            supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        const timeout = new Promise(function (_, reject) {
            setTimeout(function () {
                reject(new Error("Login request timed out."));
            }, 10000);
        });

        const { data, error } =
            await Promise.race([
                loginRequest,
                timeout
            ]);

        if (error) {
            throw error;
        }

        if (data && data.session) {
            loginMessage.innerHTML = `
                <div class="publish-success">
                    Login successful.
                </div>
            `;

            window.location.replace("admin.html");
            return;
        }

        throw new Error("No login session was returned.");

    } catch (error) {
        console.error("Login error:", error);

        loginMessage.innerHTML = `
            <div class="login-error">
                ${error.message}
            </div>
        `;
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});