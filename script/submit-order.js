import { db } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("orderForm");

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const submitBtn = form.querySelector("button");

submitBtn.innerText = "Submitting...";
submitBtn.disabled = true;

try{

await addDoc(collection(db,"orders"),{

name: form.organization.value,
email: form.email.value,
service: form.service.value,
budget: form.budget.value,

status:"pending",

createdAt: serverTimestamp()

});

alert("Order submitted successfully");

form.reset();

}
catch(err){

console.error(err);

alert("Failed to submit order");

}

submitBtn.innerText = "Submit";
submitBtn.disabled = false;

});