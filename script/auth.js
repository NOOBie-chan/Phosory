import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const btn = document.getElementById("loginBtn");
const error = document.getElementById("error");

btn.addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    console.log("LOGIN SUCCESS");

    window.location.href = "admin.html";

  } catch (e) {

    console.log(e.code);

    error.innerText =
      e.code === "auth/user-not-found"
        ? "No account found"
        : e.code === "auth/wrong-password"
        ? "Wrong password"
        : "Login failed";

  }

});