/* ============================================================
   LARPSOCIETY — theme toggle + CRT glitch sweep transition
   Shortcut: k       (when not typing / palette closed / boot done)
   Palette:  type "theme" or "hack" + Enter

   Sequence:
     1. LOADING screen fades in — visible ~1.8s with progress bar
     2. Loading fades out, glitch band sweeps top → bottom (~1.2s)
     3. Theme flips at the mid-point of the sweep
   ============================================================ */
(function(){
  const STORAGE_KEY = 'larp_theme';
  const HTML = document.documentElement;

  /* ==========================================================
     STYLES
     ========================================================== */
  const style = document.createElement('style');
  style.id = 'theme-toggle-styles';
  style.textContent = `
    /* ==================================================
       HACKER MODE — underground green-on-black
       ================================================== */
    html.hacker-mode {
      --bg:#000000;
      --bg2:#020402;
      --panel:#021002;
      --panel2:#031803;
      --line:#0a3d0a;
      --line2:#0f6b0f;
      --fg:#00ff41;
      --fg2:#00d435;
      --fg3:#00a028;
      --fg4:#005a15;
      --accent:#00ff41;
      --accent2:#39ff70;
      --accentbg:#021a02;
      --bright:#8effb0;
      --cream:#c0ffd0;
      --ok:#00ff41;
      --red:#ff2050;
      --glow:0 0 4px rgba(0,255,65,.5),0 0 14px rgba(0,255,65,.2);
      --glow-strong:0 0 6px rgba(0,255,65,.7),0 0 22px rgba(0,255,65,.35),0 0 60px rgba(0,255,65,.15);
    }
    html.hacker-mode body {
      background:radial-gradient(ellipse at 50% 15%,#001a00 0%,#000000 55%,#000000 100%);
    }
    html.hacker-mode .crt{ background:rgba(0,255,65,.014); }
    html.hacker-mode .scanlines{
      background:repeating-linear-gradient(
        0deg,
        rgba(0,0,0,.35) 0px,
        rgba(0,0,0,.35) 1px,
        transparent 1px,
        transparent 3px
      );
    }
    html.hacker-mode .status-dot{
      background:var(--accent);
      box-shadow:0 0 8px var(--accent),0 0 20px rgba(0,255,65,.6);
    }
    html.hacker-mode ::-webkit-scrollbar-track{ background:#000; }
    html.hacker-mode ::-webkit-scrollbar-thumb{ border-color:#000; }

    /* ==================================================
       TOPBAR TOGGLE BUTTON
       ================================================== */
    .theme-toggle{
      background:none;
      border:1px solid var(--line2);
      color:var(--fg3);
      font-family:var(--mono);
      font-size:11px;
      padding:4px 8px;
      margin-left:4px;
      cursor:pointer;
      letter-spacing:.05em;
      transition:all .15s;
      white-space:nowrap;
    }
    .theme-toggle::before{
      content:"[◆]";
      margin-right:6px;
      color:var(--accent);
    }
    .theme-toggle:hover{
      color:var(--accent);
      border-color:var(--accent);
      text-shadow:var(--glow);
    }
    .theme-toggle:focus-visible{
      outline:1px dashed var(--accent);
      outline-offset:2px;
    }
    .theme-toggle kbd{
      display:inline-block;
      margin-left:6px;
      padding:0 5px;
      border:1px solid var(--line);
      font-size:9px;
      color:var(--fg4);
      letter-spacing:0;
    }

    /* ==================================================
       TRANSITION OVERLAY
       ================================================== */
    #theme-transition{
      position:fixed;inset:0;z-index:99999;
      pointer-events:none;
      overflow:hidden;
      opacity:0;
      transition:opacity .4s ease;
      will-change:opacity;
    }
    #theme-transition.active{ opacity:1; }

    /* ---------- 1. LOADING PANEL ---------- */
    #theme-transition .tt-loading{
      position:absolute;inset:0;
      background:#000;
      display:flex;align-items:center;justify-content:center;
      opacity:0;
      transition:opacity .35s ease;
    }
    #theme-transition.phase-loading .tt-loading{ opacity:1; }

    #theme-transition .tt-loading-inner{
      width:min(560px, calc(100% - 40px));
      text-align:center;
      font-family:var(--mono);
      color:#00ff41;
      text-shadow:0 0 6px rgba(0,255,65,.6), 0 0 18px rgba(0,255,65,.3);
    }
    #theme-transition .tt-loading-eyebrow{
      font-size:10px;
      letter-spacing:.5em;
      color:#5fffa0;
      margin-bottom:22px;
      opacity:.85;
    }
    #theme-transition .tt-title{
      font-size:22px;
      letter-spacing:.32em;
      margin-bottom:26px;
      color:#c0ffd0;
      text-shadow:0 0 10px #00ff41, 0 0 30px rgba(0,255,65,.5);
      min-height:1.2em;
      white-space:nowrap;
      overflow:hidden;
    }
    #theme-transition .tt-loading-bar{
      height:6px;
      background:#031803;
      border:1px solid #0f6b0f;
      overflow:hidden;
      position:relative;
      margin:0 auto 14px;
    }
    #theme-transition .tt-loading-bar::before{
      content:"";
      position:absolute;inset:0;
      background:repeating-linear-gradient(90deg,
        transparent 0, transparent 6px,
        rgba(0,255,65,.08) 6px, rgba(0,255,65,.08) 7px
      );
      z-index:1;
    }
    #theme-transition .tt-loading-fill{
      height:100%;
      width:0%;
      background:linear-gradient(90deg,#00ff41 0%, #c0ffd0 80%, #ffffff 100%);
      box-shadow:0 0 10px #00ff41, 0 0 22px rgba(0,255,65,.5);
      transition:width .1s linear;
      position:relative;
      z-index:2;
    }
    #theme-transition .tt-loading-meta{
      display:flex;justify-content:space-between;
      font-size:10px;letter-spacing:.2em;
      color:#5fffa0;
      margin-bottom:26px;
    }
    #theme-transition .tt-loading-hint{
      font-size:9px;
      letter-spacing:.42em;
      color:rgba(0,255,65,.5);
      animation:ttHintBlink 1.1s steps(2) infinite;
    }
    @keyframes ttHintBlink{
      50% { opacity:.35; }
    }

    /* ---------- 2. GLITCH SWEEP BAND ---------- */
    #theme-transition .tt-sweep{
      position:absolute;
      left:0;right:0;
      top:-45vh;
      height:45vh;
      pointer-events:none;
      opacity:0;
      transition:opacity .2s ease;
      mix-blend-mode:screen;
      will-change:top;
    }
    #theme-transition.phase-sweep .tt-sweep{ opacity:1; }

    /* the main bright band */
    #theme-transition .tt-sweep-band{
      position:absolute;inset:0;
      background:linear-gradient(180deg,
        rgba(0,255,65,0)     0%,
        rgba(0,255,65,.04)  18%,
        rgba(0,255,65,.22)  40%,
        rgba(180,255,200,.55) 49%,
        rgba(255,255,255,.85) 50%,
        rgba(180,255,200,.55) 51%,
        rgba(0,255,65,.22)  60%,
        rgba(0,255,65,.04)  82%,
        rgba(0,255,65,0)   100%
      );
      filter:blur(.4px);
    }

    /* RGB split tear lines inside the band */
    #theme-transition .tt-sweep-tears{
      position:absolute;inset:0;
      mix-blend-mode:screen;
      background:repeating-linear-gradient(0deg,
        transparent 0px, transparent 5px,
        rgba(255,0,80,.20) 5px, rgba(255,0,80,.20) 6px,
        transparent 6px, transparent 11px,
        rgba(0,180,255,.18) 11px, rgba(0,180,255,.18) 12px,
        transparent 12px, transparent 18px,
        rgba(0,255,65,.18) 18px, rgba(0,255,65,.18) 19px,
        transparent 19px, transparent 26px
      );
      animation:ttTearJitter .09s steps(2) infinite;
    }
    @keyframes ttTearJitter{
      0%   { transform:translateX(0); }
      50%  { transform:translateX(6px); }
      100% { transform:translateX(0); }
    }

    /* thin hard glitch lines at the center */
    #theme-transition .tt-sweep-line{
      position:absolute;left:0;right:0;
      top:50%;
      height:2px;
      background:linear-gradient(90deg,
        transparent 0%,
        #00ff41 10%,
        #ff2050 35%,
        #00b7ff 60%,
        #00ff41 85%,
        transparent 100%
      );
      box-shadow:0 0 12px #00ff41, 0 0 26px rgba(0,255,65,.6);
      filter:blur(.3px);
    }
    #theme-transition .tt-sweep-line::before,
    #theme-transition .tt-sweep-line::after{
      content:"";
      position:absolute;left:0;right:0;height:1px;
      background:inherit;
      opacity:.5;
    }
    #theme-transition .tt-sweep-line::before{ top:-9px; }
    #theme-transition .tt-sweep-line::after { top: 9px; }

    /* sweep motion */
    #theme-transition .tt-sweep.go{
      animation:ttSweepDown 1.2s cubic-bezier(.45,0,.55,1) forwards;
    }
    @keyframes ttSweepDown{
      0%   { top:-45vh; }
      100% { top:130vh; }
    }

    /* ---------- 3. CONFIRMATION FLASH ---------- */
    /* brief white flash at the exact mid-swap moment */
    #theme-transition .tt-flash{
      position:absolute;inset:0;
      background:radial-gradient(ellipse at 50% 50%,
        rgba(255,255,255,.55) 0%,
        rgba(0,255,65,.15) 25%,
        transparent 55%
      );
      opacity:0;
      mix-blend-mode:screen;
      pointer-events:none;
    }
    #theme-transition.tt-swap .tt-flash{
      animation:ttFlash .28s ease-out forwards;
    }
    @keyframes ttFlash{
      0%   { opacity:.9; }
      100% { opacity:0; }
    }

    /* reduced motion */
    @media (prefers-reduced-motion: reduce){
      #theme-transition{ display:none !important; }
    }
  `;
  document.head.appendChild(style);

  /* ==========================================================
     OVERLAY DOM
     ========================================================== */
  const overlay = document.createElement('div');
  overlay.id = 'theme-transition';
  overlay.innerHTML = `
    <div class="tt-loading">
      <div class="tt-loading-inner">
        <div class="tt-loading-eyebrow">// SIGNAL INTERCEPT //</div>
        <div class="tt-title" id="tt-title">SWITCHING LAYER</div>
        <div class="tt-loading-bar"><div class="tt-loading-fill" id="tt-fill"></div></div>
        <div class="tt-loading-meta">
          <span id="tt-progress">0%</span>
          <span id="tt-label">STANDBY</span>
        </div>
        <div class="tt-loading-hint">█▒░ RECALIBRATING PHOSPHOR ░▒█</div>
      </div>
    </div>

    <div class="tt-sweep" id="tt-sweep">
      <div class="tt-sweep-band"></div>
      <div class="tt-sweep-tears"></div>
      <div class="tt-sweep-line"></div>
    </div>

    <div class="tt-flash"></div>
  `;
  document.body.appendChild(overlay);

  const titleEl    = overlay.querySelector('#tt-title');
  const labelEl    = overlay.querySelector('#tt-label');
  const progressEl = overlay.querySelector('#tt-progress');
  const fillEl     = overlay.querySelector('#tt-fill');
  const sweepEl    = overlay.querySelector('#tt-sweep');

  /* ==========================================================
     TEXT SCRAMBLE
     ========================================================== */
  const SCRAMBLE_CHARS = '!<>-_\\\\/[]{}—=+*^?#________';
  function scramble(el, finalText, duration){
    const start = performance.now();
    const from = el.textContent;
    const len = Math.max(from.length, finalText.length);
    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      let out = '';
      for (let i = 0; i < len; i++){
        const c = finalText[i] || '';
        if (t * len >= i) out += c;
        else if (c === ' ') out += ' ';
        else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = finalText;
    }
    requestAnimationFrame(frame);
  }

  /* ==========================================================
     THEME
     ========================================================== */
  function currentTheme(){
    try { return localStorage.getItem(STORAGE_KEY) || 'fsociety'; }
    catch(e){ return 'fsociety'; }
  }
  function persistTheme(t){
    try { localStorage.setItem(STORAGE_KEY, t); } catch(e){}
  }
  function applyTheme(t){
    if (t === 'hacker') HTML.classList.add('hacker-mode');
    else HTML.classList.remove('hacker-mode');
    HTML.setAttribute('data-theme', t);
  }

  /* ==========================================================
     THE SEQUENCE
     ========================================================== */
  const LOADING_MS  = 1800;   // how long the loading screen stays up
  const SWEEP_MS    = 1200;   // how long the glitch band takes to fall
  const SWAP_AT     = LOADING_MS + 550;      // mid-sweep
  const SWEEP_END   = LOADING_MS + SWEEP_MS;
  const CLEANUP_AT  = SWEEP_END + 150;
  const RESET_AT    = SWEEP_END + 600;

  let switching = false;
  let loadingRaf = null;

  function switchTheme(target){
    if (switching) return;
    switching = true;

    const next = target || (currentTheme() === 'hacker' ? 'fsociety' : 'hacker');
    const labelText = next === 'hacker' ? 'HACKER MODE' : 'FSOCIETY';

    /* --- reset overlay state --- */
    overlay.className = '';                       // clear phase classes
    fillEl.style.width = '0%';
    progressEl.textContent = '0%';
    titleEl.textContent = 'SWITCHING LAYER';
    labelEl.textContent = 'STANDBY';
    sweepEl.classList.remove('go');
    // force reflow so any stale animation is flushed
    void sweepEl.offsetWidth;

    /* ========== PHASE 1: LOADING ========== */
    overlay.classList.add('active', 'phase-loading');

    // scramble the title in and the mode label
    scramble(titleEl, 'SWITCHING LAYER', 500);
    scramble(labelEl, labelText, LOADING_MS * 0.85);

    // animate the progress bar + percentage
    const t0 = performance.now();
    function tickLoading(now){
      const t = Math.min(1, (now - t0) / LOADING_MS);
      const pct = Math.floor(t * 100);
      progressEl.textContent = pct + '%';
      fillEl.style.width = pct + '%';
      if (t < 1) loadingRaf = requestAnimationFrame(tickLoading);
    }
    loadingRaf = requestAnimationFrame(tickLoading);

    /* ========== PHASE 2: SWEEP ========== */
    setTimeout(() => {
      if (loadingRaf) cancelAnimationFrame(loadingRaf);
      progressEl.textContent = '100%';
      fillEl.style.width = '100%';

      // hide the loading panel
      overlay.classList.remove('phase-loading');

      // start the sweep — small rAF delay so the class removal paints first
      requestAnimationFrame(() => {
        overlay.classList.add('phase-sweep');
        sweepEl.classList.add('go');
      });
    }, LOADING_MS);

    /* ========== PHASE 3: SWAP AT MID-SWEEP ========== */
    setTimeout(() => {
      applyTheme(next);
      persistTheme(next);

      // brief white/green confirmation flash
      overlay.classList.add('tt-swap');
      setTimeout(() => overlay.classList.remove('tt-swap'), 320);

      // update the label (still on screen during sweep, not critical)
      scramble(labelEl,
        next === 'hacker' ? '● GREEN PHOSPHOR ●' : '● AMBER PHOSPHOR ●',
        320);
    }, SWAP_AT);

    /* ========== PHASE 4: CLEANUP ========== */
    setTimeout(() => {
      overlay.classList.remove('active', 'phase-sweep');
      sweepEl.classList.remove('go');
    }, CLEANUP_AT);

    setTimeout(() => {
      switching = false;
    }, RESET_AT);
  }

  /* ==========================================================
     SHORTCUT: single key "k"
     ========================================================== */
  document.addEventListener('keydown', e => {
    // ignore with modifiers
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    // ignore when typing in any field
    const tag = (e.target && e.target.tagName) || '';
    if (/input|textarea|select/i.test(tag)) return;
    if (e.target && e.target.isContentEditable) return;
    // ignore when palette open
    const pal = document.getElementById('palette');
    if (pal && !pal.hidden) return;
    // ignore during boot game
    const boot = document.getElementById('boot');
    if (boot && !boot.classList.contains('done')) return;
    // the key
    if (e.key === 'k' || e.key === 'K'){
      e.preventDefault();
      switchTheme();
    }
  }, true);

  /* ==========================================================
     PALETTE: type "theme" / "hack" + Enter
     ========================================================== */
  document.addEventListener('keydown', e => {
    const pal = document.getElementById('palette');
    if (!pal || pal.hidden) return;
    if (e.key !== 'Enter') return;
    const input = document.getElementById('palette-input');
    if (!input) return;
    const v = input.value.trim().toLowerCase();
    if (v === 'theme' || v === 'hack' || v === 'hacker'){
      e.preventDefault();
      e.stopPropagation();
      pal.hidden = true;
      input.value = '';
      switchTheme();
    }
  }, true);

  /* ==========================================================
     TOPBAR BUTTON
     ========================================================== */
  function mountToggle(){
    const bar = document.querySelector('.topbar-right');
    if (!bar || bar.querySelector('.theme-toggle')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.title = 'switch theme  (press k)';
    btn.setAttribute('aria-label', 'switch theme');
    btn.innerHTML = 'theme <kbd>k</kbd>';
    btn.addEventListener('click', () => switchTheme());
    bar.insertBefore(btn, bar.firstChild);
  }

  /* ==========================================================
     REFRESH ON SPA RENDERS
     ========================================================== */
  function refresh(){ mountToggle(); }
  new MutationObserver(refresh).observe(document.body, {childList:true, subtree:true});
  window.addEventListener('hashchange', () => setTimeout(refresh, 0));

  /* apply persisted theme immediately */
  applyTheme(currentTheme());

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', refresh);
  } else {
    refresh();
  }
})();