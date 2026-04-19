/* ─── Custom cursor ───────────────────────────────────────── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let cx = -100, cy = -100;
  let rafCursor = false;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    if (!rafCursor) {
      rafCursor = true;
      requestAnimationFrame(() => {
        cursorDot.style.left  = cx + 'px';
        cursorDot.style.top   = cy + 'px';
        cursorRing.style.left = cx + 'px';
        cursorRing.style.top  = cy + 'px';
        rafCursor = false;
      });
    }
  });

  const hoverTargets = 'a, button, .bear--center, input, textarea, .work-item__thumb, .service-card';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ─── Nav: scroll state + mobile toggle ───────────────────── */
const nav     = document.getElementById('nav');
const burger  = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ─── Scroll-reveal ───────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.service-card, .work-item, .stat, .about__text, .about__image, .contact__left, .contact__form'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revealObserver.observe(el);
});

/* ─── Stats counter animation ─────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat__number').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);

/* ─── Mascot spotlight — lerp + distance brightness ──────── */
(function () {
  const mascotEl  = document.getElementById('mascot');
  const heroEl    = document.querySelector('.hero');
  if (!mascotEl || !heroEl) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if ( window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const dimEl    = mascotEl.querySelector('.mascot__dim');
  const brightEl = mascotEl.querySelector('.mascot__bright');
  const glowEl   = mascotEl.querySelector('.mascot__glow');

  let rawX = 0, rawY = 0;
  let lerpX = 0, lerpY = 0;
  let inHero = false;
  let hasReset = false;

  function smoothstep(lo, hi, x) {
    const t = Math.max(0, Math.min(1, (x - lo) / (hi - lo)));
    return t * t * (3 - 2 * t);
  }

  heroEl.addEventListener('mouseenter', (e) => {
    inHero = true;
    hasReset = false;
    /* Seed lerp at entry position so there's no pop-in */
    rawX = lerpX = e.clientX;
    rawY = lerpY = e.clientY;
  });

  heroEl.addEventListener('mousemove', (e) => {
    rawX = e.clientX;
    rawY = e.clientY;
  });

  heroEl.addEventListener('mouseleave', () => { inHero = false; });

  function tick() {
    if (inHero) {
      /* Lerp toward raw cursor — trail factor 0.15 */
      lerpX += (rawX - lerpX) * 0.15;
      lerpY += (rawY - lerpY) * 0.15;

      const rect = mascotEl.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;

      /* Distance from lerped cursor to center-bear center */
      const dist = Math.sqrt((lerpX - cx) ** 2 + (lerpY - cy) ** 2);

      /* proximity: 1 = cursor at center, 0 = cursor far away */
      const proximity = 1 - smoothstep(180, 620, dist);

      /* Mascot-relative percentage (clamped 0-100) for the mask origin */
      const pctX = Math.max(0, Math.min(100, (lerpX - rect.left) / rect.width  * 100));
      const pctY = Math.max(0, Math.min(100, (lerpY - rect.top)  / rect.height * 100));

      mascotEl.style.setProperty('--mouse-x', pctX.toFixed(2) + '%');
      mascotEl.style.setProperty('--mouse-y', pctY.toFixed(2) + '%');

      /* Ambient lift on dim layer: brightens slightly as cursor approaches */
      if (dimEl) {
        const bri = (0.62 + proximity * 0.28).toFixed(3);
        const sat = (0.75 + proximity * 0.25).toFixed(3);
        dimEl.style.filter = `brightness(${bri}) saturate(${sat})`;
      }

      /* Bright spotlight layer opacity — driven by proximity */
      if (brightEl) brightEl.style.opacity = proximity.toFixed(3);

      /* Accent glow opacity — follows proximity */
      if (glowEl) glowEl.style.opacity = (proximity * 0.88).toFixed(3);

    } else if (!hasReset) {
      /* One-shot reset; CSS transitions on filter/opacity carry the fade-out */
      hasReset = true;
      if (dimEl)    dimEl.style.filter    = '';
      if (brightEl) brightEl.style.opacity = '0';
      if (glowEl)   glowEl.style.opacity   = '0';
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}());

/* ─── Contact form (client-side only) ────────────────────── */
const form       = document.querySelector('.contact__form');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  if (!data.name || !data.email || !data.message) {
    formStatus.textContent = 'Please fill in all fields.';
    formStatus.style.color = '#ff8a8a';
    return;
  }

  // Swap button state while "sending"
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    formStatus.textContent = "Thanks! We'll be in touch soon.";
    formStatus.style.color = '';
    form.reset();
    btn.textContent = 'Send It';
    btn.disabled = false;
  }, 1200);
});
