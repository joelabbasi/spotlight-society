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

  const hoverTargets = 'a, button, .bear--center, input, textarea, .work-item__thumb, .service-card, .di';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ─── Per-item dynamic islands: dock on scroll, open wider on hover (CSS) ─ */
(function initDynamicIslands() {
  const nodes = document.querySelectorAll('.di');
  if (!nodes.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    nodes.forEach((el) => el.classList.add('di-in'));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        obs.unobserve(el);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => el.classList.add('di-in'));
        });
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -5% 0px' }
  );

  nodes.forEach((el) => obs.observe(el));
}());

/* ─── Service cards: stable “open” on pointer devices (avoids :hover flicker during grid reflow) ─ */
(function initServiceCardOpenState() {
  const mm = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!mm.matches) return;

  const OPEN = 'service-card--open';
  const LEAVE_MS = 240;

  document.querySelectorAll('.service-card--expand').forEach((card) => {
    let leaveTimer = null;

    function clearLeaveTimer() {
      if (leaveTimer !== null) {
        window.clearTimeout(leaveTimer);
        leaveTimer = null;
      }
    }

    function openFromPointer() {
      clearLeaveTimer();
      card.classList.add(OPEN);
    }

    function scheduleCloseFromPointer() {
      clearLeaveTimer();
      leaveTimer = window.setTimeout(() => {
        leaveTimer = null;
        if (!card.matches(':focus-within')) card.classList.remove(OPEN);
      }, LEAVE_MS);
    }

    card.addEventListener('mouseenter', openFromPointer);
    card.addEventListener('mouseleave', scheduleCloseFromPointer);

    card.addEventListener('focusout', (e) => {
      if (card.contains(e.relatedTarget)) return;
      clearLeaveTimer();
      window.requestAnimationFrame(() => {
        if (!card.matches(':focus-within')) card.classList.remove(OPEN);
      });
    });
  });
}());

/* ─── Nav: scroll state + mobile toggle ───────────────────── */
const nav      = document.getElementById('nav');
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ─── Scroll-reveal (staggered, studio-style) ─────────────────
   Double rAF before .visible fixes browsers that skip CSS transitions
   when .reveal and .visible land in the same frame. */
function revealElement(el) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('visible');
      const section = el.closest('section');
      if (section) section.classList.add('section--in-view');
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      revealElement(entry.target);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.06,
  rootMargin: '0px 0px -2% 0px',
});

function stagger(el, i, base = 0) {
  el.style.transitionDelay = `${base + (i % 5) * 90}ms`;
}

document.querySelectorAll('.section-intro').forEach((el, i) => {
  el.classList.add('reveal');
  stagger(el, i, 0);
  revealObserver.observe(el);
});

document.querySelectorAll('.service-card').forEach((el, i) => {
  el.classList.add('reveal');
  stagger(el, i, 40);
  revealObserver.observe(el);
});

document.querySelectorAll('.work-item').forEach((el, i) => {
  el.classList.add('reveal', 'reveal--scale');
  stagger(el, i, 60);
  revealObserver.observe(el);
});

document.querySelectorAll('.stat').forEach((el, i) => {
  el.classList.add('reveal');
  stagger(el, i, 30);
  revealObserver.observe(el);
});

document.querySelectorAll('.about__text').forEach((el, i) => {
  el.classList.add('reveal', 'reveal--from-left');
  stagger(el, i, 0);
  revealObserver.observe(el);
});

document.querySelectorAll('.about__image').forEach((el, i) => {
  el.classList.add('reveal', 'reveal--from-right');
  stagger(el, i, 80);
  revealObserver.observe(el);
});

document.querySelectorAll('.contact__left').forEach((el, i) => {
  el.classList.add('reveal', 'reveal--from-left');
  stagger(el, i, 0);
  revealObserver.observe(el);
});

document.querySelectorAll('.contact__form').forEach((el, i) => {
  el.classList.add('reveal', 'reveal--from-right');
  stagger(el, i, 100);
  revealObserver.observe(el);
});

document.querySelectorAll('.footer__inner').forEach((el) => {
  el.classList.add('reveal');
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

/* ─── Hero scroll parallax (studio-style depth while scrolling) ─ */
(function initHeroScrollParallax() {
  const hero = document.querySelector('.hero');
  const head = document.querySelector('.hero-parallax--head');
  const bears = document.getElementById('bearsStage');
  const tag = document.querySelector('.hero-parallax--tag');
  const copy = document.querySelector('.hero-parallax--copy');
  if (!hero) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  let ticking = false;

  function clearParallaxStyles() {
    [head, bears, tag, copy].forEach((el) => {
      if (!el) return;
      el.style.transform = '';
      el.style.opacity = '';
    });
  }

  function update() {
    const scrollY = window.scrollY;
    /* Let CSS entrance animations own transforms until user scrolls */
    if (scrollY < 12) {
      clearParallaxStyles();
      ticking = false;
      return;
    }

    const heroH = hero.offsetHeight || 1;
    const p = Math.min(1, Math.max(0, scrollY / (heroH * 0.5)));
    const ease = p * p;

    if (head) {
      head.style.transform = `translate3d(0, ${ease * 64}px, 0) scale(${1 - ease * 0.045})`;
    }
    if (bears) {
      bears.style.transform = `translate3d(0, ${ease * 96}px, 0)`;
    }
    if (tag) {
      tag.style.transform = `translate3d(0, ${ease * 52}px, 0)`;
    }
    if (copy) {
      copy.style.transform = `translate3d(0, ${ease * 68}px, 0)`;
      copy.style.opacity = String(Math.max(0.78, 1 - ease * 0.22));
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}());

/* ─── Cinematic spotlight — lerp + distance + three layers ─── */
(function () {
  const mascotEl = document.getElementById('mascot');
  const heroEl   = document.querySelector('.hero');
  const beamEl   = document.getElementById('heroBeam');
  if (!mascotEl || !heroEl) return;

  const isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Atmosphere particles ───────────────────────────────── */
  const particlesEl = document.querySelector('.hero__particles');
  if (particlesEl && !reducedMotion) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.setProperty('--x',     (Math.random() * 100).toFixed(1) + '%');
      p.style.setProperty('--delay', (Math.random() * 12).toFixed(2)  + 's');
      p.style.setProperty('--size',  (1 + Math.random() * 2.5).toFixed(1) + 'px');
      p.style.setProperty('--dur',   (8 + Math.random() * 8).toFixed(1)   + 's');
      p.style.setProperty('--alpha', (0.06 + Math.random() * 0.09).toFixed(2));
      p.style.setProperty('--drift', ((Math.random() - 0.5) * 70).toFixed(1) + 'px');
      particlesEl.appendChild(p);
    }
  }

  if (!isPointer || reducedMotion) return;

  const dimEl    = mascotEl.querySelector('.mascot__dim');
  const brightEl = mascotEl.querySelector('.mascot__bright');
  const hotEl    = mascotEl.querySelector('.mascot__hot');

  let rawX = 0, rawY = 0;
  let lerpX = 0, lerpY = 0;
  let inHero = false, hasReset = false;

  function smoothstep(lo, hi, x) {
    const t = Math.max(0, Math.min(1, (x - lo) / (hi - lo)));
    return t * t * (3 - 2 * t);
  }

  heroEl.addEventListener('mouseenter', (e) => {
    inHero = true;
    hasReset = false;
    rawX = lerpX = e.clientX;
    rawY = lerpY = e.clientY;
  });
  heroEl.addEventListener('mousemove',  (e) => { rawX = e.clientX; rawY = e.clientY; });
  heroEl.addEventListener('mouseleave', ()  => { inHero = false; });

  function tick() {
    if (inHero) {
      /* Smooth trail — 0.10 for a cinematic lag */
      lerpX += (rawX - lerpX) * 0.10;
      lerpY += (rawY - lerpY) * 0.10;

      const heroRect   = heroEl.getBoundingClientRect();
      const mascotRect = mascotEl.getBoundingClientRect();
      const cx = mascotRect.left + mascotRect.width  / 2;
      const cy = mascotRect.top  + mascotRect.height / 2;

      /* Distance from lerped cursor to center-bear center */
      const dist = Math.sqrt((lerpX - cx) ** 2 + (lerpY - cy) ** 2);

      /* proximity: 1 = at center, 0 = far away. Full at 160px, zero at 580px */
      const proximity = 1 - smoothstep(160, 580, dist);

      /* Mask origin as % within mascot (clamped 0-100) */
      const pctX = Math.max(0, Math.min(100, (lerpX - mascotRect.left) / mascotRect.width  * 100));
      const pctY = Math.max(0, Math.min(100, (lerpY - mascotRect.top)  / mascotRect.height * 100));
      mascotEl.style.setProperty('--mouse-x', pctX.toFixed(2) + '%');
      mascotEl.style.setProperty('--mouse-y', pctY.toFixed(2) + '%');

      /* Layer 1 — dim: ambient brightness lift as cursor approaches */
      if (dimEl) {
        const bri = (0.62 + proximity * 0.26).toFixed(3);
        const sat = (0.75 + proximity * 0.25).toFixed(3);
        dimEl.style.filter = `brightness(${bri}) saturate(${sat})`;
      }

      /* Layer 2 — broad spotlight: fades in with proximity */
      if (brightEl) brightEl.style.opacity = proximity.toFixed(3);

      /* Layer 3 — hot spot: kicks in only when very close */
      if (hotEl) {
        const hot = Math.max(0, (proximity - 0.35) / 0.65);
        hotEl.style.opacity = hot.toFixed(3);
      }

      /* Beam glow — screen blend, hero-space coordinates, scales with proximity */
      if (beamEl) {
        const bx = (lerpX - heroRect.left).toFixed(1);
        const by = (lerpY - heroRect.top).toFixed(1);
        const a1 = (proximity * 0.30).toFixed(3);
        const a2 = (proximity * 0.08).toFixed(3);
        beamEl.style.background =
          `radial-gradient(circle 560px at ${bx}px ${by}px, rgba(194,255,180,${a1}) 0%, rgba(194,255,180,${a2}) 40%, transparent 100%)`;
      }

    } else if (!hasReset) {
      hasReset = true;
      if (dimEl)    dimEl.style.filter     = '';
      if (brightEl) brightEl.style.opacity = '0';
      if (hotEl)    hotEl.style.opacity    = '0';
      if (beamEl)   beamEl.style.background = '';
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}());

/* ─── Video modal / lightbox ──────────────────────────────── */
(function initVideoModal() {
  const modal   = document.getElementById('video-modal');
  const player  = document.getElementById('video-modal-player');
  if (!modal || !player) return;

  const closeBtn = modal.querySelector('.video-modal__close');
  const backdrop = modal.querySelector('.video-modal__backdrop');

  function openModal(ytId) {
    player.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    player.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.work-item__thumb[data-yt]').forEach((thumb) => {
    thumb.addEventListener('click', () => openModal(thumb.dataset.yt));
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
}());

/* ─── Contact form (client-side only) ────────────────────── */
const form       = document.querySelector('.contact__form');
const formStatus = document.getElementById('formStatus');

if (!form || !formStatus) {
  /* no-op */
} else form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  if (!data.name || !data.email || !data.message) {
    formStatus.textContent = 'Please fill in all fields.';
    formStatus.style.color = '#ff8a8a';
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    });

    if (res.ok) {
      formStatus.textContent = "Thanks! We'll be in touch soon.";
      formStatus.style.color = '';
      form.reset();
    } else {
      formStatus.textContent = 'Something went wrong. Try emailing directly.';
      formStatus.style.color = '#ff8a8a';
    }
  } catch {
    formStatus.textContent = 'Network error. Try emailing directly.';
    formStatus.style.color = '#ff8a8a';
  }

  btn.textContent = 'Send It';
  btn.disabled = false;
});
