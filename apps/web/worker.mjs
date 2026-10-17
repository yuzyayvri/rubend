import { apply, solved, validate, parse } from "../model.mjs";

function random(limit){const values=new Uint32Array(1),ceiling=Math.floor(4294967296/limit)*limit;do{crypto.getRandomValues(values);}while(values[0]>=ceiling);return values[0]%limit;}
self.onmessage=({data})=>{
  try {
    let facelets=data.facelets, moves=[];
    if(data.type==="apply") {moves=data.moves;facelets=apply(facelets,moves);}
    else if(data.type==="input") {
      const text=data.text.trim();
      const compact=text.replace(/\s/g,"").toUpperCase();
      if(/^[URFDLB]{54}$/.test(compact))facelets=compact;
      else {moves=parse(text);facelets=apply(solved,moves);}
    } else if(data.type==="scramble") {
      let previous=-1;
      for(let i=0;i<25;i++){let m;do{m=random(18);}while(Math.floor(m/3)===previous);moves.push(m);previous=Math.floor(m/3);}
      facelets=apply(solved,moves);
    } else if(data.type!=="validate") throw Error("Unknown model operation");
    validate(facelets);
    self.postMessage({id:data.id,facelets,moves,solved:facelets===solved});
  }catch(error){self.postMessage({id:data.id,error:error.message});}
};
