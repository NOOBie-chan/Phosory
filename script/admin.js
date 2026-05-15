import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  listenOrders,
  listenDevelopers
} from "./realtime.js";

/* =========================
   EMAILJS
========================= */

emailjs.init("YOUR_PUBLIC_KEY");

/* =========================
   GLOBALS
========================= */

let allOrders = [];
let allDevelopers = [];
let analyticsChart;

/* =========================
   AUTH
========================= */

onAuthStateChanged(auth, (user) => {

  if(!user){
    window.location.href = "login.html";
    return;
  }

  initializeRealtime();

});

/* =========================
   LOGOUT
========================= */

document.getElementById("logoutBtn")
.onclick = async () => {

  await signOut(auth);

  window.location.href = "login.html";

};

/* =========================
   REALTIME
========================= */

function initializeRealtime(){

  listenOrders((orders) => {

    allOrders = orders;

    renderOrders(
      orders.filter(o => o.status !== "rejected")
    );

    renderRecentOrders();

    updateStats();

  });

  listenDevelopers((devs) => {

    allDevelopers = devs;

    renderDevelopers(
      devs.filter(d => d.status !== "rejected")
    );

    renderRecentDevelopers();

    updateStats();

  });

}

/* =========================
   ORDERS
========================= */

function renderOrders(orders){

  const container =
  document.getElementById("ordersList");

  container.innerHTML = orders.map(o => `

    <div class="item">

      <h3>${o.name}</h3>

      <p>${o.email}</p>

      <p>${o.service}</p>

      <small>${o.status}</small>

      <div class="actions">

        <button
        class="approve-btn"
        onclick="approveOrder('${o.id}')">
        Approve
        </button>

        <button
        class="reject-btn"
        onclick="rejectOrder('${o.id}')">
        Reject
        </button>

      </div>

    </div>

  `).join("");

}

/* =========================
   DEVELOPERS
========================= */

function renderDevelopers(devs){

  const container =
  document.getElementById("devList");

  container.innerHTML = devs.map(d => `

    <div class="item">

      <h3>${d.name}</h3>

      <p>${d.email}</p>

      <p>${d.skill}</p>

      <small>${d.status}</small>

      <a href="${d.resumeURL}" target="_blank">
      View Resume
      </a>

      <div class="actions">

        <button
        class="approve-btn"
        onclick="acceptDev('${d.id}','${d.email}','${d.name}')">
        Accept
        </button>

        <button
        class="reject-btn"
        onclick="rejectDev('${d.id}','${d.email}','${d.name}')">
        Reject
        </button>

      </div>

    </div>

  `).join("");

}

/* =========================
   RECENT
========================= */

function renderRecentOrders(){

  const container =
  document.getElementById("recentOrders");

  const recent = allOrders.slice(0,5);

  container.innerHTML = recent.map(o => `

    <div class="mini-card">
      <h4>${o.name}</h4>
      <p>${o.service}</p>
    </div>

  `).join("");

}

function renderRecentDevelopers(){

  const container =
  document.getElementById("recentDevelopers");

  const recent =
  allDevelopers
  .filter(d => d.status === "accepted")
  .slice(0,5);

  container.innerHTML = recent.map(d => `

    <div class="mini-card">
      <h4>${d.name}</h4>
      <p>${d.skill}</p>
    </div>

  `).join("");

}

/* =========================
   STATS
========================= */

function updateStats(){

  document.getElementById("ordersCount")
  .innerText = allOrders.length;

  document.getElementById("devCount")
  .innerText = allDevelopers.length;

  document.getElementById("approvedCount")
  .innerText =
  allOrders.filter(o => o.status === "approved").length +
  allDevelopers.filter(d => d.status === "accepted").length;

  document.getElementById("rejectedCount")
  .innerText =
  allOrders.filter(o => o.status === "rejected").length +
  allDevelopers.filter(d => d.status === "rejected").length;

  loadAnalytics();

}

/* =========================
   ANALYTICS
========================= */

function loadAnalytics(){

  const canvas =
  document.getElementById("analyticsChart");

  if(!canvas) return;

  const ctx = canvas.getContext("2d");

  if(analyticsChart){
    analyticsChart.destroy();
  }

  analyticsChart = new Chart(ctx, {

    type:"bar",

    data:{

      labels:[
        "Orders",
        "Developers",
        "Approved",
        "Rejected"
      ],

      datasets:[{
        label:"Analytics",

        data:[
          allOrders.length,
          allDevelopers.length,

          allOrders.filter(o =>
          o.status === "approved").length,

          allOrders.filter(o =>
          o.status === "rejected").length
        ]
      }]
    },

    options:{
      responsive:true
    }

  });

}

/* =========================
   SEARCH
========================= */

document.getElementById("searchInput")
.addEventListener("input",(e)=>{

  const value =
  e.target.value.toLowerCase();

  renderOrders(

    allOrders.filter(o =>
      o.name.toLowerCase()
      .includes(value)
    )

  );

  renderDevelopers(

    allDevelopers.filter(d =>
      d.name.toLowerCase()
      .includes(value)
    )

  );

});


document.getElementById("approvedBtn")
.onclick = () => {

  const approvedContainer =
  document.getElementById("approvedList");

  approvedContainer.innerHTML = "";

  const approvedOrders =
  allOrders.filter(o =>
    o.status === "approved"
  );

  const approvedDevs =
  allDevelopers.filter(d =>
    d.status === "accepted"
  );

  approvedContainer.innerHTML +=
  approvedOrders.map(o => `

    <div class="item">
      <h3>${o.name}</h3>
      <p>${o.service}</p>
      <small>Approved Order</small>
    </div>

  `).join("");

  approvedContainer.innerHTML +=
  approvedDevs.map(d => `

    <div class="item">
      <h3>${d.name}</h3>
      <p>${d.skill}</p>
      <small>Accepted Developer</small>
    </div>

  `).join("");

  showSection(sections.approved);

};

document.getElementById("rejectedBtn")
.onclick = () => {

  const rejectedContainer =
  document.getElementById("rejectedList");

  rejectedContainer.innerHTML = "";

  const rejectedOrders =
  allOrders.filter(o =>
    o.status === "rejected"
  );

  const rejectedDevs =
  allDevelopers.filter(d =>
    d.status === "rejected"
  );

  rejectedContainer.innerHTML +=
  rejectedOrders.map(o => `

    <div class="item">
      <h3>${o.name}</h3>
      <p>${o.service}</p>
      <small>Rejected Order</small>
    </div>

  `).join("");

  rejectedContainer.innerHTML +=
  rejectedDevs.map(d => `

    <div class="item">
      <h3>${d.name}</h3>
      <p>${d.skill}</p>
      <small>Rejected Developer</small>
    </div>

  `).join("");

  showSection(sections.rejected);

};

/* =========================
   VIEW SWITCHING
========================= */

const pageTitle =
document.getElementById("pageTitle");

const dashboardView =
document.getElementById("dashboardView");

const ordersView =
document.getElementById("ordersView");

const developersView =
document.getElementById("developersView");

const approvedView =
document.getElementById("approvedView");

const rejectedView =
document.getElementById("rejectedView");

function hideViews(){

  dashboardView.style.display = "none";
  ordersView.style.display = "none";
  developersView.style.display = "none";
  approvedView.style.display = "none";
  rejectedView.style.display = "none";

}

function showView(view){

  hideViews();

  view.style.display = "block";

}

/* =========================
   SIDEBAR BUTTONS
========================= */

document.getElementById("dashboardBtn")
.onclick = () => {

  pageTitle.innerText = "Dashboard";

  showView(dashboardView);

};

document.getElementById("ordersBtn")
.onclick = () => {

  pageTitle.innerText = "Orders";

  showView(ordersView);

};

document.getElementById("developersBtn")
.onclick = () => {

  pageTitle.innerText = "Developers";

  showView(developersView);

};

document.getElementById("approvedBtn")
.onclick = () => {

  pageTitle.innerText = "Approved";

  const approvedContainer =
  document.getElementById("approvedList");

  approvedContainer.innerHTML = "";

  const approvedOrders =
  allOrders.filter(o =>
    o.status === "approved"
  );

  const approvedDevs =
  allDevelopers.filter(d =>
    d.status === "accepted"
  );

  approvedContainer.innerHTML +=
  approvedOrders.map(o => `
    <div class="item">
      <h3>${o.name}</h3>
      <p>${o.service}</p>
      <small>Approved Order</small>
    </div>
  `).join("");

  approvedContainer.innerHTML +=
  approvedDevs.map(d => `
    <div class="item">
      <h3>${d.name}</h3>
      <p>${d.skill}</p>
      <small>Accepted Developer</small>
    </div>
  `).join("");

  showView(approvedView);

};

document.getElementById("rejectedBtn")
.onclick = () => {

  pageTitle.innerText = "Rejected";

  const rejectedContainer =
  document.getElementById("rejectedList");

  rejectedContainer.innerHTML = "";

  const rejectedOrders =
  allOrders.filter(o =>
    o.status === "rejected"
  );

  const rejectedDevs =
  allDevelopers.filter(d =>
    d.status === "rejected"
  );

  rejectedContainer.innerHTML +=
  rejectedOrders.map(o => `
    <div class="item">
      <h3>${o.name}</h3>
      <p>${o.service}</p>
      <small>Rejected Order</small>
    </div>
  `).join("");

  rejectedContainer.innerHTML +=
  rejectedDevs.map(d => `
    <div class="item">
      <h3>${d.name}</h3>
      <p>${d.skill}</p>
      <small>Rejected Developer</small>
    </div>
  `).join("");

  showView(rejectedView);

};

window.approveOrder = async (id) => {

  await updateDoc(
    doc(db,"orders",id),
    {
      status:"approved"
    }
  );

};

window.rejectOrder = async (id) => {

  await updateDoc(
    doc(db,"orders",id),
    {
      status:"rejected"
    }
  );

};

window.acceptDev = async (
  id,
  email,
  name
) => {

  await updateDoc(
    doc(db,"developers",id),
    {
      status:"accepted"
    }
  );

  emailjs.init("N9VA5XSXq7FpHO8Tc");
  await emailjs.send(
    "service_l643f6d",
    "template_wz38zsa",
    {
      name,
      email
    }
  );

};

window.rejectDev = async (
  id,
  email,
  name
) => {

  await updateDoc(
    doc(db,"developers",id),
    {
      status:"rejected"
    }
  );

  emailjs.init("O36tGYSsch_6D37XK");
  await emailjs.send(
    "service_30h4w0q",
    "template_w0ruy8r",
    {
      name,
      email
    }
  );

};