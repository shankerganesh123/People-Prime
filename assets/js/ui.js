/* UI behaviours — classic script (works from file://). Content data lives at the top. */
(() => {
  const DATA = {
    services: [
      ['shield', 'POSH Compliance', 'Workplace safety, awareness and statutory compliance.', 'b-2x2 bento-feature', ['Internal Committee setup', 'Training & awareness', 'Annual filings', 'Case handling']],
      ['users', 'Talent Acquisition', 'Find, evaluate and onboard the right talent.', 'b-2', null, 'assets/img/team-collab.jpg'],
      ['calc', 'Payroll & HR Operations', 'Simplify payroll and HR administration.', ''],
      ['chart', 'Talent Development', 'Employee learning and leadership development.', ''],
      ['doc', 'JD & SOP Formulation', 'Clear roles and operational processes.', ''],
      ['gear', 'HR Audit & Automation', 'Improve HR efficiency through audits and tech.', ''],
      ['scale', 'Legal & Compliance', 'Employment law advisory and regulatory support.', 'b-2'],
    ],
    industries: [['monitor', 'IT & ITES'], ['factory', 'Manufacturing'], ['heart', 'Healthcare'], ['bank', 'BFSI'],
      ['cart', 'Retail & E-commerce'], ['cap', 'Education'], ['dots', 'And many more']],
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = /[?&]still/.test(location.search);               // ?still → skip intro (QA / screenshots)

  /* ---- render: bento services ---- */
  const svc = $('#svcGrid');
  if (svc) {
    svc.innerHTML = DATA.services.map(([ic, t, d, cls, chips, photo], i) => `
      <article class="tilt card card-interactive reveal ${cls} ${photo ? 'svc-photo on-dark' : ''}" style="--d:${i * 0.07}s">
        ${photo ? `<img class="svc-bg" src="${photo}" alt="" loading="lazy" />` : ''}
        <span class="svc-idx" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        ${chips ?`<span class="bento-big-icon self-end -mb-4 order-first opacity-90">${PP.icon(ic)}</span>` : `<span class="icon-box">${PP.icon(ic)}</span>`}
        <h3 class="${chips ? 'hd-1 mt-auto' : 'hd-3 mt-5'}">${t}</h3>
        <p class="${chips ? 'lead mt-3 max-w-sm' : 'body-sm mt-2'}">${d}</p>
        ${chips ? `<div class="flex flex-wrap gap-2 mt-6">${chips.map((c) => `<span class="chip">${c}</span>`).join('')}</div>` : ''}
        <a href="#contact" class="link-arrow ${chips ? 'mt-6' : 'mt-auto pt-5'}">Learn More ${PP.icon('arrow')}</a>
      </article>`).join('') + `
      <article class="card card-cta on-dark reveal b-4 !flex-row flex-wrap items-center justify-between gap-6" style="--d:.5s">
        <h3 class="hd-2 !text-white">Let's discuss your HR requirements.</h3>
        <a href="#contact" class="btn btn-light">Get in Touch ${PP.icon('arrow')}</a>
      </article>`;
  }

  /* ---- render: industries ticker (2 rows, opposite directions) ---- */
  const ind = $('#indGrid');
  if (ind) {
    const row = (items, rev) => {
      const html = items.map(([ic, n]) => `<span class="ind-pill">${PP.icon(ic)}${n}</span>`).join('');
      return `<div class="ticker ${rev ? 'rev' : ''}"><div class="ticker-track">${html}${html}</div></div>`;
    };
    const extra = [['users', 'Staffing'], ['globe', 'Logistics'], ['leaf', 'Hospitality'], ['doc', 'Real Estate'], ['gear', 'Telecom'], ['chart', 'Start-ups']];
    ind.innerHTML = row(DATA.industries, false) + row(extra, true);
  }
  PP.paintIcons();

  /* ---- intro sequence (never blocks on network) ---- */
  const openIntro = () => {
    document.body.classList.remove('loading');
    setTimeout(() => $$('.letterbox').forEach((b) => (b.style.display = 'none')), still ? 0 : 1800);
    $$('#heroText, #heroText .reveal, #heroCard').forEach((e) => e.classList.add('in'));
    const sp = $('#spark');
    if (sp) { sp.style.transition = 'stroke-dashoffset 2.4s ease .8s'; sp.style.strokeDashoffset = 0; }
  };
  if (still) { document.documentElement.classList.add('still'); document.body.classList.remove('loading'); $$('.letterbox').forEach((b) => (b.style.display = 'none')); }
  if (still) { const y = +(location.search.match(/[?&]y=(\d+)/) || [])[1]; if (y) { $('main').style.marginTop = -y + 'px'; document.body.style.height = '100vh'; document.body.style.overflow = 'hidden'; } }
if (still) { const sel = (location.search.match(/[?&]sel=([A-Za-z0-9_-]+)/) || [])[1]; if (sel) addEventListener('load', () => setTimeout(() => { const el = document.getElementById(sel); if (!el) return; const y = el.getBoundingClientRect().top + scrollY - 70; $('main').style.marginTop = -y + 'px'; document.body.style.height = '100vh'; document.body.style.overflow = 'hidden'; }, 900)); }
  let opened = false; const go = () => { if (!opened) { opened = true; setTimeout(openIntro, still ? 0 : 250); } };
  if (document.readyState !== 'loading') go(); else document.addEventListener('DOMContentLoaded', go);
  setTimeout(go, 1500);                                            // failsafe

  /* ---- scroll reveal ---- */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach((el) => { if (still) el.classList.add('in'); else if (!el.classList.contains('in')) io.observe(el); });

  /* ---- counters ---- */
  const co = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; co.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    (function step(t) { const p = Math.min((t - t0) / 1800, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); })(t0);
  }), { threshold: 0.5 });
  $$('[data-count]').forEach((el) => co.observe(el));

  /* ---- nav: glass on scroll, hide on scroll-down, active link, progress, to-top ---- */
  const nav = $('#nav'), prog = $('#progress'), top = $('#toTop');
  const links = $$('.nav-link[href^="#"]');
  const secs = links.map((l) => $(l.getAttribute('href'))).filter(Boolean);
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    nav?.classList.toggle('scrolled', y > 40);
    nav?.classList.toggle('hide', y > lastY && y > 400 && $('#mobile')?.classList.contains('hidden'));
    lastY = y;
    if (prog) prog.style.width = (y / Math.max(1, document.body.scrollHeight - innerHeight)) * 100 + '%';
    top?.classList.toggle('show', y > 900);
    let cur = secs[0];
    secs.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s; });
    links.forEach((l) => l.classList.toggle('active', cur && l.getAttribute('href') === '#' + cur.id));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  $('#burger')?.addEventListener('click', () => $('#mobile').classList.toggle('hidden'));
  $$('#mobile a').forEach((a) => a.addEventListener('click', () => $('#mobile').classList.add('hidden')));

  /* ---- pointer effects: spotlight + 3D tilt + magnetic buttons ---- */
  if (matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('pointermove', (e) => {
      const c = e.target.closest?.('.card-interactive');
      if (c) {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px');
        if (c.classList.contains('tilt')) c.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateZ(4px)`;
      }
      const m = e.target.closest?.('.magnetic');
      if (m) { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${(e.clientY - r.top - r.height / 2) * 0.2}px)`; }
    });
    document.addEventListener('pointerout', (e) => {
      const c = e.target.closest?.('.tilt'); if (c && !c.contains(e.relatedTarget)) c.style.transform = '';
      const m = e.target.closest?.('.magnetic'); if (m && !m.contains(e.relatedTarget)) m.style.transform = '';
    });
  }

  /* ---- testimonials ---- */
  const qs = $$('#quotes .q');
  if (qs.length) {
    let i = 0, timer;
    const show = (n) => { i = (n + qs.length) % qs.length; qs.forEach((q, k) => q.classList.toggle('hidden', k !== i)); };
    const auto = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 6000); };
    $('#qNext').onclick = () => { show(i + 1); auto(); };
    $('#qPrev').onclick = () => { show(i - 1); auto(); };
    auto();
  }

  /* ---- contact form (front-end validation; wire to your backend/email service) ---- */
  const form = $('#contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = $('#formMsg'), d = Object.fromEntries(new FormData(form));
    if (!d.name?.trim() || !/^\S+@\S+\.\S+$/.test(d.email || '')) { msg.textContent = 'Please enter your name and a valid work email.'; msg.style.color = 'rgb(var(--c-accent-300))'; return; }
    msg.textContent = `Thank you, ${d.name.split(' ')[0]} — our HR expert will contact you shortly.`; msg.style.color = 'rgb(var(--c-success))'; form.reset();
  });
})();
