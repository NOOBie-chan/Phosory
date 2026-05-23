import { db } from "./firebase.js";

import {
   collection,
   addDoc,
   serverTimestamp
}
   from "https:

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

   const file = resumeInput.files[0];

   if (file) {

      uploadTitle.innerText =
         file.name;

      uploadSubtext.innerText =
         `${(file.size / 1024 / 1024).toFixed(2)} MB`;

   }

});


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
         "Only PDF, DOC and DOCX files allowed"
      );

   }

   if (file.size > maxSize) {

      throw new Error(
         "File too large (Max: 5MB)"
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
         "https:
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



devForm.addEventListener(
   "submit",
   async (e) => {

      e.preventDefault();

      const submitBtn =
         devForm.querySelector("button");

      submitBtn.disabled = true;

      submitBtn.innerHTML =
         "Submitting...";

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

            throw new Error(
               "Please upload a resume"
            );

         }

         const resumeURL =
            await uploadResume(file);

         resumeLinkInput.value =
            resumeURL;


         await addDoc(
            collection(
               db,
               "developerApplications"
            ),
            {

               name,

               email,

               skill,

               resumeURL,

               status: "pending",

               submittedAt:
                  serverTimestamp()

            }

         );


         alert(
            "Application submitted successfully"
         );

         devForm.reset();

         uploadTitle.innerText =
            "Upload Resume";

         uploadSubtext.innerText =
            "PDF, DOC or DOCX";

      }
      catch (err) {

         console.error(err);

         alert(
            err.message ||
            "Failed to submit application"
         );

      }
      finally {

         submitBtn.disabled = false;

         submitBtn.innerHTML =
            `Apply Now <i class="fas fa-arrow-right"></i>`;

      }

   });