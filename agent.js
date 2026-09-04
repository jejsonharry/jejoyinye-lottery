// =========================================================
// JOLS — JEJOYINYE LOTTERY SERVICES
// AGENT APPLICATION
// VERSION 22
// =========================================================

console.log("AGENT.JS VERSION 22 LOADED");


// =========================================================
// ELEMENTS
// =========================================================

const agentForm =
    document.getElementById("agent-application-form");

const submitButton =
    document.getElementById("agent-submit-btn");

const submitText =
    document.getElementById("agent-submit-text");

const messageBox =
    document.getElementById("agent-form-message");


// =========================================================
// MESSAGE DISPLAY
// =========================================================

function showMessage(message, type = "error") {

    if (!messageBox) {
        console.error("Message box not found");
        return;
    }

    messageBox.textContent = message;

    // Force message to remain visible
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


// =========================================================
// LOADING BUTTON
// =========================================================

function setLoading(loading) {

    if (!submitButton) {
        return;
    }

    submitButton.disabled = loading;

    if (submitText) {

        submitText.textContent =
            loading
                ? "Submitting Application..."
                : "Submit Agent Application";

    }
}


// =========================================================
// CLEAN TEXT
// =========================================================

function clean(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");

}


// =========================================================
// GET FIELD
// =========================================================

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value
        : "";

}


// =========================================================
// FORM SUBMISSION
// =========================================================

async function submitAgentApplication(event) {

    event.preventDefault();

    console.log("Agent form submitted");

    // Keep the message area visible while processing
    showMessage(
        "Submitting your application...",
        "success"
    );


    // =====================================================
    // GET FORM DATA
    // =====================================================

    const fullname =
        clean(getValue("fullname"));

    const phone =
        clean(getValue("phone"));

    const email =
        clean(getValue("email"));

    const nin =
        getValue("nin")
            .replace(/\D/g, "");

    const state =
        clean(getValue("state"));

    const city =
        clean(getValue("city"));

    const address =
        clean(getValue("address"));

    const bankName =
        clean(getValue("bank_name"));

    const accountName =
        clean(getValue("account_name"));

    const accountNumber =
        getValue("account_number")
            .replace(/\D/g, "");

    const experience =
        clean(getValue("experience"));

    const additionalInformation =
        clean(getValue("message"));

    const declaration =
        document.getElementById("declaration");



    // =====================================================
    // VALIDATION
    // =====================================================

    if (fullname.length < 3) {

        showMessage(
            "Please enter your full name."
        );

        return;
    }


    if (!/^\d{10,14}$/.test(
        phone.replace(/\D/g, "")
    )) {

        showMessage(
            "Please enter a valid phone number."
        );

        return;
    }


    if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

        showMessage(
            "Please enter a valid email address."
        );

        return;
    }


    if (!/^\d{11}$/.test(nin)) {

        showMessage(
            "NIN must contain exactly 11 digits."
        );

        return;
    }


    if (!state) {

        showMessage(
            "Please select your state."
        );

        return;
    }


    if (!city) {

        showMessage(
            "Please enter your city or town."
        );

        return;
    }


    if (address.length < 5) {

        showMessage(
            "Please enter your business address."
        );

        return;
    }


    if (!bankName) {

        showMessage(
            "Please enter your bank name."
        );

        return;
    }


    if (accountName.length < 3) {

        showMessage(
            "Please enter your account name."
        );

        return;
    }


    if (!/^\d{10}$/.test(accountNumber)) {

        showMessage(
            "Account number must contain exactly 10 digits."
        );

        return;
    }


    if (
        !declaration ||
        !declaration.checked
    ) {

        showMessage(
            "Please confirm the declaration."
        );

        return;
    }



    // =====================================================
    // CHECK SUPABASE
    // =====================================================

    if (
        typeof supabaseClient === "undefined"
    ) {

        console.error(
            "supabaseClient is undefined"
        );

        showMessage(
            "SUPABASE CONNECTION ERROR:\n" +
            "The Supabase client was not loaded."
        );

        return;
    }


    // =====================================================
    // DATA TO SEND
    // =====================================================

    const applicationData = {

        full_name: fullname,

        phone: phone,

        email:
            email || null,

        nin: nin,

        state: state,

        city: city,

        business_address:
            address,

        bank_name:
            bankName,

        account_name:
            accountName,

        account_number:
            accountNumber,

        lottery_experience:
            experience || null,

        additional_information:
            additionalInformation || null,

        status:
            "pending"

    };


    console.log(
        "Submitting application:",
        applicationData
    );



    // =====================================================
    // SUBMIT TO SUPABASE
    // =====================================================

    try {

        setLoading(true);


        const response =
            await supabaseClient
                .from("agent_applications")
                .insert([
                    applicationData
                ]);


        console.log(
            "Supabase response:",
            response
        );


        // =================================================
        // SUPABASE RETURNED ERROR
        // =================================================

        if (response.error) {

            const error =
                response.error;


            console.error(
                "SUPABASE INSERT ERROR:",
                error
            );


            let errorText =
                "SUPABASE ERROR";


            if (error.code) {

                errorText +=
                    "\nCode: " +
                    error.code;

            }


            if (error.message) {

                errorText +=
                    "\nMessage: " +
                    error.message;

            }


            if (error.details) {

                errorText +=
                    "\nDetails: " +
                    error.details;

            }


            if (error.hint) {

                errorText +=
                    "\nHint: " +
                    error.hint;

            }


            showMessage(
                errorText,
                "error"
            );


            return;
        }



        // =================================================
        // SUCCESS
        // =================================================

        console.log(
            "APPLICATION SUBMITTED SUCCESSFULLY"
        );


        showMessage(
            "Application submitted successfully!\n\n" +
            "Your application has been received and will be reviewed.",
            "success"
        );


        agentForm.reset();


        messageBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


    }

    catch (error) {

        console.error(
            "APPLICATION EXCEPTION:",
            error
        );


        let errorText =
            "SUBMISSION ERROR";


        if (error?.name) {

            errorText +=
                "\nType: " +
                error.name;

        }


        if (error?.message) {

            errorText +=
                "\nMessage: " +
                error.message;

        }


        if (error?.code) {

            errorText +=
                "\nCode: " +
                error.code;

        }


        showMessage(
            errorText,
            "error"
        );

    }

    finally {

        setLoading(false);

    }

}


// =========================================================
// NUMBER-ONLY NIN
// =========================================================

const ninInput =
    document.getElementById("nin");

if (ninInput) {

    ninInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(/\D/g, "")
                    .slice(0, 11);

        }
    );
}


// =========================================================
// NUMBER-ONLY ACCOUNT NUMBER
// =========================================================

const accountNumberInput =
    document.getElementById(
        "account_number"
    );

if (accountNumberInput) {

    accountNumberInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

        }
    );
}


// =========================================================
// GLOBAL JAVASCRIPT ERROR DISPLAY
// =========================================================

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "GLOBAL JAVASCRIPT ERROR:",
            event.error
        );

    }
);


// =========================================================
// START
// =========================================================

if (agentForm) {

    console.log(
        "Agent application form found."
    );

    agentForm.addEventListener(
        "submit",
        submitAgentApplication
    );

} else {

    console.error(
        "Agent application form was NOT found."
    );

}