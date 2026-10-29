// A stable outer word box preserves line wrapping; only its ink scales.
const radius = 96 / 2.54; // One CSS centimetre; physical size varies by display.
const pointer = window.__textLensPointer = { x: 0, y: 0, active: false, radius };
const words = new Set();
const visible = new Set();
const enlarged = new Set();
const visibility = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) visible.add(entry.target);
    else { visible.delete(entry.target); reset(entry.target); }
  }
}, { rootMargin: '40px' });
function reset(word) {
  word.firstElementChild?.style.removeProperty('scale');
  enlarged.delete(word);
}
const excluded = 'script,style,noscript,svg,canvas,textarea,input,select,option,[contenteditable],.sr-only,.cursor-word';
function wrap(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeValue.trim() && !node.parentElement?.closest(excluded)) nodes.push(node);
  }
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.nodeValue.split(/(\s+)/u)) {
      if (!part) continue;
      if (/^\s+$/u.test(part)) { fragment.append(document.createTextNode(part)); continue; }
      const word = document.createElement('span');
      word.className = 'cursor-word';
      const ink = document.createElement('span');
      ink.className = 'cursor-word__ink';
      ink.textContent = part;
      word.append(ink);
      fragment.append(word);
      words.add(word);
      visibility.observe(word);
    }
    node.replaceWith(fragment);
  }
}
const observer = new MutationObserver(records => {
  observer.disconnect();
  for (const record of records) {
    if (record.type === 'characterData') wrap(record.target.parentElement);
    else for (const node of record.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) wrap(node);
      else if (node.nodeType === Node.TEXT_NODE) wrap(node.parentElement);
    }
  }
  for (const word of words) if (!word.isConnected) {
    visibility.unobserve(word); words.delete(word); visible.delete(word); enlarged.delete(word);
  }
  observe();
});
function observe() { observer.observe(document.body, { childList:true, subtree:true, characterData:true }); }
wrap(document.body);
observe();
let frame = 0;
function tick() {
  frame = 0;
  if (!pointer.active || document.hidden) return;
  const changes = [];
  for (const word of visible) {
    const r = word.getBoundingClientRect();
    const dx = Math.max(r.left - pointer.x, 0, pointer.x - r.right);
    const dy = Math.max(r.top - pointer.y, 0, pointer.y - r.bottom);
    const proximity = r.width && r.height ? Math.max(0, 1 - Math.hypot(dx, dy) / radius) : 0;
    if (proximity) changes.push([word, 1 + .12 * proximity * proximity * (3 - 2 * proximity)]);
    else if (enlarged.has(word)) changes.push([word, 1]);
  }
  for (const [word, scale] of changes) {
    word.firstElementChild.style.scale = String(scale);
    if (scale > 1) enlarged.add(word); else enlarged.delete(word);
  }
  // Keep tracking moving orbit labels even when the mouse is stationary.
  frame = requestAnimationFrame(tick);
}
function start() { if (!frame && pointer.active && !document.hidden) frame = requestAnimationFrame(tick); }
function stop() {
  pointer.active = false;
  cancelAnimationFrame(frame); frame = 0;
  for (const word of enlarged) reset(word);
}
window.addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; start();
}, { passive:true });
document.documentElement.addEventListener('pointerleave', stop);
window.addEventListener('blur', stop);
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
