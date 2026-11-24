/* Hero art: mouse parallax on the photo layers (touch/reduced-motion safe). */
(() => {
  const art = document.getElementById('heroArt');
  if (!art || matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover:hover)').matches) return;
  const hero = document.getElementById('home');
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    art.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    art.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
  hero.addEventListener('pointerleave', () => { art.style.setProperty('--px', 0); art.style.setProperty('--py', 0); });
})();
