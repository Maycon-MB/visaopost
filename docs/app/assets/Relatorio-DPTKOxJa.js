import{j as M,p as r,n as L}from"./index-a_FSGQ7i.js";import{d as o}from"./react-vendor-DV60vIGU.js";const z=["","Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];function C(){const t=new Date;return{year:t.getFullYear(),month:t.getMonth()+1}}function B(t,s){return s===1?{year:t-1,month:12}:{year:t,month:s-1}}function W(t,s){return s===12?{year:t+1,month:1}:{year:t,month:s+1}}function l({label:t,value:s,sub:d,accent:n}){return r.jsxs("div",{className:"rpt-stat",children:[r.jsx("div",{className:"rpt-stat-val",style:n?{color:"var(--primary)"}:{},children:s}),r.jsx("div",{className:"rpt-stat-lbl",children:t}),d&&r.jsx("div",{className:"rpt-stat-sub",children:d})]})}function b({dir:t}){return r.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:r.jsx("path",{d:t==="left"?"M15 18l-6-6 6-6":"M9 18l6-6-6-6"})})}function S(){const t=C(),[s,d]=o.useState(t.year),[n,x]=o.useState(t.month),[e,m]=o.useState(null),[h,g]=o.useState(!1),[u,v]=o.useState(!1),[j,f]=o.useState(null),k=o.useCallback(async(a,c)=>{g(!0),f(null),m(null);try{const p=await M(a,c);m(p)}catch(p){f(p.message||"Erro ao carregar relatório.")}finally{g(!1)}},[]);o.useEffect(()=>{k(s,n)},[s,n,k]);const y=()=>{const a=B(s,n);d(a.year),x(a.month)},w=()=>{const a=W(s,n);a.year>t.year||a.year===t.year&&a.month>t.month||(d(a.year),x(a.month))},N=s>t.year||s===t.year&&n>=t.month,_=async()=>{v(!0);try{const a=await L(s,n);m(a)}catch(a){alert(a.message||"Erro ao gerar insights.")}finally{v(!1)}};return r.jsxs("div",{className:"page-wrap enter",children:[r.jsx("style",{children:`
        /* ── header ── */
        .rpt-nav {
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; flex-wrap: wrap; margin-bottom: 1.75rem;
        }
        .rpt-month-ctrl {
          display: flex; align-items: center; gap: 0.5rem;
        }
        .rpt-arrow {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          background: var(--surface); border: 1px solid var(--hairline-strong);
          color: var(--ink-mute); cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .rpt-arrow:hover:not(:disabled) { background: var(--primary); color: #fff; border-color: var(--primary); }
        .rpt-arrow:disabled { opacity: 0.3; cursor: not-allowed; }
        .rpt-month-lbl {
          font-size: 18px; font-weight: 600; color: var(--ink);
          min-width: 160px; text-align: center;
        }

        /* ── grid ── */
        .rpt-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
        }
        @media (min-width: 700px) {
          .rpt-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .rpt-card {
          background: var(--surface); border: 1px solid var(--hairline);
          border-radius: var(--r-card); padding: 1.25rem 1rem;
        }
        .rpt-card-title {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--primary);
          margin-bottom: 1rem; display: flex; align-items: center; gap: 6px;
        }
        .rpt-card-wide { grid-column: 1 / -1; }

        /* ── stat ── */
        .rpt-stats { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .rpt-stat { flex: 1; min-width: 80px; }
        .rpt-stat-val { font-size: 28px; font-weight: 700; line-height: 1; color: var(--ink); }
        .rpt-stat-lbl { font-size: 12px; color: var(--ink-mute); margin-top: 3px; }
        .rpt-stat-sub { font-size: 11px; color: var(--ink-mute); opacity: 0.7; margin-top: 1px; }

        /* ── themes ── */
        .rpt-themes { display: flex; flex-direction: column; gap: 6px; }
        .rpt-theme-row { display: flex; align-items: center; gap: 8px; }
        .rpt-theme-bar-wrap {
          flex: 1; height: 6px; border-radius: 3px;
          background: var(--hairline);
        }
        .rpt-theme-bar {
          height: 100%; border-radius: 3px;
          background: var(--primary); transition: width 0.6s ease;
        }
        .rpt-theme-name { font-size: 12px; color: var(--ink-mute); min-width: 90px; }
        .rpt-theme-count { font-size: 12px; font-weight: 600; color: var(--ink); min-width: 16px; text-align: right; }

        /* ── approval ring ── */
        .rpt-approval { display: flex; align-items: center; gap: 1.25rem; }
        .rpt-ring { flex-shrink: 0; }
        .rpt-ring-bg  { stroke: var(--hairline); }
        .rpt-ring-fg  { stroke: var(--primary); stroke-linecap: round; transition: stroke-dashoffset 0.6s ease; }
        .rpt-ring-pct { font-size: 15px; font-weight: 700; fill: var(--ink); }
        .rpt-ring-lbl { font-size: 9px; fill: var(--ink-mute); }
        .rpt-aprov-stats { display: flex; flex-direction: column; gap: 6px; }
        .rpt-aprov-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-mute); }
        .rpt-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        /* ── insights ── */
        .rpt-insights-card {
          background: var(--surface); border: 1px solid var(--hairline);
          border-radius: var(--r-card); padding: 1.25rem;
          grid-column: 1 / -1;
        }
        .rpt-insights-text {
          font-size: 14px; line-height: 1.8; color: var(--ink-soft, var(--ink));
          white-space: pre-line; margin-top: 0.75rem;
        }
        .rpt-insights-btn {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 0.75rem; padding: 0.5rem 1rem;
          background: var(--ivory); border: 1px solid var(--hairline-strong);
          border-radius: 8px; font-family: inherit; font-size: 13px;
          color: var(--ink-mute); cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .rpt-insights-btn:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
        .rpt-insights-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .rpt-spinner {
          width: 13px; height: 13px; border: 2px solid currentColor;
          border-top-color: transparent; border-radius: 50%;
          animation: rpt-spin 0.7s linear infinite;
        }
        @keyframes rpt-spin { to { transform: rotate(360deg); } }

        /* ── states ── */
        .rpt-loading { padding: 4rem; text-align: center; color: var(--ink-mute); font-style: italic; font-size: 14px; }
        .rpt-error   { padding: 3rem; text-align: center; color: var(--danger); font-size: 14px; }
        .rpt-empty   { font-size: 13px; color: var(--ink-mute); font-style: italic; }
      `}),r.jsxs("div",{className:"rpt-nav",children:[r.jsx("h1",{className:"page-title",style:{margin:0},children:"Relatório Mensal"}),r.jsxs("div",{className:"rpt-month-ctrl",children:[r.jsx("button",{className:"rpt-arrow",onClick:y,disabled:h,title:"Mês anterior",children:r.jsx(b,{dir:"left"})}),r.jsxs("span",{className:"rpt-month-lbl",children:[z[n]," ",s]}),r.jsx("button",{className:"rpt-arrow",onClick:w,disabled:h||N,title:"Próximo mês",children:r.jsx(b,{dir:"right"})})]})]}),h&&r.jsx("div",{className:"rpt-loading",children:"Carregando dados do mês…"}),j&&r.jsx("div",{className:"rpt-error",children:j}),e&&!h&&(()=>{const a=e.top_themes[0]?.count||1,c=2*Math.PI*26,p=c-e.posts_approval_rate/100*c;return r.jsxs("div",{className:"rpt-grid",children:[r.jsxs("div",{className:"rpt-card",children:[r.jsxs("div",{className:"rpt-card-title",children:[r.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:[r.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),r.jsx("path",{d:"M9 3v18M15 9H3M15 15H3"})]}),"Conteúdo"]}),r.jsxs("div",{className:"rpt-stats",children:[r.jsx(l,{label:"publicados",value:e.posts_published,accent:!0}),r.jsx(l,{label:"no período",value:e.posts_total_month})]})]}),r.jsxs("div",{className:"rpt-card",children:[r.jsxs("div",{className:"rpt-card-title",children:[r.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:[r.jsx("path",{d:"M9 11l3 3 8-8"}),r.jsx("path",{d:"M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"})]}),"Aprovação"]}),r.jsxs("div",{className:"rpt-approval",children:[r.jsxs("svg",{className:"rpt-ring",width:"64",height:"64",viewBox:"0 0 64 64",children:[r.jsx("circle",{className:"rpt-ring-bg",cx:"32",cy:"32",r:"26",fill:"none",strokeWidth:"5"}),r.jsx("circle",{className:"rpt-ring-fg",cx:"32",cy:"32",r:"26",fill:"none",strokeWidth:"5",strokeDasharray:c,strokeDashoffset:p,transform:"rotate(-90 32 32)"}),r.jsxs("text",{className:"rpt-ring-pct",x:"32",y:"36",textAnchor:"middle",children:[e.posts_approval_rate,"%"]})]}),r.jsxs("div",{className:"rpt-aprov-stats",children:[r.jsxs("div",{className:"rpt-aprov-row",children:[r.jsx("span",{className:"rpt-dot",style:{background:"var(--primary)"}}),e.posts_published," aprovados"]}),r.jsxs("div",{className:"rpt-aprov-row",children:[r.jsx("span",{className:"rpt-dot",style:{background:"var(--danger)"}}),e.posts_total_month-e.posts_published," outros"]})]})]})]}),r.jsxs("div",{className:"rpt-card",children:[r.jsxs("div",{className:"rpt-card-title",children:[r.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:[r.jsx("path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),r.jsx("circle",{cx:"9",cy:"7",r:"4"}),r.jsx("path",{d:"M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"})]}),"Clientes"]}),r.jsxs("div",{className:"rpt-stats",children:[r.jsx(l,{label:"base ativa",value:e.clients_total_active}),r.jsx(l,{label:"novos no mês",value:e.clients_new_month,accent:!0})]})]}),r.jsxs("div",{className:"rpt-card",children:[r.jsxs("div",{className:"rpt-card-title",children:[r.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:r.jsx("path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82A16 16 0 0 0 16 16.73l.99-.99a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"})}),"Recall"]}),r.jsxs("div",{className:"rpt-stats",children:[r.jsx(l,{label:"contactados",value:e.clients_contacted_month,accent:!0}),r.jsx(l,{label:"via QR balcão",value:e.clients_from_qr_month})]})]}),r.jsxs("div",{className:"rpt-card",children:[r.jsxs("div",{className:"rpt-card-title",children:[r.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:[r.jsx("rect",{x:"2",y:"2",width:"20",height:"20",rx:"5"}),r.jsx("path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"}),r.jsx("line",{x1:"17.5",y1:"6.5",x2:"17.51",y2:"6.5"})]}),"Instagram"]}),r.jsxs("div",{className:"rpt-stats",children:[r.jsx(l,{label:"alcance total",value:e.reach_total,accent:!0}),r.jsx(l,{label:"engajamento médio",value:e.engagement_avg})]})]}),e.top_posts_by_reach.length>0&&r.jsxs("div",{className:"rpt-card rpt-card-wide",children:[r.jsxs("div",{className:"rpt-card-title",children:[r.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:r.jsx("polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"})}),"Top posts por alcance"]}),r.jsx("div",{className:"rpt-themes",children:e.top_posts_by_reach.map(i=>r.jsxs("div",{className:"rpt-theme-row",children:[r.jsx("span",{className:"rpt-theme-name",style:{minWidth:160,flex:1},title:i.caption_preview,children:i.caption_preview||i.theme?.replace(/_/g," ")||"sem legenda"}),r.jsxs("span",{className:"rpt-theme-count",children:[i.reach," alcance · ",i.likes," likes · ",i.saves," salvos"]})]},i.post_id))})]}),e.top_themes.length>0&&r.jsxs("div",{className:"rpt-card rpt-card-wide",children:[r.jsxs("div",{className:"rpt-card-title",children:[r.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:[r.jsx("path",{d:"M12 20h9"}),r.jsx("path",{d:"M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"})]}),"Temas mais publicados"]}),r.jsx("div",{className:"rpt-themes",children:e.top_themes.map(i=>r.jsxs("div",{className:"rpt-theme-row",children:[r.jsx("span",{className:"rpt-theme-name",children:i.theme.replace(/_/g," ")}),r.jsx("div",{className:"rpt-theme-bar-wrap",children:r.jsx("div",{className:"rpt-theme-bar",style:{width:`${i.count/a*100}%`}})}),r.jsx("span",{className:"rpt-theme-count",children:i.count})]},i.theme))})]}),r.jsxs("div",{className:"rpt-insights-card",children:[r.jsxs("div",{className:"rpt-card-title",style:{marginBottom:0},children:[r.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:[r.jsx("circle",{cx:"12",cy:"12",r:"10"}),r.jsx("path",{d:"M12 16v-4M12 8h.01"})]}),"Insights do mês"]}),e.insights?r.jsx("p",{className:"rpt-insights-text",children:e.insights}):r.jsx("p",{className:"rpt-empty",style:{marginTop:"0.75rem"},children:'Clique em "Gerar insights" para análise automática.'}),r.jsx("button",{className:"rpt-insights-btn",onClick:_,disabled:u,children:u?r.jsxs(r.Fragment,{children:[r.jsx("div",{className:"rpt-spinner"})," Gerando…"]}):r.jsxs(r.Fragment,{children:[r.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:r.jsx("path",{d:"M13 2L3 14h9l-1 8 10-12h-9l1-8z"})}),e.insights?"Atualizar insights":"Gerar insights"]})})]})]})})()]})}export{S as default};
