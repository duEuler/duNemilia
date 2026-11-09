'use strict';
/** Minimal independent fail-closed WebMCP classification reference. No third-party code. */
function requiresApproval(annotations) {
  const a=annotations && typeof annotations==='object'?annotations:{};
  return a.readOnlyHint!==true || a.consequentialHint===true;
}
function shouldRetryAfterAmbiguousError(annotations) {
  // Never retry consequential or annotation-unknown tools.
  return !requiresApproval(annotations);
}
module.exports={requiresApproval,shouldRetryAfterAmbiguousError};
