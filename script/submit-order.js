import { db } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("clientForm");

if(form){

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const submitBtn = form.querySelector(".submit-btn");

try{

submitBtn.innerText = "Saving...";
submitBtn.disabled = true;

await addDoc(
collection(db,"orders"),
{

name: form.name.value,

email: form.email.value,

service: form.projectType.value,

budget: form.budget.value,

details: form.details.value,

status: "pending",

createdAt: serverTimestamp()

});

console.log("Order saved");

}
catch(err){

console.error("Firestore save failed:",err);

}
finally{

submitBtn.disabled = false;
submitBtn.innerText = "Submit Request";

}

});

}