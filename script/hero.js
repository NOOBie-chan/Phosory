const canvas = document.getElementById("heroCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let particleCount;
let connectionDistance;
let mouse = { x: null, y: null, radius: 120 };
let scrollFactor = 1;

function getVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

let accent1 = getVar("--accent-1");
let accent2 = getVar("--accent-2");
let bg1 = getVar("--bg-primary");
let bg2 = getVar("--bg-secondary");

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // More balanced density
  const area = window.innerWidth * window.innerHeight;
  particleCount = Math.floor(area /8000);
  connectionDistance = area < 500000 ? 9000 : 12000;
  initParticles();
}
window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("scroll", () => {
  const max = window.innerHeight;
  scrollFactor = Math.max(0.2, 1 - window.scrollY / max);
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
  }
  update() {
    this.x += this.vx * scrollFactor;
    this.y += this.vy * scrollFactor;
    // Mouse interaction
    if (mouse.x && mouse.y) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        let force = (mouse.radius - dist) / mouse.radius;
        let angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * force * 2;
        this.y += Math.sin(angle) * force * 2;
      }
    }
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
  draw() {
    let color = "rgba(255,255,255,0.6)";
    if (mouse.x && mouse.y) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        color = accent1;
      }
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let dist = dx * dx + dy * dy;
      if (dist < connectionDistance) {
        let opacity = (1 - dist / connectionDistance) * scrollFactor;
        ctx.strokeStyle = `rgba(0,255,255,${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

let shift = 0;
function drawBackground() {
  shift += 0.002 * scrollFactor;
  let baseX = canvas.width * (0.5 + Math.sin(shift) * 0.25);
  let baseY = canvas.height * (0.5 + Math.cos(shift) * 0.25);
  let targetX = mouse.x || canvas.width / 2;
  let targetY = mouse.y || canvas.height / 2;
  const influence = 0.08;
  const finalX = baseX + (targetX - baseX) * influence;
  const finalY = baseY + (targetY - baseY) * influence;
  const gradient = ctx.createRadialGradient(
    finalX,
    finalY,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width
  );
  gradient.addColorStop(0, accent1);
  gradient.addColorStop(0.4, bg1);
  gradient.addColorStop(1, accent2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
  drawBackground();
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}
function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
resizeCanvas();
animate();