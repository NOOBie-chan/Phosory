import { db } from "./firebase.js";

import {
   collection,
   addDoc,
   serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";
emailjs.init(
   "hzYpGwbtgq7-kUZMg"
);

const devForm =
   document.getElementById("devForm");

const resumeInput =
   document.getElementById("resumeInput");

const resumeLinkInput =
   document.getElementById("resumeLink");

const uploadTitle =
   document.getElementById("uploadTitle");

const uploadSubtext =
   document.getElementById("uploadSubtext");



resumeInput.addEventListener("change", () => {

   const file =
      resumeInput.files[0];

   if (file) {

      uploadTitle.innerText =
         file.name;

      uploadSubtext.innerText =
         `${(file.size / 1024 / 1024).toFixed(2)} MB`;

   }

});

async function verifyTurnstile(token, formType) {

   const response =
      await fetch(
         "/.netlify/functions/verify-turnstile",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               token,
               formType
            })
         }
      );

   let data = {};

   try {
      data = await response.json();
   } catch {
      throw new Error(
         "Security service unavailable"
      );
   }

   if (!response.ok) {

      throw new Error(
         data.message ||
         "Security verification failed"
      );

   }

   return data;

}

async function uploadResume(file) {

   const allowedTypes = [

      "application/pdf",

      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

   ];

   const maxSize =
      5 * 1024 * 1024;

   if (!allowedTypes.includes(file.type)) {

      throw new Error(
         "Only PDF, DOC and DOCX allowed"
      );

   }

   if (file.size > maxSize) {

      throw new Error(
         "Maximum file size is 5MB"
      );

   }

   const formData =
      new FormData();

   formData.append(
      "file",
      file
   );

   formData.append(
      "upload_preset",
      "Phosory"
   );

   const response =
      await fetch(
         "https://api.cloudinary.com/v1_1/du19nhphj/raw/upload",
         {
            method: "POST",
            body: formData
         }
      );

   if (!response.ok) {

      throw new Error(
         "Resume upload failed"
      );

   }

   const data =
      await response.json();

   return data.secure_url;

}




devForm.addEventListener("submit", async (e) => {
   e.preventDefault();

   const submitBtn = devForm.querySelector("button");

   submitBtn.disabled = true;
   submitBtn.innerHTML = "Submitting...";

   try {
      const formData = new FormData(devForm);

      const name = formData.get("name");
      const email = formData.get("email");
      const skill = formData.get("skills");
      const file = resumeInput.files[0];

      if (!file) {
         throw new Error("Please upload a resume");
      }

      // ---------------------------
      // TURNSTILE FIX (IMPORTANT)
      // ---------------------------
      const widget = document.getElementById("devTurnstile");

      const token = turnstile.getResponse(widget);

      if (!token) {
         throw new Error("Complete security verification");
      }

      const verifyResult = await verifyTurnstile(token, "dev");

      if (!verifyResult.success) {
         throw new Error("Security verification failed");
      }

      // ---------------------------
      // UPLOAD FILE
      // ---------------------------
      const resumeURL = await uploadResume(file);

      resumeLinkInput.value = resumeURL;

      // ---------------------------
      // FIREBASE WRITE
      // ---------------------------
      await addDoc(collection(db, "developers"), {
         name,
         email,
         skill,
         resumeURL,
         status: "pending",
         submittedAt: serverTimestamp()
      });

      // ---------------------------
      // EMAIL
      // ---------------------------
      await emailjs.send(
         "service_8sgugr4",
         "template_nf0gf2k",
         {
            name,
            email,
            skills: skill,
            resumeLink: resumeURL
         }
      );

      alert("Application submitted successfully");

      devForm.reset();

      uploadTitle.innerText = "Upload Resume";
      uploadSubtext.innerText = "PDF, DOC or DOCX";

      // FIXED RESET
      if (window.turnstile) {
         turnstile.reset(widget);
      }

   } catch (err) {
      console.error("ERROR:", err);

      alert(err.message || "Submission failed");

   } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Apply Now <i class="fas fa-arrow-right"></i>`;
   }
});