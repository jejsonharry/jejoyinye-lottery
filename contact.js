// ==========================================
// CONTACT FORM SUBMISSION SYSTEM
// SECURITY-HARDENED
// ==========================================

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
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
            const { error } = await supabaseClient
                .from("messages")
                .insert([payload]);

            if (error) throw error;

            alert("Thank you! Your message has been sent successfully. We will get back to you shortly.");
            contactForm.reset();
        } catch (_) {
            // Do not expose provider/database errors or submitted message content in the browser.
            alert("Message delivery failed. Please try again shortly.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
    });
}
