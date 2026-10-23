import assert from "node:assert/strict";
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {encode,apply,inverse,solved,list,array} from "../apps/model.mjs";
import {randomSource} from "./support.mjs";

assert.equal(process.argv.length,5);
const R=(await import(pathToFileURL(resolve(process.argv[2])))).default,W=(await import(pathToFileURL(resolve(process.argv[3])))).default,random=randomSource("rubend-reference-inversion-v1");
let mutation=null,totalMoves=0;
for(let i=0;i<1000;i++){
  const a=Array.from({length:random(32)},()=>random(18)),b=Array.from({length:random(32)},()=>random(18)),ai=[...a].reverse().map(inverse),move=random(18),solution=[...ai,move,inverse(move)],expected=apply(solved,[...a,...b]);
  assert.equal(encode(R.test_compose(list(a),list(b))),expected);assert.equal(encode(R.test_inverse(list(a))),apply(solved,ai));assert.equal(encode(R.test_inverse_solution(list(a),list(solution))),solved);
  assert.equal(encode(R.test_inverse(list([...a,move,inverse(move)]))),encode(R.test_inverse(list(a))));
  assert.deepEqual(array(R.test_inverse_numbers(R.test_inverse_numbers(list(a)))),a);totalMoves+=a.length+b.length+solution.length;
  if(!mutation){const observed=encode(W.test_compose(list(a),list(b)));if(observed!==expected)mutation={a,b,expected,observed};}
}
assert.ok(mutation,"Actual missing-orientation substitution must fail");
const ab=encode(R.test_compose(list([0]),list([3]))),ba=encode(R.test_compose(list([3]),list([0])));assert.notEqual(ab,ba);
writeFileSync(resolve(process.argv[4]),JSON.stringify({passed:true,seed:"rubend-reference-inversion-v1",cases:1000,compositionChecks:1000,inverseChecks:1000,solutionInversionChecks:1000,inverseRepresentationChecks:1000,wordInvolutionChecks:1000,totalMoves,noncommutingOrder:{a:[0],b:[3],ab,ba},mutation,sampleEvidenceOnly:true,packedInverseProved:false,loadedAdmissibilityProved:false,independentReview:false})+"\n",{flag:"wx"});
console.log(JSON.stringify({passed:true,cases:1000,totalMoves,actualSubstitutionMutationRejected:true}));
