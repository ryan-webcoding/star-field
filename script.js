const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const maxParticles = 100;
const mouse = { x: null, y: null, radius: 100 };

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = (Math.random() * 5 + 2) * 0.4;
    this.speedX = (Math.random() - 0.5) * 0.1;
    this.speedY = (Math.random() - 0.5) * 0.1;
    this.life = Math.random() * 1000 + 1000;

    // 6% chance to be stationary
    if (Math.random() < 0.1) {
      this.speedX = 0;
      this.speedY = 0;
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let dx = mouse.x - p.x;
    let dy = mouse.y - p.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius) {
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / mouse.radius})`;
      ctx.lineWidth = 3 - (distance / mouse.radius) * 2;
      ctx.stroke();
    }
  }
}

function createParticles() {
  if (particles.length < maxParticles) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.draw();
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  connectParticles();
  createParticles();
  requestAnimationFrame(animate);
}

canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

canvas.addEventListener("click", () => {
  for (let p of particles) {
    let dx = mouse.x - p.x;
    let dy = mouse.y - p.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius) {
      p.speedX += dx / 20;
      p.speedY += dy / 20;
    }
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

animate();
