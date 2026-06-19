import { designTokensCss, presentationThemeCss } from "../shared/designTokens.js";

export function presentationCss(): string {
  return `${designTokensCss()}
${presentationThemeCss()}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 88px; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
}
.kicker, .mono, .section-index { font-family: var(--mono); }
.kicker {
  color: var(--accent);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.story-chapters h1, .story-chapters h2 {
  color: var(--ink);
  font-family: var(--display);
  letter-spacing: -0.03em;
  margin: 0.25rem 0;
}
.story-chapters h1 { font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.05; }
.story-chapters h2 { font-size: clamp(1.35rem, 3vw, 2rem); margin-bottom: 0.5rem; }
.lede {
  max-width: 46rem;
  margin: 0.5rem 0 1.25rem;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.65;
}
.lede strong { color: var(--ink); font-weight: 600; }
.lede a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
.inline-code {
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  background: rgba(98, 230, 255, 0.08);
  color: var(--accent2);
  font-family: var(--mono);
  font-size: 0.92em;
}
body[data-theme="editorial-light"] .inline-code {
  background: rgba(11, 110, 114, 0.08);
  color: var(--accent);
}
.feature-card p strong { color: var(--ink); font-weight: 600; }
.metric-grid, .card-grid, .link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-2);
  margin-top: var(--space-2);
}
.card, .metric, .insight-card {
  border: 1px solid var(--line);
  background: var(--panel);
  padding: 1rem;
  border-radius: var(--radius-md);
}
.metric strong { display: block; color: var(--accent); font-size: 1.4rem; line-height: 1.1; }
.metric span, .card p { color: var(--muted); font-size: 0.85rem; }
.content-split {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(250px, 0.65fr);
  gap: var(--space-2);
  align-items: start;
}
.evidence-panel {
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--panel);
}
.evidence-panel dl { margin: 0.7rem 0 0; }
.evidence-panel dl div { display: flex; justify-content: space-between; gap: 1rem; padding: 0.45rem 0; border-bottom: 1px solid var(--line); }
.evidence-panel dt { color: var(--muted); font-size: 0.8rem; }
.evidence-panel dd { margin: 0; color: var(--accent); font-family: var(--mono); font-size: 0.85rem; }
.hero-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 1rem 0 0.4rem; }
.tag {
  display: inline-block;
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--accent);
  font-size: 0.8rem;
}
.hero-actions { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; margin-top: 1rem; }
.chapter-context {
  display: grid;
  grid-template-columns: minmax(120px, 0.25fr) minmax(0, 1fr);
  gap: var(--space-2);
  max-width: 920px;
  margin: 0.8rem 0 1.4rem;
  padding: 0.8rem 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.chapter-context span { color: var(--accent); font-family: var(--mono); font-size: 0.75rem; }
.chapter-context p { margin: 0; color: var(--muted); font-size: 0.95rem; line-height: 1.5; }
.chapter-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 860px;
  margin: 1.2rem 0;
  border-top: 1px solid var(--line);
}
.chapter-preview > .section-index { grid-column: 1 / -1; padding: 0.65rem 0 0.35rem; color: var(--accent); font-size: 0.75rem; text-transform: uppercase; }
.chapter-preview a {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 0.5rem;
  padding: 0.55rem 0.75rem 0.55rem 0;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font-size: 0.9rem;
  text-decoration: none;
}
.chapter-preview a:hover { color: var(--accent); }
.chapter-preview a span { color: var(--accent); font-family: var(--mono); }
.show-more {
  margin-top: 0.85rem;
  padding: 0;
  border: 0;
  background: transparent;
}
.show-more summary {
  cursor: pointer;
  color: var(--accent);
  font-family: var(--mono);
  font-size: 0.8rem;
  list-style: none;
}
.show-more summary::-webkit-details-marker { display: none; }
.show-more-body { margin-top: 0.5rem; color: var(--muted); font-size: 0.9rem; line-height: 1.45; }
.license-card { cursor: pointer; }
.license-card summary { list-style: none; }
.license-card summary::-webkit-details-marker { display: none; }
.license-card summary::after { content: "+"; float: right; color: var(--accent); }
.license-card[open] summary::after { content: "−"; }
.license-detail { margin-top: 0.7rem; padding-top: 0.65rem; border-top: 1px solid var(--line); }
.license-detail p, .license-detail a { margin: 0.25rem 0; color: var(--muted); font-size: 0.85rem; }
.insight-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
.insight-card { min-height: 120px; }
.section-index { color: var(--accent); font-size: 0.75rem; text-transform: uppercase; }
.insight-card p { margin: 0.6rem 0; color: var(--muted); font-size: 0.9rem; line-height: 1.45; }
.feature-card p { margin: 0.75rem 0 0; color: var(--ink); font-size: 0.95rem; line-height: 1.5; }
.insight-card code {
  display: block;
  overflow: hidden;
  padding: 0.55rem;
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.28);
  color: var(--accent2);
  font-size: 0.75rem;
  white-space: pre-wrap;
}
.insight-diagram {
  min-height: 170px;
  max-height: 320px;
  overflow: hidden;
  padding: 0.65rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: rgba(98, 230, 255, 0.05);
}
.insight-diagram svg { width: 100%; max-height: 280px; }
.architecture-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(240px, 0.75fr);
  gap: var(--space-2);
  align-items: stretch;
}
.diagram-shell {
  display: grid;
  min-height: 320px;
  place-items: center;
  overflow: hidden;
  padding: 0.8rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--panel);
}
.diagram-shell svg { width: 100%; min-height: 240px; max-height: 520px; }
.module-stack { display: grid; gap: 0.45rem; align-content: start; }
.module-row {
  display: grid;
  grid-template-columns: 74px 1fr;
  gap: 0.5rem;
  padding: 0.65rem;
  border-left: 3px solid var(--accent);
  background: var(--panel);
}
.module-row strong { color: var(--accent); font-size: 0.85rem; }
.module-row span { color: var(--muted); font-size: 0.8rem; line-height: 1.35; }
.technology-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
  gap: var(--space-2);
  align-items: start;
}
.technology-layout .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.directory-list { display: grid; gap: 0.45rem; margin-top: 1.1rem; }
.directory-list article { display: grid; grid-template-columns: 80px 1fr; gap: 0.55rem; padding: 0.65rem; border-bottom: 1px solid var(--line); background: var(--panel); }
.directory-list strong { color: var(--accent); font-size: 0.85rem; }
.directory-list span { color: var(--muted); font-size: 0.8rem; line-height: 1.4; }
.resource-layout { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 1.4rem; align-items: start; }
.resource-link {
  display: flex;
  justify-content: space-between;
  gap: 0.7rem;
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font-size: 0.9rem;
  text-decoration: none;
}
.resource-link:hover { background: var(--panel); color: var(--accent); }
.resource-link strong { color: var(--accent); white-space: nowrap; }
.shot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-2); }
.shot-grid figure { margin: 0; padding: 0.65rem; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--panel); }
.shot { width: 100%; max-height: 520px; object-fit: contain; border-radius: var(--radius-sm); }
.shot-grid figcaption { display: flex; gap: 0.7rem; padding: 0.65rem 0.2rem 0.15rem; color: var(--muted); font-size: 0.8rem; }
.shot-grid figcaption span { color: var(--accent); font-family: var(--mono); }
.command-stack { display: grid; gap: 0.8rem; }
.command-stack article { min-width: 0; }
.command-stack pre { margin-top: 0.4rem; }
.trimmed-note { margin: 0.45rem 0 0; color: var(--muted); font-family: var(--mono); font-size: 0.75rem; }
.release-note { display: grid; gap: 0.4rem; margin-top: 1.4rem; padding: 1rem; border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--panel); }
.release-note strong { font-size: 1rem; }
.release-note small { color: var(--muted); font-family: var(--mono); font-size: 0.75rem; }
pre { max-height: 50vh; white-space: pre-wrap; overflow: auto; background: #03080d; color: #dff7ff; padding: 1rem; border-radius: var(--radius-md); font-size: 0.85rem; }
a { color: var(--accent); }
.detail-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.85rem;
}
.detail-link:hover { border-color: var(--accent); }
.site-badge { position: fixed; z-index: 30; top: 16px; left: 20px; color: var(--muted); font: 0.75rem var(--mono); }
#chapter-nav {
  position: sticky;
  z-index: 40;
  top: 0;
  width: min(1180px, calc(100vw - 32px));
  margin: 0 auto;
  display: grid;
  gap: 0.5rem;
  padding: 0.65rem 0.75rem 0.75rem;
  border-bottom: 1px solid var(--line);
  background: rgba(10, 14, 20, 0.92);
  backdrop-filter: blur(12px);
}
body[data-theme="editorial-light"] #chapter-nav { background: rgba(255, 253, 247, 0.94); }
.chapter-pills {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  scrollbar-width: thin;
  padding-bottom: 2px;
}
.chapter-pill {
  flex: 0 0 auto;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-family: var(--sans);
  font-size: 0.82rem;
  white-space: nowrap;
}
.chapter-pill:hover { color: var(--ink); border-color: var(--line); }
.chapter-pill.active {
  border-color: var(--line-strong);
  background: rgba(98, 230, 255, 0.1);
  color: var(--accent);
}
.chapter-pill:focus-visible, .chapter-next-subtle:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
#reading-progress { height: 2px; overflow: hidden; border-radius: 999px; background: var(--line); }
#reading-progress span { display: block; width: 0; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 180ms ease; }
.chapter-footer { display: flex; justify-content: flex-end; margin-top: clamp(1.5rem, 4vh, 2.5rem); }
.chapter-next-subtle {
  border: 0;
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  font-family: var(--sans);
  font-size: 0.9rem;
  padding: 0.25rem 0;
}
.chapter-next-subtle:hover { text-decoration: underline; }
.diagram-error { width: 100%; padding: 1rem; border: 1px solid #ff7b86; border-radius: var(--radius-md); color: #ffadb4; background: rgba(255, 70, 90, 0.08); }
.diagram-error strong { display: block; margin-bottom: 0.5rem; }
.diagram-error pre { max-height: 250px; margin: 0; }
.detail-shell { max-width: 1040px; margin: 0 auto; padding: 72px 24px; }
.detail-shell h1 { font: clamp(2rem, 6vw, 3.5rem)/1.05 var(--display); }
.detail-shell h2 { margin-top: 2.5rem; }
.detail-shell .mermaid { padding: 1rem; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--panel); }
.detail-shell .readme-diagram { min-height: 240px; overflow: auto; }
.detail-shell .readme-diagram svg { width: 100%; max-height: 520px; }
.back { position: fixed; top: 16px; left: 16px; padding: 0.45rem 0.7rem; background: var(--panel); border: 1px solid var(--line); border-radius: 999px; text-decoration: none; font-size: 0.85rem; }
.story-chapters > section {
  display: block;
  width: min(1120px, calc(100vw - 48px));
  margin: 0 auto;
  scroll-margin-top: 88px;
  padding: clamp(3rem, 6vh, 5rem) clamp(1.25rem, 4vw, 2.5rem) clamp(2rem, 4vh, 3rem);
  border-bottom: 1px solid var(--line);
}
.story-chapters > section:first-child { padding-top: clamp(4rem, 8vh, 6rem); min-height: calc(100vh - 88px); }
.story-chapters > section:last-child { border-bottom: 0; }
@media (max-width: 760px) {
  .metric-grid, .card-grid, .insight-grid, .architecture-layout, .content-split, .technology-layout, .resource-layout { grid-template-columns: 1fr; }
  .story-chapters > section { width: 100%; padding: 3.5rem 1.25rem 2rem; scroll-margin-top: 72px; }
  .site-badge { top: 10px; left: 12px; }
  #chapter-nav { width: 100%; padding: 0.5rem 0.65rem 0.65rem; }
  .chapter-context, .chapter-preview { grid-template-columns: 1fr; }
  .chapter-preview > .section-index { grid-column: auto; }
  .chapter-footer { justify-content: stretch; }
  .chapter-next-subtle { width: 100%; text-align: left; }
}`;
}

export function presentationBootScript(): string {
  return `(()=>{
  const boot=async()=>{
  const diagrams=Array.from(document.querySelectorAll(".mermaid")).map((element)=>({element,source:element.textContent||""}));
  const showDiagramError=({element,source},message)=>{
    if(element.querySelector("svg"))return;
    element.className="diagram-error";
    element.textContent="";
    const title=document.createElement("strong");
    title.textContent=message;
    const code=document.createElement("pre");
    code.textContent=source;
    element.append(title,code);
  };
  const renderDiagrams=async()=>{
    if(!diagrams.length)return;
    if(!window.mermaid){
      diagrams.forEach((diagram)=>showDiagramError(diagram,"Architecture diagram runtime is unavailable"));
      return;
    }
    try{
      mermaid.initialize({
        startOnLoad:false,
        securityLevel:"strict",
        theme:document.body.dataset.theme==="editorial-light"?"default":"dark",
        flowchart:{curve:"basis",htmlLabels:false}
      });
      await mermaid.run({nodes:diagrams.map((item)=>item.element)});
      diagrams.forEach(({element})=>{
        const svg=element.querySelector("svg");
        if(svg){
          svg.removeAttribute("height");
          svg.style.maxWidth="100%";
        }
      });
    }catch(error){
      diagrams.forEach((diagram)=>showDiagramError(diagram,"Architecture diagram could not be rendered"));
    }
  };
  requestAnimationFrame(()=>requestAnimationFrame(()=>void renderDiagrams()));

  const chapterButtons=Array.from(document.querySelectorAll("[data-chapter-index]"));
  const chapters=Array.from(document.querySelectorAll(".story-chapters > section"));
  const chapterNextButtons=Array.from(document.querySelectorAll("[data-next-chapter]"));
  const progress=document.querySelector("#reading-progress span");
  const updateNavigation=(index)=>{
    chapterButtons.forEach((button,buttonIndex)=>{
      const selected=buttonIndex===index;
      button.classList.toggle("active",selected);
      if(selected){
        button.setAttribute("aria-current","page");
      }else{
        button.removeAttribute("aria-current");
      }
    });
    if(progress)progress.style.width=((index+1)/Math.max(chapterButtons.length,1))*100+"%";
  };
  let activeIndex=0;
  const goToChapter=(index)=>{
    const nextIndex=Math.max(0,Math.min(index,chapters.length-1));
    const chapter=chapters[nextIndex];
    if(!chapter)return;
    const offset=document.querySelector("#chapter-nav")?.getBoundingClientRect().height + 12 || 72;
    const top=chapter.getBoundingClientRect().top+window.scrollY-offset;
    window.scrollTo({top:Math.max(top,0),behavior:"smooth"});
  };
  chapterButtons.forEach((button,index)=>button.addEventListener("click",()=>goToChapter(index)));
  chapterNextButtons.forEach((button)=>button.addEventListener("click",()=>{
    const index=Number(button.getAttribute("data-next-chapter"));
    if(Number.isFinite(index))goToChapter(index);
  }));
  document.addEventListener("keydown",(event)=>{
    const target=event.target;
    if(target instanceof HTMLElement&&["INPUT","TEXTAREA","SELECT","BUTTON","A"].includes(target.tagName))return;
    if(event.key==="ArrowRight"){
      event.preventDefault();
      goToChapter(activeIndex+1);
    }
    if(event.key==="ArrowLeft"){
      event.preventDefault();
      goToChapter(activeIndex-1);
    }
  });
  const findActiveChapter=()=>{
    const offset=(document.querySelector("#chapter-nav")?.getBoundingClientRect().height||72)+Math.round(window.innerHeight*0.15);
    return chapters.reduce((current,chapter,index)=>{
      const top=chapter.getBoundingClientRect().top;
      return top<=offset?index:current;
    },0);
  };
  const syncNavigation=()=>{
    const index=findActiveChapter();
    if(index===activeIndex)return;
    activeIndex=index;
    updateNavigation(activeIndex);
  };
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver((entries)=>{
      const visible=entries
        .filter((entry)=>entry.isIntersecting)
        .sort((left,right)=>right.intersectionRatio-left.intersectionRatio)[0];
      if(!visible)return;
      const index=chapters.indexOf(visible.target);
      if(index<0||index===activeIndex)return;
      activeIndex=index;
      updateNavigation(activeIndex);
    },{rootMargin:"-15% 0px -55% 0px",threshold:[0,0.15,0.35,0.6]});
    chapters.forEach((chapter)=>observer.observe(chapter));
  }else{
    let scrollFrame=0;
    const scheduleSync=()=>{
      if(scrollFrame)return;
      scrollFrame=requestAnimationFrame(()=>{
        scrollFrame=0;
        syncNavigation();
      });
    };
    window.addEventListener("scroll",scheduleSync,{passive:true});
    window.addEventListener("resize",scheduleSync);
  }
    updateNavigation(activeIndex);
  };
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",()=>void boot());
  }else{
    void boot();
  }
})();`;
}
