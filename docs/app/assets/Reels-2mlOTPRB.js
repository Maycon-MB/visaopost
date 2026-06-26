import{p as S,j as T,e as M,m as e}from"./index-AUkDr-Fx.js";import{d as s}from"./react-vendor-DV60vIGU.js";const v={autoridade:"Autoridade",educativo:"Educativo",promo:"Promoção"},_={autoridade:"Especialista, técnico, confiante",educativo:'3 dicas, "você sabia", informativo',promo:"Destaque de produto ou serviço"},w={15:"15 s",30:"30 s",60:"60 s"};function p({d:a,size:i=16}){return e.jsx("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:e.jsx("path",{d:a})})}function n({text:a,label:i="Copiar"}){const[o,c]=s.useState(!1),d=s.useCallback(()=>{navigator.clipboard.writeText(a).then(()=>{c(!0),setTimeout(()=>c(!1),2e3)})},[a]);return e.jsx("button",{className:"reel-copy-btn",onClick:d,title:"Copiar para área de transferência",children:o?e.jsxs(e.Fragment,{children:[e.jsx(p,{d:"M20 6L9 17l-5-5",size:14})," Copiado!"]}):e.jsxs(e.Fragment,{children:[e.jsx(p,{d:"M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z",size:14})," ",i]})})}function A({script:a,onDelete:i}){const[o,c]=s.useState(!1),d=new Date(a.created_at).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"});return e.jsxs("div",{className:"reel-history-card",children:[e.jsxs("div",{className:"rhc-head",onClick:()=>c(t=>!t),children:[e.jsx("span",{className:"reel-tom-pill","data-tom":a.tom,children:v[a.tom]}),e.jsx("span",{className:"rhc-dur",children:w[a.duracao_s]||`${a.duracao_s}s`}),e.jsx("span",{className:"rhc-tema",children:a.tema}),e.jsx("span",{className:"rhc-date",children:d}),e.jsx("button",{className:"rhc-expand","aria-label":o?"Recolher":"Expandir",children:e.jsx(p,{d:o?"M18 15l-6-6-6 6":"M6 9l6 6 6-6",size:14})})]}),o&&e.jsxs("div",{className:"rhc-body",children:[e.jsxs("div",{className:"reel-field-sm",children:[e.jsx("span",{className:"reel-field-lbl",children:"Hook"}),e.jsx("p",{className:"reel-field-val",children:a.hook}),e.jsx(n,{text:a.hook,label:"Copiar hook"})]}),e.jsxs("div",{className:"reel-field-sm",children:[e.jsx("span",{className:"reel-field-lbl",children:"Roteiro"}),e.jsx("pre",{className:"reel-roteiro-pre",children:a.roteiro}),e.jsx(n,{text:a.roteiro,label:"Copiar roteiro"})]}),e.jsxs("div",{className:"reel-field-sm",children:[e.jsx("span",{className:"reel-field-lbl",children:"Legenda"}),e.jsx("p",{className:"reel-field-val",children:a.legenda}),e.jsx(n,{text:a.legenda,label:"Copiar legenda"})]}),e.jsxs("div",{className:"reel-field-sm",children:[e.jsx("span",{className:"reel-field-lbl",children:"Hashtags"}),e.jsx("div",{className:"reel-hash-pills",children:a.hashtags.map(t=>e.jsxs("span",{className:"reel-hash-pill",children:["#",t]},t))}),e.jsx(n,{text:a.hashtags.map(t=>`#${t}`).join(" "),label:"Copiar hashtags"})]}),e.jsxs("div",{className:"reel-field-row",children:[e.jsxs("div",{className:"reel-field-sm",children:[e.jsx("span",{className:"reel-field-lbl",children:"CTA verbal"}),e.jsx("p",{className:"reel-field-val",children:a.cta_verbal})]}),e.jsxs("div",{className:"reel-field-sm",children:[e.jsx("span",{className:"reel-field-lbl",children:"CTA legenda"}),e.jsx("p",{className:"reel-field-val",children:a.cta_legenda})]})]}),e.jsx("div",{className:"rhc-actions",children:e.jsxs("button",{className:"btn-touch reel-del-btn",onClick:()=>i(a.id),title:"Excluir roteiro",children:[e.jsx(p,{d:"M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",size:14})," Excluir"]})})]})]})}function V(){const[a,i]=s.useState(""),[o,c]=s.useState(""),[d,t]=s.useState(30),[x,z]=s.useState("autoridade"),[b,j]=s.useState(!1),[y,N]=s.useState(null),[l,h]=s.useState(null),[u,f]=s.useState([]),[C,L]=s.useState(!0),k=s.useRef(null);s.useEffect(()=>{S().then(f).catch(()=>{}).finally(()=>L(!1))},[]);const E=s.useCallback(async r=>{if(r.preventDefault(),!!a.trim()){j(!0),N(null),h(null);try{const m=await T({tema:a.trim(),produto:o.trim()||null,duracao_s:d,tom:x});h(m),f(g=>[m,...g]),setTimeout(()=>k.current?.scrollIntoView({behavior:"smooth",block:"start"}),80)}catch(m){N(m.message||"Erro ao gerar roteiro.")}finally{j(!1)}}},[a,o,d,x]),R=s.useCallback(async r=>{if(confirm("Excluir este roteiro?"))try{await M(r),f(m=>m.filter(g=>g.id!==r)),l?.id===r&&h(null)}catch{}},[l]);return e.jsxs("div",{className:"page-wrap enter",children:[e.jsx("style",{children:`
        /* ─── page layout ─── */
        .reels-layout { display: flex; flex-direction: column; gap: 1.5rem; }
        @media (min-width: 900px) {
          .reels-layout { flex-direction: row; align-items: flex-start; }
          .reels-form-col { flex: 0 0 340px; position: sticky; top: 80px; }
          .reels-result-col { flex: 1; min-width: 0; }
        }

        /* ─── form card ─── */
        .reels-form-card {
          background: var(--surface);
          border: 1px solid var(--hairline);
          border-radius: var(--r-card);
          padding: 1.5rem;
        }
        .reels-form-title {
          font-size: 15px; font-weight: 600;
          color: var(--ink); margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 8px;
        }
        .reels-form-title svg { color: var(--primary); }

        .reel-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 1rem; }
        .reel-label { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-mute); }
        .reel-input {
          border: 1px solid var(--hairline-strong);
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          font-family: inherit; font-size: 14px;
          background: var(--ivory); color: var(--ink);
          transition: border-color 0.15s;
          width: 100%;
        }
        .reel-input:focus { outline: none; border-color: var(--primary); }
        .reel-input::placeholder { color: var(--ink-mute); opacity: 0.55; }

        /* tom selector */
        .reel-tom-grid { display: flex; flex-direction: column; gap: 6px; }
        .reel-tom-opt {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 0.6rem 0.75rem; border-radius: 8px; cursor: pointer;
          border: 1.5px solid var(--hairline-strong);
          background: var(--ivory); transition: border-color 0.15s, background 0.15s;
        }
        .reel-tom-opt.selected { border-color: var(--primary); background: rgba(193,117,11,0.06); }
        .reel-tom-opt input[type=radio] { display: none; }
        .reel-tom-info { flex: 1; }
        .reel-tom-name { font-size: 13px; font-weight: 600; color: var(--ink); }
        .reel-tom-sub  { font-size: 11px; color: var(--ink-mute); margin-top: 1px; }

        /* dur tabs */
        .reel-dur-tabs { display: flex; gap: 6px; }
        .reel-dur-tab {
          flex: 1; padding: 0.45rem 0; text-align: center;
          border: 1.5px solid var(--hairline-strong);
          border-radius: 8px; font-size: 13px; font-weight: 500;
          background: var(--ivory); color: var(--ink-mute); cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          font-family: inherit;
        }
        .reel-dur-tab.active { border-color: var(--primary); color: var(--primary); background: rgba(193,117,11,0.06); font-weight: 700; }

        .reel-gen-btn {
          width: 100%; margin-top: 0.25rem;
          padding: 0.8rem;
          background: var(--primary); color: #fff;
          border: none; border-radius: 10px;
          font-family: inherit; font-size: 14px; font-weight: 600;
          letter-spacing: 0.04em; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, transform 0.1s;
        }
        .reel-gen-btn:hover { background: var(--ochre-deep, #9A5C08); }
        .reel-gen-btn:active { transform: scale(0.98); }
        .reel-gen-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .reel-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .reel-form-error { margin-top: 0.75rem; font-size: 13px; color: var(--danger); text-align: center; }

        /* ─── result card ─── */
        .reels-result-card {
          background: var(--surface);
          border: 1px solid var(--primary);
          border-radius: var(--r-card);
          padding: 1.5rem;
          animation: fadeSlideUp 0.4s ease;
        }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .reel-result-head {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 1.25rem; flex-wrap: wrap;
        }
        .reel-result-title { font-size: 15px; font-weight: 700; color: var(--ink); flex: 1; min-width: 0; }
        .reel-result-meta { font-size: 12px; color: var(--ink-mute); }

        .reel-section {
          border-top: 1px solid var(--hairline);
          padding-top: 1rem; margin-top: 1rem;
        }
        .reel-section-lbl {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--primary); margin-bottom: 0.5rem;
        }
        .reel-hook-text {
          font-size: 17px; font-weight: 500; font-style: italic;
          line-height: 1.5; color: var(--ink);
        }
        .reel-roteiro-pre {
          font-family: inherit; font-size: 14px; line-height: 1.8;
          white-space: pre-wrap; color: var(--ink-soft, var(--ink));
          max-height: 260px; overflow-y: auto;
          background: var(--ivory); border-radius: 8px;
          padding: 0.75rem 1rem; margin-bottom: 0.5rem;
        }
        .reel-legenda-text {
          font-size: 14px; line-height: 1.7; color: var(--ink-soft, var(--ink));
          white-space: pre-wrap; margin-bottom: 0.5rem;
        }
        .reel-hash-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 0.5rem; }
        .reel-hash-pill {
          font-size: 11px; font-weight: 500; padding: 3px 8px;
          border-radius: 50px; background: var(--ivory-soft, var(--ivory));
          border: 1px solid var(--hairline-strong); color: var(--ink-mute);
        }
        .reel-cta-row { display: flex; gap: 1rem; flex-wrap: wrap; }
        .reel-cta-box {
          flex: 1; min-width: 200px; padding: 0.75rem 1rem;
          background: var(--ivory); border-radius: 8px;
          border: 1px solid var(--hairline);
        }
        .reel-cta-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-mute); margin-bottom: 3px; }
        .reel-cta-val { font-size: 13px; color: var(--ink); font-style: italic; }

        /* ─── copy btn ─── */
        .reel-copy-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: inherit; font-size: 12px; font-weight: 500;
          padding: 0.3rem 0.75rem; border-radius: 6px;
          background: var(--ivory); border: 1px solid var(--hairline-strong);
          color: var(--ink-mute); cursor: pointer; transition: background 0.15s, color 0.15s;
        }
        .reel-copy-btn:hover { background: var(--primary); color: #fff; border-color: var(--primary); }

        /* ─── empty result ─── */
        .reels-empty {
          background: var(--surface); border: 1px dashed var(--hairline-strong);
          border-radius: var(--r-card); padding: 3rem 1.5rem;
          text-align: center; color: var(--ink-mute);
        }
        .reels-empty-icon { opacity: 0.2; margin-bottom: 1rem; color: var(--primary); }
        .reels-empty-title { font-size: 15px; font-weight: 500; font-style: italic; color: var(--ink-mute); }
        .reels-empty-sub { font-size: 13px; margin-top: 4px; }

        /* ─── history ─── */
        .reel-history-section { margin-top: 2rem; }
        .reel-history-title {
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--ink-mute); margin-bottom: 0.75rem;
        }
        .reel-history-list { display: flex; flex-direction: column; gap: 6px; }
        .reel-history-card {
          background: var(--surface); border: 1px solid var(--hairline);
          border-radius: 10px; overflow: hidden; transition: border-color 0.15s;
        }
        .reel-history-card:hover { border-color: var(--hairline-strong); }
        .rhc-head {
          display: flex; align-items: center; gap: 8px; padding: 0.7rem 1rem;
          cursor: pointer; flex-wrap: wrap;
        }
        .reel-tom-pill {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; padding: 2px 7px; border-radius: 4px; flex-shrink: 0;
        }
        .reel-tom-pill[data-tom="autoridade"] { background: rgba(193,117,11,0.12); color: var(--primary); }
        .reel-tom-pill[data-tom="educativo"]  { background: rgba(99,132,117,0.12);  color: var(--sage, #638475); }
        .reel-tom-pill[data-tom="promo"]      { background: rgba(148,28,47,0.1);    color: var(--burgundy, #941C2F); }
        .rhc-dur  { font-size: 11px; color: var(--ink-mute); flex-shrink: 0; }
        .rhc-tema { flex: 1; font-size: 13px; font-weight: 500; color: var(--ink); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rhc-date { font-size: 11px; color: var(--ink-mute); flex-shrink: 0; }
        .rhc-expand { background: none; border: none; cursor: pointer; color: var(--ink-mute); padding: 0; display: flex; }

        .rhc-body { padding: 0 1rem 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .reel-field-sm { display: flex; flex-direction: column; gap: 4px; }
        .reel-field-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-mute); }
        .reel-field-val { font-size: 13px; color: var(--ink); line-height: 1.5; }
        .reel-field-row { display: flex; gap: 1rem; flex-wrap: wrap; }
        .reel-field-row > * { flex: 1; min-width: 150px; }
        .rhc-actions { display: flex; justify-content: flex-end; padding-top: 0.25rem; }
        .reel-del-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; padding: 0.3rem 0.75rem; border-radius: 6px;
          background: none; border: 1px solid var(--hairline-strong); color: var(--ink-mute);
          cursor: pointer; font-family: inherit; transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .reel-del-btn:hover { background: rgba(148,28,47,0.08); color: var(--danger); border-color: var(--danger); }
      `}),e.jsxs("div",{className:"page-header",children:[e.jsx("h1",{className:"page-title",children:"Reels de Autoridade"}),e.jsx("p",{className:"page-subtitle",children:"Gere roteiros prontos para gravar. Autoridade, educativo ou promoção."})]}),e.jsxs("div",{className:"reels-layout",children:[e.jsx("div",{className:"reels-form-col",children:e.jsxs("div",{className:"reels-form-card",children:[e.jsxs("div",{className:"reels-form-title",children:[e.jsx(p,{d:"M15 10l4.553-2.069A1 1 0 0 1 21 8.869V15.13a1 1 0 0 1-1.447.9L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z",size:16}),"Novo roteiro"]}),e.jsxs("form",{onSubmit:E,noValidate:!0,children:[e.jsxs("div",{className:"reel-field",children:[e.jsx("label",{className:"reel-label",htmlFor:"reel-tema",children:"Tema do Reel *"}),e.jsx("input",{id:"reel-tema",className:"reel-input",value:a,onChange:r=>i(r.target.value),placeholder:'Ex: "Como escolher lente progressiva"',maxLength:200,required:!0})]}),e.jsxs("div",{className:"reel-field",children:[e.jsxs("label",{className:"reel-label",htmlFor:"reel-produto",children:["Produto em destaque ",e.jsx("span",{style:{opacity:.55,fontWeight:400},children:"(opcional)"})]}),e.jsx("input",{id:"reel-produto",className:"reel-input",value:o,onChange:r=>c(r.target.value),placeholder:'Ex: "Lente Transitions", "Armação Ray-Ban"',maxLength:200})]}),e.jsxs("div",{className:"reel-field",children:[e.jsx("span",{className:"reel-label",children:"Duração"}),e.jsx("div",{className:"reel-dur-tabs",children:[15,30,60].map(r=>e.jsxs("button",{type:"button",className:`reel-dur-tab ${d===r?"active":""}`,onClick:()=>t(r),children:[r,"s"]},r))})]}),e.jsxs("div",{className:"reel-field",children:[e.jsx("span",{className:"reel-label",children:"Tom"}),e.jsx("div",{className:"reel-tom-grid",children:["autoridade","educativo","promo"].map(r=>e.jsxs("label",{className:`reel-tom-opt ${x===r?"selected":""}`,children:[e.jsx("input",{type:"radio",name:"tom",value:r,checked:x===r,onChange:()=>z(r)}),e.jsxs("div",{className:"reel-tom-info",children:[e.jsx("div",{className:"reel-tom-name",children:v[r]}),e.jsx("div",{className:"reel-tom-sub",children:_[r]})]})]},r))})]}),e.jsx("button",{className:"reel-gen-btn",disabled:b||!a.trim(),type:"submit",children:b?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"reel-spinner"})," Gerando…"]}):e.jsxs(e.Fragment,{children:[e.jsx(p,{d:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",size:16})," Gerar Roteiro"]})}),y&&e.jsx("p",{className:"reel-form-error",children:y})]})]})}),e.jsxs("div",{className:"reels-result-col",children:[l?e.jsxs("div",{className:"reels-result-card",ref:k,children:[e.jsxs("div",{className:"reel-result-head",children:[e.jsx("span",{className:"reel-tom-pill","data-tom":l.tom,children:v[l.tom]}),e.jsx("span",{className:"reel-result-title",children:l.tema}),e.jsx("span",{className:"reel-result-meta",children:w[l.duracao_s]})]}),e.jsxs("div",{className:"reel-section",children:[e.jsx("div",{className:"reel-section-lbl",children:"Hook"}),e.jsxs("p",{className:"reel-hook-text",children:['"',l.hook,'"']}),e.jsx("div",{style:{marginTop:8},children:e.jsx(n,{text:l.hook,label:"Copiar hook"})})]}),e.jsxs("div",{className:"reel-section",children:[e.jsx("div",{className:"reel-section-lbl",children:"Roteiro completo"}),e.jsx("pre",{className:"reel-roteiro-pre",children:l.roteiro}),e.jsx(n,{text:l.roteiro,label:"Copiar roteiro"})]}),e.jsxs("div",{className:"reel-section",children:[e.jsx("div",{className:"reel-section-lbl",children:"Legenda Instagram"}),e.jsx("p",{className:"reel-legenda-text",children:l.legenda}),e.jsx(n,{text:l.legenda,label:"Copiar legenda"})]}),e.jsxs("div",{className:"reel-section",children:[e.jsx("div",{className:"reel-section-lbl",children:"Hashtags"}),e.jsx("div",{className:"reel-hash-pills",children:l.hashtags.map(r=>e.jsxs("span",{className:"reel-hash-pill",children:["#",r]},r))}),e.jsx("div",{style:{marginTop:8},children:e.jsx(n,{text:l.hashtags.map(r=>`#${r}`).join(" "),label:"Copiar todas"})})]}),e.jsxs("div",{className:"reel-section",children:[e.jsx("div",{className:"reel-section-lbl",children:"CTA"}),e.jsxs("div",{className:"reel-cta-row",children:[e.jsxs("div",{className:"reel-cta-box",children:[e.jsx("div",{className:"reel-cta-lbl",children:"Verbal (no vídeo)"}),e.jsxs("p",{className:"reel-cta-val",children:['"',l.cta_verbal,'"']})]}),e.jsxs("div",{className:"reel-cta-box",children:[e.jsx("div",{className:"reel-cta-lbl",children:"Legenda"}),e.jsxs("p",{className:"reel-cta-val",children:['"',l.cta_legenda,'"']})]})]})]})]}):e.jsxs("div",{className:"reels-empty",children:[e.jsxs("svg",{className:"reels-empty-icon",width:"52",height:"52",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"2",width:"20",height:"20",rx:"3"}),e.jsx("path",{d:"M10 8l6 4-6 4V8z"})]}),e.jsx("p",{className:"reels-empty-title",children:"Preencha o tema e gere o primeiro roteiro."}),e.jsx("p",{className:"reels-empty-sub",children:"O roteiro aparece aqui em segundos."})]}),!C&&u.length>0&&e.jsxs("div",{className:"reel-history-section",children:[e.jsxs("div",{className:"reel-history-title",children:["Histórico (",u.length,")"]}),e.jsx("div",{className:"reel-history-list",children:u.map(r=>e.jsx(A,{script:r,onDelete:R},r.id))})]})]})]})]})}export{V as default};
