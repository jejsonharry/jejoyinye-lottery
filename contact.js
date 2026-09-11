// ==========================================
// CONTACT FORM SUBMISSION SYSTEM
// SECURITY-HARDENED + RATE LIMITED
// ==========================================

const contactForm = document.querySelector(".contact-form");

function installContactHoneypot(form) {
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

if (contactForm) {
    installContactHoneypot(contactForm);

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector(".submit-btn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending Message...";

        const payload = {
            name: document.getElementById("contact-name").value.trim(),
            phone: document.getElementById("contact-phone").value.trim(),
            email: document.getElementById("contact-email").value.trim(),
            subject: document.getElementById("subject").value,
            message: document.getElementById("contact-message").value.trim()
        };

        try {
            const website = contactForm.querySelector('[name="website"]')?.value || "";
            const { data, error } = await supabaseClient.functions.invoke("public-form-submit", {
                body: { action: "contact", payload, website }
            });

            if (error) throw error;
            if (data?.ok !== true) throw new Error(data?.error || "Message rejected");

            alert("Thank you! Your message has been sent successfully. We will get back to you shortly.");
            contactForm.reset();
        } catch (error) {
            const message = String(error?.message || "").toLowerCase().includes("too many")
                ? "Too many messages have been sent from this device. Please wait and try again later."
                : "Message delivery failed. Please try again shortly.";
            alert(message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
    });
}
