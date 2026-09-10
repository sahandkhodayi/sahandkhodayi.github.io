const { PROJECTS, EXPERIMENTS, KNOWLEDGE, CONNECTIONS, SYSTEMS_TOPICS, MEM } = window;

/* ============================================================
   HELPERS
   ============================================================ */

const h = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

function specList(rows){ 
  return `<dl class="spec">${rows.map(([k,v])=>`
    <div class="spec-row"><dt>${h(k)}</dt><dd>${h(v)}</dd></div>`).join("")}</dl>`;
}

function tagList(tags){
  return `<div class="entry-tags">${tags.map(t=>`<span class="tag">${h(t)}</span>`).join("")}</div>`;
}

function projectEntry(p){
  return `
  <article class="entry">
    <div class="entry-id">[${p.id}]</div>
    <div class="entry-body">
      <h3 class="entry-title"><a href="#/projects/${p.slug}">${h(p.title)}</a></h3>
      <p class="entry-desc">${h(p.blurb)}</p>
      ${tagList(p.tags)}
    </div>
    <div class="entry-side"><span class="tag a">${h(p.status)}</span></div>
  </article>`;
}

/* ============================================================
   VIEWS
   ============================================================ */

function Home(){
  return `
  <div class="view">
    <section class="hero">
      <div class="container">
        <div class="kicker">// index</div>
        <h1>I build things to understand how they work.<span class="cur"></span></h1>
        <p class="lede">
          AI systems and the layers underneath them — from a convolution written in PyTorch
          down to the C that runs it and the memory it touches.
        </p>
        <div class="hero-meta">
          <span class="hl">SAHAND KHODAYI</span>
          <span class="sep">·</span>
          <span>AI / ML</span>
          <span class="sep">·</span>
          <span>mathematics</span>
          <span class="sep">·</span>
          <span>C / systems</span>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>direction</h2><span class="line"></span><span class="n">how the layers connect</span></div>
        <ol class="chain">
          <li><span class="t">mathematics</span><span class="d">linear algebra · calculus · probability · optimization</span></li>
          <li><span class="t">neural networks</span><span class="d">convolution · backpropagation · activations</span></li>
          <li><span class="t">pytorch implementation</span><span class="d">python · tensors · training loops</span></li>
          <li><span class="t">c inference</span><span class="d">pointers · memory layout · manual forward pass</span></li>
          <li><span class="t">system-level understanding</span><span class="d">what the abstraction was hiding</span></li>
        </ol>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>selected work</h2><span class="line"></span><span class="n">04 entries</span></div>
        ${PROJECTS.map(projectEntry).join("")}
        <div class="linkrow"><a class="btn" href="#/projects">all projects →</a></div>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>currently</h2><span class="line"></span><span class="n">honest status</span></div>
        <div class="grid-2">
          <div class="panel">
            <div class="panel-h">studying</div>
            <div class="panel-b">
              ${specList([
                ["mathematics","linear algebra · calculus · probability"],
                ["systems","C · memory · computer architecture"],
                ["networking","tcp/ip · sockets"]
              ])}
            </div>
          </div>
          <div class="panel">
            <div class="panel-h">building</div>
            <div class="panel-b">
              ${specList([
                ["number guesser","PyTorch ↔ C inference parity"],
                ["nn from scratch","backprop from scratch + visuals"],
                ["math network","Fourier features for function approximation"]
              ])}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>knowledge base</h2><span class="line"></span><span class="n">selected notes</span></div>
        <p class="lede dim mb">Technical notes maintained as an engineering reference — not a blog. Selected branches are published here.</p>
        <div class="tree">
          ${KNOWLEDGE.map(b=>`
            <details>
              <summary>${h(b.branch)}<span class="cnt">${b.leaves.length}</span></summary>
              <div class="leaves">
                ${b.leaves.map(l=>`<div class="leaf"><span>${h(l.name)}</span><span class="m">${h(l.meta)}</span></div>`).join("")}
              </div>
            </details>`).join("")}
        </div>
        <div class="linkrow"><a class="btn" href="#/knowledge">open knowledge →</a></div>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>recent experiments</h2><span class="line"></span><span class="n">lab log</span></div>
        ${EXPERIMENTS.slice(0,3).map(e=>`
          <div class="exp" style="border-top:1px solid var(--line)">
            <div style="display:grid;grid-template-columns:52px 1fr auto;gap:22px;padding:14px 0;align-items:baseline">
              <span class="exp-id">[${e.id}]</span>
              <span class="exp-title">${h(e.title)}</span>
              <span class="tag ${e.tag}">${h(e.status)}</span>
            </div>
          </div>`).join("")}
        <div class="linkrow"><a class="btn" href="#/lab">full lab log →</a></div>
      </div>
    </section>
  </div>`;
}

function Projects(){
  return `
  <div class="view">
    <section class="sec container">
      <div class="sec-h"><h2>projects</h2><span class="line"></span><span class="n">04 entries</span></div>
      <p class="lede dim mb">Things I have actually built and can explain from the top of the stack to the bottom.</p>
      ${PROJECTS.map(projectEntry).join("")}
    </section>
  </div>`;
}

function ProjectDetail(){
  const slug = currentPath().split("/")[2];
  const p = PROJECTS.find(x => x.slug === slug);
  if (!p) return NotFound();

  const relatedExps = EXPERIMENTS.filter(e => p.related.includes(e.id));

  return `
  <div class="view">
    <section class="sec container">
      <div class="kicker"><a href="#/projects" style="border:0">projects</a> / ${p.slug}</div>
      <h1 style="font-size:clamp(19px,3vw,26px);margin-top:16px">${h(p.title)}</h1>
      <p class="lede" style="margin-top:14px">${h(p.blurb)}</p>
      <div class="entry-tags" style="margin-top:18px">
        <span class="tag a">${h(p.status)}</span>
        ${p.tags.map(t=>`<span class="tag">${h(t)}</span>`).join("")}
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>specification</h2><span class="line"></span><span class="n">[${p.id}]</span></div>
        <div class="panel">
          <div class="panel-h">${p.slug} <span class="r">v1</span></div>
          <div class="panel-b">${specList(p.spec)}</div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>pipeline</h2><span class="line"></span><span class="n">flow</span></div>
        <ol class="chain">
          ${p.pipeline.map(([t,d])=>`<li><span class="t">${h(t)}</span><span class="d">${h(d)}</span></li>`).join("")}
        </ol>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>what it was testing</h2><span class="line"></span><span class="n">questions</span></div>
        <div class="panel">
          <div class="panel-b" style="padding:0">
            ${p.questions.map((q,i)=>`
              <div style="display:grid;grid-template-columns:44px 1fr;gap:0;padding:14px 16px;border-bottom:1px solid var(--line)">
                <span style="color:var(--fg-4);font-size:11px">Q${i+1}</span>
                <span style="color:var(--fg-2);font-size:12.5px">${h(q)}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>layers touched</h2><span class="line"></span><span class="n">the actual point</span></div>
        <div class="grid-2">
          <div class="panel">
            <div class="panel-h">above the abstraction</div>
            <div class="panel-b">${specList(p.spec.slice(0, Math.ceil(p.spec.length/2)))}</div>
          </div>
          <div class="panel">
            <div class="panel-h">below the abstraction</div>
            <div class="panel-b">${specList(p.spec.slice(Math.ceil(p.spec.length/2)))}</div>
          </div>
        </div>
      </div>
    </section>

    ${relatedExps.length ? `
    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>related</h2><span class="line"></span><span class="n">experiments</span></div>
        <div class="panel">
          <div class="panel-h">lab entries</div>
          <div class="panel-b">
            ${relatedExps.map(e=>`
              <div style="display:flex;gap:14px;align-items:baseline;padding:7px 0">
                <span style="color:var(--fg-4);font-size:11px">[${e.id}]</span>
                <a href="#/lab" style="border:0;color:var(--fg-2);font-size:12.5px">${h(e.title)}</a>
                <span class="tag ${e.tag}" style="margin-left:auto">${h(e.status)}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>
    </section>` : ""}

    <section class="sec">
      <div class="container">
        <div class="linkrow">
          <a class="btn solid" href="${p.spec.find(s=>s[0]==="source")?.[1] ? "https://"+p.spec.find(s=>s[0]==="source")[1] : "#"}" target="_blank" rel="noopener">source ↗</a>
          <a class="btn" href="#/knowledge">technical notes</a>
          <a class="btn" href="#/lab">experiments</a>
        </div>
      </div>
    </section>
  </div>`;
}

function Lab(){
  return `
  <div class="view">
    <section class="sec container">
      <div class="sec-h"><h2>lab</h2><span class="line"></span><span class="n">${EXPERIMENTS.length} entries</span></div>
      <p class="lede dim mb">
        Experiments rather than finished applications. Each entry is a question I wanted answered,
        the method, and what came out of it. Statuses are kept honest.
      </p>
      ${EXPERIMENTS.map(e=>`
        <details class="exp">
          <summary>
            <span class="exp-id">[${e.id}]</span>
            <span class="exp-title">${h(e.title)}</span>
            <span class="tag ${e.tag}">${h(e.status)}</span>
          </summary>
          <div class="exp-body">
            <p>${h(e.body)}</p>
            ${specList(e.spec)}
          </div>
        </details>`).join("")}
      <div class="linkrow">
        <a class="btn" href="#/projects/number-guesser">see it applied → number guesser</a>
      </div>
    </section>
  </div>`;
}

function Knowledge(){
  return `
  <div class="view">
    <section class="sec container">
      <div class="sec-h"><h2>knowledge</h2><span class="line"></span><span class="n">selected branches</span></div>
      <p class="lede dim mb">
        An engineering reference, not a blog. Notes are written for future me, and only the
        branches that connect to something I've built or am actively studying are published here.
      </p>
      <div class="tree">
        ${KNOWLEDGE.map(b=>`
          <details open>
            <summary>${h(b.branch)}<span class="cnt">${b.leaves.length} notes</span></summary>
            <div class="leaves">
              ${b.leaves.map(l=>`
                <div class="leaf">
                  <span>${h(l.name)}</span>
                  <span class="m">${h(l.meta)}</span>
                  <span class="st ${l.st}">${l.st === "built" ? "applied" : "studying"}</span>
                </div>`).join("")}
            </div>
          </details>`).join("")}
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>connections</h2><span class="line"></span><span class="n">notes are not a list</span></div>
        <p class="lede dim mb">A note only earns its place if it links to something built, or something being studied right now.</p>
        <div class="panel">
          <div class="panel-b" style="padding:0">
            ${CONNECTIONS.map(([a,b,c])=>`
              <div style="display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:10px;align-items:baseline;padding:12px 16px;border-bottom:1px solid var(--line);font-size:12.5px">
                <span style="color:var(--fg)">${h(a)}</span>
                <span style="color:var(--fg-4)">→</span>
                <span style="color:var(--fg-2)">${h(b)}</span>
                <span style="color:var(--fg-4)">→</span>
                <span style="color:var(--fg-4)">${h(c)}</span>
              </div>`).join("")}
          </div>
        </div>
        <div class="linkrow">
          <a class="btn" href="#/projects/number-guesser">number guesser →</a>
          <a class="btn" href="#/systems">systems →</a>
        </div>
      </div>
    </section>
  </div>`;
}

function Systems(){
  return `
  <div class="view">
    <section class="sec container">
      <div class="sec-h"><h2>systems</h2><span class="line"></span><span class="n">below the abstraction</span></div>
      <p class="lede dim mb">
        The layer I care most about. Everything above it is a convenience built on top of
        pointers, bytes, and time spent waiting on memory.
      </p>
      <div class="panel">
        <div class="panel-h">topics</div>
        <div class="panel-b">${specList(SYSTEMS_TOPICS)}</div>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>memory</h2><span class="line"></span><span class="n">interactive</span></div>
        <p class="lede dim mb">
          A 16-byte buffer on the stack. Click a cell to move the pointer and read what's there.
        </p>
        <div class="panel">
          <div class="panel-h">buffer <span class="r">uint8_t buf[16]</span></div>
          <div class="panel-b">
            <div class="memgrid" id="memgrid">
              ${MEM.bytes.map((b,i)=>`
                <div class="cell" data-i="${i}">
                  <span class="a">+${i.toString(16).padStart(2,"0")}</span>
                  ${b.toString(16).padStart(2,"0")}
                </div>`).join("")}
            </div>
            <div class="readout">
              <div><div class="k">pointer</div><div class="v acc" id="ptr-addr">—</div></div>
              <div><div class="k">*pointer</div><div class="v" id="ptr-val">—</div></div>
              <div><div class="k">offset</div><div class="v" id="ptr-off">—</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>address space</h2><span class="line"></span><span class="n">shape of a process</span></div>
        <div class="panel">
          <div class="panel-b">
<pre class="ascii"><span class="d">high addresses</span>
<span class="c">┌───────────────────────────┐</span>
<span class="c">│</span>  stack          <span class="d">↓ grows down</span>  <span class="c">│</span>   locals, return addresses
<span class="c">├───────────────────────────┤</span>
<span class="c">│</span>            <span class="d">↓</span>              <span class="c">│</span>
<span class="c">│</span>          <span class="d">unused</span>           <span class="c">│</span>
<span class="c">│</span>            <span class="d">↑</span>              <span class="c">│</span>
<span class="c">├───────────────────────────┤</span>
<span class="c">│</span>  heap           <span class="d">↑ grows up</span>    <span class="c">│</span>   malloc / new
<span class="c">├───────────────────────────┤</span>
<span class="c">│</span>  bss            <span class="d">zero-init</span>     <span class="c">│</span>
<span class="c">├───────────────────────────┤</span>
<span class="c">│</span>  data           <span class="d">initialized</span>   <span class="c">│</span>
<span class="c">├───────────────────────────┤</span>
<span class="c">│</span>  text           <span class="d">read-only</span>     <span class="c">│</span>   the program itself
<span class="c">└───────────────────────────┘</span>
<span class="d">low addresses</span></pre>
          </div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>coming later</h2><span class="line"></span><span class="n">planned, not promised</span></div>
        <div class="panel">
          <div class="panel-b">${specList([
            ["cache simulator","step through a blocked matmul and watch hit rate"],
            ["tensor visualiser","watch a 28×28 image become a feature map"],
            ["convolution stepper","kernel sliding over an input, one position at a time"],
            ["packet walk","what actually happens between two sockets"]
          ])}</div>
        </div>
      </div>
    </section>
  </div>`;
}

function About(){
  return `
  <div class="view">
    <section class="sec container">
      <div class="sec-h"><h2>about</h2><span class="line"></span><span class="n">short version</span></div>
      <p class="lede" style="max-width:66ch">
        I work at the intersection of machine learning and systems programming. I'm less
        interested in a model that works than in being able to explain every layer between
        the input and the output — including the ones a framework usually hides.
      </p>
      <p class="lede dim" style="max-width:66ch;margin-top:18px">
        That's why Number Guesser exists. Training a CNN in PyTorch is a few lines. Writing
        the forward pass in C, exporting the weights, and proving the two agree is the part
        that teaches something.
      </p>
    </section>

    <section class="sec">
      <div class="container">
        <div class="sec-h"><h2>status</h2><span class="line"></span><span class="n">no inflated claims</span></div>
        <div class="grid-2">
          <div class="panel">
            <div class="panel-h">built</div>
            <div class="panel-b">${specList([
              ["number guesser","CNN → C inference, verified"],
              ["nn from scratch","forward + backward + GUI visuals"],
              ["ml models","linear & logistic regression from scratch"],
              ["math network","MLP + Fourier features for function approximation"],
              ["tooling","linux · wsl · git"]
            ])}</div>
          </div>
          <div class="panel">
            <div class="panel-h">studying</div>
            <div class="panel-b">${specList([
              ["mathematics","linear algebra · calculus · probability"],
              ["systems","C · memory · computer architecture"],
              ["networking","tcp/ip · sockets"]
            ])}</div>
          </div>
        </div>
        <div class="grid-2" style="margin-top:18px">
          <div class="panel">
            <div class="panel-h">interested in</div>
            <div class="panel-b">${specList([
              ["ml systems","inference, quantization, deployment"],
              ["performance","cache behaviour, memory bandwidth"],
              ["low-level ml","kernels written by hand"]
            ])}</div>
          </div>
          <div class="panel">
            <div class="panel-h">contact</div>
            <div class="panel-b">${specList([
              ["github","github.com/sahandkhodayi"],
              ["email","your@email.com"],
              ["notes","published selectively on /knowledge"]
            ])}</div>
          </div>
        </div>
      </div>
    </section>
  </div>`;
}

function NotFound(){
  return `
  <div class="view">
    <section class="sec container">
      <div class="kicker">// 404</div>
      <h1 style="font-size:22px;margin-top:16px">no such page</h1>
      <p class="lede dim" style="margin-top:14px">That route doesn't exist. Try the index.</p>
      <div class="linkrow"><a class="btn solid" href="#/">← back to index</a></div>
    </section>
  </div>`;
}

/* ============================================================
   ROUTER
   ============================================================ */

const ROUTES = {
  "/": Home,
  "/projects": Projects,
  "/lab": Lab,
  "/knowledge": Knowledge,
  "/systems": Systems,
  "/about": About
};

const app = document.getElementById("app");

function currentPath(){
  let p = location.hash.replace(/^#/, "");
  if (!p || p === "/") return "/";
  return p.replace(/\/+$/, "") || "/";
}

function render(){
  const path = currentPath();
  let view;

  if (path.startsWith("/projects/") && path !== "/projects") {
    view = ProjectDetail;
  } else {
    view = ROUTES[path] || NotFound;
  }

  app.innerHTML = view();

  document.querySelectorAll(".nav a").forEach(a => {
    const target = a.getAttribute("href").replace(/^#/, "");
    const on = target === "/"
      ? path === "/"
      : path === target || path.startsWith(target + "/");
    a.classList.toggle("on", on);
  });

  window.scrollTo(0, 0);
  mount();
}

/* ============================================================
   MOUNT HOOKS
   ============================================================ */

function mount(){
  const grid = document.getElementById("memgrid");
  if (!grid) return;

  const cells = Array.from(grid.querySelectorAll(".cell"));
  const addrEl = document.getElementById("ptr-addr");
  const valEl  = document.getElementById("ptr-val");
  const offEl  = document.getElementById("ptr-off");
  let ptr = 0;

  function paint(){
    cells.forEach((c, i) => c.classList.toggle("ptr", i === ptr));
    addrEl.textContent = "0x" + (MEM.base + ptr).toString(16);
    valEl.textContent  = "0x" + MEM.bytes[ptr].toString(16).padStart(2, "0");
    offEl.textContent  = "+" + ptr;
  }

  cells.forEach((c, i) => {
    c.addEventListener("click", () => { ptr = i; paint(); });
  });

  paint();
}

window.addEventListener("hashchange", render);
render();
