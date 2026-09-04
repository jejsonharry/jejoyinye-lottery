const resetForm = document.getElementById("reset-password-form");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const updateButton = document.getElementById("update-password-btn");
const messageBox = document.getElementById("password-message");

// LISTEN FOR PASSWORD RECOVERY SESSION
supabaseClient.auth.onAuthStateChange(function (event, session) {
    if (event === "PASSWORD_RECOVERY") {
        messageBox.innerHTML = `
            <div class="publish-success">
                Recovery link verified. Enter your new password below.
            </div>
        `;
    }
});

// SUBMIT NEW PASSWORD
resetForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword.length < 8) {
        messageBox.innerHTML = `
            <div class="login-error">
                Password must contain at least 8 characters.
            </div>
        `;
        return;
    }

    if (newPassword !== confirmPassword) {
        messageBox.innerHTML = `
            <div class="login-error">
                The passwords do not match.
            </div>
        `;
        return;
    }

    updateButton.disabled = true;
    updateButton.textContent = "Updating Password...";

    try {
        const { error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        messageBox.innerHTML = `
            <div class="publish-success">
                <h3>Password Updated Successfully</h3>
                <p>Your administrator password has been changed.</p>
                <p>Redirecting you to login...</p>
            </div>
        `;

        resetForm.reset();

        setTimeout(async function () {
            await supabaseClient.auth.signOut();
            window.location.replace("login.html");
        }, 2000);

    } catch (error) {
        console.error("Password update error:", error);
        messageBox.innerHTML = `
            <div class="login-error">
                ${error.message}
            </div>
        `;
    } finally {
        updateButton.disabled = false;
        updateButton.textContent = "Update Password";
    }
});