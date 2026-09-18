/* ============================================================
   app.js — Sahand Khodayi
   Routes: home, lab, projects, projects/<slug>, about.
   Orphans: people, forum, news, discover.
   ============================================================ */
const { SITE, PROJECTS } = window;
const MEDIA = window.MEDIA || {};
const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const route = () => (location.hash.replace(/^#\/?/, '').split('/')[0] || 'home');
const subroute = () => {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  return parts[1] || '';
};
const project = slug => PROJECTS.find(p => p.slug === slug);
const GITHUB_REPO = 'sahandkhodayi/sahandkhodayi.github.io';

/* ============================================================
   VIEWS
   ============================================================ */
function Home(){
  const featured = PROJECTS[0];
  return `<div class="page"><div class="wrap">
    <section class="home">
      <div class="hero-copy">
        <h1>I build things.<br><em>Then I break them.</em></h1>
        <p>Then I try to understand why. ML, mathematics, C, systems — mostly by making them interactive so other people can poke at them too.</p>
        <div class="hero-actions">
          <a class="pill hot" href="#/lab">enter the lab →</a>
          <a class="pill" href="#/projects">projects</a>
          <a class="pill" href="https://github.com/sahandkhodayi" target="_blank" rel="noopener">github ↗</a>
        </div>
      </div>
    </section>

    <section class="feature-grid">
      <div class="feature feature-big">
        <span class="label">featured</span>
        <h2>${esc(featured.title)}</h2>
        <p>${esc(featured.tagline)}</p>
        <a href="#/lab">play with it →</a>
      </div>
      <div class="feature accent">
        <span class="label">the lab</span>
        <h2>Four demos.<br>Four projects.</h2>
        <p>Interactive versions of everything I've built — no build step, runs in your browser.</p>
        <a href="#/lab">open the lab →</a>
      </div>
      <div class="feature">
        <span class="label">projects</span>
        <h2>Long-form writeups.</h2>
        <p>The design decisions, the pipeline, and what broke along the way.</p>
        <a href="#/projects">see the projects →</a>
      </div>
    </section>
  </div></div>`;
}

function Lab(){
  return `<div class="page"><div class="wrap">
    <div class="big-title">
      <h1>Touch the<br><em>machinery.</em></h1>
      <p>Each demo is a playable version of a real project. Same pipeline, running in your browser.</p>
    </div>
    <div id="lab-mounts"></div>
  </div></div>`;
}

function Projects(){
  return `<div class="page"><div class="wrap">
    <div class="big-title">
      <h1>Things made<br>to understand.</h1>
      <p>Each project started as a question I couldn't answer without building it.</p>
    </div>
    <div class="project-grid">
      ${PROJECTS.map(p => `
        <a class="card" href="#/projects/${p.slug}">
          <div class="card-top"><span>${esc(p.title)}</span><span class="card-arrow">↗</span></div>
          <p>${esc(p.tagline)}</p>
          <span class="small-link">read more →</span>
        </a>
      `).join('')}
    </div>
  </div></div>`;
}

function renderMedia(slug){
  const items = MEDIA[slug] || [];
  if (!items.length) return '';
  return `
    <section class="project-media">
      <h3>:: media</h3>
      <div class="media-grid">
        ${items.map(m => {
          if (m.type === 'video'){
            return `<figure class="media-item">
              <video controls preload="metadata" ${m.poster ? `poster="${esc(m.poster)}"` : ''}>
                <source src="${esc(m.src)}">
              </video>
              ${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ''}
            </figure>`;
          }
          return `<figure class="media-item">
            <img src="${esc(m.src)}" alt="${esc(m.caption || '')}" loading="lazy">
            ${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ''}
          </figure>`;
        }).join('')}
      </div>
    </section>`;
}

function ProjectDetail(slug){
  const p = project(slug || subroute());
  if (!p) return `<div class="page"><div class="wrap">
    <div class="big-title">
      <h1>Wrong rabbit hole.</h1>
      <a href="#/projects" class="pill">back to projects →</a>
    </div>
  </div></div>`;

  return `<div class="page"><div class="wrap">
    <div class="project-detail">
      <a href="#/projects" class="back-link">← projects</a>
      <span class="label">${esc(p.id)} · ${esc(p.status)}</span>
      <h1>${esc(p.title)}</h1>
      <p class="lead">${esc(p.blurb)}</p>
      <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>

      ${renderMedia(p.slug)}

      <div class="detail-grid">
        <div>
          <h3>:: the pipeline</h3>
          ${p.spec.map(x => `<div class="step"><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div>`).join('')}
        </div>
        <div>
          <h3>:: what you can try</h3>
          ${p.experiments.map(e => `
            <div class="experiment-row">
              <b>${esc(e.title)}</b>
              <span>${esc(e.body)}</span>
            </div>
          `).join('')}
          <a class="pill hot" href="#/lab">play with it in the lab →</a>
        </div>
      </div>

      <div class="detail-grid">
        <div>
          <h3>:: questions</h3>
          ${p.questions.map((q,i) => `<div class="question"><span>Q0${i+1}</span>${esc(q)}</div>`).join('')}
        </div>
        <div>
          <h3>:: source</h3>
          <p class="dim">Everything above is real. The source lives on GitHub.</p>
          <a class="pill hot" href="https://${esc(p.source)}" target="_blank" rel="noopener">open source ↗</a>
        </div>
      </div>
    </div>
  </div></div>`;
}

function About(){
  return `<div class="page"><div class="wrap">
    <div class="portfolio">
      <span class="label">about</span>
      <h1>SAHAND<br><em>KHODAYI</em></h1>
      <p class="lead">AI / ML · mathematics · C / systems</p>
      <p class="bio">I build things to understand how they work — from neural networks and mathematical ideas down to the C code and systems underneath them. This site is where that work becomes playable.</p>
      <div class="portfolio-actions">
        <a class="pill hot" href="https://github.com/sahandkhodayi" target="_blank" rel="noopener">github ↗</a>
        <a class="pill" href="#/lab">the lab</a>
        <a class="pill" href="#/projects">projects</a>
      </div>
      <div class="portfolio-work">
        <h2>:: selected work</h2>
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
  </div></div>`;
}

/* ---- orphan routes: exist but not linked anywhere ---- */
function People(){
  return `<div class="page"><div class="wrap">
    <div class="big-title">
      <h1>Not followers.<br><em>Participants.</em></h1>
      <p>you found the back room. no one's here yet.</p>
      <div class="hero-actions">
        <a class="pill" href="https://github.com/${GITHUB_REPO}/issues" target="_blank" rel="noopener">registry ↗</a>
      </div>
    </div>
    <div id="member-list" class="member-list"><div class="loading">loading…</div></div>
  </div></div>`;
}
async function loadPeople(){
  const root = document.getElementById('member-list');
  if (!root) return;
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues?state=open&per_page=100`);
    if (!res.ok) throw new Error('api');
    const issues = await res.json();
    const members = issues.filter(i => i.title.toUpperCase().startsWith('[JOIN]') && !i.pull_request);
    if (!members.length){
      root.innerHTML = `<div class="empty-members"><b>empty.</b><span>no one's joined yet.</span></div>`;
      return;
    }
    root.innerHTML = `
      <div class="member-head"><span>${members.length} participant${members.length === 1 ? '' : 's'}</span></div>
      <div class="members">
        ${members.map(i => `
          <a class="member" href="${esc(i.user.html_url)}" target="_blank" rel="noopener">
            <img src="${esc(i.user.avatar_url)}" alt="">
            <div><b>${esc(i.user.login)}</b><span>via github</span></div>
          </a>
        `).join('')}
      </div>`;
  } catch(e){
    root.innerHTML = `<div class="empty-members"><b>asleep.</b><span>couldn't reach github.</span></div>`;
  }
}

function Forum(){
  return `<div class="page"><div class="wrap">
    <div class="big-title">
      <h1>You're early.</h1>
      <p>no forum yet. when there is, it'll live here.</p>
    </div>
  </div></div>`;
}

function News(){
  return `<div class="page"><div class="wrap">
    <div class="big-title">
      <h1>No feed.</h1>
      <p>that's the point.</p>
    </div>
  </div></div>`;
}

function Discover(){
  return `<div class="page"><div class="wrap">
    <div class="big-title">
      <h1>Wander.</h1>
      <p>everything worth finding is one click away from the lab.</p>
    </div>
  </div></div>`;
}

/* ============================================================
   RENDER
   ============================================================ */
function render(){
  const r = route();
  const sub = subroute();

  let view;
  if (r === 'projects' && sub){
    view = () => ProjectDetail(sub);
  } else {
    view = {
      home: Home,
      lab: Lab,
      projects: Projects,
      about: About,
      people: People,
      forum: Forum,
      news: News,
      discover: Discover,
    }[r] || Home;
  }

  app.innerHTML = view();
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#/' + r));
  window.scrollTo(0, 0);
  if (r === 'people') loadPeople();
  startUptime();
  startClock();

  if (r === 'lab'){
    window.dispatchEvent(new CustomEvent('lab:mount'));
  }
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
  { cmd: 'lab',      desc: 'the four demos',         action: () => location.hash = '#/lab' },
  { cmd: 'projects', desc: 'writeups',               action: () => location.hash = '#/projects' },
  { cmd: 'about',    desc: 'who made this',          action: () => location.hash = '#/about' },
  { cmd: 'github',   desc: 'open github',            action: () => window.open('https://github.com/sahandkhodayi', '_blank') },
  { cmd: 'theme',    desc: 'toggle larp mode  (k)',  action: () => { const e = new KeyboardEvent('keydown', {key:'k', bubbles:true}); document.dispatchEvent(e); } },
  { cmd: 'breach',   desc: 'run the breach game',    action: () => window.__larpBreach && window.__larpBreach() },
  { cmd: 'shutdown', desc: 'halt the session',       action: () => window.__larpShutdown && window.__larpShutdown() },
  { cmd: 'reload',   desc: 'reload',                 action: () => location.reload() },
];

let palIdx = 0, palFiltered = CMDS;
function openPalette(){
  const el = document.getElementById('palette');
  if (!el) return;
  el.hidden = false; palIdx = 0; palFiltered = CMDS; drawPalette();
  const input = document.getElementById('palette-input');
  input.value = ''; input.focus();
}
function closePalette(){ const el = document.getElementById('palette'); if (el) el.hidden = true; }
function drawPalette(){
  const list = document.getElementById('palette-list');
  if (!list) return;
  list.innerHTML = palFiltered.length
    ? palFiltered.map((c,i) => `
        <div class="pal-item ${i === palIdx ? 'sel' : ''}" data-i="${i}">
          <span class="pal-cmd">${esc(c.cmd)}</span>
          <span class="pal-desc">${esc(c.desc)}</span>
        </div>`).join('')
    : `<div class="pal-item dim">no matching command</div>`;
  list.querySelectorAll('.pal-item[data-i]').forEach(el => {
    el.addEventListener('click', () => runPalette(+el.dataset.i));
  });
}
function runPalette(i){ const c = palFiltered[i]; if (!c) return; closePalette(); c.action(); }

document.addEventListener('keydown', e => {
  const pal = document.getElementById('palette');
  const isOpen = pal && !pal.hidden;
  const typing = /input|textarea/i.test(e.target.tagName);
  if (((e.key === '/' && !isOpen && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'))){
    e.preventDefault(); openPalette(); return;
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
  palIdx = 0; drawPalette();
});
document.addEventListener('click', e => {
  const pal = document.getElementById('palette');
  if (!pal || pal.hidden) return;
  const footBtn = e.target.closest('.palette-foot [data-act]');
  if (footBtn){
    const act = footBtn.dataset.act;
    if (act === 'close') return closePalette();
    if (act === 'up'){ palIdx = Math.max(palIdx - 1, 0); drawPalette(); }
    if (act === 'down'){ palIdx = Math.min(palIdx + 1, palFiltered.length - 1); drawPalette(); }
    if (act === 'run') runPalette(palIdx);
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
   BOOT
   ============================================================ */
window.addEventListener('hashchange', render);
render();