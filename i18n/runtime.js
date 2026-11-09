/* duNemilia i18n navigation pilot (MIT). No network requests. */
(() => {
  'use strict';
  if (window.__duNemiliaI18n) return;
  const storageKey='duNemilia:i18n:language';
  const labels={
    'ni-dashboard':['Dashboard','Painel'],
    'ni-compose':['Compose','Compor'],
    'ni-chat':['Chat','Conversa'],
    'ni-agents':['Agents','Agentes'],
    'ni-prompts':['Prompts','Instruções'],
    'ni-skills':['Skills','Habilidades'],
    'ni-tasks':['Tasks','Tarefas'],
    'ni-workflows':['Workflows','Fluxos de trabalho'],
    'ni-captured':['Captures','Capturas'],
    'ni-documents':['Library','Biblioteca'],
    'ni-memory':['Memories','Memórias'],
    'ni-results':['Workflow Results','Resultados dos fluxos'],
    'ni-mcp':['Connections','Conexões']
  };
  let language='en', updating=false;
  try { const saved=localStorage.getItem(storageKey);if(['en','pt-BR'].includes(saved))language=saved; }catch(_){}
  function translate(id,pair){
    const button=document.getElementById(id);
    if(!button)return;
    const next=pair[language==='pt-BR'?1:0];
    for(const node of button.childNodes){
      if(node.nodeType!==Node.TEXT_NODE)continue;
      const old=pair.find(s=>node.nodeValue.trim().startsWith(s));
      if(old && old!==next){node.nodeValue=node.nodeValue.replace(old,next);break;}
    }
  }
  function render(){
    if(updating)return;
    updating=true;
    try{
      document.documentElement.lang=language;
      for(const [id,pair] of Object.entries(labels))translate(id,pair);
      const sidebar=document.getElementById('sidebar');
      if(sidebar && !document.getElementById('du-nemilia-language')){
        const wrapper=document.createElement('label');
        wrapper.id='du-nemilia-language';
        wrapper.style.cssText='display:flex;align-items:center;gap:8px;padding:8px 12px;font-size:12px';
        const title=document.createElement('span');
        title.textContent='Language / Idioma';
        const select=document.createElement('select');
        select.setAttribute('aria-label','Language / Idioma');
        for(const [value,text] of [['en','English'],['pt-BR','Português (Brasil)']]){
          const option=document.createElement('option');
          option.value=value;option.textContent=text;select.appendChild(option);
        }
        select.addEventListener('change',()=>setLanguage(select.value));
        wrapper.append(title,select);sidebar.appendChild(wrapper);
      }
      const picker=document.querySelector('#du-nemilia-language select');
      if(picker)picker.value=language;
    }finally{updating=false;}
  }
  function setLanguage(next){
    if(!['en','pt-BR'].includes(next))throw new RangeError('Unsupported language');
    language=next;
    try{localStorage.setItem(storageKey,language);}catch(_){}
    render();
    document.dispatchEvent(new CustomEvent('duNemilia:languagechange',{detail:{language}}));
  }
  window.__duNemiliaI18n=Object.freeze({getLanguage:()=>language,setLanguage,render});
  function init(){
    render();
    if(window.MutationObserver){
      const observer=new MutationObserver(()=>{if(!updating)render();});
      observer.observe(document.body,{childList:true,subtree:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
