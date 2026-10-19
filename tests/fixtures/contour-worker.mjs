#!/usr/bin/env node
import {createReadStream} from "node:fs";
import {createInterface} from "node:readline";

const codes={forward:0,"inverse-one":1,"inverse-three":3,corner:4,combined:7,h0:8,"h0-combined":11};
const profile=codes[process.env.RUBEND_CONTOUR_PROFILE],target=Number(process.env.RUBEND_CONTOUR_TARGET);
const emit=event=>console.log(JSON.stringify(event));
emit({type:"ready"});
createInterface({input:createReadStream(process.argv[2],{flags:"r+"})}).on("line",line=>{
  const solved=line.split("\t")[0]==="UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
  if(solved)emit({type:"candidate",moves:[],length:0,lower:0});
  emit({type:"measurement",profile,target,nativeMs:1,bound:solved?0:target,status:solved?1:0,moves:[]});
  emit({type:"done",length:solved?0:31,lower:solved?0:target,nodes:1,optimal:solved?1:0});
});
