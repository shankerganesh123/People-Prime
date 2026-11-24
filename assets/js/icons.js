/* Icon set — 24px grid, 1.7 stroke, round caps. One style only; add new icons here. */
window.PP = window.PP || {};
PP.ICONS = {
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5"/><circle cx="17" cy="9" r="2.4"/><path d="M17 14.5c2.5 0 4 1.6 4 4"/>',
  calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
  chart:'<path d="M4 20h16"/><path d="M6 16l4-5 3 3 5-7"/><path d="M15 7h3v3"/>',
  doc:'<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 12h6M10 16h6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  scale:'<path d="M12 3v18M6 21h12M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
  calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  handshake:'<path d="M3 12l5-5 4 2 4-2 5 5-8 8z"/><path d="M9 13l2 2M12 11l3 3"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  puzzle:'<path d="M9 4h3v2a2 2 0 1 0 4 0V4h4v5h-2a2 2 0 1 0 0 4h2v7H4V4z"/>',
  leaf:'<path d="M5 19c0-9 5-14 15-15 0 10-5 15-14 15z"/><path d="M5 19c3-5 6-8 10-10"/>',
  monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  factory:'<path d="M3 21V10l6 3V10l6 3V6h6v15z"/>',
  heart:'<path d="M12 20S4 15 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15 12 20 12 20z"/>',
  bank:'<path d="M3 9l9-5 9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 21h18"/>',
  cart:'<path d="M3 4h3l2 12h10l2-8H7"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>',
  cap:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>',
  dots:'<circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>',
  quote:'<path d="M7 7h4v4a4 4 0 0 1-4 4M15 7h4v4a4 4 0 0 1-4 4"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>'
};
PP.icon = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${PP.ICONS[n] || ''}</svg>`;
PP.paintIcons = (root = document) => root.querySelectorAll('[data-icon]').forEach((e) => {
  if (!e.dataset.done) { e.innerHTML = PP.icon(e.dataset.icon); e.dataset.done = 1; }
});
