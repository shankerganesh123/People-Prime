/* Theme switch: hybrid (default) <-> dark. Persisted; initial value is set by an inline <head> script (no flash). */
(() => {
  const KEY = 'pp-theme', root = document.documentElement, btn = document.getElementById('themeBtn');
  const save = (t) => { try { localStorage.setItem(KEY, t); } catch (e) { /* storage blocked */ } };
  const apply = (t) => {
    root.dataset.theme = t;
    if (!btn) return;
    btn.setAttribute('aria-label', t === 'hybrid' ? 'Switch to full dark theme' : 'Switch to light content theme');
    btn.title = btn.getAttribute('aria-label');
    btn.innerHTML = t === 'hybrid'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  };
  apply(root.dataset.theme || 'hybrid');
  btn?.addEventListener('click', () => { const t = root.dataset.theme === 'hybrid' ? 'dark' : 'hybrid'; apply(t); save(t); });
})();
