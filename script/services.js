const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener("resize",()=>{
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
const particles = [];
for(let i=0;i<100;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    vx:(Math.random()-.5)*0.4,
    vy:(Math.random()-.5)*0.4
  });
}
function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x += p.vx;
    p.y += p.vy;
    if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.fillStyle = "rgba(255,255,255,.5)";
    ctx.fillRect(p.x,p.y,2,2);
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

const services = {
  "UI/UX Design":{

  description:
  "Modern user interface and experience design focused on usability, interaction, accessibility and premium visual systems that improve how users interact with digital products.",

  hasPages:false,

  types:{

    "Website UI Design":{

      description:
      "Modern website interface systems designed for businesses, startups, portfolios and digital platforms with focus on aesthetics, usability and responsive interaction.",

      base:150,

      complexity:{
        basic:0,
        standard:70,
        advanced:130
      }

    },

    "APP UI Design":{

      description:
      "Mobile application interface design optimized for smooth user flow, accessibility, interaction systems and mobile-first experiences.",

      base:300,

      complexity:{
        basic:0,
        standard:80,
        advanced:150
      }

    },

    "Dashboard UI Design":{

      description:
      "Professional dashboard and admin interface design for analytics systems, SaaS platforms, management systems and enterprise applications.",

      base:240,

      complexity:{
        basic:0,
        standard:50,
        advanced:100
      }

    },

    "Design System":{

      description:
      "Complete reusable design language including typography, components, spacing systems, UI standards and scalable interface architecture.",

      base:500,

      complexity:{
        basic:0,
        standard:150,
        advanced:350
      }

    }

  },

  features:{

    "Wireframing":{

      description:
      "Low-fidelity structural layouts used to plan user flow, content arrangement and interface organization before full visual design begins.",

      base:50,

      complexity:{
        basic:0,
        standard:20,
        advanced:70
      }

    },

    "Interactive Prototypes":{

      description:
      "Clickable and animated prototypes that simulate real product behavior for testing, demonstrations and user validation.",

      base:100,

      complexity:{
        basic:0,
        standard:40,
        advanced:110
      }

    },

    "User Research":{

      description:
      "Research into user behavior, expectations, pain points and interaction patterns to improve usability and experience decisions.",

      base:150,

      complexity:{
        basic:0,
        standard:70,
        advanced:130
      }

    },

    "Design Systems":{

      description:
      "Reusable UI component systems and visual standards that ensure consistency across products, interfaces and future scaling.",

      base:250,

      complexity:{
        basic:0,
        standard:120,
        advanced:300
      }

    },

    "Accessibility Optimization":{

      description:
      "Improves usability for all users including accessibility standards for contrast, readability, keyboard navigation and assistive technologies.",

      base:120,

      complexity:{
        basic:0,
        standard:50,
        advanced:140
      }

    },

    "Micro Interactions":{

      description:
      "Small responsive animations and interface reactions that improve user engagement and make the experience feel more polished and alive.",

      base:90,

      complexity:{
        basic:0,
        standard:35,
        advanced:100
      }

    },

    "Mobile Optimization":{

      description:
      "Optimizes layouts, responsiveness and interactions specifically for smartphones and smaller touch-screen devices.",

      base:80,

      complexity:{
        basic:0,
        standard:30,
        advanced:90
      }

    }

  }

},

"Web Solutions":{

  description:
  "Professional websites built for startups, brands, organizations and businesses with focus on performance, scalability, security and modern user experience.",

  hasPages:true,

  types:{

    "Landing Page":{

      description:
      "Single-page marketing website focused on conversions, advertising campaigns, product launches and lead generation.",

      base:70,

      pageIncrease:0,

      complexity:{
        basic:0,
        standard:60,
        advanced:100
      }

    },

    "Portfolio Website":{

      description:
      "Professional portfolio website designed to showcase projects, achievements, services, skills or creative work.",

      base:250,

      pageIncrease:0,

      complexity:{
        basic:0,
        standard:100,
        advanced:180
      }

    },

    "Business Website":{

      description:
      "Corporate or business-focused website with multiple sections, professional branding and scalable business functionality.",

      base:600,

      pageIncrease:0,

      complexity:{
        basic:0,
        standard:340,
        advanced:700
      }

    },

    "E-Commerce Website":{

      description:
      "Online store platform with product management, shopping cart systems, payment processing and customer ordering functionality.",

      base:1200,

      pageIncrease:0,

      complexity:{
        basic:0,
        standard:800,
        advanced:1500
      }

    },

    "Custom Web Platform":{

      description:
      "Fully customized website or platform built around unique business logic, workflows, branding and advanced functionality.",

      base:1800,

      pageIncrease:50,

      complexity:{
        basic:0,
        standard:900,
        advanced:2500
      }

    }

  },

  features:{

    "Animation-heavy Frontend":{

      description:
      "Advanced UI animations, transitions and interactive effects that create a premium modern browsing experience.",

      base:80,

      pageIncrease:15,

      complexity:{
        basic:0,
        standard:30,
        advanced:80
      }

    },

    "Authentication System":{

      description:
      "Secure user login, registration, password management and account protection system.",

      base:50,

      pageIncrease:5,

      complexity:{
        basic:0,
        standard:40,
        advanced:80
      }

    },

    "Admin Dashboard":{

      description:
      "Private management interface for controlling users, content, analytics, orders and website operations.",

      base:100,

      pageIncrease:10,

      complexity:{
        basic:0,
        standard:60,
        advanced:150
      }

    },

    "Payment Integration":{

      description:
      "Secure payment processing integration using systems like Stripe, Paystack or Flutterwave.",

      base:30,

      pageIncrease:0,

      complexity:{
        basic:0,
        standard:30,
        advanced:60
      }

    },

    "Dark Mode":{

      description:
      "Allows users to switch between light and dark visual themes for improved accessibility and user preference.",

      base:30,

      pageIncrease:0,

      complexity:{
        basic:0,
        standard:10,
        advanced:20
      }

    },

    "Performance Optimization":{

      description:
      "Improves loading speed, responsiveness and overall performance using advanced optimization techniques.",

      base:40,

      pageIncrease:5,

      complexity:{
        basic:0,
        standard:50,
        advanced:90
      }

    },

    "Analytics Integration":{

      description:
      "Tracks user behavior, traffic, engagement and website performance using analytics systems.",

      base:22,

      pageIncrease:0,

      complexity:{
        basic:0,
        standard:45,
        advanced:70
      }

    },

    "Email Integration":{

      description:
      "Automated email systems for notifications, confirmations, alerts, subscriptions and communication workflows.",

      base:44,

      pageIncrease:0,

      complexity:{
        basic:0,
        standard:32,
        advanced:66
      }

    },

    "SSL Setup":{

      description:
      "Secure HTTPS encryption setup to protect user data and establish website trust and security.",

      base:50,

      pageIncrease:0,

      complexity:{
        basic:0,
        standard:20,
        advanced:40
      }

    },

    "Booking System":{

      description:
      "Scheduling and appointment management system for reservations, consultations and service bookings.",

      base:160,

      pageIncrease:20,

      complexity:{
        basic:0,
        standard:70,
        advanced:120
      }

    },

    "Blog System":{

      description:
      "Integrated blogging platform for publishing articles, updates, content marketing and SEO growth.",

      base:70,

      pageIncrease:10,

      complexity:{
        basic:0,
        standard:30,
        advanced:60
      }

    },

    "Responsive Design":{

      description:
      "Ensures the website adapts perfectly across desktop, tablet and mobile devices.",

      base:50,

      pageIncrease:10,

      complexity:{
        basic:0,
        standard:15,
        advanced:40
      }

    },

    "SEO Optimization":{

      description:
      "Improves visibility and ranking on search engines through technical and structural optimization.",

      base:80,

      pageIncrease:10,

      complexity:{
        basic:0,
        standard:30,
        advanced:90
      }

    },

    "CMS Integration":{

      description:
      "Content management system integration allowing easy content editing without coding knowledge.",

      base:120,

      pageIncrease:15,

      complexity:{
        basic:0,
        standard:50,
        advanced:150
      }

    },

    "Multi-Language Support":{

      description:
      "Adds multilingual functionality so users can access the website in multiple languages.",

      base:120,

      pageIncrease:20,

      complexity:{
        basic:0,
        standard:60,
        advanced:180
      }

    },

    "Maintenance Plan (/month)":{

      description:
      "Ongoing website maintenance including updates, bug fixes, monitoring and technical support.",

      base:20,

      pageIncrease:0,

      complexity:{
        basic:0,
        standard:20,
        advanced:50
      }

    },

    "Bot Protection":{

      description:
      "Protection systems against spam bots, automated attacks, abuse attempts and malicious traffic.",

      base:90,

      pageIncrease:5,

      complexity:{
        basic:0,
        standard:40,
        advanced:120
      }

    }

  }

},
  "Web Applications":{

  description:
  "Advanced web-based platforms and systems built for scalability, realtime interaction, business operations and complex digital experiences.",

  hasPages:false,

  types:{

    "Dashboard System":{

      description:
      "Data-driven management systems with analytics, monitoring tools, charts and administrative controls.",

      base:500,

      complexity:{
        basic:0,
        standard:120,
        advanced:300
      }

    },

    "SaaS Platform":{

      description:
      "Cloud-based software platforms designed for subscriptions, scalability, multi-user access and recurring business services.",

      base:1000,

      complexity:{
        basic:0,
        standard:300,
        advanced:800
      }

    },

    "Admin Panel":{

      description:
      "Administrative control interfaces for managing users, content, permissions and application operations.",

      base:320,

      complexity:{
        basic:0,
        standard:80,
        advanced:200
      }

    },

    "Social Platform":{

      description:
      "Interactive social systems with user profiles, feeds, realtime messaging and engagement features.",

      base:2300,

      complexity:{
        basic:0,
        standard:700,
        advanced:1800
      }

    },

    "Marketplace Platform":{

      description:
      "Multi-vendor or commercial platforms for buying, selling, transactions and digital commerce ecosystems.",

      base:3000,

      complexity:{
        basic:0,
        standard:900,
        advanced:2500
      }

    }

  },

  features:{

    "Authentication":{

      description:
      "Secure user registration, login systems and account authentication workflows.",

      base:200,

      complexity:{
        basic:0,
        standard:60,
        advanced:150
      }

    },

    "Dashboards":{

      description:
      "Interactive data dashboards with analytics, reports, visualizations and management tools.",

      base:250,

      complexity:{
        basic:0,
        standard:80,
        advanced:220
      }

    },

    "Realtime Features":{

      description:
      "Live functionality such as realtime messaging, notifications, synchronization and updates.",

      base:300,

      complexity:{
        basic:0,
        standard:120,
        advanced:400
      }

    },

    "API Integration":{

      description:
      "Integration with third-party services, APIs and external digital platforms.",

      base:180,

      complexity:{
        basic:0,
        standard:60,
        advanced:180
      }

    },

    "Notifications":{

      description:
      "In-app, push or email notification systems for alerts, activity and updates.",

      base:130,

      complexity:{
        basic:0,
        standard:40,
        advanced:100
      }

    },

    "File Uploads":{

      description:
      "Allows users to upload images, documents, videos and other digital assets securely.",

      base:100,

      complexity:{
        basic:0,
        standard:30,
        advanced:80
      }

    },

    "Payment Methods":{

      description:
      "Integrated digital payment systems supporting online transactions and subscriptions.",

      base:280,

      complexity:{
        basic:0,
        standard:100,
        advanced:250
      }

    },

    "2FA":{

      description:
      "Two-factor authentication for additional account and platform security.",

      base:100,

      complexity:{
        basic:0,
        standard:40,
        advanced:120
      }

    },

    "Role-Based Access Control":{

      description:
      "Permission and access systems that assign different capabilities to different user roles.",

      base:100,

      complexity:{
        basic:0,
        standard:50,
        advanced:180
      }

    },

    "Cloud Deployment":{

      description:
      "Deployment and hosting infrastructure using scalable cloud systems and environments.",

      base:120,

      complexity:{
        basic:0,
        standard:60,
        advanced:200
      }

    },

    "Data Backup & Recovery":{

      description:
      "Automated backup systems and recovery solutions to protect platform data and continuity.",

      base:150,

      complexity:{
        basic:0,
        standard:80,
        advanced:220
      }

    }

  }

},

"Software":{

  description:
  "Custom software systems built for desktop, enterprise and operational environments with focus on performance, scalability and workflow optimization.",

  hasPages:false,

  types:{

    "Desktop Software":{

      description:
      "Standalone desktop applications designed for productivity, utilities or business operations.",

      base:600,

      complexity:{
        basic:0,
        standard:180,
        advanced:500
      }

    },

    "Management System":{

      description:
      "Business and organizational systems used to manage workflows, records, operations and users.",

      base:500,

      complexity:{
        basic:0,
        standard:140,
        advanced:400
      }

    },

    "Enterprise Software":{

      description:
      "Large-scale enterprise-grade systems built for organizations, institutions and complex operations.",

      base:1000,

      complexity:{
        basic:0,
        standard:400,
        advanced:1200
      }

    }

  },

  features:{

    "Custom Systems":{

      description:
      "Tailored software logic and functionality built around unique business or operational requirements.",

      base:300,

      complexity:{
        basic:0,
        standard:120,
        advanced:350
      }

    },

    "Backend APIs":{

      description:
      "Server-side APIs and communication layers for applications, integrations and services.",

      base:220,

      complexity:{
        basic:0,
        standard:80,
        advanced:240
      }

    },

    "Database Architecture":{

      description:
      "Structured database systems optimized for scalability, security and performance.",

      base:250,

      complexity:{
        basic:0,
        standard:100,
        advanced:300
      }

    },

    "Multi-user System":{

      description:
      "Support for multiple users, accounts, permissions and collaborative workflows.",

      base:400,

      complexity:{
        basic:0,
        standard:180,
        advanced:500
      }

    },

    "Offline Functionality":{

      description:
      "Allows software to function without internet connection and sync data when reconnected.",

      base:150,

      complexity:{
        basic:0,
        standard:70,
        advanced:250
      }

    },

    "License Management":{

      description:
      "Software licensing, activation and usage control systems.",

      base:100,

      complexity:{
        basic:0,
        standard:40,
        advanced:120
      }

    }

  }

},

"Automation":{

  description:
  "Automation systems designed to reduce repetitive work, optimize workflows and improve operational efficiency using intelligent digital processes.",

  hasPages:false,

  types:{

    "Workflow Automation":{

      description:
      "Automated task pipelines and workflow systems that streamline repetitive business processes.",

      base:250,

      complexity:{
        basic:0,
        standard:80,
        advanced:200
      }

    },

    "Bot Systems":{

      description:
      "Automated bots for communication, monitoring, assistance and digital interaction tasks.",

      base:300,

      complexity:{
        basic:0,
        standard:100,
        advanced:300
      }

    },

    "Data Automation":{

      description:
      "Systems that automate data processing, collection, organization and synchronization.",

      base:350,

      complexity:{
        basic:0,
        standard:120,
        advanced:350
      }

    }

  },

  features:{

    "Bots":{

      description:
      "Automated bots designed for tasks such as messaging, moderation, monitoring or customer interaction.",

      base:180,

      complexity:{
        basic:0,
        standard:60,
        advanced:180
      }

    },

    "Workflows":{

      description:
      "Structured automation pipelines that execute repetitive tasks automatically.",

      base:150,

      complexity:{
        basic:0,
        standard:50,
        advanced:140
      }

    },

    "Integrations":{

      description:
      "Connects multiple services, tools or platforms together into a unified automated system.",

      base:200,

      complexity:{
        basic:0,
        standard:80,
        advanced:220
      }

    },

    "Scheduling Systems":{

      description:
      "Automated scheduling systems for tasks, reminders, events and timed workflows.",

      base:170,

      complexity:{
        basic:0,
        standard:60,
        advanced:180
      }

    },

    "AI Automation":{

      description:
      "AI-powered automation systems capable of intelligent processing, decision-making and advanced workflows.",

      base:400,

      complexity:{
        basic:0,
        standard:300,
        advanced:1000
      }

    },

    "Web Scraping Systems":{

      description:
      "Automated systems that extract, collect and organize information from websites and online sources.",

      base:250,

      complexity:{
        basic:0,
        standard:100,
        advanced:350
      }

    }

  }

},

"Cybersecurity":{

  description:
  "Cybersecurity services focused on protecting systems, applications, networks and organizations against digital threats, attacks and vulnerabilities.",

  hasPages:false,

  types:{

    "Penetration Testing":{

      description:
      "Simulated cyberattacks designed to identify weaknesses and security vulnerabilities in systems or applications.",

      base:600,

      complexity:{
        basic:0,
        standard:220,
        advanced:700
      }

    },

    "Security Audit":{

      description:
      "Comprehensive security reviews of infrastructure, applications, policies and operational security practices.",

      base:450,

      complexity:{
        basic:0,
        standard:150,
        advanced:450
      }

    },

    "Threat Analysis":{

      description:
      "Investigation and analysis of threats, attack vectors, risks and suspicious activities affecting systems.",

      base:600,

      complexity:{
        basic:0,
        standard:200,
        advanced:650
      }

    },

    "Vulnerability Assessment":{

      description:
      "Identification, analysis and prioritization of weaknesses across systems and digital infrastructure.",

      base:600,

      complexity:{
        basic:0,
        standard:180,
        advanced:550
      }

    }

  },

  features:{

    "Network Scanning":{

      description:
      "Scanning and mapping of networks to identify exposed services, weaknesses and attack surfaces.",

      base:200,

      complexity:{
        basic:0,
        standard:70,
        advanced:180
      }

    },

    "Threat Monitoring":{

      description:
      "Continuous monitoring systems designed to detect suspicious behavior and security threats.",

      base:250,

      complexity:{
        basic:0,
        standard:100,
        advanced:300
      }

    },

    "Malware Analysis":{

      description:
      "Investigation and behavioral analysis of malicious software, payloads and cyber threats.",

      base:360,

      complexity:{
        basic:0,
        standard:150,
        advanced:450
      }

    },

    "Security Reports":{

      description:
      "Detailed technical reports outlining findings, risks, vulnerabilities and remediation recommendations.",

      base:100,

      complexity:{
        basic:0,
        standard:30,
        advanced:80
      }

    },

    "Incident Response":{

      description:
      "Rapid response and containment procedures for cybersecurity incidents, attacks and breaches.",

      base:600,

      complexity:{
        basic:0,
        standard:250,
        advanced:800
      }

    },

    "Employee Security Training":{

      description:
      "Security awareness and cybersecurity education programs for employees and organizational staff.",

      base:500,

      complexity:{
        basic:0,
        standard:180,
        advanced:500
      }

    },

    "Security Hardening":{

      description:
      "Strengthening systems, servers and applications against vulnerabilities and attack attempts.",

      base:180,

      complexity:{
        basic:0,
        standard:80,
        advanced:250
      }

    },

    "SIEM Integration":{

      description:
      "Security Information and Event Management integration for centralized monitoring and threat analysis.",

      base:600,

      complexity:{
        basic:0,
        standard:400,
        advanced:1500
      }

    },

    "Web Application Security Testing":{

      description:
      "Security testing for web applications to identify vulnerabilities such as XSS, SQL injection and authentication flaws.",

      base:300,

      complexity:{
        basic:0,
        standard:150,
        advanced:500
      }

    }

  }

}
};
// ================= STATE =================

let selectedService = "";

let selectedType = "";

let selectedFeatures = new Set();

let complexityLevel = "basic";

let pageCount = 1;
// ================= ELEMENTS =================

const panel =
document.getElementById("panel");

const title =
document.getElementById("title");

const controls =
document.getElementById("controls");

const featuresDiv =
document.getElementById("features");

const priceEl =
document.getElementById("price");

const serviceDescription =
document.getElementById("serviceDescription");

const typeDescription =
document.getElementById("typeDescription");

document.querySelectorAll(".card").forEach(card => {

  if(card.classList.contains("coming")) return;

  card.onclick = () => {

    selectedService =
    card.dataset.service.trim();

    if(!services[selectedService]){

      console.error(
        "Service not found:",
        selectedService
      );

      return;

    }

    selectedFeatures.clear();

    selectedType = "";

    complexityLevel = "basic";

    pageCount = 1;

    panel.style.display = "flex";

    title.innerText =
    selectedService;

    serviceDescription.innerText =
    services[selectedService].description || "";

    typeDescription.innerText = "";

    controls.innerHTML = "";

    featuresDiv.innerHTML = "";

    // ================= PAGE INPUT =================

    if(services[selectedService].hasPages){

      controls.innerHTML += `

        <div class="control-box">

          <label>
            Number of Pages
          </label>

          <input
            type="number"
            min="1"
            value="1"
            id="pageCountInput"
          >

        </div>

      `;

    }

    // ================= TYPES =================

    controls.innerHTML += `

      <div class="control-box">

        <label>
          Type
        </label>

        <div class="pills">

          ${Object.entries(
            services[selectedService].types || {}
          ).map(([name]) => `

            <div
              class="pill type-pill"
              data-name="${name}"
            >

              <span class="dot"></span>

              ${name}

            </div>

          `).join("")}

        </div>

      </div>

    `;

    // ================= COMPLEXITY =================

    controls.innerHTML += `

      <div class="control-box">

        <label>
          Complexity
        </label>

        <div class="pills">

          <div
            class="pill complexity-pill active"
            data-level="basic"
          >
            Basic
          </div>

          <div
            class="pill complexity-pill"
            data-level="standard"
          >
            Standard
          </div>

          <div
            class="pill complexity-pill"
            data-level="advanced"
          >
            Advanced
          </div>

        </div>

      </div>

    `;

    // ================= FEATURES =================

    featuresDiv.innerHTML = `
      <h3>Features</h3>
    `;

    Object.entries(
      services[selectedService].features || {}
    ).forEach(([name, data]) => {

      const feature =
      document.createElement("div");

      feature.className = "feature";

      feature.dataset.name = name;

      feature.innerHTML = `

        <div class="feature-header">

          <div class="feature-left">

            <div class="feature-name">
              ${name}
            </div>

            <div class="feature-description">
              ${data?.description || ""}
            </div>

          </div>

          <div class="feature-price">
          </div>

        </div>

      `;

      feature.onclick = () => {

        const active =
        feature.classList.toggle("active");

        if(active){

          selectedFeatures.add(name);

        }else{

          selectedFeatures.delete(name);

        }

        updatePrice();

      };

      featuresDiv.appendChild(feature);

    });

    // ================= EVENT BINDING =================

    setTimeout(() => {

      // PAGE INPUT

      const pageInput =
      document.getElementById("pageCountInput");

      if(pageInput){

        pageInput.oninput = e => {

          pageCount =
          parseInt(e.target.value) || 1;

          updateTypePrices();

          updateFeaturePrices();

          updatePrice();

        };

      }

      // TYPE SELECTION

      document.querySelectorAll(".type-pill")
      .forEach(pill => {

        pill.onclick = () => {

          document.querySelectorAll(".type-pill")
          .forEach(p =>
            p.classList.remove("active")
          );

          pill.classList.add("active");

          selectedType =
          pill.dataset.name;

          const typeData =
          services[selectedService]
          .types[selectedType];

          typeDescription.innerText =
          typeData?.description || "";

          updatePrice();

        };

      });

      // COMPLEXITY

      document.querySelectorAll(
        ".complexity-pill"
      ).forEach(pill => {

        pill.onclick = () => {

          document.querySelectorAll(
            ".complexity-pill"
          ).forEach(p =>
            p.classList.remove("active")
          );

          pill.classList.add("active");

          complexityLevel =
          pill.dataset.level;

          updateTypePrices();

          updateFeaturePrices();

          updatePrice();

        };

      });

    },0);

    updateTypePrices();

    updateFeaturePrices();

    updatePrice();

  };

});

// ================= TYPE PRICES =================

function updateTypePrices(){

  document.querySelectorAll(".type-pill")
  .forEach(pill => {

    const typeData =
    services[selectedService]
    ?.types?.[pill.dataset.name];

    if(!typeData) return;

    let price =
    typeData.base || 0;

    if(services[selectedService].hasPages){

      const extra =
      Math.max(pageCount - 1,0);

      price +=
      extra *
      (typeData.pageIncrease || 0);

    }

    price +=
    typeData.complexity
    ?. [complexityLevel] || 0;

    pill.innerHTML = `

      <span class="dot"></span>

      ${pill.dataset.name}

      ($${Math.floor(price)})

    `;

  });

}

// ================= FEATURE PRICES =================

function updateFeaturePrices(){

  document.querySelectorAll(".feature")
  .forEach(feature => {

    const data =
    services[selectedService]
    ?.features?.[feature.dataset.name];

    if(!data) return;

    let price =
    data.base || 0;

    if(services[selectedService].hasPages){

      const extra =
      Math.max(pageCount - 1,0);

      price +=
      extra *
      (data.pageIncrease || 0);

    }

    price +=
    data.complexity
    ?. [complexityLevel] || 0;

    const featurePrice =
    feature.querySelector(
      ".feature-price"
    );

    if(featurePrice){

      featurePrice.innerText =
      `$${Math.floor(price)}`;

    }

  });

}

// ================= TOTAL PRICE =================

function updatePrice(){

  let total = 0;

  if(selectedType){

    const typeData =
    services[selectedService]
    ?.types?.[selectedType];

    if(typeData){

      let price =
      typeData.base || 0;

      if(services[selectedService].hasPages){

        const extra =
        Math.max(pageCount - 1,0);

        price +=
        extra *
        (typeData.pageIncrease || 0);

      }

      price +=
      typeData.complexity
      ?. [complexityLevel] || 0;

      total += price;

    }

  }

  document.querySelectorAll(
    ".feature.active"
  ).forEach(feature => {

    const data =
    services[selectedService]
    ?.features?.[feature.dataset.name];

    if(!data) return;

    let price =
    data.base || 0;

    if(services[selectedService].hasPages){

      const extra =
      Math.max(pageCount - 1,0);

      price +=
      extra *
      (data.pageIncrease || 0);

    }

    price +=
    data.complexity
    ?. [complexityLevel] || 0;

    total += price;

  });

  priceEl.innerText =
  `$${Math.floor(total)}`;

}

// ================= CLOSE PANEL =================

document.getElementById("close")
.onclick = () => {

  panel.style.display = "none";

};

// ================= ORDER =================

document.getElementById("order")
.onclick = () => {

  const features =
  [...selectedFeatures].join(", ");

  window.location.href =

  `contact.html?service=${selectedService}
  &price=${priceEl.innerText.replace(/\D/g,"")}
  &features=${features}
  &type=${selectedType}
  &pages=${pageCount}
  &complexity=${complexityLevel}
  &autoclient=true`;

};