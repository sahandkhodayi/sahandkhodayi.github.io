/* LARPSOCIETY UI polish + interactive user lab
   Loaded after app.js so the existing site stays intact. */
(function(){
  const style = document.createElement('style');
  style.textContent = `
    #app a, #nav a, footer a, .user-lab a { text-decoration:none !important; }
    #app a:hover, #nav a:hover, footer a:hover, .user-lab a:hover { text-decoration:none !important; }
    .user-lab{margin:0 0 70px;border:1px solid var(--line2);background:rgba(16,8,3,.62);padding:22px;box-shadow:inset 0 0 35px rgba(255,140,0,.035)}
    .user-lab-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:18px}
    .user-lab h2{margin:5px 0 8px;color:var(--bright);font-size:24px;font-weight:normal;text-shadow:var(--glow)}
    .user-lab p{margin:0;color:var(--fg3);font-size:12px;max-width:720px}
    .lab-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .lab-card{border:1px solid var(--line);background:#0d0703;padding:16px;min-height:230px}
    .lab-card h3{margin:0 0 7px;color:var(--fg2);font-weight:normal;font-size:15px}
    .lab-card p{font-size:11px;line-height:1.7;margin-bottom:14px}
    .lab-control{display:flex;align-items:center;gap:10px;margin:9px 0;color:var(--fg3);font-size:10px}
    .lab-control input[type=range]{width:100%;accent-color:var(--accent)}
    .lab-control input[type=number]{width:70px;background:#080402;border:1px solid var(--line2);color:var(--bright);font:11px var(--mono);padding:6px}
    .lab-value{color:var(--accent2);min-width:44px;text-align:right}
    .lab-output{border-top:1px dashed var(--line);margin-top:13px;padding-top:12px;color:var(--bright);font-size:12px;min-height:32px}
    .lab-btn{font:inherit;color:var(--accent2);background:var(--accentbg);border:1px solid var(--line2);padding:6px 9px;cursor:pointer}
    .lab-btn:hover{border-color:var(--accent);color:var(--bright)}
    .lab-bar{height:9px;border:1px solid var(--line);background:#070402;margin-top:10px;overflow:hidden}
    .lab-bar i{display:block;height:100%;width:0;background:var(--accent);box-shadow:0 0 10px rgba(255,140,0,.5);transition:width .12s}
    .lab-matrix{display:grid;grid-template-columns:repeat(2,28px);gap:4px;margin:10px 0}
    .lab-matrix input{width:28px;height:28px;padding:0;text-align:center;background:#080402;border:1px solid var(--line2);color:var(--bright);font:11px var(--mono)}
    @media(max-width:900px){.lab-grid{grid-template-columns:1fr 1fr}.user-lab-head{flex-direction:column}}
    @media(max-width:620px){.lab-grid{grid-template-columns:1fr}.user-lab{padding:16px}}
  `;
  document.head.appendChild(style);

  function textPolish(root){
    if(!root) return;
    root.querySelectorAll('a,button').forEach(el=>{
      el.style.textDecoration='none';
      if(el.children.length===0 && /lab_[a-z_]+/i.test(el.textContent)) el.textContent=el.textContent.replace(/_/g,' ');
    });
  }

  function fixJoinLinks(root){
    if(!root) return;
    root.querySelectorAll('a[href*="/issues/new"]').forEach(a=>{
      if(a.textContent.toLowerCase().includes('join') || a.href.includes('JOIN')){
        a.href='https://github.com/sahandkhodayi/sahandkhodayi.github.io/issues/new?template=join.yml';
      }
    });
  }

  function activationCard(){
    const wrap=document.createElement('article'); wrap.className='lab-card';
    wrap.innerHTML=`<h3>activation explorer</h3><p>Move x and see what a neuron gets after the activation function.</p>
      <div class="lab-control"><select id="ufn" class="lab-btn"><option value="relu">ReLU</option><option value="sigmoid">sigmoid</option><option value="tanh">tanh</option></select><input id="ux" type="range" min="-6" max="6" step="0.1" value="1"><span id="uxv" class="lab-value">1.0</span></div><div id="uout" class="lab-output"></div>`;
    const x=wrap.querySelector('#ux'), fn=wrap.querySelector('#ufn'), out=wrap.querySelector('#uout'), xv=wrap.querySelector('#uxv');
    const draw=()=>{const n=+x.value;let y=fn.value==='relu'?Math.max(0,n):fn.value==='sigmoid'?1/(1+Math.exp(-n)):Math.tanh(n);xv.textContent=n.toFixed(1);out.textContent=`f(${n.toFixed(1)}) = ${y.toFixed(4)}`};
    x.oninput=draw;fn.onchange=draw;draw();return wrap;
  }

  function descentCard(){
    const wrap=document.createElement('article');wrap.className='lab-card';
    wrap.innerHTML=`<h3>gradient descent</h3><p>Find the minimum of a simple quadratic. Change the learning rate and run the optimizer.</p><div class="lab-control"><span>η</span><input id="dlr" type="range" min="0.01" max="0.45" step="0.01" value="0.12"><span id="dlrv" class="lab-value">0.12</span></div><button id="drun" class="lab-btn">run 30 steps</button><div class="lab-output" id="dout">x = 4.00 · loss = 16.00</div><div class="lab-bar"><i id="dbar"></i></div>`;
    const lr=wrap.querySelector('#dlr'),lrv=wrap.querySelector('#dlrv'),run=wrap.querySelector('#drun'),out=wrap.querySelector('#dout'),bar=wrap.querySelector('#dbar');
    lr.oninput=()=>lrv.textContent=(+lr.value).toFixed(2);
    run.onclick=()=>{let x=4,eta=+lr.value;for(let i=0;i<30;i++)x-=eta*2*x;const loss=x*x;out.textContent=`x = ${x.toFixed(4)} · loss = ${loss.toFixed(6)}`;bar.style.width=Math.max(0,Math.min(100,100*(1-Math.min(1,loss/16))))+'%'};return wrap;
  }

  function matrixCard(){
    const wrap=document.createElement('article');wrap.className='lab-card';
    wrap.innerHTML=`<h3>matrix multiplication</h3><p>Change the inputs and watch a 2×2 matrix multiply a vector.</p><div class="lab-matrix">${[2,1,1,3].map((v,i)=>`<input data-m="${i}" value="${v}">`).join('')}</div><div class="lab-control"><span>x</span><input id="mx1" type="number" value="2" step="1"><input id="mx2" type="number" value="1" step="1"></div><div id="mout" class="lab-output"></div>`;
    const inputs=[...wrap.querySelectorAll('[data-m]')],x1=wrap.querySelector('#mx1'),x2=wrap.querySelector('#mx2'),out=wrap.querySelector('#mout');
    const draw=()=>{const a=inputs.map(i=>+i.value||0),x=+x1.value||0,y=+x2.value||0;out.textContent=`[ ${a[0]}·${x} + ${a[1]}·${y}, ${a[2]}·${x} + ${a[3]}·${y} ] = [ ${(a[0]*x+a[1]*y).toFixed(2)}, ${(a[2]*x+a[3]*y).toFixed(2)} ]`};
    [...inputs,x1,x2].forEach(i=>i.oninput=draw);draw();return wrap;
  }

  function mountLab(){
    const app=document.getElementById('app');
    if(!app || !location.hash.match(/^#\/?lab(?:\/|$)/) || app.querySelector('.user-lab'))return;
    const section=document.createElement('section');section.className='user-lab';
    section.innerHTML=`<div class="user-lab-head"><div><div class="eyebrow">:: user playground</div><h2>LAB / play with the idea</h2><p>Small experiments you can touch instead of just reading about. The long-term goal is to turn every serious project into something visitors can inspect, manipulate, and learn from.</p></div><span class="state ok">interactive</span></div><div class="lab-grid"></div>`;
    const grid=section.querySelector('.lab-grid');grid.append(descentCard(),activationCard(),matrixCard());app.prepend(section);textPolish(section);
  }

  function refresh(){textPolish(document);fixJoinLinks(document);mountLab();}
  new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(refresh,0));
  setTimeout(refresh,80);
})();
