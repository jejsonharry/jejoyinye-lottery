const resetForm = document.getElementById("reset-password-form");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const updateButton = document.getElementById("update-password-btn");
const messageBox = document.getElementById("password-message");

function showPasswordMessage(message, type = "error") {
    messageBox.innerHTML = "";
    const box = document.createElement("div");
    box.className = type === "success" ? "publish-success" : "login-error";
    box.textContent = message;
    messageBox.appendChild(box);
}

function passwordStrengthError(password) {
    if (password.length < 12) return "Use at least 12 characters.";
    if (!/[a-z]/.test(password)) return "Add at least one lowercase letter.";
    if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter.";
    if (!/\d/.test(password)) return "Add at least one number.";
    if (!/[^A-Za-z0-9]/.test(password)) return "Add at least one symbol.";
    return "";
}

async function sha1Hex(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-1", bytes);
    return Array.from(new Uint8Array(digest))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
}

async function checkLeakedPassword(password) {
    const hash = await sha1Hex(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const { data, error } = await supabaseClient.functions.invoke("pwned-password-range", {
        body: { prefix }
    });

    if (error || data?.ok !== true) {
        throw new Error("Password safety check is temporarily unavailable. Please try again shortly.");
    }

    return Number(data?.suffixes?.[suffix] || 0);
}

// LISTEN FOR PASSWORD RECOVERY SESSION
supabaseClient.auth.onAuthStateChange(function (event) {
    if (event === "PASSWORD_RECOVERY") {
        showPasswordMessage(
            "Recovery link verified. Choose a strong new password below.",
            "success"
        );
    }
});

// SUBMIT NEW PASSWORD
resetForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const strengthError = passwordStrengthError(newPassword);

    if (strengthError) {
        showPasswordMessage(strengthError);
        return;
    }

    if (newPassword !== confirmPassword) {
        showPasswordMessage("The passwords do not match.");
        return;
    }

    updateButton.disabled = true;
    updateButton.textContent = "Checking Password...";

    try {
        const leakedCount = await checkLeakedPassword(newPassword);

        if (leakedCount > 0) {
            showPasswordMessage(
                "This password has appeared in known data breaches. Choose a different password that you have never used elsewhere."
            );
            return;
        }

        updateButton.textContent = "Updating Password...";

        const { error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        showPasswordMessage(
            "Password updated successfully. You will be returned to the secure login page.",
            "success"
        );

        resetForm.reset();

        setTimeout(async function () {
            try {
                await supabaseClient.auth.signOut();
            } finally {
                window.location.replace("login");
            }
        }, 2000);

    } catch (_) {
        showPasswordMessage(
            "We could not update your password securely right now. Please try again shortly."
        );
    } finally {
        updateButton.disabled = false;
        updateButton.textContent = "Update Password";
    }
});