export function refineSolution(solution,event){
  if(!solution)return null;
  const lower=event.lower??solution.lower;
  if(!Number.isInteger(lower)||lower<solution.lower||lower>solution.moves.length)throw Error("Invalid solution progress bound");
  const optimal=Boolean(solution.optimal||event.optimal);
  if(optimal&&lower!==solution.moves.length)throw Error("Optimality progress bound mismatch");
  return {...solution,lower,optimal};
}
