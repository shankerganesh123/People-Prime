/* Content: books, videos (+ modal), newsletter and the hero word rotator.
   EDIT THE DATA BELOW — everything on the page is generated from it.
   Videos: paste a YouTube video ID into `id` (the part after v=). Empty id => photo thumbnail + "coming soon" modal.
   Books:  set `url` to the Amazon link. */
(() => {
  const DATA = {
    books: [
      { title: 'POSH at the Workplace', sub: 'A comprehensive guide to building safe and inclusive workplaces.', badge: 'Latest release', big: 'POSH', small: 'AT THE WORKPLACE', ca: '#1d7ab8', cb: '#082a47', url: '#',
        points: ['Setting up the Internal Committee', 'Handling complaints step by step', 'Training modules and awareness plans', 'Annual reporting and documentation'],
        audience: ['HR teams', 'Founders & CXOs', 'Managers', 'Internal Committee members'] },
    ],
    videos: [
      { id: '', img: 'assets/img/training.jpg', tag: 'POSH', title: 'POSH Act explained in five minutes', blurb: 'What every employer and employee should know about the Internal Committee, complaints and timelines.' },
      { id: '', img: 'assets/img/laptop-bw.jpg', tag: 'Payroll', title: 'Building a compliant payroll process' },
      { id: '', img: 'assets/img/team-collab.jpg', tag: 'Talent', title: 'Retention strategies that actually work' },
      { id: '', img: 'assets/img/workshop.jpg', tag: 'Culture', title: 'Designing a people-first workplace culture' },
    ],
    channel: 'https://www.youtube.com/',
  };

  const $ = (s, r = document) => r.querySelector(s);
  const icon = (n) => (window.PP ? PP.icon(n) : '');
  const still = document.documentElement.classList.contains('still');

  /* ---------- books ---------- */
  const cover = (b) => `<div class="book-stage on-dark"><div class="book3d" style="--ca:${b.ca};--cb:${b.cb}">
      <div class="book3d-cover"><span class="bk-kicker">PEOPLE PRIME</span><div><strong class="bk-title">${b.big}</strong><span class="bk-sub">${b.small}</span></div><i class="bk-bar"></i></div></div></div>`;
  const buy = (b, primary) => `<a href="${b.url}" class="btn ${primary ? 'btn-primary' : 'btn-ghost'} btn-sm self-start" ${b.url !== '#' ? 'target="_blank" rel="noopener"' : ''}>Buy on Amazon ${icon('arrow')}</a>`;
  const bf = $('#bookFeature');
  if (bf) {
    const f = DATA.books[0];
    const book3d = (b) => `<div class="book3d" style="--ca:${b.ca};--cb:${b.cb}"><div class="book3d-cover"><span class="bk-kicker">PEOPLE PRIME</span><div><strong class="bk-title">${b.big}</strong><span class="bk-sub">${b.small}</span></div><i class="bk-bar"></i></div></div>`;
    bf.innerHTML = `<article class="bk-feature on-dark reveal">
      <span class="bk-glow" aria-hidden="true"></span><span class="bk-grid" aria-hidden="true"></span>
      <div class="bk-cover">${book3d(f)}<span class="bk-floor" aria-hidden="true"></span></div>
      <div class="bk-body"><span class="badge badge-accent self-start"><i class="dot"></i>${f.badge}</span><h3 class="bk-title-lg">${f.title}</h3><p class="lead">${f.sub}</p>
        <div class="bk-inside"><span class="bk-label">What's inside</span><ul>${f.points.map((p) => `<li><span class="bk-check">${icon('check')}</span>${p}</li>`).join('')}</ul></div>
        <div class="bk-for"><span class="bk-label">Written for</span><div class="flex flex-wrap gap-2">${f.audience.map((a) => `<span class="chip">${a}</span>`).join('')}</div></div>
        <div class="flex flex-wrap gap-3 pt-2">${buy(f, true)}<a href="#contact" class="btn btn-ghost btn-sm">Request a corporate copy</a></div></div></article>`;
  }

  /* ---------- videos ---------- */
  const thumb = (v, i, big) => `
    <button class="vthumb" data-video="${i}" aria-label="Play: ${v.title}">
      ${v.id ? `<img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" />` : v.img ? `<img src="${v.img}" alt="" loading="lazy" />` : '<span class="deco"></span>'}
      <span class="vplay" aria-hidden="true"></span>
      ${big ? `<span class="vcap"><span class="badge badge-accent">${v.tag}</span><span class="hd-2 !text-white block mt-3 max-w-lg">${v.title}</span>${v.blurb ? `<span class="body-sm !text-brand-100 block mt-2 max-w-md hidden sm:block">${v.blurb}</span>` : ''}</span>` : ''}
    </button>`;
  const vf = $('#videoFeature'), vl = $('#videoList');
  if (vf && vl) {
    vf.innerHTML = `<div class="reveal">${thumb(DATA.videos[0], 0, true)}</div>`;
    vl.innerHTML = DATA.videos.slice(1).map((v, k) => `
      <div class="reveal" style="--d:${(k + 1) * 0.1}s"><div class="vitem" role="button" tabindex="0" data-video="${k + 1}" aria-label="Play: ${v.title}">
        ${thumb(v, k + 1, false).replace('<button', '<span').replace('</button>', '</span>').replace(/data-video="\d+"/, '').replace(/aria-label="[^"]*"/, '')}
        <div><span class="badge">${v.tag}</span><h3 class="hd-3 mt-2">${v.title}</h3><span class="caption">Watch now</span></div></div></div>`).join('');
  }
  const ch = $('#channelLink'); if (ch) ch.href = DATA.channel;

  /* ---------- modal ---------- */
  const modal = $('#videoModal'), frame = $('#videoFrame');
  const open = (i) => {
    const v = DATA.videos[i]; if (!v || !modal) return;
    frame.innerHTML = v.id
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0" title="${v.title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : `<div><span class="badge badge-accent">${v.tag}</span><h3 class="hd-2 !text-white mt-4">${v.title}</h3><p class="body-sm mt-3 max-w-md mx-auto">This video is coming soon. Add its YouTube ID in <b>assets/js/content.js</b> to play it here.</p></div>`;
    modal.showModal();
  };
  const close = () => { frame.innerHTML = ''; if (modal.open) modal.close(); };
  document.addEventListener('click', (e) => {
    const t = e.target.closest?.('[data-video]'); if (t) { open(+t.dataset.video); return; }
    if (e.target === modal || e.target.closest?.('[data-close]')) close();
  });
  document.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('.vitem')) { e.preventDefault(); open(+e.target.dataset.video); } });
  modal?.addEventListener('close', () => { frame.innerHTML = ''; });

  /* reveal for elements created after ui.js ran */
  if (window.IntersectionObserver) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    document.querySelectorAll('#bookFeature .reveal, #bookList .reveal, #videoFeature .reveal, #videoList .reveal').forEach((el) => (still ? el.classList.add('in') : io.observe(el)));
  }

  /* ---------- newsletter (front-end only — connect to your email service) ---------- */
  $('#newsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget, m = $('#newsMsg'), v = new FormData(f).get('email') || '';
    const ok = /^\S+@\S+\.\S+$/.test(v);
    m.textContent = ok ? 'Thanks — you are subscribed.' : 'Please enter a valid email address.';
    m.style.color = ok ? 'rgb(var(--c-success))' : 'rgb(var(--c-accent-300))'; if (ok) f.reset();
  });

  /* ---------- hero word rotator ---------- */
  const rot = $('.rotator');
  if (rot && !matchMedia('(prefers-reduced-motion: reduce)').matches && !still) {
    const items = [...rot.children]; let i = 0;
    setInterval(() => {
      items[i].classList.replace('on', 'out');
      const prev = items[i]; i = (i + 1) % items.length; items[i].classList.remove('out'); items[i].classList.add('on');
      setTimeout(() => prev.classList.remove('out'), 700);
    }, 2800);
  }
})();
