#!/usr/bin/env node
'use strict';
/**
 * Source-compatible PRIVATE RC validator.
 * Usage: node tools/validate_webmcp_probe.cjs path/to/extracted/background.js [path/to/patched/background.js]
 * Does not embed or publish Nemilia release-candidate code.
 * Simulates only probe scan/exec, not Chrome extension approval UI.
 */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {requiresApproval}=require('../security/webmcp-policy.js');
const paths=process.argv.slice(2);
if(!paths.length){console.error('Usage: node tools/validate_webmcp_probe.cjs path/to/background.js [patched/background.js]');process.exit(64)}
async function testFile(file){
 const source=fs.readFileSync(file,'utf8');
 const begin=source.indexOf('async function NEM_WEBMCP_PROBE(');
 const end=source.indexOf('\nconst NEM_WEBMCP_EXEC_TIMEOUT_MS',begin);
 if(begin<0||end<begin)throw Error('WebMCP probe boundaries not found; review version manually');
 const code=source.slice(begin,end)+'\nthis.probe=NEM_WEBMCP_PROBE;';
 const results=[];
 for(const major of [154,155,156]){
  for(const annotations of [{},{readOnlyHint:false,consequentialHint:false},{readOnlyHint:true,consequentialHint:false}]){
   let effects=0;
   const tool={name:'synthetic',inputSchema:{type:'object'},annotations};
   const ctx={getTools:async()=>[tool],executeTool:async()=>{
     effects++;
     if(effects===1)throw Error('Failed to parse input arguments');
     return {content:'ok'};
   }};
   const sandbox={document:{modelContext:ctx},navigator:{userAgent:'Chrome/'+major+'.0'},location:{origin:'https://example.invalid'}};
   vm.createContext(sandbox);vm.runInContext(code,sandbox,{timeout:2000});
   const listing=await sandbox.probe('scan',{});
   const execution=await sandbox.probe('exec',{name:'synthetic',args:{},expectOrigin:'https://example.invalid'});
   const reported=listing.tools[0].annotations.consequentialHint;
   results.push({browser:major,annotations,reportedConsequential:reported,expectedApproval:requiresApproval(annotations),
      effects,retried:effects>1,returnedError:execution.error||null});
  }
 }
 return {file,scenarios:results};
}
(async()=>{
 const reports=[];
 for(const file of paths)reports.push(await testFile(file));
 console.log(JSON.stringify({schema:'duNemilia/webmcp-probe-evidence/v1',reports},null,2));
 if(reports.length===2){
  const [original,patched]=reports;
  assert.equal(original.scenarios.length,patched.scenarios.length);
  for(const s of patched.scenarios){
    if(s.expectedApproval){
      assert.equal(s.reportedConsequential,true,'fail-closed classification');
      assert.equal(s.effects,1,'no ambiguous retry on consequential operation');
    }
  }
 }
})().catch(e=>{console.error(e);process.exit(1)});
