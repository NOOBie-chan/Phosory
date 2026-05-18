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

function clearAllViews() {
  document.getElementById("ordersContainer").innerHTML = "";
  document.getElementById("developersContainer").innerHTML = "";
  document.getElementById("auditView").innerHTML = "";
}

const searchInput = document.getElementById("search");
let searchQuery = "";
const sections = {
  dashboard: document.getElementById("dashboard"),
  orders: document.getElementById("orders"),
  developers: document.getElementById("developers"),
  audit: document.getElementById("audit")
};

let orders = [];
let devs = [];
let chart;
let currentUser = null;

function isAdmin(){
  return (window.currentRole || "").toLowerCase() === "admin";
}

function isModerator(){
  return (window.currentRole || "").toLowerCase() === "moderator";
}

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

const navBtns = document.querySelectorAll(".nav-btn");
const pageTitle = document.getElementById("pageTitle");

function switchView(viewId) {
  document.querySelectorAll(".view-section").forEach(section => {
    section.classList.remove("active-view");
  });

  const target = document.getElementById(viewId);
  if (target) target.classList.add("active-view");

  pageTitle.innerText =
    viewId.charAt(0).toUpperCase() + viewId.slice(1);
}

/* sidebar clicks */
navBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.dataset.view;
    switchView(view);
  });
});

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

onAuthStateChanged(auth, async (user) => {

  console.log("AUTH USER:", user);

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    console.log("UID:", user.uid);

    const adminRef = doc(db, "admins", user.uid);

    console.log("READING DOC...");

    const adminSnap = await getDoc(adminRef);

    console.log("DOC EXISTS:", adminSnap.exists());

    if (!adminSnap.exists()) {
      console.log("NO ADMIN DOC FOUND");
      return;
    }

    const adminData = adminSnap.data();

    console.log("ADMIN DATA:", adminData);

    // =========================
    // GLOBAL USER STATE
    // =========================
   window.currentRole = adminData.role || "moderator";
  console.log("ROLE LOCKED:", window.currentRole);
    window.currentEmail = user.email;

    console.log("ROLE:", window.currentRole);
    setupPermissions();
    loadData();

  } catch (err) {
    console.error("FULL ERROR:", err);
  }

});

function setupPermissions() {

  const role = window.currentRole;

  console.log("FINAL ROLE CHECK:", role);

  const isAdmin = role === "admin";

  document.querySelectorAll(".approve-btn, .reject-btn").forEach(btn => {

    btn.style.display = isAdmin ? "inline-flex" : "none";

  });
}

document.getElementById("logoutBtn").onclick = async () => {
  try {

    const user = auth.currentUser;

    if (user) {
      await addDoc(collection(db, "audit_logs"), {
      action: "Logout successful",
      target: user.email,
      role: window.currentRole,
      timestamp: serverTimestamp(),
      type: "auth"
    });
    }

    await signOut(auth);

    window.location.href = "login.html";

  } catch (err) {
    console.error("Logout error:", err);
  }
};

/* ================= NAV ================= */

window.showView = (view) => {

  // hide all sections first
  Object.values(sections).forEach(sec => {
    sec.classList.remove("active-view");
  });

  // show only selected
  sections[view].classList.add("active-view");

  // OPTIONAL: update title
  document.getElementById("pageTitle").innerText =
    view.charAt(0).toUpperCase() + view.slice(1);

  // 🔥 IMPORTANT: prevent overlap bugs
  document.getElementById("ordersContainer").innerHTML = "";
  document.getElementById("developersContainer").innerHTML = "";
  document.getElementById("auditView").innerHTML = "";
  clearAllViews();
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
onSnapshot(collection(db, "audit_logs"), (snap) => {
  const logs = snap.docs.map(d => {
    const data = d.data();

    return {
      ...data,
      type: (data.type || "").toLowerCase()
    };
  });

  window.allLogs = logs;
  renderAudit(logs);
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
<a href="mailto:${o.email}" class="email-link">
${o.email}
</a>
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

${isAdmin() ? `
  <div class="actions">
    <button onclick="approveOrder('${o.id}')">Approve</button>
    <button onclick="rejectOrder('${o.id}')">Reject</button>
  </div>
` : `
  <div class="readonly-tag">View Only</div>
`}

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
<a href="mailto:${d.email}" class="email-link">
${d.email}
</a>
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
<strong>Submitted:</strong>
${d.submittedAt?.toDate?.().toLocaleString() || "Just now"}
</p>

<div class="actions">

${isAdmin() ? `
  <div class="actions">
    <button onclick="approveDev('${d.id}')">Approve</button>
    <button onclick="rejectDev('${d.id}')">Reject</button>
  </div>
` : `
  <div class="readonly-tag">Moderator Access</div>
`}

</div>

</div>

`).join("");

}
/* ================= AUDIT ================= */

function renderAudit(logs){

  const container = document.getElementById("auditView");
  if(!container) return;

  container.innerHTML = logs
    .sort((a,b) =>
      (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
    )
    .map(l => {

      const time =
        l.timestamp?.toDate?.().toLocaleString() || "unknown time";

      let colorClass = "log-neutral";

      const action = (l.action || "").toLowerCase();

      if(action.includes("approved")) colorClass = "log-success";
      if(action.includes("accepted")) colorClass = "log-success";
      if(action.includes("rejected")) colorClass = "log-danger";
      if(action.includes("login")) colorClass = "log-auth";
      if(action.includes("logout")) colorClass = "log-danger";

      return `
        <div class="audit-item ${colorClass}">
          <div class="audit-dot"></div>

          <div class="audit-content">
            <h4>${l.action || "Unknown"}</h4>
            <p>${l.target || ""}</p>
            <span>${time}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

/* ================= AUDIT FILTER ================= */

window.switchAuditView = (filter) => {

  const logs = window.allLogs || [];

  if (filter === "all") {
    renderAudit(logs);
    return;
  }

  const filtered = logs.filter(l => {

    const type = (l.type || "").toLowerCase();

    switch (filter) {

      case "auth":
        return type === "auth";

      case "orders":
        return type === "order" || type === "orders";

      case "devs":
        return type === "dev" || type === "developer" || type === "developers";

      default:
        return false;
    }
  });

  renderAudit(filtered);
};
/* ================= ACTIONS ================= */

window.approveOrder = async (id) => {

  if (!isAdmin()) return;

  await updateDoc(doc(db, "orders", id), {
    status: "approved"
  });

  await addDoc(collection(db, "audit_logs"), {
    action: "Approved order",
    target: id,
    type: "order",
    timestamp: serverTimestamp()
  });
};

window.rejectOrder = async (id) => {

  if (!isAdmin()) return;

  await updateDoc(doc(db, "orders", id), {
    status: "rejected"
  });

  await addDoc(collection(db, "audit_logs"), {
    action: "Rejected order",
    target: id,
    type: "order",
    timestamp: serverTimestamp()
  });
};

window.approveDev = async (id) => {

  if (!isAdmin()) return;

  await updateDoc(doc(db, "developers", id), {
    status: "accepted"
  });

  await addDoc(collection(db, "audit_logs"), {
    action: "Accepted developer",
    target: id,
    type: "dev",
    timestamp: serverTimestamp()
  });
};

window.rejectDev = async (id) => {

  if (!isAdmin()) return;

  await updateDoc(doc(db, "developers", id), {
    status: "rejected"
  });

  await addDoc(collection(db, "audit_logs"), {
    action: "Rejected developer",
    target: id,
    type: "dev",
    timestamp: serverTimestamp()
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
type:"dev",
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