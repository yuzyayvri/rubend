import assert from "node:assert/strict";
import {Transform} from "node:stream";
import {createHash} from "node:crypto";

export function byteMeter(limit){assert.ok(Number.isSafeInteger(limit)&&limit>0);let bytes=0;const hash=createHash("sha256"),stream=new Transform({transform(chunk,encoding,done){bytes+=chunk.length;if(bytes>limit)return done(Error("Byte stream exceeds admission"));hash.update(chunk);done(null,chunk);}});return{stream,snapshot:()=>({bytes,sha256:hash.copy().digest("hex")})};}
