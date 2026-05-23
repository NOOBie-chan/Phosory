import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";
emailjs.init("hzYpGwbtgq7-kUZMg");

// ================= ELEMENTS =================
const clientBtn = document.getElementById("clientBtn");
const developerBtn = document.getElementById("developerBtn");
const clientForm = document.getElementById("clientForm");
const devForm = document.getElementById("devForm");
let clientSubmitting = false;
let devSubmitting = false;
// ================= FORM SWITCH =================
clientBtn?.addEventListener("click", () => {
    clientBtn.classList.add("active");
    developerBtn.classList.remove("active");
    clientForm.classList.add("activeForm");
    devForm.classList.remove("activeForm");

    clientForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

developerBtn?.addEventListener("click", () => {
    developerBtn.classList.add("active");
    clientBtn.classList.remove("active");
    devForm.classList.add("activeForm");
    clientForm.classList.remove("activeForm");

    devForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});
// ================= BUDGET SLIDER =================
const budgetSlider = document.getElementById("budgetSlider");
const budgetValue = document.getElementById("budgetValue");
function updateBudget() {
    const value = Number(budgetSlider.value);
    budgetValue.innerText = value.toLocaleString();
}
budgetSlider?.addEventListener(
    "input",
    updateBudget
);
updateBudget();
// ================= FILE UI =================
const resumeInput = document.getElementById("resumeInput");
const uploadField = document.querySelector(".upload-field");
const uploadTitle = document.getElementById("uploadTitle");
const uploadSubtext = document.getElementById("uploadSubtext");
resumeInput?.addEventListener("change", () => {
    const file = resumeInput.files[0];
    if (file) {
        uploadField.classList.add("has-file");
        uploadTitle.innerText = file.name;
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        uploadSubtext.innerText = `${sizeMB} MB selected`;
    } else {
        uploadField.classList.remove("has-file");
        uploadTitle.innerText = "Upload Resume";
        uploadSubtext.innerText = "PDF, DOC or DOCX";
    }
});
// ================= TOAST =================
function showToast(message) {
    const toast = document.createElement("div");
    toast.innerText = message;
    Object.assign(toast.style, {
        position: "fixed",
        top: "30px",
        right: "30px",
        background: "#111827",
        color: "#fff",
        padding: "18px 22px",
        borderRadius: "16px",
        zIndex: "999999",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
    });
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
// ================= SUCCESS ANIMATION =================
function showSuccessAnimation() {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "999999"
    });
    overlay.innerHTML = `
        <div style="
            width:130px;
            height:130px;
            border-radius:50%;
            background:linear-gradient(135deg,#00ffff,#6c63ff);
            display:flex;
            justify-content:center;
            align-items:center;
            box-shadow:0 0 60px rgba(0,255,255,0.4);
        ">
            <i class="fas fa-check" style="
                color:white;
                font-size:3rem;
            "></i>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
        overlay.remove();
    }, 1600);
}
// ================= CLOUDINARY =================
async function uploadToCloudinary(file) {
    const cloudName = "du19nhphj";
    const uploadPreset = "Phosory";
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
        throw new Error(
            "Only PDF, DOC and DOCX files allowed"
        );
    }

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        alert("Only PDF files allowed");
        return;
    }

    if (file.size > maxSize) {
        alert("File too large");
        return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("resource_type", "raw");
    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        {
            method: "POST",
            body: formData
        }
    );
    const data = await res.json();
    const fileUrl = data.secure_url || data.url;
    if (!fileUrl) {
        throw new Error("Upload failed");
    }
    return fileUrl;
}
// ================= CLIENT FORM =================
clientForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (clientSubmitting) return;
    clientSubmitting = true;

    const button = clientForm.querySelector(".submit-btn");
    const original = button.innerHTML;

    button.innerHTML = "Sending...";
    button.disabled = true;

    try {

        const data = Object.fromEntries(
            new FormData(clientForm)
        );

        await emailjs.send(
            "service_8sgugr4",
            "template_3g1hxrs",
            data
        );

        showSuccessAnimation();

        clientForm.reset();

        updateBudget();

        button.innerHTML = "Sent ✓";

    } catch (err) {

        console.error(err);

        showToast("Failed to send");

        button.innerHTML = "Failed ✕";

    } finally {

        clientSubmitting = false;

        setTimeout(() => {
            button.innerHTML = original;
            button.disabled = false;
        }, 2000);

    }

});
// ================= DEV FORM =================
devForm?.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (devSubmitting) return;

    devSubmitting = true;

    const button = devForm.querySelector(".submit-btn");

    const original = button.innerHTML;

    button.innerHTML = "Preparing...";

    button.disabled = true;

    try {

        const file = document.getElementById(
            "resumeInput"
        ).files[0];

        if (!file) {
            showToast("Upload resume");
            throw new Error("No file");
        }

        button.innerHTML = "Uploading...";

        const link = await uploadToCloudinary(file);

        document.getElementById(
            "resumeLink"
        ).value = link;

        const data = Object.fromEntries(
            new FormData(devForm)
        );

        button.innerHTML = "Sending...";

        await emailjs.send(
            "service_8sgugr4",
            "template_nf0gf2k",
            data
        );

        showSuccessAnimation();

        devForm.reset();

        uploadField.classList.remove(
            "has-file"
        );

        uploadTitle.innerText =
            "Upload Resume";

        uploadSubtext.innerText =
            "PDF, DOC or DOCX";

        button.innerHTML = "Sent ✓";

    } catch (err) {

        console.error(err);

        showToast("Application failed");

        button.innerHTML = "Failed ✕";

    } finally {

        devSubmitting = false;

        setTimeout(() => {
            button.innerHTML = original;
            button.disabled = false;
        }, 2000);

    }

});
// ================= AUTO CLIENT OPEN =================
const params = new URLSearchParams(window.location.search);
const autoClient = params.get("autoclient");
if (autoClient) {
    clientBtn.click();
}
// ================= AUTO SERVICE FILL =================
const service = params.get("service");
const type = params.get("type");
const features = params.get("features");
const pages = params.get("pages");
const complexity = params.get("complexity");
const price = params.get("price");
// ================= CLIENT AUTO POPULATE =================
if (service) {
    clientBtn.click();
    setTimeout(() => {
        const projectTypeInput = document.querySelector("[name=projectType]");
        const detailsInput = document.querySelector("[name=details]");
        if (projectTypeInput) {
            projectTypeInput.value = service;
        }
        if (detailsInput) {
            detailsInput.value =
                `Selected Service: ${service || "N/A"}
Selected Type: ${type || "N/A"}
Complexity: ${complexity || "Basic"}
Number of Pages: ${pages || "1"}
Features: ${features || "None"}`;
        }
        if (price && budgetSlider) {
            const cleanPrice = parseInt(
                price.replace(/[^0-9]/g, "")
            );
            if (!isNaN(cleanPrice)) {
                budgetSlider.value = cleanPrice;
                updateBudget();
            }
        }
    }, 300);
}