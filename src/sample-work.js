import { sampleReels } from './sample-work-data.js';
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.sample-card').forEach((card, i) => {
  const data = sampleReels[i];
  const surface = card.querySelector('.sample-card__surface');
  const video = card.querySelector('video');
  const link = card.querySelector('a');
  surface.addEventListener('pointermove', e => {
    if (reduce.matches || e.pointerType === 'touch') return;
    const box = surface.getBoundingClientRect();
    surface.style.setProperty('--rx', `${(0.5-(e.clientY-box.top)/box.height)*10}deg`);
    surface.style.setProperty('--ry', `${((e.clientX-box.left)/box.width-0.5)*10}deg`);
  });
  surface.addEventListener('pointerleave', () => {
    surface.style.removeProperty('--rx');surface.style.removeProperty('--ry');
  });
  if (data?.instagramUrl) {
    try {
      const url = new URL(data.instagramUrl);
      if (url.protocol === 'https:' && /^(www\.)?instagram\.com$/.test(url.hostname)) {
        link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';
        link.removeAttribute('aria-disabled');link.textContent='View on Instagram ↗';
      }
    } catch {}
  }
  if (!data?.video) return;
  video.src=data.video;video.hidden=false;video.controls=true;video.autoplay=!reduce.matches;
  surface.querySelector('.sample-card__placeholder').hidden=true;
  surface.removeAttribute('tabindex');surface.setAttribute('aria-label',data.title || `Sample reel ${i+1}`);
  video.addEventListener('error',()=>{video.hidden=true;surface.querySelector('.sample-card__placeholder').hidden=false;});
  new IntersectionObserver(([entry])=>{
    if (entry.isIntersecting && !reduce.matches) video.play().catch(()=>{});else video.pause();
  },{threshold:.25}).observe(video);
});
