import assert from "node:assert/strict";

const pins=Object.freeze({
  legacy:Object.freeze({runId:39291425745,artifactId:12205837803,commit:"a7a087235b20b38767b216b0ab90523ac1a2b13f",zipSha256:"e32162972ca3d36a17125fc069862d5ca7f5e3709228b3148d84b9f62ecdcb84",sizeBytes:89005889}),
  redesign:Object.freeze({runId:39787894581,artifactId:12429624367,commit:"369f480ca8a0af485c2c7b2c885bc9f09f8dc869",zipSha256:"ad938f114f6f565c269ba746d26f26aa3193cae974ad9808e5fec4adcc8e9dbe",sizeBytes:89005404})
});
export function deliveryPin(name="legacy"){
  assert.ok(Object.hasOwn(pins,name),"Unknown pinned delivery: "+name);
  return pins[name];
}
