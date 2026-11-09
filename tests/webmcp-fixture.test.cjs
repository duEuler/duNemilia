'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('labs/webmcp-fixture.html','utf8');
const code=html.match(/<script>([\s\S]*?)<\/script>/i)?.[1];
assert.ok(code,'fixture must contain a script');

function boot(mode='document'){
  const registered=new Map();
  const nodes=new Map(['reset','reload','status'].map(id=>[id,{textContent:'',addEventListener(event,handler){this[event]=handler;}}]));
  const modelContext={registerTool(t){
    if(registered.has(t.name))throw new Error('duplicate tool');
    registered.set(t.name,t);
  }};
  const document={getElementById:id=>nodes.get(id),
    modelContext:mode==='document'?modelContext:undefined};
  const navigator={modelContext:mode==='navigator'?modelContext:undefined};
  const window={};
  vm.runInNewContext(code,{document,navigator,window,setTimeout,location:{reload() {}}});
  return {registered,nodes,state:window.__duNemiliaLab.state};
}
test('tools registered on document.modelContext',()=>{
  const x=boot(); assert.deepEqual([...x.registered.keys()].sort(),
    ['lab_delayed','lab_increment','lab_read','lab_unannotated'].sort());
});
test('navigator.modelContext fallback',()=>{
  const x=boot('navigator');assert.equal(x.registered.size,4);
});
test('without browser WebMCP API the lab reports unavailable',()=>{
  const x=boot('none');assert.equal(x.registered.size,0);
  assert.match(x.state.registered[0],/unavailable/);
});
test('read-only operation never modifies counter',async()=>{
  const x=boot();const res=await x.registered.get('lab_read').execute({});
  assert.equal(x.state.count,0);assert.equal(res.content[0].text,'0');
});
test('consequential operation applies exactly one increment when executed once',async()=>{
  const x=boot();const t=x.registered.get('lab_increment');
  assert.equal(t.annotations.consequentialHint,true);
  assert.equal(t.annotations.readOnlyHint,false);
  await t.execute({amount:1});assert.equal(x.state.count,1);
  assert.deepEqual([...x.state.calls],['lab_increment']);
});
test('invalid arguments are rejected without mutation',async()=>{
  const x=boot();const tool=x.registered.get('lab_increment');
  for(const amount of [-1,0,3,1.2,'1',null]){
    await assert.rejects(tool.execute({amount}),/Invalid amount/);
  }
  assert.equal(x.state.count,0);
});
test('delayed read finishes without mutating counter',async()=>{
  const x=boot();
  await x.registered.get('lab_delayed').execute({ms:100});
  assert.equal(x.state.count,0);assert.deepEqual([...x.state.calls],['lab_delayed']);
});
test('unknown consequential hint must be treated as potentially mutating',()=>{
  const x=boot();const t=x.registered.get('lab_unannotated');
  assert.equal(Object.hasOwn(t,'annotations'),false);
  assert.equal(t.description.includes('annotation deliberately omitted'),true);
  // Conservative standalone classification; NOT the Nemilia extension policy.
  const permissionNeeded=t.annotations?.readOnlyHint!==true;
  assert.equal(permissionNeeded,true);
});
test('reset button clears disposable state',async()=>{
  const x=boot();await x.registered.get('lab_increment').execute({amount:2});
  x.nodes.get('reset').click();assert.equal(x.state.count,0);
  assert.deepEqual([...x.state.calls],[]);
});
