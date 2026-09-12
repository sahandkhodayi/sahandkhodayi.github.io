/* ============================================================
   LARPSOCIETY — fsociety terminal + entry breach game
   ============================================================ */
const SITE       = window.SITE       || { handle:'sahand', motto:'build it. break it. understand it.' };
const PROJECTS   = window.PROJECTS   || [];
const EXPERIMENTS= window.EXPERIMENTS|| [];

const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route = () => (location.hash.replace(/^#\/?/, '').split('/')[0] || 'home');
const project = slug => PROJECTS.find(p => p.slug === slug);
const GITHUB_REPO = 'sahandkhodayi/sahandkhodayi.github.io';
const JOIN_URL = `https://github.com/${GITHUB_REPO}/issues/new?title=%5BJOIN%5D%20I%27m%20in&body=%23%20LARPSOCIETY%20SIGNUP%5Cn%5CnGitHub%20username%3A%20%40%5CnWhat%20are%20you%20into%3F%20`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ============================================================
   ENTRY GAME — fsociety breach
   puzzle: ls → cat readme.txt → chmod +x key.sh → ./key.sh → unlock fsociety
   ============================================================ */
const GAME = {
  keyExecutable: false,
  wrong: 0,
  hintIndex: 0,
  solved: false
};

const DOOR_KEY = 'fsociety';

const FILES = {
  'readme.txt': `LARPSOCIETY // readme
---------------------
the door is locked. you need a key.
there is a script in this directory that can generate one.

find it. make it runnable. run it. then unlock the door.

quick commands:
  ls             list files
  cat <file>     read a file
  chmod +x <f>   make a file executable
  ./<file>       run an executable
  unlock <key>   unlock the door`,
  'door.lock': `=== door.lock ===
status: LOCKED
hint:   unlock <key>`,
  'key.sh': `#!/bin/bash
# key.sh — generates the door key
echo "KEY = ${DOOR_KEY}"`
};

const HINTS = [
  "try: ls",
  "read a file: cat readme.txt",
  "make the script executable: chmod +x key.sh",
  "run the script: ./key.sh",
  "use the key: unlock " + DOOR_KEY,
  "or just type: skip"
];

const INTRO = [
  { t: 'LARPSOCIETY BREACH PROTOCOL v1.0', c: 'muted' },
  { t: '========================================', c: 'muted' },
  { t: '' },
  { t: 'user:   guest' },
  { t: 'host:   larpsociety-node-01' },
  { t: 'status: ', h: 'DOOR LOCKED', c: 'warn' },
  { t: '' },
  { t: 'you have been dropped into a shell.' },
  { t: 'the door to larpsociety is locked.' },
  { t: 'find a way in.' },
  { t: '' },
  { t: "type 'help' for commands, or 'skip' to bypass.", c: 'muted' },
  { t: '' }
];

function logLine(html, cls){
  const log = document.getElementById('game-log');
  if (!log) return;
  const d = document.createElement('div');
  d.className = 'game-line' + (cls ? ' ' + cls : '');
  d.innerHTML = html;
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
}

async function introSeq(){
  for (const line of INTRO){
    if (GAME.solved) return;
    if (line.h){
      logLine(esc(line.t) + '<b class="ok">' + esc(line.h) + '</b>', line.c);
    } else if (line.t === ''){
      logLine('');
    } else {
      logLine(esc(line.t), line.c);
    }
    await sleep(55);
  }
  focusInput();
}

function focusInput(){
  const i = document.getElementById('game-input');
  if (i) try { i.focus(); } catch(e){}
}

function nextHint(){
  if (GAME.hintIndex >= HINTS.length){
    logLine('no more hints. type: skip', 'muted');
    return;
  }
  logLine('<span class="game-hint-mark">?</span> ' + esc(HINTS[GAME.hintIndex]), 'hint');
  GAME.hintIndex++;
}

function gameSolve(){
  if (GAME.solved) return;
  GAME.solved = true;
  logLine('');
  logLine('>> ACCESS GRANTED', 'ok big');
  logLine('');
  try { sessionStorage.setItem('larp_breached', '1'); } catch(e){}
  setTimeout(() => finishBoot(), 800);
}

function gameCmd(raw){
  const input = String(raw || '').trim();
  if (!input) return;
  if (GAME.solved) return;

  // echo
  logLine('<span class="game-user">guest@larpsociety:~$</span> ' + esc(input), 'echo');

  const parts = input.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const rest = parts.slice(1).join(' ');

  // ---- help ----
  if (cmd === 'help' || cmd === '?'){
    logLine('available commands:', 'muted');
    logLine('  ls               list files');
    logLine('  cat <file>       read a file');
    logLine('  chmod +x <file>  make a file executable');
    logLine('  ./<file>         run an executable');
    logLine('  unlock <key>     unlock the door');
    logLine('  hint             show next hint');
    logLine('  clear            clear the screen');
    logLine('  skip             bypass the intro');
    logLine('  whoami           who are you?');
    return;
  }

  // ---- clear ----
  if (cmd === 'clear' || cmd === 'cls'){
    const log = document.getElementById('game-log');
    if (log) log.innerHTML = '';
    return;
  }

  // ---- hint ----
  if (cmd === 'hint' || cmd === 'hints'){
    return nextHint();
  }

  // ---- skip ----
  if (cmd === 'skip' || cmd === 'exit' || cmd === 'quit' || cmd === 'q'){
    return finishBoot();
  }

  // ---- misc ----
  if (cmd === 'whoami'){
    logLine("you are 'guest'. but you could be more.", 'muted');
    return;
  }
  if (cmd === 'pwd'){
    logLine('/home/guest');
    return;
  }
  if (cmd === 'date'){
    logLine(new Date().toString());
    return;
  }
  if (cmd === 'echo'){
    logLine(esc(rest) || '');
    return;
  }
  if (cmd === 'sudo'){
    logLine('guest is not in the sudoers file. this incident will be reported.', 'warn');
    return;
  }
  if (cmd === 'rm' || cmd === 'rmdir'){
    logLine('nice try.', 'muted');
    return;
  }
  if (cmd === 'man'){
    logLine('there is no man page. only the door.', 'muted');
    return;
  }
  if (cmd === 'hack' || cmd === 'hacktheplanet'){
    logLine("it's not that kind of movie.", 'muted');
    return;
  }
  if (cmd === 'matrix'){
    logLine('wake up, neo...', 'muted');
    return;
  }
  if (cmd === 'fsociety'){
    logLine('close. but you need the door key first.', 'muted');
    return;
  }
  if (cmd === 'hello' || cmd === 'hi' || cmd === 'hey'){
    logLine('hello, friend.', 'muted');
    return;
  }
  if (cmd === 'root'){
    logLine('not yet.', 'muted');
    return;
  }
  if (cmd === 'key'){
    logLine("try: cat key.sh  (or ./key.sh if you've made it executable)", 'muted');
    return;
  }

  // ---- ls ----
  if (cmd === 'ls' || cmd === 'dir' || cmd === 'll' || cmd === 'ls -la' || cmd === 'ls -l'){
    if (rest === '/' || rest === '/etc' || rest === '/home'){
      logLine('the rest of the filesystem is not your concern right now.', 'muted');
      return;
    }
    logLine('readme.txt   door.lock   key.sh');
    return;
  }

  // ---- cat ----
  if (cmd === 'cat' || cmd === 'less' || cmd === 'more' || cmd === 'head' || cmd === 'tail' || cmd === 'nano' || cmd === 'vim'){
    if (!rest){
      logLine('usage: cat <file>', 'warn');
      return;
    }
    let fname = rest.replace(/^\.\//, '').trim().split(/\s+/).pop();
    if (!FILES[fname]){
      if (FILES[fname + '.txt']) fname = fname + '.txt';
      else if (FILES[fname + '.sh']) fname = fname + '.sh';
      else if (FILES[fname + '.lock']) fname = fname + '.lock';
      else {
        logLine(`cat: ${esc(fname)}: no such file`, 'warn');
        GAME.wrong++;
        if (GAME.wrong >= 3){ GAME.wrong = 0; nextHint(); }
        return;
      }
    }
    FILES[fname].split('\n').forEach(l => logLine(esc(l)));
    return;
  }

  // ---- chmod ----
  if (cmd === 'chmod'){
    if (!rest){
      logLine('usage: chmod +x <file>', 'warn');
      return;
    }
    const modeMatch = rest.match(/(\+x|-x|755|700|555|644)/);
    const fname = rest.split(/\s+/).pop().replace(/^\.\//, '');
    if (!modeMatch){
      logLine('chmod: unknown mode. try: chmod +x key.sh', 'warn');
      return;
    }
    if (fname === 'key.sh' || fname === 'key'){
      if (/644/.test(modeMatch[1])){
        logLine('key.sh is now read-only. that won\'t help.', 'warn');
        GAME.keyExecutable = false;
        return;
      }
      GAME.keyExecutable = true;
      logLine('key.sh is now executable.', 'ok');
    } else {
      logLine(`chmod: cannot access '${esc(fname)}': no such file`, 'warn');
      GAME.wrong++;
      if (GAME.wrong >= 3){ GAME.wrong = 0; nextHint(); }
    }
    return;
  }

  // ---- run ----
  if (cmd === './key.sh' || cmd === './key' || cmd === 'bash' || cmd === 'sh' || cmd === 'zsh'){
    let target;
    if (cmd === 'bash' || cmd === 'sh' || cmd === 'zsh'){
      target = rest.replace(/^\.\//, '').trim().split(/\s+/).pop();
    } else {
      target = 'key.sh';
    }
    if (target !== 'key.sh' && target !== 'key' && target !== ''){
      logLine(`${esc(target)}: command not found`, 'warn');
      return;
    }
    if (!GAME.keyExecutable){
      logLine('bash: ./key.sh: Permission denied', 'warn');
      GAME.wrong++;
      if (GAME.wrong >= 2){ GAME.wrong = 0; nextHint(); }
      return;
    }
    logLine('KEY = ' + DOOR_KEY, 'ok big');
    return;
  }

  // ---- unlock ----
  if (cmd === 'unlock' || cmd === 'open' || cmd === 'enter'){
    if (!rest){
      logLine('usage: unlock <key>', 'warn');
      logLine('hint: you need to generate the key first.', 'muted');
      return;
    }
    if (rest.trim() === DOOR_KEY){
      return gameSolve();
    }
    logLine('unlock: wrong key', 'warn');
    GAME.wrong++;
    if (GAME.wrong >= 2){ GAME.wrong = 0; nextHint(); }
    return;
  }

  // ---- unknown ----
  logLine(`${esc(cmd)}: command not found`, 'warn');
  GAME.wrong++;
  if (GAME.wrong >= 3){
    GAME.wrong = 0;
    nextHint();
  }
}

function initGame(){
  const input   = document.getElementById('game-input');
  const hintBtn = document.getElementById('game-hint');
  const skipBtn = document.getElementById('game-skip');

  if (!input){ finishBoot(); return; }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter'){
      e.preventDefault();
      const v = input.value;
      input.value = '';
      gameCmd(v);
    }
  });

  hintBtn?.addEventListener('click', () => { nextHint(); focusInput(); });
  skipBtn?.addEventListener('click', () => finishBoot());

  introSeq();
}

/* ============================================================
   BOOT → SHELL
   ============================================================ */
let bootFinished = false;

function finishBoot(){
  if (bootFinished) return;
  bootFinished = true;
  try {
    const b = document.getElementById('boot');
    if (b){
      b.classList.add('done');
      setTimeout(() => { b.style.display = 'none'; }, 400);
    }
    const shell = document.getElementById('shell');
    if (shell) shell.hidden = false;
    render();
  } catch (err) {
    console.error('[LARPSOCIETY] boot error:', err);
    const shell = document.getElementById('shell');
    if (shell) shell.hidden = false;
  }
}

function startBoot(){
  let breached = false;
  try { breached = sessionStorage.getItem('larp_breached') === '1'; } catch(e){}
  if (breached){ finishBoot(); return; }
  initGame();
}

/* ============================================================
   HELPERS
   ============================================================ */
function shell(title, body){
  return `<div class="page"><div class="wrap">
    <div class="eyebrow">:: ${esc(title)}</div>
    ${body}
  </div></div>`;
}
function card(title, text, href, label = 'open'){
  return `<a class="card" href="${href}">
    <div class="card-top"><span>${esc(title)}</span><span class="card-arrow">↗</span></div>
    <p>${esc(text)}</p>
    <span class="small-link">${esc(label)}</span>
  </a>`;
}

/* ============================================================
   VIEWS (unchanged)
   ============================================================ */
function Home(){
  return `<div class="page"><div class="wrap">
    <section class="home">
      <div class="hero-copy">
        <div class="eyebrow">:: fsociety // node_01 // 0x7FFD2A10</div>
        <h1>come here to<br><em>try things.</em><span class="cursor"></span></h1>
        <p>code experiments, strange ideas, projects, people, and things worth messing with. no algorithm. no feed. just the terminal.</p>
        <div class="hero-actions">
          <a class="pill hot" href="#/lab">[ enter_the_lab ]</a>
          <a class="pill" href="#/people">[ join_the_network ]</a>
          <a class="pill" href="#/projects">[ open_projects ]</a>
        </div>
      </div>

      <aside class="side-terminal">
        <div class="side-head">┌─[ system_status ]</div>
        <div class="side-row"><span>node</span><b>larpsociety</b></div>
        <div class="side-row"><span>user</span><b>@${esc(SITE.handle)}</b></div>
        <div class="side-row"><span>motto</span><b>${esc(SITE.motto)}</b></div>
        <div class="side-row"><span>uptime</span><b id="uptime">00:00:00</b></div>
        <div class="side-row"><span>status</span><b class="ok">online</b></div>
        <div class="side-foot">└─[ nothing is sacred ]</div>
      </aside>
    </section>

    <section class="feature-grid">
      <div class="feature feature-big">
        <span class="label">01 / featured</span>
        <h2>What happens when you let a browser become a playground?</h2>
        <p>Open an experiment. Drag something. Break something. Learn why it broke.</p>
        <a href="#/lab">browse_experiments →</a>
      </div>
      <div class="feature accent">
        <span class="label">02 / community</span>
        <h2>People make the place.</h2>
        <p>Builders, artists, students, tinkerers, lurkers.</p>
        <a href="#/people">meet_the_people →</a>
      </div>
      <div class="feature">
        <span class="label">03 / news</span>
        <h2>Small signals. Big rabbit holes.</h2>
        <p>Interesting things from around the internet, without the noise.</p>
        <a href="#/news">read_the_signal →</a>
      </div>
    </section>

    <section class="term-note">
      <span class="prompt">guest@larpsociety:~$</span> <span class="typed">cat README.md</span>
      <p>this is a static site built with vanilla js. no framework. no tracking. no phone-home.</p>
      <p>press <kbd>/</kbd> or <kbd>ctrl</kbd>+<kbd>k</kbd> to open the command palette.</p>
    </section>
  </div></div>`;
}

function Discover(){
  return shell('discover / start_anywhere', `
    <div class="big-title">
      <h1>There is no<br><em>correct order.</em></h1>
      <p>Pick something that looks interesting. The point is to wander.</p>
    </div>
    <div class="discovery-grid">
      ${card('lab','Interactive experiments you can actually touch.','#/lab','play with it →')}
      ${card('people','A loose network of curious humans.','#/people','see the network →')}
      ${card('projects','Things people built because they wondered what would happen.','#/projects','open projects →')}
      ${card('forum','Talk, ask, share, argue politely.','#/forum','join the conversation →')}
      ${card('news','A few things worth clicking today.','#/news','follow the rabbit hole →')}
      ${card('sahand','The builder behind this place. His actual portfolio lives here.','#/sahand','view portfolio →')}
    </div>
  `);
}

function Lab(){
  return shell('lab / interactive_playground', `
    <div class="big-title">
      <h1>Touch the<br><em>machinery.</em></h1>
      <p>These are questions turned into things. Some are finished. Some are deliberately weird.</p>
    </div>
    <div class="lab-list">
      ${EXPERIMENTS.map((e,i) => `
        <details>
          <summary>
            <span class="num">[${String(i+1).padStart(2,'0')}]</span>
            <b>${esc(e.title)}</b>
            <span class="state ${e.tag}">${esc(e.status)}</span>
          </summary>
          <div class="lab-body">
            <p>${esc(e.body)}</p>
            <div class="spec-row">
              ${e.spec.map(x => `<span><i>${esc(x[0])}:</i> <b>${esc(x[1])}</b></span>`).join('')}
            </div>
          </div>
        </details>
      `).join('')}
    </div>
  `);
}

function People(){
  return shell('people / the_network', `
    <div class="big-title">
      <h1>Not followers.<br><em>Participants.</em></h1>
      <p>V1 uses GitHub as the public registry: sign in to GitHub, open a JOIN issue, and the site reads the public issue list directly from GitHub.</p>
      <div class="hero-actions">
        <a class="pill hot" href="${JOIN_URL}" target="_blank" rel="noopener">join_larpsociety ↗</a>
        <a class="pill" href="https://github.com/${GITHUB_REPO}/issues" target="_blank" rel="noopener">see_registry ↗</a>
      </div>
    </div>
    <div id="member-list" class="member-list">
      <div class="loading">establishing connection…</div>
    </div>
    <div class="note">
      static site, public GitHub registry. no custom database, no VPS, no monthly server bill.
    </div>
  `);
}

async function loadPeople(){
  const root = document.getElementById('member-list');
  if (!root) return;
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues?state=open&per_page=100`);
    if (!res.ok) throw new Error('GitHub API');
    const issues = await res.json();
    const members = issues.filter(i => i.title.toUpperCase().startsWith('[JOIN]') && !i.pull_request);
    if (!members.length){
      root.innerHTML = `<div class="empty-members"><b>you could be first.</b><span>no JOIN posts yet.</span></div>`;
      return;
    }
    root.innerHTML = `
      <div class="member-head">
        <span>${members.length} participant${members.length === 1 ? '' : 's'}</span>
        <span>// live from github</span>
      </div>
      <div class="members">
        ${members.map(i => `
          <a class="member" href="${esc(i.user.html_url)}" target="_blank" rel="noopener">
            <img src="${esc(i.user.avatar_url)}" alt="">
            <div><b>${esc(i.user.login)}</b><span>joined via github</span></div>
            <i>↗</i>
          </a>
        `).join('')}
      </div>
    `;
  } catch (e) {
    root.innerHTML = `<div class="empty-members"><b>the network is asleep.</b><span>GitHub API could not be reached right now.</span></div>`;
  }
}

function Projects(){
  return shell('projects / built_here', `
    <div class="big-title">
      <h1>Things made<br>to understand.</h1>
      <p>Not a portfolio grid. Each project is an invitation to look closer.</p>
    </div>
    <div class="project-grid">
      ${PROJECTS.map(p => card(p.title, p.blurb, `#/projects/${p.slug}`, 'open project →')).join('')}
    </div>
  `);
}

function ProjectDetail(){
  const slug = location.hash.split('/')[2];
  const p = project(slug);
  if (!p) return shell('404', `
    <div class="big-title">
      <h1>Wrong rabbit hole.</h1>
      <a href="#/projects" class="pill">back to projects →</a>
    </div>
  `);
  return shell(`project / ${p.title}`, `
    <div class="project-detail">
      <span class="label">${esc(p.id)} · ${esc(p.status)}</span>
      <h1>${esc(p.title)}</h1>
      <p class="lead">${esc(p.blurb)}</p>
      <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="detail-grid">
        <div>
          <h3>:: the_idea</h3>
          <p class="dim">build it, inspect it, inspect it again.</p>
          ${p.pipeline.map(x => `<div class="step"><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div>`).join('')}
        </div>
        <div>
          <h3>:: questions</h3>
          ${p.questions.map((q,i) => `<div class="question"><span>Q0${i+1}</span>${esc(q)}</div>`).join('')}
          <a class="pill hot" href="https://${p.spec.find(x => x[0] === 'source')?.[1] || 'github.com/sahandkhodayi'}" target="_blank" rel="noopener">source ↗</a>
        </div>
      </div>
    </div>
  `);
}

function Forum(){
  return shell('forum / conversation', `
    <div class="big-title">
      <h1>Talk about<br><em>the weird stuff.</em></h1>
      <p>For the first version, this points to an external discussion layer.</p>
    </div>
    <div class="forum-box">
      <div>
        <span class="label">recommended_v1</span>
        <h2>GitHub Discussions / Giscus</h2>
        <p>No custom server. No database to maintain. Works with GitHub Pages.</p>
      </div>
      <a class="pill hot" href="https://github.com/${GITHUB_REPO}/discussions" target="_blank" rel="noopener">open_discussions ↗</a>
    </div>
  `);
}

function News(){
  return shell('news / today_signal', `
    <div class="big-title">
      <h1>Less feed.<br><em>More signal.</em></h1>
      <p>A lightweight static news shelf.</p>
    </div>
    <div class="news-list">
      <article><span>[01]</span><div><b>Build something you can touch</b><p>Good experiments beat another wall of documentation.</p></div></article>
      <article><span>[02]</span><div><b>Open the browser console</b><p>Sometimes the fastest way to understand a website is to poke it.</p></div></article>
      <article><span>[03]</span><div><b>Follow a rabbit hole</b><p>There is no algorithm here telling you what you should care about.</p></div></article>
    </div>
  `);
}

function Sahand(){
  return shell('sahand / portfolio', `
    <div class="portfolio">
      <span class="label">founder / builder</span>
      <h1>SAHAND<br><em>KHODAYI</em></h1>
      <p class="lead">AI / ML · mathematics · C / systems</p>
      <p class="bio">I build things to understand how they work — from neural networks and mathematical ideas to the C code and systems underneath them.</p>
      <div class="portfolio-actions">
        <a class="pill hot" href="https://github.com/sahandkhodayi" target="_blank" rel="noopener">github ↗</a>
        <a class="pill" href="#/projects">my_projects</a>
      </div>
      <div class="portfolio-work">
        <h2>:: selected_work</h2>
        ${PROJECTS.map(p => `
          <a href="#/projects/${p.slug}">
            <span>${esc(p.id)}</span>
            <b>${esc(p.title)}</b>
            <small>${esc(p.tags.join(' · '))}</small>
            <i>↗</i>
          </a>
        `).join('')}
      </div>
    </div>
  `);
}

/* ============================================================
   RENDER
   ============================================================ */
function render(){
  const r = route();
  const view = { home:Home, discover:Discover, lab:Lab, people:People, projects:Projects, forum:Forum, news:News, sahand:Sahand }[r] || Home;
  app.innerHTML = view();
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#/' + r));
  window.scrollTo(0, 0);
  if (r === 'people') loadPeople();
  startUptime();
  startClock();
}

/* ============================================================
   UPTIME + CLOCK
   ============================================================ */
const SESSION_START = Date.now();
let uptimeHandle = null;
function startUptime(){
  const el = document.getElementById('uptime');
  if (!el) return;
  if (uptimeHandle) clearInterval(uptimeHandle);
  const tick = () => {
    const s = Math.floor((Date.now() - SESSION_START) / 1000);
    const hh = String(Math.floor(s / 3600)).padStart(2, '0');
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    el.textContent = `${hh}:${mm}:${ss}`;
  };
  tick();
  uptimeHandle = setInterval(tick, 1000);
}

function startClock(){
  const el = document.getElementById('clock');
  if (!el) return;
  const tick = () => {
    const d = new Date();
    el.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map(n => String(n).padStart(2, '0')).join(':');
  };
  tick();
  clearInterval(startClock._h);
  startClock._h = setInterval(tick, 1000);
}

/* ============================================================
   COMMAND PALETTE
   ============================================================ */
const CMDS = [
  { cmd: 'home',     desc: 'go home',                action: () => location.hash = '#/' },
  { cmd: 'discover', desc: 'start anywhere',          action: () => location.hash = '#/discover' },
  { cmd: 'lab',      desc: 'interactive experiments', action: () => location.hash = '#/lab' },
  { cmd: 'people',   desc: 'the network',             action: () => location.hash = '#/people' },
  { cmd: 'projects', desc: 'things built here',       action: () => location.hash = '#/projects' },
  { cmd: 'forum',    desc: 'conversation',            action: () => location.hash = '#/forum' },
  { cmd: 'news',     desc: "today's signal",          action: () => location.hash = '#/news' },
  { cmd: 'sahand',   desc: 'portfolio',               action: () => location.hash = '#/sahand' },
  { cmd: 'github',   desc: 'open github repo',        action: () => window.open('https://github.com/sahandkhodayi', '_blank') },
  { cmd: 'join',     desc: 'join the society',        action: () => window.open(JOIN_URL, '_blank') },
  { cmd: 'replay',   desc: 'replay the breach intro', action: () => { try{sessionStorage.removeItem('larp_breached');}catch(e){} location.reload(); } },
  { cmd: 'reload',   desc: 'reload the page',         action: () => location.reload() },
];

let palIdx = 0;
let palFiltered = CMDS;

function openPalette(){
  const el = document.getElementById('palette');
  if (!el) return;
  el.hidden = false;
  palIdx = 0;
  palFiltered = CMDS;
  drawPalette();
  const input = document.getElementById('palette-input');
  input.value = '';
  input.focus();
}
function closePalette(){
  const el = document.getElementById('palette');
  if (!el) return;
  el.hidden = true;
}
function drawPalette(){
  const list = document.getElementById('palette-list');
  if (!list) return;
  list.innerHTML = palFiltered.length
    ? palFiltered.map((c,i) => `
        <div class="pal-item ${i === palIdx ? 'sel' : ''}" data-i="${i}">
          <span class="pal-cmd">${esc(c.cmd)}</span>
          <span class="pal-desc">${esc(c.desc)}</span>
        </div>
      `).join('')
    : `<div class="pal-item dim">no matching command</div>`;
  list.querySelectorAll('.pal-item[data-i]').forEach(el => {
    el.addEventListener('click', () => runPalette(+el.dataset.i));
  });
}
function runPalette(i){
  const c = palFiltered[i];
  if (!c) return;
  closePalette();
  c.action();
}

document.addEventListener('keydown', e => {
  const pal = document.getElementById('palette');
  const isOpen = pal && !pal.hidden;
  const typing = /input|textarea/i.test(e.target.tagName);

  if (((e.key === '/' && !isOpen && !typing) ||
      ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'))){
    e.preventDefault();
    openPalette();
    return;
  }
  if (isOpen){
    if (e.key === 'Escape'){ e.preventDefault(); closePalette(); }
    else if (e.key === 'ArrowDown'){ e.preventDefault(); palIdx = Math.min(palIdx + 1, palFiltered.length - 1); drawPalette(); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); palIdx = Math.max(palIdx - 1, 0); drawPalette(); }
    else if (e.key === 'Enter'){ e.preventDefault(); runPalette(palIdx); }
  }
});

document.addEventListener('input', e => {
  if (e.target.id !== 'palette-input') return;
  const q = e.target.value.toLowerCase().trim();
  palFiltered = !q ? CMDS : CMDS.filter(c => c.cmd.includes(q) || c.desc.toLowerCase().includes(q));
  palIdx = 0;
  drawPalette();
});

document.addEventListener('click', e => {
  const pal = document.getElementById('palette');
  if (!pal || pal.hidden) return;

  const footBtn = e.target.closest('.palette-foot [data-act]');
  if (footBtn){
    const act = footBtn.dataset.act;
    if (act === 'close') return closePalette();
    if (act === 'up')   { palIdx = Math.max(palIdx - 1, 0); drawPalette(); }
    if (act === 'down') { palIdx = Math.min(palIdx + 1, palFiltered.length - 1); drawPalette(); }
    if (act === 'run')  runPalette(palIdx);
    return;
  }

  if (e.target === pal) closePalette();
});

/* ============================================================
   MOBILE MENU
   ============================================================ */
document.addEventListener('click', e => {
  const btn = e.target.closest('#menu');
  const nav = document.getElementById('nav');
  if (btn && nav){
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (e.target.closest('#nav a')){
    document.getElementById('nav')?.classList.remove('open');
  }
});

/* ============================================================
   START
   ============================================================ */
window.addEventListener('hashchange', render);

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', startBoot);
} else {
  startBoot();
}