import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// CANVAS COFFEE PARTICLES
// ============================================
const canvas = document.getElementById('coffee-particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class CoffeeBean {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.size = Math.random() * 4 + 2;
    this.speedY = Math.random() * 1 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.twinkle = Math.random() * Math.PI * 2;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.twinkle += 0.05;

    if (this.y > canvas.height) {
      this.reset();
    }

    if (this.x < 0 || this.x > canvas.width) {
      this.speedX *= -1;
    }
  }

  draw() {
    const twinkleOpacity = this.opacity + Math.sin(this.twinkle) * 0.2;
    ctx.fillStyle = `rgba(255, 107, 53, ${twinkleOpacity})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 107, 53, 0.8)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

const coffeeBeans = [];
for (let i = 0; i < 80; i++) {
  coffeeBeans.push(new CoffeeBean());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  coffeeBeans.forEach(bean => {
    bean.update();
    bean.draw();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

// Hero scroll indicator
document.querySelector('.scroll-indicator').addEventListener('click', () => {
  document.querySelector('#our-coffee').scrollIntoView({ behavior: 'smooth' });
});

// Coffee beans falling into cup animation
gsap.set('.coffee-bean', { opacity: 0, y: -100 });
gsap.set('.coffee-cup', { opacity: 0, scale: 0 });

ScrollTrigger.create({
  trigger: '#our-coffee',
  start: 'top center',
  onEnter: () => {
    // Cup appears first
    gsap.to('.coffee-cup', {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });

    // Beans fall into cup one by one
    gsap.to('.coffee-bean', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'bounce.out',
      delay: 0.5
    });
  }
});

// Recipe cards animation
gsap.set('.recipe-card', { opacity: 0, y: 50 });

ScrollTrigger.create({
  trigger: '#recipes',
  start: 'top center',
  onEnter: () => {
    gsap.to('.recipe-card', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }
});

// Order form animation
gsap.set('.order-form', { opacity: 0, y: 50 });

ScrollTrigger.create({
  trigger: '#order',
  start: 'top center',
  onEnter: () => {
    gsap.to('.order-form', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
});

// ============================================
// FORM SUBMISSION WITH CONFETTI
// ============================================
const form = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');
const submitBtn = document.querySelector('.submit-btn');

function createConfetti(x, y) {
  const colors = ['#ff6b35', '#f7931e', '#ffd700', '#fff', '#ff1744'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    document.body.appendChild(confetti);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 300 + 200;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 200;

    gsap.to(confetti, {
      x: vx,
      y: vy,
      opacity: 0,
      rotation: Math.random() * 720 - 360,
      duration: 1.5,
      ease: 'power2.out',
      onComplete: () => confetti.remove()
    });
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const rect = submitBtn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // Button animation
  gsap.to(submitBtn, {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      createConfetti(x, y);
      
      // Show success message
      form.style.display = 'none';
      successMessage.classList.remove('hidden');

      // Reset form after 3 seconds
      setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        successMessage.classList.add('hidden');
      }, 3000);
    }
  });
});

// ============================================
// SMOOTH SCROLL & PARALLAX EFFECTS
// ============================================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const stars = document.querySelector('.stars');
  
  if (stars) {
    stars.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Add hover effect to recipe cards
const recipeCards = document.querySelectorAll('.recipe-card');
recipeCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card.querySelector('.recipe-icon'), {
      rotation: 360,
      duration: 0.6,
      ease: 'back.out(1.7)'
    });
  });
});

console.log('☕ Cosmic Coffee Shop initialized!');