/* LARPSOCIETY UI polish */
(function(){
  const style = document.createElement('style');
  style.textContent = `
    #app a, #nav a, footer a { text-decoration:none !important; }
    #app a:hover, #nav a:hover, footer a:hover { text-decoration:none !important; }
    .back-link{
      display:inline-block;margin-bottom:14px;
      color:var(--fg3);font-size:11px;letter-spacing:.05em;
    }
    .back-link:hover{ color:var(--accent); }
    .project-media{ margin:34px 0 10px; border-top:1px solid var(--line); padding-top:26px; }
    .project-media h3{
      font-size:10px;color:var(--accent);
      letter-spacing:.18em;text-transform:uppercase;
      margin:0 0 16px;font-weight:normal;
    }
    .media-grid{
      display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
      gap:12px;margin-bottom:20px;
    }
    @media(max-width:640px){ .media-grid{ grid-template-columns:minmax(0,1fr); } }
    .media-item{
      margin:0;border:1px solid var(--line2);
      background:var(--bg2);padding:0;
      display:flex;flex-direction:column;
      overflow:hidden;
    }
    .media-item img, .media-item video{
      display:block;width:100%;height:auto;max-height:340px;
      object-fit:cover;background:#000;
    }
    .media-item figcaption{
      padding:8px 12px;font-size:11px;color:var(--fg3);
      border-top:1px solid var(--line2);
    }
    .experiment-row{
      display:flex;flex-direction:column;gap:4px;
      padding:11px 0;border-top:1px dashed var(--line);
      font-size:12px;
    }
    .experiment-row b{ color:var(--fg2); font-weight:normal; }
    .experiment-row span{ color:var(--fg4); }
  `;
  document.head.appendChild(style);
})();