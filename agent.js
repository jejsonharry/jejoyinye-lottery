// =========================================================
// JEJOYINYE LOTTERY SERVICES
// AGENT APPLICATION
// SECURITY-HARDENED VERSION 24
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
    if (submitText) submitText.textContent = loading ? "Submitting Application..." : "Submit Agent Application";
}

function clean(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
}

function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : "";
}

function installHoneypot(form) {
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

    if (fullname.length < 3) return showMessage("Please enter your full name.");
    if (!/^\d{10,14}$/.test(phone.replace(/\D/g, ""))) return showMessage("Please enter a valid phone number.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage("Please enter a valid email address.");
    if (!/^\d{11}$/.test(nin)) return showMessage("NIN must contain exactly 11 digits.");
    if (!state) return showMessage("Please select your state.");
    if (!city) return showMessage("Please enter your city or town.");
    if (address.length < 5) return showMessage("Please enter your business address.");
    if (!bankName) return showMessage("Please enter your bank name.");
    if (accountName.length < 3) return showMessage("Please enter your account name.");
    if (!/^\d{10}$/.test(accountNumber)) return showMessage("Account number must contain exactly 10 digits.");
    if (!declaration || !declaration.checked) return showMessage("Please confirm the declaration.");
    if (typeof supabaseClient === "undefined") return showMessage("We could not connect to the application service. Please refresh the page and try again.");

    const applicationData = {
        full_name: fullname,
        phone,
        email: email || null,
        nin,
        state,
        city,
        business_address: address,
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        lottery_experience: experience || null,
        additional_information: additionalInformation || null
    };

    try {
        setLoading(true);
        const website = agentForm?.querySelector('[name="website"]')?.value || "";
        const { data, error } = await supabaseClient.functions.invoke("public-form-submit", {
            body: { action: "agent", payload: applicationData, website }
        });
        if (error) throw error;
        if (data?.ok !== true) throw new Error(data?.error || "Submission rejected");

        showMessage("Application submitted successfully!\n\nYour application has been received and will be reviewed.", "success");
        agentForm.reset();
        messageBox?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
        const message = String(error?.message || "").toLowerCase().includes("too many")
            ? "Too many application attempts. Please wait and try again later."
            : "We could not submit your application right now. Please try again shortly. If the problem continues, contact support.";
        showMessage(message, "error");
    } finally {
        setLoading(false);
    }
}

const ninInput = document.getElementById("nin");
if (ninInput) ninInput.addEventListener("input", function () { this.value = this.value.replace(/\D/g, "").slice(0, 11); });

const accountNumberInput = document.getElementById("account_number");
if (accountNumberInput) accountNumberInput.addEventListener("input", function () { this.value = this.value.replace(/\D/g, "").slice(0, 10); });

if (agentForm) {
    installHoneypot(agentForm);
    agentForm.addEventListener("submit", submitAgentApplication);
}
