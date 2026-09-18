/* ============================================================
   theme-toggle.js — LARP mode toggle
   k toggles. Always starts in normal (amber) mode.
   ============================================================ */
(function(){
  const STORAGE_KEY = 'larp_theme';
  const HTML = document.documentElement;

  /* wipe any persisted theme so every load is amber */
  try { localStorage.removeItem(STORAGE_KEY); } catch(e){}

  const style = document.createElement('style');
  style.id = 'theme-toggle-styles';
  style.textContent = `
    html.larp-mode {
      --bg:#050208; --bg2:#0b0518; --panel:#12082a; --panel2:#1a0d3a;
      --line:#2e1065; --line2:#6d28d9; --fg:#c084fc; --fg2:#a855f7;
      --fg3:#7c3aed; --fg4:#4c1d95; --accent:#a855f7; --accent2:#d8b4fe;
      --accentbg:#1a0d3a; --bright:#f3e8ff; --cream:#ede9fe; --ok:#a855f7;
      --red:#ff2d78;
      --glow:0 0 4px rgba(168,85,247,.55),0 0 14px rgba(168,85,247,.22);
      --glow-strong:0 0 6px rgba(168,85,247,.75),0 0 22px rgba(168,85,247,.4),0 0 60px rgba(168,85,247,.15);
    }
    html.larp-mode body {
      background:radial-gradient(ellipse at 50% 15%,#1c0a3d 0%,#08040f 55%,#020105 100%);
    }
    html.larp-mode .crt{ background:rgba(168,85,247,.016); }
    html.larp-mode .scanlines{
      background:repeating-linear-gradient(0deg,
        rgba(0,0,0,.4) 0px, rgba(0,0,0,.4) 1px,
        transparent 1px, transparent 3px);
    }
    html.larp-mode .status-dot{
      background:var(--accent);
      box-shadow:0 0 8px var(--accent),0 0 20px rgba(168,85,247,.65);
    }
    html.larp-mode ::-webkit-scrollbar-track{ background:#050208; }
    html.larp-mode ::-webkit-scrollbar-thumb{ border-color:#050208; }

    .theme-toggle{
      background:none;border:1px solid var(--line2);color:var(--fg3);
      font-family:var(--mono);font-size:11px;padding:4px 8px;margin-left:4px;
      cursor:pointer;letter-spacing:.05em;transition:all .15s;white-space:nowrap;
    }
    .theme-toggle::before{ content:"[◆]"; margin-right:6px; color:var(--accent); }
    .theme-toggle:hover{ color:var(--accent); border-color:var(--accent); }
    .theme-toggle kbd{
      display:inline-block;margin-left:6px;padding:0 5px;
      border:1px solid var(--line);font-size:9px;color:var(--fg4);
    }

    #theme-transition{
      position:fixed;inset:0;z-index:99999;
      pointer-events:none;overflow:hidden;opacity:0;
      transition:opacity .4s ease;will-change:opacity;
    }
    #theme-transition.active{ opacity:1; }
    #theme-transition.quick{ transition:none; }

    #theme-transition .tt-loading{
      position:absolute;inset:0;background:#020105;
      display:flex;align-items:center;justify-content:center;
      opacity:0;transition:opacity .35s ease;
    }
    #theme-transition.phase-loading .tt-loading{ opacity:1; }
    #theme-transition .tt-loading-inner{
      width:min(560px, calc(100% - 40px));text-align:center;
      font-family:var(--mono);color:#a855f7;
    }
    #theme-transition .tt-loading-eyebrow{
      font-size:10px;letter-spacing:.5em;color:#c084fc;
      margin-bottom:22px;opacity:.85;
    }
    #theme-transition .tt-title{
      font-size:22px;letter-spacing:.32em;margin-bottom:26px;
      color:#ede9fe;min-height:1.2em;white-space:nowrap;overflow:hidden;
    }
    #theme-transition .tt-loading-bar{
      height:6px;background:#12082a;border:1px solid #6d28d9;
      overflow:hidden;position:relative;margin:0 auto 14px;
    }
    #theme-transition .tt-loading-fill{
      height:100%;width:0%;
      background:linear-gradient(90deg,#a855f7 0%, #d8b4fe 80%, #ffffff 100%);
      transition:width .1s linear;
    }
    #theme-transition .tt-loading-meta{
      display:flex;justify-content:space-between;
      font-size:10px;letter-spacing:.2em;color:#c084fc;margin-bottom:26px;
    }
    #theme-transition .tt-loading-hint{
      font-size:9px;letter-spacing:.42em;color:rgba(168,85,247,.55);
      animation:ttHintBlink 1.1s steps(2) infinite;
    }
    @keyframes ttHintBlink{ 50% { opacity:.35; } }

    #theme-transition .tt-sweep{
      position:absolute;left:0;right:0;top:0;height:45vh;
      pointer-events:none;opacity:0;transition:opacity .18s ease;
      mix-blend-mode:screen;transform:translateY(-45vh);will-change:transform;
    }
    #theme-transition.phase-sweep .tt-sweep{ opacity:1; }
    #theme-transition .tt-sweep-band{
      position:absolute;inset:0;
      background:linear-gradient(180deg,
        rgba(168,85,247,0) 0%, rgba(168,85,247,.04) 18%,
        rgba(168,85,247,.24) 40%, rgba(216,180,254,.6) 49%,
        rgba(255,255,255,.9) 50%, rgba(216,180,254,.6) 51%,
        rgba(168,85,247,.24) 60%, rgba(168,85,247,.04) 82%,
        rgba(168,85,247,0) 100%);
      filter:blur(.4px);
    }
    #theme-transition .tt-sweep-tears{
      position:absolute;inset:0;mix-blend-mode:screen;
      background:repeating-linear-gradient(0deg,
        transparent 0px, transparent 5px,
        rgba(255,45,120,.22) 5px, rgba(255,45,120,.22) 6px,
        transparent 6px, transparent 11px,
        rgba(0,180,255,.20) 11px, rgba(0,180,255,.20) 12px,
        transparent 12px, transparent 18px,
        rgba(168,85,247,.22) 18px, rgba(168,85,247,.22) 19px,
        transparent 19px, transparent 26px);
      animation:ttTearJitter .09s steps(2) infinite;
    }
    @keyframes ttTearJitter{
      0%   { transform:translateX(0); }
      50%  { transform:translateX(6px); }
      100% { transform:translateX(0); }
    }
    #theme-transition .tt-sweep-line{
      position:absolute;left:0;right:0;top:50%;height:2px;
      background:linear-gradient(90deg,
        transparent 0%, #a855f7 10%, #ff2d78 35%,
        #00b7ff 60%, #a855f7 85%, transparent 100%);
      box-shadow:0 0 12px #a855f7, 0 0 26px rgba(168,85,247,.7);
    }
    #theme-transition .tt-flash{
      position:absolute;inset:0;
      background:radial-gradient(ellipse at 50% 50%,
        rgba(255,255,255,.6) 0%, rgba(168,85,247,.2) 25%, transparent 55%);
      opacity:0;mix-blend-mode:screen;pointer-events:none;
    }
    #theme-transition.tt-swap .tt-flash{ animation:ttFlash .28s ease-out forwards; }
    @keyframes ttFlash{ 0% { opacity:.9; } 100% { opacity:0; } }

    @media (prefers-reduced-motion: reduce){
      #theme-transition{ display:none !important; }
    }
  `;
  document.head.appendChild(style);

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

  const SCRAMBLE = '!<>-_\\\\/[]{}—=+*^?#________';
  function scramble(el, finalText, duration){
    const start = performance.now();
    const len = Math.max(el.textContent.length, finalText.length);
    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      let out = '';
      for (let i = 0; i < len; i++){
        const c = finalText[i] || '';
        if (t * len >= i) out += c;
        else if (c === ' ') out += ' ';
        else out += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = finalText;
    }
    requestAnimationFrame(frame);
  }

  /* ---- READ THEME FROM THE DOM, NOT STORAGE ---- */
  function currentTheme(){
    return HTML.classList.contains('larp-mode') ? 'larp' : 'fsociety';
  }
  function applyTheme(t){
    if (t === 'larp') HTML.classList.add('larp-mode');
    else HTML.classList.remove('larp-mode');
    HTML.setAttribute('data-theme', t);
  }

  const TOP_OFF = -45, BOT_OFF = 100, MID_Y = 27.5;
  let state = 'idle', firstSwitchDone = false;
  let themeAtStart = null, themeTarget = null, hasFlipped = false;
  let raf = null, currentY = TOP_OFF, flashTimer = null;
  let stateStartedAt = Date.now();

  function setState(s){ state = s; stateStartedAt = Date.now(); }
  function setY(y){ currentY = y; sweepEl.style.transform = 'translateY(' + y + 'vh)'; }
  function easeInOut(t){ return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2; }

  function flash(){
    overlay.classList.add('tt-swap');
    if (flashTimer) clearTimeout(flashTimer);
    flashTimer = setTimeout(() => overlay.classList.remove('tt-swap'), 320);
  }

  function animate(fromY, toY, duration, dir, onDone){
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    const t0 = performance.now();
    setY(fromY);
    function step(now){
      const t = Math.min(1, (now - t0) / duration);
      const y = fromY + (toY - fromY) * easeInOut(t);
      setY(y);
      if (dir === 'down' && !hasFlipped && y >= MID_Y){
        applyTheme(themeTarget); hasFlipped = true; flash();
      } else if (dir === 'up' && hasFlipped && y <= MID_Y){
        applyTheme(themeAtStart); hasFlipped = false; flash();
      }
      if (t < 1) raf = requestAnimationFrame(step);
      else { raf = null; if (onDone) onDone(); }
    }
    raf = requestAnimationFrame(step);
  }

  function finishDown(){
    overlay.classList.remove('active', 'phase-sweep', 'quick');
    setY(TOP_OFF); setState('idle');
  }
  function finishUp(){
    if (hasFlipped){ applyTheme(themeAtStart); hasFlipped = false; }
    overlay.classList.remove('active', 'phase-sweep', 'quick');
    setY(TOP_OFF); setState('idle');
  }

  function switchTheme(){
    /* recover from stuck state */
    if (state !== 'idle' && Date.now() - stateStartedAt > 4000){
      if (raf){ cancelAnimationFrame(raf); raf = null; }
      overlay.classList.remove('active', 'phase-sweep', 'quick', 'phase-loading');
      setY(TOP_OFF); setState('idle');
    }

    if (state === 'loading') return;

    if (state === 'idle'){
      const start  = currentTheme();      /* DOM-derived */
      const target = start === 'larp' ? 'fsociety' : 'larp';
      themeAtStart = start;
      themeTarget  = target;
      hasFlipped   = false;
      if (!firstSwitchDone){ firstSwitchDone = true; playFirstSwitch(); }
      else { playQuickSwitch(); }
      return;
    }
    if (state === 'down'){
      setState('up');
      const fromY = currentY;
      const dur = 400 * Math.max(0.4, (fromY - TOP_OFF) / (BOT_OFF - TOP_OFF));
      animate(fromY, TOP_OFF, dur, 'up', finishUp);
      return;
    }
    if (state === 'up'){
      setState('down');
      const fromY = currentY;
      const dur = 500 * Math.max(0.4, (BOT_OFF - fromY) / (BOT_OFF - TOP_OFF));
      animate(fromY, BOT_OFF, dur, 'down', finishDown);
      return;
    }
  }

  function playFirstSwitch(){
    setState('loading');
    overlay.classList.remove('quick');
    fillEl.style.width = '0%';
    progressEl.textContent = '0%';
    titleEl.textContent = 'SWITCHING LAYER';
    labelEl.textContent = 'STANDBY';
    scramble(titleEl, 'SWITCHING LAYER', 500);
    scramble(labelEl, themeTarget === 'larp' ? 'LARP MODE' : 'FSOCIETY', 1500);
    overlay.classList.add('active', 'phase-loading');
    const LOADING_MS = 1800;
    const t0 = performance.now();
    let loadRaf = null;
    function tickLoad(now){
      const t = Math.min(1, (now - t0) / LOADING_MS);
      const pct = Math.floor(t * 100);
      progressEl.textContent = pct + '%';
      fillEl.style.width = pct + '%';
      if (t < 1) loadRaf = requestAnimationFrame(tickLoad);
    }
    loadRaf = requestAnimationFrame(tickLoad);
    setTimeout(() => {
      cancelAnimationFrame(loadRaf);
      progressEl.textContent = '100%';
      fillEl.style.width = '100%';
      overlay.classList.remove('phase-loading');
      setState('down');
      requestAnimationFrame(() => {
        overlay.classList.add('phase-sweep');
        animate(TOP_OFF, BOT_OFF, 1200, 'down', finishDown);
      });
    }, LOADING_MS);
  }

  function playQuickSwitch(){
    setState('down');
    overlay.classList.add('quick', 'active', 'phase-sweep');
    animate(TOP_OFF, BOT_OFF, 620, 'down', finishDown);
  }

  function isVisible(el){
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    return true;
  }

  /* K handler — should fire anywhere except when typing in a visible field */
  document.addEventListener('keydown', e => {
    if (e.key !== 'k' && e.key !== 'K') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.repeat) return;

    const t = e.target;
    if (t){
      if (/input|textarea|select/i.test(t.tagName) && isVisible(t)) return;
      if (t.isContentEditable && isVisible(t)) return;
    }
    const pal = document.getElementById('palette');
    if (pal && !pal.hidden) return;
    const boot = document.getElementById('boot');
    if (boot && isVisible(boot)) return;

    e.preventDefault();
    e.stopPropagation();
    switchTheme();
  }, true);

  /* palette: theme / larp / hack + Enter */
  document.addEventListener('keydown', e => {
    const pal = document.getElementById('palette');
    if (!pal || pal.hidden) return;
    if (e.key !== 'Enter') return;
    const input = document.getElementById('palette-input');
    if (!input) return;
    const v = input.value.trim().toLowerCase();
    if (v === 'theme' || v === 'hack' || v === 'larp'){
      e.preventDefault(); e.stopPropagation();
      pal.hidden = true; input.value = '';
      switchTheme();
    }
  }, true);

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

  function refresh(){ mountToggle(); }
  new MutationObserver(refresh).observe(document.body, {childList:true, subtree:true});
  window.addEventListener('hashchange', () => setTimeout(refresh, 0));

  applyTheme('fsociety');

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', refresh);
  } else {
    refresh();
  }
})();