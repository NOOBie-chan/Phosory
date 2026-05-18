import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================
   STATE CONTROL
========================= */
let justLoggedIn = false;

/* =========================
   ELEMENTS
========================= */
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const status = document.getElementById("loginStatus");


/* =========================
   LOGIN
========================= */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    status.style.display = "block";
    status.style.color = "cyan";
    status.innerText = "Verifying credentials...";

    loginBtn.disabled = true;
    loginBtn.innerText = "Authenticating...";

    /* AUTH */
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("LOGIN SUCCESS:", user.uid);

    /* ROLE FETCH */
    status.innerText = "Checking permissions...";

    let role = "moderator"; // default safe role

    const userRef = doc(db, "admins", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      role = snap.data().role || "moderator";
    }

    /* STORE SESSION (IMPORTANT) */
    window.currentRole = role;
    window.currentUserEmail = email;

    justLoggedIn = true; // 🔥 ONLY TRUE FOR REAL LOGIN EVENT


    /* AUDIT LOG (LOGIN ONLY ON REAL LOGIN) */
    if (justLoggedIn) {
      await addDoc(collection(db, "audit_logs"), {
        action: "Login successful",
        target: email,
        role: window.currentRole,
        timestamp: serverTimestamp(),
        type: "auth"
      });

      justLoggedIn = false; // reset immediately
    }

    sessionStorage.setItem("justLoggedIn", "true");
    /* UI SUCCESS */
    status.style.color = "#00ffae";
    status.innerHTML = `
      Access granted<br>
      <strong>${role.toUpperCase()}</strong>
    `;

    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1200);

  } catch (error) {
    console.error(error);

    status.style.display = "block";
    status.style.color = "#ff6b6b";

    if (error.code === "auth/invalid-credential") {
      status.innerText = "Invalid email or password.";
    } else if (error.code === "auth/too-many-requests") {
      status.innerText = "Too many attempts. Try again later.";
    } else {
      status.innerText = "Authentication failed.";
    }

  } finally {
    loginBtn.disabled = false;
    loginBtn.innerText = "ENTER SYSTEM";
  }
});