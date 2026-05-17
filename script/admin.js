import { auth, db } from "./firebase.js";
import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
collection,
onSnapshot,
updateDoc,
doc,
addDoc,
serverTimestamp,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const searchInput = document.getElementById("search");
let searchQuery = "";
const sections = document.querySelectorAll(".view-section");

let orders = [];
let devs = [];
let chart;
let currentRole = null;
let currentUser = null;

searchInput?.addEventListener("input", (e) => {
searchQuery = e.target.value.toLowerCase();
applySearch();
});
function applySearch(){

const filteredOrders = orders.filter(o => {

return (
(o.name || "").toLowerCase().includes(searchQuery) ||
(o.email || "").toLowerCase().includes(searchQuery) ||
(o.service || "").toLowerCase().includes(searchQuery) ||
(o.budget || "").toString().toLowerCase().includes(searchQuery)
);

});

const filteredDevs = devs.filter(d => {

return (
(d.name || "").toLowerCase().includes(searchQuery) ||
(d.email || "").toLowerCase().includes(searchQuery) ||
(d.skill || "").toLowerCase().includes(searchQuery)
);

});

renderOrders(filteredOrders);
renderDevs(filteredDevs);

}

const views = {
dashboard: document.getElementById("dashboard"),
orders: document.getElementById("orders"),
devs: document.getElementById("devs"),
audit: document.getElementById("audit")
};

const title = document.getElementById("title");
const sidebar =
document.getElementById("sidebar");

const menuBtn =
document.getElementById("menuBtn");

const overlay =
document.getElementById("sidebarOverlay");

const navButtons =
document.querySelectorAll(".nav-btn");

/* ================= SIDEBAR TOGGLE ================= */

menuBtn.onclick = ()=>{

sidebar.classList.toggle("show-sidebar");

overlay.classList.toggle("show-overlay");

};

/* ================= CLOSE SIDEBAR ================= */

overlay.onclick = ()=>{

sidebar.classList.remove("show-sidebar");

overlay.classList.remove("show-overlay");

};

/* ================= VIEW SWITCHING ================= */

navButtons.forEach(btn=>{

btn.addEventListener("click",()=>{

/* REMOVE ACTIVE BUTTON */

navButtons.forEach(b=>
b.classList.remove("active-btn")
);

/* ACTIVATE CURRENT */

btn.classList.add("active-btn");

/* GET TARGET VIEW */

const target =
btn.dataset.view;

/* IGNORE IF NO VIEW */

if(!target) return;

/* HIDE ALL SECTIONS */

document
.querySelectorAll(".view-section")
.forEach(section=>{

section.classList.remove("active-view");

});

/* SHOW TARGET */

document
.getElementById(target)
.classList.add("active-view");

/* UPDATE TITLE */

const formattedTitle =

target.charAt(0)
.toUpperCase() +

target.slice(1);

const pageTitle =
document.getElementById("pageTitle");

if(pageTitle){

pageTitle.innerText =
formattedTitle;

}

/* AUTO CLOSE MOBILE SIDEBAR */

sidebar.classList.remove("show-sidebar");

overlay.classList.remove("show-overlay");

});

});

/* ================= AUTH ================= */

onAuthStateChanged(auth, async (user)=>{

if(!user){

window.location.href = "login.html";

return;

}

currentUser = user;

const adminRef =
doc(db,"admins",user.uid);

const adminSnap =
await getDoc(adminRef);

if(!adminSnap.exists()){

alert("Access denied");

await signOut(auth);

window.location.href =
"login.html";

return;

}

const adminData =
adminSnap.data();

currentRole =
adminData.role;

setupPermissions();

loadData();

});

function setupPermissions(){

const actionButtons =
document.querySelectorAll(".actions");

if(currentRole === "moderator"){

document.body.classList.add(
"readonly-mode"
);

}

if(currentRole === "admin"){

console.log("Admin access granted");

}

if(currentRole === "superadmin"){

console.log("Super Admin access granted");

}

}

/* ================= LOGOUT ================= */

document.getElementById("logoutBtn").onclick = ()=>{
signOut(auth);
};

/* ================= NAV ================= */

window.showView = (view)=>{
Object.values(views).forEach(v=>v.classList.remove("active"));
views[view].classList.add("active");
title.innerText = view.toUpperCase();
};

/* ================= REALTIME ================= */

function loadData(){

try {
onSnapshot(collection(db,"orders"),(snap)=>{
orders = snap.docs.map(d=>({id:d.id,...d.data()}));
applySearch();
renderOrders();
updateStats();
});
} catch(e){
console.error("Orders listener failed", e);
}

try {
onSnapshot(collection(db,"developers"),(snap)=>{
devs = snap.docs.map(d=>({id:d.id,...d.data()}));
applySearch();
renderDevs();
updateStats();
});
} catch(e){
console.error("Dev listener failed", e);
}

try {
onSnapshot(collection(db,"audit_logs"),(snap)=>{
renderAudit(snap.docs.map(d=>d.data()));
});
} catch(e){
console.error("Audit listener failed", e);
}

}

/* ================= ORDERS ================= */

function renderOrders(data = orders){

const container =
document.getElementById("ordersContainer");

if(!container) return;

const sortedOrders =
[...data].sort((a,b)=>

(b.createdAt?.seconds || 0) -
(a.createdAt?.seconds || 0)

);

container.innerHTML =
sortedOrders.map(o=>`

<div class="item ${o.status === "rejected" ? "blurred" : ""}">

<div class="status ${o.status || "pending"}">
${o.status || "pending"}
</div>

<h3>${o.name || "Unknown"}</h3>

<p>
<strong>Email:</strong>
${o.email || "No email"}
</p>

<p>
<strong>Service:</strong>
${o.service || "N/A"}
</p>

<p>
<strong>Budget:</strong>
${o.budget || "N/A"}
</p>

<p>
<strong>Created:</strong>
${o.createdAt?.toDate?.().toLocaleString() || "Just now"}
</p>

<div class="actions">

<button onclick="approveOrder('${o.id}')">
Approve
</button>

<button onclick="rejectOrder('${o.id}')">
Reject
</button>

</div>

</div>

`).join("");

}

/* ================= DEVS ================= */

function renderDevs(data = devs){

const container =
document.getElementById("developersContainer");

if(!container) return;

const sortedDevs =
[...data].sort((a,b)=>

(b.submittedAt?.seconds || 0) -
(a.submittedAt?.seconds || 0)

);

container.innerHTML =
sortedDevs.map(d=>`

<div class="item ${d.status === "rejected" ? "blurred" : ""}">

<div class="status ${d.status || "pending"}">
${d.status || "pending"}
</div>

<h3>${d.name || "Unknown"}</h3>

<p>
<strong>Email:</strong>
${d.email || "No email"}
</p>

<p>
<strong>Skill:</strong>
${d.skill || "N/A"}
</p>

<p>
<a href="${d.resumeURL || "#"}" target="_blank">
View Resume
</a>
</p>

<p>
<strong>Created:</strong>
${d.createdAt?.toDate?.().toLocaleString() || "Just now"}
</p>

<div class="actions">

<button onclick="approveDev('${d.id}')">
Approve
</button>

<button onclick="rejectDev('${d.id}')">
Reject
</button>

</div>

</div>

`).join("");

}
/* ================= AUDIT ================= */

function renderAudit(logs){
document.getElementById("auditContainer").innerHTML = logs.map(l=>`
<div class="item">
<h4>${l.action}</h4>
<p>${l.target}</p>
<small>${l.timestamp?.toDate?.() || ""}</small>
</div>
`).join("");
}

/* ================= ACTIONS ================= */

window.approveOrder = async (id)=>{

await updateDoc(doc(db,"orders",id),{
status:"approved"
});

await addDoc(collection(db,"audit_logs"),{
action:"Order approved",
target:id,
timestamp:serverTimestamp()
});

};

window.rejectOrder = async (id)=>{

await updateDoc(doc(db,"orders",id),{
status:"rejected"
});

await addDoc(collection(db,"audit_logs"),{
action:"Order rejected",
target:id,
timestamp:serverTimestamp()
});

};

window.resetOrderStatus = async (id)=>{

await updateDoc(doc(db,"orders",id),{
status:"pending"
});

await addDoc(collection(db,"audit_logs"),{
action:"Order reset to pending",
target:id,
timestamp:serverTimestamp()
});

};

window.approveDev = async (id)=>{

await updateDoc(doc(db,"developers",id),{
status:"accepted"
});

await addDoc(collection(db,"audit_logs"),{
action:"Developer accepted",
target:id,
timestamp:serverTimestamp()
});

};

window.rejectDev = async (id)=>{

await updateDoc(doc(db,"developers",id),{
status:"rejected"
});

await addDoc(collection(db,"audit_logs"),{
action:"Developer rejected",
target:id,
timestamp:serverTimestamp()
});

};

/* 🔥 NEW: RESET DEV */
window.resetDevStatus = async (id)=>{

await updateDoc(doc(db,"developers",id),{
status:"pending"
});

await addDoc(collection(db,"audit_logs"),{
action:"Developer reset to pending",
target:id,
timestamp:serverTimestamp()
});

};
/* ================= STATS ================= */

function updateStats(){

document.getElementById("ordersCount").innerText =
orders.length;

document.getElementById("devCount").innerText =
devs.length;

document.getElementById("approvedCount").innerText =

orders.filter(o=>o.status==="approved").length +

devs.filter(d=>d.status==="accepted").length;

document.getElementById("rejectedCount").innerText =

orders.filter(o=>o.status==="rejected").length +

devs.filter(d=>d.status==="rejected").length;

loadChart();

}

function loadChart(){

const ctx =
document.getElementById("chart");

if(!ctx) return;

if(chart){
chart.destroy();
}

chart = new Chart(ctx,{

type:"bar",

data:{

labels:[
"Orders",
"Developers",
"Approved",
"Rejected"
],

datasets:[{

label:"System Analytics",

data:[

orders.length,

devs.length,

orders.filter(o=>o.status==="approved").length +
devs.filter(d=>d.status==="accepted").length,

orders.filter(o=>o.status==="rejected").length +
devs.filter(d=>d.status==="rejected").length

],

borderRadius:10

}]

},

options:{

responsive:true,

plugins:{
legend:{
labels:{
color:"white"
}
}
},

scales:{

x:{
ticks:{
color:"white"
},
grid:{
color:"rgba(255,255,255,.05)"
}
},

y:{
ticks:{
color:"white"
},
grid:{
color:"rgba(255,255,255,.05)"
}
}

}

}

});

}