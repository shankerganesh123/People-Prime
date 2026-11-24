/* HERO — "The HR universe" (v2)
   A glass POSH shield at the centre scans and pulses; the services orbit it as 3D objects:
   team (talent acquisition) · coins (payroll) · documents (JD & SOP) · growth bars (development)
   · magnifier (audit) · scales (legal) · cog (automation) · buildings (industries).
   Comets race around the orbit rings, data motes rise around the core, labels follow each object,
   and the camera performs a short cinematic push-in on load. Colours come from the CSS tokens.
   Classic script + dynamic import => also works from file://. */
(async () => {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
  const canvas = document.getElementById('bg'); if (!canvas) return;

  /* ---------- tokens ---------- */
  const css = getComputedStyle(document.documentElement);
  const tok = (n) => { const [r, g, b] = css.getPropertyValue('--c-' + n).trim().split(/\s+/).map(Number); return new THREE.Color(r / 255, g / 255, b / 255); };
  const C = { ink: tok('ink'), b300: tok('brand-300'), b400: tok('brand-400'), b500: tok('brand-500'), b600: tok('brand-600'), b700: tok('brand-700'), b800: tok('brand-800'), a300: tok('accent-300'), a400: tok('accent-400'), a500: tok('accent-500') };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = document.documentElement.classList.contains('still');
  const rgba = (c, a = 1) => `rgba(${c.r * 255 | 0},${c.g * 255 | 0},${c.b * 255 | 0},${a})`;
  const glowTex = (c) => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, rgba(c)); gr.addColorStop(.35, rgba(c, .35)); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(cv); };

  /* ---------- renderer / scene ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setSize(innerWidth, innerHeight); renderer.setClearColor(C.ink);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(C.ink, 0.012);
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, .1, 300); camera.position.set(0, 1.5, 27);

  /* studio reflections: a tiny scene of soft-boxes baked to an environment map */
  const pm = new THREE.PMREMGenerator(renderer), envS = new THREE.Scene(); envS.background = new THREE.Color(0x02060d);
  const panel = (w, h, col, k, pos) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col.clone().multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(...pos); m.lookAt(0, 0, 0); envS.add(m); };
  panel(34, 12, new THREE.Color(1, 1, 1), 3.2, [0, 22, 10]); panel(14, 34, C.b400, 2.6, [-26, 0, 6]); panel(14, 34, C.a400, 2.2, [26, 2, -4]); panel(44, 6, C.b300, 1.4, [0, -16, 14]);
  scene.environment = pm.fromScene(envS, 0.04).texture; pm.dispose();

  scene.add(new THREE.AmbientLight(C.b300, .35));
  const key = new THREE.PointLight(0xffffff, 90, 90); key.position.set(10, 14, 16); scene.add(key);
  const rim = new THREE.PointLight(C.a500, 70, 90); rim.position.set(-16, -4, 10); scene.add(rim);

  const gBlue = glowTex(C.b300), gAmber = glowTex(C.a400);
  const spriteMat = (map, col, op) => new THREE.SpriteMaterial({ map, color: col, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: op });
  const phys = (o) => new THREE.MeshPhysicalMaterial(o);
  const M = {
    blue:  phys({ color: C.b400, emissive: C.b600, emissiveIntensity: .5, metalness: .35, roughness: .28, clearcoat: .8, clearcoatRoughness: .2 }),
    deep:  phys({ color: C.b600, emissive: C.b800, emissiveIntensity: .7, metalness: .4, roughness: .3, clearcoat: .6 }),
    amber: phys({ color: C.a400, emissive: C.a500, emissiveIntensity: .45, metalness: .75, roughness: .22, clearcoat: 1, clearcoatRoughness: .12 }),
    paper: phys({ color: 0xeaf3fd, emissive: C.b400, emissiveIntensity: .18, metalness: 0, roughness: .55 }),
    glass: phys({ color: C.b500, emissive: C.b700, emissiveIntensity: .5, metalness: .55, roughness: .1, clearcoat: 1, clearcoatRoughness: .05, transparent: true, opacity: .78 }),
  };
  const edges = (geo, col = C.b300, op = .75) => new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: op }));
  const add = (g, mesh, x = 0, y = 0, z = 0) => { mesh.position.set(x, y, z); g.add(mesh); return mesh; };
  const mesh = (geo, mat) => new THREE.Mesh(geo, mat);

  /* ---------- object builders (one per service) ---------- */
  const person = (h, mat) => { const g = new THREE.Group();
    add(g, mesh(new THREE.CapsuleGeometry(.26, h, 6, 14), mat), 0, h / 2 + .26);
    add(g, mesh(new THREE.SphereGeometry(.23, 24, 24), mat), 0, h + .26 * 2 + .32); return g; };
  const teamObj = () => { const g = new THREE.Group();
    add(g, person(.5, M.blue), -.75, 0, 0); add(g, person(.75, M.amber), 0, 0, .15); add(g, person(.58, M.blue), .75, 0, 0);
    add(g, mesh(new THREE.TorusGeometry(1.25, .035, 8, 48), M.deep)).rotation.x = Math.PI / 2; g.position.y = -.9; const w = new THREE.Group(); w.add(g); return w; };
  const coinObj = () => { const g = new THREE.Group();
    for (let i = 0; i < 6; i++) add(g, mesh(new THREE.CylinderGeometry(.62, .62, .15, 36), M.amber), (i % 2) * .05, i * .17 - .5, 0);
    const top = add(g, mesh(new THREE.CylinderGeometry(.62, .62, .15, 36), M.amber), .9, .15, .5); top.rotation.set(1.1, 0, .4);
    add(g, mesh(new THREE.TorusGeometry(.64, .03, 8, 32), M.paper), 0, .55, 0).rotation.x = Math.PI / 2; return g; };
  const docObj = () => { const g = new THREE.Group();
    const mk = (x, z, r) => { const d = new THREE.Group(); const geo = new THREE.BoxGeometry(1.15, 1.55, .06); d.add(mesh(geo, M.paper), edges(geo, C.b400, .6));
      [0.45, .15, -.15, -.45].forEach((y, i) => add(d, mesh(new THREE.BoxGeometry(i === 0 ? .6 : .8, .06, .07), i === 0 ? M.amber : M.deep), i === 0 ? -.2 : 0, y, .05)); d.position.set(x, 0, z); d.rotation.y = r; return d; };
    g.add(mk(-.35, -.2, .35), mk(.35, .2, -.25)); return g; };
  const barsObj = () => { const g = new THREE.Group();
    [.7, 1.1, 1.6, 2.2].forEach((h, i) => { const geo = new THREE.BoxGeometry(.42, h, .42); const b = add(g, mesh(geo, i === 3 ? M.amber : M.blue), (i - 1.5) * .6, h / 2 - 1); b.add(edges(geo, C.b300, .5)); });
    const arrow = add(g, mesh(new THREE.ConeGeometry(.28, .6, 20), M.amber), 1.1, 1.7); arrow.rotation.z = -.5; g.userData.arrow = arrow; return g; };
  const magObj = () => { const g = new THREE.Group();
    add(g, mesh(new THREE.TorusGeometry(.78, .11, 16, 44), M.amber)); add(g, mesh(new THREE.CircleGeometry(.72, 36), M.glass));
    const h = add(g, mesh(new THREE.CylinderGeometry(.11, .13, .95, 16), M.amber), .95, -.95); h.rotation.z = Math.PI / 4;
    const t = add(g, mesh(new THREE.TorusGeometry(.35, .04, 8, 24, Math.PI * 1.2), M.paper), -.05, .05, .05); t.rotation.z = .6; return g; };
  const scalesObj = () => { const g = new THREE.Group();
    add(g, mesh(new THREE.CylinderGeometry(.08, .1, 2.3, 12), M.amber), 0, 0); add(g, mesh(new THREE.CylinderGeometry(.5, .6, .12, 28), M.deep), 0, -1.2);
    const beam = add(g, mesh(new THREE.BoxGeometry(2.3, .09, .09), M.amber), 0, 1.05);
    [-1, 1].forEach((s) => { add(g, mesh(new THREE.CylinderGeometry(.55, .4, .12, 28), M.blue), s * 1.05, .05);
      [-.3, .3].forEach((dx) => { const l = add(g, mesh(new THREE.CylinderGeometry(.015, .015, 1, 6), M.paper), s * 1.05 + dx, .55); l.rotation.z = -dx * .9 * s; }); });
    g.userData.beam = beam; return g; };
  const cogObj = () => { const g = new THREE.Group();
    add(g, mesh(new THREE.TorusGeometry(.7, .22, 14, 40), M.blue));
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; const t = add(g, mesh(new THREE.BoxGeometry(.3, .34, .46), M.blue), Math.cos(a) * 1.0, Math.sin(a) * 1.0); t.rotation.z = a; }
    add(g, mesh(new THREE.CylinderGeometry(.22, .22, .5, 24), M.amber)).rotation.x = Math.PI / 2; g.userData.spin = true; return g; };
  const cityObj = () => { const g = new THREE.Group();
    [[-.8, 1.1, .6], [-.1, 1.9, .7], [.65, 1.4, .6], [1.2, .8, .5]].forEach(([x, h, w], i) => { const geo = new THREE.BoxGeometry(w, h, w); const b = add(g, mesh(geo, M.glass), x, h / 2 - .95); b.add(edges(geo, i === 1 ? C.a400 : C.b300, .8)); });
    return g; };
  const shieldObj = () => { const g = new THREE.Group();
    const s = new THREE.Shape(); s.moveTo(0, 1.9); s.lineTo(1.45, 1.35); s.lineTo(1.45, .1); s.bezierCurveTo(1.45, -1.05, .65, -1.75, 0, -2.1); s.bezierCurveTo(-.65, -1.75, -1.45, -1.05, -1.45, .1); s.lineTo(-1.45, 1.35); s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: .45, bevelEnabled: true, bevelThickness: .14, bevelSize: .14, bevelSegments: 5, curveSegments: 24 }); geo.center();
    const body = add(g, mesh(geo, M.glass)); body.add(edges(geo, C.b300, .5));
    const inner = add(g, mesh(geo, M.deep), 0, 0, -.02); inner.scale.set(.8, .8, .55);
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-.65, -.05, 0), new THREE.Vector3(-.15, -.6, 0), new THREE.Vector3(.75, .6, 0)]);
    const check = add(g, mesh(new THREE.TubeGeometry(curve, 28, .14, 12, false), M.amber), 0, .05, .52); g.userData.check = check;
    g.scale.setScalar(1.35); return g; };

  /* ---------- assemble ---------- */
  const hr = new THREE.Group(); scene.add(hr);
  const core = shieldObj(); hr.add(core);
  const halo = new THREE.Sprite(spriteMat(gBlue, C.b500, .45)); halo.scale.setScalar(11); hr.add(halo);
  const halo2 = new THREE.Sprite(spriteMat(gAmber, C.a500, .22)); halo2.scale.setScalar(6.5); hr.add(halo2);

  /* scanner + shockwave around the shield */
  const scan = new THREE.Mesh(new THREE.TorusGeometry(2.35, .025, 8, 96), new THREE.MeshBasicMaterial({ color: C.a400, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false })); scan.rotation.x = Math.PI / 2; hr.add(scan);
  const wave = new THREE.Mesh(new THREE.RingGeometry(.96, 1, 96), new THREE.MeshBasicMaterial({ color: C.b300, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); wave.rotation.x = Math.PI / 2; wave.position.y = -2.4; hr.add(wave);

  /* ground grid */
  const grid = new THREE.GridHelper(40, 40, C.b500, C.b800); grid.position.y = -7.2; grid.material.transparent = true; grid.material.opacity = .22; hr.add(grid);

  const builders = [teamObj, coinObj, docObj, barsObj, magObj, scalesObj, cogObj, cityObj];
  const names = [['Talent Acquisition', 'users'], ['Payroll & HR Ops', 'calc'], ['JD & SOP', 'doc'], ['Talent Development', 'chart'], ['HR Audit', 'search'], ['Legal & Compliance', 'scale'], ['HR Automation', 'gear'], ['Industries', 'factory']];
  const sats = builders.map((b, i) => {
    const g = new THREE.Group(); const obj = b(); g.add(obj);
    const a = i / builders.length * Math.PI * 2 + .3, r = 8.3 + (i % 2) * 1.5, y = Math.sin(a * 2 + .5) * 2.6;
    g.position.set(Math.cos(a) * r, y, Math.sin(a) * r); g.scale.setScalar(1.8);
    const sp = new THREE.Sprite(spriteMat(gBlue, C.b400, .5)); sp.scale.setScalar(5.5); g.add(sp);
    hr.add(g); return { g, obj, base: g.position.clone(), ph: i * 1.3, spin: !!obj.userData.spin };
  });

  /* orbit rings with comets */
  const rings = [[8.3, .28, -.12, 1], [9.8, .14, .18, -.7]].map(([r, o, tilt, dir]) => {
    const rg = new THREE.Group(); rg.rotation.x = tilt; hr.add(rg);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, .014, 6, 200), new THREE.MeshBasicMaterial({ color: C.b300, transparent: true, opacity: o })); ring.rotation.x = Math.PI / 2; rg.add(ring);
    const comets = []; for (let k = 0; k < 3; k++) for (let j = 0; j < 7; j++) { const s = new THREE.Sprite(spriteMat(k % 2 ? gBlue : gAmber, k % 2 ? C.b300 : C.a400, (1 - j / 7) * .9)); s.scale.setScalar(1.1 * (1 - j * .1)); rg.add(s); comets.push({ s, k, j }); }
    return { rg, r, dir, comets };
  });

  /* links: core <-> satellites + neighbours; amber pulses travel along them */
  const segs = []; sats.forEach((s, i) => { segs.push([null, s]); segs.push([s, sats[(i + 1) % sats.length]]); });
  const lpos = new Float32Array(segs.length * 6), lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(lpos, 3));
  hr.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: C.b400, transparent: true, opacity: .3, blending: THREE.AdditiveBlending })));
  const P = 30, pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P * 3), 3));
  const pulses = Array.from({ length: P }, () => ({ s: sats[Math.random() * sats.length | 0], t: Math.random(), v: .004 + Math.random() * .008, out: Math.random() > .5 }));
  hr.add(new THREE.Points(pg, new THREE.PointsMaterial({ size: .65, map: gAmber, color: C.a400, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));

  /* rising data motes around the core */
  const MN = 150, mpos = new Float32Array(MN * 3), mv = [];
  for (let i = 0; i < MN; i++) { const a = Math.random() * 6.28, r = 1.6 + Math.random() * 2.6; mpos[i * 3] = Math.cos(a) * r; mpos[i * 3 + 1] = Math.random() * 13 - 6.5; mpos[i * 3 + 2] = Math.sin(a) * r; mv.push(.01 + Math.random() * .03); }
  const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.BufferAttribute(mpos, 3));
  hr.add(new THREE.Points(mg, new THREE.PointsMaterial({ size: .22, map: gBlue, color: C.b300, transparent: true, opacity: .85, blending: THREE.AdditiveBlending, depthWrite: false })));

  /* dust */
  const D = 1200, dp = new Float32Array(D * 3);
  for (let i = 0; i < D; i++) { dp[i * 3] = (Math.random() - .5) * 120; dp[i * 3 + 1] = (Math.random() - .5) * 90; dp[i * 3 + 2] = (Math.random() - .5) * 80 - 10; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ size: .2, map: gBlue, color: C.b300, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(dust);

  /* ---------- HTML labels that follow the objects ---------- */
  const box = document.createElement('div'); box.id = 'heroLabels'; document.body.appendChild(box);
  const mkLabel = (txt, ic, cls = '') => { const el = document.createElement('div'); el.className = 'hl ' + cls; el.innerHTML = `<i>${window.PP ? PP.icon(ic) : ''}</i><span>${txt}</span>`; box.appendChild(el); return el; };
  const labels = [{ el: mkLabel('POSH Compliance', 'shield', 'core'), obj: core, dy: -128, core: true }, ...sats.map((s, i) => ({ el: mkLabel(names[i][0], names[i][1]), obj: s.g, dy: [46, 46, 50, 46, -44, 46, 50, -40][i] }))];

  /* ---------- interaction + loop ---------- */
  let mx = 0, my = 0, tx = 0, ty = 0, sp = 0, ss = 0;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  addEventListener('scroll', () => { sp = scrollY / Math.max(1, document.body.scrollHeight - innerHeight); }, { passive: true });
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  const clock = new THREE.Clock(), tmp = new THREE.Vector3(), zero = new THREE.Vector3(), pa = pg.attributes.position, la = lg.attributes.position, ma = mg.attributes.position;
  const ease = (x) => 1 - Math.pow(1 - x, 3);

  (function frame() {
    const t = reduce ? 0 : clock.getElapsedTime();
    const intro = (still || reduce) ? 1 : ease(Math.min(t / 3.2, 1));
    ss += (sp - ss) * .06; tx += (mx - tx) * .04; ty += (my - ty) * .04;
    const wide = innerWidth > 1024, base = wide ? .8 : .55;
    hr.position.x = (wide ? 8.9 : 0) - ss * 26; hr.position.y = (wide ? 0 : 3.5) + ss * 22;
    hr.scale.setScalar(base * (.45 + .55 * intro));
    hr.rotation.y = t * .09 + tx * .7 + ss * 3 + (1 - intro) * 3.2; hr.rotation.x = ty * .25 + .12;

    core.rotation.y = Math.sin(t * .6) * .35; core.position.y = Math.sin(t * .9) * .25;
    core.userData.check && (core.userData.check.material.emissiveIntensity = .45 + Math.sin(t * 3) * .25);
    halo.material.opacity = .4 + Math.sin(t * 1.5) * .1; halo2.material.opacity = .22 + Math.sin(t * 2.1) * .1;

    /* scanner sweeps up and down; shockwave expands every 4 s */
    scan.position.y = Math.sin(t * 1.1) * 2.4; scan.material.opacity = .35 + (1 - Math.abs(Math.sin(t * 1.1))) * .5;
    const wp = (t % 4) / 4; wave.scale.setScalar(2 + wp * 9); wave.material.opacity = (1 - wp) * .55;

    sats.forEach((s) => {
      s.g.position.y = s.base.y + Math.sin(t * .8 + s.ph) * .5;
      s.g.rotation.y = -hr.rotation.y + Math.sin(t * .4 + s.ph) * .5;
      s.obj.rotation.y = s.spin ? t * .8 : Math.sin(t * .5 + s.ph) * .25;
      if (s.obj.userData.beam) s.obj.userData.beam.rotation.z = Math.sin(t * 1.2) * .08;
      if (s.obj.userData.arrow) s.obj.userData.arrow.position.y = 1.7 + Math.sin(t * 2) * .12;
    });
    segs.forEach(([a, b], i) => { const p = a ? a.g.position : zero; la.setXYZ(i * 2, p.x, p.y, p.z); la.setXYZ(i * 2 + 1, b.g.position.x, b.g.position.y, b.g.position.z); });
    la.needsUpdate = true;
    pulses.forEach((p, i) => { if (!reduce) p.t += p.v; if (p.t > 1) { p.t = 0; p.s = sats[Math.random() * sats.length | 0]; p.out = Math.random() > .5; }
      tmp.copy(p.out ? zero : p.s.g.position).lerp(p.out ? p.s.g.position : zero, p.t); pa.setXYZ(i, tmp.x, tmp.y, tmp.z); });
    pa.needsUpdate = true;
    rings.forEach(({ rg, r, dir, comets }) => comets.forEach(({ s, k, j }) => { const a = dir * t * .55 + k * 2.094 - j * .055 * dir; s.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); }));
    for (let i = 0; i < MN; i++) { let y = ma.getY(i) + (reduce ? 0 : mv[i]); if (y > 6.5) y = -6.5; ma.setY(i, y); } ma.needsUpdate = true;

    dust.rotation.y = t * .01 + ss * .5; dust.position.y = ss * 12;
    camera.position.x = tx * 2.5; camera.position.y = 1.5 - ty * 1.5; camera.position.z = 27 + (1 - intro) * 16; camera.lookAt(0, 0, 0);
    key.position.x = 10 + Math.sin(t * .5) * 8;
    canvas.style.opacity = Math.max(0.38, 1 - ss * 4).toFixed(3);

    /* project labels */
    scene.updateMatrixWorld();
    const fade = Math.max(0, 1 - ss * 30) * Math.min(1, Math.max(0, (intro - .6) / .4));
    labels.forEach(({ el, obj, dy, core: isCore }) => {
      obj.getWorldPosition(tmp); const d = tmp.distanceTo(camera.position); tmp.project(camera);
      const x = (tmp.x * .5 + .5) * innerWidth, y = (-tmp.y * .5 + .5) * innerHeight;
      const depth = isCore ? 1 : Math.min(1, Math.max(.25, (40 - d) / 14));
      el.style.opacity = (fade * depth).toFixed(3);
      el.style.transform = `translate(${x.toFixed(1)}px, ${(y + dy).toFixed(1)}px) translate(-50%, 0) scale(${(.85 + depth * .15).toFixed(3)})`;
    });
    renderer.render(scene, camera); requestAnimationFrame(frame);
  })();
})();
