export function presentationCss(): string {
  return `:root {
  --bg: #071019;
  --ink: #edf8ff;
  --muted: #93a9b8;
  --accent: #62e6ff;
  --accent2: #6ef7b1;
  --panel: rgba(11, 25, 38, 0.82);
  --line: rgba(126, 232, 255, 0.22);
  --display: "Avenir Next Condensed", "Arial Narrow", sans-serif;
  --body: "Avenir Next", "Segoe UI", sans-serif;
  font-family: var(--body);
  color-scheme: dark;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background:
    radial-gradient(circle at 15% 20%, rgba(98, 230, 255, 0.16), transparent 30%),
    linear-gradient(135deg, #05090f, #0a1825);
  color: var(--ink);
}
body[data-theme="editorial-light"] {
  --ink: #172029;
  --muted: #65717b;
  --accent: #006f73;
  --accent2: #be4b2f;
  --panel: rgba(255, 253, 247, 0.9);
  --line: rgba(23, 32, 41, 0.18);
  color-scheme: light;
  background: linear-gradient(120deg, #eee8dc, #fffdf8);
}
body[data-theme="blueprint"] {
  --accent: #68d5ff;
  --accent2: #ffcf62;
  background-color: #061b2d;
  background-image:
    linear-gradient(rgba(104, 213, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(104, 213, 255, 0.06) 1px, transparent 1px);
  background-size: 36px 36px;
}
.reveal { color: var(--ink); }
.reveal .slides { text-align: left; }
.reveal section { padding: 2.4rem 2.4rem 5.5rem; }
.kicker, .mono, .section-index { font-family: "SFMono-Regular", Menlo, monospace; }
.kicker {
  color: var(--accent);
  text-transform: uppercase;
  font-size: 0.32em;
  letter-spacing: 0.14em;
}
.reveal h1, .reveal h2 {
  color: var(--ink);
  font-family: var(--display);
  letter-spacing: -0.045em;
  text-transform: none;
}
.reveal h1 { margin: 0.2em 0; font-size: 2.65em; line-height: 0.9; }
.reveal h2 { margin: 0.2em 0 0.55em; font-size: 1.65em; }
.lede { max-width: 50rem; margin: 0.5em 0; color: var(--muted); font-size: 0.72em; line-height: 1.5; }
.metric-grid, .card-grid, .link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
  margin-top: 1.1rem;
}
.card, .metric, .insight-card {
  border: 1px solid var(--line);
  background: var(--panel);
  padding: 0.9rem;
  border-radius: 14px;
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.15);
}
.metric strong { display: block; color: var(--accent); font-size: 1.25em; line-height: 1.05; }
.metric span, .card p { color: var(--muted); font-size: 0.48em; }
.content-split {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(250px, 0.65fr);
  gap: 1rem;
  align-items: start;
}
.evidence-panel {
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: linear-gradient(145deg, var(--panel), rgba(98, 230, 255, 0.04));
}
.evidence-panel dl { margin: 0.7rem 0 0; }
.evidence-panel dl div { display: flex; justify-content: space-between; gap: 1rem; padding: 0.45rem 0; border-bottom: 1px solid var(--line); }
.evidence-panel dt { color: var(--muted); font-size: 0.34em; }
.evidence-panel dd { margin: 0; color: var(--accent); font: 0.5em "SFMono-Regular", monospace; }
.hero-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 1rem 0 0.4rem; }
.tag {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--accent);
  font-size: 0.38em;
}
.hero-actions { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; }
.navigation-hint { margin-top: 1rem; color: var(--muted); font: 0.32em "SFMono-Regular", monospace; }
.navigation-hint span { display: inline-block; margin-left: 0.35rem; color: var(--accent); animation: direction-pulse 1.6s ease-in-out infinite; }
.chapter-context {
  display: grid;
  grid-template-columns: minmax(130px, 0.28fr) minmax(0, 1fr);
  gap: 1rem;
  max-width: 920px;
  margin: 0.8rem 0 1.4rem;
  padding: 0.8rem 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.chapter-context span { color: var(--accent); font: 0.32em "SFMono-Regular", monospace; text-transform: uppercase; }
.chapter-context p { margin: 0; color: var(--muted); font-size: 0.4em; line-height: 1.55; }
.chapter-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 860px;
  margin: 1.2rem 0;
  border-top: 1px solid var(--line);
}
.chapter-preview > .section-index { grid-column: 1 / -1; padding: 0.65rem 0 0.35rem; }
.chapter-preview a {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 0.5rem;
  padding: 0.55rem 0.75rem 0.55rem 0;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font-size: 0.38em;
  text-decoration: none;
}
.chapter-preview a:hover { color: var(--accent); }
.chapter-preview a span { color: var(--accent); font-family: "SFMono-Regular", monospace; }
.license-card { cursor: pointer; }
.license-card summary { list-style: none; }
.license-card summary::-webkit-details-marker { display: none; }
.license-card summary::after { content: "+"; float: right; margin-top: -1em; color: var(--accent); font-size: 0.8em; }
.license-card[open] summary::after { content: "−"; }
.license-detail { margin-top: 0.7rem; padding-top: 0.65rem; border-top: 1px solid var(--line); }
.license-detail p, .license-detail a { margin: 0.25rem 0; color: var(--muted); font-size: 0.38em; }
.insight-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}
.insight-card { min-height: 145px; }
.section-index { color: var(--accent); font-size: 0.34em; text-transform: uppercase; }
.insight-card p { margin: 0.6rem 0; color: var(--muted); font-size: 0.44em; line-height: 1.45; }
.feature-card p { margin: 0.75rem 0 0; color: var(--ink); font-size: 0.48em; line-height: 1.55; }
.insight-card code {
  display: block;
  overflow: hidden;
  padding: 0.55rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.28);
  color: var(--accent2);
  font-size: 0.3em;
  white-space: pre-wrap;
}
.architecture-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(240px, 0.75fr);
  gap: 1rem;
  align-items: stretch;
}
.diagram-shell {
  display: grid;
  min-height: 390px;
  place-items: center;
  overflow: hidden;
  padding: 0.8rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel);
}
.diagram-shell svg { width: 100%; min-height: 280px; max-height: 520px; }
.module-stack { display: grid; gap: 0.45rem; align-content: start; }
.module-row {
  display: grid;
  grid-template-columns: 74px 1fr;
  gap: 0.5rem;
  padding: 0.65rem;
  border-left: 3px solid var(--accent);
  background: var(--panel);
}
.module-row strong { color: var(--accent); font-size: 0.38em; }
.module-row span { color: var(--muted); font-size: 0.32em; line-height: 1.35; }
.technology-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
  gap: 1rem;
  align-items: start;
}
.technology-layout .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.directory-list { display: grid; gap: 0.45rem; margin-top: 1.1rem; }
.directory-list article { display: grid; grid-template-columns: 80px 1fr; gap: 0.55rem; padding: 0.65rem; border-bottom: 1px solid var(--line); background: var(--panel); }
.directory-list strong { color: var(--accent); font-size: 0.38em; }
.directory-list span { color: var(--muted); font-size: 0.32em; line-height: 1.4; }
.resource-layout { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 1.4rem; align-items: start; }
.resource-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font-size: 0.42em;
  text-decoration: none;
}
.resource-link:hover { background: var(--panel); color: var(--accent); }
.resource-link strong { color: var(--accent); white-space: nowrap; }
.shot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.shot-grid figure { margin: 0; padding: 0.65rem; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); }
.shot { width: 100%; max-height: 520px; object-fit: contain; border-radius: 10px; box-shadow: 0 25px 70px rgba(0,0,0,.3); }
.shot-grid figcaption { display: flex; gap: 0.7rem; padding: 0.65rem 0.2rem 0.15rem; color: var(--muted); font-size: 0.34em; }
.shot-grid figcaption span { color: var(--accent); font-family: "SFMono-Regular", monospace; }
.command-stack { display: grid; gap: 0.8rem; }
.command-stack article { min-width: 0; }
.command-stack pre { margin-top: 0.4rem; }
.release-note { display: grid; gap: 0.4rem; margin-top: 1.4rem; padding: 1rem; border: 1px solid var(--line); border-radius: 14px; background: var(--panel); }
.release-note strong { font-size: 0.52em; }
.release-note small { color: var(--muted); font: 0.3em "SFMono-Regular", monospace; }
pre { max-height: 50vh; white-space: pre-wrap; overflow: auto; background: #03080d; color: #dff7ff; padding: 1rem; border-radius: 12px; font-size: 0.38em; }
a { color: var(--accent); }
.detail-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 0.8rem;
  border: 1px solid var(--accent);
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.38em;
}
.site-badge { position: fixed; z-index: 30; top: 18px; left: 22px; color: var(--muted); font: 12px "SFMono-Regular", monospace; }
#chapter-nav {
  position: fixed;
  z-index: 40;
  top: 50%;
  right: 18px;
  width: 268px;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.7rem;
  align-items: center;
  padding: 0.8rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(5, 14, 23, 0.88);
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px);
}
body[data-theme="editorial-light"] #chapter-nav { background: rgba(255, 253, 247, 0.92); }
#reading-progress { height: 3px; overflow: hidden; border-radius: 999px; background: var(--line); }
#reading-progress span { display: block; width: 0; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 180ms ease; }
.nav-mode { padding: 0 0.2rem; }
.nav-mode span, .nav-mode strong { display: block; font: 10px "SFMono-Regular", monospace; }
.nav-mode span { color: var(--muted); }
.nav-mode strong { margin-top: 0.2rem; color: var(--accent); }
.chapter-list { display: grid; gap: 0.2rem; min-width: 0; max-height: 48vh; overflow: auto; scrollbar-width: none; }
.chapter-list::-webkit-scrollbar { display: none; }
.chapter-list button, .chapter-controls button {
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-family: var(--body);
}
.chapter-list button {
  width: 100%;
  padding: 0.45rem 0.6rem;
  border-radius: 9px;
  font-size: 11px;
  text-align: left;
  white-space: nowrap;
}
.chapter-list button span { margin-right: 0.35rem; color: var(--accent); font-family: "SFMono-Regular", monospace; }
.chapter-list button.active { background: rgba(98, 230, 255, 0.12); color: var(--ink); }
.chapter-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem; }
.chapter-controls button {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--line);
  border-radius: 10px;
}
.chapter-controls button:disabled { cursor: default; opacity: 0.35; }
.chapter-controls span { color: var(--accent); font-size: 18px; }
.chapter-controls small { max-width: 88px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.diagram-error { width: 100%; padding: 1rem; border: 1px solid #ff7b86; border-radius: 12px; color: #ffadb4; background: rgba(255, 70, 90, 0.08); }
.diagram-error strong { display: block; margin-bottom: 0.5rem; }
.diagram-error pre { max-height: 250px; margin: 0; }
.detail-shell { max-width: 1040px; margin: 0 auto; padding: 72px 24px; }
.detail-shell h1 { font: clamp(42px, 8vw, 82px)/0.95 var(--display); }
.detail-shell h2 { margin-top: 3rem; }
.detail-shell .mermaid { padding: 1rem; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); }
.back { position: fixed; top: 20px; left: 20px; padding: 0.5rem 0.75rem; background: var(--panel); border: 1px solid var(--line); border-radius: 999px; text-decoration: none; }
.story { padding-right: 304px; }
.story .reveal { width: auto; height: auto; min-height: 100vh; overflow: visible; }
.story .reveal .slides {
  position: static;
  width: auto !important;
  height: auto !important;
  inset: auto !important;
  transform: none !important;
  text-align: left;
}
.story .reveal .slides > section {
  display: block !important;
  position: relative !important;
  width: min(1120px, calc(100vw - 352px)) !important;
  min-height: 78vh;
  margin: 0 auto;
  padding: clamp(6rem, 10vh, 9rem) clamp(1.5rem, 4vw, 4rem);
  opacity: 1 !important;
  transform: none !important;
  border-bottom: 1px solid var(--line);
}
.story .reveal .slides > section:first-child { min-height: 100vh; }
.story .reveal .slides > section:last-child { border-bottom: 0; }
.story .reveal .controls, .story .reveal .progress { display: none; }
@keyframes direction-pulse {
  0%, 100% { transform: translateY(0); opacity: 0.65; }
  50% { transform: translateY(6px); opacity: 1; }
}
@media (max-width: 760px) {
  .story { padding-right: 0; }
  .reveal { height: auto; }
  .reveal .slides { position: static; width: auto !important; height: auto !important; transform: none !important; }
  .reveal .slides > section, .reveal .slides > section > section { display: block !important; position: static !important; width: auto !important; min-height: auto; margin: 0; opacity: 1 !important; transform: none !important; padding: 5rem 1.25rem; }
  .reveal .controls, .reveal .progress { display: none; }
  .reveal h1 { font-size: 2em; }
  .metric-grid, .card-grid, .insight-grid, .architecture-layout, .content-split, .technology-layout, .resource-layout { grid-template-columns: 1fr; }
  .story .reveal .slides > section { width: 100% !important; min-height: auto; padding: 6rem 1.25rem; }
  .site-badge { position: absolute; }
  #chapter-nav { position: sticky; top: 0; right: auto; width: auto; transform: none; grid-template-columns: auto minmax(0, 1fr); border-radius: 0; }
  #reading-progress { position: absolute; right: 0; bottom: 0; left: 0; }
  .chapter-controls { display: none; }
  .nav-mode { min-width: 126px; }
  .chapter-list { display: flex; max-height: none; }
  .chapter-list button { padding: 0.4rem; }
  .chapter-context, .chapter-preview { grid-template-columns: 1fr; }
  .chapter-preview > .section-index { grid-column: auto; }
  .reveal section { padding-bottom: 3.5rem !important; }
}`;
}

export function presentationBootScript(): string {
  return `document.addEventListener("DOMContentLoaded",async()=>{
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

  const chapterButtons=Array.from(document.querySelectorAll("[data-slide-index]"));
  const chapters=Array.from(document.querySelectorAll(".slides > section"));
  const previousButton=document.querySelector("#previous-chapter");
  const nextButton=document.querySelector("#next-chapter");
  const count=document.querySelector("#chapter-count");
  const progress=document.querySelector("#reading-progress span");
  const titles=chapterButtons.map((button)=>button.textContent?.replace(/^\\d+\\s*/,"").trim()||"Chapter");
  const updateNavigation=(index)=>{
    chapterButtons.forEach((button,buttonIndex)=>button.classList.toggle("active",buttonIndex===index));
    chapterButtons[index]?.scrollIntoView({block:"nearest",inline:"nearest"});
    if(count)count.textContent=String(index+1).padStart(2,"0")+" / "+String(chapterButtons.length).padStart(2,"0");
    if(progress)progress.style.width=((index+1)/Math.max(chapterButtons.length,1))*100+"%";
    if(previousButton){
      previousButton.disabled=index===0;
      const label=previousButton.querySelector("small");
      if(label)label.textContent=index>0?titles[index-1]:"Start";
    }
    if(nextButton){
      nextButton.disabled=index>=chapterButtons.length-1;
      const label=nextButton.querySelector("small");
      if(label)label.textContent=index<chapterButtons.length-1?titles[index+1]:"End";
    }
  };
  let activeIndex=0;
  const goToChapter=(index)=>{
    const nextIndex=Math.max(0,Math.min(index,chapters.length-1));
    chapters[nextIndex]?.scrollIntoView({behavior:"smooth",block:"start"});
  };
  chapterButtons.forEach((button,index)=>button.addEventListener("click",()=>goToChapter(index)));
  previousButton?.addEventListener("click",()=>goToChapter(activeIndex-1));
  nextButton?.addEventListener("click",()=>goToChapter(activeIndex+1));
  const observer=new IntersectionObserver((entries)=>{
    const visible=entries
      .filter((entry)=>entry.isIntersecting)
      .sort((left,right)=>right.intersectionRatio-left.intersectionRatio)[0];
    if(!visible)return;
    const index=chapters.indexOf(visible.target);
    if(index<0||index===activeIndex)return;
    activeIndex=index;
    updateNavigation(activeIndex);
  },{rootMargin:"-18% 0px -58% 0px",threshold:[0,0.15,0.35,0.6]});
  chapters.forEach((chapter)=>observer.observe(chapter));
  updateNavigation(activeIndex);
});`;
}
