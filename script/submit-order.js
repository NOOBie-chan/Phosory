import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================================
   CLIENT FORM
================================ */

const clientForm = document.getElementById("clientForm");

let isSubmittingOrder = false;

clientForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSubmittingOrder) return;
  isSubmittingOrder = true;

  try {
    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      service: document.getElementById("projectType").value,
      budget: document.getElementById("budgetSlider").value,
      details: document.getElementById("message").value,
      status: "pending",
      createdAt: serverTimestamp()
    };

    // SAVE TO FIRESTORE (REALTIME TRIGGER)
    await addDoc(collection(db, "orders"), data);

    // EMAILJS (ONCE ONLY)
    emailjs.init("N9VA5XSXq7FpHO8Tc");
    await emailjs.send(
      "service_l643f6d",
      "template_mfi2awy",
      data
    );

    alert("Order submitted successfully");
    clientForm.reset();

  } catch (err) {
    console.error(err);
    alert("Order failed");
  } finally {
    isSubmittingOrder = false;
  }
});