import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {basename} from "node:path";
import {createHash} from "node:crypto";

const before="build/experiments/h0-release-v3",after="build/experiments/h0-release-v5",a=readFileSync(before),b=readFileSync(after);
assert.deepEqual(JSON.parse(readFileSync(before+".json")).sourceHashes,JSON.parse(readFileSync(after+".json")).sourceHashes);
function strings(bytes){assert.deepEqual([...bytes.subarray(0,6)],[127,69,76,70,2,1]);const offset=Number(bytes.readBigUInt64LE(40)),width=bytes.readUInt16LE(58),count=bytes.readUInt16LE(60),names=offset+bytes.readUInt16LE(62)*width,nameStart=Number(bytes.readBigUInt64LE(names+24));for(let i=0;i<count;i++){const h=offset+i*width,n=nameStart+bytes.readUInt32LE(h);if(bytes.subarray(n,bytes.indexOf(0,n)).toString()===".strtab"){assert.equal(bytes.readBigUInt64LE(h+8),0n);return {offset:Number(bytes.readBigUInt64LE(h+24)),size:Number(bytes.readBigUInt64LE(h+32))};}}throw Error("Missing non-allocated ELF string table");}
const sa=strings(a),sb=strings(b);assert.deepEqual(sa,sb);assert.equal(a.length,b.length);const differences=[];for(let i=0;i<a.length;i++)if(a[i]!==b[i]){assert.ok(i>=sa.offset&&i<sa.offset+sa.size);differences.push(i);}
const oldName=basename(before)+".c",newName=basename(after)+".c",oldAt=a.indexOf(oldName,sa.offset),newAt=b.indexOf(newName,sb.offset);assert.equal(oldAt,newAt);assert.ok(oldAt>=sa.offset&&oldAt+oldName.length<=sa.offset+sa.size);assert.equal(oldName.length,newName.length);
const normalized=Buffer.from(b);normalized.write(oldName,newAt,"ascii");assert.deepEqual(normalized,a);
const hash=x=>createHash("sha256").update(x).digest("hex"),report={passed:true,beforeSha256:hash(a),afterSha256:hash(b),sourceGraphsEqual:true,allAllocatedCodeAndDataEqual:true,differences,onlyDifference:"Compiler output filename in non-allocated ELF .strtab",normalizedWholeBinaryEqual:true};writeFileSync("build/evidence/h0-reference-restoration.json",JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify(report));
