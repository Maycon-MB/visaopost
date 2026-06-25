import{m as e}from"./index-DcVk0RXc.js";import{d as c,e as b}from"./react-vendor-DV60vIGU.js";const y="/visaopost/app/".replace(/\/$/,"")??"",h=[{file:"01-capa.jpg",title:"Capa do Catálogo"},{file:"02-intro.jpg",title:"Tecnologias & Diferenciais"},{file:"03-shinehd-easy.jpg",title:"ShineHD Easy"},{file:"04-shinehd-max.jpg",title:"ShineHD Max"},{file:"05-shinehd-full-ar.jpg",title:"ShineHD Full (AR)"},{file:"06-shinehd-premium.jpg",title:"ShineHD Premium"},{file:"07-shinehd-top.jpg",title:"ShineHD Top"},{file:"08-shinehd-office.jpg",title:"ShineHD Office"},{file:"09-shinehd-vszen.jpg",title:"ShineHD V.S. Zen"},{file:"10-myojoy.jpg",title:"Myojoy Miopia"},{file:"11-myojoy-tecnico.jpg",title:"Myojoy Detalhes Técnicos"},{file:"12-trat-antirreflexo.jpg",title:"Antirreflexo"},{file:"13-trat-riscos.jpg",title:"Resistência a Riscos"},{file:"14-trat-hidrofobico.jpg",title:"Tratamento Hidrofóbico"},{file:"15-trat-oleofobico.jpg",title:"Tratamento Oleofóbico"},{file:"16-trat-antiestatico.jpg",title:"Tratamento Antiestático"},{file:"17-trat-estetica.jpg",title:"Tratamento Estética"}],f=h.map(n=>`${y}/catalogo-fornecedor/${n.file}`);function w(){const[n,a]=c.useState("grid"),[i,l]=c.useState(0),[s,u]=c.useState("right"),g=c.useRef(null),p=b(),d=c.useCallback(o=>{const r=i+o;r<0||r>=f.length||(u(o>0?"right":"left"),l(r))},[i]);return c.useEffect(()=>{const o=r=>{n==="fullscreen"?r.key==="ArrowRight"?d(1):r.key==="ArrowLeft"?d(-1):r.key==="Escape"&&a("grid"):r.key==="Escape"&&p(-1)};return window.addEventListener("keydown",o),()=>window.removeEventListener("keydown",o)},[d,p,n]),n==="grid"?e.jsxs("div",{style:t.root,children:[e.jsx(m,{}),e.jsxs("header",{style:t.bar,children:[e.jsx("span",{style:t.brandName,children:"Catálogo Shinedux"}),e.jsxs("button",{className:"af-start-btn",style:t.startBtn,onClick:()=>{l(0),a("fullscreen")},children:[e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"currentColor",style:{marginRight:6},children:e.jsx("path",{d:"M8 5v14l11-7z"})}),"Apresentação Geral"]}),e.jsx("button",{style:t.closeBtn,onClick:()=>p(-1),"aria-label":"Fechar catálogo",children:e.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",children:e.jsx("path",{d:"M18 6 6 18M6 6l12 12"})})})]}),e.jsxs("div",{style:t.gridContainer,className:"af-grid-fade",children:[e.jsxs("div",{style:t.gridHeader,children:[e.jsx("h2",{style:t.gridTitle,children:"Especificações de Lentes"}),e.jsx("p",{style:t.gridSubtitle,children:"Selecione uma página para abrir em tela cheia no balcão"})]}),e.jsx("div",{style:t.grid,children:h.map((o,r)=>e.jsxs("div",{className:"af-grid-card",onClick:()=>{l(r),a("fullscreen")},children:[e.jsxs("div",{style:t.cardImgWrapper,children:[e.jsx("img",{src:f[r],alt:o.title,style:t.cardImg,loading:"lazy"}),e.jsx("span",{style:t.cardBadge,children:String(r+1).padStart(2,"0")})]}),e.jsx("div",{style:t.cardTitle,children:o.title})]},r))})]})]}):e.jsxs("div",{style:t.root,onTouchStart:o=>{g.current=o.touches[0].clientX},onTouchEnd:o=>{if(g.current==null)return;const r=g.current-o.changedTouches[0].clientX;g.current=null,Math.abs(r)>55&&d(r>0?1:-1)},children:[e.jsx(m,{}),e.jsxs("header",{style:t.bar,children:[e.jsxs("button",{className:"af-back-btn",style:t.backBtn,onClick:()=>a("grid"),"aria-label":"Voltar para o catálogo",children:[e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",style:{marginRight:6},children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"14",width:"7",height:"7"}),e.jsx("rect",{x:"3",y:"14",width:"7",height:"7"})]}),"Catálogo"]}),e.jsx("span",{style:t.brandName,children:h[i].title}),e.jsxs("span",{style:t.counter,children:[i+1," / ",f.length]}),e.jsx("button",{style:t.closeBtn,onClick:()=>a("grid"),"aria-label":"Voltar ao catálogo",children:e.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",children:e.jsx("path",{d:"M18 6 6 18M6 6l12 12"})})})]}),e.jsx("div",{style:t.stage,className:`af-slide af-from-${s}`,children:e.jsx("img",{src:f[i],alt:h[i].title,style:t.img})},i),e.jsxs("footer",{style:t.nav,children:[e.jsx(x,{onClick:()=>d(-1),disabled:i===0,label:"Anterior",children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",children:e.jsx("path",{d:"M15 18l-6-6 6-6"})})}),e.jsx(j,{total:f.length,current:i,onDot:l}),e.jsx(x,{onClick:()=>d(1),disabled:i===f.length-1,label:"Próximo",children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",children:e.jsx("path",{d:"M9 18l6-6-6-6"})})})]})]})}function j({total:n,current:a,onDot:i}){return e.jsx("div",{style:{display:"flex",gap:5,alignItems:"center",overflowX:"auto",maxWidth:"60vw"},children:Array.from({length:n}).map((l,s)=>e.jsx("button",{style:{...t.dot,...s===a?t.dotOn:{}},onClick:()=>i(s),"aria-label":`Página ${s+1}`},s))})}function x({onClick:n,disabled:a,label:i,children:l}){return e.jsx("button",{style:{...t.navBtn,opacity:a?.15:1,cursor:a?"default":"pointer"},onClick:n,disabled:a,"aria-label":i,children:l})}function m(){return e.jsx("style",{children:`
      .af-slide {
        animation-duration: 280ms;
        animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        animation-fill-mode: both;
      }
      .af-from-right { animation-name: af-from-right; }
      .af-from-left  { animation-name: af-from-left; }
      @keyframes af-from-right {
        from { opacity: 0; transform: translateX(40px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes af-from-left {
        from { opacity: 0; transform: translateX(-40px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      /* Grid de Catálogo */
      .af-grid-card {
        background: #141414;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        padding: 12px;
        cursor: pointer;
        transition: transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    border-color 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    box-shadow 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    background 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: relative;
        overflow: hidden;
      }
      .af-grid-card:hover {
        transform: translateY(-4px);
        border-color: #D4A040;
        box-shadow: 0 8px 24px rgba(212, 160, 64, 0.18);
        background: #1a1a1a;
      }
      .af-grid-card:active {
        transform: translateY(-2px);
      }
      .af-start-btn:hover {
        background: rgba(212, 160, 64, 0.25) !important;
        border-color: #D4A040 !important;
        color: #fff !important;
      }
      .af-back-btn:hover {
        background: rgba(255, 255, 255, 0.12) !important;
        border-color: rgba(255, 255, 255, 0.25) !important;
        color: #fff !important;
      }

      /* Fade in da grade */
      .af-grid-fade {
        animation: af-fade-in 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
      }
      @keyframes af-fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `})}const t={root:{position:"fixed",inset:0,background:"#0a0a0a",display:"flex",flexDirection:"column",overflow:"hidden",WebkitUserSelect:"none",userSelect:"none",fontFamily:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'},bar:{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.08)",flexShrink:0,minHeight:52,color:"rgba(255,255,255,0.6)"},brandName:{fontSize:14,fontWeight:600,letterSpacing:"0.02em",color:"#fff"},counter:{fontSize:12,color:"rgba(255,255,255,0.35)",fontVariantNumeric:"tabular-nums"},closeBtn:{flexShrink:0,width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 150ms ease"},stage:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",minHeight:0,padding:12},img:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",borderRadius:6,boxShadow:"0 8px 40px rgba(0,0,0,0.5)"},nav:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",borderTop:"1px solid rgba(255,255,255,0.08)",flexShrink:0,minHeight:56},navBtn:{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",borderRadius:"50%",width:42,height:42,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},dot:{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.18)",border:"none",cursor:"pointer",padding:0,flexShrink:0},dotOn:{background:"#D4A040",width:18,borderRadius:3},gridContainer:{flex:1,overflowY:"auto",padding:"24px 20px",display:"flex",flexDirection:"column",gap:20,WebkitOverflowScrolling:"touch"},gridHeader:{marginBottom:8},gridTitle:{fontSize:20,fontWeight:600,color:"#fff",margin:"0 0 4px 0"},gridSubtitle:{fontSize:13,color:"rgba(255,255,255,0.45)",margin:0},grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))",gap:16},cardImgWrapper:{position:"relative",aspectRatio:"4/3",background:"#0d0d0d",borderRadius:6,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.04)"},cardImg:{maxWidth:"90%",maxHeight:"90%",objectFit:"contain"},cardBadge:{position:"absolute",top:6,left:6,background:"rgba(0, 0, 0, 0.75)",color:"#D4A040",fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,fontVariantNumeric:"tabular-nums"},cardTitle:{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.85)",lineHeight:1.3,padding:"0 2px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},startBtn:{background:"rgba(212, 160, 64, 0.15)",border:"1px solid rgba(212, 160, 64, 0.3)",color:"#D4A040",borderRadius:6,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:"auto",marginRight:10,transition:"all 150ms ease"},backBtn:{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",borderRadius:6,padding:"6px 12px",fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginRight:10,transition:"all 150ms ease"}};export{w as default};
