/* ═══════════════════════════════════════════════════════════
   FAIRUS.SYS — script v2
   vanilla JS · no dependencies
   v2: bukti foto + lightbox · terminal = section 2 · UX ramah awam
   ═══════════════════════════════════════════════════════════ */
(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────── DATA ─────────── */
  // Evidence path: assets/evidence/<file>. Setelah masuk modal, klik foto untuk perbesar.
  const PROJECTS = [
    {
      id: 'V.01', cat: 'vision', catLabel: 'COMPUTER VISION', conf: 0.99,
      title: 'Face Detection — Laptop & ESP32-CAM',
      desc: 'Proyek computer vision pertama: webcam laptop menangkap wajah dan menandainya secara real-time — lalu dijalankan juga di kamera ESP32-CAM yang mungil.',
      tech: ['Python', 'OpenCV', 'ESP32-CAM'],
      evidence: [
        { src: 'assets/evidence/esp32cam-stream.jpg', cap: 'Streaming ESP32-CAM di browser — live feed aktif (webcam + kamera)' },
        { src: 'assets/evidence/esp32cam-module.jpg', cap: 'Modul ESP32-CAM + kamera OV2640 yang dipakai untuk deteksi' }
      ],
      what: [
        'Pipeline deteksi wajah real-time dari webcam laptop',
        'Model di-deploy ke ESP32-CAM dan streaming hasilnya',
        'Overlay bounding box + label langsung di frame'
      ],
      learn: [
        'Cara kerja pipeline computer vision dari kamera ke model',
        'Akses stream kamera dan pemrosesan frame di Python',
        'Perbedaan komputasi laptop vs perangkat embedded'
      ]
    },
    {
      id: 'V.02', cat: 'vision', catLabel: 'COMPUTER VISION', conf: 0.97,
      title: 'Object Detection — Laptop & ESP32-CAM',
      desc: 'Naik level dari wajah: komputer belajar mengenali berbagai benda, baik dari webcam laptop maupun kamera ESP32-CAM — bahkan bisa dites dari kamera HP lewat jaringan.',
      tech: ['Python', 'OpenCV', 'ESP32-CAM'],
      evidence: [
        { src: 'assets/evidence/object-detection-phone.jpg', cap: 'Deteksi objek diakses dari HP (via WiFi) — bounding box + label confidence langsung di browser HP' },
        { src: 'assets/evidence/esp32cam-module.jpg', cap: 'Hardware ESP32-CAM — otak di balik deteksi objek embedded' },
        { src: 'assets/evidence/esp32cam-stream.jpg', cap: 'Hasil deteksi tampil di halaman web — kamera dikontrol dari browser' }
      ],
      what: [
        'Deteksi multi-objek dengan bounding box dan label kelas',
        'Eksperimen yang sama di perangkat laptop dan embedded',
        'Tuning threshold supaya deteksi stabil'
      ],
      learn: [
        'Konsep model object detection dan class prediction',
        'Menyeimbangkan akurasi dan kecepatan di perangkat terbatas',
        'Visualisasi hasil deteksi yang rapi'
      ]
    },
    {
      id: 'V.03', cat: 'vision', catLabel: 'COMPUTER VISION', conf: 0.98,
      title: 'YOLOv8 — Deteksi Objek Modern',
      desc: 'Proyek YOLOv8: framework deteksi objek modern yang cepat dan akurat — dipakai untuk mendeteksi objek dari kamera secara real-time.',
      tech: ['Python', 'YOLOv8', 'Ultralytics', 'OpenCV'],
      evidence: [
        { src: 'assets/evidence/esp32cam-stream.jpg', cap: 'Uji coba deteksi real-time — feed kamera di browser' }
      ],
      what: [
        'Deteksi objek real-time pakai arsitektur YOLOv8',
        'Kustomisasi inference: confidence & IoU threshold',
        'Analisis hasil deteksi per frame'
      ],
      learn: [
        'Cara kerja arsitektur YOLO generasi terbaru',
        'Workflow inference model di Ultralytics',
        'Praktik terbaik menampilkan hasil deteksi'
      ]
    },
    {
      id: 'V.04', cat: 'vision', catLabel: 'COMPUTER VISION', conf: 0.96,
      title: 'Hand Detection — HuggingFace',
      desc: 'Eksplorasi ekosistem open-source: deteksi tangan real-time dengan 21 keypoint (MediaPipe Hands / TensorFlow.js), demo langsung dari browser.',
      tech: ['Python', 'HuggingFace', 'Transformers', 'OpenCV'],
      evidence: [
        { src: 'assets/evidence/hand-detection.jpg', cap: 'Demo hand pose detection — 21 keypoint terdeteksi, ~21 FPS di browser' }
      ],
      what: [
        'Deteksi tangan real-time dengan 21 titik keypoint + render 3D',
        'Eksplorasi model siap-pakai dari ekosistem open-source',
        'Integrasi model ke pipeline kamera sendiri'
      ],
      learn: [
        'Cara mencari dan memakai model open-source di HuggingFace',
        'Adaptasi API model ke dalam aplikasi sendiri',
        'Eksperimen inference dengan model komunitas'
      ]
    },
    {
      id: 'E.01', cat: 'embedded', catLabel: 'EMBEDDED & IOT', conf: 0.99,
      title: 'ESP32-CAM × Web — Kontrol Kamera dari Browser',
      desc: 'Kamera ESP32-CAM disambungkan ke web buatan sendiri: setting kamera, atur parameter, dan pantau feed langsung dari browser.',
      tech: ['ESP32-CAM', 'Arduino', 'JavaScript', 'Web'],
      evidence: [
        { src: 'assets/evidence/esp32cam-stream.jpg', cap: 'Halaman web kontrol kamera — semua setting bisa diubah dari browser' },
        { src: 'assets/evidence/esp32cam-module.jpg', cap: 'Modul fisik: ESP32-CAM + OV2640, LED merah menyala (aktif)' }
      ],
      what: [
        'ESP32-CAM tersambung ke web aplikasi buatan sendiri',
        'Panel pengaturan kamera: parameter bisa diubah dari web',
        'Streaming gambar dari perangkat ke halaman web'
      ],
      learn: [
        'Komunikasi perangkat embedded dengan server web',
        'Merancang antarmuka kontrol untuk perangkat fisik',
        'Handling stream dan koneksi jaringan yang tidak stabil'
      ]
    },
    {
      id: 'E.02', cat: 'embedded', catLabel: 'EMBEDDED & IOT', conf: 0.94,
      title: 'Arduino + LCD I2C & Prototipe Breadboard',
      desc: 'Eksperimen dasar embedded: Arduino Uno mengendalikan LCD 16x2 via I2C, plus latihan wiring di breadboard dengan potentiometer dan rainbow cable.',
      tech: ['Arduino', 'LCD I2C', 'Breadboard', 'Solderless Wiring'],
      evidence: [
        { src: 'assets/evidence/arduino-lcd.jpg', cap: 'LCD 16x2 I2C hidup dengan pola test — rangkaian jalan!' },
        { src: 'assets/evidence/breadboard.jpg', cap: 'Latihan wiring: breadboard, potentiometer, dan rainbow cable' }
      ],
      what: [
        'Arduino Uno mengendalikan LCD 16x2 via I2C (2 kabel saja)',
        'Latihan wiring & tata letak komponen di breadboard',
        'Debugging rangkaian fisik dari nol'
      ],
      learn: [
        'Dasar komunikasi I2C dan addressing perangkat',
        'Membaca skematik dan mewujudkannya jadi rangkaian nyata',
        'Sabar debugging hardware — jalur kabel satu per satu'
      ]
    },
    {
      id: 'A.01', cat: 'agents', catLabel: 'AI AGENTS', conf: 0.95,
      title: 'AI Agent Development Kit — Google',
      desc: 'Membangun agent AI utuh menggunakan Agent Development Kit (ADK) dari Google: instruksi, tools, dan eksekusi dalam satu arsitektur — termasuk agent auditor LLM.',
      tech: ['Google ADK', 'Python', 'LLM', 'Cloud Shell'],
      evidence: [
        { src: 'assets/evidence/adk-webui.jpg', cap: 'ADK Web UI — agent graph + trace eksekusi (llm_auditor → critic → reviser)' },
        { src: 'assets/evidence/adk-cloudshell.jpg', cap: 'Cloud Shell: kode agent llm_auditor + SequentialAgent(sub_agents=[...])' }
      ],
      what: [
        'Agent pertama dengan struktur instruksi + tools',
        'ADK Web UI: visualisasi agent graph dan event trace',
        'Agent auditor yang mengecek akurasi jawaban LLM via Google Search'
      ],
      learn: [
        'Anatomi agent: model, instruksi, tools, sesi',
        'Cara mendesain tool yang aman dan berguna',
        'Debugging perilaku agent yang tidak terduga'
      ]
    },
    {
      id: 'A.02', cat: 'agents', catLabel: 'AI AGENTS', conf: 1.00,
      title: 'Hermes Agent × Telegram × 9Router',
      desc: 'Integrasi penuh: agent Hermes disambungkan ke Telegram dan routing model 9Router — agent yang bisa dihubungi lewat chat, jalan 24/7 di VPS.',
      tech: ['Hermes Agent', 'Telegram Bot API', '9Router', 'Linux VPS'],
      evidence: [
        { src: 'assets/evidence/hermes-cli.jpg', cap: 'Hermes CLI jalan di terminal — 24 tools · 54 skills aktif, siap menerima perintah' },
        { src: 'assets/evidence/hermes-gateway.jpg', cap: 'Gateway status: service active (running), Telegram connected (polling)' },
        { src: 'assets/evidence/hermes-install.jpg', cap: 'Proses instalasi Hermes di VPS dari terminal' },
        { src: 'assets/evidence/vps-dashboard.jpg', cap: 'VPS Ubuntu 26.04 LTS (KVM 2) — rumah tempat semua berjalan' }
      ],
      what: [
        'Agent Hermes terhubung ke bot Telegram — bisa di-chat dari HP',
        'Routing model via 9Router: banyak LLM dalam satu pintu',
        'Berjalan mandiri di VPS dengan cron job terjadwal'
      ],
      learn: [
        'Arsitektur integrasi agent ↔ messaging platform',
        'Setup routing multi-model dan fallback',
        'Operasional bot 24/7: log, restart, dan monitoring'
      ]
    },
    {
      id: 'W.01', cat: 'web', catLabel: 'WEB APP', conf: 0.93,
      title: 'Web App "Aasta Vikrayana" — Multi-Device Test',
      desc: 'Aplikasi web jualan makanan: navbar dinamis saat scroll dan flow pembelian interaktif — dites langsung di Android Emulator dari Live Server.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Live Server'],
      evidence: [
        { src: 'assets/evidence/food-app.jpg', cap: 'Testing di Android Emulator — navbar & tombol "Beli Sekarang" berfungsi' }
      ],
      what: [
        'Navbar berubah warna dinamis mengikuti posisi scroll',
        'Halaman produk dengan harga dan tombol aksi',
        'Dites cross-device via emulator Android'
      ],
      learn: [
        'Manipulasi DOM: event listener scroll & class toggle',
        'Pentingnya tes di beberapa ukuran layar',
        'Alur development web harian: edit → refresh → tes'
      ]
    }
  ];

  const BOOT_LINES = [
    { t: 'FAIRUS.SYS v2.6.0 — boot sequence', cls: 'dim' },
    { t: 'loading kernel modules ......... [OK]' },
    { t: 'mounting /vision /agents /web .. [OK]' },
    { t: 'inference engine warmup ........ [OK]' },
    { t: 'detection models loaded (9) .... [OK]', cls: 'dim' },
    { t: '> all systems nominal.', cls: 'acc' }
  ];

  /* ─────────── UTIL ─────────── */
  let toastTimer;
  const toast = (msg) => {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ─────────── BOOT ─────────── */
  const boot = $('#boot');
  const bootLog = $('#bootLog');
  let bootDone = false;
  const finishBoot = () => {
    if (bootDone || !boot) return;
    bootDone = true;
    boot.classList.add('done');
    document.body.classList.add('ready');
    setTimeout(() => boot.remove(), 600);
    revealNow();
  };
  const runBoot = () => {
    if (REDUCED || !bootLog) { finishBoot(); return; }
    let i = 0;
    const next = () => {
      if (bootDone || i >= BOOT_LINES.length) { setTimeout(finishBoot, 420); return; }
      const line = BOOT_LINES[i++];
      const div = document.createElement('div');
      div.className = line.cls ? 'dimline' : '';
      bootLog.appendChild(div);
      let c = 0;
      const type = () => {
        if (bootDone) return;
        div.textContent = line.t.slice(0, ++c);
        if (c < line.t.length) setTimeout(type, 12);
        else setTimeout(next, 160);
      };
      type();
    };
    next();
  };
  if (boot) {
    boot.addEventListener('click', finishBoot);
    setTimeout(runBoot, 120);
    setTimeout(finishBoot, 6500);
  } else finishBoot();

  /* ─────────── REVEAL ON SCROLL ─────────── */
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;

  const observeReveal = (scope = document) => {
    $$('.reveal:not(.in)', scope).forEach((el) => io ? io.observe(el) : el.classList.add('in'));
  };
  const revealNow = () => {
    document.body.classList.add('ready');
    $$('[data-stagger]').forEach((group) => {
      [...group.children].forEach((child, i) => {
        child.style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
      });
    });
    observeReveal();
  };

  /* ─────────── CLOCK (WIB) ─────────── */
  const clockFmt = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  const tickClock = () => {
    const t = clockFmt.format(new Date()).replace(/\./g, ':') + ' WIB';
    const c = $('#clock'), cf = $('#clockFoot');
    if (c) c.textContent = t;
    if (cf) cf.textContent = t;
  };
  tickClock(); setInterval(tickClock, 1000);

  /* ─────────── NAV / SCROLL ─────────── */
  const nav = $('#nav');
  const progressBar = $('#progressBar');
  const onScroll = () => {
    const y = scrollY;
    nav && nav.classList.toggle('scrolled', y > 30);
    if (progressBar) {
      const h = document.documentElement.scrollHeight - innerHeight;
      progressBar.style.transform = `scaleX(${h > 0 ? Math.min(y / h, 1) : 0})`;
    }
    $$('.reveal:not(.in)').forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.96) el.classList.add('in');
    });
    let current = '';
    $$('main section[id]').forEach((sec) => {
      if (sec.getBoundingClientRect().top <= innerHeight * 0.35) current = sec.id;
    });
    $$('.nav__links a').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#burger'), menu = $('#menu');
  const closeMenu = () => {
    if (!menu || !burger) return;
    menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open');
  };
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.hidden;
      menu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    });
    $$('a', menu).forEach((a) => a.addEventListener('click', closeMenu));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) closeMenu(); });
  }
  const toTop = $('#toTop');
  toTop && toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }));

  /* ─────────── ACCENT THEME ─────────── */
  const accents = ['green', 'cyan', 'amber', 'pink'];
  const setAccent = (name, save = true) => {
    if (!accents.includes(name)) return false;
    document.documentElement.dataset.accent = name;
    $$('.acc').forEach((b) => b.classList.toggle('is-active', b.dataset.accent === name));
    if (save) try { localStorage.setItem('fairus_accent', name); } catch (_) {}
    return true;
  };
  try { setAccent(localStorage.getItem('fairus_accent') || 'green', false); } catch (_) { setAccent('green', false); }
  $$('.acc').forEach((b) => b.addEventListener('click', () => { setAccent(b.dataset.accent); toast(`warna → ${b.dataset.accent}`); }));

  /* ─────────── MARQUEE ─────────── */
  const mq = $('#marqueeTrack');
  if (mq && !REDUCED) mq.innerHTML += mq.innerHTML;

  /* ─────────── HERO CANVAS — vision feed sim ─────────── */
  const canvas = $('#heroCanvas');
  const visionStat = $('#visionStat');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize(); addEventListener('resize', resize);

    const N = 26;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0009,
      vy: (Math.random() - 0.5) * 0.0009,
      r: 1 + Math.random() * 1.6
    }));
    const objs = [
      { x: .10, y: .10, vx: .00055, vy: .00035, w: .17, h: .22, label: 'face', conf: .99, c: 0, zone: { x0: .06, x1: .42, y0: .08, y1: .40 } },
      { x: .60, y: .12, vx: -.00042, vy: .0005, w: .20, h: .24, label: 'hand',  conf: .97, c: 1, zone: { x0: .55, x1: .74, y0: .10, y1: .38 } },
      { x: .36, y: .70, vx: .00038, vy: -.00042, w: .14, h: .17, label: 'object', conf: .95, c: 2, zone: { x0: .30, x1: .60, y0: .68, y1: .78 } }
    ];

    let frames = 0, fps = 0, lastFps = performance.now();
    let running = true;
    const ioCanvas = ('IntersectionObserver' in window) ? new IntersectionObserver((es) => { running = es[0].isIntersecting; }, { threshold: 0.02 }) : null;
    ioCanvas && ioCanvas.observe(canvas);

    const accentColor = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3dffa2';

    const draw = (dt) => {
      const accCol = accentColor();
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 34) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 34) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      if (!REDUCED) {
        for (const n of nodes) {
          n.x += n.vx * dt; n.y += n.vy * dt;
          if (n.x < 0 || n.x > 1) n.vx *= -1;
          if (n.y < 0 || n.y > 1) n.vy *= -1;
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i], b = nodes[j];
          const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
          if (d2 < 0.028) {
            ctx.strokeStyle = `rgba(255,255,255,${(0.10 * (1 - d2 / 0.028)).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x * W, a.y * H); ctx.lineTo(b.x * W, b.y * H); ctx.stroke();
          }
        }
      }
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x * W, n.y * H, n.r, 0, 7); ctx.fill(); }

      for (const o of objs) {
        if (!REDUCED) {
          o.x += o.vx * dt; o.y += o.vy * dt;
          const z = o.zone;
          if (o.x < z.x0 || o.x + o.w > z.x1) o.vx *= -1;
          if (o.y < z.y0 || o.y + o.h > z.y1) o.vy *= -1;
          o.x = Math.max(z.x0, Math.min(o.x, z.x1 - o.w));
          o.y = Math.max(z.y0, Math.min(o.y, z.y1 - o.h));
        }
        const x = o.x * W, y = o.y * H, w = o.w * W, h = o.h * H;
        o.c += dt * 0.002;
        const wob = Math.sin(o.c) * 2;
        ctx.strokeStyle = accCol;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([5, 4]);
        ctx.strokeRect(x + wob, y, w, h);
        ctx.setLineDash([]);
        const L = 10;
        ctx.strokeStyle = accCol; ctx.lineWidth = 2.2;
        [[x + wob, y, 1, 1], [x + wob + w, y, -1, 1], [x + wob, y + h, 1, -1], [x + wob + w, y + h, -1, -1]].forEach(([cx, cy, sx, sy]) => {
          ctx.beginPath(); ctx.moveTo(cx + L * sx, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + L * sy); ctx.stroke();
        });
        const label = `${o.label} ${(o.conf + Math.sin(o.c / 3) * 0.005).toFixed(2)}`;
        ctx.font = '11px "JetBrains Mono", monospace';
        const tw = ctx.measureText(label).width + 12;
        ctx.fillStyle = accCol;
        ctx.fillRect(x + wob, y - 19, tw, 16);
        ctx.fillStyle = '#07120c';
        ctx.fillText(label, x + wob + 6, y - 7);
      }
    };

    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(now - last, 50); last = now;
      if (running) {
        draw(dt);
        frames++;
        if (now - lastFps >= 1000) {
          fps = frames; frames = 0; lastFps = now;
          if (visionStat) visionStat.textContent = `FPS ${String(fps).padStart(2, '0')}`;
        }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ─────────── STATS COUNTER ─────────── */
  const counters = $$('[data-count]');
  const animateCount = (el) => {
    const target = +el.dataset.count, pad = +(el.dataset.pad || 0);
    const t0 = performance.now(), dur = REDUCED ? 1 : 1100;
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased)).padStart(pad, '0');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
    }), { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  } else counters.forEach((c) => c.textContent = String(+c.dataset.count).padStart(+(c.dataset.pad || 0), '0'));

  /* ─────────── PROJECT CARDS ─────────── */
  const grid = $('#projectGrid');
  if (grid) {
    grid.innerHTML = PROJECTS.map((p) => {
      const n = (p.evidence && p.evidence.length) || 0;
      const camBadge = n ? `<span class="card__cam" title="Jumlah foto bukti">${n} foto</span>` : '';
      return `
      <article class="card reveal" data-cat="${p.cat}" data-id="${p.id}" tabindex="0" role="button" aria-label="Detail ${esc(p.title)}">
        <i class="bc tl"></i><i class="bc tr"></i><i class="bc bl"></i><i class="bc br"></i>
        <div class="card__top">
          <span class="card__id">${p.id}</span>
          <span class="card__cat">${p.catLabel}</span>
        </div>
        <h3>${esc(p.title)}</h3>
        <p class="card__desc">${esc(p.desc)}</p>
        <div class="chips chips--sm">${p.tech.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
        <div class="card__foot">
          <span class="card__tags"><span class="btn btn--small">Lihat Detail →</span>${camBadge}</span>
          <span class="conf">conf ${p.conf.toFixed(2)}</span>
        </div>
      </article>`;
    }).join('');

    const fbtns = $$('.fbtn');
    fbtns.forEach((b) => b.addEventListener('click', () => {
      fbtns.forEach((x) => x.classList.toggle('is-active', x === b));
      const f = b.dataset.filter;
      $$('.card', grid).forEach((card) => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hide', !show);
        if (show) { card.classList.remove('in'); void card.offsetWidth; card.classList.add('in'); }
      });
      toast(`filter → ${f}`);
    }));

    if (matchMedia('(pointer:fine)').matches && !REDUCED) {
      $$('.card', grid).forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', `${px * 100}%`);
          card.style.setProperty('--my', `${py * 100}%`);
          card.style.transform = `perspective(900px) rotateX(${(py - .5) * -4}deg) rotateY(${(px - .5) * 5}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        card.addEventListener('click', () => openModal(card.dataset.id));
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.id); } });
      });
    } else {
      $$('.card', grid).forEach((card) => {
        card.addEventListener('click', () => openModal(card.dataset.id));
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openModal(card.dataset.id); });
      });
    }
  }

  /* ─────────── MODAL + GALLERY ─────────── */
  const modal = $('#modal');
  let lastFocus = null, modalPhotos = [];
  const openModal = (id) => {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p || !modal) return;
    lastFocus = document.activeElement;
    $('#modalId').textContent = p.id;
    $('#modalCat').textContent = p.catLabel;
    $('#modalTitle').textContent = p.title;
    $('#modalDesc').textContent = p.desc;
    $('#modalWhat').innerHTML = p.what.map((w) => `<li>${esc(w)}</li>`).join('');
    $('#modalLearn').innerHTML = p.learn.map((w) => `<li>${esc(w)}</li>`).join('');
    $('#modalTech').innerHTML = p.tech.map((t) => `<span class="chip">${esc(t)}</span>`).join('');

    // bukti foto
    modalPhotos = p.evidence || [];
    const evWrap = $('#modalEvidence'), gal = $('#modalGallery');
    if (evWrap && gal) {
      if (modalPhotos.length) {
        gal.innerHTML = modalPhotos.map((ph, i) => `
          <button class="gal__item" data-idx="${i}" aria-label="Perbesar foto: ${esc(ph.cap)}">
            <img src="${esc(ph.src)}" alt="${esc(ph.cap)}" loading="lazy" decoding="async">
          </button>`).join('');
        evWrap.hidden = false;
      } else {
        gal.innerHTML = '';
        evWrap.hidden = true;
      }
    }

    modal.hidden = false;
    document.body.classList.add('locked');
    $('.modal__close', modal).focus();
  };
  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('locked');
    lastFocus && lastFocus.focus();
  };
  if (modal) {
    $$('[data-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
    addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || modal.hidden) return;
      // lightbox punya prioritas: Escape pertama tutup lightbox saja
      const lbEl = document.getElementById('lightbox');
      if (lbEl && !lbEl.hidden) return;
      closeModal();
    });
  }

  /* ─────────── LIGHTBOX ─────────── */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
  let lbIdx = 0;
  const showLb = (i) => {
    if (!modalPhotos.length) return;
    lbIdx = (i + modalPhotos.length) % modalPhotos.length;
    const ph = modalPhotos[lbIdx];
    if (lbImg) { lbImg.src = ph.src; lbImg.alt = ph.cap; }
    if (lbCap) lbCap.textContent = ph.cap;
    if (lbCount) lbCount.textContent = `${lbIdx + 1} / ${modalPhotos.length}`;
  };
  const openLb = (i) => {
    if (!lb) return;
    showLb(i);
    lb.hidden = false;
    document.body.classList.add('locked');
  };
  const closeLb = () => {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    lbImg && (lbImg.src = '');
    if (!modal || modal.hidden) document.body.classList.remove('locked');
  };
  const galWrap = $('#modalGallery');
  galWrap && galWrap.addEventListener('click', (e) => {
    const item = e.target.closest('.gal__item');
    if (item) openLb(+item.dataset.idx);
  });
  if (lb) {
    $$('[data-lb-close]', lb).forEach((el) => el.addEventListener('click', closeLb));
    $('#lbPrev') && $('#lbPrev').addEventListener('click', () => showLb(lbIdx - 1));
    $('#lbNext') && $('#lbNext').addEventListener('click', () => showLb(lbIdx + 1));
    addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
      else if (e.key === 'ArrowRight') showLb(lbIdx + 1);
    });
    // swipe
    let sx = 0;
    lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 46) showLb(lbIdx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ─────────── CURSOR ─────────── */
  if (matchMedia('(pointer:fine)').matches && !REDUCED) {
    const dot = $('#cursorDot'), ring = $('#cursorRing');
    if (dot && ring) {
      document.documentElement.classList.add('has-cursor');
      let rx = -100, ry = -100, tx = -100, ty = -100;
      addEventListener('mousemove', (e) => {
        tx = e.clientX; ty = e.clientY;
        dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
      });
      const follow = () => {
        rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16;
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(follow);
      };
      requestAnimationFrame(follow);
      document.addEventListener('mouseover', (e) => {
        const hot = e.target.closest('a,button,.card,.chip,.acc,.fbtn,li');
        ring.classList.toggle('grow', !!hot);
      });
    }
  }

  /* ─────────── EASTER EGG: DETECT SCAN ─────────── */
  const detectLayer = $('#detectLayer');
  const runDetect = () => {
    if (!detectLayer) return;
    detectLayer.innerHTML = '';
    const targets = $$('main section, footer .footer__grid > *').filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top < innerHeight && r.bottom > 0;
    }).slice(0, 8);
    const labels = ['section', 'content', 'heading', 'card', 'text', 'ui_element'];
    targets.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const box = document.createElement('div');
      box.className = 'dbox';
      box.style.cssText = `left:${r.left + 4}px;top:${r.top + 6}px;width:${r.width - 8}px;height:${r.height - 12}px;animation-delay:${i * 90}ms`;
      box.innerHTML = `<i class="dc tl"></i><i class="dc tr"></i><i class="dc bl"></i><i class="dc br"></i>
        <span class="dl">${labels[i % labels.length]} ${(0.90 + Math.random() * 0.09).toFixed(2)}</span>`;
      detectLayer.appendChild(box);
      el.classList.add('in');
    });
    toast(`deteksi selesai — ${targets.length} objek`);
    setTimeout(() => { detectLayer.innerHTML = ''; }, 4200);
  };

  /* ─────────── MATRIX RAIN ─────────── */
  const matrixRain = () => {
    if (REDUCED) return;
    const cv = document.createElement('canvas');
    cv.style.cssText = 'position:fixed;inset:0;z-index:9400;pointer-events:none';
    document.body.appendChild(cv);
    const cx = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    const cols = Math.floor(innerWidth / 16);
    const drops = Array.from({ length: cols }, () => Math.random() * -40);
    const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789FAIRUS<>{}[]/*';
    const col = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3dffa2';
    let frames = 0;
    const t = setInterval(() => {
      cx.fillStyle = 'rgba(6,8,11,0.18)';
      cx.fillRect(0, 0, cv.width, cv.height);
      cx.fillStyle = col;
      cx.font = '14px "JetBrains Mono", monospace';
      drops.forEach((y, i) => {
        cx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, y * 16);
        drops[i] = y * 16 > cv.height && Math.random() > 0.975 ? 0 : y + 1;
      });
      if (++frames > 90) { clearInterval(t); cv.remove(); }
    }, 40);
  };

  /* ─────────── TERMINAL ─────────── */
  const termBody = $('#termBody');
  const termInput = $('#termInput');
  const termRoot = $('#term');

  const print = (text, cls = 'out', delay = 0) => {
    if (!termBody) return;
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = `t-line ${cls}`;
      div.textContent = text;
      termBody.appendChild(div);
      termBody.scrollTop = termBody.scrollHeight;
    }, delay);
  };

  const NEOFETCH = [
    '       ██████╗       fairus@vps',
    '      ██╔════╝       ─────────────',
    '      █████╗         OS:     FAIRUS.SYS 2.6',
    '      ██╔══╝         Shell:  fairus-sh',
    '      ██║            Uptime: sejak kelas X (CV era)',
    '      ╚═╝            Fokus:  Computer Vision · Embedded · Agents',
    '                     Target: ITS — Rekayasa Kecerdasan Artifisial',
    '                     Status: ONLINE — membangun 24/7'
  ];

  // "cara pakai" yang jelas buat orang awam
  const HELP_INTRO = [
    'halo! ini terminal interaktif — kamu bisa ketik perintah di bawah.',
    'tak perlu jago teknis, coba saja salah satu:'
  ];
  const HELP_LIST = [
    '  whoami            — kenalan: siapa Fairus',
    '  projects          — daftar 9 projek (dengan bukti foto)',
    '  project <nomor>   — cerita lengkap 1 projek (1-9)',
    '  stack             — skill & tools yang dipakai',
    '  contact           — cara menghubungi Fairus',
    '  detect            — efek deteksi objek di halaman ini',
    '  theme <nama>      — ganti warna: green | cyan | amber | pink',
    '  neofetch          — info sistem gaya terminal',
    '  clear             — bersihkan layar',
    '  help              — tampilkan bantuan ini lagi'
  ];
  const HELP_SECRET = [
    '  ✦ ada perintah rahasia di dalam… coba tebak :)'
  ];

  const runCmd = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    print(`➜ ~ ${raw}`, 'in');
    const [name, ...args] = cmd.split(/\s+/);

    switch (name) {
      case 'help':
      case 'bantuan':
        HELP_INTRO.forEach((l, i) => print(l, i === 0 ? 'acc' : 'out', 20 + i * 40));
        HELP_LIST.forEach((l, i) => print(l, 'out', 120 + i * 30));
        HELP_SECRET.forEach((l, i) => print(l, 'dim', 140 + HELP_LIST.length * 30 + i * 30));
        print('tips: Tab = lengkapi otomatis · ↑/↓ = riwayat perintah', 'dim', 180 + HELP_LIST.length * 30);
        break;
      case 'whoami':
        print('Fairus — pelajar kelas XII · pembangun sistem computer vision, embedded AI, dan agent.', 'out', 20);
        print('jalan di laptop + kamera ESP32-CAM + VPS kecil. target: ITS Rekayasa Kecerdasan Artifisial.', 'out', 90);
        break;
      case 'projects':
        PROJECTS.forEach((p, i) => {
          const n = (p.evidence && p.evidence.length) || 0;
          print(`  ${String(i + 1).padStart(2, '0')}  [${p.id}] ${p.title}${n ? `  (${n} foto)` : ''}`, 'out', 20 + i * 50);
        });
        print('ketik: project <nomor> untuk cerita lengkapnya', 'dim', 40 + PROJECTS.length * 50);
        break;
      case 'project': {
        const n = parseInt(args[0], 10);
        const p = PROJECTS[n - 1];
        if (!p) { print(`project tidak ditemukan. ada ${PROJECTS.length} (1-${PROJECTS.length}).`, 'err', 20); break; }
        print(`${p.id} — ${p.title}`, 'acc', 20);
        print(p.desc, 'out', 80);
        print(`tech: ${p.tech.join(' · ')}`, 'dim', 140);
        const ev = p.evidence || [];
        if (ev.length) {
          print('bukti foto (klik kartunya di halaman):', 'dim', 200);
          ev.forEach((ph, i) => print(`  • ${ph.cap}`, 'out', 260 + i * 60));
        }
        break;
      }
      case 'stack':
      case 'skills':
        print('  vision   : Python · OpenCV · YOLOv8 · Ultralytics · HuggingFace', 'out', 20);
        print('  embedded : ESP32-CAM · Arduino · LCD I2C · Breadboard', 'out', 70);
        print('  agents   : Google ADK · Hermes Agent · Telegram Bot · 9Router', 'out', 120);
        print('  web      : HTML · CSS · JavaScript · Node.js · Express · SQLite', 'out', 170);
        print('  sys      : Linux · VPS · Git · Cron', 'out', 220);
        break;
      case 'contact':
      case 'social':
        print('  github    → https://github.com/FairusFT', 'out', 20);
        print('  instagram → https://instagram.com/fairusft', 'out', 90);
        break;
      case 'detect':
        print('menjalankan simulasi deteksi…', 'acc', 20);
        setTimeout(runDetect, 500);
        break;
      case 'theme': {
        const ok = setAccent(args[0]);
        if (ok) { print(`warna → ${args[0]}`, 'out', 20); toast(`warna → ${args[0]}`); }
        else print('pilihan: green | cyan | amber | pink', 'err', 20);
        break;
      }
      case 'neofetch':
        NEOFETCH.forEach((l, i) => print(l, i === 0 ? 'acc' : 'out', 20 + i * 55));
        break;
      case 'matrix':
        print('initiating matrix rain… (jangan bilang siapa-siapa)', 'acc', 20);
        setTimeout(matrixRain, 400);
        break;
      case 'sudo':
        print('Nice try. Akses root tidak tersedia untuk pengunjung.', 'err', 20);
        print('tapi ada hadiah: ketik "9router"', 'dim', 250);
        break;
      case '9router':
        print('◉ EASTER EGG TERBUKA — 9router mode.', 'acc', 20);
        print('kamu menemukan pintu rahasia routing: satu pintu, banyak model.', 'out', 120);
        print('(dan ini hadiahnya)', 'dim', 400);
        setTimeout(() => { runDetect(); matrixRain(); }, 700);
        break;
      case 'ls':
        print('index.html  styles.css  script.js  assets/evidence/(12 foto)  secrets/(?)', 'out', 20);
        break;
      case 'pwd':
        print('/home/fairus/portfolio', 'out', 20);
        break;
      case 'cat':
        print(args[0] ? `${args[0]}: file tidak tersedia untuk publik (bukannya aku pelit, tapi ya memang rahasia).` : 'cat: sebutkan nama file. coba: cat resume.txt', 'out', 20);
        break;
      case 'clear':
        termBody.innerHTML = '';
        break;
      case 'exit':
      case 'logout':
        print('tidak bisa keluar. kamu sudah terdeteksi. ◉', 'acc', 20);
        break;
      default:
        print(`command not found: ${name} — ketik "help"`, 'err', 20);
    }
  };

  if (termRoot && termInput && termBody) {
    print('FAIRUS.SYS terminal — versi ramah pengunjung', 'dim', 300);
    print('ketik "help" untuk lihat semua perintah, atau klik tombol di bawah terminal.', 'acc', 650);

    const history = []; let hIdx = -1;
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const v = termInput.value;
        if (v.trim()) { history.push(v); hIdx = history.length; }
        termInput.value = '';
        runCmd(v);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (hIdx > 0) { hIdx--; termInput.value = history[hIdx] || ''; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hIdx < history.length - 1) { hIdx++; termInput.value = history[hIdx + 1] || ''; }
        else { hIdx = history.length; termInput.value = ''; }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const cmds = ['help', 'whoami', 'projects', 'project', 'stack', 'contact', 'detect', 'theme', 'neofetch', 'matrix', 'clear'];
        const v = termInput.value.trim().toLowerCase();
        const match = cmds.filter((c) => c.startsWith(v));
        if (match.length === 1) termInput.value = match[0];
        else if (match.length > 1) print(`pilihan: ${match.join(' · ')}`, 'dim');
      }
    });
    termRoot.addEventListener('click', () => termInput.focus());
    $$('#termQuick button').forEach((b) => b.addEventListener('click', () => {
      runCmd(b.dataset.cmd);
      termInput.focus();
    }));
    const ctaTerm = $('#ctaTerm');
    ctaTerm && ctaTerm.addEventListener('click', () => {
      $('#terminal').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
      setTimeout(() => termInput.focus(), REDUCED ? 50 : 650);
    });
  }

  /* ─────────── KONAMI ─────────── */
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIdx = 0;
  addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI[kIdx]) {
      kIdx++;
      if (kIdx === KONAMI.length) {
        kIdx = 0;
        toast('◉ konami terdeteksi — mode chaos aktif');
        runDetect();
        setTimeout(matrixRain, 600);
      }
    } else kIdx = (key === KONAMI[0]) ? 1 : 0;
  });

  /* ─────────── HASH LINKS ─────────── */
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const el = $(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); history.replaceState(null, '', id); }
    }
  }));

  observeReveal();
  setTimeout(() => $$('.reveal:not(.in)').forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }), 1400);
})();
