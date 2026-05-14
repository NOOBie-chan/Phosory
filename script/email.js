// =============================
// INIT EMAILJS
// =============================
(function(){
  emailjs.init("hzYpGwbtgq7-kUZMg");
})();


// =============================
// TOAST (ERROR ONLY)
// =============================
function showToast(message, type = "error") {
  let container = document.getElementById("toastContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";

    Object.assign(container.style, {
      position: "fixed",
      inset: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "99999",
      pointerEvents: "none"
    });

    document.body.appendChild(container);
  }

  const toast = document.createElement("div");

  Object.assign(toast.style, {
    padding: "20px 30px",
    borderRadius: "16px",
    color: "#fff",
    fontSize: "18px",
    textAlign: "center",
    background: "#ef4444cc",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    opacity: "0",
    transform: "scale(0.9)",
    transition: "all 0.3s ease"
  });

  toast.innerText = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "scale(1)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "scale(0.9)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}


// =============================
// SUCCESS ANIMATION
// =============================
function showSuccessAnimation() {
  const overlay = document.createElement("div");

  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "100000"
  });

  overlay.innerHTML = `
    <div style="width:120px;height:120px;border-radius:50%;background:#22c55e;display:flex;align-items:center;justify-content:center;">
      <svg width="60" height="60" viewBox="0 0 24 24">
        <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" fill="none"/>
      </svg>
    </div>
  `;

  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 1500);
}


// =============================
// CLOUDINARY UPLOAD
// =============================
async function uploadToCloudinary(file) {
  const cloudName = "du19nhphj";
  const uploadPreset = "Phosory";

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

  console.log("Cloudinary response:", data);

  const fileUrl = data.secure_url || data.url;
  if (!fileUrl) {
    console.log("Cloudinary error details:", data);
    throw new Error("Upload failed");
  }

  return fileUrl;
}

function initForms() {

  const clientForm = document.getElementById("clientForm");

  if (clientForm) {
    const button = clientForm.querySelector("button");

    clientForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const originalText = button.innerText;
      button.innerText = "Sending...";
      button.disabled = true;

      try {
        const data = Object.fromEntries(new FormData(clientForm));

        await emailjs.send("service_8sgugr4", "template_3g1hxrs", data);

        button.innerText = "Sent ✓";

        showSuccessAnimation();
        clientForm.reset();

      } catch (err) {
        console.error(err);

        button.innerText = "Failed ✕";
        showToast("Failed to send");
      }

      setTimeout(() => {
        button.innerText = originalText;
        button.disabled = false;
      }, 2000);
    });
  }


  // ===== DEV FORM =====
  const devForm = document.getElementById("devForm");

  if (devForm) {
    const button = devForm.querySelector("button");

    devForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const originalText = button.innerText;
      button.innerText = "Preparing...";
      button.disabled = true;

      try {
        const file = document.getElementById("resumeInput")?.files[0];

        if (!file) {
          showToast("Upload resume");
          throw new Error("No file");
        }

        button.innerText = "Uploading...";

        const link = await uploadToCloudinary(file);
        console.log("Resume URL:", link);
        document.getElementById("resumeLink").value = link;
        await new Promise(r => requestAnimationFrame(r)); // Wait for input to update
        const data = Object.fromEntries(new FormData(devForm));
        console.log(data);

        button.innerText = "Sending...";

        await emailjs.send("service_8sgugr4", "template_nf0gf2k", data);

        button.innerText = "Sent ✓";

        showSuccessAnimation();
        devForm.reset();

      } catch (err) {
        console.error(err);

        button.innerText = "Failed ✕";
        showToast("Application failed");
      }

      setTimeout(() => {
        button.innerText = originalText;
        button.disabled = false;
      }, 2000);
    });
  }
}


// =============================
// INIT
// =============================
document.addEventListener("DOMContentLoaded", () => {
  initForms();
});