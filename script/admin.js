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
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let orders = [];
let devs = [];
let chart;

const views = {
dashboard: document.getElementById("dashboard"),
orders: document.getElementById("orders"),
devs: document.getElementById("devs"),
audit: document.getElementById("audit")
};

const title = document.getElementById("title");

/* ================= AUTH ================= */

onAuthStateChanged(auth, (user)=>{
if(!user){
window.location.href="login.html";
return;
}
loadData();
});

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

onSnapshot(collection(db,"orders"),(snap)=>{
orders = snap.docs.map(d=>({id:d.id,...d.data()}));
renderOrders();
updateStats();
});

onSnapshot(collection(db,"developers"),(snap)=>{
devs = snap.docs.map(d=>({id:d.id,...d.data()}));
renderDevs();
updateStats();
});

onSnapshot(collection(db,"audit_logs"),(snap)=>{
renderAudit(snap.docs.map(d=>d.data()));
});

}

/* ================= ORDERS ================= */

function renderOrders(data = orders){

views.orders.innerHTML = data
.sort((a,b)=>
(b.createdAt?.seconds || 0) -
(a.createdAt?.seconds || 0)
)
.map(o=>`

<div class="item ${o.status === "rejected" ? "blurred" : ""}">

<div class="status ${o.status}">
${o.status}
</div>

<h3>${o.name}</h3>

<p><strong>Email:</strong> ${o.email}</p>

<p><strong>Service:</strong> ${o.service}</p>

<p><strong>Budget:</strong> ${o.budget}</p>

<p>
<strong>Submitted:</strong>
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

views.devs.innerHTML = data
.sort((a,b)=>
(b.createdAt?.seconds || 0) -
(a.createdAt?.seconds || 0)
)
.map(d=>`

<div class="item ${d.status === "rejected" ? "blurred" : ""}">

<div class="status ${d.status}">
${d.status}
</div>

<h3>${d.name}</h3>

<p><strong>Email:</strong> ${d.email}</p>

<p><strong>Skill:</strong> ${d.skill}</p>

<p>
<a href="${d.resumeURL}" target="_blank">
View Resume
</a>
</p>

<p>
<strong>Applied:</strong>
${
d.createdAt?.seconds
? new Date(
d.createdAt.seconds * 1000
).toLocaleString()
: "Submitting..."
}
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
views.audit.innerHTML = logs.map(l=>`
<div class="item">
<h4>${l.action}</h4>
<p>${l.target}</p>
<small>${l.timestamp?.toDate?.() || ""}</small>
</div>
`).join("");
}

/* ================= ACTIONS ================= */

window.approveOrder = async (id)=>{
await updateDoc(doc(db,"orders",id),{status:"approved"});
await addDoc(collection(db,"audit_logs"),{
action:"Approved order",
target:id,
timestamp:serverTimestamp()
});
};

window.rejectOrder = async (id)=>{
await updateDoc(doc(db,"orders",id),{status:"rejected"});
await addDoc(collection(db,"audit_logs"),{
action:"Rejected order",
target:id,
timestamp:serverTimestamp()
});
};

window.approveDev = async (id)=>{
await updateDoc(doc(db,"developers",id),{status:"accepted"});
await addDoc(collection(db,"audit_logs"),{
action:"Accepted developer",
target:id,
timestamp:serverTimestamp()
});
};

window.rejectDev = async (id)=>{
await updateDoc(doc(db,"developers",id),{status:"rejected"});
await addDoc(collection(db,"audit_logs"),{
action:"Rejected developer",
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

/* ================= SEARCH ================= */

document.getElementById("search")
.addEventListener("input",(e)=>{

const value =
e.target.value.toLowerCase();

const filteredOrders =
orders.filter(o=>

(o.name || "").toLowerCase().includes(value) ||

(o.email || "").toLowerCase().includes(value) ||

(o.service || "").toLowerCase().includes(value)

);

const filteredDevs =
devs.filter(d=>

(d.name || "").toLowerCase().includes(value) ||

(d.email || "").toLowerCase().includes(value) ||

(d.skill || "").toLowerCase().includes(value)

);

renderOrders(filteredOrders);

renderDevs(filteredDevs);

});