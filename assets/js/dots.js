/* Side dot navigation: one dot per main section, highlights the current one. */
(() => {
  const items = [['home', 'Home'], ['services', 'Services'], ['about', 'About'], ['industries', 'Industries'], ['approach', 'Approach'], ['impact', 'Impact'],
    ['books', 'Books'], ['videos', 'Videos'], ['insights', 'Insights'], ['faq', 'FAQ'], ['contact', 'Contact']].filter(([id]) => document.getElementById(id));
  if (!items.length) return;
  const nav = document.createElement('nav'); nav.className = 'dots-nav'; nav.setAttribute('aria-label', 'Page sections');
  nav.innerHTML = items.map(([id, label]) => `<a href="#${id}" data-label="${label}" aria-label="${label}"></a>`).join('');
  document.body.appendChild(nav);
  const links = [...nav.children], secs = items.map(([id]) => document.getElementById(id));
  const update = () => { let cur = 0; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.45) cur = i; }); links.forEach((l, i) => l.classList.toggle('on', i === cur)); };
  addEventListener('scroll', update, { passive: true }); update();
})();
