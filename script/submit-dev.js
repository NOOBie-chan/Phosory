import { db, storage } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/* ================================
   DEV FORM
================================ */

const devForm = document.getElementById("devForm");

let isSubmittingDev = false;

devForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSubmittingDev) return;
  isSubmittingDev = true;

  try {
    const file = document.getElementById("resumeInput").files[0];

    if (!file) {
      alert("Please upload a resume");
      return;
    }

    // UPLOAD RESUME
    const fileRef = ref(storage, "resumes/" + Date.now() + "-" + file.name);
    await uploadBytes(fileRef, file);

    const resumeURL = await getDownloadURL(fileRef);

    const data = {
      name: devForm.querySelector('input[name="name"]').value,
      email: devForm.querySelector('input[name="email"]').value,
      skill: devForm.querySelector('select[name="skills"]').value,
      resumeURL,
      status: "pending",
      createdAt: serverTimestamp()
    };

    // SAVE TO FIRESTORE
    await addDoc(collection(db, "developers"), data);

    // EMAILJS
emailjs.init("O36tGYSsch_6D37XK");
    await emailjs.send(
      "service_30h4w0q",
      "template_4km6hlw",
      data
    );

    alert("Application submitted");
    devForm.reset();

  } catch (err) {
    console.error(err);
    alert("Submission failed");
  } finally {
    isSubmittingDev = false;
  }
});