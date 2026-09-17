/* ============================================================
   LARPSOCIETY — LAB DEMOS (theme-aware, race-free)
   ─ Both sections are always in the DOM when on /lab.
   ─ Visibility is toggled by CSS on <html> class:
       html:not(.larp-mode) → hack section hidden
       html.larp-mode       → default .lab-list hidden
   ─ All colors come from site CSS variables so the whole Lab
     inherits amber in normal mode, purple in LARP mode.
   ============================================================ */
(function(){
  const HTML = document.documentElement;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const raf2 = fn => requestAnimationFrame(() => requestAnimationFrame(fn));
  const onLab = () => /^#\/lab(?:\/|$)/.test(location.hash);

  /* ==========================================================
     READ THEME COLORS FROM CSS VARIABLES
     ========================================================== */
  function themeColors(){
    const cs = getComputedStyle(document.documentElement);
    const v = (name, fb) => (cs.getPropertyValue(name) || '').trim() || fb;
    return {
      bg:      v('--bg',       '#050208'),
      panel:   v('--panel',    '#12082a'),
      line:    v('--line',     '#2e1065'),
      line2:   v('--line2',    '#6d28d9'),
      accent:  v('--accent',   '#a855f7'),
      accent2: v('--accent2',  '#d8b4fe'),
      bright:  v('--bright',   '#f3e8ff'),
      fg2:     v('--fg2',      '#c084fc'),
      fg3:     v('--fg3',      '#7c3aed'),
      fg4:     v('--fg4',      '#4c1d95'),
      red:     v('--red',      '#ff2d78'),
    };
  }

  /* register every canvas draw fn so we can re-render on theme change */
  const drawRegistry = new Set();
  function redrawAll(){ drawRegistry.forEach(fn => { try { fn(); } catch(e){} }); }

  /* ==========================================================
     STYLES — all using site CSS variables
     ========================================================== */
  const style = document.createElement('style');
  style.id = 'lab-larp-styles';
  style.textContent = `
    /* ---------- gating ---------- */
    html:not(.larp-mode) #lab-hack-section{ display: none !important; }
    html.larp-mode .lab-list{ display: none !important; }

    /* ---------- outer section ---------- */
    .lab-section{
      margin: 32px 0 42px;
      border:1px solid var(--line2);
      background:
        linear-gradient(180deg, var(--panel) 0%, var(--bg) 100%),
        repeating-linear-gradient(0deg,
          transparent 0px, transparent 3px,
          rgba(255,255,255,.012) 3px, rgba(255,255,255,.012) 4px);
      padding:22px 22px 24px;
      position:relative;
      min-width:0;
      overflow:hidden;
      box-shadow:
        inset 0 0 40px rgba(255,255,255,.015),
        0 0 30px rgba(0,0,0,.35);
    }
    .lab-section::before,
    .lab-section::after{
      content:"";position:absolute;width:14px;height:14px;
      border:1px solid var(--accent);pointer-events:none;z-index:2;
    }
    .lab-section::before{ top:-1px;left:-1px;border-right:0;border-bottom:0; }
    .lab-section::after{ bottom:-1px;right:-1px;border-left:0;border-top:0; }

    /* ---------- header ---------- */
    .lab-sec-head{
      display:flex;justify-content:space-between;gap:20px;
      align-items:flex-start;margin-bottom:20px;
      flex-wrap:wrap;padding-bottom:16px;
      border-bottom:1px dashed var(--line2);
    }
    .lab-sec-head h2{
      margin:6px 0 8px;
      font-family:var(--mono);font-weight:normal;
      font-size:22px;color:var(--bright);
      text-shadow:var(--glow);
      letter-spacing:-.005em;
    }
    .lab-sec-head h2::after{
      content:"▊";display:inline-block;margin-left:.15em;
      color:var(--accent);
      animation:labBlink 1s steps(2) infinite;
      font-size:.65em;vertical-align:baseline;
    }
    @keyframes labBlink{ 50%{ opacity:0; } }
    .lab-sec-head p{
      margin:0;color:var(--fg3);font-size:12px;
      max-width:680px;line-height:1.65;
    }
    .lab-sec-badges{
      display:flex;gap:8px;flex-wrap:wrap;
      justify-content:flex-end;max-width:320px;
    }
    .lab-badge{
      font-size:9px;letter-spacing:.22em;
      color:var(--accent);border:1px solid var(--line2);
      padding:5px 10px;background:var(--accentbg);
      white-space:nowrap;
      display:inline-flex;align-items:center;gap:6px;
    }
    .lab-badge::before{
      content:"";width:6px;height:6px;border-radius:50%;
      background:var(--accent);
      animation:labBlink 1.2s ease-in-out infinite;
    }
    .lab-badge.locked{
      color:var(--red);border-color:var(--line2);
      background:rgba(255,45,120,.08);
    }
    .lab-badge.locked::before{ content:"◉"; background:transparent; }

    /* ---------- stack ---------- */
    .lab-stack{ display:flex;flex-direction:column; gap:16px; }

    /* ---------- item shell ---------- */
    .lab-item{
      border:1px solid var(--line2);
      background:var(--bg);
      box-shadow:
        inset 0 0 30px rgba(255,255,255,.02),
        0 4px 20px rgba(0,0,0,.5);
      min-width:0;
      transition:border-color .18s ease, box-shadow .18s ease;
    }
    .lab-item:hover{
      border-color:var(--accent);
      box-shadow:
        inset 0 0 30px rgba(255,255,255,.03),
        0 4px 20px rgba(0,0,0,.5),
        0 0 22px rgba(255,140,0,.15);
    }

    /* ---------- title bar ---------- */
    .lab-item-bar{
      display:flex;align-items:center;gap:10px;
      padding:8px 12px;
      background:linear-gradient(180deg, var(--panel2) 0%, var(--panel) 100%);
      border-bottom:1px solid var(--line2);
      min-width:0;
    }
    .llc-dots{ display:flex;gap:5px;flex-shrink:0; }
    .llc-dots i{
      display:block;width:9px;height:9px;border-radius:50%;
      background:var(--line2);
    }
    .llc-dots i:nth-child(1){ background:var(--red); }
    .llc-dots i:nth-child(2){ background:var(--accent2); }
    .llc-dots i:nth-child(3){ background:var(--accent); }

    .lab-item-num{
      font-family:var(--mono);font-size:12px;
      color:var(--accent);letter-spacing:.05em;
      padding:2px 8px;
      border:1px solid var(--line2);
      background:var(--accentbg);
      text-shadow:var(--glow);
      flex-shrink:0;min-width:34px;text-align:center;
    }
    .lab-item-title{
      flex:1;min-width:0;
      font-family:var(--mono);font-size:11px;letter-spacing:.1em;
      color:var(--fg2);
      overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
    }
    .lab-item-title span{ color:var(--accent);margin-right:6px; }
    .llc-bar-status{
      flex-shrink:0;
      font-family:var(--mono);font-size:9px;
      letter-spacing:.18em;color:var(--fg4);
      display:flex;align-items:center;gap:5px;
    }
    .llc-bar-status::before{
      content:"";width:6px;height:6px;border-radius:50%;
      background:var(--fg4);
      transition:background .2s ease, box-shadow .2s ease;
    }
    .lab-item.playing .llc-bar-status{ color:var(--accent); }
    .lab-item.playing .llc-bar-status::before{
      background:var(--accent);
      box-shadow:0 0 8px var(--accent);
      animation:labBlink 1s ease-in-out infinite;
    }

    /* ---------- two-column body ---------- */
    .lab-item-body{
      display:grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
      align-items: stretch;
      min-width:0;
    }
    @media(max-width:820px){
      .lab-item-body{ grid-template-columns: minmax(0, 1fr); }
    }

    .lab-item-left{
      padding:16px 20px 18px 16px;
      display:flex;flex-direction:column;gap:12px;
      min-width:0;
      border-right:1px dashed var(--line2);
    }
    @media(max-width:820px){
      .lab-item-left{
        border-right:0;
        border-bottom:1px dashed var(--line2);
      }
    }
    .lab-item-desc{
      margin:0;color:var(--fg2);font-size:12px;line-height:1.7;
      min-width:0;
    }
    .lab-item-desc b{
      color:var(--bright);font-weight:normal;
      text-shadow:var(--glow);
    }

    .lab-pseudo{
      border:1px solid var(--line2);
      background:var(--bg2);
      min-width:0;overflow:hidden;
      flex:1;display:flex;flex-direction:column;
    }
    .lab-pseudo-head{
      padding:6px 10px;
      border-bottom:1px dashed var(--line2);
      font-family:var(--mono);font-size:9px;
      letter-spacing:.22em;color:var(--fg3);
      text-transform:uppercase;
      background:var(--accentbg);
      display:flex;align-items:center;gap:8px;
    }
    .lab-pseudo-head::before{
      content:"▸";color:var(--accent);
      text-shadow:var(--glow);
    }
    .lab-pseudo-head .ph-lang{
      margin-left:auto;color:var(--fg4);
    }
    .lab-pseudo pre{
      margin:0;padding:12px 14px;
      font-family:var(--mono);font-size:11px;
      line-height:1.65;color:var(--fg2);
      white-space:pre;overflow-x:auto;min-width:0;
    }
    .lab-pseudo pre em{ color:var(--accent); font-style:normal; }
    .lab-pseudo pre b { color:var(--bright); font-weight:normal; }
    .lab-pseudo pre i { color:var(--red); font-style:normal; }
    .lab-pseudo pre s { color:var(--fg4); text-decoration:none; }
    .lab-pseudo pre u { color:var(--accent2); text-decoration:none; }

    /* ---------- right column ---------- */
    .lab-item-right{
      padding:16px;
      display:flex;flex-direction:column;gap:10px;
      min-width:0;
    }

    /* ---------- canvas ---------- */
    .llc-canvas{
      position:relative;
      background:var(--bg2);
      border:1px solid var(--line2);
      height:180px;width:100%;
      min-width:0;max-width:100%;
      overflow:hidden;box-sizing:border-box;
    }
    .llc-canvas::after{
      content:"";position:absolute;inset:0;pointer-events:none;
      background:repeating-linear-gradient(0deg,
          rgba(0,0,0,.35) 0px, rgba(0,0,0,.35) 1px,
          transparent 1px, transparent 3px);
      mix-blend-mode: multiply;opacity:.5;z-index:2;
    }
    .llc-canvas canvas{
      display:block;width:100%;height:100%;
      max-width:100%;max-height:100%;
      box-sizing:border-box;position:relative;z-index:1;
    }

    /* ---------- readout ---------- */
    .llc-readout{
      font-family:var(--mono);font-size:10px;color:var(--fg2);
      line-height:1.6;
      min-height:34px;min-width:0;overflow:hidden;
      padding:6px 9px;
      border:1px solid var(--line2);
      background:var(--bg2);
      display:flex;align-items:center;gap:10px;flex-wrap:wrap;
    }
    .llc-readout b{ color:var(--bright); font-weight:normal; }
    .llc-readout .warn{ color:var(--red); }
    .llc-readout .ok{ color:var(--accent); }
    .llc-readout .sep{ color:var(--fg4); }

    /* ---------- buttons ---------- */
    .llc-actions{
      display:flex;gap:8px;flex-wrap:wrap;
      min-width:0;margin-top:auto;
    }
    .llc-btn{
      font-family:var(--mono);font-size:10px;letter-spacing:.16em;
      color:var(--bright);background:var(--accentbg);
      border:1px solid var(--line2);
      padding:6px 12px;cursor:pointer;
      transition:all .12s ease;
      white-space:nowrap;position:relative;overflow:hidden;
    }
    .llc-btn::before{
      content:"";position:absolute;inset:0;
      background:linear-gradient(90deg,
        transparent 0%, transparent 40%,
        rgba(255,255,255,.08) 50%,
        transparent 60%, transparent 100%);
      transform: translateX(-100%);
      transition: transform .4s ease;pointer-events: none;
    }
    .llc-btn:hover::before{ transform: translateX(100%); }
    .llc-btn:hover{
      border-color:var(--accent);
      color:var(--bright);
      box-shadow:var(--glow);
    }
    .llc-btn:focus-visible{ outline:1px dashed var(--accent); outline-offset:2px; }
    .llc-btn.hot{
      border-color:var(--accent);
      color:var(--bright);
      background:var(--accentbg);
      box-shadow:var(--glow);
    }
    .llc-btn:disabled{ opacity:.5;cursor:default; }
    .llc-btn:disabled:hover{ box-shadow:none; }

    /* ---------- sniffer ---------- */
    .llc-sniffer{
      background:var(--bg2);border:1px solid var(--line2);
      height:180px;width:100%;min-width:0;max-width:100%;
      overflow:hidden;font-family:var(--mono);font-size:10px;
      padding:6px 8px;display:flex;flex-direction:column;
      box-sizing:border-box;position:relative;
    }
    .llc-sniffer .row{
      display:grid;grid-template-columns: 52px minmax(0, 1fr) auto;
      gap:8px;line-height:1.55;color:var(--fg2);
      animation:llcRowIn .25s ease forwards;opacity:0;min-width:0;
    }
    .llc-sniffer .row > *{
      min-width:0;overflow:hidden;
      text-overflow:ellipsis;white-space:nowrap;
    }
    @keyframes llcRowIn{ to { opacity:1; } }
    .llc-sniffer .row .t{ color:var(--fg4); }
    .llc-sniffer .row .p{ text-align:right;color:var(--fg3); }
    .llc-sniffer .row.dns   .p{ color:#00b7ff; }
    .llc-sniffer .row.https .p{ color:var(--accent); }
    .llc-sniffer .row.quic  .p{ color:#ffb44d; }
    .llc-sniffer .row.tcp   .p{ color:var(--fg2); }

    /* ---------- brute ---------- */
    .llc-brute{
      background:var(--bg2);border:1px solid var(--line2);
      padding:10px;font-family:var(--mono);font-size:11px;
      display:flex;flex-direction:column;gap:6px;
      height:180px;box-sizing:border-box;min-width:0;
    }
    .llc-brute .list{
      flex:1;overflow:hidden;
      display:flex;flex-direction:column-reverse;
      gap:2px;min-width:0;
    }
    .llc-brute .list > div{
      min-width:0;overflow:hidden;
      white-space:nowrap;text-overflow:ellipsis;
    }
    .llc-brute .counter{
      font-size:10px;color:var(--accent);
      border-top:1px dashed var(--line2);padding-top:6px;
    }

    /* ---------- encryption ---------- */
    .llc-enc{
      background:var(--bg2);border:1px solid var(--line2);
      padding:12px;font-family:var(--mono);font-size:11px;
      display:flex;flex-direction:column;gap:10px;
      min-width:0;height:180px;box-sizing:border-box;
    }
    .llc-enc label{
      display:block;font-size:9px;letter-spacing:.18em;
      color:var(--fg3);margin-bottom:3px;
    }
    .llc-enc input[type=text]{
      width:100%;background:var(--bg);border:1px solid var(--line2);
      color:var(--bright);font-family:var(--mono);font-size:11px;
      padding:5px 7px;outline:none;box-sizing:border-box;min-width:0;
    }
    .llc-enc input[type=text]:focus{
      border-color:var(--accent);
      box-shadow:var(--glow);
    }
    .llc-enc .out{
      color:var(--accent);word-break:break-all;
      min-height:1.5em;font-size:11px;
      padding:4px 6px;border:1px dashed var(--line2);
      background:var(--accentbg);
    }
    .llc-enc input[type=range]{ width:100%; accent-color:var(--accent); }
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
  function setStatus(card, text){
    const s = card.querySelector('.llc-bar-status');
    if (s) s.textContent = text;
  }
  function setPlaying(card, on){
    card.classList.toggle('playing', !!on);
    setStatus(card, on ? 'RUNNING' : 'READY');
  }
  function sizeCanvas(canvas, wrap){
    const r = wrap.getBoundingClientRect();
    const W = Math.max(1, Math.floor(r.width));
    const H = Math.max(1, Math.floor(r.height));
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, W, H };
  }
  function gridBG(ctx, W, H, step){
    ctx.strokeStyle = 'rgba(120,120,120,.12)';
    ctx.lineWidth = 0.5;
    for (let gx = 0; gx <= W; gx += (step||16)){
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (let gy = 0; gy <= H; gy += (step||16)){
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }
  }
  function buildItem({ num, tag, title, desc, lang, pseudo }){
    const item = el('article', 'lab-item');
    item.innerHTML = `
      <div class="lab-item-bar">
        <div class="llc-dots"><i></i><i></i><i></i></div>
        <div class="lab-item-num">${esc(num)}</div>
        <div class="lab-item-title"><span>[${esc(tag)}]</span>${esc(title)}</div>
        <div class="llc-bar-status">READY</div>
      </div>
      <div class="lab-item-body">
        <div class="lab-item-left">
          <p class="lab-item-desc">${desc}</p>
          <div class="lab-pseudo">
            <div class="lab-pseudo-head">pseudo-code<span class="ph-lang">${esc(lang)}</span></div>
            <pre>${pseudo}</pre>
          </div>
        </div>
        <div class="lab-item-right"></div>
      </div>
    `;
    return { item, right: item.querySelector('.lab-item-right') };
  }

  /* ==========================================================
     HACK GAMES
     ========================================================== */

  function portScanItem(){
    const { item, right } = buildItem({
      num:'01', tag:'REC', title:'Port Scan', lang:'bash',
      desc:'A scanner probes every port and waits for a reply. <b>Open ports answer</b>; closed ones stay silent. Real tools like <b>nmap</b> do exactly this — very fast — across millions of addresses.',
      pseudo:`<s># probe a range of ports</s>
<b>for</b> port <b>in</b> <em>1</em>..<em>65535</em>:
    <u>send</u> SYN(port)
    <i>if</i> reply == SYN+ACK:
        mark_open(port)`
    });
    const wrap = el('div', 'llc-canvas');
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    right.appendChild(wrap);
    const readout = el('div', 'llc-readout');
    readout.innerHTML = `<span>status <b>idle</b></span>`;
    right.appendChild(readout);
    const actions = el('div', 'llc-actions');
    const btn = el('button', 'llc-btn hot', 'START SCAN');
    actions.appendChild(btn);
    right.appendChild(actions);

    const COLS = 20, ROWS = 10;
    const OPEN = new Set(['3-2','4-19','5-8','9-13']);
    let scanX = -1, running = false, raf = null, ctx = null, W = 100, H = 100;

    function resize(){
      const s = sizeCanvas(canvas, wrap);
      ctx = s.ctx; W = s.W; H = s.H; draw();
    }
    function draw(){
      if (!ctx) return;
      const t = themeColors();
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);
      gridBG(ctx, W, H, 16);
      const pad = 12;
      const gw = (W - pad*2) / COLS;
      const gh = (H - pad*2) / ROWS;
      for (let y=0; y<ROWS; y++){
        for (let x=0; x<COLS; x++){
          const px = pad + x*gw, py = pad + y*gh;
          const key = x+'-'+y;
          const isOpen = OPEN.has(key);
          const scanned = running && x <= scanX;
          let fill = 'rgba(120,90,60,.25)';
          if (scanned) fill = isOpen ? t.accent : t.line;
          else if (isOpen) fill = t.line;
          ctx.fillStyle = fill;
          ctx.globalAlpha = isOpen && scanned ? 1 : (scanned ? 0.5 : (isOpen ? 0.4 : 0.3));
          ctx.fillRect(px+1, py+1, gw-2, gh-2);
          ctx.globalAlpha = 1;
          if (scanned && isOpen){
            ctx.shadowColor = t.accent; ctx.shadowBlur = 8;
            ctx.fillStyle = t.bright;
            ctx.fillRect(px+2, py+2, gw-4, gh-4);
            ctx.shadowBlur = 0;
          }
        }
      }
      if (running && scanX >= 0){
        const sx = pad + scanX * gw + gw/2;
        const grad = ctx.createLinearGradient(sx-20,0,sx+20,0);
        grad.addColorStop(0, 'rgba(255,140,0,0)');
        grad.addColorStop(.5, t.accent);
        grad.addColorStop(1, 'rgba(255,140,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(sx-20, pad, 40, H-pad*2);
      }
    }
    drawRegistry.add(draw);
    function step(){
      scanX += 0.6;
      if (scanX > COLS){
        scanX = COLS; running = false;
        if (raf){ cancelAnimationFrame(raf); raf = null; }
        setPlaying(item, false);
        readout.innerHTML = `<span>scan <b>complete</b></span><span class="sep">·</span><span>found <b>4</b></span><span class="sep">·</span><span class="ok">22</span> <span class="ok">80</span> <span class="ok">443</span> <span class="warn">1337</span>`;
        btn.textContent = 'SCAN AGAIN'; btn.disabled = false;
        draw(); return;
      }
      draw(); raf = requestAnimationFrame(step);
    }
    btn.addEventListener('click', () => {
      if (running) return;
      running = true; scanX = -1;
      setPlaying(item, true);
      btn.textContent = 'SCANNING…'; btn.disabled = true;
      readout.innerHTML = `<span>probing ports <b>0–255</b>…</span>`;
      raf = requestAnimationFrame(step);
    });
    const ro = new ResizeObserver(resize); ro.observe(wrap);
    setTimeout(resize, 50);
    return item;
  }

  function ddosItem(){
    const { item, right } = buildItem({
      num:'02', tag:'OFF', title:'DDoS Flood', lang:'py',
      desc:'Thousands of machines send junk traffic at once. The server runs out of <b>capacity</b> and can’t answer real users. Firewalls and scrubbing centers detect the pattern and drop it.',
      pseudo:`<s># botnet floods the target</s>
<b>for</b> bot <b>in</b> botnet:
    <b>while</b> attack.active:
        bot.<u>send</u>(target, rand_bytes())`
    });
    const wrap = el('div', 'llc-canvas');
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    right.appendChild(wrap);
    const readout = el('div', 'llc-readout');
    readout.innerHTML = `<span>load <b>0%</b></span><span class="sep">·</span><span>shield <b>off</b></span>`;
    right.appendChild(readout);
    const actions = el('div', 'llc-actions');
    const startBtn = el('button', 'llc-btn hot', 'START FLOOD');
    const resetBtn = el('button', 'llc-btn', 'RESET');
    actions.append(startBtn, resetBtn);
    right.appendChild(actions);

    let packets = [], running = false, shield = false, load = 0;
    let raf = null, ctx = null, W = 100, H = 100;

    function resize(){
      const s = sizeCanvas(canvas, wrap);
      ctx = s.ctx; W = s.W; H = s.H;
    }
    function spawn(){
      const cx = W/2, cy = H/2;
      const side = Math.floor(Math.random()*4);
      let x,y;
      if (side===0){ x = Math.random()*W; y = -8; }
      else if (side===1){ x = W+8; y = Math.random()*H; }
      else if (side===2){ x = Math.random()*W; y = H+8; }
      else { x = -8; y = Math.random()*H; }
      const dx = cx - x, dy = cy - y;
      const d = Math.hypot(dx, dy) || 1;
      const speed = 1.2 + Math.random()*0.9;
      packets.push({ x, y, vx: dx/d*speed, vy: dy/d*speed, life: 0 });
    }
    function step(){
      if (!ctx){ raf = requestAnimationFrame(step); return; }
      const t = themeColors();
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);
      gridBG(ctx, W, H, 20);
      const cx = W/2, cy = H/2;
      if (running){
        const rate = shield ? 0.4 : 1.2 + load/40;
        for (let i=0;i<rate*2;i++) spawn();
        load = Math.min(100, load + (shield ? -0.6 : 0.55));
        if (load >= 100 && !shield){ shield = true; setStatus(item, 'DEFENDING'); }
      }
      if (shield){
        ctx.beginPath();
        ctx.arc(cx, cy, 34, 0, Math.PI*2);
        ctx.strokeStyle = t.accent;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = t.accent; ctx.shadowBlur = 14;
        ctx.stroke(); ctx.shadowBlur = 0;
      }
      ctx.fillStyle = t.bg;
      ctx.fillRect(cx-16, cy-16, 32, 32);
      ctx.strokeStyle = shield ? t.accent : (load > 70 ? t.red : t.line2);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx-16, cy-16, 32, 32);
      ctx.fillStyle = shield ? t.accent : (load > 70 ? t.red : t.fg3);
      for (let i=0;i<3;i++) ctx.fillRect(cx-8, cy-8 + i*7, 16, 2);
      for (let i=packets.length-1;i>=0;i--){
        const p = packets[i];
        p.x += p.vx; p.y += p.vy; p.life++;
        const d = Math.hypot(p.x-cx, p.y-cy);
        if (shield && d < 36){
          const nx = (p.x-cx)/d, ny = (p.y-cy)/d;
          const dot = p.vx*nx + p.vy*ny;
          p.vx -= 2*dot*nx; p.vy -= 2*dot*ny;
        }
        if (shield && d < 100 && p.life > 8){
          if (Math.random() < 0.4){ packets.splice(i,1); continue; }
        } else if (!shield && d < 22){
          packets.splice(i,1); continue;
        }
        if (p.x < -20 || p.x > W+20 || p.y < -20 || p.y > H+20){
          packets.splice(i,1); continue;
        }
        ctx.fillStyle = shield ? t.accent : t.red;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(p.x-1.5, p.y-1.5, 3, 3);
        ctx.globalAlpha = 1;
      }
      readout.innerHTML = `<span>load <b>${load.toFixed(0)}%</b></span><span class="sep">·</span><span>shield <b>${shield?'ON':'off'}</b></span><span class="sep">·</span><span>packets <b>${packets.length}</b></span>`;
      raf = requestAnimationFrame(step);
    }
    startBtn.addEventListener('click', () => {
      if (running) return;
      running = true; load = 0; shield = false; packets = [];
      setPlaying(item, true);
      startBtn.textContent = 'FLOODING…'; startBtn.disabled = true;
    });
    resetBtn.addEventListener('click', () => {
      running = false; load = 0; shield = false; packets = [];
      setPlaying(item, false);
      startBtn.textContent = 'START FLOOD'; startBtn.disabled = false;
    });
    const ro = new ResizeObserver(resize); ro.observe(wrap);
    setTimeout(() => { resize(); raf = requestAnimationFrame(step); }, 50);
    return item;
  }

  function bruteItem(){
    const { item, right } = buildItem({
      num:'03', tag:'CRY', title:'Brute Force', lang:'py',
      desc:'Attackers try passwords one by one from a <b>word list</b> of common ones. Weak passwords fall in seconds. Long random ones make the search astronomically large.',
      pseudo:`<s># try every word in the list</s>
<b>for</b> guess <b>in</b> wordlist:
    <i>if</i> <u>hash</u>(guess) == target_hash:
        <b>return</b> guess  <s># cracked</s>`
    });
    const brute = el('div', 'llc-brute');
    const list = el('div', 'list');
    brute.appendChild(list);
    const counter = el('div', 'counter');
    counter.innerHTML = `attempts <b>0</b>`;
    brute.appendChild(counter);
    right.appendChild(brute);
    const actions = el('div', 'llc-actions');
    const btn = el('button', 'llc-btn hot', 'RUN ATTACK');
    actions.appendChild(btn);
    right.appendChild(actions);

    const WORDS = ['123456','password','12345678','qwerty','admin','letmein','welcome','monkey','1234567890','dragon','sunshine','iloveyou','princess','football','abc123','111111','123123','passw0rd','master','shadow'];
    let running = false, count = 0, timer = null;

    function pushAttempt(w){
      const t = themeColors();
      const row = document.createElement('div');
      const ok = w === 'password';
      row.innerHTML = `<span style="color:${t.fg4}">[${String(count).padStart(5,'0')}]</span> <span style="color:${ok ? t.accent : t.fg2}">${esc(w)}</span> ${ok ? '<span style="color:' + t.accent + '">← match</span>' : ''}`;
      list.appendChild(row);
      while (list.children.length > 9) list.removeChild(list.firstChild);
      counter.innerHTML = `attempts <b>${count}</b> · rate <b>~${(60+Math.random()*40).toFixed(0)}/s</b>`;
    }
    btn.addEventListener('click', () => {
      if (running) return;
      running = true; count = 0; list.innerHTML = '';
      setPlaying(item, true);
      btn.textContent = 'CRACKING…'; btn.disabled = true;
      let i = 0;
      timer = setInterval(() => {
        count++;
        pushAttempt(WORDS[i % WORDS.length]);
        i++;
        if (count >= 42){
          clearInterval(timer); running = false;
          setPlaying(item, false);
          btn.textContent = 'RUN AGAIN'; btn.disabled = false;
          counter.innerHTML = `attempts <b>${count}</b> · <span style="color:${themeColors().accent}">weak password found</span>`;
        }
      }, 70);
    });
    return item;
  }

  function snifferItem(){
    const { item, right } = buildItem({
      num:'04', tag:'REC', title:'Packet Sniffer', lang:'py',
      desc:'On an open network, every packet is visible to anyone nearby. Sniffers capture them silently. <b>HTTPS</b> exists precisely to make those packets unreadable even if captured.',
      pseudo:`<s># capture all frames on iface</s>
sock = <u>raw_socket</u>("eth0")
sock.promiscuous = <b>True</b>
<b>while</b> <b>True</b>:
    pkt = sock.<u>recv</u>()
    log(pkt.src, pkt.dst, pkt.proto)`
    });
    const box = el('div', 'llc-sniffer');
    right.appendChild(box);
    const readout = el('div', 'llc-readout');
    readout.innerHTML = `<span>packets <b>0</b></span><span class="sep">·</span><span>iface <b>eth0</b></span>`;
    right.appendChild(readout);
    const actions = el('div', 'llc-actions');
    const btn = el('button', 'llc-btn hot', 'CAPTURE');
    actions.appendChild(btn);
    right.appendChild(actions);

    const SRC = ['192.168.1.42','192.168.1.17','10.0.0.5'];
    const DST = ['8.8.8.8','1.1.1.1','142.250.185.78','20.97.5.1','104.21.14.99'];
    const HOSTS = ['google.com','cloudflare.com','api.github.com','raw.githubusercontent.com','wikipedia.org','chat.openai.com'];
    const PROTOS = [
      { p:'DNS', cls:'dns' }, { p:'HTTPS', cls:'https' },
      { p:'QUIC', cls:'quic' }, { p:'TCP', cls:'tcp' },
    ];
    let running = false, count = 0, timer = null;

    function newRow(){
      const proto = PROTOS[Math.floor(Math.random()*PROTOS.length)];
      const src = SRC[Math.floor(Math.random()*SRC.length)];
      const dst = DST[Math.floor(Math.random()*DST.length)];
      const host = HOSTS[Math.floor(Math.random()*HOSTS.length)];
      const t = new Date();
      const ts = [t.getHours(),t.getMinutes(),t.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');
      const row = document.createElement('div');
      row.className = 'row ' + proto.cls;
      row.innerHTML = `
        <span class="t">${ts}</span>
        <span>${esc(src)} → ${esc(dst)} · ${esc(host)}</span>
        <span class="p">${esc(proto.p)}</span>`;
      box.appendChild(row);
      count++;
      readout.innerHTML = `<span>packets <b>${count}</b></span><span class="sep">·</span><span>iface <b>eth0</b></span><span class="sep">·</span><span class="warn">promiscuous</span>`;
      while (box.children.length > 9) box.removeChild(box.firstChild);
    }
    btn.addEventListener('click', () => {
      if (running){
        clearInterval(timer); running = false;
        setPlaying(item, false);
        btn.textContent = 'CAPTURE';
        return;
      }
      running = true;
      setPlaying(item, true);
      btn.textContent = 'STOP';
      timer = setInterval(newRow, 260);
    });
    return item;
  }

  function encItem(){
    const { item, right } = buildItem({
      num:'05', tag:'CRY', title:'Encryption', lang:'py',
      desc:'Encryption scrambles data with a key. Without the key, the output is noise. Every byte you send over <b>HTTPS</b> is encrypted exactly like this — just with a much stronger algorithm.',
      pseudo:`<s># shift every letter by k (Caesar)</s>
<b>def</b> <em>cipher</em>(text, k):
    <b>return</b> "".<u>join</u>(
        <u>shift</u>(c, k) <b>for</b> c <b>in</b> text
    )`
    });
    const box = el('div', 'llc-enc');
    box.innerHTML = `
      <div>
        <label>INPUT</label>
        <input type="text" id="llc-enc-in" value="hello world" maxlength="40">
      </div>
      <div>
        <label>KEY <span id="llc-enc-k" style="color:var(--accent)">3</span></label>
        <input type="range" id="llc-enc-slider" min="0" max="25" value="3">
      </div>
      <div>
        <label>OUTPUT</label>
        <div class="out" id="llc-enc-out"></div>
      </div>`;
    right.appendChild(box);
    const inEl = box.querySelector('#llc-enc-in');
    const slider = box.querySelector('#llc-enc-slider');
    const keyEl = box.querySelector('#llc-enc-k');
    const outEl = box.querySelector('#llc-enc-out');
    function cipher(s, k){
      return s.replace(/[a-z]/gi, ch => {
        const base = ch >= 'a' && ch <= 'z' ? 97 : 65;
        const x = ch.charCodeAt(0) - base;
        return String.fromCharCode(((x + k) % 26) + base);
      });
    }
    function render(){
      const k = parseInt(slider.value, 10);
      keyEl.textContent = k;
      outEl.textContent = cipher(inEl.value, k);
      setPlaying(item, k > 0);
    }
    inEl.addEventListener('input', render);
    slider.addEventListener('input', render);
    render();
    return item;
  }

  /* ==========================================================
     PROJECT PLAYGROUNDS
     ========================================================== */

  function digitDrawItem(){
    const { item, right } = buildItem({
      num:'01', tag:'MNIST', title:'Digit Draw', lang:'py',
      desc:'Draw a digit. The card <b>crops, resizes, centers</b> your drawing, then runs a fake CNN forward pass to output a softmax over 10 classes — like the real project does in PyTorch and C.',
      pseudo:`<s># preprocess the drawing</s>
img = <u>crop_center</u>(draw)
img = <u>resize</u>(img, 28, 28)
x   = <u>normalize</u>(img)

<s># forward through the CNN</s>
logits = cnn(x)
probs  = <u>softmax</u>(logits)`
    });
    const wrap = el('div', 'llc-canvas');
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    right.appendChild(wrap);
    const readout = el('div', 'llc-readout');
    readout.innerHTML = `<span>status <b>idle</b></span><span class="sep">·</span><span>size <b>28×28</b></span>`;
    right.appendChild(readout);
    const actions = el('div', 'llc-actions');
    const clearBtn = el('button', 'llc-btn', 'CLEAR');
    const predictBtn = el('button', 'llc-btn hot', 'PREDICT');
    actions.append(clearBtn, predictBtn);
    right.appendChild(actions);

    const G = 14;
    const pixels = new Array(G*G).fill(0);
    let ctx = null, W = 100, H = 100;
    let drawing = false;
    let mode = 'draw';
    let probs = null;

    function resize(){
      const s = sizeCanvas(canvas, wrap);
      ctx = s.ctx; W = s.W; H = s.H; draw();
    }
    function cellSize(){ return Math.min(W, H) / G; }
    function draw(){
      if (!ctx) return;
      const t = themeColors();
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);
      const cs = cellSize();
      const ox = (W - cs*G) / 2;
      const oy = (H - cs*G) / 2;
      for (let y=0; y<G; y++){
        for (let x=0; x<G; x++){
          const v = pixels[y*G+x];
          const px = ox + x*cs, py = oy + y*cs;
          if (v > 0){
            ctx.fillStyle = t.accent;
            ctx.globalAlpha = 0.4 + 0.6*v;
            ctx.shadowColor = t.accent;
            ctx.shadowBlur = 6 * v;
            ctx.fillRect(px+1, py+1, cs-2, cs-2);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
          } else {
            ctx.fillStyle = t.line;
            ctx.globalAlpha = 0.35;
            ctx.fillRect(px+1, py+1, cs-2, cs-2);
            ctx.globalAlpha = 1;
          }
        }
      }
      if (mode === 'predict' && probs){
        const bw = (W - 40) / 10;
        const baseline = H - 8;
        for (let i=0; i<10; i++){
          const p = probs[i];
          const h = p * (H * 0.45);
          const x = 20 + i*bw;
          const y = baseline - h;
          ctx.fillStyle = t.accent;
          ctx.globalAlpha = 0.25 + p*0.7;
          ctx.fillRect(x+2, y, bw-4, h);
          ctx.globalAlpha = 1;
          ctx.fillStyle = t.fg2;
          ctx.font = '9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(String(i), x + bw/2, baseline + 8);
        }
      }
    }
    drawRegistry.add(draw);
    function softmaxFromPixels(){
      const counts = new Array(10).fill(0);
      let cx = 0, cy = 0, n = 0;
      for (let y=0; y<G; y++){
        for (let x=0; x<G; x++){
          if (pixels[y*G+x] > 0){ cx += x; cy += y; n++; }
        }
      }
      if (n === 0){ const p = new Array(10).fill(0.02); p[0] = 0.8; return p; }
      cx /= n; cy /= n;
      const base = ((cx * 3 + cy * 5) | 0) % 10;
      for (let i=0; i<10; i++){
        const d = Math.abs(i - base);
        counts[i] = Math.exp(-d*d/4) + Math.random()*0.05;
      }
      const sum = counts.reduce((a,b)=>a+b,0);
      return counts.map(v => v/sum);
    }
    function pick(e){
      const r = wrap.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const cs = cellSize();
      const ox = (W - cs*G) / 2;
      const oy = (H - cs*G) / 2;
      const gx = Math.floor((mx - ox) / cs);
      const gy = Math.floor((my - oy) / cs);
      if (gx < 0 || gx >= G || gy < 0 || gy >= G) return;
      pixels[gy*G+gx] = 1;
      if (gx > 0) pixels[gy*G + gx-1] = Math.max(pixels[gy*G+gx-1], .4);
      if (gx < G-1) pixels[gy*G + gx+1] = Math.max(pixels[gy*G+gx+1], .4);
      if (gy > 0) pixels[(gy-1)*G + gx] = Math.max(pixels[(gy-1)*G+gx], .4);
      if (gy < G-1) pixels[(gy+1)*G + gx] = Math.max(pixels[(gy+1)*G+gx], .4);
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
      pixels.fill(0);
      mode = 'draw'; probs = null;
      setPlaying(item, false);
      readout.innerHTML = `<span>status <b>cleared</b></span><span class="sep">·</span><span>size <b>28×28</b></span>`;
      draw();
    });
    predictBtn.addEventListener('click', () => {
      setPlaying(item, true);
      setStatus(item, 'INFERRING');
      readout.innerHTML = `<span>preprocessing <b>crop → resize → center</b>…</span>`;
      setTimeout(() => {
        probs = softmaxFromPixels();
        mode = 'predict';
        let best = 0;
        for (let i=1; i<10; i++) if (probs[i] > probs[best]) best = i;
        const conf = (probs[best]*100).toFixed(1);
        readout.innerHTML = `<span>predicted <b class="ok">${best}</b></span><span class="sep">·</span><span>confidence <b>${conf}%</b></span><span class="sep">·</span><span>2 layers · 1.2M params</span>`;
        setPlaying(item, false);
        setStatus(item, 'DONE');
        draw();
      }, 700);
    });
    const ro = new ResizeObserver(resize); ro.observe(wrap);
    setTimeout(resize, 50);
    return item;
  }

  function nnForwardItem(){
    const { item, right } = buildItem({
      num:'02', tag:'NN', title:'Forward Pass', lang:'py',
      desc:'A tiny <b>3-4-2</b> network. Press RUN and watch values flow left→right: each connection multiplies by a weight, sums into the next node, then passes through an activation.',
      pseudo:`<s># forward through the layers</s>
a = x
<b>for</b> W, b <b>in</b> layers:
    z = W @ a + b
    a = <u>relu</u>(z)
    <u>store</u>(a)

pred = <u>argmax</u>(a)`
    });
    const wrap = el('div', 'llc-canvas');
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    right.appendChild(wrap);
    const readout = el('div', 'llc-readout');
    readout.innerHTML = `<span>epoch <b>0</b></span><span class="sep">·</span><span>loss <b>–</b></span>`;
    right.appendChild(readout);
    const actions = el('div', 'llc-actions');
    const runBtn = el('button', 'llc-btn hot', 'RUN FORWARD');
    actions.appendChild(runBtn);
    right.appendChild(actions);

    const LAYERS = [3, 4, 2];
    let ctx = null, W = 100, H = 100;
    let activations = LAYERS.map(n => new Array(n).fill(0));
    let progress = 0, running = false, raf = null, loss = null;

    function resize(){
      const s = sizeCanvas(canvas, wrap);
      ctx = s.ctx; W = s.W; H = s.H; draw();
    }
    function nodePos(layer, i){
      const padX = 40, padY = 30;
      const lx = padX + (W - padX*2) * (layer / (LAYERS.length - 1));
      const ly = padY + (H - padY*2) * ((i + 0.5) / LAYERS[layer]);
      return { x: lx, y: ly };
    }
    function draw(){
      if (!ctx) return;
      const t = themeColors();
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);
      gridBG(ctx, W, H, 18);
      for (let l=0; l<LAYERS.length-1; l++){
        for (let i=0; i<LAYERS[l]; i++){
          for (let j=0; j<LAYERS[l+1]; j++){
            const a = nodePos(l, i), b = nodePos(l+1, j);
            const edgeProgress = (progress - l/(LAYERS.length-1)) * (LAYERS.length-1);
            const lit = Math.max(0, Math.min(1, edgeProgress));
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = t.accent;
            ctx.globalAlpha = 0.35 + 0.55*lit;
            ctx.lineWidth = 0.8 + 1.4*lit;
            if (lit > 0.4){ ctx.shadowColor = t.accent; ctx.shadowBlur = 8 * lit; }
            ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
          }
        }
      }
      for (let l=0; l<LAYERS.length; l++){
        for (let i=0; i<LAYERS[l]; i++){
          const p = nodePos(l, i);
          const v = activations[l][i];
          const lit = v > 0 ? 1 : 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 10, 0, Math.PI*2);
          ctx.fillStyle = t.bg; ctx.fill();
          ctx.strokeStyle = lit ? t.accent : t.line2;
          ctx.lineWidth = 1.5;
          if (lit){ ctx.shadowColor = t.accent; ctx.shadowBlur = 10; }
          ctx.stroke(); ctx.shadowBlur = 0;
          if (v > 0){
            ctx.fillStyle = t.accent;
            ctx.globalAlpha = 0.3 + 0.6*v;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 8, 0, Math.PI*2); ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = t.bright;
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(v.toFixed(2), p.x, p.y + 3);
          }
        }
      }
    }
    drawRegistry.add(draw);
    function step(){
      progress += 0.012;
      for (let l=0; l<LAYERS.length; l++){
        const threshold = l / (LAYERS.length - 1);
        if (progress >= threshold && activations[l][0] === 0){
          activations[l] = activations[l].map(() => 0.3 + Math.random()*0.7);
        }
      }
      draw();
      if (progress >= 1.05){
        running = false;
        if (raf){ cancelAnimationFrame(raf); raf = null; }
        loss = (0.2 + Math.random()*0.5);
        readout.innerHTML = `<span>epoch <b>${Math.floor(Math.random()*5)+1}</b></span><span class="sep">·</span><span>loss <b>${loss.toFixed(3)}</b></span><span class="sep">·</span><span class="ok">forward pass complete</span>`;
        setPlaying(item, false);
        setStatus(item, 'DONE');
        runBtn.textContent = 'RUN AGAIN'; runBtn.disabled = false;
        return;
      }
      raf = requestAnimationFrame(step);
    }
    runBtn.addEventListener('click', () => {
      if (running) return;
      running = true; progress = 0;
      activations = LAYERS.map(n => new Array(n).fill(0));
      setPlaying(item, true);
      setStatus(item, 'COMPUTING');
      runBtn.textContent = 'RUNNING…'; runBtn.disabled = true;
      readout.innerHTML = `<span>input → hidden → output</span>`;
      raf = requestAnimationFrame(step);
    });
    const ro = new ResizeObserver(resize); ro.observe(wrap);
    setTimeout(resize, 50);
    return item;
  }

  function regressionItem(){
    const { item, right } = buildItem({
      num:'03', tag:'ML', title:'Regression Fit', lang:'py',
      desc:'Twenty noisy points. Drag the pink line anywhere, or press <b>FIT</b> and watch <b>gradient descent</b> snap it onto the data. This is the exact loop the ML Models project uses.',
      pseudo:`<s># fit y = m·x + b</s>
<b>for</b> step <b>in</b> range(N):
    y_hat = m*x + b
    err   = y_hat - y
    m -= lr * <u>mean</u>(err * x)
    b -= lr * <u>mean</u>(err)`
    });
    const wrap = el('div', 'llc-canvas');
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    right.appendChild(wrap);
    const readout = el('div', 'llc-readout');
    readout.innerHTML = `<span>mse <b>–</b></span>`;
    right.appendChild(readout);
    const actions = el('div', 'llc-actions');
    const fitBtn = el('button', 'llc-btn hot', 'FIT');
    const resetBtn = el('button', 'llc-btn', 'RESET');
    actions.append(fitBtn, resetBtn);
    right.appendChild(actions);

    const TRUE_M = 0.6, TRUE_B = 0.15;
    const points = [];
    for (let i=0; i<20; i++){
      const x = Math.random();
      const y = TRUE_M * x + TRUE_B + (Math.random() - 0.5) * 0.35;
      points.push({ x, y });
    }
    let m = -0.5, b = 0.7;
    let fitting = false, raf = null, ctx = null, W = 100, H = 100;

    function resize(){
      const s = sizeCanvas(canvas, wrap);
      ctx = s.ctx; W = s.W; H = s.H; draw();
    }
    function toPx(p){ return { x: 30 + p.x*(W-60), y: H - 20 - p.y*(H-40) }; }
    function mse(){
      let s = 0;
      for (const p of points){ const yp = m*p.x + b; s += (p.y - yp)**2; }
      return s / points.length;
    }
    function draw(){
      if (!ctx) return;
      const t = themeColors();
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);
      gridBG(ctx, W, H, 20);
      ctx.strokeStyle = t.line2; ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.moveTo(30, H-20); ctx.lineTo(W-30, H-20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(30, 20); ctx.lineTo(30, H-20); ctx.stroke();
      ctx.globalAlpha = 1;
      for (const p of points){
        const q = toPx(p);
        ctx.beginPath(); ctx.arc(q.x, q.y, 3, 0, Math.PI*2);
        ctx.fillStyle = t.accent;
        ctx.shadowColor = t.accent; ctx.shadowBlur = 6;
        ctx.fill(); ctx.shadowBlur = 0;
      }
      const p1 = toPx({ x: 0, y: b });
      const p2 = toPx({ x: 1, y: m + b });
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = t.red; ctx.lineWidth = 1.8;
      ctx.shadowColor = t.red; ctx.shadowBlur = 12;
      ctx.stroke(); ctx.shadowBlur = 0;
      readout.innerHTML = `<span>mse <b>${mse().toFixed(4)}</b></span><span class="sep">·</span><span>y = <b>${m.toFixed(2)}x</b> + <b>${b.toFixed(2)}</b></span>`;
    }
    drawRegistry.add(draw);
    let dragging = false;
    function updateFromMouse(e){
      const r = wrap.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      b = (H - 20 - my) / (H - 40);
      const px0 = (mx - 30) / (W - 60);
      if (px0 !== 0) m = ((H - 20 - my) / (H - 40) - b) / px0;
      m = Math.max(-2, Math.min(2, m));
      b = Math.max(-1, Math.min(2, b));
      draw();
    }
    canvas.addEventListener('pointerdown', e => {
      if (fitting) return;
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      updateFromMouse(e);
    });
    canvas.addEventListener('pointermove', e => { if (dragging) updateFromMouse(e); });
    canvas.addEventListener('pointerup', () => { dragging = false; });

    function fitStep(){
      const lr = 0.08;
      let gm = 0, gb = 0;
      for (const p of points){
        const err = (m*p.x + b) - p.y;
        gm += err * p.x; gb += err;
      }
      gm *= 2 / points.length; gb *= 2 / points.length;
      m -= lr * gm; b -= lr * gb;
      if (Math.abs(gm) + Math.abs(gb) < 0.01 || mse() < 0.008){
        fitting = false;
        if (raf){ cancelAnimationFrame(raf); raf = null; }
        setPlaying(item, false);
        setStatus(item, 'CONVERGED');
        fitBtn.textContent = 'FIT AGAIN'; fitBtn.disabled = false;
        draw(); return;
      }
      draw();
      raf = requestAnimationFrame(fitStep);
    }
    fitBtn.addEventListener('click', () => {
      if (fitting) return;
      fitting = true;
      m = -0.5; b = 0.7;
      setPlaying(item, true);
      setStatus(item, 'OPTIMIZING');
      fitBtn.textContent = 'FITTING…'; fitBtn.disabled = true;
      raf = requestAnimationFrame(fitStep);
    });
    resetBtn.addEventListener('click', () => {
      if (fitting) return;
      m = -0.5; b = 0.7;
      setPlaying(item, false);
      setStatus(item, 'READY');
      draw();
    });
    const ro = new ResizeObserver(resize); ro.observe(wrap);
    setTimeout(resize, 50);
    return item;
  }

  function functionApproxItem(){
    const { item, right } = buildItem({
      num:'04', tag:'NN', title:'Function Approx', lang:'py',
      desc:'A network trying to learn <b>sin(x)</b>. The violet curve is the target; the pink curve is the model. Press TRAIN and watch it converge — what the Math Network project does with Fourier features.',
      pseudo:`<s># learn sin(x) with an MLP</s>
target = <u>sin</u>(x)
model  = MLP(width=<em>64</em>)
<b>for</b> epoch <b>in</b> range(N):
    pred = model(x)
    loss = <u>mse</u>(pred, target)
    <u>backprop</u>(loss)`
    });
    const wrap = el('div', 'llc-canvas');
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    right.appendChild(wrap);
    const readout = el('div', 'llc-readout');
    readout.innerHTML = `<span>iter <b>0</b></span><span class="sep">·</span><span>loss <b>–</b></span>`;
    right.appendChild(readout);
    const actions = el('div', 'llc-actions');
    const trainBtn = el('button', 'llc-btn hot', 'TRAIN');
    const resetBtn = el('button', 'llc-btn', 'RESET');
    actions.append(trainBtn, resetBtn);
    right.appendChild(actions);

    const N = 60;
    let iter = 0, training = false, raf = null, ctx = null, W = 100, H = 100;
    let model = new Array(N).fill(0).map(() => (Math.random()-0.5)*1.2);

    function resize(){
      const s = sizeCanvas(canvas, wrap);
      ctx = s.ctx; W = s.W; H = s.H; draw();
    }
    function targetCurve(){
      return new Array(N).fill(0).map((_,i) => Math.sin((i/(N-1))*Math.PI*2));
    }
    function toPx(x, y){
      return { x: 30 + x*(W-60), y: H/2 - y*(H*0.4) };
    }
    function draw(){
      if (!ctx) return;
      const t = themeColors();
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = t.bg; ctx.fillRect(0,0,W,H);
      gridBG(ctx, W, H, 20);
      ctx.strokeStyle = t.line2; ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.moveTo(30, H/2); ctx.lineTo(W-30, H/2); ctx.stroke();
      ctx.globalAlpha = 1;
      const tgt = targetCurve();
      ctx.beginPath();
      for (let i=0; i<N; i++){
        const p = toPx(i/(N-1), tgt[i]);
        if (i===0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = t.accent2;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = t.accent2; ctx.shadowBlur = 8;
      ctx.stroke(); ctx.shadowBlur = 0;
      ctx.beginPath();
      for (let i=0; i<N; i++){
        const p = toPx(i/(N-1), model[i]);
        if (i===0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = t.accent;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = t.accent; ctx.shadowBlur = 12;
      ctx.stroke(); ctx.shadowBlur = 0;
    }
    drawRegistry.add(draw);
    function loss(){
      const tgt = targetCurve();
      let s = 0;
      for (let i=0; i<N; i++) s += (model[i] - tgt[i])**2;
      return s / N;
    }
    function trainStep(){
      const tgt = targetCurve();
      const lr = 0.05;
      for (let i=0; i<N; i++) model[i] += (tgt[i] - model[i]) * lr;
      iter++;
      draw();
      if (iter % 4 === 0){
        readout.innerHTML = `<span>iter <b>${iter}</b></span><span class="sep">·</span><span>loss <b>${loss().toFixed(4)}</b></span>`;
      }
      if (loss() < 0.001 || iter >= 220){
        training = false;
        if (raf){ cancelAnimationFrame(raf); raf = null; }
        setPlaying(item, false);
        setStatus(item, 'CONVERGED');
        trainBtn.textContent = 'TRAIN AGAIN'; trainBtn.disabled = false;
        readout.innerHTML = `<span>iter <b>${iter}</b></span><span class="sep">·</span><span>loss <b>${loss().toFixed(4)}</b></span><span class="sep">·</span><span class="ok">converged</span>`;
        return;
      }
      raf = requestAnimationFrame(trainStep);
    }
    trainBtn.addEventListener('click', () => {
      if (training) return;
      training = true; iter = 0;
      setPlaying(item, true);
      setStatus(item, 'TRAINING');
      trainBtn.textContent = 'TRAINING…'; trainBtn.disabled = true;
      raf = requestAnimationFrame(trainStep);
    });
    resetBtn.addEventListener('click', () => {
      if (training) return;
      model = new Array(N).fill(0).map(() => (Math.random()-0.5)*1.2);
      iter = 0;
      setPlaying(item, false);
      setStatus(item, 'READY');
      readout.innerHTML = `<span>iter <b>0</b></span><span class="sep">·</span><span>loss <b>–</b></span>`;
      draw();
    });
    const ro = new ResizeObserver(resize); ro.observe(wrap);
    setTimeout(resize, 50);
    return item;
  }

  /* ==========================================================
     SECTION BUILDERS
     ========================================================== */
  const HACK_ID = 'lab-hack-section';
  const PROJ_ID = 'lab-project-section';

  function buildHackSection(){
    const sec = el('section', 'lab-section');
    sec.id = HACK_ID;
    sec.innerHTML = `
      <div class="lab-sec-head">
        <div>
          <div class="eyebrow">:: LARP_MODE // HACK GAMES</div>
          <h2>How the dark arts actually work</h2>
          <p>Five animated demos of the concepts behind real attacks. Nothing here touches a real network — every box is a simulation running entirely in your browser.</p>
        </div>
        <div class="lab-sec-badges">
          <span class="lab-badge">◉ SAFE DEMO</span>
          <span class="lab-badge locked">LARP ONLY</span>
        </div>
      </div>
      <div class="lab-stack"></div>
    `;
    sec.querySelector('.lab-stack').append(
      portScanItem(), ddosItem(), bruteItem(), snifferItem(), encItem()
    );
    return sec;
  }

  function buildProjectSection(){
    const sec = el('section', 'lab-section');
    sec.id = PROJ_ID;
    sec.innerHTML = `
      <div class="lab-sec-head">
        <div>
          <div class="eyebrow">:: PROJECT PLAYGROUNDS</div>
          <h2>Touch the machinery</h2>
          <p>Interactive demos inspired by the projects on this site. Draw digits, watch a network forward-pass, fit a regression line, or approximate a function — everything runs in the browser.</p>
        </div>
        <div class="lab-sec-badges">
          <span class="lab-badge">◉ ALWAYS ON</span>
        </div>
      </div>
      <div class="lab-stack"></div>
    `;
    sec.querySelector('.lab-stack').append(
      digitDrawItem(), nnForwardItem(), regressionItem(), functionApproxItem()
    );
    return sec;
  }

  /* ==========================================================
     MOUNT / CLEANUP
     ========================================================== */
  function cleanupIfOffLab(){
    if (onLab()) return false;
    const app = document.getElementById('app');
    if (!app) return false;
    /* if we're not on /lab, remove our sections if they exist */
    const h = document.getElementById(HACK_ID);
    const p = document.getElementById(PROJ_ID);
    let removed = false;
    if (h){ h.remove(); removed = true; }
    if (p){ p.remove(); removed = true; }
    if (removed){
      drawRegistry.clear();
    }
    return removed;
  }

  function ensureOnLab(){
    const app = document.getElementById('app');
    if (!app) return;
    const labList = app.querySelector('.lab-list');
    if (!labList) return;

    /* ---- PROJECT section: always present on /lab ---- */
    let proj = document.getElementById(PROJ_ID);
    if (!proj){
      proj = buildProjectSection();
      labList.parentNode.insertBefore(proj, labList);
    }

    /* ---- HACK section: always present on /lab, gated by CSS ---- */
    let hack = document.getElementById(HACK_ID);
    if (!hack){
      hack = buildHackSection();
      labList.parentNode.insertBefore(hack, proj);
    }
  }

  /* ==========================================================
     OBSERVERS
     ========================================================== */
  let tick = null;
  function schedule(){
    if (tick) return;
    tick = setTimeout(() => {
      tick = null;
      if (!onLab()){ cleanupIfOffLab(); return; }
      ensureOnLab();
    }, 50);
  }

  window.addEventListener('hashchange', schedule);

  new MutationObserver(schedule).observe(document.body, { childList:true, subtree:true });

  /* theme change → redraw all canvases with new colors */
  new MutationObserver(() => {
    redrawAll();
    schedule();
  }).observe(HTML, { attributes:true, attributeFilter:['class'] });

  /* initial */
  schedule();
})();