document.documentElement.classList.add('js');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// A brief, session-only welcome. The page is never hidden if scripting fails.
const welcome = $('#welcome');
const welcomeKey = 'spotlight-welcome-v2';
let welcomeTimer, welcomeCloseTimer, welcomeTrigger = null;
function finishWelcome(immediate = false) {
  clearTimeout(welcomeTimer); clearTimeout(welcomeCloseTimer);
  if (!welcome.open) return;
  const close = () => { welcome.close(); welcome.hidden = true; document.body.classList.remove('welcome-active'); welcome.classList.remove('departing'); welcomeTrigger?.focus(); };
  if (immediate || reducedMotion.matches) close();
  else { welcome.classList.add('departing'); welcomeCloseTimer = setTimeout(close, 650); }
}
function playWelcome(trigger = null) {
  if (!welcome.showModal || welcome.open) return;
  welcomeTrigger = trigger;
  welcome.hidden = false; welcome.classList.remove('departing');
  welcome.showModal(); document.body.classList.add('welcome-active');
  try { sessionStorage.setItem(welcomeKey, 'seen'); } catch {}
  $('#skip-welcome').focus({ preventScroll: true });
  if (!reducedMotion.matches) welcomeTimer = setTimeout(() => finishWelcome(), 2650);
  else $('#skip-welcome').textContent = 'Enter site ↗';
}
$('#skip-welcome').addEventListener('click', () => finishWelcome(true));
welcome.addEventListener('cancel', e => { e.preventDefault(); finishWelcome(true); });
$('#replay-intro').addEventListener('click', e => playWelcome(e.currentTarget));
reducedMotion.addEventListener('change', () => { if(welcome.open) finishWelcome(true); });
let welcomeSeen = false;
try { welcomeSeen = sessionStorage.getItem(welcomeKey) === 'seen'; } catch {}
if (!welcomeSeen && (!location.hash || location.hash === '#home')) playWelcome();


// Render useful content by default; motion only enhances it.
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); }
  }), { threshold: .08 });
  $$('.reveal').forEach(el => reveal.observe(el));
} else $$('.reveal').forEach(el => el.classList.add('visible'));

const hero = $('.hero');
let heroFrame = 0;
function updateHero() {
  heroFrame = 0;
  if (reducedMotion.matches) { hero.style.removeProperty('--hero-scale'); hero.style.removeProperty('--hero-radius'); return; }
  const progress = Math.min(1, Math.max(0, scrollY / (innerHeight * .45)));
  hero.style.setProperty('--hero-scale', String(1 - progress * .065));
  hero.style.setProperty('--hero-radius', `${progress * 20}px`);
}
addEventListener('scroll', () => { if (!heroFrame && scrollY < innerHeight * 1.6) heroFrame = requestAnimationFrame(updateHero); }, { passive: true });
addEventListener('resize', () => { closeMenu(); updateHero(); });
reducedMotion.addEventListener('change', () => { updateHero(); syncSlideshow(); });

const slides = $$('.hero-image');
let currentSlide = 0, slideTimer, slidesPaused = reducedMotion.matches, heroVisible = true;
function syncSlideshow() {
  clearInterval(slideTimer);
  if (slidesPaused || reducedMotion.matches || document.hidden || !heroVisible) return;
  slideTimer = setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    $('#slide-count').textContent = `0${currentSlide + 1} / 03`;
  }, 6500);
}
$('#pause-slides').addEventListener('click', () => {
  slidesPaused = !slidesPaused;
  $('#pause-slides').textContent = slidesPaused ? 'Play ▷' : 'Pause Ⅱ';
  $('#pause-slides').setAttribute('aria-label', slidesPaused ? 'Play slideshow' : 'Pause slideshow');
  syncSlideshow();
});
if(reducedMotion.matches) { $('#pause-slides').hidden = true; }
document.addEventListener('visibilitychange', syncSlideshow);
if('IntersectionObserver' in window) new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; syncSlideshow(); }).observe(hero);
syncSlideshow();

const menu = $('#navigation'), menuButton = $('.menu-toggle');
function closeMenu() {
  menu.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
  menuButton.innerHTML = 'Menu <span>+</span>';
  if (!$('dialog[open]')) document.body.classList.remove('locked');
}
menuButton.addEventListener('click', () => {
  const open = !menu.classList.contains('open');
  menu.classList.toggle('open', open); menuButton.setAttribute('aria-expanded', String(open));
  menuButton.innerHTML = open ? 'Close <span>−</span>' : 'Menu <span>+</span>';
  document.body.classList.toggle('locked', open);
  if(open) menu.querySelector('a').focus();
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if(menu.classList.contains('open')) {
    if(e.key === 'Escape') { closeMenu(); menuButton.focus(); }
    if(e.key === 'Tab') {
      const links = [...menu.querySelectorAll('a'), menuButton];
      const first = links[0], last = links.at(-1);
      if(e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
});

const photoLinks = $$('[data-photo]');
const photos = photoLinks.map(a => ({ src: a.getAttribute('href'), alt: a.querySelector('img').alt, caption: a.closest('figure').querySelector('h3').textContent }));
const lightbox = $('#lightbox'), stage = $('#viewer-stage'), viewerImage = $('#viewer-image');
let photoIndex = 0, returnFocus = null;
function resetZoom() {
  stage.classList.remove('zoomed'); stage.scrollTop = 0; stage.scrollLeft = 0;
  $('#zoom').textContent = 'Zoom +'; $('#zoom').setAttribute('aria-label', 'Zoom in'); $('#zoom').setAttribute('aria-pressed', 'false');
}
function showPhoto(i) {
  photoIndex = (i + photos.length) % photos.length;
  const photo = photos[photoIndex];
  resetZoom(); viewerImage.src = photo.src; viewerImage.alt = photo.alt;
  $('#photo-count').textContent = `${String(photoIndex + 1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
  $('#photo-caption').textContent = photo.caption;
}
function toggleZoom() {
  const zoomed = stage.classList.toggle('zoomed');
  $('#zoom').textContent = zoomed ? 'Fit −' : 'Zoom +';
  $('#zoom').setAttribute('aria-label', zoomed ? 'Fit photograph to screen' : 'Zoom in');
  $('#zoom').setAttribute('aria-pressed', String(zoomed));
}
photoLinks.forEach((a,i) => a.addEventListener('click', e => {
  if (!lightbox.showModal) return;
  e.preventDefault(); returnFocus = a; showPhoto(i); lightbox.showModal();
  document.body.classList.add('locked'); $('#close-photo').focus();
}));
$('#close-photo').addEventListener('click', () => lightbox.close());
$('#next-photo').addEventListener('click', () => showPhoto(photoIndex + 1));
$('#prev-photo').addEventListener('click', () => showPhoto(photoIndex - 1));
$('#zoom').addEventListener('click', toggleZoom);
viewerImage.addEventListener('click', toggleZoom);
lightbox.addEventListener('keydown', e => {
  if(e.key === 'ArrowRight') { e.preventDefault(); showPhoto(photoIndex + 1); }
  if(e.key === 'ArrowLeft') { e.preventDefault(); showPhoto(photoIndex - 1); }
});
let touchStart = null;
stage.addEventListener('touchstart', e => { if(e.touches.length === 1) touchStart = e.touches[0].clientX; }, { passive:true });
stage.addEventListener('touchend', e => {
  if (touchStart !== null && !stage.classList.contains('zoomed')) {
    const diff = e.changedTouches[0].clientX - touchStart;
    if(Math.abs(diff) > 70) showPhoto(photoIndex + (diff < 0 ? 1 : -1));
  }
  touchStart = null;
}, { passive:true });
$('#fullscreen').hidden = !lightbox.requestFullscreen;
$('#fullscreen').addEventListener('click', async () => {
  try { if(document.fullscreenElement) await document.exitFullscreen(); else await lightbox.requestFullscreen(); }
  catch { $('#fullscreen').hidden = true; }
});
document.addEventListener('fullscreenchange', () => { $('#fullscreen').textContent = document.fullscreenElement ? 'Exit full screen ↙' : 'Full screen ↗'; });
lightbox.addEventListener('close', () => {
  if(document.fullscreenElement) document.exitFullscreen().catch(() => {});
  document.body.classList.remove('locked'); resetZoom(); returnFocus?.focus();
});

const videoDialog = $('#video-dialog');
$$('[data-video]').forEach(a => a.addEventListener('click', e => {
  if (!videoDialog.showModal) return;
  e.preventDefault(); returnFocus = a;
  $('#video-title').textContent = a.dataset.title;
  $('#youtube-link').href = a.href;
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(a.dataset.video)}?autoplay=1&rel=0`;
  frame.title = a.dataset.title;
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  $('#video-container').replaceChildren(frame);
  videoDialog.showModal(); document.body.classList.add('locked'); $('#close-video').focus();
}));
$('#close-video').addEventListener('click', () => videoDialog.close());
videoDialog.addEventListener('close', () => {
  $('#video-container').replaceChildren(); document.body.classList.remove('locked'); returnFocus?.focus();
});
videoDialog.addEventListener('click', e => { if(e.target === videoDialog) { const r=videoDialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) videoDialog.close(); } });
