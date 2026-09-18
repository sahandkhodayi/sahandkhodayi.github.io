/* ============================================================
   hacker-fx.js — LARP mode extras + global g glitch
   ============================================================ */
(function(){
  const HTML = document.documentElement;
  const isLarp = () => HTML.classList.contains('larp-mode');

  const style = document.createElement('style');
  style.id = 'larp-fx-styles';
  style.textContent = `
    html.larp-mode body{ background:#020105 !important; }
    html.larp-mode body::before{ opacity: 0 !important; }

    #larp-matrix{
      position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0;
      transition:opacity 1.1s ease;
    }
    html.larp-mode #larp-matrix{ opacity:.32; }
    html.larp-mode .shell{ position:relative; z-index:1; }

    html.larp-mode body,
    html.larp-mode body *{
      cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'><rect x='10' y='0' width='2' height='8' fill='%23a855f7'/><rect x='10' y='14' width='2' height='8' fill='%23a855f7'/><rect x='0' y='10' width='8' height='2' fill='%23a855f7'/><rect x='14' y='10' width='8' height='2' fill='%23a855f7'/><rect x='10' y='10' width='2' height='2' fill='%23f3e8ff'/></svg>") 11 11, crosshair;
    }
    html.larp-mode a,
    html.larp-mode button,
    html.larp-mode summary,
    html.larp-mode [role='button']{
      cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'><rect x='10' y='0' width='2' height='8' fill='%23ff2d78'/><rect x='10' y='14' width='2' height='8' fill='%23ff2d78'/><rect x='0' y='10' width='8' height='2' fill='%23ff2d78'/><rect x='14' y='10' width='8' height='2' fill='%23ff2d78'/><rect x='9' y='9' width='4' height='4' fill='%23f3e8ff'/></svg>") 11 11, pointer;
    }
    html.larp-mode input,
    html.larp-mode textarea{ cursor: text; }

    html.larp-mode .hero-copy h1::after,
    html.larp-mode .big-title h1::after,
    html.larp-mode .portfolio h1::after,
    html.larp-mode .project-detail h1::after,
    html.larp-mode .lab-title::after{
      content: "▊"; display:inline-block; margin-left:.12em;
      color: #a855f7; animation: fxCursorBlink 1s steps(2) infinite;
      font-size: .7em; vertical-align: baseline;
    }
    html.larp-mode .cursor{ display: none !important; }
    @keyframes fxCursorBlink{ 50% { opacity: 0; } }

    html.larp-mode a:hover,
    html.larp-mode button:hover,
    html.larp-mode summary:hover,
    html.larp-mode .card:hover,
    html.larp-mode .pill:hover,
    html.larp-mode .member:hover,
    html.larp-mode .feature:hover{
      text-shadow:
        -1px 0 0 rgba(255,45,120,.8),
         1px 0 0 rgba(0,180,255,.8),
         0 0 12px rgba(168,85,247,.6) !important;
    }

    html.larp-mode .logo{
      text-shadow:
        -1px 0 0 rgba(255,45,120,.55),
         1px 0 0 rgba(0,180,255,.55),
         0 0 10px rgba(168,85,247,.7);
    }
    html.larp-mode .logo span{
      color: #a855f7;
      animation: fxLogoBlink 1.4s steps(2) infinite,
                 fxLogoJitter .32s steps(1) infinite;
    }
    @keyframes fxLogoBlink{ 50% { opacity:.15; } }
    @keyframes fxLogoJitter{
      0%,100% { transform: translate(0,0); }
      50%     { transform: translate(.6px,-.6px); }
    }

    html.larp-mode .scanlines{
      background:
        repeating-linear-gradient(0deg,
          rgba(0,0,0,.48) 0px, rgba(0,0,0,.48) 1px,
          transparent 1px, transparent 3px),
        repeating-linear-gradient(0deg,
          transparent 0px, transparent 1px,
          rgba(168,85,247,.055) 1px, rgba(168,85,247,.055) 2px,
          transparent 2px, transparent 4px);
      animation: fxScanDrift 9s linear infinite;
    }
    @keyframes fxScanDrift{
      0%   { background-position: 0 0, 0 0; }
      100% { background-position: 0 0, 0 40px; }
    }

    html.larp-mode .big-title{
      animation: fxBorderPulse 3.5s ease-in-out infinite;
    }
    @keyframes fxBorderPulse{
      0%,100% { border-bottom-color: rgba(168,85,247,.18); }
      50%     { border-bottom-color: rgba(168,85,247,.5); }
    }

    .fx-glitching{ animation: fxGlitch .22s steps(2) 1 !important; }
    @keyframes fxGlitch{
      0%   { transform: translate(0,0);    filter: none; }
      20%  { transform: translate(-2px,1px);  filter: hue-rotate(20deg) contrast(1.3); }
      40%  { transform: translate(2px,-1px);  filter: hue-rotate(-15deg); }
      60%  { transform: translate(-1px,-1px); filter: brightness(1.4); }
      80%  { transform: translate(1px,1px);   filter: none; }
      100% { transform: translate(0,0); }
    }

    html.larp-mode .hero-copy h1,
    html.larp-mode .big-title h1,
    html.larp-mode .portfolio h1,
    html.larp-mode .project-detail h1{
      text-shadow:
        -1px 0 0 rgba(255,45,120,.3),
         1px 0 0 rgba(0,180,255,.3),
         0 0 6px rgba(168,85,247,.9),
         0 0 22px rgba(168,85,247,.45),
         0 0 60px rgba(168,85,247,.18);
    }

    /* ---- GLOBAL GLITCH OVERLAY (g key) ---- */
    .global-glitch{
      position: fixed; inset: 0; z-index: 99998;
      pointer-events: none; opacity: 0;
      mix-blend-mode: screen;
    }
    .global-glitch.go{ opacity: 1; animation: ggFade .7s ease-out forwards; }
    @keyframes ggFade{
      0%   { opacity:.9; }
      100% { opacity:0; }
    }
    .global-glitch .gg-bars{
      position: absolute; inset: 0;
      background: repeating-linear-gradient(0deg,
        transparent 0px, transparent 3px,
        rgba(255,255,255,.14) 3px, rgba(255,255,255,.14) 4px,
        transparent 4px, transparent 8px,
        rgba(255,45,120,.10) 8px, rgba(255,45,120,.10) 10px,
        transparent 10px, transparent 16px,
        rgba(0,180,255,.10) 16px, rgba(0,180,255,.10) 18px,
        transparent 18px, transparent 24px);
      animation: ggBars .12s steps(3) infinite;
    }
    @keyframes ggBars{
      0%   { transform: translateX(-4px); }
      50%  { transform: translateX(6px); }
      100% { transform: translateX(0); }
    }
    .global-glitch .gg-rgb{
      position: absolute; inset: 0;
      background: linear-gradient(90deg,
        rgba(255,45,120,.18) 0%, transparent 12%,
        transparent 88%, rgba(0,180,255,.18) 100%);
      animation: ggRGB .2s steps(2) infinite;
    }
    @keyframes ggRGB{
      0%   { transform: translateX(-3px); }
      100% { transform: translateX(3px); }
    }

    @media (prefers-reduced-motion: reduce){
      #larp-matrix{ display: none; }
      html.larp-mode .scanlines{ animation: none; }
      html.larp-mode .big-title{ animation: none; }
    }
  `;
  document.head.appendChild(style);

  const canvas = document.createElement('canvas');
  canvas.id = 'larp-matrix';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]/*+-=$#@!?';
  const FONT_SIZE = 15;
  let cols = 0;
  let drops = [];
  let matrixRaf = null;

  function resizeMatrix(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.ceil(canvas.width / FONT_SIZE);
    drops = new Array(cols).fill(0).map(() => Math.random() * -50);
  }
  resizeMatrix();
  window.addEventListener('resize', resizeMatrix);

  function drawMatrix(){
    ctx.fillStyle = 'rgba(2,1,5,0.10)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = FONT_SIZE + 'px monospace';
    ctx.textBaseline = 'top';
    for (let i = 0; i < cols; i++){
      const c = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * FONT_SIZE;
      const y = drops[i] * FONT_SIZE;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur  = 12;
      ctx.fillStyle   = '#f3e8ff';
      ctx.fillText(c, x, y);
      ctx.shadowBlur = 0;
      ctx.fillStyle  = 'rgba(168,85,247,0.55)';
      ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - FONT_SIZE);
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixRaf = requestAnimationFrame(drawMatrix);
  }
  function startMatrix(){ if (matrixRaf) return; matrixRaf = requestAnimationFrame(drawMatrix); }
  function stopMatrix(){
    if (matrixRaf){ cancelAnimationFrame(matrixRaf); matrixRaf = null; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  let glitchTimer = null;
  function pickHeadings(){
    return document.querySelectorAll('.hero-copy h1, .big-title h1, .portfolio h1, .project-detail h1');
  }
  function triggerGlitch(){
    const els = pickHeadings();
    if (!els.length) return;
    const el = els[Math.floor(Math.random() * els.length)];
    el.classList.add('fx-glitching');
    setTimeout(() => el.classList.remove('fx-glitching'), 300);
  }
  function startGlitchLoop(){
    if (glitchTimer) return;
    const scheduleNext = () => {
      const delay = 6000 + Math.random() * 8000;
      glitchTimer = setTimeout(() => {
        if (isLarp()) triggerGlitch();
        if (isLarp()) scheduleNext(); else glitchTimer = null;
      }, delay);
    };
    setTimeout(() => {
      if (isLarp()) triggerGlitch();
      scheduleNext();
    }, 2500 + Math.random() * 2500);
  }
  function stopGlitchLoop(){
    if (glitchTimer){ clearTimeout(glitchTimer); glitchTimer = null; }
  }

  function activate(){
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    startMatrix();
    startGlitchLoop();
  }
  function deactivate(){ stopMatrix(); stopGlitchLoop(); }

  new MutationObserver(muts => {
    for (const m of muts){
      if (m.attributeName === 'class'){ isLarp() ? activate() : deactivate(); }
    }
  }).observe(HTML, { attributes:true, attributeFilter:['class'] });

  if (isLarp()) activate();

  /* global glitch — g key, both modes */
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = (e.target && e.target.tagName) || '';
    if (/input|textarea|select/i.test(tag)) return;
    if (e.target && e.target.isContentEditable) return;
    const pal = document.getElementById('palette');
    if (pal && !pal.hidden) return;
    if (e.key !== 'g' && e.key !== 'G') return;
    e.preventDefault();

    const glitch = document.createElement('div');
    glitch.className = 'global-glitch';
    glitch.innerHTML = `<div class="gg-bars"></div><div class="gg-rgb"></div>`;
    document.body.appendChild(glitch);
    requestAnimationFrame(() => glitch.classList.add('go'));
    setTimeout(() => glitch.remove(), 700);

    if (isLarp()) triggerGlitch();

    const logoSpan = document.querySelector('.logo span');
    if (logoSpan){
      const chars = '◆◇○●◉◎✦✧✶✷✸✹';
      let i = 0;
      const iv = setInterval(() => {
        logoSpan.textContent = chars[Math.floor(Math.random() * chars.length)];
        if (++i > 8){ clearInterval(iv); logoSpan.textContent = '●'; }
      }, 60);
    }
  }, true);
})();