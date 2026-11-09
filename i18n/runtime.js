/* duNemilia UI i18n pilot (MIT): navigation + known static controls. No network requests. */
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

  // UI-only static strings. Dynamic user/AI content is deliberately excluded.
  const dictionary={
  "New prompt": "Novo prompt",
  "Settings": "Configurações",
  "Open workspace": "Abrir espaço de trabalho",
  "About": "Sobre",
  "Import": "Importar",
  "Export": "Exportar",
  "Allow": "Permitir",
  "Dismiss": "Dispensar",
  "Save": "Salvar",
  "Cancel": "Cancelar",
  "Close": "Fechar",
  "Clear": "Limpar",
  "Delete selected": "Excluir selecionados",
  "Generate": "Gerar",
  "Run": "Executar",
  "Done": "Concluído",
  "Apply": "Aplicar",
  "Add": "Adicionar",
  "Reset": "Redefinir",
  "Test": "Testar",
  "Upload": "Enviar arquivo",
  "Rename": "Renomear",
  "Confirm": "Confirmar",
  "Continue": "Continuar",
  "Open": "Abrir",
  "Skip": "Pular",
  "Select all": "Selecionar todos",
  "Select for Compose": "Selecionar para Compor",
  "New chat": "Nova conversa",
  "Clear chats": "Limpar conversas",
  "Run as workflow": "Executar como fluxo",
  "Run as prompt": "Executar como instrução",
  "New agent": "Novo agente",
  "New skill": "Nova habilidade",
  "New Task": "Nova tarefa",
  "Save Task": "Salvar tarefa",
  "Save agent": "Salvar agente",
  "Save workflow": "Salvar fluxo",
  "Save template": "Salvar modelo",
  "Full backup": "Backup completo",
  "Restore backup": "Restaurar backup",
  "Write backup": "Gravar backup",
  "Clear all data": "Limpar todos os dados",
  "Refresh Models": "Atualizar modelos",
  "Save & connect": "Salvar e conectar",
  "Test search": "Testar busca",
  "Scan Workspace": "Examinar espaço de trabalho",
  "Import Folder": "Importar pasta",
  "Pick memories": "Selecionar memórias",
  "Set condition": "Definir condição",
  "Copy link": "Copiar link",
  "Encrypt now": "Criptografar agora",
  "Make a backup first": "Fazer backup primeiro",
  "Name": "Nome",
  "Description": "Descrição",
  "System prompt": "Instrução de sistema",
  "Message": "Mensagem",
  "Task name": "Nome da tarefa",
  "Goal": "Objetivo",
  "Content": "Conteúdo",
  "Role": "Papel",
  "Icon": "Ícone",
  "Color": "Cor",
  "Options": "Opções",
  "Scope": "Escopo",
  "Prompt template": "Modelo de instrução",
  "Key": "Chave",
  "Value": "Valor",
  "Share link": "Link de compartilhamento",
  "What to share": "O que compartilhar",
  "Consequential WebMCP tools:": "Ferramentas WebMCP com consequências:",
  "Use WebMCP tools from open tabs": "Usar ferramentas WebMCP de abas abertas",
  "Read-only tools only": "Somente ferramentas de leitura",
  "Auto-export PDF on completion": "Exportar PDF automaticamente ao concluir",
  "Show Dashboard after login": "Mostrar painel após login",
  "Show estimated cost during runs": "Mostrar custo estimado durante execuções",
  "What do you want to accomplish?": "O que você deseja realizar?",
  "What should this agent do?": "O que este agente deve fazer?",
  "What should this prompt do?": "O que esta instrução deve fazer?",
  "Direct prompt": "Instrução direta",
  "Newest first": "Mais recentes primeiro",
  "Oldest first": "Mais antigos primeiro",
  "Name A–Z": "Nome A–Z",
  "Name Z–A": "Nome Z–A",
  "Largest first": "Maiores primeiro",
  "Smallest first": "Menores primeiro",
  "File type": "Tipo de arquivo",
  "Pause for approval": "Pausar para aprovação",
  "Allow without asking": "Permitir sem perguntar",
  "All": "Todos",
  "None": "Nenhum",
  "Select": "Selecionar",
  "Search…": "Pesquisar…",
  "Search library…": "Pesquisar biblioteca…",
  "Search results…": "Pesquisar resultados…",
  "Filter models…": "Filtrar modelos…",
  "Filter memories…": "Filtrar memórias…",
  "New tag name…": "Nome da nova etiqueta…",
  "Value to store": "Valor para armazenar",
  "Bearer token if required": "Token Bearer, se necessário",
  "My MCP Server": "Meu servidor MCP",
  "Type a message… (Enter to send · drop files to attach)": "Digite uma mensagem… (Enter para enviar · solte arquivos para anexar)",
  "The same password again": "Repita a mesma senha",
  "The password of the file": "Senha do arquivo",
  "Password for the file (min. 6 chars)": "Senha do arquivo (mín. 6 caracteres)"
};
  const reverse=Object.fromEntries(Object.entries(dictionary).map(([en,pt])=>[pt,en]));
  function translateUI(){
    const target=language==='pt-BR'?dictionary:reverse;
    const selector='button,label,option,.nav-lbl,[role="button"],[role="tab"]';
    for(const el of document.querySelectorAll(selector)){
      if(el.closest('#du-nemilia-language,[contenteditable],.chat-msg,.chat-message,.message-content,.markdown-body,[data-user-content]'))continue;
      for(const node of el.childNodes){
        if(node.nodeType!==Node.TEXT_NODE)continue;
        const raw=node.nodeValue||'';
        const key=raw.trim().replace(/\s+/g,' ');
        if(!Object.prototype.hasOwnProperty.call(target,key))continue;
        node.nodeValue=raw.replace(key,target[key]);
      }
    }
    for(const el of document.querySelectorAll('input[placeholder],textarea[placeholder]')){
      if(el.closest('[data-user-content]'))continue;
      const old=el.getAttribute('placeholder');
      const key=old&&old.trim().replace(/\s+/g,' ');
      if(Object.prototype.hasOwnProperty.call(target,key))el.setAttribute('placeholder',target[key]);
    }
  }

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
      translateUI();
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
      observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['placeholder']});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
