'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync('i18n/runtime.js','utf8');
function textNode(text){return {nodeType:3,nodeValue:text};}
function element(id,text,selector='button'){
  const t=textNode(text);const el={id,selector,childNodes:[t],closest:()=>null,
    querySelector:()=>null,setAttribute(){},getAttribute(){return null}};
  t.parentElement=el;return el;
}
test('EN/PT-BR exact label translation, no prefix corruption, persistence and reversal',()=>{
  const nav=element('ni-dashboard','Dashboard');
  const long=element('other','Dashboard Statistics');
  const save=element('save','Save');
  const user=element('user','Save');
  user.closest=(selector)=>selector.includes('.chat-msg')?{}:null;
  const elems=[nav,long,save,user];
  const sidebar={appendChild(){},closest:()=>null};
  const store=new Map();
  const document={
    readyState:'complete',documentElement:{lang:'en'},
    body:{},
    getElementById:(id)=>id==='sidebar'?sidebar:(elems.find(e=>e.id===id)||null),
    querySelectorAll:()=>elems,
    querySelector:()=>null,
    createElement:(tag)=>({tag,childNodes:[],appendChild(){},append(){},setAttribute(){},addEventListener(){},style:{}}),
    dispatchEvent(){}
  };
  const context={window:{localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)}},
    localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},
    document,Node:{TEXT_NODE:3},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail}},
    MutationObserver:undefined,queueMicrotask};
  context.window.window=context.window;context.window.document=document;
  vm.runInNewContext(src,context);
  const api=context.window.__duNemiliaI18n;
  assert.ok(api);
  api.setLanguage('pt-BR');
  assert.equal(nav.childNodes[0].nodeValue,'Painel');
  assert.equal(save.childNodes[0].nodeValue,'Salvar');
  assert.equal(long.childNodes[0].nodeValue,'Dashboard Statistics');
  assert.equal(user.childNodes[0].nodeValue,'Save');
  assert.equal(store.get('duNemilia:i18n:language'),'pt-BR');
  api.setLanguage('en');
  assert.equal(nav.childNodes[0].nodeValue,'Dashboard');
  assert.equal(save.childNodes[0].nodeValue,'Save');
});
