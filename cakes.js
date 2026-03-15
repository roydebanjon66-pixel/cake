/* ============================================================
   CAKES PAGE — JavaScript
   ============================================================ */

'use strict';

// ===================== NAVBAR SCROLL =====================
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ===================== HAMBURGER MENU =====================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// ===================== SCROLL REVEAL =====================
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ===================== CATEGORY FILTER =====================
const filterBtns = document.querySelectorAll('.filter-btn');
const menuSections = document.querySelectorAll('.menu-section');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    menuSections.forEach(section => {
      const cat = section.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        section.style.display = '';
        section.style.animation = 'fadeInUp 0.5s ease';
      } else {
        section.style.display = 'none';
      }
    });

    // Smooth scroll to first visible section
    const firstVisible = document.querySelector('.menu-section:not([style*="none"])');
    if (firstVisible) {
      setTimeout(() => {
        firstVisible.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  });
});

// ===================== SCROLL TO TOP =====================
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===================== CARD RIPPLE =====================
document.querySelectorAll('.btn-order, .overlay-order-btn, .btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;border-radius:50%;
      width:${size}px;height:${size}px;
      left:${e.clientX-rect.left-size/2}px;
      top:${e.clientY-rect.top-size/2}px;
      background:rgba(255,255,255,0.25);
      transform:scale(0);animation:rippleAnim 0.6s ease-out;
      pointer-events:none;
    `;
    if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Inject ripple keyframe
const rs = document.createElement('style');
rs.textContent = `@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }`;
document.head.appendChild(rs);

// ===================== FLOATING SOCIAL — HIDE ON SCROLL UP =====================
let lastScrollY = window.scrollY;
const floatingSocials = document.getElementById('floatingSocials');

if (floatingSocials) {
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 300) {
      floatingSocials.style.opacity = '0.5';
      floatingSocials.style.transform = 'scale(0.9)';
    } else {
      floatingSocials.style.opacity = '1';
      floatingSocials.style.transform = 'scale(1)';
    }
    lastScrollY = currentY;
  }, { passive: true });
}

console.log('🎂 Our Cakes page loaded — La Maison Dorée');
