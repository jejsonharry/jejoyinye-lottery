// =========================================================
// JEJOYINYE LOTTERY SERVICES
// AGENT APPLICATION
// SECURITY-HARDENED VERSION 23
// =========================================================

const agentForm = document.getElementById("agent-application-form");
const submitButton = document.getElementById("agent-submit-btn");
const submitText = document.getElementById("agent-submit-text");
const messageBox = document.getElementById("agent-form-message");

function showMessage(message, type = "error") {
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.style.display = "block";
    messageBox.style.padding = "15px";
    messageBox.style.marginBottom = "20px";
    messageBox.style.borderRadius = "10px";
    messageBox.style.fontSize = "13px";
    messageBox.style.fontWeight = "700";
    messageBox.style.lineHeight = "1.6";
    messageBox.style.whiteSpace = "pre-wrap";

    if (type === "success") {
        messageBox.style.background = "#dcfce7";
        messageBox.style.border = "1px solid #86efac";
        messageBox.style.color = "#166534";
    } else {
        messageBox.style.background = "#fee2e2";
        messageBox.style.border = "1px solid #fecaca";
        messageBox.style.color = "#991b1b";
    }
}

function setLoading(loading) {
    if (!submitButton) return;

    submitButton.disabled = loading;

    if (submitText) {
        submitText.textContent = loading
            ? "Submitting Application..."
            : "Submit Agent Application";
    }
}

function clean(value) {
    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");
}

function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : "";
}

async function submitAgentApplication(event) {
    event.preventDefault();

    showMessage("Submitting your application...", "success");

    const fullname = clean(getValue("fullname"));
    const phone = clean(getValue("phone"));
    const email = clean(getValue("email"));
    const nin = getValue("nin").replace(/\D/g, "");
    const state = clean(getValue("state"));
    const city = clean(getValue("city"));
    const address = clean(getValue("address"));
    const bankName = clean(getValue("bank_name"));
    const accountName = clean(getValue("account_name"));
    const accountNumber = getValue("account_number").replace(/\D/g, "");
    const experience = clean(getValue("experience"));
    const additionalInformation = clean(getValue("message"));
    const declaration = document.getElementById("declaration");

    if (fullname.length < 3) {
        showMessage("Please enter your full name.");
        return;
    }

    if (!/^\d{10,14}$/.test(phone.replace(/\D/g, ""))) {
        showMessage("Please enter a valid phone number.");
        return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage("Please enter a valid email address.");
        return;
    }

    if (!/^\d{11}$/.test(nin)) {
        showMessage("NIN must contain exactly 11 digits.");
        return;
    }

    if (!state) {
        showMessage("Please select your state.");
        return;
    }

    if (!city) {
        showMessage("Please enter your city or town.");
        return;
    }

    if (address.length < 5) {
        showMessage("Please enter your business address.");
        return;
    }

    if (!bankName) {
        showMessage("Please enter your bank name.");
        return;
    }

    if (accountName.length < 3) {
        showMessage("Please enter your account name.");
        return;
    }

    if (!/^\d{10}$/.test(accountNumber)) {
        showMessage("Account number must contain exactly 10 digits.");
        return;
    }

    if (!declaration || !declaration.checked) {
        showMessage("Please confirm the declaration.");
        return;
    }

    if (typeof supabaseClient === "undefined") {
        showMessage(
            "We could not connect to the application service. Please refresh the page and try again."
        );
        return;
    }

    const applicationData = {
        full_name: fullname,
        phone: phone,
        email: email || null,
        nin: nin,
        state: state,
        city: city,
        business_address: address,
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        lottery_experience: experience || null,
        additional_information: additionalInformation || null,
        status: "pending"
    };

    try {
        setLoading(true);

        const { error } = await supabaseClient
            .from("agent_applications")
            .insert([applicationData]);

        if (error) throw error;

        showMessage(
            "Application submitted successfully!\n\nYour application has been received and will be reviewed.",
            "success"
        );

        agentForm.reset();

        messageBox?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    } catch (_) {
        // Deliberately do not expose the submitted application, database response,
        // Supabase error object, NIN, bank details, or other personal data.
        showMessage(
            "We could not submit your application right now. Please try again shortly. If the problem continues, contact support.",
            "error"
        );
    } finally {
        setLoading(false);
    }
}

const ninInput = document.getElementById("nin");
if (ninInput) {
    ninInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 11);
    });
}

const accountNumberInput = document.getElementById("account_number");
if (accountNumberInput) {
    accountNumberInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 10);
    });
}

if (agentForm) {
    agentForm.addEventListener("submit", submitAgentApplication);
}
