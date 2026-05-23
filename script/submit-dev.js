import { db } from "./firebase.js";

import {
   collection,
   addDoc,
   serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

/* =========================
   FILE UI
========================= */

resumeInput.addEventListener("change", () => {

   const file = resumeInput.files[0];

   if (file) {

      uploadTitle.innerText = file.name;

      uploadSubtext.innerText =
         `${(file.size / 1024 / 1024).toFixed(2)} MB`;

   }

});

/* =========================
   CLOUDINARY
========================= */

async function uploadResume(file) {
   const allowedTypes = [
      "application/pdf"
   ];

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

   formData.append(
      "upload_preset",
      "Phosory"
   );

   const response = await fetch(

      "https://api.cloudinary.com/v1_1/du19nhphj/raw/upload",

      {
         method: "POST",
         body: formData
      }

   );

   const data = await response.json();

   return data.secure_url;

}

/* =========================
   SUBMIT
========================= */

devForm.addEventListener("submit", async (e) => {

   e.preventDefault();

   const submitBtn =
      devForm.querySelector("button");

   submitBtn.disabled = true;

   submitBtn.innerHTML =
      `Submitting...`;

   try {

      const formData =
         new FormData(devForm);

      const name =
         formData.get("name");

      const email =
         formData.get("email");

      const skill =
         formData.get("skills");

      const file =
         resumeInput.files[0];

      if (!file) {

         alert("Please upload a resume");

         submitBtn.disabled = false;

         submitBtn.innerHTML =
            `Apply Now <i class="fas fa-arrow-right"></i>`;

         return;

      }

      /* =========================
         UPLOAD RESUME
      ========================= */

      const resumeURL =
         await uploadResume(file);

      resumeLinkInput.value =
         resumeURL;

      /* =========================
         SAVE TO FIRESTORE
      ========================= */

      await addDoc(
         collection(db, "developers"),
         {

            name,
            email,
            skill,
            resumeURL,

            status: "pending",

            submittedAt: serverTimestamp()

         }
      );

      /* =========================
         SUCCESS
      ========================= */

      alert("Application submitted successfully");

      devForm.reset();

      uploadTitle.innerText =
         "Upload Resume";

      uploadSubtext.innerText =
         "PDF, DOC or DOCX";

   }
   catch (err) {

      console.error(err);

      alert("Failed to submit application");

   }

   submitBtn.disabled = false;

   submitBtn.innerHTML =
      `Apply Now <i class="fas fa-arrow-right"></i>`;

});