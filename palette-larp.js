/* ============================================================
   palette-larp.js — LARP-mode palette (violet mission console)
   ============================================================ */
(function(){
  const HTML = document.documentElement;
  const isLarp = () => HTML.classList.contains('larp-mode');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const style = document.createElement('style');
  style.id = 'palette-larp-styles';
  style.textContent = `
    html.larp-mode .palette{
      background:
        radial-gradient(ellipse at 50% 40%, rgba(168,85,247,.07) 0%, rgba(0,0,0,.94) 55%, #000 100%),
        repeating-linear-gradient(0deg,
          rgba(0,0,0,.4) 0px, rgba(0,0,0,.4) 1px,
          transparent 1px, transparent 3px);
      backdrop-filter: blur(2px);
      align-items: center; padding-top: 0; padding-bottom: 0;
    }
    html.larp-mode .palette-box{
      width:min(900px, calc(100% - 32px));
      border:1px solid #6d28d9;
      background:#050208;
      box-shadow:
        -3px 0 0 rgba(255,45,120,.32),
         3px 0 0 rgba(0,180,255,.32),
         inset 0 0 40px rgba(168,85,247,.08),
         0 0 60px rgba(168,85,247,.28),
         0 30px 90px rgba(0,0,0,.95);
      padding:0; position:relative; font-family:var(--mono);
      animation:larpConsIn .28s cubic-bezier(.4,1.6,.5,1);
      max-height: min(88vh, 720px);
      display: flex; flex-direction: column; overflow: hidden;
    }
    @keyframes larpConsIn{
      0%   { opacity:0; transform:translateY(-14px) scale(.985); filter:brightness(2.2) hue-rotate(30deg); }
      100% { opacity:1; transform:none; filter:none; }
    }
    html.larp-mode .palette-box::before,
    html.larp-mode .palette-box::after{
      content:""; position:absolute; width:12px;height:12px;
      border:1px solid #a855f7; pointer-events:none; z-index:5;
    }
    html.larp-mode .palette-box::before{ top:-1px;left:-1px;border-right:0;border-bottom:0; }
    html.larp-mode .palette-box::after{ bottom:-1px;right:-1px;border-left:0;border-top:0; }

    .larp-pal-header{
      border-bottom:1px solid #6d28d9;
      background:
        linear-gradient(180deg, rgba(30,10,60,.75) 0%, rgba(10,4,25,.4) 100%),
        repeating-linear-gradient(90deg,
          transparent 0, transparent 6px,
          rgba(168,85,247,.05) 6px, rgba(168,85,247,.05) 7px);
      padding:14px 18px 12px; position:relative; overflow:hidden; flex-shrink: 0;
    }
    .larp-banner{
      font-family:var(--mono); font-size:11px; line-height:1.05; margin:0;
      color:#a855f7; white-space:pre;
    }
    .larp-banner-side{
      display:flex; flex-direction:column; gap:6px;
      font-size:10px; letter-spacing:.08em; color:#c084fc;
    }
    .larp-header-row{
      display:flex; align-items:flex-start; justify-content:space-between; gap:24px;
    }
    .larp-sig{ display:flex;align-items:flex-end;gap:3px;height:22px; }
    .larp-sig i{
      display:block;width:5px;background:#a855f7;
      box-shadow:0 0 6px rgba(168,85,247,.8);
      animation:larpSig 1.1s ease-in-out infinite;
    }
    .larp-sig i:nth-child(1){ height:5px; animation-delay:0s; }
    .larp-sig i:nth-child(2){ height:10px; animation-delay:.12s; }
    .larp-sig i:nth-child(3){ height:15px; animation-delay:.24s; }
    .larp-sig i:nth-child(4){ height:20px; animation-delay:.36s; }
    .larp-sig i:nth-child(5){ height:20px; animation-delay:.48s; background:#2e1065; box-shadow:none; }
    @keyframes larpSig{ 0%,100%{ opacity:.4; } 50%{ opacity:1; } }

    .larp-status{
      display:flex; flex-wrap:wrap; gap:18px;
      padding:10px 18px; font-size:10px; letter-spacing:.12em;
      color:#7c3aed; border-bottom:1px solid #6d28d9;
      background:rgba(15,6,32,.55); flex-shrink: 0;
    }
    .larp-status span b{
      color:#ede9fe; font-weight:normal; margin-left:6px;
    }
    .larp-status .larp-dot{
      display:inline-block;width:7px;height:7px;border-radius:50%;
      background:#a855f7;box-shadow:0 0 6px #a855f7;
      animation:larpDot 1.2s ease-in-out infinite;
      margin-right:6px; vertical-align:-1px;
    }
    @keyframes larpDot{ 0%,100%{ opacity:1; } 50%{ opacity:.3; } }

    html.larp-mode .palette-bar{
      display:flex; align-items:center; gap:10px;
      padding:11px 18px; border-bottom:1px solid #6d28d9;
      background:rgba(20,8,45,.65); flex-shrink: 0;
    }
    html.larp-mode .palette-bar .prompt{
      color:#a855f7; font-size:12px; white-space:nowrap; flex-shrink:0;
    }
    html.larp-mode .palette-bar input{
      flex:1; background:transparent; border:0; outline:0;
      color:#ede9fe; font-family:var(--mono); font-size:13px;
      caret-color:#a855f7; min-width:0;
    }
    html.larp-mode .palette-bar input::placeholder{ color:#4c1d95; }

    html.larp-mode .palette-list{
      flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 0;
      background: linear-gradient(180deg, rgba(15,6,32,.45) 0%, rgba(5,2,10,.6) 100%);
      font-family: var(--mono);
    }
    html.larp-mode .palette-list::-webkit-scrollbar{ width:6px; }
    html.larp-mode .palette-list::-webkit-scrollbar-track{ background:#050208; }
    html.larp-mode .palette-list::-webkit-scrollbar-thumb{ background:#6d28d9; }

    .larp-cat{
      display:flex; align-items:center; gap:10px;
      padding:9px 18px 6px; font-size:9px; letter-spacing:.32em;
      color:#7c3aed; text-transform:uppercase;
    }
    .larp-cat::before{ content:"▸"; color:#a855f7; }
    .larp-cat::after{
      content:""; flex:1; height:1px;
      background:linear-gradient(90deg, rgba(168,85,247,.4) 0%, transparent 100%);
    }
    .larp-row{
      display:grid; grid-template-columns:52px 1fr 1.6fr 18px;
      gap:12px; align-items:baseline; padding:8px 18px; font-size:12px;
      cursor:pointer; border-left:2px solid transparent;
      transition:background .1s ease, border-color .1s ease;
    }
    .larp-row:hover{ background:rgba(168,85,247,.06); }
    .larp-row.sel{ background:rgba(168,85,247,.12); border-left-color:#a855f7; }
    .larp-tag{
      font-size:9px; letter-spacing:.14em;
      padding:1px 6px; border:1px solid; justify-self:start; white-space:nowrap;
    }
    .larp-tag.nav{ color:#c084fc; border-color:#4c1d95; background:rgba(192,132,252,.07); }
    .larp-tag.sys{ color:#ede9fe; border-color:#6d28d9; background:rgba(168,85,247,.08); }
    .larp-cmd{ color:#ede9fe; }
    .larp-row.sel .larp-cmd{ color:#a855f7; }
    .larp-desc{ color:#4c1d95; font-size:11px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .larp-row.sel .larp-desc{ color:#7c3aed; }
    .larp-arrow{ color:#4c1d95; text-align:right; }
    .larp-row.sel .larp-arrow{ color:#a855f7; }
    .larp-empty{
      padding:36px 18px; text-align:center;
      color:#4c1d95; font-size:12px; letter-spacing:.18em;
    }
    .larp-empty b{ color:#ff2d78; font-weight:normal; }

    html.larp-mode .palette-foot{
      display:flex; align-items:center; gap:14px;
      padding:9px 18px; font-size:10px; letter-spacing:.14em;
      color:#7c3aed; border-top:1px solid #6d28d9;
      background:rgba(15,6,32,.6); justify-content:flex-start; flex-shrink: 0;
    }
    html.larp-mode .palette-foot .larp-key{
      display:inline-block; padding:1px 6px;
      border:1px solid #6d28d9; color:#ede9fe;
      margin-right:6px; font-size:10px; background:rgba(168,85,247,.06);
    }
    html.larp-mode .palette-foot .larp-foot-right{
      margin-left:auto; color:#4c1d95; font-size:9px; letter-spacing:.22em;
    }
    @media(max-width:640px){
      html.larp-mode .palette-box{ width: calc(100% - 16px); max-height: min(92vh, 780px); }
      .larp-banner{ display:none; }
      .larp-status{ gap:10px; padding:8px 12px; font-size:9px; }
      .larp-row{ grid-template-columns:46px 1fr 16px; padding:8px 12px; }
      .larp-desc{ display:none; }
      html.larp-mode .palette-foot .larp-foot-right{ display:none; }
    }
  `;
  document.head.appendChild(style);

  const BANNER = [
    ' ██╗      █████╗ ██████╗ ██████╗ ',
    ' ██║     ██╔══██╗██╔══██╗██╔══██╗',
    ' ██║     ███████║██████╔╝██████╔╝',
    ' ██║     ██╔══██║██╔══██╗██╔═══╝ ',
    ' ███████╗██║  ██║██║  ██║██║     ',
    ' ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     '
  ].join('\n');

  const LARP_CMDS = [
    { tag:'nav', cmd:'home',     desc:'go home',                          action:() => location.hash = '#/' },
    { tag:'nav', cmd:'lab',      desc:'the four demos',                   action:() => location.hash = '#/lab' },
    { tag:'nav', cmd:'projects', desc:'writeups',                         action:() => location.hash = '#/projects' },
    { tag:'nav', cmd:'about',    desc:'who made this',                    action:() => location.hash = '#/about' },
    { tag:'sys', cmd:'breach',   desc:'run the breach game',              action:() => window.__larpBreach && window.__larpBreach() },
    { tag:'sys', cmd:'theme',    desc:'switch back to amber',             action:() => { const e = new KeyboardEvent('keydown', {key:'k', bubbles:true}); document.dispatchEvent(e); } },
    { tag:'sys', cmd:'shutdown', desc:'terminate the session',            action:() => window.__larpShutdown && window.__larpShutdown() },
    { tag:'sys', cmd:'reload',   desc:'reload the shell',                 action:() => location.reload() },
  ];
  const CAT_LABEL = { nav:'NAVIGATION', sys:'SYSTEM' };
  const LARP_PROMPTS = [
    'root@larpsociety:/#', '0x7FFD2A10@darknet:~#', '[fsociety]$',
    'null@void:~#', 'anon@blackbox:~$',
  ];
  let promptIdx = 0;

  const box = () => document.querySelector('.palette-box');
  let originalBoxHTML = null;

  function buildLarpPalette(){
    const b = box();
    if (!b) return;
    if (b.dataset.larpBuilt === '1') return;
    if (originalBoxHTML === null) originalBoxHTML = b.innerHTML;
    b.dataset.larpBuilt = '1';
    b.innerHTML = `
      <div class="larp-pal-header">
        <div class="larp-header-row">
          <pre class="larp-banner">${esc(BANNER)}</pre>
          <div class="larp-banner-side">
            <div>▸ SECURE CHANNEL  <span style="color:#a855f7;">[ESTABLISHED]</span></div>
            <div>▸ SESSION  0x4a51ef7</div>
            <div>▸ UPTIME  <span id="larp-uptime">00:00</span></div>
            <div class="larp-sig" aria-label="signal"><i></i><i></i><i></i><i></i><i></i></div>
          </div>
        </div>
      </div>
      <div class="larp-status">
        <span><span class="larp-dot"></span>SESSION<b>0x4a51ef7</b></span>
        <span>TARGET<b>0x7FFD2A10</b></span>
        <span>LATENCY<b id="larp-lat">12ms</b></span>
        <span>ENC<b>AES-256</b></span>
      </div>
      <div class="palette-bar">
        <span class="prompt" id="larp-prompt">${esc(LARP_PROMPTS[0])}</span>
        <input id="palette-input"
               placeholder="type a command…  (lab, projects, about, breach)"
               autocomplete="off" spellcheck="false"
               autocapitalize="off" autocorrect="off">
      </div>
      <div id="palette-list" class="palette-list"></div>
      <div class="palette-foot">
        <span><span class="larp-key">↑↓</span>navigate</span>
        <span><span class="larp-key">↵</span>execute</span>
        <span><span class="larp-key">esc</span>abort</span>
        <span class="larp-foot-right">LARP://CONSOLE v0.5</span>
      </div>
    `;
    const inp = b.querySelector('#palette-input');
    if (inp){
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
      try { inp.value = ''; inp.focus(); } catch(e){}
      requestAnimationFrame(() => { try { inp.focus(); } catch(e){} });
    }
    startLarpStrip();
  }
  function restoreOriginalPalette(){
    const b = box();
    if (!b) return;
    if (originalBoxHTML !== null){
      b.innerHTML = originalBoxHTML;
      delete b.dataset.larpBuilt;
    }
    stopLarpStrip();
  }

  let stripTimer = null, stripStart = 0;
  function startLarpStrip(){
    stopLarpStrip();
    stripStart = Date.now();
    stripTimer = setInterval(() => {
      const lat = document.getElementById('larp-lat');
      if (lat) lat.textContent = (8 + Math.floor(Math.random()*20)) + 'ms';
      const up = document.getElementById('larp-uptime');
      if (up){
        const s = Math.floor((Date.now() - stripStart) / 1000);
        up.textContent = String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
      }
    }, 900);
  }
  function stopLarpStrip(){ if (stripTimer){ clearInterval(stripTimer); stripTimer = null; } }

  let larpIdx = 0, larpFiltered = [];

  function renderLarpPalette(query){
    const list = document.getElementById('palette-list');
    if (!list) return;
    const q = (query || '').toLowerCase().trim();
    if (!q){
      const groups = {};
      LARP_CMDS.forEach(c => { (groups[c.tag] = groups[c.tag] || []).push(c); });
      let html = '', flatIdx = 0;
      const flat = [];
      Object.keys(groups).forEach(tag => {
        html += `<div class="larp-cat">${esc(CAT_LABEL[tag])}</div>`;
        groups[tag].forEach(c => {
          const sel = flatIdx === larpIdx;
          html += `
            <div class="larp-row ${sel?'sel':''}" data-i="${flatIdx}">
              <span class="larp-tag ${c.tag}">${c.tag.toUpperCase()}</span>
              <span class="larp-cmd">${esc(c.cmd)}</span>
              <span class="larp-desc">${esc(c.desc)}</span>
              <span class="larp-arrow">${sel?'▌':' '}</span>
            </div>`;
          flat.push(c); flatIdx++;
        });
      });
      larpFiltered = flat;
      list.innerHTML = html;
    } else {
      larpFiltered = LARP_CMDS.filter(c => c.cmd.includes(q) || c.desc.toLowerCase().includes(q) || c.tag.includes(q));
      if (larpIdx >= larpFiltered.length) larpIdx = 0;
      if (!larpFiltered.length){
        list.innerHTML = `<div class="larp-empty">no signal matched <b>${esc(q)}</b></div>`;
        return;
      }
      list.innerHTML = larpFiltered.map((c,i) => {
        const sel = i === larpIdx;
        return `
          <div class="larp-row ${sel?'sel':''}" data-i="${i}">
            <span class="larp-tag ${c.tag}">${c.tag.toUpperCase()}</span>
            <span class="larp-cmd">${esc(c.cmd)}</span>
            <span class="larp-desc">${esc(c.desc)}</span>
            <span class="larp-arrow">${sel?'▌':' '}</span>
          </div>`;
      }).join('');
    }
    list.querySelectorAll('.larp-row[data-i]').forEach(el => {
      el.addEventListener('click', () => runLarp(+el.dataset.i));
    });
    const sel = list.querySelector('.larp-row.sel');
    if (sel && sel.scrollIntoView) sel.scrollIntoView({block:'nearest'});
  }

  function swapPrompt(){
    const p = document.getElementById('larp-prompt');
    if (!p) return;
    p.textContent = LARP_PROMPTS[promptIdx % LARP_PROMPTS.length];
    promptIdx++;
  }
  function closePalette(){ const pal = document.getElementById('palette'); if (pal) pal.hidden = true; }
  function runLarp(i){
    const c = larpFiltered[i];
    if (!c) return;
    closePalette();
    if (c.action) c.action();
  }

  const pal = document.getElementById('palette');
  if (pal){
    new MutationObserver(() => {
      if (pal.hidden) return;
      if (isLarp()){ larpIdx = 0; buildLarpPalette(); swapPrompt(); renderLarpPalette(''); }
      else { restoreOriginalPalette(); }
    }).observe(pal, { attributes:true, attributeFilter:['hidden'] });
  }

  document.addEventListener('input', e => {
    if (e.target.id !== 'palette-input') return;
    if (!isLarp()) return;
    setTimeout(() => renderLarpPalette(e.target.value), 0);
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    if (!isLarp()) return;
    const p = document.getElementById('palette');
    if (!p || p.hidden) return;
    const t = e.target;
    if (t && t.id !== 'palette-input' && !p.contains(t)) return;
    e.preventDefault(); e.stopPropagation();
    runLarp(larpIdx);
  }, true);

  document.addEventListener('keydown', e => {
    const p = document.getElementById('palette');
    if (!p || p.hidden) return;
    if (!isLarp()) return;
    const t = e.target;
    if (t && t.id !== 'palette-input' && !p.contains(t)) return;
    if (e.key === 'ArrowDown'){
      e.preventDefault(); e.stopPropagation();
      larpIdx = Math.min(larpIdx + 1, Math.max(0, larpFiltered.length - 1));
      const inp = document.getElementById('palette-input');
      renderLarpPalette(inp ? inp.value : '');
    } else if (e.key === 'ArrowUp'){
      e.preventDefault(); e.stopPropagation();
      larpIdx = Math.max(larpIdx - 1, 0);
      const inp = document.getElementById('palette-input');
      renderLarpPalette(inp ? inp.value : '');
    }
  }, true);

  new MutationObserver(() => {
    const p = document.getElementById('palette');
    if (!p || p.hidden) return;
    if (isLarp()){ larpIdx = 0; buildLarpPalette(); swapPrompt(); renderLarpPalette(''); }
    else { restoreOriginalPalette(); }
  }).observe(HTML, { attributes:true, attributeFilter:['class'] });
})();