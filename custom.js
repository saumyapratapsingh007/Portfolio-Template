import { CARDS } from './src/scene4/layout4.js';

// Instant chapter navigation skips intervening cinematic scenes.
const targets = { Home: 'top', Work: 'gallery', About: 'profile', Journey: 'chrono', Contact: 'fin' };
function jumpTo(id) {
  const section = document.getElementById(id);
  if (!section) return;
  section.dataset.directEntry = 'true';
  const top = id === 'top' ? 0 : section.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: 'instant' });
  if (id === 'fin') section.classList.add('is-bar', 'is-caps');
  document.querySelectorAll('[data-nav]').forEach(a => {
    const active = targets[a.textContent.trim()] === id;
    a.classList.toggle('is-active', active);
    if (active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
  });
}
document.querySelectorAll('[data-nav], .hdr__mark').forEach(anchor => {
  const id = targets[anchor.textContent.trim()] || 'top';
  anchor.href = '#' + id;
  anchor.addEventListener('click', event => {
    event.preventDefault();
    history.replaceState(null, '', '#' + id);
    jumpTo(id);
  });
});
window.addEventListener('hashchange', () => jumpTo(location.hash.slice(1)));
// The original artwork is a reference preview, not yet replaced with owner's verified media.
// Disclose the absence of portfolio films instead of inventing case studies or credits.
const dlg = document.createElement('dialog');
dlg.className = 'work-dialog';
dlg.setAttribute('aria-labelledby', 'workDialogTitle');
dlg.innerHTML = '<p class="work-dialog__over">CREATIVE PRACTICE / PORTFOLIO</p><h2 id="workDialogTitle"></h2><p></p><p class="work-dialog__note">Film samples, credits and project links will appear once verified media is supplied.</p><button type="button">Close</button>';
document.body.append(dlg);
dlg.querySelector('button').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
const categories = [
 'AI Short Films & Conceptual Videos',
 'Product & Brand Shoots for Social Media Campaigns',
 'Social Media Influencer Content & Vlogging',
 'Creative Graphic Designs & AI Artworks',
 'Script Writing, Direction & Voiceover Projects',
 'Photography & Drone Shoots',
 'Modeling, Acting & On-Camera Projects',
];
const discipline = [0,1,2,3,4,5,6,1,1,2,4,5];
document.addEventListener('click', (event) => {
  const card = event.target.closest('.g-card');
  if (!card) return;
  const i = Number(card.dataset.i);
  dlg.querySelector('h2').textContent = CARDS[i]?.title || 'Creative work';
  dlg.querySelector('p:not([class])').textContent = categories[discipline[i]] || 'Creative production';
  dlg.showModal();
});


// Six creative satellites circle the IDEAS INTO CINEMA core on independent,
// gently tilted elliptical orbits. Labels stay upright, like real planets' names.
// No external animation library; pause when offscreen to spare battery.
(function initCreativeOrbits() {
  const section = document.getElementById('universe');
  if (!section) return;
  const satellites = Array.from(section.querySelectorAll('.orbit-card'));
  if (satellites.length !== 6) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.getElementById('orbitMotion');
  // This scene autoplays by explicit owner preference; visitors can still pause it.
  let motionOverride = true;
  const motionEnabled = () => motionOverride && !matchMedia('(max-width: 900px)').matches;
  function updateMotionControl() {
    if (!motionButton) return;
    const enabled = motionEnabled();
    motionButton.textContent = enabled ? 'Pause orbit' : 'Play orbit';
    motionButton.setAttribute('aria-label', enabled ? 'Pause orbital animation' : 'Play orbital animation');
    section.dataset.orbitMotion = enabled ? 'playing' : 'paused';
  }
  motionButton?.addEventListener('click', () => {
    motionOverride = !motionEnabled();
    updateMotionControl();
    sync();
  });
  const phases = [-0.38, 0.63, 1.70, 2.88, 4.08, 5.24];
  const periods = [24, 28, 31, 26, 34, 37]; // different orbital periods
  const lanes = [0.90, 1.00, 1.10, 1.04, 1.13, 0.96];
  // Pointer motion is a secondary layer: it never changes orbital time or phase.
  const pointer = { x: 0, y: 0, active: false };
  const response = satellites.map(() => 0);
  section.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }, { passive: true });
  const releasePointer = () => { pointer.active = false; };
  section.addEventListener('pointerleave', releasePointer);
  section.addEventListener('pointercancel', releasePointer);
  window.addEventListener('blur', releasePointer);
  let visible = false;
  let frame = 0;
  let elapsed = 0;
  let last = 0;

  function render(t, dt = 0) {
    const box = section.querySelector('.creative-orbit').getBoundingClientRect();
    const w = box.width, h = box.height;
    const mobile = w < 650;
    const cy = 0.5;
    satellites.forEach((card, i) => {
      // The card's physical dimensions matter: nothing clips off small phones.
      const cardWidth = card.offsetWidth || 108;
      const maxX = Math.max(42, w / 2 - cardWidth * 1.01 / 2 - 20);
      const rx = Math.min(maxX, w * (mobile ? 0.435 : 0.365) * lanes[i]);
      const ry = Math.min(h * 0.34 * lanes[i], h / 2 - 60);
      const a = phases[i] + t * Math.PI * 2 / 32 + 0.12 * Math.sin(t * Math.PI * 2 / periods[i] + phases[i]);
      const x = Math.cos(a) * rx;
      const y = Math.sin(a) * ry;
      const depth = (Math.sin(a) + 1) * 0.5;
      const size = 0.88 + depth * 0.13;
      const cardHeight = card.offsetHeight || 64;
      // Measure proximity to the unperturbed card, avoiding hover feedback jitter.
      const dx = Math.max(0, Math.abs(pointer.x - (box.left + w / 2 + x)) - cardWidth * size / 2);
      const dy = Math.max(0, Math.abs(pointer.y - (box.top + h * cy + y)) - cardHeight * size / 2);
      const proximity = pointer.active && motionEnabled()
        ? Math.max(0, 1 - Math.hypot(dx, dy) / 90) : 0;
      const target = proximity * proximity * (3 - 2 * proximity);
      response[i] += (target - response[i]) * (1 - Math.exp(-dt * (target > response[i] ? 12 : 5)));
      if (!motionEnabled()) response[i] = 0;
      const energy = response[i];
      const wiggle = Math.sin(t * 18 + i * 0.9) * energy;
      const wiggleY = Math.sin(t * 14 + i * 1.3) * energy;
      card.style.left = '50%';
      card.style.top = `${cy * 100}%`;
      card.style.transform = `translate3d(calc(-50% + ${(x + wiggle * 3).toFixed(2)}px), calc(-50% + ${(y + wiggleY * 2).toFixed(2)}px), 0) rotate(${(wiggle * 2).toFixed(3)}deg) scale(${size.toFixed(3)})`;
      card.style.opacity = (0.68 + depth * 0.32).toFixed(3);
      card.style.zIndex = String(depth > 0.48 ? 4 : 2);
    });
  }

  function animate(now) {
    if (!visible || !motionEnabled() || document.hidden) { frame = 0; return; }
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    elapsed += dt;
    last = now;
    render(elapsed, dt);
    frame = requestAnimationFrame(animate);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    render(elapsed);
    if (visible && motionEnabled() && !document.hidden)
      frame = requestAnimationFrame(animate);
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    section.classList.toggle('is-on', visible);
    sync();
  }, { threshold: 0.02 }).observe(section);
  window.addEventListener('resize', sync, { passive: true });
  document.addEventListener('visibilitychange', sync);

  updateMotionControl();
  render(0);
})();
