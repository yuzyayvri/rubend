import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {isAbsolute,basename} from "node:path";

export function nixCliPath(name){assert.ok(["nix","nix-store"].includes(name));const path=execFileSync("which",[name],{encoding:"utf8"}).trim();assert.ok(isAbsolute(path));assert.equal(basename(path),name);return path;}
