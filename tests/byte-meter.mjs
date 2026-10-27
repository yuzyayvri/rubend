import assert from "node:assert/strict";
import {Readable,Writable} from "node:stream";
import {pipeline} from "node:stream/promises";
import {createHash} from "node:crypto";
import {byteMeter} from "../bench/byte-meter.mjs";

const sink=()=>new Writable({write(chunk,encoding,done){done();}}),meter=byteMeter(6);await pipeline(Readable.from([Buffer.from("abc"),Buffer.from("def")]),meter.stream,sink());assert.deepEqual(meter.snapshot(),{bytes:6,sha256:createHash("sha256").update("abcdef").digest("hex")});assert.deepEqual(meter.snapshot(),meter.snapshot());const tooSmall=byteMeter(5);await assert.rejects(pipeline(Readable.from([Buffer.from("abcdef")]),tooSmall.stream,sink()),/exceeds admission/);for(const n of[0,-1,1.5,NaN,Infinity])assert.throws(()=>byteMeter(n));console.log(JSON.stringify({passed:true,completeStreamHash:true,repeatSnapshotStable:true,oversizedStreamRejected:true,invalidLimits:5}));
