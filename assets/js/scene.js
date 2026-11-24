/* AMBIENT BACKGROUND (Three.js) — v3
   A calm, cinematic backdrop: drifting blue/amber particles and a few soft light orbs behind the
   dark sections, with gentle mouse + scroll parallax. The hero's visual is now photographic (see hero2.css).
   Colours come from the CSS tokens. Classic script + dynamic import => works from file://. */
(async () => {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
  const canvas = document.getElementById('bg'); if (!canvas) return;

  const css = getComputedStyle(document.documentElement);
  const tok = (n) => { const [r, g, b] = css.getPropertyValue('--c-' + n).trim().split(/\s+/).map(Number); return new THREE.Color(r / 255, g / 255, b / 255); };
  const C = { ink: tok('ink'), b300: tok('brand-300'), b500: tok('brand-500'), a400: tok('accent-400'), a500: tok('accent-500') };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rgba = (c, a = 1) => `rgba(${c.r * 255 | 0},${c.g * 255 | 0},${c.b * 255 | 0},${a})`;
  const glowTex = (c) => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, rgba(c)); gr.addColorStop(.4, rgba(c, .3)); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(cv); };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight); renderer.setClearColor(C.ink);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 200); camera.position.set(0, 0, 30);

  const gBlue = glowTex(C.b300), gAmber = glowTex(C.a400);
  const sprite = (map, col, op, size, x, y, z) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map, color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })); s.scale.setScalar(size); s.position.set(x, y, z); scene.add(s); return s; };
  const orbs = [sprite(gBlue, C.b500, .38, 46, 14, 4, -20), sprite(gAmber, C.a500, .16, 34, -22, -10, -25), sprite(gBlue, C.b500, .26, 40, -10, 18, -30)];

  const mkDust = (n, col, size, op, tex) => {
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { p[i * 3] = (Math.random() - .5) * 110; p[i * 3 + 1] = (Math.random() - .5) * 80; p[i * 3 + 2] = (Math.random() - .5) * 60 - 8; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size, map: tex, color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(pts); return pts;
  };
  const dustB = mkDust(900, C.b300, .24, .65, gBlue), dustA = mkDust(160, C.a400, .3, .6, gAmber);

  let mx = 0, my = 0, tx = 0, ty = 0, sp = 0, ss = 0;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  addEventListener('scroll', () => { sp = scrollY / Math.max(1, document.body.scrollHeight - innerHeight); }, { passive: true });
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  const clock = new THREE.Clock();

  (function frame() {
    const t = reduce ? 0 : clock.getElapsedTime();
    ss += (sp - ss) * .06; tx += (mx - tx) * .03; ty += (my - ty) * .03;
    dustB.rotation.y = t * .012 + tx * .15; dustB.position.y = ss * 26 + Math.sin(t * .2) * .6;
    dustA.rotation.y = -t * .018 + tx * .2; dustA.position.y = ss * 34 + Math.sin(t * .25) * .8;
    orbs.forEach((o, i) => { o.position.x += Math.sin(t * .15 + i) * .006; o.position.y += Math.cos(t * .12 + i * 2) * .005; });
    camera.position.x = tx * 3; camera.position.y = -ty * 2; camera.lookAt(0, 0, 0);
    canvas.style.opacity = Math.max(0.5, 1 - ss * 3).toFixed(3);
    renderer.render(scene, camera); requestAnimationFrame(frame);
  })();
})();
