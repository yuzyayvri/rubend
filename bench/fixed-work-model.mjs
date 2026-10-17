import assert from "node:assert/strict";

export const faces="URFDLB",solved=[...faces].map(face=>face.repeat(9)).join("");
const normal=[[0,1,0],[1,0,0],[0,0,1],[0,-1,0],[-1,0,0],[0,0,-1]];
const right=[[1,0,0],[0,0,-1],[1,0,0],[1,0,0],[0,0,1],[-1,0,0]];
const down=[[0,0,1],[0,-1,0],[0,-1,0],[0,0,-1],[0,-1,0],[0,-1,0]];
const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const rotate=(v,n)=>cross(v,n).map((x,i)=>x+n[i]*dot(v,n));
const stickers=normal.flatMap((n,f)=>Array.from({length:9},(_,i)=>({n,p:n.map((x,k)=>x+right[f][k]*(i%3-1)+down[f][k]*(Math.floor(i/3)-1))})));
const key=s=>`${s.n.join(",")}/${s.p.join(",")}`;
const indices=new Map(stickers.map((s,i)=>[key(s),i]));
const turns=normal.map(n=>stickers.map(s=>indices.get(key(dot(s.p,n)===1?{n:rotate(s.n,n),p:rotate(s.p,n)}:s))));
for(const turn of turns)assert.equal(new Set(turn).size,54);
export function apply(facelets,moves){
  assert.match(facelets,/^[URFDLB]{54}$/);
  let state=[...facelets];
  for(const move of moves){
    assert.ok(Number.isInteger(move)&&move>=0&&move<18);
    for(let power=0;power<move%3+1;power++){
      const next=state.slice();
      turns[Math.floor(move/3)].forEach((destination,source)=>{next[destination]=state[source];});
      state=next;
    }
  }
  return state.join("");
}

export function validateRecords(records,cases,slices){
  const snapshots=[],counts={snapshots:0,candidates:0,nodes:0};
  let cursor=0;
  for(const entry of cases){
    let previous=0;
    for(let slice=0;slice<=slices;slice++){
      const candidate=records[cursor]?.type==="candidate"?records[cursor++]:null;
      const record=records[cursor++];
      assert.equal(record?.type,"snapshot");
      assert.equal(record.id,entry.id);
      assert.equal(record.request,entry.request);
      assert.equal(record.slice,slice);
      for(const field of ["nodes","length","lower","status"])assert.ok(Number.isInteger(record[field])&&record[field]>=0,field);
      assert.ok(record.status!==4&&record.status<=4);
      assert.ok(record.nodes>=previous&&record.nodes-previous<=60000);
      assert.ok(record.lower<=record.length);
      assert.equal(Boolean(candidate),record.length<31);
      assert.ok(Array.isArray(record.state)&&record.state.length===3);
      if(candidate){
        assert.equal(candidate.length,record.length);
        assert.equal(candidate.moves.length,record.length);
        assert.deepEqual(candidate.moves,record.moves);
        assert.equal(candidate.nodes,record.nodes);
        assert.equal(candidate.lower,record.lower);
        assert.equal(candidate.optimal,Number(record.status===1));
        assert.equal(apply(entry.facelets,candidate.moves),solved);
        counts.candidates++;
      }else assert.deepEqual(record.moves,[]);
      if(record.status===1)assert.equal(record.lower,record.length);
      if(slice===0)assert.equal(record.nodes,0);
      previous=record.nodes;
      snapshots.push(record);
      counts.snapshots++;
    }
    const last=snapshots.at(-1);
    counts.nodes+=last.nodes;
    if(entry.depth!==undefined){
      assert.equal(last.status,1,`${entry.id} did not establish its shallow optimum within fixed work`);
      assert.equal(last.length,entry.depth);
      assert.equal(last.lower,entry.depth);
    }
  }
  assert.equal(cursor,records.length,"unexpected extra output");
  return {snapshots,counts};
}
