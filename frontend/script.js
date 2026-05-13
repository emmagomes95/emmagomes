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
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .work-card, .pill, .edu__card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
  });
}

/* ══════════════════════════════
   2. NAV SCROLL BEHAVIOUR
══════════════════════════════ */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('navHamburger');
const drawer = document.getElementById('navDrawer');

window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  drawer.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  drawer.setAttribute('aria-hidden', !isOpen);
});

drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  });
});

/* ══════════════════════════════
   3. GENERAL SCROLL REVEALS (.reveal-up / .reveal-left)
══════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealEls.forEach(el => revealObserver.observe(el));

/* ══════════════════════════════
   4. WORK CARDS — PAIR SLIDE IN (LEFT + RIGHT)
   Rows of 2 slide in together from opposite sides.
══════════════════════════════ */
const workCards = document.querySelectorAll('.work-card');

const pairObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      card.classList.add('in');

      // Animate right-side partner at the same time
      const parent = card.parentElement;
      const siblings = Array.from(parent.children);
      const idx = siblings.indexOf(card);

      if (card.classList.contains('slide-left') && !card.classList.contains('work-card--wide')) {
        const rightPartner = siblings[idx + 1];
        if (rightPartner && rightPartner.classList.contains('slide-right')) {
          setTimeout(() => rightPartner.classList.add('in'), 120);
        }
      }

      pairObserver.unobserve(card);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

workCards.forEach(card => pairObserver.observe(card));

/* ══════════════════════════════
   5. PROJECT MODAL
══════════════════════════════ */
const modal = document.getElementById('projectModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTag = document.getElementById('modalTag');
const modalCourse = document.getElementById('modalCourse');
const modalCounter = document.getElementById('modalCounter');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

// Collect all card data in order
const projectData = Array.from(document.querySelectorAll('.work-card')).map(card => ({
  img: card.dataset.img,
  extraImgs: card.dataset.extraImgs ? card.dataset.extraImgs.split(',') : [],
  title: card.dataset.title,
  desc: card.dataset.desc,
  tag: card.dataset.tag,
  course: card.dataset.course,
  alt: card.querySelector('.work-card__img')?.alt || ''
}));

let currentIdx = 0;

function openModal(idx) {
  currentIdx = idx;
  populateModal(idx);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function populateModal(idx) {
  const p = projectData[idx];
  if (!p) return;

  // Fade image swap
  const imgContainer = document.querySelector('.modal__img-wrap');
  imgContainer.style.opacity = '0';
  imgContainer.style.overflowY = 'hidden';

  setTimeout(() => {
    imgContainer.innerHTML = '';
    const thumbContainer = document.getElementById('modalThumbnails');
    if (thumbContainer) thumbContainer.innerHTML = '';

    const allImgs = [p.img];
    if (p.extraImgs && p.extraImgs.length > 0) {
      allImgs.push(...p.extraImgs);
    }

    let currentPhotoIdx = 0;

    const mainImg = document.createElement('img');
    mainImg.src = allImgs[currentPhotoIdx];
    mainImg.alt = p.alt;
    mainImg.className = 'modal__img';
    mainImg.style.transition = 'opacity 0.25s ease-in-out';
    imgContainer.appendChild(mainImg);

    function updateMainImage(idx) {
      currentPhotoIdx = idx;
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = allImgs[currentPhotoIdx];
        mainImg.style.opacity = '1';
      }, 150);

      if (thumbContainer) {
        Array.from(thumbContainer.children).forEach((thumb, i) => {
          if (i === currentPhotoIdx) thumb.classList.add('active');
          else thumb.classList.remove('active');
        });
      }
    }

    if (allImgs.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'modal__carousel-btn modal__carousel-prev';
      prevBtn.setAttribute('aria-label', 'Previous photo');
      prevBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>';

      const nextBtn = document.createElement('button');
      nextBtn.className = 'modal__carousel-btn modal__carousel-next';
      nextBtn.setAttribute('aria-label', 'Next photo');
      nextBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>';

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateMainImage((currentPhotoIdx === 0) ? allImgs.length - 1 : currentPhotoIdx - 1);
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateMainImage((currentPhotoIdx + 1) % allImgs.length);
      });

      imgContainer.appendChild(prevBtn);
      imgContainer.appendChild(nextBtn);

      if (thumbContainer) {
        allImgs.forEach((src, idx) => {
          const thumb = document.createElement('img');
          thumb.src = src;
          thumb.className = 'modal__thumb' + (idx === 0 ? ' active' : '');
          thumb.addEventListener('click', () => {
            if (currentPhotoIdx !== idx) updateMainImage(idx);
          });
          thumbContainer.appendChild(thumb);
        });
      }
    }

    imgContainer.style.opacity = '1';
    imgContainer.style.transition = 'opacity 0.3s';
  }, 150);

  modalTitle.textContent = p.title;
  modalDesc.textContent = p.desc;
  modalTag.textContent = p.tag;
  modalCourse.textContent = p.course;
  modalCounter.textContent = `${idx + 1} / ${projectData.length}`;

  modalPrev.disabled = idx === 0;
  modalNext.disabled = idx === projectData.length - 1;
  modalPrev.style.opacity = idx === 0 ? '0.35' : '1';
  modalNext.style.opacity = idx === projectData.length - 1 ? '0.35' : '1';
}

// ── EVENT LISTENERS on all work cards ──
workCards.forEach((card, idx) => {
  card.addEventListener('click', () => openModal(idx));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(idx);
    }
  });
});

// Close
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Prev / Next
modalPrev.addEventListener('click', () => {
  if (currentIdx > 0) { currentIdx--; populateModal(currentIdx); }
});
modalNext.addEventListener('click', () => {
  if (currentIdx < projectData.length - 1) { currentIdx++; populateModal(currentIdx); }
});

// Keyboard navigation inside modal
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') { if (currentIdx > 0) { currentIdx--; populateModal(currentIdx); } }
  if (e.key === 'ArrowRight') { if (currentIdx < projectData.length - 1) { currentIdx++; populateModal(currentIdx); } }
});

/* ══════════════════════════════
   6. PARALLAX ON HERO IMAGE
══════════════════════════════ */
const heroBgImg = document.querySelector('.hero__bg-img');

function heroParallax() {
  if (!heroBgImg) return;
  const scrollY = window.scrollY;
  const heroH = document.querySelector('.hero')?.offsetHeight || 0;
  if (scrollY < heroH) {
    heroBgImg.style.transform = `scale(1) translateY(${scrollY * 0.28}px)`;
  }
}
window.addEventListener('scroll', heroParallax, { passive: true });

/* ══════════════════════════════
   7. ABOUT PHOTO TRANSITION
══════════════════════════════ */
const aboutSection = document.getElementById('about');
const aboutPhoto = document.getElementById('about-photo');

// Preload images to prevent flickering
const aboutPics = [];
for (let i = 1; i <= 6; i++) {
  const img = new Image();
  img.src = `assets/pictures_${i}.jpg`;
  aboutPics.push(img);
}

if (aboutSection && aboutPhoto) {
  window.addEventListener('scroll', () => {
    const rect = aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // The point where the about section is fully placed at the top (under nav)
    const peakTop = 130;
    let progress = 0;

    if (rect.top >= peakTop) {
      // 1. Entering phase: scrolling until the section hits the peak
      // It will transition from 6 to 1
      const start = windowHeight * 0.75;
      progress = (start - rect.top) / (start - peakTop);
    } else {
      // 2. Leaving phase: scrolling further down past the peak
      // It will transition from 1 back down to 6
      const end = peakTop - (windowHeight * 0.65);
      progress = (rect.top - end) / (peakTop - end);
    }

    // restrict to 0 - 1
    progress = Math.max(0, Math.min(1, progress));

    // progress=0 gives picNum 6
    // progress=1 gives picNum 1
    let index = Math.floor(progress * 5.999);
    let picNum = 6 - index;
    picNum = Math.max(1, Math.min(6, picNum));

    aboutPhoto.src = `assets/pictures_${picNum}.jpg`;
  }, { passive: true });
}

/* ══════════════════════════════
   8. ACTIVE NAV LINK HIGHLIGHT
══════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
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
