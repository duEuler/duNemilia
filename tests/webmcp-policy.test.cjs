'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {requiresApproval,shouldRetryAfterAmbiguousError}=require('../security/webmcp-policy.js');
test('missing hints => approval (fail closed)',()=>{assert.equal(requiresApproval({}),true);assert.equal(shouldRetryAfterAmbiguousError({}),false)});
test('explicit non-consequential but not read-only => approval',()=>{assert.equal(requiresApproval({readOnlyHint:false,consequentialHint:false}),true)});
test('explicit read-only => no mandatory approval',()=>{assert.equal(requiresApproval({readOnlyHint:true,consequentialHint:false}),false)});
test('contradictory hints => approval',()=>{assert.equal(requiresApproval({readOnlyHint:true,consequentialHint:true}),true)});
test('unknown/null hints => approval',()=>{assert.equal(requiresApproval(null),true);assert.equal(requiresApproval(undefined),true)});
