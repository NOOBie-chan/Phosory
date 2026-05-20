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

import { exportAuditPDF } from "./exportAudit.js";

let USER_STATE = Object.freeze({
  role: null,
  email: null,
  uid: null
});

function clearAllViews() {
  document.getElementById("ordersContainer").innerHTML = "";
  document.getElementById("developersContainer").innerHTML = "";
  document.getElementById("auditView").innerHTML = "";
}
/* HIDE PAGE UNTIL VERIFIED */
document.body.style.visibility = "hidden";

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
  return (USER_STATE.role || "").toLowerCase() === "admin";
}

function isModerator(){
  return (USER_STATE.role || "").toLowerCase() !== "";
}

let timeout;

function resetTimer(){

clearTimeout(timeout);

timeout = setTimeout(async()=>{
  await addDoc(collection(db,"audit_logs"),{
action:"Session expired",
target:USER_STATE.email,
role:USER_STATE.role,
type:"auth",
timestamp:serverTimestamp()
});
await signOut(auth);

window.location.href="login.html";

},10*60*1000);

}

document.addEventListener("mousemove",resetTimer);
document.addEventListener("keydown",resetTimer);

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
document
.querySelectorAll(".audit-filter")
.forEach(btn=>{

btn.addEventListener("click",()=>{

switchAuditView(
btn.dataset.filter
);

});

});
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
    document.body.style.visibility = "hidden";
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

        await signOut(auth);

        window.location.href = "login.html";
        document.body.style.visibility = "hidden";
        return;
    }
    const adminData = adminSnap.data();
    console.log("ADMIN DATA:", adminData);
    const validRoles = ["admin", "moderator"];
    if (!validRoles.includes(adminData.role)) {

        await signOut(auth);

        window.location.href = "login.html";
      document.body.style.visibility = "hidden";
        return;
    }
   
   USER_STATE = Object.freeze({
    role: adminData.role || "moderator",
    email: user.email,
    uid: user.uid
  });
   
  document.body.style.visibility = "visible";
    console.log("ROLE:", USER_STATE.role);
    setupPermissions();
    loadData();
    resetTimer();

  } catch (err) {
    console.error("FULL ERROR:", err);
  }

  const roleDisplay =
document.getElementById("loggedRole");

if(roleDisplay){

   roleDisplay.innerHTML = `
      ${USER_STATE.role.toUpperCase()}
   `;

   roleDisplay.className =
   USER_STATE.role === "admin"
   ? "role-admin"
   : "role-moderator";

}

});

function setupPermissions() {

  const role = USER_STATE.role;

  console.log("FINAL ROLE CHECK:", role);

  const isAdmin = (USER_STATE.role || "").toLowerCase() === "admin";
const auditTools =
document.getElementById("auditTools");

if(auditTools){

auditTools.style.display =
isAdmin ? "flex" : "none";

}
  document.querySelectorAll(".approve-btn, .reject-btn").forEach(btn => {

    btn.style.display = isAdmin ? "inline-flex" : "none";

  });
}

window.isAdmin = function () {
  return (window.currentRole || "").toLowerCase() === "admin";
};

document.getElementById("logoutBtn").onclick = async () => {
  try {

    const user = auth.currentUser;

    if (user) {
      await addDoc(collection(db, "audit_logs"), {
      action: "Logout successful",
      target: user.email,
      role: USER_STATE.role,
      timestamp: serverTimestamp(),
      type: "auth"
    });
    }

    await signOut(auth);

    window.location.href = "login.html";
    document.body.style.visibility = "hidden";

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
$${o.budget || "N/A"}
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

function renderAudit(logs = []) {

  const container = document.getElementById("auditView");
  if (!container) return;

  const sortedLogs = [...logs].sort((a, b) => {
    const aTime = a?.timestamp?.toDate?.()?.getTime?.() || 0;
    const bTime = b?.timestamp?.toDate?.()?.getTime?.() || 0;
    return bTime - aTime;
  });

  container.innerHTML = sortedLogs.map(log => {
    const action = (log.action || "").toLowerCase();
    const type = (log.type || "").toLowerCase();

    let colorClass = "log-neutral";
    if (action.includes("approved")) colorClass = "log-success";
    else if (action.includes("accepted")) colorClass = "log-success";
    else if (action.includes("rejected")) colorClass = "log-danger";
    else if (action.includes("login")) colorClass = "log-auth";
    else if (action.includes("logout")) colorClass = "log-out";
    else if (action.includes("Session expired")) colorClass = "log-session-expired";

    // if (type === "auth") colorClass = "log-auth";
    // if (type === "order") colorClass = "log-warning";
    // if (type === "dev") colorClass = "log-info";
    // if (type === "security") colorClass = "log-danger";

    const time =
      log.timestamp?.toDate?.()?.toLocaleString() ||
      "unknown time";

    const actionText = log.action || "Unknown action";
    const targetText = log.target || "—";
    const roleText = log.role ? `(${log.role})` : "";

    return `
      <div class="audit-item ${colorClass}">
        
        <div class="audit-dot"></div>

        <div class="audit-content">

          <h4>${actionText}</h4>

          <p>
            ${targetText} ${roleText}
          </p>

          <span>${time}</span>

        </div>

      </div>
    `;
  }).join("");
}

document.getElementById("exportAudit")?.addEventListener("click", () => {
  exportAuditPDF(
    window.allLogs,
    {
      start: document.getElementById("startDate")?.value,
      end: document.getElementById("endDate")?.value
    },
    isAdmin
  );
});
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

  if (!isAdmin()) 
    await addDoc(collection(db,"audit_logs"),{
      action:"Unauthorized action attempt",
      target:USER_STATE.email,
      role:USER_STATE.role,
      type:"security",
      timestamp:serverTimestamp()
    });
    if(!confirm("Approve this order?")) return;

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

  if (!isAdmin()) 
    if(!confirm("Reject this order?")) return;

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

  if (!isAdmin()) {
    if(!confirm("Approve this developer?")) return;
  }

  const devRef = doc(db, "developers", id);
  const snap = await getDoc(devRef);
  const dev = snap.data();

  await updateDoc(devRef, {
    status: "accepted"
  });

  // EMAIL
  try {
    await emailjs.send("service_l643f6d", "template_mfi2awy", {
      email: dev.email,
      name: dev.name,
      status: "Accepted",
      message: "Congratulations! Your application has been approved."
    });
  } catch (err) {
    console.error("Email failed:", err);
  }

  await addDoc(collection(db, "audit_logs"), {
    action: "Accepted developer",
    target: dev.email,
    role: USER_STATE.role,
    type: "dev",
    timestamp: serverTimestamp()
  });
};

window.rejectDev = async (id) => {

  if (!isAdmin()) {
    if(!confirm("Reject this developer?")) return;
  }

  const devRef = doc(db, "developers", id);
  const snap = await getDoc(devRef);
  const dev = snap.data();

  await updateDoc(devRef, {
    status: "rejected"
  });

  // EMAIL
  try {
    await emailjs.send("service_l643f6d", "template_wz38zsa", {
      email: dev.email,
      name: dev.name,
      status: "Rejected",
      message: "Unfortunately your application was not approved."
    });
  } catch (err) {
    console.error("Email failed:", err);
  }

  await addDoc(collection(db, "audit_logs"), {
    action: "Rejected developer",
    target: dev.email,
    role: USER_STATE.role,
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