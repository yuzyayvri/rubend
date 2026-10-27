import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {spawnSync} from "node:child_process";
import {stripBendEqualities} from "../bench/strip-bend-equalities.mjs";

assert.equal(process.argv.length,3);const directory=resolve(process.argv[2]);assert.ok(directory.startsWith(resolve("build")+"/"));mkdirSync(directory);const source="import Base\n\ndef claim() -> {0 == 1 : U32}:\n  {==}\n\ntype Choice is Data:\n  First{}\n  Second{}\n\ndef choose(value: Choice) -> U32:\n  match value:\n    case First{}: 0\n    case Second{}: 1\n\ndef test_choice(value: U32) -> U32:\n  match value:\n    case 0: choose(First{})\n    case _: choose(Second{})\n",path=resolve(directory,"runtime.bend"),module=resolve(directory,"runtime.mjs");writeFileSync(path,stripBendEqualities(source),{flag:"wx"});const r=spawnSync("bend",[path,"-o",module],{encoding:"utf8",timeout:30000,maxBuffer:1024*1024});assert.ifError(r.error);writeFileSync(resolve(directory,"compile-result.json"),JSON.stringify({status:r.status,stdout:r.stdout,stderr:r.stderr})+"\n",{flag:"wx"});assert.equal(r.status,0,"Runtime stripping must preserve Choice and its constructors: "+r.stdout+r.stderr);const P=(await import(pathToFileURL(module))).default;assert.equal(P.test_choice(0),0);assert.equal(P.test_choice(1),1);console.log(JSON.stringify({passed:true,typeDeclarationsPreserved:true,backendChoices:2}));
