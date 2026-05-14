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
    description: "Modern user interface and experience design focused on usability, aesthetics and interaction systems.",
    hasPages: false,
    types:{
      "Website UI Design":{
        base: 150,
        complexity:{
          basic: 0,
          standard: 70,
          advanced: 130
        }
      },
      "APP UI Design":{
        base: 300,
        complexity:{
          basic: 0,
          standard: 80,
          advanced: 150
        }
      },
      "Dashboard UI Design":{
        base: 240,
        complexity:{
          basic: 0,
          standard: 50,
          advanced: 100
        }
      }
    },
    features:{
      "Wireframing":{
        description: "Low-fidelity layout planning to structure user flow and page design",
        base: 50,
        complexity:{
          basic: 0,
          standard: 20,
          advanced: 70
        }
      },
      "Interactive Prototypes":{
        description: "Clickable design prototypes that simulate real app or website behavior.",
        base: 100,
        complexity:{
          basic: 0,
          standard: 40,
          advanced: 110
        }
      },
      "User Research":{
        description: "Analysis of user behavior, needs and expectations to guide design decisions.",
        base: 150,
        complexity:{
          basic: 0,
          standard: 70,
          advanced: 130
        }
      }
    }
  },
  "Web Solutions":{
        description: "Professional Websites built for businesses, startups, brands and online presence.",
    hasPages:true,
    types:{
      "Landing Page":{
        base:70,
        pageIncrease:0,
        complexity:{
          basic:0,
          standard:60,
          advanced:100
        }
      },
      "Portfolio Website":{
        base:250,
        pageIncrease:0,
        complexity:{
          basic:0,
          standard:100,
          advanced:180
        }
      },
      "Business Website":{
        base:600,
        pageIncrease:0,
        complexity:{
          basic:0,
          standard:340,
          advanced:700
        }
      },
      "E-Commerce Website":{
        base:1200,
        pageIncrease:0,
        complexity:{
          basic:0,
          standard:800,
          advanced:1500
        }
      }
    },
    features:{
      "Animation-heavy Frontend":{
        description: "Smooth, modern UI animations and interactive elements that make the website feel premium and alive.",
        base:80,
        pageIncrease:15,
        complexity:{
          basic:0,
          standard:30,
          advanced:80
        }
      },
      "Authentication System":{
        description: "Secure login/signup system for users, including session handling and account protection.",
        base:50,
        pageIncrease:5,
        complexity:{
          basic:0,
          standard:40,
          advanced:80
        }
      },
      "Admin Dashboard":{
        description: "Private control panel for managing users, content, orders or business data.",
        base:100,
        pageIncrease:10,
        complexity:{
          basic:0,
          standard:60,
          advanced:150
        }
      },
      "Payment Integration":{
        description: "Integration of secure payment gateways for online transactions and checkout systems.",
        base:30,
        pageIncrease:0,
        complexity:{
          basic:0,
          standard:30,
          advanced:60
        }
      },
      "Dark Mode":{
        description: "Theme toggle allowing users to switch between light and dark interface styles.",
        base:30,
        pageIncrease:0,
        complexity:{
          basic:0,
          standard:10,
          advanced:20
        }
      },
      "Performance Optimization":{
        description: "Speed improvements like caching, compression, lazy loading and code optimization.",
        base:40,
        pageIncrease:5,
        complexity:{
          basic:0,
          standard:50,
          advanced:90
        }
      },
      "Analytics Integration":{
        description: "Tracking system setup to monitor user behavior and traffic.",
        base:22,
        pageIncrease:0,
        complexity:{
          basic:0,
          standard:45,
          advanced:70
        }
      },
      "Email Integration":{
        description: "Sending and receiving automated emails like confirmations, alerts and notifications.",
        base:44,
        pageIncrease:0,
        complexity:{
          basic:0,
          standard:32,
          advanced:66
        }
      },
      "SSL Setup":{
        description: "Secure HTTPS setup to encrypt data and protect users.",
        base:50,
        pageIncrease:0,
        complexity:{
          basic:0,
          standard:20,
          advanced:40
        }
      },
      "Booking System":{
        description: "Scheduling system for appointments, reservations or service bookings.",
        base:160,
        pageIncrease:20,
        complexity:{
          basic:0,
          standard:70,
          advanced:120
        }
      },
      "Blog System":{
        description: "Blog System for articles, updates and SEO-driven posts.",
        base:70,
        pageIncrease:10,
        complexity:{
          basic:0,
          standard:30,
          advanced:60
        }
      },
      "Responsive Design":{
        description: "Ensure the website works perfectly across mobile, tablet and desktop devices.",
        base:50,
        pageIncrease:10,
        complexity:{
          basic:0,
          standard:15,
          advanced:40
        }
      },
      "SEO Optimization":{
        description: "Search engine optimization to improve visibility on search engines.",
        base:80,
        pageIncrease:10,
        complexity:{
          basic:0,
          standard:30,
          advanced:90
        }
      },
      "CMS Integration":{
        description: "Content management system setup for easy editing without coding.",
        base:120,
        pageIncrease:15,
        complexity:{
          basic:0,
          standard:50,
          advanced:150
        }
      },
      "Multi-Language Support":{
        description: "Enables the website to support multiple languages for global users.",
        base:120,
        pageIncrease:20,
        complexity:{
          basic:0,
          standard:60,
          advanced:180
        }
      },
      "Maintenance Plan (/month)":{
        description: "Ongoing updates, bug fixes and performance monitoring after launch.",
        base:20,
        pageIncrease:0,
        complexity:{
          basic:0,
          standard:20,
          advanced:50
        }
      },
      "Bot Protection":{
        description: "Security layer to block spam bots, scrapers and automated attacks.",
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
    hasPages:false,
    types:{
      "Dashboard System":{
        base:500,
        complexity:{
          basic:0,
          standard:120,
          advanced:300
        }
      },
      "SaaS Platform":{
        base:1000,
        complexity:{
          basic:0,
          standard:300,
          advanced:800
        }
      },
      "Admin Panel":{
        base:320,
        complexity:{
          basic:0,
          standard:80,
          advanced:200
        }
      },
      "Social Platform":{
        base:2300,
        complexity:{
          basic:0,
          standard:700,
          advanced:1800
        }
      },
      "Marketplace Platform":{
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
        base:200,
        complexity:{
          basic:0,
          standard:60,
          advanced:150
        }
      },
      "Dashboards":{
        base:250,
        complexity:{
          basic:0,
          standard:80,
          advanced:220
        }
      },
      "Realtime Features":{
        base:300,
        complexity:{
          basic:0,
          standard:120,
          advanced:400
        }
      },
      "API Integration":{
        base:180,
        complexity:{
          basic:0,
          standard:60,
          advanced:180
        }
      },
      "Notifications":{
        base:130,
        complexity:{
          basic:0,
          standard:40,
          advanced:100
        }
      },
      "File Uploads":{
        base:100,
        complexity:{
          basic:0,
          standard:30,
          advanced:80
        }
      },
      "Payment Methods":{
        base:280,
        complexity:{
          basic:0,
          standard:100,
          advanced:250
        }
      },
      "2FA":{
        base:100,
        complexity:{
          basic:0,
          standard:40,
          advanced:120
        }
      },
      "Role-Based Access Control":{
        base:100,
        complexity:{
          basic:0,
          standard:50,
          advanced:180
        }
      },
      "Cloud Deployment":{
        base:120,
        complexity:{
          basic:0,
          standard:60,
          advanced:200
        }
      },
      "Data Backup & Recovery":{
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
    hasPages:false,
    types:{
      "Desktop Software":{
        base:600,
        complexity:{
          basic:0,
          standard:180,
          advanced:500
        }
      },
      "Management System":{
        base:500,
        complexity:{
          basic:0,
          standard:140,
          advanced:400
        }
      },
      "Enterprise Software":{
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
        base:300,
        complexity:{
          basic:0,
          standard:120,
          advanced:350
        }
      },
      "Backend APIs":{
        base:220,
        complexity:{
          basic:0,
          standard:80,
          advanced:240
        }
      },
      "Database Architecture":{
        base:250,
        complexity:{
          basic:0,
          standard:100,
          advanced:300
        }
      },
      "Multi-user System":{
        base:400,
        complexity:{
          basic:0,
          standard:180,
          advanced:500
        }
      },
      "Offline Functionality":{
        base:150,
        complexity:{
          basic:0,
          standard:70,
          advanced:250
        }
      },
      "License Management":{
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
    hasPages:false,
    types:{
      "Workflow Automation":{
        base:250,
        complexity:{
          basic:0,
          standard:80,
          advanced:200
        }
      },
      "Bot Systems":{
        base:300,
        complexity:{
          basic:0,
          standard:100,
          advanced:300
        }
      },
      "Data Automation":{
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
        base:180,
        complexity:{
          basic:0,
          standard:60,
          advanced:180
        }
      },
      "Workflows":{
        base:150,
        complexity:{
          basic:0,
          standard:50,
          advanced:140
        }
      },
      "Integrations":{
        base:200,
        complexity:{
          basic:0,
          standard:80,
          advanced:220
        }
      },
      "Scheduling Systems":{
        base:170,
        complexity:{
          basic:0,
          standard:60,
          advanced:180
        }
      },
      "AI Automation":{
        base:400,
        complexity:{
          basic:0,
          standard:300,
          advanced:1000
        }
      },
      "Web Scraping Systems":{
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
    hasPages:false,
    types:{
      "Penetration Testing":{
        base:600,
        complexity:{
          basic:0,
          standard:220,
          advanced:700
        }
      },
      "Security Audit":{
        base:450,
        complexity:{
          basic:0,
          standard:150,
          advanced:450
        }
      },
      "Threat Analysis":{
        base:600,
        complexity:{
          basic:0,
          standard:200,
          advanced:650
        }
      },
      "Vulnerability Assessment":{
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
        base:200,
        complexity:{
          basic:0,
          standard:70,
          advanced:180
        }
      },
      "Threat Monitoring":{
        base:250,
        complexity:{
          basic:0,
          standard:100,
          advanced:300
        }
      },
      "Malware Analysis":{
        base:360,
        complexity:{
          basic:0,
          standard:150,
          advanced:450
        }
      },
      "Security Reports":{
        base:100,
        complexity:{
          basic:0,
          standard:30,
          advanced:80
        }
      },
      "Incident Response":{
        base:600,
        complexity:{
          basic:0,
          standard:250,
          advanced:800
        }
      },
      "Employee Security Training":{
        base:500,
        complexity:{
          basic:0,
          standard:180,
          advanced:500
        }
      },
      "Security Hardening":{
        base:180,
        complexity:{
          basic:0,
          standard:80,
          advanced:250
        }
      },
      "SIEM Integration":{
        base:600,
        complexity:{
          basic:0,
          standard:400,
          advanced:1500
        }
      },
      "Web Application Security Testing":{
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
// ================= ELEMENTS =================
const panel = document.getElementById("panel");
const title = document.getElementById("title");
const controls = document.getElementById("controls");
const featuresDiv = document.getElementById("features");
const priceEl = document.getElementById("price");
const serviceDescription =
document.getElementById("serviceDescription");
const typeDescription =
document.getElementById("typeDescription");
// ================= STATE =================
let selectedService = "";
let selectedType = "";
let selectedFeatures = new Set();
let complexityLevel = "basic";
let pageCount = 1;
// ================= OPEN SERVICE CARD =================
document.querySelectorAll(".card").forEach(card => {
  if(card.classList.contains("coming")) return;
  card.onclick = () => {
    selectedService = card.dataset.service;
    // safety check (THIS FIXES YOUR ISSUE)
    if(!services[selectedService]){
      console.error("Service not found:", selectedService);
      return;
    }
    selectedFeatures.clear();
    selectedType = "";
    complexityLevel = "basic";
    pageCount = 1;
    // ================= SHOW PANEL =================
    panel.style.display = "flex";
    title.innerText = selectedService;
    serviceDescription.innerText =
    services[selectedService]?.description || "";
    typeDescription.innerText = "";
    controls.innerHTML = "";
    featuresDiv.innerHTML = "";
    // ================= PAGE INPUT =================
    if(services[selectedService].hasPages){
      controls.innerHTML += `
        <div class="control-box">
          <label>Number of Pages</label>
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
        <label>Type</label>
        <div class="pills">
          ${
            Object.entries(
              services[selectedService].types || {}
            ).map(([name]) => `
              <div class="pill type-pill" data-name="${name}">
                <span class="dot"></span>
                ${name}
              </div>
            `).join("")
          }
        </div>
      </div>
    `;
    // ================= COMPLEXITY =================
    controls.innerHTML += `
      <div class="control-box">
        <label>Complexity</label>
        <div class="pills">
          <div class="pill complexity-pill active" data-level="basic">
            Basic
          </div>
          <div class="pill complexity-pill" data-level="standard">
            Standard
          </div>
          <div class="pill complexity-pill" data-level="advanced">
            Advanced
          </div>
        </div>
      </div>
    `;
    // ================= FEATURES =================
    featuresDiv.innerHTML = `<h3>Features</h3>`;
    Object.entries(
      services[selectedService].features || {}
    ).forEach(([name, data]) => {
      const feature = document.createElement("div");
      feature.className = "feature";
      feature.dataset.name = name;
      feature.innerHTML = `
        <div class="feature-top">
          <div class="feature-name">${name}</div>
          <div class="feature-price"></div>
        </div>
        <div class="feature-description">
          ${data?.description || ""}
        </div>
      `;
      feature.onclick = () => {
        feature.classList.toggle("active");
        if(selectedFeatures.has(name)){
          selectedFeatures.delete(name);
        } else {
          selectedFeatures.add(name);
        }
        updatePrice();
      };
      featuresDiv.appendChild(feature);
    });
    // ================= EVENT BINDING =================
    setTimeout(() => {
      // page input
      const pageInput = document.getElementById("pageCountInput");
      if(pageInput){
        pageInput.oninput = e => {
          pageCount = parseInt(e.target.value) || 1;
          updateTypePrices();
          updateFeaturePrices();
          updatePrice();
        };
      }
      // type selection
      document.querySelectorAll(".type-pill").forEach(pill => {
        pill.onclick = () => {
          document.querySelectorAll(".type-pill")
          .forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          selectedType = pill.dataset.name;
          const typeData =
          services[selectedService].types[selectedType];
          typeDescription.innerText =
          typeData?.description || "";
          updatePrice();
        };
      });
      // complexity
      document.querySelectorAll(".complexity-pill").forEach(pill => {
        pill.onclick = () => {
          document.querySelectorAll(".complexity-pill")
          .forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          complexityLevel = pill.dataset.level;
          updateTypePrices();
          updateFeaturePrices();
          updatePrice();
        };
      });
    }, 0);
    updateTypePrices();
    updateFeaturePrices();
    updatePrice();
  };
});
// ================= TYPE PRICES =================
function updateTypePrices(){
  document.querySelectorAll(".type-pill").forEach(pill => {
    const typeData =
    services[selectedService]?.types?.[pill.dataset.name];
    if(!typeData) return;
    let price = typeData.base || 0;
    if(services[selectedService].hasPages){
      const extra = Math.max(pageCount - 1, 0);
      price += extra * (typeData.pageIncrease || 0);
    }
    price += typeData.complexity?.[complexityLevel] || 0;
    pill.innerHTML = `
      <span class="dot"></span>
      ${pill.dataset.name} ($${Math.floor(price)})
    `;
  });
}
// ================= FEATURE PRICES =================
function updateFeaturePrices(){
  document.querySelectorAll(".feature").forEach(feature => {
    const data =
    services[selectedService]?.features?.[feature.dataset.name];
    if(!data) return;
    let price = data.base || 0;
    if(services[selectedService].hasPages){
      const extra = Math.max(pageCount - 1, 0);
      price += extra * (data.pageIncrease || 0);
    }
    price += data.complexity?.[complexityLevel] || 0;
    const priceEl = feature.querySelector(".feature-price");
    if(priceEl){
      priceEl.innerText = `$${Math.floor(price)}`;
    }
  });
}
// ================= TOTAL PRICE =================
function updatePrice(){
  let total = 0;
  if(selectedType){
    const typeData =
    services[selectedService]?.types?.[selectedType];
    if(typeData){
      let price = typeData.base || 0;
      if(services[selectedService].hasPages){
        const extra = Math.max(pageCount - 1, 0);
        price += extra * (typeData.pageIncrease || 0);
      }
      price += typeData.complexity?.[complexityLevel] || 0;
      total += price;
    }
  }
  document.querySelectorAll(".feature.active").forEach(feature => {
    const data =
    services[selectedService]?.features?.[feature.dataset.name];
    if(!data) return;
    let price = data.base || 0;
    if(services[selectedService].hasPages){
      const extra = Math.max(pageCount - 1, 0);
      price += extra * (data.pageIncrease || 0);
    }
    price += data.complexity?.[complexityLevel] || 0;
    total += price;
  });
  priceEl.innerText = `$${Math.floor(total)}`;
}
// ================= CLOSE =================
document.getElementById("close").onclick = () => {
  panel.style.display = "none";
};
// ================= ORDER =================
document.getElementById("order").onclick = () => {
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