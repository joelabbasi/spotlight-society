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

/* ─── Mascot spotlight reveal ─────────────────────────────── */
const mascot = document.getElementById('mascot');

if (mascot && window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let rafPending = false;
  let pendingX = null;
  let pendingY = null;

  mascot.addEventListener('mousemove', (e) => {
    const rect = mascot.getBoundingClientRect();
    pendingX = ((e.clientX - rect.left) / rect.width  * 100).toFixed(2) + '%';
    pendingY = ((e.clientY - rect.top)  / rect.height * 100).toFixed(2) + '%';

    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        mascot.style.setProperty('--mouse-x', pendingX);
        mascot.style.setProperty('--mouse-y', pendingY);
        rafPending = false;
      });
    }
  });

  mascot.addEventListener('mouseleave', () => {
    mascot.style.setProperty('--mouse-x', '50%');
    mascot.style.setProperty('--mouse-y', '40%');
  });
}

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
