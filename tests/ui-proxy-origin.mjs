import assert from "node:assert/strict";
import {proxyTarget} from "./support/ui-proxy.mjs";

const publicOrigin=new URL("http://127.0.0.1:1200"),upstream=new URL("http://127.0.0.1:1400"),headers={host:publicOrigin.host,origin:publicOrigin.origin};
assert.equal(proxyTarget(headers,"/api/solve",publicOrigin,upstream).href,"http://127.0.0.1:1400/api/solve");
assert.equal(proxyTarget({host:publicOrigin.host},"/",publicOrigin,upstream).origin,upstream.origin);
for(const [h,path]of[[{...headers,host:"wrong"},"/"],[{...headers,origin:"https://example.com"},"/"],[headers,"http://example.com/"],[headers,"//example.com/"],[headers,"/\\example.com/"],[headers,"///example.com/"],[headers,""],[headers,null]])assert.equal(proxyTarget(h,path,publicOrigin,upstream),null);
console.log(JSON.stringify({passed:true,loopbackTargetPreserved:true,rejectedOriginAndUrlEscapes:8}));
