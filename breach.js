/* ============================================================
   breach.js — terminal breach easter egg (self-contained)
   Trigger from palette: "breach"  OR  window.__larpBreach()
   All styles injected inline — no dependency on styles.css.
   ============================================================ */
(function(){
  console.log('[breach.js] loaded');

  /* ==========================================================
     SELF-CONTAINED STYLES
     ========================================================== */
  const STYLE_ID = 'breach-styles';
  if (!document.getElementById(STYLE_ID)){
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = `
      #boot{
        position:fixed;inset:0;z-index:90000;
        background:#040201;
        padding:32px;
        color:var(--fg, #ffa537);
        font:13px/1.55 var(--mono, ui-monospace, monospace);
        text-shadow:0 0 4px rgba(255,140,0,.4);
        display:none;
        flex-direction:column;
        overflow:hidden;
      }
      #boot[data-open="1"]{ display:flex; }
      #boot.done{ opacity:0; pointer-events:none; transition:opacity .35s ease; }

      #boot .boot-inner{
        width:min(860px,100%);
        height:100%;
        margin:0 auto;
        display:flex;
        flex-direction:column;
        min-height:0;
      }

      #boot .game-log{
        flex:1;
        overflow-y:auto;
        padding:4px 4px 12px;
        white-space:pre-wrap;
        word-break:break-word;
        scrollbar-width:thin;
        scrollbar-color:#4a382b transparent;
      }
      #boot .game-log::-webkit-scrollbar{ width:8px; }
      #boot .game-log::-webkit-scrollbar-track{ background:transparent; }
      #boot .game-log::-webkit-scrollbar-thumb{ background:#4a382b; }

      #boot .game-line{
        min-height:1.55em;
        padding:1px 0;
        font-family:inherit;
      }
      #boot .game-line.muted{ color:#9a8979; }
      #boot .game-line.warn{  color:#ff4d1a; }
      #boot .game-line.ok{    color:#ffb44d; }
      #boot .game-line.big{   font-size:16px; letter-spacing:.12em; }
      #boot .game-line.hint{  color:#ffb44d; padding-left:8px; }
      #boot .game-line.echo{  color:#c8b9aa; }
      #boot .game-line .game-user{ color:#ffb44d; }
      #boot .game-line .game-hint-mark{ color:#b8895a; font-weight:bold; margin-right:4px; }
      #boot .game-line .ok{ color:#ffb44d; }
      #boot .game-line pre{
        user-select:text;
        overflow-x:auto;
      }
      #boot .game-line a{ color:#b8895a; text-decoration:none; border-bottom:1px dashed currentColor; }
      #boot .game-line a:hover{ color:#ffb44d; }
      #boot .game-line img{ user-select:none; }

      #boot .game-input-row{
        display:flex; align-items:center; gap:8px;
        padding:10px 4px 8px;
        border-top:1px dashed #4a382b;
        flex-shrink:0;
      }
      #boot .game-prompt{
        color:#ffb44d;
        white-space:nowrap;
        text-shadow:0 0 6px rgba(255,140,0,.5);
      }
      #boot .game-input{
        flex:1;
        background:transparent;
        border:0; outline:0;
        color:#f0e6d7;
        font:inherit;
        caret-color:#b8895a;
        padding:2px 0;
        min-width:0;
      }

      #boot .game-footer{
        display:flex; align-items:center; gap:16px;
        padding:8px 4px 0;
        font-size:11px;
        color:#6f6054;
        border-top:1px solid #342820;
        flex-shrink:0;
      }
      #boot .game-btn{
        background:none; border:0;
        color:#9a8979;
        font:inherit; font-size:11px;
        cursor:pointer; padding:2px 0;
        letter-spacing:.05em;
      }
      #boot .game-btn:hover{ color:#b8895a; }
      #boot .game-tip{
        margin-left:auto;
        color:#6f6054;
        font-size:10px;
      }
      #boot .game-tip b{ color:#ffb44d; font-weight:normal; }

      /* LARP mode adjustments */
      html.larp-mode #boot{
        color:#c084fc;
        background:#050208;
        text-shadow:0 0 4px rgba(168,85,247,.5);
      }
      html.larp-mode #boot .game-line.muted{ color:#7c3aed; }
      html.larp-mode #boot .game-line.warn{  color:#ff2d78; }
      html.larp-mode #boot .game-line.ok{    color:#d8b4fe; }
      html.larp-mode #boot .game-line.hint{  color:#d8b4fe; }
      html.larp-mode #boot .game-line.echo{  color:#c084fc; }
      html.larp-mode #boot .game-line .game-user{ color:#d8b4fe; }
      html.larp-mode #boot .game-line .game-hint-mark{ color:#a855f7; }
      html.larp-mode #boot .game-line .ok{ color:#d8b4fe; }
      html.larp-mode #boot .game-input-row{ border-top-color:#2e1065; }
      html.larp-mode #boot .game-prompt{ color:#d8b4fe; }
      html.larp-mode #boot .game-input{ color:#f3e8ff; caret-color:#a855f7; }
      html.larp-mode #boot .game-footer{ color:#4c1d95; border-top-color:#2e1065; }
      html.larp-mode #boot .game-btn{ color:#7c3aed; }
      html.larp-mode #boot .game-btn:hover{ color:#a855f7; }
      html.larp-mode #boot .game-tip{ color:#4c1d95; }
      html.larp-mode #boot .game-line a{ color:#a855f7; }
      html.larp-mode #boot .game-line a:hover{ color:#d8b4fe; }
      html.larp-mode #boot .game-log::-webkit-scrollbar-thumb{ background:#2e1065; }
      html.larp-mode #boot .game-log::-webkit-scrollbar-track{ background:transparent; }
    `;
    document.head.appendChild(st);
  }

  /* ==========================================================
     ELEMENT LOOKUP — create boot if missing
     ========================================================== */
  let boot = document.getElementById('boot');
  if (!boot){
    console.warn('[breach.js] #boot not found — creating one');
    boot = document.createElement('div');
    boot.id = 'boot';
    boot.className = 'boot';
    boot.setAttribute('data-open', '0');
    boot.innerHTML = `
      <div class="boot-inner">
        <div id="game-log" class="game-log" aria-live="polite"></div>
        <div class="game-input-row">
          <span class="game-prompt">guest@larpsociety:~$</span>
          <input id="game-input" class="game-input" autocomplete="off" spellcheck="false" autocapitalize="off" autocorrect="off">
        </div>
        <div class="game-footer">
          <button type="button" class="game-btn" id="game-hint">[?] hint</button>
          <button type="button" class="game-btn" id="game-skip">[»] exit</button>
          <span class="game-tip">type <b>help</b> for commands</span>
        </div>
      </div>
    `;
    document.body.appendChild(boot);
  }

  const log   = document.getElementById('game-log');
  const input = document.getElementById('game-input');
  const skip  = document.getElementById('game-skip');
  const hint  = document.getElementById('game-hint');

  if (!log || !input){
    console.error('[breach.js] game elements missing, bailing');
    return;
  }

  /* ==========================================================
     PUZZLE DATA
     ========================================================== */
  const FINAL_KEY = 'the-machines-are-listening';

  const FILES = {
    'readme.txt': `LARPSOCIETY // readme
---------------------
you're inside the node. the door is locked.

this time it isn't one command away.

steps hint:
  1. one of these files is base64-encoded. decode it.
  2. it will tell you where the key lives.
  3. the key is behind an executable script.
  4. make it run. run it. then unlock.`,
    'door.lock': btoa('the key is inside .vault/ - but the script inside needs to be executable first.'),
    '.vault/key.sh': `#!/bin/bash
echo "TRUTH = the-machines-are-listening"
echo ""
echo "now: unlock the-machines-are-listening"`
  };

  const HINTS = [
    "start with: ls",
    "read the file that says it has the answer: cat readme.txt",
    "door.lock is base64. decode it: base64 door.lock",
    "the decoded hint tells you where to look: ls .vault",
    "make it executable: chmod +x .vault/key.sh",
    "run it: ./.vault/key.sh",
    "use the phrase it printed: unlock the-machines-are-listening",
    "or just type: exit"
  ];

  const INTRO = [
    { t: 'LARPSOCIETY BREACH PROTOCOL v2.0', c: 'muted' },
    { t: '========================================', c: 'muted' },
    { t: '' },
    { t: 'user:   guest' },
    { t: 'host:   larpsociety-node-01' },
    { t: 'status: ', h: 'LOCKED', c: 'warn' },
    { t: '' },
    { t: 'you are inside.' },
    { t: 'the door will not open for one command.' },
    { t: '' },
    { t: "complete the chain, or type 'help'.", c: 'muted' },
    { t: 'a reward waits at the end.', c: 'muted' },
    { t: '' }
  ];

  let state = { keyExecutable: false, wrong: 0, hintIndex: 0, solved: false };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function logLine(html, cls){
    const d = document.createElement('div');
    d.className = 'game-line' + (cls ? ' ' + cls : '');
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }
  function focusInput(){ try { input.focus(); } catch(e){} }

  async function intro(){
    log.innerHTML = '';
    for (const line of INTRO){
      if (state.solved) return;
      if (line.h) logLine(esc(line.t) + '<b class="ok">' + esc(line.h) + '</b>', line.c);
      else if (line.t === '') logLine('');
      else logLine(esc(line.t), line.c);
      await sleep(45);
    }
    focusInput();
  }

  function nextHint(){
    if (state.hintIndex >= HINTS.length){ logLine('no more hints. type: exit', 'muted'); return; }
    logLine('<span class="game-hint-mark">?</span> ' + esc(HINTS[state.hintIndex]), 'hint');
    state.hintIndex++;
  }
  function close(){
    boot.classList.add('done');
    boot.setAttribute('data-open', '0');
    setTimeout(() => {
      boot.style.display = 'none';
      boot.classList.remove('done');
    }, 380);
  }

  /* ---------- WIN ---------- */
  function showReward(){
    log.innerHTML = '';
    const banner = [
      '  ██████╗  ██████╗ ███╗   ██╗ ██████╗ ██████╗  █████╗ ████████╗███████╗',
      ' ██╔════╝ ██╔═══██╗████╗  ██║██╔════╝ ██╔══██╗██╔══██╗╚══██╔══╝██╔════╝',
      ' ██║      ██║   ██║██╔██╗ ██║██║  ███╗██████╔╝███████║   ██║   █████╗  ',
      ' ██║      ██║   ██║██║╚██╗██║██║   ██║██╔══██╗██╔══██║   ██║   ██╔══╝  ',
      ' ╚██████╗ ╚██████╔╝██║ ╚████║╚██████╔╝██║  ██║██║  ██║   ██║   ███████╗',
      '  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝'
    ].join('\n');

    logLine('<pre style="margin:10px 0;line-height:1.05;font-size:11px;overflow-x:auto">' + esc(banner) + '</pre>', 'ok');
    logLine('');
    logLine('You broke through the breach protocol.', 'ok big');
    logLine('');
    logLine('This easter egg is a personal thank-you from:', 'muted');
    logLine('');
    logLine('<b style="font-size:15px;letter-spacing:.15em">@ShGody</b>', 'ok');
    logLine('');
    logLine('Here is your reward — a screenshot of the LARP node,', 'muted');
    logLine('the way it looked when you found it:', 'muted');
    logLine('');

    /* reward screenshot with graceful fallback */
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin:12px 0 16px;padding:10px;max-width:560px;border:1px solid currentColor';
    const img = document.createElement('img');
    img.src = 'media/reward.png';
    img.alt = '@ShGody reward';
    img.style.cssText = 'display:block;width:100%;height:auto;max-height:400px;object-fit:contain;background:#000';
    img.onerror = () => {
      const pre = document.createElement('pre');
      pre.textContent = [
        '  ┌──────────────────────────────────────┐',
        '  │                                      │',
        '  │   ▓▒░   Y O U   W O N   ░▒▓          │',
        '  │                                      │',
        '  │   reward screenshot: media/reward.png│',
        '  │   (drop your image into the media    │',
        '  │    folder to show it here)           │',
        '  │                                      │',
        '  │   thanks for playing.                │',
        '  │              — @ShGody               │',
        '  │                                      │',
        '  └──────────────────────────────────────┘'
      ].join('\n');
      pre.style.cssText = 'font-family:inherit;font-size:11px;line-height:1.35;margin:0;padding:12px;overflow-x:auto';
      img.replaceWith(pre);
    };
    wrap.appendChild(img);
    const cap = document.createElement('div');
    cap.textContent = 'captured on larpsociety-node-01 · 0x4a51ef7';
    cap.style.cssText = 'padding:8px 4px 0;font-size:10px;letter-spacing:.14em;opacity:.7';
    wrap.appendChild(cap);

    const logDiv = document.createElement('div');
    logDiv.className = 'game-line';
    logDiv.appendChild(wrap);
    log.appendChild(logDiv);
    log.scrollTop = log.scrollHeight;

    logLine('');
    logLine('Tell me you got it:', 'muted');
    logLine('  <a href="https://t.me/ShGody" target="_blank" rel="noopener">t.me/ShGody ↗</a>', 'ok');
    logLine('');
    logLine('Real things live at:', 'muted');
    logLine('  <a href="#/lab">#/lab</a>  ·  <a href="#/projects">#/projects</a>', 'ok');
    logLine('');
    logLine('[ press esc or type exit to close ]', 'muted');

    state.solved = true;
  }

  function solve(){
    if (state.solved) return;
    showReward();
  }

  /* ---------- command processing ---------- */
  function cmd(raw){
    const line = String(raw || '').trim();
    if (!line) return;

    if (state.solved){
      if (line === 'exit' || line === 'q' || line === 'close' || line === 'esc') close();
      return;
    }

    logLine('<span class="game-user">guest@larpsociety:~$</span> ' + esc(line), 'echo');

    const parts = line.split(/\s+/);
    const c = parts[0].toLowerCase();
    const rest = parts.slice(1).join(' ');

    if (c === 'help' || c === '?'){
      logLine('available commands:', 'muted');
      logLine('  ls                   list files (try: ls .vault)');
      logLine('  cat <file>           read a file');
      logLine('  base64 <file>        decode a base64 file');
      logLine('  chmod +x <file>      make a file executable');
      logLine('  ./<file>             run an executable');
      logLine('  unlock "<phrase>"    unlock the door');
      logLine('  hint                 next hint');
      logLine('  clear                clear screen');
      logLine('  exit                 leave');
      return;
    }
    if (c === 'clear' || c === 'cls'){ log.innerHTML = ''; return; }
    if (c === 'hint'){ return nextHint(); }
    if (c === 'exit' || c === 'quit' || c === 'q'){ return close(); }
    if (c === 'whoami'){ logLine("you are 'guest'.", 'muted'); return; }
    if (c === 'pwd'){ logLine('/home/guest'); return; }
    if (c === 'sudo'){ logLine('guest is not in the sudoers file.', 'warn'); return; }
    if (c === 'hello' || c === 'hi'){ logLine('hello, friend.', 'muted'); return; }

    if (c === 'ls' || c === 'dir' || c === 'll'){
      const target = rest.replace(/\/$/, '');
      if (target === '.vault' || target === 'vault'){ logLine('key.sh'); return; }
      if (target && target !== '.' && target !== '~'){
        logLine(`ls: cannot access '${esc(target)}': no such file or directory`, 'warn');
        state.wrong++; if (state.wrong >= 3){ state.wrong = 0; nextHint(); }
        return;
      }
      logLine('readme.txt   door.lock   .vault/');
      return;
    }

    if (c === 'cat' || c === 'less' || c === 'more'){
      if (!rest){ logLine('usage: cat <file>', 'warn'); return; }
      let f = rest.replace(/^\.\//, '').trim().split(/\s+/).pop();
      let key = f;
      if (!FILES[key]){
        if (FILES[key + '.txt']) key += '.txt';
        else if (FILES[key + '.sh']) key += '.sh';
        else if (FILES[key + '.lock']) key += '.lock';
        else if (FILES['.vault/' + key]) key = '.vault/' + key;
        else {
          logLine(`cat: ${esc(f)}: no such file`, 'warn');
          state.wrong++; if (state.wrong >= 3){ state.wrong = 0; nextHint(); }
          return;
        }
      }
      FILES[key].split('\n').forEach(l => logLine(esc(l)));
      return;
    }

    if (c === 'base64'){
      if (!rest){ logLine('usage: base64 <file>', 'warn'); return; }
      const fileArg = rest.replace(/-d\s*/, '').trim().split(/\s+/).pop();
      const f = fileArg.replace(/^\.\//, '');
      if (f !== 'door.lock' && f !== 'door'){
        logLine(`base64: cannot open '${esc(f)}': no such file`, 'warn');
        state.wrong++; if (state.wrong >= 3){ state.wrong = 0; nextHint(); }
        return;
      }
      try {
        atob(FILES['door.lock']).split('\n').forEach(l => logLine(esc(l)));
      } catch(e){
        logLine('base64: invalid input', 'warn');
      }
      return;
    }

    if (c === 'chmod'){
      if (!rest){ logLine('usage: chmod +x <file>', 'warn'); return; }
      const m = rest.match(/(\+x|-x|755|700|555|644)/);
      const f = rest.split(/\s+/).pop().replace(/^\.\//, '');
      if (!m){ logLine('chmod: unknown mode. try: chmod +x .vault/key.sh', 'warn'); return; }
      if (f === '.vault/key.sh' || f === 'key.sh' || f === '.vault/key'){
        if (/644/.test(m[1])){ logLine('read-only. that won\'t help.', 'warn'); state.keyExecutable = false; return; }
        state.keyExecutable = true;
        logLine('.vault/key.sh is now executable.', 'ok');
      } else {
        logLine(`chmod: cannot access '${esc(f)}'`, 'warn');
      }
      return;
    }

    if (c === './.vault/key.sh' || c === './key.sh' || c === './key' || c === 'bash' || c === 'sh'){
      const t = (c === 'bash' || c === 'sh')
        ? rest.replace(/^\.\//, '').trim().split(/\s+/).pop()
        : (c === './.vault/key.sh' ? '.vault/key.sh' : 'key.sh');
      if (t !== '.vault/key.sh' && t !== 'key.sh' && t !== '.vault/key' && t !== 'key' && t !== ''){
        logLine(`${esc(t)}: not found`, 'warn');
        return;
      }
      if (!state.keyExecutable){
        logLine(`bash: ${t}: Permission denied`, 'warn');
        state.wrong++; if (state.wrong >= 2){ state.wrong = 0; nextHint(); }
        return;
      }
      FILES['.vault/key.sh'].split('\n').forEach(l => {
        if (!/^#/.test(l)) logLine(esc(l));
      });
      return;
    }

    if (c === 'unlock' || c === 'open' || c === 'enter'){
      if (!rest){ logLine('usage: unlock "<phrase>"', 'warn'); return; }
      let phrase = rest.trim().replace(/^["']|["']$/g, '');
      if (phrase === FINAL_KEY) return solve();
      logLine('unlock: wrong phrase', 'warn');
      state.wrong++; if (state.wrong >= 2){ state.wrong = 0; nextHint(); }
      return;
    }

    logLine(`${esc(c)}: command not found`, 'warn');
    state.wrong++; if (state.wrong >= 3){ state.wrong = 0; nextHint(); }
  }

  /* ==========================================================
     WIRE UP
     ========================================================== */
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter'){
      e.preventDefault();
      const v = input.value;
      input.value = '';
      cmd(v);
    } else if (e.key === 'Escape'){
      e.preventDefault();
      close();
    }
  });
  if (hint) hint.addEventListener('click', () => { nextHint(); focusInput(); });
  if (skip) skip.addEventListener('click', () => close());

  /* also close on esc anywhere */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (boot.getAttribute('data-open') !== '1') return;
    close();
  });

  /* ==========================================================
     PUBLIC API
     ========================================================== */
  window.__larpBreach = function(){
    console.log('[breach.js] opening');
    state = { keyExecutable: false, wrong: 0, hintIndex: 0, solved: false };

    /* force boot into a visible state */
    boot.style.display = 'flex';
    boot.classList.remove('done');
    boot.setAttribute('data-open', '1');
    void boot.offsetWidth;

    intro();
    setTimeout(focusInput, 120);
  };

  console.log('[breach.js] ready — call window.__larpBreach()');
})();