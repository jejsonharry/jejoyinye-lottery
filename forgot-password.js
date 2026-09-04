const forgotForm =
    document.getElementById("forgot-form");

const emailInput =
    document.getElementById("reset-email");

const resetButton =
    document.getElementById("reset-btn");

const resetMessage =
    document.getElementById("reset-message");


forgotForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const email =
            emailInput.value.trim();

        resetButton.disabled = true;
        resetButton.textContent = "Sending...";

        resetMessage.innerHTML = "";

        try {

            const {
                error
            } =
                await supabaseClient.auth
                    .resetPasswordForEmail(
                        email,
                        {
                            redirectTo:
                                new URL("reset-password.html", window.location.href).href
                        }
                    );

            if (error) {

                throw error;

            }

            resetMessage.innerHTML = `
                <div class="publish-success">

                    Password reset email requested.

                    Check your inbox.

                </div>
            `;

        }

        catch (error) {

            console.error(
                "Password reset error:",
                error
            );

            resetMessage.innerHTML = `
                <div class="login-error">

                    ${error.message}

                </div>
            `;

        }

        finally {

            resetButton.disabled = false;

            resetButton.textContent =
                "Send Reset Link";

        }

    }
);
