/* ============================================================
   lab.js — Lab page (v2)
   4 demos + LARP-only hack easter egg.
   ============================================================ */
(function(){
  const HTML = document.documentElement;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isLarp = () => HTML.classList.contains('larp-mode');

  /* ==========================================================
     STYLES
     ========================================================== */
  const style = document.createElement('style');
  style.id = 'lab-styles';
  style.textContent = `
    #lab-mounts{ display:flex; flex-direction:column; gap:16px; margin-bottom:70px; }
    .lab-card{
      border:1px solid var(--line2); background:var(--bg);
      box-shadow:inset 0 0 30px rgba(0,0,0,.15), 0 4px 20px rgba(0,0,0,.4);
      min-width:0; transition:border-color .18s ease;
    }
    .lab-card:hover{ border-color:var(--accent); }
    .lab-bar{
      display:flex; align-items:center; gap:10px;
      padding:8px 12px;
      background:linear-gradient(180deg, var(--panel2) 0%, var(--panel) 100%);
      border-bottom:1px solid var(--line2);
    }
    .lab-dots{ display:flex; gap:5px; }
    .lab-dots i{ display:block; width:9px; height:9px; border-radius:50%; background:var(--line2); }
    .lab-dots i:nth-child(1){ background:var(--red); }
    .lab-dots i:nth-child(2){ background:var(--accent2); }
    .lab-dots i:nth-child(3){ background:var(--accent); }
    .lab-num{
      font-family:var(--mono); font-size:12px; color:var(--accent);
      padding:2px 8px; border:1px solid var(--line2); background:var(--accentbg);
      min-width:34px; text-align:center;
    }
    .lab-title{
      flex:1; min-width:0; font-family:var(--mono); font-size:11px;
      letter-spacing:.1em; color:var(--fg2);
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    .lab-title span{ color:var(--accent); margin-right:6px; }
    .lab-status{
      font-family:var(--mono); font-size:9px; letter-spacing:.18em;
      color:var(--fg4); display:flex; align-items:center; gap:5px;
    }
    .lab-status::before{
      content:""; width:6px; height:6px; border-radius:50%;
      background:var(--fg4); transition:background .2s ease;
    }
    .lab-card.playing .lab-status{ color:var(--accent); }
    .lab-card.playing .lab-status::before{
      background:var(--accent); box-shadow:0 0 8px var(--accent);
      animation:labBlink 1s ease-in-out infinite;
    }
    @keyframes labBlink{ 50%{ opacity:.35; } }

    .lab-body{
      display:grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
      align-items: stretch;
    }
    @media(max-width:820px){ .lab-body{ grid-template-columns: minmax(0, 1fr); } }
    .lab-left{
      padding:16px 20px 18px 16px;
      display:flex; flex-direction:column; gap:12px;
      border-right:1px dashed var(--line2);
    }
    @media(max-width:820px){ .lab-left{ border-right:0; border-bottom:1px dashed var(--line2); } }
    .lab-desc{ margin:0; color:var(--fg2); font-size:12px; line-height:1.7; }
    .lab-desc b{ color:var(--bright); font-weight:normal; }

    .lab-pseudo{
      border:1px solid var(--line2); background:var(--bg2);
      overflow:hidden; display:flex; flex-direction:column;
    }
    .lab-pseudo-head{
      padding:6px 10px; border-bottom:1px dashed var(--line2);
      font-family:var(--mono); font-size:9px; letter-spacing:.22em;
      color:var(--fg3); text-transform:uppercase; background:var(--accentbg);
    }
    .lab-pseudo pre{
      margin:0; padding:12px 14px; font-family:var(--mono); font-size:11px;
      line-height:1.65; color:var(--fg2); white-space:pre; overflow-x:auto;
    }
    .lab-pseudo pre em{ color:var(--accent); font-style:normal; }
    .lab-pseudo pre b { color:var(--bright); font-weight:normal; }
    .lab-pseudo pre i { color:var(--red); font-style:normal; }
    .lab-pseudo pre s { color:var(--fg4); text-decoration:none; }
    .lab-pseudo pre u { color:var(--accent2); text-decoration:none; }

    .lab-foot{
      margin-top:auto; display:flex; gap:8px; flex-wrap:wrap;
      padding-top:10px; border-top:1px dashed var(--line2);
    }
    .lab-link{
      font-family:var(--mono); font-size:10px; letter-spacing:.14em;
      color:var(--accent); text-decoration:none;
      border:1px solid var(--line2); padding:5px 10px; background:var(--accentbg);
      transition:all .12s ease;
    }
    .lab-link:hover{ border-color:var(--accent); color:var(--bright); }

    .lab-right{
      padding:16px; display:flex; flex-direction:column; gap:10px; min-width:0;
    }
    .lab-canvas{
      position:relative; background:var(--bg2); border:1px solid var(--line2);
      height:220px; width:100%; overflow:hidden; box-sizing:border-box;
    }
    .lab-canvas::after{
      content:""; position:absolute; inset:0; pointer-events:none;
      background:repeating-linear-gradient(0deg,
        rgba(0,0,0,.35) 0px, rgba(0,0,0,.35) 1px,
        transparent 1px, transparent 3px);
      mix-blend-mode: multiply; opacity:.5; z-index:2;
    }
    .lab-canvas canvas{
      display:block; width:100%; height:100%; position:relative; z-index:1;
    }
    .lab-readout{
      font-family:var(--mono); font-size:10px; color:var(--fg2);
      line-height:1.6; min-height:34px;
      padding:6px 9px; border:1px solid var(--line2); background:var(--bg2);
      display:flex; align-items:center; gap:10px; flex-wrap:wrap;
    }
    .lab-readout b{ color:var(--bright); font-weight:normal; }
    .lab-readout .warn{ color:var(--red); }
    .lab-readout .ok{ color:var(--accent); }
    .lab-readout .sep{ color:var(--fg4); }

    .lab-actions{ display:flex; gap:8px; flex-wrap:wrap; margin-top:auto; }
    .lab-btn{
      font-family:var(--mono); font-size:10px; letter-spacing:.16em;
      color:var(--bright); background:var(--accentbg);
      border:1px solid var(--line2); padding:6px 12px; cursor:pointer;
      transition:all .12s ease; white-space:nowrap;
    }
    .lab-btn:hover{ border-color:var(--accent); color:var(--bright); }
    .lab-btn.hot{ border-color:var(--accent); }
    .lab-btn:disabled{ opacity:.5; cursor:default; }
    .lab-btn.mini{ padding:3px 8px; font-size:9px; letter-spacing:.1em; }

    .lab-select{
      font-family:var(--mono); font-size:10px; letter-spacing:.1em;
      background:var(--bg); color:var(--bright);
      border:1px solid var(--line2); padding:5px 8px;
      outline:none; cursor:pointer; min-width:0;
    }
    .lab-select:focus{ border-color:var(--accent); }

    html:not(.larp-mode) #lab-hack-egg{ display: none !important; }
    .lab-egg-head{
      margin:40px 0 16px; padding-bottom:14px;
      border-bottom:1px dashed var(--line2);
      display:flex; justify-content:space-between; align-items:center;
      flex-wrap:wrap; gap:12px;
    }
    .lab-egg-head h3{
      margin:0; font-family:var(--mono); font-weight:normal;
      font-size:14px; color:var(--bright); letter-spacing:.24em; text-transform:uppercase;
    }
    .lab-egg-head .badge{
      font-size:9px; letter-spacing:.22em;
      color:var(--red); border:1px solid var(--line2);
      padding:4px 9px; background:var(--accentbg);
    }
    .lab-sniffer{
      background:var(--bg2); border:1px solid var(--line2);
      height:220px; overflow:hidden; font-family:var(--mono); font-size:10px;
      padding:6px 8px; display:flex; flex-direction:column;
      box-sizing:border-box;
    }
    .lab-sniffer .row{
      display:grid; grid-template-columns: 52px minmax(0, 1fr) auto;
      gap:8px; line-height:1.55; color:var(--fg2); opacity:0;
      animation:labRowIn .25s ease forwards;
    }
    .lab-sniffer .row > *{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    @keyframes labRowIn{ to { opacity:1; } }
    .lab-sniffer .row .t{ color:var(--fg4); }
    .lab-sniffer .row .p{ text-align:right; color:var(--fg3); }
    .lab-sniffer .row.dns .p{ color:#00b7ff; }
    .lab-sniffer .row.https .p{ color:var(--accent); }
    .lab-sniffer .row.quic .p{ color:#ffb44d; }

    .lab-list-mini{
      background:var(--bg2); border:1px solid var(--line2);
      height:220px; padding:10px; font-family:var(--mono); font-size:11px;
      display:flex; flex-direction:column; gap:4px; box-sizing:border-box;
      overflow:hidden;
    }
    .lab-list-mini > div{ overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
  `;
  document.head.appendChild(style);

  /* ==========================================================
     HELPERS
     ========================================================== */
  function el(tag, cls, html){
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function setStatus(card, text){ const s = card.querySelector('.lab-status'); if (s) s.textContent = text; }
  function setPlaying(card, on){ card.classList.toggle('playing', !!on); setStatus(card, on ? 'RUNNING' : 'READY'); }
  function sizeCanvas(canvas, wrap){
    const r = wrap.getBoundingClientRect();
    const W = Math.max(1, Math.floor(r.width));
    const H = Math.max(1, Math.floor(r.height));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, W, H };
  }
  function colors(){
    const cs = getComputedStyle(document.documentElement);
    const v = (n, fb) => (cs.getPropertyValue(n) || '').trim() || fb;
    return {
      bg: v('--bg'), line2: v('--line2'), accent: v('--accent'),
      accent2: v('--accent2'), bright: v('--bright'),
      fg2: v('--fg2'), fg3: v('--fg3'), fg4: v('--fg4'), red: v('--red'),
    };
  }
  function gridBG(ctx, W, H, step){
    ctx.strokeStyle = 'rgba(120,120,120,.1)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x += (step||16)){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y <= H; y += (step||16)){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  }
  function buildCard({ num, tag, title, desc, pseudo, projectSlug }){
    const card = el('article', 'lab-card');
    card.innerHTML = `
      <div class="lab-bar">
        <div class="lab-dots"><i></i><i></i><i></i></div>
        <div class="lab-num">${esc(num)}</div>
        <div class="lab-title"><span>[${esc(tag)}]</span>${esc(title)}</div>
        <div class="lab-status">READY</div>
      </div>
      <div class="lab-body">
        <div class="lab-left">
          <p class="lab-desc">${desc}</p>
          <div class="lab-pseudo">
            <div class="lab-pseudo-head">pseudo-code</div>
            <pre>${pseudo}</pre>
          </div>
          <div class="lab-foot">
            <a class="lab-link" href="#/projects/${esc(projectSlug)}">read the full project →</a>
          </div>
        </div>
        <div class="lab-right"></div>
      </div>
    `;
    return { card, right: card.querySelector('.lab-right') };
  }

  /* ==========================================================
     REALISTIC DIGIT RENDERING (uses actual fonts)
     ========================================================== */
  function renderDigit(d){
    const c = document.createElement('canvas');
    c.width = 28; c.height = 28;
    const cx = c.getContext('2d');
    cx.fillStyle = '#000';
    cx.fillRect(0, 0, 28, 28);
    cx.fillStyle = '#fff';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';

    /* randomly pick a font style for variety */
    const fonts = [
      'bold 22px Georgia, serif',
      'bold 21px "Times New Roman", serif',
      '22px Georgia, serif',
      'bold 20px "Courier New", monospace',
    ];
    cx.font = fonts[Math.floor(Math.random() * fonts.length)];

    /* random jitter + rotation for handwritten feel */
    const angle = (Math.random() - 0.5) * 0.18;
    const ox = (Math.random() - 0.5) * 3;
    const oy = (Math.random() - 0.5) * 3;
    cx.translate(14 + ox, 14 + oy);
    cx.rotate(angle);

    /* slight scale variation */
    const scale = 0.9 + Math.random() * 0.15;
    cx.scale(scale, scale);
    cx.fillText(String(d), 0, 1);

    const data = cx.getImageData(0, 0, 28, 28).data;
    const g = new Array(28*28);
    for (let i = 0; i < 28*28; i++){
      const a = data[i*4];
      g[i] = a > 100 ? 1 : (a > 40 ? (a/255) * 0.7 : 0);
    }
    return g;
  }

  /* ==========================================================
     DEMO 1 — Digit Draw (realistic, split view)
     ========================================================== */
  function digitDraw(){
    const { card, right } = buildCard({
      num:'01', tag:'CNN', title:'Digit Draw', projectSlug:'number-guesser',
      desc:'Draw a digit on the left — the right side shows the <b>28×28</b> pixel grid the network actually sees. Or press <b>LOAD RANDOM</b> for a realistic MNIST-style sample, then <b>PREDICT</b>.',
      pseudo:`<s># preprocess</s>
img = crop_center(draw)
img = resize(img, 28, 28)
x   = normalize(img)

<s># forward</s>
logits = cnn(x)
probs  = softmax(logits)`
    });

    const wrap = el('div', 'lab-canvas');
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas); right.appendChild(wrap);
    const readout = el('div', 'lab-readout');
    readout.innerHTML = `<span>draw or load</span><span class="sep">·</span><span>28×28</span>`;
    right.appendChild(readout);
    const actions = el('div', 'lab-actions');
    const clearBtn = el('button', 'lab-btn', 'CLEAR');
    const randBtn = el('button', 'lab-btn', 'LOAD RANDOM');
    const predictBtn = el('button', 'lab-btn hot', 'PREDICT');
    actions.append(clearBtn, randBtn, predictBtn); right.appendChild(actions);

    /* 28x28 pixel grid — same resolution as MNIST input */
    const GRID = 28;
    let pixels = new Array(GRID*GRID).fill(0);
    let loadedDigit = null;
    let ctx = null, W = 100, H = 100;
    let drawing = false, mode = 'draw', probs = null;
    let capturing = 0; /* 0..1 capture animation progress */

    function resize(){ const s = sizeCanvas(canvas, wrap); ctx = s.ctx; W = s.W; H = s.H; draw(); }

    function draw(){
      if (!ctx) return;
      const t = colors();
      ctx.clearRect(0,0,W,H); ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);

      /* ---- layout ---- */
      const leftW = W * 0.5;
      const pad = 12;
      const leftSize = Math.min(leftW - pad*2, H - pad*2);
      const lx0 = (leftW - leftSize) / 2;
      const ly0 = (H - leftSize) / 2;
      const lcell = leftSize / GRID;

      const rightX = leftW + 6;
      const rightW = W - rightX - pad;
      const rightGridSize = Math.min(rightW * 0.85, H * 0.62);
      const rx0 = rightX + (rightW - rightGridSize) / 2;
      const ry0 = pad;
      const rcell = rightGridSize / GRID;

      /* ---- left: interactive grid ---- */
      for (let y = 0; y < GRID; y++){
        for (let x = 0; x < GRID; x++){
          const v = pixels[y*GRID + x];
          const px = lx0 + x*lcell, py = ly0 + y*lcell;
          if (v > 0){
            const a = 0.35 + 0.65 * Math.min(1, v);
            ctx.fillStyle = t.accent;
            ctx.globalAlpha = a;
            ctx.shadowColor = t.accent;
            ctx.shadowBlur = 6 * Math.min(1, v);
            ctx.fillRect(px, py, lcell - 0.4, lcell - 0.4);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
          } else {
            ctx.fillStyle = t.line2;
            ctx.globalAlpha = 0.12;
            ctx.fillRect(px, py, lcell - 0.4, lcell - 0.4);
            ctx.globalAlpha = 1;
          }
        }
      }

      /* ---- divider ---- */
      ctx.strokeStyle = t.line2;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(leftW, 6);
      ctx.lineTo(leftW, H - 6);
      ctx.stroke();
      ctx.globalAlpha = 1;

      /* ---- right top: 28x28 preview with grid lines ---- */
      /* capture overlay — animates when predicting */
      if (capturing > 0){
        const capY = ry0 + capturing * rightGridSize;
        ctx.save();
        ctx.beginPath();
        ctx.rect(rx0, ry0, rightGridSize, capY - ry0);
        ctx.clip();
      }

      for (let y = 0; y < GRID; y++){
        for (let x = 0; x < GRID; x++){
          const v = pixels[y*GRID + x];
          const px = rx0 + x*rcell, py = ry0 + y*rcell;
          if (v > 0){
            ctx.fillStyle = t.accent;
            ctx.globalAlpha = 0.4 + 0.6 * Math.min(1, v);
            ctx.fillRect(px, py, rcell - 0.2, rcell - 0.2);
            ctx.globalAlpha = 1;
          } else {
            ctx.fillStyle = t.line2;
            ctx.globalAlpha = 0.15;
            ctx.fillRect(px, py, rcell - 0.2, rcell - 0.2);
            ctx.globalAlpha = 1;
          }
        }
      }

      if (capturing > 0){
        ctx.restore();
        /* scanline */
        const capY = ry0 + capturing * rightGridSize;
        ctx.strokeStyle = t.bright;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = t.bright;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(rx0, capY);
        ctx.lineTo(rx0 + rightGridSize, capY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      /* preview border */
      ctx.strokeStyle = t.accent;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      ctx.strokeRect(rx0, ry0, rightGridSize, rightGridSize);
      ctx.globalAlpha = 1;

      /* 4x4 grid lines inside preview */
      ctx.strokeStyle = t.line2;
      ctx.globalAlpha = 0.25;
      for (let i = 0; i <= 28; i += 4){
        const x = rx0 + i * rcell;
        ctx.beginPath(); ctx.moveTo(x, ry0); ctx.lineTo(x, ry0 + rightGridSize); ctx.stroke();
        const y = ry0 + i * rcell;
        ctx.beginPath(); ctx.moveTo(rx0, y); ctx.lineTo(rx0 + rightGridSize, y); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* ---- right bottom: softmax bars ---- */
      if (probs){
        const barY0 = ry0 + rightGridSize + 12;
        const barH = H - barY0 - 10;
        const barW = rightGridSize / 10;
        for (let i = 0; i < 10; i++){
          const p = probs[i];
          const bh = Math.max(2, p * barH);
          const bx = rx0 + i * barW;
          const by = barY0 + barH - bh;
          ctx.fillStyle = t.accent;
          ctx.globalAlpha = 0.3 + p * 0.7;
          ctx.fillRect(bx + 1, by, barW - 2, bh);
          ctx.globalAlpha = 1;
          ctx.fillStyle = t.fg2;
          ctx.font = '9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(String(i), bx + barW / 2, barY0 + barH + 8);
        }
      }
    }

    function predictFromLoaded(){
      const p = new Array(10).fill(0.01);
      p[loadedDigit] = 0.88 + Math.random() * 0.08;
      for (let i = 0; i < 10; i++) if (i !== loadedDigit) p[i] = Math.random() * 0.08;
      const s = p.reduce((a,b)=>a+b,0);
      return p.map(v => v/s);
    }
    function predictFromDrawn(){
      /* crude feature-based "prediction" — total lit area + centroid */
      let cx = 0, cy = 0, n = 0;
      let topRow = 99, botRow = -1, leftCol = 99, rightCol = -1;
      for (let y = 0; y < GRID; y++){
        for (let x = 0; x < GRID; x++){
          if (pixels[y*GRID + x] > 0.3){
            cx += x; cy += y; n++;
            topRow = Math.min(topRow, y);
            botRow = Math.max(botRow, y);
            leftCol = Math.min(leftCol, x);
            rightCol = Math.max(rightCol, x);
          }
        }
      }
      if (n === 0){
        const p = new Array(10).fill(0.02); p[0] = 0.8; return p;
      }
      cx /= n; cy /= n;
      const height = botRow - topRow + 1;
      const width = rightCol - leftCol + 1;
      const aspect = width / Math.max(1, height);
      const midY = (topRow + botRow) / 2;

      /* heuristic scoring */
      const scores = new Array(10).fill(0.05);
      if (height > 18 && width < 8)      scores[1] += 0.6; /* tall + narrow → 1 */
      if (aspect > 0.9 && height > 14)   scores[0] += 0.5; /* circular → 0 */
      if (aspect > 0.7 && height > 12)   scores[8] += 0.35;
      if (aspect > 0.6 && height > 14)   scores[6] += 0.25;
      if (topRow < 6 && aspect > 0.5)    scores[7] += 0.4; /* high top → 7 */
      if (midY < 12)                     scores[4] += 0.25;
      if (midY > 16)                     scores[2] += 0.2;
      if (n > 60)                        scores[8] += 0.1;
      if (n < 20)                        scores[1] += 0.15;

      /* normalize + slight randomness */
      for (let i = 0; i < 10; i++) scores[i] += Math.random() * 0.08;
      const sum = scores.reduce((a,b)=>a+b,0);
      return scores.map(v => v/sum);
    }

    function paintAt(px, py){
      /* brush radius 1.5 cells */
      const R = 1;
      for (let dy = -R; dy <= R; dy++){
        for (let dx = -R; dx <= R; dx++){
          const x = px + dx, y = py + dy;
          if (x < 0 || x >= GRID || y < 0 || y >= GRID) continue;
          const dist = Math.hypot(dx, dy);
          const w = Math.max(0, 1 - dist / (R + 0.5));
          pixels[y*GRID + x] = Math.min(1, pixels[y*GRID + x] + w * 0.9);
        }
      }
    }

    function pick(e){
      if (loadedDigit !== null) return;
      const r = wrap.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      const leftW = W * 0.5;
      if (mx > leftW) return; /* only draw in left panel */
      const pad = 12;
      const leftSize = Math.min(leftW - pad*2, H - pad*2);
      const lx0 = (leftW - leftSize) / 2;
      const ly0 = (H - leftSize) / 2;
      const lcell = leftSize / GRID;
      const gx = Math.floor((mx - lx0) / lcell);
      const gy = Math.floor((my - ly0) / lcell);
      if (gx < 0 || gx >= GRID || gy < 0 || gy >= GRID) return;
      paintAt(gx, gy);
      draw();
    }

    canvas.addEventListener('pointerdown', e => {
      if (mode === 'predict') return;
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      pick(e);
    });
    canvas.addEventListener('pointermove', e => { if (drawing) pick(e); });
    canvas.addEventListener('pointerup', () => { drawing = false; });
    canvas.addEventListener('pointercancel', () => { drawing = false; });

    clearBtn.addEventListener('click', () => {
      pixels.fill(0); loadedDigit = null;
      mode = 'draw'; probs = null;
      setPlaying(card, false);
      readout.innerHTML = `<span>draw or load</span><span class="sep">·</span><span>28×28</span>`;
      draw();
    });
    randBtn.addEventListener('click', () => {
      const d = Math.floor(Math.random() * 10);
      pixels = renderDigit(d);
      loadedDigit = d;
      mode = 'draw'; probs = null;
      setPlaying(card, false);
      readout.innerHTML = `<span>loaded <b>${d}</b></span><span class="sep">·</span><span>press predict</span>`;
      draw();
    });
    predictBtn.addEventListener('click', () => {
      if (probs) { /* reset for re-predict */ probs = null; }
      setPlaying(card, true); setStatus(card, 'INFERRING');
      readout.innerHTML = `<span>preprocessing <b>crop → resize → center</b>…</span>`;
      capturing = 0;
      const t0 = performance.now();
      const DUR = 700;
      function capTick(now){
        const t = Math.min(1, (now - t0) / DUR);
        capturing = t;
        draw();
        if (t < 1){ requestAnimationFrame(capTick); }
        else {
          capturing = 0;
          probs = loadedDigit !== null ? predictFromLoaded() : predictFromDrawn();
          mode = 'predict';
          let best = 0; for (let i = 1; i < 10; i++) if (probs[i] > probs[best]) best = i;
          const conf = (probs[best]*100).toFixed(1);
          const truth = loadedDigit !== null ? ` · truth <b>${loadedDigit}</b>` : '';
          readout.innerHTML = `<span>predicted <b class="ok">${best}</b></span><span class="sep">·</span><span>confidence <b>${conf}%</b></span>${truth}`;
          setPlaying(card, false); setStatus(card, 'DONE');
          draw();
        }
      }
      requestAnimationFrame(capTick);
    });

    const ro = new ResizeObserver(resize); ro.observe(wrap);
    setTimeout(resize, 50);
    return card;
  }

  /* ==========================================================
     DEMO 2 — Forward Pass (dynamic topology)
     ========================================================== */
  function forwardPass(){
    const { card, right } = buildCard({
      num:'02', tag:'NN', title:'Forward Pass', projectSlug:'nn-from-scratch',
      desc:'Build your own network — add or remove hidden layers and neurons — then press <b>RUN</b> and watch values flow left→right. Each connection multiplies by a weight and sums into the next node.',
      pseudo:`<b>for</b> layer <b>in</b> network:
    z = W @ a + b
    a = relu(z)
    store(a)

pred = argmax(a)`
    });

    /* dynamic topology: [input, ...hidden, output] */
    let topology = [3, 4, 2];

    const controls = el('div', 'lab-actions');
    controls.style.marginTop = '0';
    controls.style.marginBottom = '8px';
    const addLayerBtn = el('button', 'lab-btn mini', '+ layer');
    const rmLayerBtn  = el('button', 'lab-btn mini', '- layer');
    const addNeuronBtn= el('button', 'lab-btn mini', '+ neuron');
    const rmNeuronBtn = el('button', 'lab-btn mini', '- neuron');
    controls.append(addLayerBtn, rmLayerBtn, addNeuronBtn, rmNeuronBtn);
    right.appendChild(controls);

    const wrap = el('div', 'lab-canvas');
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas); right.appendChild(wrap);
    const readout = el('div', 'lab-readout');
    right.appendChild(readout);
    const actions = el('div', 'lab-actions');
    const runBtn = el('button', 'lab-btn hot', 'RUN FORWARD');
    actions.appendChild(runBtn); right.appendChild(actions);

    let ctx = null, W = 100, H = 100;
    let acts = topology.map(n => new Array(n).fill(0));
    let progress = 0, running = false, raf = null;

    function updateReadout(){
      const layout = topology.join(' → ');
      readout.innerHTML = `<span>topology <b>${layout}</b></span><span class="sep">·</span><span>params <b>${countParams()}</b></span>`;
    }
    function countParams(){
      let p = 0;
      for (let i = 0; i < topology.length - 1; i++){
        p += topology[i] * topology[i+1] + topology[i+1]; /* weights + biases */
      }
      return p.toLocaleString();
    }
    function resetActs(){
      acts = topology.map(n => new Array(n).fill(0));
      progress = 0;
    }

    function resize(){ const s = sizeCanvas(canvas, wrap); ctx = s.ctx; W = s.W; H = s.H; draw(); }
    function nodePos(l, i){
      const layers = topology.length;
      const padX = 50, padY = 34;
      const maxN = Math.max(...topology);
      const lx = padX + (W - padX*2) * (layers === 1 ? 0.5 : l / (layers - 1));
      const ly = padY + (H - padY*2) * ((i + 0.5) / topology[l]);
      return { x: lx, y: ly };
    }
    function draw(){
      if (!ctx) return;
      const t = colors();
      ctx.clearRect(0,0,W,H); ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);
      gridBG(ctx, W, H, 18);

      const layers = topology.length;

      /* layer labels */
      ctx.fillStyle = t.fg4; ctx.font = '8px monospace'; ctx.textAlign = 'center';
      for (let l = 0; l < layers; l++){
        const label = l === 0 ? 'INPUT' : (l === layers-1 ? 'OUTPUT' : 'H' + l);
        const p = nodePos(l, 0);
        ctx.fillText(label, p.x, 14);
      }

      /* connections */
      for (let l = 0; l < layers - 1; l++){
        for (let i = 0; i < topology[l]; i++){
          for (let j = 0; j < topology[l+1]; j++){
            const a = nodePos(l, i), b = nodePos(l+1, j);
            const ep = (progress - l/(layers-1)) * (layers-1);
            const lit = Math.max(0, Math.min(1, ep));
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = t.accent;
            ctx.globalAlpha = 0.2 + 0.6*lit;
            ctx.lineWidth = 0.5 + 1.4*lit;
            if (lit > 0.4){ ctx.shadowColor = t.accent; ctx.shadowBlur = 6*lit; }
            ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
          }
        }
      }

      /* nodes */
      const r = Math.max(7, Math.min(12, 90 / Math.max(...topology)));
      for (let l = 0; l < layers; l++){
        for (let i = 0; i < topology[l]; i++){
          const p = nodePos(l, i);
          const v = acts[l][i];
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI*2);
          ctx.fillStyle = t.bg; ctx.fill();
          ctx.strokeStyle = v > 0 ? t.accent : t.line2; ctx.lineWidth = 1.5;
          if (v > 0){ ctx.shadowColor = t.accent; ctx.shadowBlur = 12; }
          ctx.stroke(); ctx.shadowBlur = 0;
          if (v > 0){
            ctx.fillStyle = t.accent; ctx.globalAlpha = 0.25 + 0.65*v;
            ctx.beginPath(); ctx.arc(p.x, p.y, r - 2, 0, Math.PI*2); ctx.fill();
            ctx.globalAlpha = 1;
            if (r >= 10){
              ctx.fillStyle = t.bright; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
              ctx.fillText(v.toFixed(2), p.x, p.y + 3);
            }
          }
        }
      }
    }

    function step(){
      progress += 0.012;
      const layers = topology.length;
      for (let l = 0; l < layers; l++){
        const th = l / Math.max(1, layers - 1);
        if (progress >= th && acts[l][0] === 0){
          acts[l] = acts[l].map(() => 0.3 + Math.random()*0.7);
        }
      }
      draw();
      if (progress >= 1.05){
        running = false;
        if (raf){ cancelAnimationFrame(raf); raf = null; }
        const loss = 0.15 + Math.random() * 0.6;
        readout.innerHTML = `<span>epoch <b>${Math.floor(Math.random()*5)+1}</b></span><span class="sep">·</span><span>loss <b>${loss.toFixed(3)}</b></span><span class="sep">·</span><span class="ok">complete</span>`;
        setPlaying(card, false); setStatus(card, 'DONE');
        runBtn.textContent = 'RUN AGAIN'; runBtn.disabled = false;
        return;
      }
      raf = requestAnimationFrame(step);
    }

    function updateTopology(){ resetActs(); updateReadout(); draw(); }

    addLayerBtn.addEventListener('click', () => {
      if (topology.length > 7) return;
      topology.splice(topology.length - 1, 0, 4);
      updateTopology();
    });
    rmLayerBtn.addEventListener('click', () => {
      if (topology.length < 3) return;
      topology.splice(topology.length - 2, 1);
      updateTopology();
    });
    addNeuronBtn.addEventListener('click', () => {
      /* increase last hidden layer (or middle layer) */
      if (topology.length < 3){
        topology.splice(1, 0, 4);
      } else {
        const idx = topology.length - 2;
        if (topology[idx] < 10) topology[idx] += 1;
      }
      updateTopology();
    });
    rmNeuronBtn.addEventListener('click', () => {
      if (topology.length < 3) return;
      const idx = topology.length - 2;
      if (topology[idx] > 1) topology[idx] -= 1;
      updateTopology();
    });
    runBtn.addEventListener('click', () => {
      if (running) return;
      running = true; resetActs();
      setPlaying(card, true); setStatus(card, 'COMPUTING');
      runBtn.textContent = 'RUNNING…'; runBtn.disabled = true;
      raf = requestAnimationFrame(step);
    });

    updateReadout();
    const ro = new ResizeObserver(resize); ro.observe(wrap);
    setTimeout(resize, 50);
    return card;
  }

  /* ==========================================================
     DEMO 3 — Regression (linear + logistic) — unchanged
     ========================================================== */
  function regression(){
    const { card, right } = buildCard({
      num:'03', tag:'ML', title:'Regression', projectSlug:'ml-models-from-scratch',
      desc:'Switch between <b>LINEAR</b> (fit a line to noisy points) and <b>LOGISTIC</b> (draw a decision boundary between two classes). Both use gradient descent on the same idea.',
      pseudo:`<s># linear regression</s>
y_hat = m*x + b
m -= lr * mean((y_hat - y) * x)
b -= lr * mean(y_hat - y)

<s># logistic regression</s>
p = sigmoid(w·x + b)
w -= lr * mean((p - y) * x)`
    });
    const tabs = el('div', 'lab-actions');
    tabs.style.marginTop = '0'; tabs.style.marginBottom = '8px';
    const tabLin = el('button', 'lab-btn mini hot', 'LINEAR');
    const tabLog = el('button', 'lab-btn mini', 'LOGISTIC');
    tabs.append(tabLin, tabLog); right.appendChild(tabs);

    const wrap = el('div', 'lab-canvas');
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas); right.appendChild(wrap);
    const readout = el('div', 'lab-readout'); right.appendChild(readout);
    const actions = el('div', 'lab-actions');
    const fitBtn = el('button', 'lab-btn hot', 'FIT');
    const resetBtn = el('button', 'lab-btn', 'RESET');
    actions.append(fitBtn, resetBtn); right.appendChild(actions);

    let mode = 'linear';
    let ctx = null, W = 100, H = 100, raf = null;

    const TRUE_M = 0.6, TRUE_B = 0.15;
    const linPoints = [];
    for (let i = 0; i < 20; i++){
      const x = Math.random();
      const y = TRUE_M*x + TRUE_B + (Math.random()-0.5)*0.35;
      linPoints.push({ x, y });
    }
    let lm = -0.5, lb = 0.7;

    const logPoints = [];
    for (let i = 0; i < 30; i++){
      const x = Math.random();
      const y = Math.random();
      const cls = (y > 0.35 + x * 0.55 + (Math.random()-0.5)*0.15) ? 1 : 0;
      logPoints.push({ x, y, cls });
    }
    let lw1 = -0.5, lw2 = 0.4, lbb = -0.2;

    function resize(){ const s = sizeCanvas(canvas, wrap); ctx = s.ctx; W = s.W; H = s.H; draw(); }
    function toPx(p){ return { x: 30 + p.x*(W-60), y: H - 20 - p.y*(H-40) }; }
    function mse(){ let s = 0; for (const p of linPoints){ const yp = lm*p.x + lb; s += (p.y-yp)**2; } return s/linPoints.length; }
    function logLoss(){
      let s = 0;
      for (const p of logPoints){
        const z = lw1*p.x + lw2*p.y + lbb;
        const prob = 1/(1+Math.exp(-z));
        s += -(p.cls*Math.log(prob+1e-9) + (1-p.cls)*Math.log(1-prob+1e-9));
      }
      return s / logPoints.length;
    }
    function draw(){
      if (!ctx) return;
      const t = colors();
      ctx.clearRect(0,0,W,H); ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);
      gridBG(ctx, W, H, 20);
      ctx.strokeStyle = t.line2; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.moveTo(30, H-20); ctx.lineTo(W-30, H-20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(30, 20); ctx.lineTo(30, H-20); ctx.stroke();
      ctx.globalAlpha = 1;
      if (mode === 'linear'){
        for (const p of linPoints){
          const q = toPx(p);
          ctx.beginPath(); ctx.arc(q.x, q.y, 3, 0, Math.PI*2);
          ctx.fillStyle = t.accent; ctx.shadowColor = t.accent; ctx.shadowBlur = 6;
          ctx.fill(); ctx.shadowBlur = 0;
        }
        const p1 = toPx({ x: 0, y: lb }), p2 = toPx({ x: 1, y: lm + lb });
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = t.red; ctx.lineWidth = 1.8;
        ctx.shadowColor = t.red; ctx.shadowBlur = 12;
        ctx.stroke(); ctx.shadowBlur = 0;
        readout.innerHTML = `<span>mse <b>${mse().toFixed(4)}</b></span><span class="sep">·</span><span>y = <b>${lm.toFixed(2)}x</b> + <b>${lb.toFixed(2)}</b></span>`;
      } else {
        for (const p of logPoints){
          const q = toPx(p);
          ctx.beginPath(); ctx.arc(q.x, q.y, 3.5, 0, Math.PI*2);
          ctx.fillStyle = p.cls === 1 ? t.accent : t.red;
          ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 6;
          ctx.fill(); ctx.shadowBlur = 0;
        }
        if (Math.abs(lw2) > 0.01){
          const yAt = x => (-lbb - lw1*x) / lw2;
          const p1 = toPx({ x: 0, y: yAt(0) });
          const p2 = toPx({ x: 1, y: yAt(1) });
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = t.bright; ctx.lineWidth = 1.8;
          ctx.shadowColor = t.bright; ctx.shadowBlur = 8;
          ctx.stroke(); ctx.shadowBlur = 0;
        }
        readout.innerHTML = `<span>loss <b>${logLoss().toFixed(4)}</b></span><span class="sep">·</span><span>w = [<b>${lw1.toFixed(2)}</b>, <b>${lw2.toFixed(2)}</b>] b = <b>${lbb.toFixed(2)}</b></span>`;
      }
    }
    let dragging = false;
    function updateFromMouse(e){
      if (mode !== 'linear') return;
      const r = wrap.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      lb = (H - 20 - my) / (H - 40);
      const px0 = (mx - 30) / (W - 60);
      if (px0 !== 0) lm = ((H - 20 - my) / (H - 40) - lb) / px0;
      lm = Math.max(-2, Math.min(2, lm)); lb = Math.max(-1, Math.min(2, lb));
      draw();
    }
    canvas.addEventListener('pointerdown', e => { if (mode !== 'linear') return; dragging = true; canvas.setPointerCapture(e.pointerId); updateFromMouse(e); });
    canvas.addEventListener('pointermove', e => { if (dragging) updateFromMouse(e); });
    canvas.addEventListener('pointerup', () => { dragging = false; });

    function finish(){
      if (raf){ cancelAnimationFrame(raf); raf = null; }
      setPlaying(card, false); setStatus(card, 'CONVERGED');
      fitBtn.textContent = 'FIT AGAIN'; fitBtn.disabled = false;
      draw();
    }
    function fitStep(){
      if (mode === 'linear'){
        const lr = 0.08;
        let gm = 0, gb = 0;
        for (const p of linPoints){ const err = (lm*p.x + lb) - p.y; gm += err*p.x; gb += err; }
        gm *= 2/linPoints.length; gb *= 2/linPoints.length;
        lm -= lr*gm; lb -= lr*gb;
        if (Math.abs(gm) + Math.abs(gb) < 0.01 || mse() < 0.008){ finish(); return; }
      } else {
        const lr = 0.9;
        let gw1 = 0, gw2 = 0, gb = 0;
        for (const p of logPoints){
          const z = lw1*p.x + lw2*p.y + lbb;
          const prob = 1/(1+Math.exp(-z));
          const err = prob - p.cls;
          gw1 += err * p.x; gw2 += err * p.y; gb += err;
        }
        gw1 /= logPoints.length; gw2 /= logPoints.length; gb /= logPoints.length;
        lw1 -= lr*gw1; lw2 -= lr*gw2; lbb -= lr*gb;
        if (Math.abs(gw1) + Math.abs(gw2) + Math.abs(gb) < 0.005){ finish(); return; }
      }
      draw(); raf = requestAnimationFrame(fitStep);
    }
    fitBtn.addEventListener('click', () => {
      setPlaying(card, true); setStatus(card, 'OPTIMIZING');
      fitBtn.textContent = 'FITTING…'; fitBtn.disabled = true;
      raf = requestAnimationFrame(fitStep);
    });
    resetBtn.addEventListener('click', () => {
      if (raf){ cancelAnimationFrame(raf); raf = null; }
      lm = -0.5; lb = 0.7; lw1 = -0.5; lw2 = 0.4; lbb = -0.2;
      setPlaying(card, false); setStatus(card, 'READY');
      fitBtn.textContent = 'FIT'; fitBtn.disabled = false;
      draw();
    });
    tabLin.addEventListener('click', () => {
      if (mode === 'linear') return;
      mode = 'linear'; tabLin.classList.add('hot'); tabLog.classList.remove('hot');
      if (raf){ cancelAnimationFrame(raf); raf = null; }
      setPlaying(card, false); fitBtn.textContent = 'FIT'; fitBtn.disabled = false;
      draw();
    });
    tabLog.addEventListener('click', () => {
      if (mode === 'logistic') return;
      mode = 'logistic'; tabLog.classList.add('hot'); tabLin.classList.remove('hot');
      if (raf){ cancelAnimationFrame(raf); raf = null; }
      setPlaying(card, false); fitBtn.textContent = 'FIT'; fitBtn.disabled = false;
      draw();
    });
    const ro = new ResizeObserver(resize); ro.observe(wrap);
    setTimeout(resize, 50);
    return card;
  }

  /* ==========================================================
     DEMO 4 — Function Approx (crazy targets)
     ========================================================== */
  function functionApprox(){
    const { card, right } = buildCard({
      num:'04', tag:'NN', title:'Function Approx', projectSlug:'math-network',
      desc:'A network tries to <b>learn a target function</b>. Pick one — <b>sin(x)</b> is easy. Everything else is close to solvable but hits a capacity wall. Watch how the model gets <b>near</b> the shape without ever finishing it.',
      pseudo:`target = <em>chosen_function</em>(x)
model  = MLP(width=64)
<b>for</b> epoch <b>in</b> range(N):
    pred = model(x)
    loss = mse(pred, target)
    backprop(loss)`
    });

    const controls = el('div', 'lab-actions');
    controls.style.marginTop = '0'; controls.style.marginBottom = '8px';
    const select = el('select', 'lab-select');

    /* difficulty tiers:
       targetLoss — loss at which we call it "converged"
       maxIter    — hard cap before we stop
       smooth     — low-pass filter passes per step (higher = less capacity)
       label      — status text on finish */
    const FUNCS = {
      'sin(x)':        { f: x => Math.sin(x * Math.PI * 2),                                                targetLoss: 0.001, maxIter: 140, smooth: 1, tier: 'easy' },
      'sin(3x)':       { f: x => Math.sin(x * Math.PI * 6),                                                targetLoss: 0.008, maxIter: 320, smooth: 2, tier: 'medium' },
      'sin(7x)':       { f: x => Math.sin(x * Math.PI * 14),                                               targetLoss: 0.020, maxIter: 420, smooth: 3, tier: 'medium' },
      'chirp sin(x²)': { f: x => Math.sin(x * x * Math.PI * 5),                                            targetLoss: 0.040, maxIter: 480, smooth: 3, tier: 'hard' },
      'square wave':   { f: x => Math.sin(x * Math.PI * 6) > 0 ? 1 : -1,                                   targetLoss: 0.060, maxIter: 480, smooth: 4, tier: 'hard' },
      'sawtooth':      { f: x => 2 * ((x * 3) % 1) - 1,                                                    targetLoss: 0.045, maxIter: 460, smooth: 4, tier: 'hard' },
      'pulse train':   { f: x => Math.abs(Math.sin(x * Math.PI * 8)) > 0.7 ? 1 : -1,                       targetLoss: 0.070, maxIter: 500, smooth: 5, tier: 'hard' },
      'chaotic':       { f: x => 0.5*Math.sin(x*Math.PI*10) + 0.3*Math.sin(x*Math.PI*23) + 0.2*Math.sin(x*Math.PI*47), targetLoss: 0.080, maxIter: 540, smooth: 6, tier: 'chaotic' },
    };

    Object.keys(FUNCS).forEach(k => {
      const o = document.createElement('option');
      o.value = k; o.textContent = k;
      select.appendChild(o);
    });
    controls.appendChild(select);
    right.appendChild(controls);

    const wrap = el('div', 'lab-canvas');
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas); right.appendChild(wrap);
    const readout = el('div', 'lab-readout');
    right.appendChild(readout);
    const actions = el('div', 'lab-actions');
    const trainBtn = el('button', 'lab-btn hot', 'TRAIN');
    const resetBtn = el('button', 'lab-btn', 'RESET');
    actions.append(trainBtn, resetBtn); right.appendChild(actions);

    const N = 100;
    let currentFunc = 'sin(x)';
    let iter = 0, training = false, raf = null, ctx = null, W = 100, H = 100;
    let model = new Array(N).fill(0).map(() => (Math.random() - 0.5) * 1.2);

    function target(){
      const f = FUNCS[currentFunc].f;
      return new Array(N).fill(0).map((_, i) => f(i / (N - 1)));
    }
    function resize(){ const s = sizeCanvas(canvas, wrap); ctx = s.ctx; W = s.W; H = s.H; draw(); }
    function toPx(x, y){ return { x: 30 + x*(W - 60), y: H/2 - y * (H * 0.42) }; }

    function accuracy(){
      /* 100 - normalized loss capped to 0..100 */
      const l = loss();
      const norm = Math.max(0, Math.min(1, l / 0.5));
      return Math.round((1 - norm) * 100);
    }

    function draw(){
      if (!ctx) return;
      const t = colors();
      ctx.clearRect(0,0,W,H); ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);
      gridBG(ctx, W, H, 20);

      ctx.strokeStyle = t.line2; ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.moveTo(30, H/2); ctx.lineTo(W-30, H/2); ctx.stroke();
      ctx.globalAlpha = 1;

      /* target curve */
      const tgt = target();
      ctx.beginPath();
      for (let i = 0; i < N; i++){
        const p = toPx(i/(N-1), tgt[i]);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = t.accent2; ctx.lineWidth = 1.4;
      ctx.shadowColor = t.accent2; ctx.shadowBlur = 8;
      ctx.stroke(); ctx.shadowBlur = 0;

      /* model curve */
      ctx.beginPath();
      for (let i = 0; i < N; i++){
        const p = toPx(i/(N-1), model[i]);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = t.accent; ctx.lineWidth = 1.8;
      ctx.shadowColor = t.accent; ctx.shadowBlur = 12;
      ctx.stroke(); ctx.shadowBlur = 0;

      /* progress bar bottom-right */
      const acc = accuracy();
      const barW = 90, barH = 6;
      const bx = W - barW - 20, by = H - 16;
      ctx.fillStyle = t.line2; ctx.globalAlpha = 0.3;
      ctx.fillRect(bx, by, barW, barH); ctx.globalAlpha = 1;
      ctx.fillStyle = acc >= 90 ? t.bright : (acc >= 70 ? t.accent : t.red);
      ctx.fillRect(bx, by, barW * (acc/100), barH);
      ctx.fillStyle = t.fg3; ctx.font = '9px monospace'; ctx.textAlign = 'right';
      ctx.fillText(acc + '%', bx - 6, by + 7);
    }

    function loss(){
      const tgt = target();
      let s = 0;
      for (let i = 0; i < N; i++) s += (model[i] - tgt[i]) ** 2;
      return s / N;
    }

    function step(){
      const tgt = target();
      const smooth = FUNCS[currentFunc].smooth;

      /* learning step — every iteration pushes model toward target */
      for (let i = 0; i < N; i++){
        model[i] += (tgt[i] - model[i]) * 0.10;
      }

      /* low-pass filter simulates finite model capacity.
         This is what prevents high-frequency functions from being
         learned perfectly, no matter how long you train. */
      for (let p = 0; p < smooth; p++){
        const sm = model.slice();
        for (let i = 1; i < N - 1; i++){
          sm[i] = (model[i-1] + 2 * model[i] + model[i+1]) / 4;
        }
        model = sm;
      }

      iter++;
      draw();

      if (iter % 3 === 0){
        readout.innerHTML = `<span>iter <b>${iter}</b></span><span class="sep">·</span><span>loss <b>${loss().toFixed(4)}</b></span><span class="sep">·</span><span>acc <b>${accuracy()}%</b></span><span class="sep">·</span><span>target <b>${currentFunc}</b></span>`;
      }

      const cfg = FUNCS[currentFunc];
      const done = loss() < cfg.targetLoss || iter >= cfg.maxIter;

      if (done){
        training = false;
        if (raf){ cancelAnimationFrame(raf); raf = null; }
        setPlaying(card, false);
        const succeeded = loss() < cfg.targetLoss;
        const acc = accuracy();

        if (succeeded){
          setStatus(card, 'CONVERGED');
          readout.innerHTML = `<span>iter <b>${iter}</b></span><span class="sep">·</span><span>loss <b>${loss().toFixed(4)}</b></span><span class="sep">·</span><span class="ok">${acc}% — converged</span>`;
        } else {
          /* near-success state: high accuracy but not perfect */
          setStatus(card, acc >= 80 ? 'NEAR' : 'LIMIT');
          readout.innerHTML = `<span>iter <b>${iter}</b></span><span class="sep">·</span><span>loss <b>${loss().toFixed(4)}</b></span><span class="sep">·</span><span class="warn">${acc}% — model capacity wall</span>`;
        }
        trainBtn.textContent = 'TRAIN MORE';
        trainBtn.disabled = false;
        return;
      }

      raf = requestAnimationFrame(step);
    }

    trainBtn.addEventListener('click', () => {
      if (training) return;
      training = true;
      /* don't reset iter if user is clicking "TRAIN MORE" — continues from where it stopped */
      if (trainBtn.textContent === 'TRAIN' || trainBtn.textContent === 'TRAIN AGAIN'){
        iter = 0;
      }
      setPlaying(card, true); setStatus(card, 'TRAINING');
      trainBtn.textContent = 'TRAINING…'; trainBtn.disabled = true;
      raf = requestAnimationFrame(step);
    });
    resetBtn.addEventListener('click', () => {
      if (raf){ cancelAnimationFrame(raf); raf = null; }
      model = new Array(N).fill(0).map(() => (Math.random() - 0.5) * 1.2);
      iter = 0;
      setPlaying(card, false); setStatus(card, 'READY');
      trainBtn.textContent = 'TRAIN'; trainBtn.disabled = false;
      readout.innerHTML = `<span>iter <b>0</b></span><span class="sep">·</span><span>target <b>${currentFunc}</b></span>`;
      draw();
    });
    select.addEventListener('change', () => {
      if (training) return;
      currentFunc = select.value;
      model = new Array(N).fill(0).map(() => (Math.random() - 0.5) * 1.2);
      iter = 0;
      setStatus(card, 'READY');
      trainBtn.textContent = 'TRAIN';
      readout.innerHTML = `<span>iter <b>0</b></span><span class="sep">·</span><span>target <b>${currentFunc}</b></span>`;
      draw();
    });

    readout.innerHTML = `<span>iter <b>0</b></span><span class="sep">·</span><span>target <b>${currentFunc}</b></span>`;
    const ro = new ResizeObserver(resize); ro.observe(wrap);
    setTimeout(resize, 50);
    return card;
  }
  /* ==========================================================
     HACK EGG (LARP only)
     ========================================================== */
  function hackEgg(){
    const sec = el('section', '');
    sec.id = 'lab-hack-egg';
    sec.innerHTML = `
      <div class="lab-egg-head">
        <h3>// hidden layer</h3>
        <span class="badge">◉ larp mode only</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px" id="lab-hack-stack"></div>
    `;
    const stack = sec.querySelector('#lab-hack-stack');

    function makeHackCard(num, tag, title, desc, pseudo, rightBuilder){
      const card = el('article', 'lab-card');
      card.innerHTML = `
        <div class="lab-bar">
          <div class="lab-dots"><i></i><i></i><i></i></div>
          <div class="lab-num">${num}</div>
          <div class="lab-title"><span>[${tag}]</span>${title}</div>
          <div class="lab-status">READY</div>
        </div>
        <div class="lab-body">
          <div class="lab-left">
            <p class="lab-desc">${desc}</p>
            <div class="lab-pseudo">
              <div class="lab-pseudo-head">pseudo-code</div>
              <pre>${pseudo}</pre>
            </div>
          </div>
          <div class="lab-right"></div>
        </div>
      `;
      stack.appendChild(card);
      rightBuilder(card, card.querySelector('.lab-right'));
    }

    /* port scan */
    makeHackCard('H1', 'REC', 'Port Scan',
      'A scanner probes every port and waits for a reply. Open ports answer; closed ones stay quiet.',
      `for port in 1..65535:
    send SYN(port)
    if reply: mark_open(port)`,
      (card, right) => {
        const wrap = el('div', 'lab-canvas');
        const canvas = document.createElement('canvas');
        wrap.appendChild(canvas); right.appendChild(wrap);
        const readout = el('div', 'lab-readout');
        readout.innerHTML = `<span>status <b>idle</b></span>`;
        right.appendChild(readout);
        const actions = el('div', 'lab-actions');
        const btn = el('button', 'lab-btn hot', 'START SCAN');
        actions.appendChild(btn); right.appendChild(actions);
        const COLS = 20, ROWS = 10;
        const OPEN = new Set(['3-2','4-19','5-8','9-13']);
        let scanX = -1, running = false, raf = null, ctx = null, W = 100, H = 100;
        function resize(){ const s = sizeCanvas(canvas, wrap); ctx = s.ctx; W = s.W; H = s.H; draw(); }
        function draw(){
          if (!ctx) return;
          const t = colors();
          ctx.clearRect(0,0,W,H); ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);
          gridBG(ctx, W, H, 16);
          const pad = 12, gw = (W - pad*2)/COLS, gh = (H - pad*2)/ROWS;
          for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++){
            const px = pad + x*gw, py = pad + y*gh;
            const key = x+'-'+y, isOpen = OPEN.has(key);
            const scanned = running && x <= scanX;
            ctx.fillStyle = scanned ? (isOpen ? t.accent : t.line2) : (isOpen ? t.red : t.line2);
            ctx.globalAlpha = scanned ? (isOpen ? 1 : 0.5) : 0.3;
            ctx.fillRect(px+1, py+1, gw-2, gh-2); ctx.globalAlpha = 1;
            if (scanned && isOpen){
              ctx.shadowColor = t.accent; ctx.shadowBlur = 8;
              ctx.fillStyle = t.bright;
              ctx.fillRect(px+2, py+2, gw-4, gh-4); ctx.shadowBlur = 0;
            }
          }
          if (running && scanX >= 0){
            const sx = pad + scanX*gw + gw/2;
            ctx.fillStyle = t.accent; ctx.globalAlpha = 0.5;
            ctx.fillRect(sx-15, pad, 30, H - pad*2); ctx.globalAlpha = 1;
          }
        }
        function step(){
          scanX += 0.6;
          if (scanX > COLS){
            scanX = COLS; running = false;
            if (raf){ cancelAnimationFrame(raf); raf = null; }
            setPlaying(card, false);
            readout.innerHTML = `<span>scan <b>complete</b></span><span class="sep">·</span><span class="ok">22 · 80 · 443</span> <span class="warn">1337</span>`;
            btn.textContent = 'SCAN AGAIN'; btn.disabled = false;
            draw(); return;
          }
          draw(); raf = requestAnimationFrame(step);
        }
        btn.addEventListener('click', () => {
          running = true; scanX = -1;
          setPlaying(card, true);
          btn.textContent = 'SCANNING…'; btn.disabled = true;
          raf = requestAnimationFrame(step);
        });
        const ro = new ResizeObserver(resize); ro.observe(wrap);
        setTimeout(resize, 50);
      });

    /* ddos */
    makeHackCard('H2', 'OFF', 'DDoS Flood',
      'Thousands of machines send junk traffic at once. The server runs out of capacity; a firewall drops it once the pattern is detected.',
      `for bot in botnet:
    while attack.active:
        bot.send(target, junk)`,
      (card, right) => {
        const wrap = el('div', 'lab-canvas');
        const canvas = document.createElement('canvas');
        wrap.appendChild(canvas); right.appendChild(wrap);
        const readout = el('div', 'lab-readout');
        readout.innerHTML = `<span>load <b>0%</b></span>`;
        right.appendChild(readout);
        const actions = el('div', 'lab-actions');
        const startBtn = el('button', 'lab-btn hot', 'START FLOOD');
        const resetBtn = el('button', 'lab-btn', 'RESET');
        actions.append(startBtn, resetBtn); right.appendChild(actions);
        let packets = [], running = false, shield = false, load = 0;
        let raf = null, ctx = null, W = 100, H = 100;
        function resize(){ const s = sizeCanvas(canvas, wrap); ctx = s.ctx; W = s.W; H = s.H; }
        function spawn(){
          const cx = W/2, cy = H/2;
          const side = Math.floor(Math.random()*4);
          let x, y;
          if (side===0){ x = Math.random()*W; y = -8; }
          else if (side===1){ x = W+8; y = Math.random()*H; }
          else if (side===2){ x = Math.random()*W; y = H+8; }
          else { x = -8; y = Math.random()*H; }
          const dx = cx-x, dy = cy-y, d = Math.hypot(dx, dy) || 1;
          packets.push({ x, y, vx: dx/d*1.5, vy: dy/d*1.5, life: 0 });
        }
        function step(){
          if (!ctx){ raf = requestAnimationFrame(step); return; }
          const t = colors();
          ctx.clearRect(0,0,W,H); ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);
          gridBG(ctx, W, H, 20);
          const cx = W/2, cy = H/2;
          if (running){
            for (let i = 0; i < (shield ? 1 : 3 + load/40); i++) spawn();
            load = Math.min(100, load + (shield ? -0.6 : 0.5));
            if (load >= 100 && !shield){ shield = true; setStatus(card, 'DEFENDING'); }
          }
          if (shield){
            ctx.beginPath(); ctx.arc(cx, cy, 34, 0, Math.PI*2);
            ctx.strokeStyle = t.accent; ctx.lineWidth = 1.5;
            ctx.shadowColor = t.accent; ctx.shadowBlur = 14;
            ctx.stroke(); ctx.shadowBlur = 0;
          }
          ctx.fillStyle = t.bg; ctx.fillRect(cx-16, cy-16, 32, 32);
          ctx.strokeStyle = shield ? t.accent : (load > 70 ? t.red : t.line2);
          ctx.lineWidth = 1.5; ctx.strokeRect(cx-16, cy-16, 32, 32);
          ctx.fillStyle = shield ? t.accent : (load > 70 ? t.red : t.fg3);
          for (let i = 0; i < 3; i++) ctx.fillRect(cx-8, cy-8+i*7, 16, 2);
          for (let i = packets.length-1; i >= 0; i--){
            const p = packets[i];
            p.x += p.vx; p.y += p.vy; p.life++;
            const d = Math.hypot(p.x-cx, p.y-cy);
            if (shield && d < 36){
              const nx = (p.x-cx)/d, ny = (p.y-cy)/d;
              const dot = p.vx*nx + p.vy*ny;
              p.vx -= 2*dot*nx; p.vy -= 2*dot*ny;
            }
            if (shield && d < 100 && p.life > 8 && Math.random() < 0.4){ packets.splice(i,1); continue; }
            else if (!shield && d < 22){ packets.splice(i,1); continue; }
            if (p.x < -20 || p.x > W+20 || p.y < -20 || p.y > H+20){ packets.splice(i,1); continue; }
            ctx.fillStyle = shield ? t.accent : t.red;
            ctx.fillRect(p.x-1.5, p.y-1.5, 3, 3);
          }
          readout.innerHTML = `<span>load <b>${load.toFixed(0)}%</b></span><span class="sep">·</span><span>shield <b>${shield?'ON':'off'}</b></span><span class="sep">·</span><span>packets <b>${packets.length}</b></span>`;
          raf = requestAnimationFrame(step);
        }
        startBtn.addEventListener('click', () => {
          if (running) return;
          running = true; load = 0; shield = false; packets = [];
          setPlaying(card, true);
          startBtn.textContent = 'FLOODING…'; startBtn.disabled = true;
        });
        resetBtn.addEventListener('click', () => {
          running = false; load = 0; shield = false; packets = [];
          setPlaying(card, false);
          startBtn.textContent = 'START FLOOD'; startBtn.disabled = false;
        });
        const ro = new ResizeObserver(resize); ro.observe(wrap);
        setTimeout(() => { resize(); raf = requestAnimationFrame(step); }, 50);
      });

    /* brute force */
    makeHackCard('H3', 'CRY', 'Brute Force',
      'Try passwords one by one from a word list of common ones. Weak passwords fall in seconds. Long random ones make the search astronomically large.',
      `for guess in wordlist:
    if hash(guess) == target:
        return guess`,
      (card, right) => {
        const list = el('div', 'lab-list-mini');
        right.appendChild(list);
        const readout = el('div', 'lab-readout');
        readout.innerHTML = `<span>attempts <b>0</b></span>`;
        right.appendChild(readout);
        const actions = el('div', 'lab-actions');
        const btn = el('button', 'lab-btn hot', 'RUN ATTACK');
        actions.appendChild(btn); right.appendChild(actions);
        const WORDS = ['123456','password','12345678','qwerty','admin','letmein','welcome','monkey','dragon','sunshine','iloveyou','princess','football','abc123','111111','passw0rd','master','shadow'];
        let running = false, count = 0, timer = null;
        btn.addEventListener('click', () => {
          if (running) return;
          running = true; count = 0; list.innerHTML = '';
          setPlaying(card, true);
          btn.textContent = 'CRACKING…'; btn.disabled = true;
          let i = 0;
          timer = setInterval(() => {
            count++;
            const w = WORDS[i % WORDS.length];
            const t = colors();
            const row = document.createElement('div');
            const ok = w === 'password';
            row.innerHTML = `<span style="color:${t.fg4}">[${String(count).padStart(4,'0')}]</span> <span style="color:${ok ? t.accent : t.fg2}">${w}</span>${ok ? ' <span style="color:' + t.accent + '">← match</span>' : ''}`;
            list.appendChild(row);
            while (list.children.length > 11) list.removeChild(list.firstChild);
            readout.innerHTML = `<span>attempts <b>${count}</b></span><span class="sep">·</span><span>rate <b>~${(60+Math.random()*40).toFixed(0)}/s</b></span>`;
            i++;
            if (count >= 40){
              clearInterval(timer); running = false;
              setPlaying(card, false);
              btn.textContent = 'RUN AGAIN'; btn.disabled = false;
              readout.innerHTML = `<span>attempts <b>${count}</b></span><span class="sep">·</span><span class="ok">weak password found</span>`;
            }
          }, 70);
        });
      });

    /* sniffer */
    makeHackCard('H4', 'REC', 'Packet Sniffer',
      'On an open network every packet is visible to anyone nearby. HTTPS exists precisely to make captured packets unreadable.',
      `sock = raw_socket("eth0")
sock.promiscuous = True
while True:
    pkt = sock.recv()
    log(pkt.src, pkt.dst)`,
      (card, right) => {
        const box = el('div', 'lab-sniffer');
        right.appendChild(box);
        const readout = el('div', 'lab-readout');
        readout.innerHTML = `<span>packets <b>0</b></span>`;
        right.appendChild(readout);
        const actions = el('div', 'lab-actions');
        const btn = el('button', 'lab-btn hot', 'CAPTURE');
        actions.appendChild(btn); right.appendChild(actions);
        const SRC = ['192.168.1.42','192.168.1.17','10.0.0.5'];
        const DST = ['8.8.8.8','1.1.1.1','142.250.185.78','20.97.5.1'];
        const HOSTS = ['google.com','cloudflare.com','api.github.com','raw.githubusercontent.com'];
        const PROTOS = [{ p:'DNS', cls:'dns' },{ p:'HTTPS', cls:'https' },{ p:'QUIC', cls:'quic' }];
        let running = false, count = 0, timer = null;
        function row(){
          const proto = PROTOS[Math.floor(Math.random()*PROTOS.length)];
          const s = SRC[Math.floor(Math.random()*SRC.length)];
          const d = DST[Math.floor(Math.random()*DST.length)];
          const h = HOSTS[Math.floor(Math.random()*HOSTS.length)];
          const t = new Date();
          const ts = [t.getHours(),t.getMinutes(),t.getSeconds()].map(n => String(n).padStart(2,'0')).join(':');
          const div = document.createElement('div');
          div.className = 'row ' + proto.cls;
          div.innerHTML = `<span class="t">${ts}</span><span>${s} → ${d} · ${h}</span><span class="p">${proto.p}</span>`;
          box.appendChild(div);
          count++;
          readout.innerHTML = `<span>packets <b>${count}</b></span><span class="sep">·</span><span class="warn">promiscuous</span>`;
          while (box.children.length > 11) box.removeChild(box.firstChild);
        }
        btn.addEventListener('click', () => {
          if (running){ clearInterval(timer); running = false; setPlaying(card, false); btn.textContent = 'CAPTURE'; return; }
          running = true; setPlaying(card, true); btn.textContent = 'STOP';
          timer = setInterval(row, 260);
        });
      });

    /* encryption */
    makeHackCard('H5', 'CRY', 'Encryption',
      'Encryption scrambles data with a key. Without the key, the output is noise. HTTPS uses AES-256 — the same idea but far stronger.',
      `def cipher(text, k):
    return "".join(
        shift(c, k) for c in text
    )`,
      (card, right) => {
        const box = el('div', '');
        box.style.cssText = 'display:flex;flex-direction:column;gap:8px;padding:12px;border:1px solid var(--line2);background:var(--bg2);height:220px;box-sizing:border-box;font-family:var(--mono);font-size:11px';
        box.innerHTML = `
          <label style="font-size:9px;letter-spacing:.18em;color:var(--fg3)">INPUT</label>
          <input type="text" class="enc-in" value="hello world" maxlength="40" style="background:var(--bg);border:1px solid var(--line2);color:var(--bright);font-family:var(--mono);font-size:11px;padding:5px 7px;outline:none">
          <label style="font-size:9px;letter-spacing:.18em;color:var(--fg3)">KEY <span style="color:var(--accent)">3</span></label>
          <input type="range" class="enc-slider" min="0" max="25" value="3" style="accent-color:var(--accent)">
          <div class="enc-out" style="color:var(--accent);word-break:break-all;font-size:11px;padding:4px 6px;border:1px dashed var(--line2);min-height:1.5em"></div>
        `;
        right.appendChild(box);
        const inEl = box.querySelector('.enc-in');
        const slider = box.querySelector('.enc-slider');
        const outEl = box.querySelector('.enc-out');
        const keySpan = box.querySelector('label span');
        function cipher(s, k){
          return s.replace(/[a-z]/gi, ch => {
            const base = ch >= 'a' && ch <= 'z' ? 97 : 65;
            const x = ch.charCodeAt(0) - base;
            return String.fromCharCode(((x + k) % 26) + base);
          });
        }
        function render(){
          const k = parseInt(slider.value, 10);
          keySpan.textContent = k;
          outEl.textContent = cipher(inEl.value, k);
          setPlaying(card, k > 0);
        }
        inEl.addEventListener('input', render);
        slider.addEventListener('input', render);
        render();
      });

    return sec;
  }

  /* ==========================================================
     MOUNT
     ========================================================== */
  function mount(){
    if (!/^#\/lab(?:\/|$)/.test(location.hash)) return;
    const host = document.getElementById('lab-mounts');
    if (!host) return;
    if (host.dataset.mounted === '1') return;
    host.dataset.mounted = '1';

    host.append(
      digitDraw(),
      forwardPass(),
      regression(),
      functionApprox(),
      hackEgg()
    );
  }

  window.addEventListener('lab:mount', mount);
  window.addEventListener('hashchange', () => setTimeout(mount, 30));
  new MutationObserver(() => {
    const host = document.getElementById('lab-mounts');
    if (host && host.dataset.mounted !== '1') setTimeout(mount, 30);
  }).observe(document.body, { childList:true, subtree:true });

  setTimeout(mount, 100);
})();