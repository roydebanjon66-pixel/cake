/* ============================================================
   LA MAISON DORÉE — Premium Bakery JavaScript
   ============================================================ */

'use strict';

// ===================== LOADER =====================
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    // trigger hero reveal
    document.querySelectorAll('.hero [data-reveal]').forEach(el => {
      el.classList.add('revealed');
    });
  }, 1800);
});

// ===================== NAVBAR =====================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const updateActiveLink = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY + 120 >= sec.offsetTop) {
      current = sec.getAttribute('id');
    }
  });
  navLinkEls.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', updateActiveLink, { passive: true });

// ===================== REVEAL ON SCROLL =====================
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => {
  if (!el.closest('.hero')) {
    revealObserver.observe(el);
  }
});

// ===================== COUNTER ANIMATION =====================
const counters = document.querySelectorAll('.stat-num[data-count]');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      const duration = 1800;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      };
      requestAnimationFrame(update);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => countObserver.observe(c));

// ===================== REVIEWS SLIDER =====================
const reviewsTrack = document.getElementById('reviewsTrack');
const reviewPrev = document.getElementById('reviewPrev');
const reviewNext = document.getElementById('reviewNext');
const reviewDotsContainer = document.getElementById('reviewDots');

const cards = reviewsTrack.querySelectorAll('.review-card');
let reviewIndex = 0;
let cardsPerView = getCardsPerView();
let maxIndex = cards.length - cardsPerView;
let isAutoPlaying = true;

function getCardsPerView() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function buildDots() {
  reviewDotsContainer.innerHTML = '';
  const numDots = Math.ceil(cards.length / cardsPerView);
  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement('button');
    dot.className = 'review-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToReview(i));
    reviewDotsContainer.appendChild(dot);
  }
  updateDots();
}

function updateDots() {
  const dots = reviewDotsContainer.querySelectorAll('.review-dot');
  const currentDot = Math.floor(reviewIndex / cardsPerView);
  dots.forEach((d, i) => d.classList.toggle('active', i === currentDot));
}

function goToReview(page) {
  reviewIndex = Math.min(page * cardsPerView, maxIndex);
  applySlide();
}

function applySlide() {
  const cardWidth = cards[0].offsetWidth + 24; // 24 = gap
  reviewsTrack.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;
  updateDots();
}

function nextReview() {
  reviewIndex = reviewIndex >= maxIndex ? 0 : reviewIndex + 1;
  applySlide();
}

function prevReview() {
  reviewIndex = reviewIndex <= 0 ? maxIndex : reviewIndex - 1;
  applySlide();
}

reviewNext.addEventListener('click', () => { nextReview(); stopAutoPlay(); });
reviewPrev.addEventListener('click', () => { prevReview(); stopAutoPlay(); });

let autoPlayInterval;
function startAutoPlay() {
  autoPlayInterval = setInterval(nextReview, 4000);
}
function stopAutoPlay() {
  clearInterval(autoPlayInterval);
  isAutoPlaying = false;
}

// Touch/swipe support for mobile
let touchStartX = 0;
reviewsTrack.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

reviewsTrack.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    diff > 0 ? nextReview() : prevReview();
    stopAutoPlay();
  }
});

window.addEventListener('resize', () => {
  cardsPerView = getCardsPerView();
  maxIndex = cards.length - cardsPerView;
  reviewIndex = Math.min(reviewIndex, maxIndex);
  buildDots();
  applySlide();
});

buildDots();
startAutoPlay();

// ===================== CUSTOM ORDER FORM =====================
const customOrderForm = document.getElementById('customOrderForm');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

customOrderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const occasion = document.getElementById('cakeType').value;
  const date = document.getElementById('deliveryDate').value;

  if (!name || !phone || !occasion || !date) {
    showToast('Please fill in all required fields ✍️');
    highlightEmptyFields();
    return;
  }

  // Simulate form submission
  const btn = document.getElementById('submitOrderBtn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending...';

  setTimeout(() => {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send My Order Request';
    customOrderForm.reset();
    showToast(`🎂 Order request sent! We'll call you within 2 hours, ${name}!`);
  }, 1500);
});

function highlightEmptyFields() {
  const required = customOrderForm.querySelectorAll('[required]');
  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#e55';
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      }, { once: true });
    }
  });
}

// Set min date on delivery date picker
const deliveryDateInput = document.getElementById('deliveryDate');
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
deliveryDateInput.min = tomorrow.toISOString().split('T')[0];

// ===================== SCROLL TO TOP =====================
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================== GALLERY LIGHTBOX =====================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const label = item.querySelector('.gallery-hover span')?.textContent || '';
    openLightbox(img.src, img.alt, label);
  });
});

let lightboxEl = null;

function openLightbox(src, alt, caption) {
  if (lightboxEl) lightboxEl.remove();

  lightboxEl = document.createElement('div');
  lightboxEl.className = 'lightbox';
  lightboxEl.innerHTML = `
    <div class="lightbox-inner">
      <button class="lightbox-close" aria-label="Close">✕</button>
      <img src="${src}" alt="${alt}" />
      ${caption ? `<p class="lightbox-caption">${caption}</p>` : ''}
    </div>
  `;

  lightboxEl.style.cssText = `
    position: fixed; inset: 0; background: rgba(45,30,26,0.92);
    display: flex; align-items: center; justify-content: center;
    z-index: 9000; padding: 24px; cursor: zoom-out;
    animation: fadeIn 0.3s ease;
  `;

  const inner = lightboxEl.querySelector('.lightbox-inner');
  inner.style.cssText = `
    position: relative; max-width: 800px; width: 100%;
    animation: scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  `;

  const imgEl = lightboxEl.querySelector('img');
  imgEl.style.cssText = `
    width: 100%; border-radius: 16px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.4);
    display: block;
  `;

  const closeBtn = lightboxEl.querySelector('.lightbox-close');
  closeBtn.style.cssText = `
    position: absolute; top: -16px; right: -16px;
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--brown); color: var(--white);
    border: none; font-size: 1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    z-index: 1;
  `;

  const captionEl = lightboxEl.querySelector('.lightbox-caption');
  if (captionEl) {
    captionEl.style.cssText = `
      text-align: center; color: rgba(255,246,233,0.8);
      font-family: 'Playfair Display', serif; font-style: italic;
      font-size: 1.1rem; margin-top: 16px;
    `;
  }

  document.body.appendChild(lightboxEl);
  document.body.style.overflow = 'hidden';

  const closeLightbox = () => {
    lightboxEl.style.animation = 'fadeOut 0.2s ease forwards';
    setTimeout(() => {
      lightboxEl?.remove();
      lightboxEl = null;
      document.body.style.overflow = '';
    }, 200);
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightboxEl.addEventListener('click', (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  }, { once: true });
}

// Lightbox keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
  @keyframes scaleIn { from { transform: scale(0.85); opacity: 0 } to { transform: scale(1); opacity: 1 } }
`;
document.head.appendChild(style);

// ===================== HERO PARALLAX =====================
const heroImg = document.getElementById('heroCakeImg');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (heroImg && scrolled < window.innerHeight) {
    heroImg.style.transform = `translateY(${scrolled * 0.06}px)`;
  }
}, { passive: true });

// ===================== CAKE CARD RIPPLE EFFECT =====================
document.querySelectorAll('.btn-order, .btn-offer, .btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const existing = this.querySelector('.ripple');
    if (existing) existing.remove();

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute; border-radius: 50%;
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top: ${e.clientY - rect.top - size/2}px;
      background: rgba(255,255,255,0.25);
      transform: scale(0); animation: rippleAnim 0.6s ease-out;
      pointer-events: none;
    `;
    const st = this.style.position;
    if (!st || st === 'static') this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }`;
document.head.appendChild(rippleStyle);

console.log('🎂 La Maison Dorée — Bakery Website Loaded Successfully!');
