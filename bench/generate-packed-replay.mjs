import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();const [out,packingPath,movePath]=process.argv.slice(2);assert.equal(process.argv.length,5);const directory=resolve(out),packing=resolve(packingPath),move=resolve(movePath);for(const p of[directory,packing,move])assert.ok(p.startsWith(resolve("build")+"/"));mkdirSync(directory,{recursive:true});
const source=`import Base
import ${resolve("src/cubie.bend")} as C
import ${resolve("src/model.bend")} as M
import ${resolve("bench/piece-cells.bend")} as P
import ${resolve("bench/piece-cell-inverse.bend")} as I
import ${resolve("bench/reference-inversion.bend")} as R
import ${resolve("bench/subgroup-proof-kernel.bend")} as K
import ${packing} as T
import ${move} as A

def pack_injective(+left: P.PieceCells, +right: P.PieceCells, same: {T.pack(left) == T.pack(right) : C.Cubie}) -> {left == right : P.PieceCells}:
  P.facelets_injective(left, right, Equal.trans(M.Cube, P.to_facelets(left), C.to_facelets(T.pack(left)), P.to_facelets(right), Equal.sym(M.Cube, C.to_facelets(T.pack(left)), P.to_facelets(left), T.view_refinement(left)), Equal.trans(M.Cube, C.to_facelets(T.pack(left)), C.to_facelets(T.pack(right)), P.to_facelets(right), Equal.cong(C.Cubie, M.Cube, C.to_facelets, T.pack(left), T.pack(right), same), T.view_refinement(right))))

def step_inverse(+move: M.Move, +cells: P.PieceCells) -> {C.turn(M.index(M.inverse(move)), C.turn(M.index(move), T.pack(cells))) == T.pack(cells) : C.Cubie}:
  Equal.trans(C.Cubie, C.turn(M.index(M.inverse(move)), C.turn(M.index(move), T.pack(cells))), C.turn(M.index(M.inverse(move)), T.pack(P.turn(move, cells))), T.pack(cells), Equal.cong(C.Cubie, C.Cubie, cube => C.turn(M.index(M.inverse(move)), cube), C.turn(M.index(move), T.pack(cells)), T.pack(P.turn(move, cells)), A.move_refinement(move, cells)), Equal.trans(C.Cubie, C.turn(M.index(M.inverse(move)), T.pack(P.turn(move, cells))), T.pack(P.turn(M.inverse(move), P.turn(move, cells))), T.pack(cells), A.move_refinement(M.inverse(move), P.turn(move, cells)), Equal.cong(P.PieceCells, C.Cubie, T.pack, P.turn(M.inverse(move), P.turn(move, cells)), cells, I.inverse_step(move, cells))))

def inverse_word(word: +List<M.Move>) -> +List<M.Move>:
  I.inverse_word(word)

def word_cancel(+word: +List<M.Move>, +cells: P.PieceCells) -> {A.replay(inverse_word(word), A.replay(word, T.pack(cells))) == T.pack(cells) : C.Cubie}:
  Equal.trans(C.Cubie, A.replay(inverse_word(word), A.replay(word, T.pack(cells))), A.replay(inverse_word(word), T.pack(P.replay(word, cells))), T.pack(cells), Equal.cong(C.Cubie, C.Cubie, cube => A.replay(inverse_word(word), cube), A.replay(word, T.pack(cells)), T.pack(P.replay(word, cells)), A.replay_refinement(word, cells)), Equal.trans(C.Cubie, A.replay(inverse_word(word), T.pack(P.replay(word, cells))), T.pack(P.replay(inverse_word(word), P.replay(word, cells))), T.pack(cells), A.replay_refinement(inverse_word(word), P.replay(word, cells)), Equal.cong(P.PieceCells, C.Cubie, T.pack, P.replay(inverse_word(word), P.replay(word, cells)), cells, I.cancel_word(word, cells))))

def root(scramble: +List<M.Move>) -> C.Cubie:
  A.replay(scramble, C.solved())

def inverse_root(scramble: +List<M.Move>) -> C.Cubie:
  A.replay(inverse_word(scramble), C.solved())

def root_refinement(+scramble: +List<M.Move>) -> {root(scramble) == T.pack(R.root(scramble)) : C.Cubie}:
  Equal.trans(C.Cubie, root(scramble), A.replay(scramble, T.pack(P.solved_cells())), T.pack(R.root(scramble)), Equal.cong(C.Cubie, C.Cubie, cube => A.replay(scramble, cube), C.solved(), T.pack(P.solved_cells()), Equal.sym(C.Cubie, T.pack(P.solved_cells()), C.solved(), A.solved_packing())), A.replay_refinement(scramble, P.solved_cells()))

def inverse_root_refinement(+scramble: +List<M.Move>) -> {inverse_root(scramble) == T.pack(R.inverse_root(scramble)) : C.Cubie}:
  root_refinement(inverse_word(scramble))

def typed_solution(+scramble: +List<M.Move>, +word: +List<M.Move>, solution: {A.replay(word, root(scramble)) == C.solved() : C.Cubie}) -> {P.replay(word, R.root(scramble)) == P.solved_cells() : P.PieceCells}:
  pack_injective(P.replay(word, R.root(scramble)), P.solved_cells(), Equal.trans(C.Cubie, T.pack(P.replay(word, R.root(scramble))), A.replay(word, T.pack(R.root(scramble))), T.pack(P.solved_cells()), Equal.sym(C.Cubie, A.replay(word, T.pack(R.root(scramble))), T.pack(P.replay(word, R.root(scramble))), A.replay_refinement(word, R.root(scramble))), Equal.trans(C.Cubie, A.replay(word, T.pack(R.root(scramble))), A.replay(word, root(scramble)), T.pack(P.solved_cells()), Equal.cong(C.Cubie, C.Cubie, cube => A.replay(word, cube), T.pack(R.root(scramble)), root(scramble), Equal.sym(C.Cubie, root(scramble), T.pack(R.root(scramble)), root_refinement(scramble))), Equal.trans(C.Cubie, A.replay(word, root(scramble)), C.solved(), T.pack(P.solved_cells()), solution, Equal.sym(C.Cubie, T.pack(P.solved_cells()), C.solved(), A.solved_packing())))))

def invert_solution(+scramble: +List<M.Move>, +word: +List<M.Move>, solution: {A.replay(word, root(scramble)) == C.solved() : C.Cubie}) -> {A.replay(inverse_word(word), inverse_root(scramble)) == C.solved() : C.Cubie}:
  Equal.trans(C.Cubie, A.replay(inverse_word(word), inverse_root(scramble)), A.replay(inverse_word(word), T.pack(R.inverse_root(scramble))), C.solved(), Equal.cong(C.Cubie, C.Cubie, cube => A.replay(inverse_word(word), cube), inverse_root(scramble), T.pack(R.inverse_root(scramble)), inverse_root_refinement(scramble)), Equal.trans(C.Cubie, A.replay(inverse_word(word), T.pack(R.inverse_root(scramble))), T.pack(P.replay(inverse_word(word), R.inverse_root(scramble))), C.solved(), A.replay_refinement(inverse_word(word), R.inverse_root(scramble)), Equal.trans(C.Cubie, T.pack(P.replay(inverse_word(word), R.inverse_root(scramble))), T.pack(P.solved_cells()), C.solved(), Equal.cong(P.PieceCells, C.Cubie, T.pack, P.replay(inverse_word(word), R.inverse_root(scramble)), P.solved_cells(), R.invert_solution(scramble, word, typed_solution(scramble, word, solution))), A.solved_packing())))

def root_view(+scramble: +List<M.Move>) -> {C.to_facelets(root(scramble)) == P.to_facelets(R.root(scramble)) : M.Cube}:
  Equal.trans(M.Cube, C.to_facelets(root(scramble)), C.to_facelets(T.pack(R.root(scramble))), P.to_facelets(R.root(scramble)), Equal.cong(C.Cubie, M.Cube, C.to_facelets, root(scramble), T.pack(R.root(scramble)), root_refinement(scramble)), T.view_refinement(R.root(scramble)))

def inverse_root_view(+scramble: +List<M.Move>) -> {C.to_facelets(inverse_root(scramble)) == P.to_facelets(R.inverse_root(scramble)) : M.Cube}:
  root_view(inverse_word(scramble))

def bridge_apply(+scramble: +List<M.Move>, +first: M.Move, +suffix: +List<M.Move>, solution: {M.replay(first <> suffix, C.to_facelets(root(scramble))) == M.solved() : M.Cube}) -> {K.replay(M.inverse(first) <> K.inverse_suffix(suffix), C.to_facelets(inverse_root(scramble))) == M.solved() : M.Cube}:
  Equal.trans(M.Cube, K.replay(M.inverse(first) <> K.inverse_suffix(suffix), C.to_facelets(inverse_root(scramble))), K.replay(M.inverse(first) <> K.inverse_suffix(suffix), P.to_facelets(R.inverse_root(scramble))), M.solved(), Equal.cong(M.Cube, M.Cube, cube => K.replay(M.inverse(first) <> K.inverse_suffix(suffix), cube), C.to_facelets(inverse_root(scramble)), P.to_facelets(R.inverse_root(scramble)), inverse_root_view(scramble)), R.bridge_apply(scramble, first, suffix, Equal.trans(M.Cube, M.replay(first <> suffix, P.to_facelets(R.root(scramble))), M.replay(first <> suffix, C.to_facelets(root(scramble))), M.solved(), Equal.cong(M.Cube, M.Cube, cube => M.replay(first <> suffix, cube), P.to_facelets(R.root(scramble)), C.to_facelets(root(scramble)), Equal.sym(M.Cube, C.to_facelets(root(scramble)), P.to_facelets(R.root(scramble)), root_view(scramble))), solution)))

def bridge(+scramble: +List<M.Move>) -> K.InversionBridge(C.to_facelets(root(scramble)), C.to_facelets(inverse_root(scramble))):
  first => suffix => solution => bridge_apply(scramble, first, suffix, solution)

def test_root(scramble: +List<U32>) -> +List<U32>:
  T.packed_words(root(A.test_moves(scramble)))

def test_inverse_root(scramble: +List<U32>) -> +List<U32>:
  T.packed_words(inverse_root(A.test_moves(scramble)))

def test_cancel(scramble: +List<U32>, +word: +List<U32>) -> +List<U32>:
  T.packed_words(A.replay(inverse_word(A.test_moves(word)), A.replay(A.test_moves(word), root(A.test_moves(scramble)))))

def test_inverted_solution(scramble: +List<U32>, word: +List<U32>) -> +List<U32>:
  T.packed_words(A.replay(inverse_word(A.test_moves(word)), inverse_root(A.test_moves(scramble))))
`.replaceAll("C.Cubie, T.pack,", "C.Cubie, cells => T.pack(cells),");
writeFileSync(resolve(directory,"packed-replay.bend"),source,{flag:"wx"});const hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex");writeFileSync(resolve(directory,"manifest.json"),JSON.stringify({format:"rubend-packed-replay-v1",sourceHashes:Object.fromEntries(["src/cubie.bend","src/model.bend","bench/piece-cells.bend","bench/piece-cell-inverse.bend","bench/piece-cell-composition.bend","bench/reference-inversion.bend","bench/subgroup-proof-kernel.bend",packing,move].map(p=>[p,hash(p)])),outputSha256:hash(resolve(directory,"packed-replay.bend")),packedInverseFunctionProved:false,validatedInputReachabilityProved:false,loadedAdmissibilityProved:false},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({passed:true,bytes:source.length,directory}));
