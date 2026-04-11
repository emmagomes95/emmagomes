/* ═══════════════════════════════════════════════════════════════
   Emma Gomes · Architecture Portfolio · script.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════ */
const cursor = document.getElementById('cursor');

if (window.matchMedia('(hover: hover)').matches && cursor) {
  let mx = -100, my = -100;
  let cx = -100, cy = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animateCursor() {
    // Lerp for smooth follow
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .pill, .edu__card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
  });
}

/* ══════════════════════════════
   2. NAV scroll behaviour
══════════════════════════════ */
const nav       = document.getElementById('nav');
const hamburger = document.getElementById('navHamburger');
const drawer    = document.getElementById('navDrawer');

window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  drawer.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  drawer.setAttribute('aria-hidden', !isOpen);
});

// Close drawer on link click
drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  });
});

/* ══════════════════════════════
   3. SCROLL-REVEAL (IntersectionObserver)
══════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealEls.forEach(el => revealObserver.observe(el));

/* ══════════════════════════════
   4. SHOWCASE — scroll-driven IMAGE TRANSITIONS
══════════════════════════════ */
const showcase     = document.getElementById('showcase');
const panels       = Array.from(document.querySelectorAll('.showcase__panel'));
const dots         = Array.from(document.querySelectorAll('.dot'));
const progressFill = document.getElementById('showcaseProgressFill');

const TOTAL        = panels.length;
let   activeIndex  = 0;

function activatePanel(idx) {
  if (idx === activeIndex && panels[idx].classList.contains('active')) return;

  panels.forEach((p, i) => {
    p.classList.remove('active', 'prev');
    if (i === activeIndex && i !== idx) p.classList.add('prev');
  });

  dots.forEach((d, i) => {
    const isActive = i === idx;
    d.classList.toggle('dot--active', isActive);
    d.setAttribute('aria-selected', isActive);
  });

  activeIndex = idx;
  panels[idx].classList.add('active');
}

// Initial state
activatePanel(0);

function onScroll() {
  if (!showcase) return;
  const rect     = showcase.getBoundingClientRect();
  const total_h  = showcase.offsetHeight - window.innerHeight;
  const scrolled = Math.max(0, -rect.top);
  const progress = Math.min(1, scrolled / total_h);

  // Drive progress bar
  if (progressFill) progressFill.style.width = (progress * 100) + '%';

  // Which panel?
  const raw = progress * TOTAL;
  const idx = Math.min(TOTAL - 1, Math.floor(raw));
  activatePanel(idx);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

// Dot click: scroll to that panel position
dots.forEach((dot, idx) => {
  dot.addEventListener('click', () => {
    const rect     = showcase.getBoundingClientRect();
    const total_h  = showcase.offsetHeight - window.innerHeight;
    const targetY  = showcase.offsetTop + (idx / TOTAL) * total_h;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});

/* ══════════════════════════════
   5. KEYBOARD NAV in showcase
══════════════════════════════ */
document.addEventListener('keydown', e => {
  // Only trigger when showcase is in viewport
  const rect = showcase.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (!inView) return;

  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    dots[Math.min(activeIndex + 1, TOTAL - 1)]?.click();
    e.preventDefault();
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    dots[Math.max(activeIndex - 1, 0)]?.click();
    e.preventDefault();
  }
});

/* ══════════════════════════════
   6. TOUCH SWIPE for showcase
══════════════════════════════ */
let touchStartY = null;

showcase.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

showcase.addEventListener('touchend', e => {
  if (touchStartY === null) return;
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 40) {
    const next = diff > 0
      ? Math.min(activeIndex + 1, TOTAL - 1)
      : Math.max(activeIndex - 1, 0);
    dots[next]?.click();
  }
  touchStartY = null;
}, { passive: true });

/* ══════════════════════════════
   7. PARALLAX on hero image
══════════════════════════════ */
const heroBgImg = document.querySelector('.hero__bg-img');

function heroParallax() {
  if (!heroBgImg) return;
  const scrollY = window.scrollY;
  const heroH   = document.querySelector('.hero')?.offsetHeight || 0;
  if (scrollY < heroH) {
    heroBgImg.style.transform = `scale(1) translateY(${scrollY * 0.28}px)`;
  }
}

window.addEventListener('scroll', heroParallax, { passive: true });

/* ══════════════════════════════
   8. Active nav link highlight
══════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--clay)';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));
