import { spawn, spawnSync } from "node:child_process";
import { EventEmitter } from "node:events";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { mkdtempSync, createWriteStream, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { validate, apply, solved } from "./model.mjs";

export class Engine extends EventEmitter {
  constructor({binary=process.env.RUBEND_BINARY??resolve("build/rubend")}={}) {
    super();
    this.generation = 0;
    this.closed = false;
    this.failure = null;
    this.job = null;
    this.binary=binary;
    this.start();
  }
  start() {
    if(this.closed) return;
    const generation = ++this.generation;
    this.available = false;
    this.failure = null;
    const directory = mkdtempSync(resolve(tmpdir(), "rubend-"));
    this.directory=directory;
    const fifo = resolve(directory, "input");
    const made = spawnSync("mkfifo", ["--mode=600", fifo], { encoding: "utf8" });
    if(made.status !== 0){rmdirSync(directory);throw Error(`Cannot create engine pipe: ${made.stderr}`);}
    const input = createWriteStream(fifo,{flags:"r+"});
    input.on("error", error => { if(this.generation === generation && !this.closed) this.fail(error.message); });
    this.input = input;
    this.child = spawn("stdbuf", ["-oL", "-eL", this.binary, fifo, "--threads", "1"], {
      stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, BEND_NO_TELEMETRY: "1" },
    });
    let buffer = "";
    let stderr = "";
    this.child.stderr.on("data", data => { stderr = (stderr + data).slice(-4000); });
    this.child.stdout.on("data", data => {
      if(this.generation !== generation) return;
      buffer += data;
      if(buffer.length > 128 * 1024) return this.fail("Engine output exceeded its limit.");
      for(;;) {
        const index = buffer.indexOf("\n");
        if(index < 0) break;
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);
        try { this.receive(JSON.parse(line)); }
        catch(error) { this.fail(`Engine protocol failure: ${error.message}`); return; }
      }
    });
    this.child.on("error", error => { if(this.generation === generation) this.fail(error.message); });
    this.childStopped=new Promise(resolve=>this.child.on("close",()=>{
      input.destroy();
      try { unlinkSync(fifo); rmdirSync(directory); } catch {}
      resolve();
    }));
    this.child.on("exit", code => {
      if(this.generation !== generation || this.closed) return;
      this.available = false;
      this.failure = `Native engine stopped (${code}). ${stderr}`;
      const job = this.job;
      this.job = null;
      if(job)clearTimeout(job.timer);
      if(job) job.onEvent({ type: "error", message: `Engine stopped (${code}). ${stderr}` });
      this.emit("unavailable");
    });
  }
  receive(event) {
    if(event.type === "ready") { this.available = true; this.emit("ready"); return; }
    if(event.type === "initializing") return;
    const job = this.job;
    if(!job) return;
    if(event.type === "candidate") {
      if(!Array.isArray(event.moves) || event.moves.length !== event.length || event.length > 30 || event.moves.some(m => !Number.isInteger(m) || m < 0 || m >= 18)) throw Error("Invalid candidate shape");
      if(apply(job.facelets, event.moves) !== solved) throw Error("Candidate replay mismatch");
      if(event.length > job.bestLength) throw Error("Candidate quality regressed");
      if(!Number.isInteger(event.lower) || event.lower < job.lower || event.lower > event.length) throw Error("Invalid lower bound");
      job.bestLength = event.length;
      job.best = event.moves;
      job.lower = event.lower;
    }
    if(event.type === "progress") {
      if(!Number.isInteger(event.lower) || event.lower < job.lower || event.lower > job.bestLength) throw Error("Lower bound regressed");
      job.lower = event.lower;
      const now=performance.now();
      if(now-job.lastProgress<50)return;
      job.lastProgress=now;
    }
    if(event.optimal && (!job.best || event.lower !== job.bestLength)) throw Error("Unsubstantiated optimality status");
    event.elapsedMs = Math.round(performance.now() - job.started);
    job.onEvent(event);
    if(event.type === "done" || event.type === "invalid") {
      clearTimeout(job.timer);
      this.job = null;
    }
  }
  async ready(timeout = 10_000) {
    if(this.available) return;
    if(this.closed) throw Error("Engine is closed");
    if(this.failure)throw Error(this.failure);
    await new Promise((resolveReady, reject) => {
      const timer = setTimeout(() => { this.off("ready", done); this.off("unavailable", failed); reject(Error("Engine did not initialize")); }, timeout);
      const done = () => { clearTimeout(timer); this.off("unavailable", failed); resolveReady(); };
      const failed = () => { clearTimeout(timer); this.off("ready", done); reject(Error("Engine stopped during initialization")); };
      this.once("ready", done);
      this.once("unavailable", failed);
    });
  }
  async solve({ facelets, mode = "fast", budgetMs = 2000 }, onEvent) {
    validate(facelets);
    if(!["fast", "exact"].includes(mode) || !Number.isInteger(budgetMs) || budgetMs < 50 || budgetMs > 30000) throw Error("Invalid search budget or mode");
    if(this.job) throw Error("The engine is already working.");
    await this.ready();
    if(this.job) throw Error("The engine is already working.");
    const job = { facelets, mode, budgetMs, onEvent, bestLength: 31, best: null, lower: 0, started: performance.now(),lastProgress:-Infinity };
    this.job = job;
    job.timer = setTimeout(() => {
      if(this.job === job) { job.onEvent({ type: "done", reason: "time_limit", optimal: 0, lower: job.lower, length: job.bestLength }); this.cancel(); }
    }, budgetMs + 2000);
    this.input.write(`${facelets}\t${mode}\t${budgetMs}\n`);
    return () => { if(this.job === job) this.cancel(); };
  }
  cancel() {
    if(this.job) clearTimeout(this.job.timer);
    this.job = null;
    ++this.generation;
    this.child?.kill("SIGTERM");
    this.start();
  }
  fail(message) {
    const job = this.job;
    if(job) job.onEvent({ type: "error", message });
    if(job)clearTimeout(job.timer);
    this.job=null;
    this.available=false;
    this.failure=message;
    ++this.generation;
    this.child?.kill("SIGTERM");
    this.emit("unavailable");
  }
  close() {
    if(this.closing)return this.closing;
    this.closed = true;
    if(this.job) clearTimeout(this.job.timer);
    this.job = null;
    ++this.generation;
    const child=this.child;
    this.closing=this.childStopped??Promise.resolve();
    child?.kill("SIGTERM");
    return this.closing;
  }
}
