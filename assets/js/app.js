/* Mobile app mode: live app-bar title, tab highlighting and the "More" bottom sheet. (CSS only shows these ≤ 820px.) */
(() => {
  const $ = (id) => document.getElementById(id);
  const titles = { home: 'People Prime', services: 'Services', about: 'About us', industries: 'Industries', approach: 'How we work', impact: 'Impact', books: 'Books', videos: 'Videos', insights: 'Insights', faq: 'FAQ', contact: 'Contact' };
  const groups = { home: ['home'], services: ['services', 'industries'], resources: ['books', 'videos', 'insights', 'faq'] };
  const ids = Object.keys(titles).filter((id) => $(id));
  const tabs = [...document.querySelectorAll('#tabbar [data-tab]')], title = $('appTitle');

  const update = () => {
    let cur = 'home'; ids.forEach((id) => { if ($(id).getBoundingClientRect().top < innerHeight * 0.4) cur = id; });
    if (title) title.textContent = titles[cur];
    let tab = 'more'; Object.entries(groups).forEach(([t, list]) => { if (list.includes(cur)) tab = t; });
    tabs.forEach((a) => a.classList.toggle('on', a.dataset.tab === tab));
  };
  addEventListener('scroll', update, { passive: true }); update();

  /* progress dots under the swipeable "Our Approach" steps */
  const rail = document.querySelector('#approach .process-rail');
  if (rail) {
    const items = [...rail.children], dots = document.createElement('div'); dots.className = 'rail-dots'; dots.setAttribute('aria-hidden', 'true');
    dots.innerHTML = items.map(() => '<i></i>').join(''); rail.after(dots);
    const sync = () => { const c = rail.scrollLeft + rail.clientWidth / 2; let best = 0, d = 1e9; items.forEach((it, i) => { const m = Math.abs(it.offsetLeft + it.offsetWidth / 2 - c); if (m < d) { d = m; best = i; } }); [...dots.children].forEach((x, i) => x.classList.toggle('on', i === best)); };
    rail.addEventListener('scroll', sync, { passive: true }); sync();
  }

  const sheet = $('moreSheet'); if (!sheet) return;
  const set = (open) => { sheet.classList.toggle('open', open); sheet.setAttribute('aria-hidden', String(!open)); document.documentElement.style.overflow = open ? 'hidden' : ''; };
  $('moreBtn')?.addEventListener('click', () => set(true));
  sheet.addEventListener('click', (e) => { if (e.target.closest('[data-close-sheet]') || e.target.closest('a')) set(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  $('sheetTheme')?.addEventListener('click', () => $('themeBtn')?.click());
  if (/[?&]sheet/.test(location.search)) set(true);
})();
