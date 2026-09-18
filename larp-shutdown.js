/* ============================================================
   larp-shutdown.js — shutdown / reboot easter egg
   ============================================================ */
(function(){
  const STORAGE_KEY = 'larp_offline';
  const HTML = document.documentElement;

  const style = document.createElement('style');
  style.id = 'larp-shutdown-styles';
  style.textContent = `
    #shutdown-overlay{
      position:fixed;inset:0;z-index:100000;
      background:#020105;display:none;
      align-items:center;justify-content:center;flex-direction:column;
      opacity:0;pointer-events:none;transition:opacity .18s ease;
      font-family:var(--mono);overflow:hidden;
    }
    #shutdown-overlay.active{ display:flex; }
    #shutdown-overlay.visible{ opacity:1; pointer-events:auto; }
    #shutdown-overlay::before{
      content:""; position:absolute; inset:0;
      background:repeating-linear-gradient(0deg,
        rgba(168,85,247,.035) 0px, rgba(168,85,247,.035) 1px,
        transparent 1px, transparent 3px);
      pointer-events:none; opacity:.8; z-index:1;
    }
    .sd-line{
      position:absolute;top:50%;left:0;right:0;height:6px;background:#fff;
      box-shadow:0 0 20px #a855f7,0 0 60px #a855f7,0 0 120px rgba(168,85,247,.7);
      transform-origin:center; opacity:0; z-index:3;
    }
    #shutdown-overlay.phase-line .sd-line{ opacity:1; animation:sdLineCollapse .7s cubic-bezier(.4,0,.6,1) forwards; }
    @keyframes sdLineCollapse{
      0%   { transform:scaleX(1) scaleY(1);   opacity:1; }
      35%  { transform:scaleX(1) scaleY(1.6); opacity:1; }
      100% { transform:scaleX(0) scaleY(1);   opacity:1; }
    }
    .sd-dot{
      position:absolute;top:50%;left:50%;width:14px;height:14px;
      margin:-7px 0 0 -7px;background:#fff;
      box-shadow:0 0 20px #a855f7,0 0 60px #a855f7,0 0 120px rgba(168,85,247,.9);
      border-radius:50%; opacity:0; transform:scale(0); z-index:3;
    }
    #shutdown-overlay.phase-dot .sd-dot{ animation:sdDotFade 1.15s ease-out forwards; }
    @keyframes sdDotFade{
      0%   { opacity:1; transform:scale(1); }
      22%  { opacity:1; transform:scale(1); }
      100% { opacity:0; transform:scale(.35); }
    }
    .sd-text{
      position:relative;z-index:2;text-align:center;color:#a855f7;
      opacity:0;transform:translateY(10px);
      transition:opacity .55s ease, transform .55s ease;
      padding:0 24px;max-width:560px;
    }
    #shutdown-overlay.phase-text .sd-text{ opacity:1; transform:none; }
    .sd-title{
      font-size:15px;letter-spacing:.55em;color:#ede9fe;margin-bottom:22px;
      text-shadow:0 0 10px #a855f7,0 0 30px rgba(168,85,247,.7);
    }
    .sd-rule{
      width:380px;max-width:80vw;height:1px;
      background:linear-gradient(90deg,transparent 0%,#a855f7 18%,#a855f7 82%,transparent 100%);
      margin:0 auto 22px; box-shadow:0 0 8px #a855f7;
    }
    .sd-line-txt{ font-size:12px;letter-spacing:.12em;color:#7c3aed;margin:6px 0; }
    .sd-line-txt b{ color:#ede9fe; font-weight:normal; }
    .sd-prompt{
      margin-top:44px;font-size:12px;color:#4c1d95;
      letter-spacing:.24em; animation:sdBlink 1.1s steps(2) infinite;
    }
    @keyframes sdBlink{ 50%{ opacity:.15; } }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'shutdown-overlay';
  overlay.innerHTML = `
    <div class="sd-line"></div>
    <div class="sd-dot"></div>
    <div class="sd-text">
      <div class="sd-title">SYSTEM HALTED</div>
      <div class="sd-rule"></div>
      <div class="sd-line-txt">connection closed by remote host</div>
      <div class="sd-line-txt">session <b>0x4a51ef7</b> · uptime <b id="sd-uptime">00:00</b></div>
      <div class="sd-line-txt">all processes terminated · memory wiped</div>
      <div class="sd-prompt">[ press any key to power on ]</div>
    </div>
  `;
  document.body.appendChild(overlay);

  let shuttingDown = false, uptimeHandle = null;

  function playShutdown(){
    if (shuttingDown) return;
    shuttingDown = true;
    try { document.body.style.pointerEvents = 'none'; } catch(e){}
    overlay.classList.add('active');
    void overlay.offsetWidth;
    overlay.classList.add('visible');
    setTimeout(() => overlay.classList.add('phase-line'), 180);
    setTimeout(() => overlay.classList.add('phase-dot'), 860);
    setTimeout(() => overlay.classList.add('phase-text'), 1500);
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch(e){}
    startUptime();
    armReboot();
  }
  function reboot(){
    try { sessionStorage.removeItem(STORAGE_KEY); } catch(e){}
    location.reload();
  }
  const IGNORED_KEYS = new Set(['Shift','Control','Alt','Meta','CapsLock','Tab','Escape','ContextMenu','OS']);
  function onKey(e){
    if (!shuttingDown) return;
    if (IGNORED_KEYS.has(e.key)) return;
    e.preventDefault(); e.stopPropagation(); reboot();
  }
  function onClick(e){ if (!shuttingDown) return; e.preventDefault(); e.stopPropagation(); reboot(); }
  function onTouch(e){ if (!shuttingDown) return; e.preventDefault(); e.stopPropagation(); reboot(); }
  function armReboot(){
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('touchstart', onTouch, {capture:true, passive:false});
  }
  function startUptime(){
    if (uptimeHandle) clearInterval(uptimeHandle);
    const t0 = Date.now();
    uptimeHandle = setInterval(() => {
      const e = document.getElementById('sd-uptime');
      if (!e) return;
      const s = Math.floor((Date.now() - t0) / 1000);
      e.textContent = String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
    }, 1000);
  }
  function checkOffline(){
    let off = false;
    try { off = sessionStorage.getItem(STORAGE_KEY) === '1'; } catch(e){}
    if (!off) return;
    shuttingDown = true;
    const boot = document.getElementById('boot');
    if (boot) boot.style.display = 'none';
    const shell = document.getElementById('shell');
    if (shell) shell.hidden = true;
    overlay.classList.add('active','visible','phase-text','phase-done');
    startUptime();
    armReboot();
  }

  window.__larpShutdown = playShutdown;
  window.__larpReboot   = reboot;

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', checkOffline);
  } else {
    checkOffline();
  }
})();