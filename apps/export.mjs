import {apply,validate,solved,moveNames} from "./model.mjs";

export function solveRecord(solution,run={}){
  validate(solution.origin);
  if(apply(solution.origin,solution.moves)!==solved)throw Error("Cannot export an unverified solution");
  if(!Number.isInteger(solution.lower)||solution.lower<0||solution.lower>solution.moves.length)throw Error("Invalid solution bound");
  if(solution.optimal&&solution.lower!==solution.moves.length)throw Error("Optimality bound mismatch");
  return {format:"rubend-solve-v1",facelets:solution.origin,moves:solution.moves.map(m=>moveNames[m]),htm:solution.moves.length,lowerBound:solution.lower,searchOptimal:Boolean(solution.optimal),replayCertified:true,mode:run.mode??null,budgetMs:run.budgetMs??null,optimalityNote:"Search-established status recorded by this run; this JSON is not a formal optimality proof."};
}
