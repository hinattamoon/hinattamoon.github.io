/* ============================================================
   HINATA MOON — script.js
   ============================================================ */
'use strict';

/* ============================================================
   MODAL SYSTEM
   ============================================================ */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('modal-active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('modal-closing');
  setTimeout(() => {
    modal.classList.remove('modal-active', 'modal-closing');
    document.body.style.overflow = '';
  }, 350);
}

function scrollToTop(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cerrar modal con ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.section-modal.modal-active').forEach(m => closeModal(m.id));
  }
});

/* ============================================================
   SAKURA PETALS con profundidad
   ============================================================ */
function initPetals() {
  const container = document.getElementById('petals-container');
  if (!container) return;

  const COLORS = [
    'rgba(255,0,128,',
    'rgba(200,0,255,',
    'rgba(255,100,180,',
    'rgba(220,50,150,',
    'rgba(180,80,255,',
    'rgba(255,180,220,',
    'rgba(240,120,200,',
  ];

  for (let i = 0; i < 80; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const depth  = Math.random();
    const size   = 5 + depth * 22;
    const dur    = 18 - depth * 10;
    const delay  = Math.random() * 20;
    const left   = Math.random() * 110 - 5;
    const op     = 0.3 + depth * 0.7;
    const blur   = (1 - depth) * 2;
    const color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    const swing  = 40 + depth * 80;

    petal.style.cssText = `
      left:${left}%;
      width:${size}px;
      height:${size * (0.6 + Math.random() * 0.5)}px;
      background:${color}${op});
      box-shadow:0 0 ${size * 1.5}px ${color}${op * 0.6});
      animation-delay:${delay}s;
      animation-duration:${dur}s;
      filter:blur(${blur}px);
      transform:rotate(${Math.random() * 360}deg);
      --swing:${swing}px;
    `;
    container.appendChild(petal);
  }

  if (!document.getElementById('petal-keyframe-style')) {
    const s = document.createElement('style');
    s.id = 'petal-keyframe-style';
    s.textContent = `
      @keyframes petalFall {
        0%   { transform:translateY(0) rotate(0deg) translateX(0); opacity:0; }
        5%   { opacity:1; }
        50%  { transform:translateY(50vh) rotate(400deg) translateX(var(--swing,60px)); }
        95%  { opacity:0.9; }
        100% { transform:translateY(110vh) rotate(900deg) translateX(0); opacity:0; }
      }
    `;
    document.head.appendChild(s);
  }
}

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.pts    = [];
    this.resize();
    this.spawn();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }
  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  spawn() {
    const cols = ['rgba(155,48,255,','rgba(255,0,128,','rgba(0,229,255,','rgba(255,60,160,'];
    for (let i = 0; i < 100; i++) {
      this.pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2 + 0.4,
        vx:(Math.random() - 0.5) * 0.35,
        vy:(Math.random() - 0.5) * 0.35,
        a: Math.random() * 0.6 + 0.1,
        c: cols[Math.floor(Math.random() * cols.length)],
        p: Math.random() * Math.PI * 2,
      });
    }
  }
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.p += 0.018;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
      const a = p.a * (0.5 + 0.5 * Math.sin(p.p));
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = p.c + a + ')';
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = p.c + (a * 0.12) + ')';
      this.ctx.fill();
    });
    for (let i = 0; i < this.pts.length; i++) {
      for (let j = i + 1; j < this.pts.length; j++) {
        const dx   = this.pts[i].x - this.pts[j].x;
        const dy   = this.pts[i].y - this.pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.pts[i].x, this.pts[i].y);
          this.ctx.lineTo(this.pts[j].x, this.pts[j].y);
          this.ctx.strokeStyle = `rgba(155,48,255,${(1 - dist / 80) * 0.07})`;
          this.ctx.lineWidth   = 0.5;
          this.ctx.stroke();
        }
      }
    }
    requestAnimationFrame(() => this.animate());
  }
}

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.style.transition = 'transform .3s ease';
    navbar.style.transform  = (y > lastY && y > 100) ? 'translateY(-100%)' : 'translateY(0)';
    lastY = y;
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  ['.card', '.contacto-inner', '.hero-profile', '.hero-avatar-section', '.sc-section'].forEach((sel, si) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${si * 0.05 + i * 0.1}s`;
    });
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ============================================================
   TITLE GLITCH
   ============================================================ */
function initTitleGlitch() {
  const el = document.querySelector('.title-moon');
  if (!el) return;
  const original = 'MOON';
  function glitch() {
    const chars = '!@#ムーン月光ヒナタ※$%';
    let it = 0;
    const iv = setInterval(() => {
      el.textContent = original.split('').map((c, i) =>
        i < it ? c : chars[Math.floor(Math.random() * chars.length)]
      ).join('');
      if (it >= original.length) { clearInterval(iv); el.textContent = original; }
      it += 0.4;
    }, 40);
  }
  setInterval(glitch, 5000);
  setTimeout(glitch, 1200);
}

/* ============================================================
   PARALLAX
   ============================================================ */
function initParallax() {
  const konoha = document.querySelector('.konoha-symbol');
  window.addEventListener('mousemove', e => {
    const dx = (e.clientX - window.innerWidth / 2)  / window.innerWidth;
    const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    if (konoha) konoha.style.transform = `translate(${dx * 12}px,${dy * 12}px)`;
  });
}

/* ============================================================
   CURSOR TRAIL
   ============================================================ */
function initCursorTrail() {
  const COUNT = 12;
  const trail = [];
  for (let i = 0; i < COUNT; i++) {
    const d = document.createElement('div');
    const size = 6 - i * 0.3;
    d.style.cssText = `
      position:fixed; pointer-events:none; z-index:9998; border-radius:50%;
      width:${size}px; height:${size}px;
      background:rgba(255,0,128,${1 - i / COUNT});
      box-shadow:0 0 ${8 - i}px rgba(255,0,128,${0.8 - i / COUNT});
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(d);
    trail.push({ el: d, x: 0, y: 0 });
  }
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function tick() {
    let lx = mx, ly = my;
    trail.forEach((t, i) => {
      t.x += (lx - t.x) * (1 - i * 0.07);
      t.y += (ly - t.y) * (1 - i * 0.07);
      t.el.style.left = t.x + 'px';
      t.el.style.top  = t.y + 'px';
      lx = t.x; ly = t.y;
    });
    requestAnimationFrame(tick);
  })();
}

/* ============================================================
   SPARK BURST on hover
   ============================================================ */
function initButtonSparks() {
  const COLORS = ['#ff0080', '#9b30ff', '#00e5ff', '#ff3ca0', '#00ff88'];
  document.querySelectorAll('.cta-btn, .card-btn, .nav-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const r = btn.getBoundingClientRect();
      for (let i = 0; i < 5; i++) {
        const spark = document.createElement('div');
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 50;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        spark.style.cssText = `
          position:fixed;
          left:${r.left + r.width / 2}px;
          top:${r.top + r.height / 2}px;
          width:4px; height:4px; border-radius:50%;
          background:${color}; box-shadow:0 0 6px ${color};
          pointer-events:none; z-index:9999;
        `;
        document.body.appendChild(spark);
        requestAnimationFrame(() => {
          spark.style.transition = 'transform .45s ease-out, opacity .45s ease-out';
          spark.style.transform  = `translate(${Math.cos(angle) * speed}px,${Math.sin(angle) * speed}px) scale(0)`;
          spark.style.opacity    = '0';
        });
        setTimeout(() => spark.remove(), 500);
      }
    });
  });
}

/* ============================================================
   AVATAR color cycling
   ============================================================ */
function initAvatarEffect() {
  const outer = document.querySelector('.avatar-outer-ring');
  if (!outer) return;
  const cols = [
    ['var(--magenta)', 'rgba(255,0,128,.5)'],
    ['var(--violet)',  'rgba(155,48,255,.6)'],
    ['var(--cyan)',    'rgba(0,229,255,.4)'],
    ['var(--pink)',    'rgba(255,60,160,.5)'],
  ];
  let ci = 0;
  setInterval(() => {
    ci = (ci + 1) % cols.length;
    outer.style.borderColor = cols[ci][0];
    outer.style.boxShadow   = `0 0 20px ${cols[ci][1]},0 0 40px ${cols[ci][1]},inset 0 0 20px ${cols[ci][1]}`;
  }, 2000);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPetals();
  initNavbar();
  initScrollReveal();
  initTitleGlitch();
  initParallax();
  initCursorTrail();
  initButtonSparks();
  initAvatarEffect();

  const canvas = document.getElementById('particles-canvas');
  if (canvas) new ParticleSystem(canvas);
});
