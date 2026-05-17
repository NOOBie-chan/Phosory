import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   ELEMENTS
========================= */

const loginForm =
document.getElementById("loginForm");

const loginBtn =
document.getElementById("loginBtn");

const status =
document.getElementById("loginStatus");

/* =========================
   LOGIN
========================= */

loginForm.addEventListener("submit", async (e)=>{

  e.preventDefault();

  const email =
  document.getElementById("email")
  .value.trim();

  const password =
  document.getElementById("password")
  .value.trim();

  try{

    /* STATUS */

    status.style.display = "block";

    status.style.color = "cyan";

    status.innerText =
    "Verifying credentials...";

    loginBtn.disabled = true;

    loginBtn.innerText =
    "Authenticating...";

    /* FIREBASE LOGIN */

    const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user =
    userCredential.user;

    /* ROLE CHECK */

    status.innerText =
    "Checking permissions...";

    const userRef =
    doc(db, "users", user.uid);

    const snap =
    await getDoc(userRef);

    if(!snap.exists()){

      status.style.color = "#ff6b6b";

      status.innerText =
      "No permission profile found.";

      return;

    }

    const data = snap.data();

    /* ACCESS */

    status.style.color = "#00ffae";

    status.innerText =
    `Access granted (${data.role})`;

    setTimeout(()=>{

      window.location.href =
      "admin.html";

    },1200);

  }

  catch(error){

    console.error(error);

    status.style.display = "block";

    status.style.color = "#ff6b6b";

    if(
      error.code ===
      "auth/invalid-credential"
    ){

      status.innerText =
      "Invalid email or password.";

    }

    else if(
      error.code ===
      "auth/too-many-requests"
    ){

      status.innerText =
      "Too many attempts. Try again later.";

    }

    else{

      status.innerText =
      "Authentication failed.";

    }

  }

  finally{

    loginBtn.disabled = false;

    loginBtn.innerText =
    "ENTER SYSTEM";

  }

});

logAction("Admin login detected");