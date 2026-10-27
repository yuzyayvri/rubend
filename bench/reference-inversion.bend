import Base
import ../src/model.bend as M
import ./piece-cells.bend as P
import ./piece-cell-inverse.bend as I
import ./piece-cell-composition.bend as C
import ./subgroup-proof-kernel.bend as K

def root(scramble: +List<M.Move>) -> P.PieceCells:
  P.replay(scramble, P.solved_cells())

def inverse_root(scramble: +List<M.Move>) -> P.PieceCells:
  P.replay(I.inverse_word(scramble), P.solved_cells())

def compose_inverse(+scramble: +List<M.Move>) -> {C.compose(inverse_root(scramble), root(scramble)) == P.solved_cells() : P.PieceCells}:
  Equal.trans(P.PieceCells, C.compose(inverse_root(scramble), root(scramble)), P.replay(scramble, C.compose(inverse_root(scramble), P.solved_cells())), P.solved_cells(), C.compose_word(inverse_root(scramble), scramble, P.solved_cells()), Equal.trans(P.PieceCells, P.replay(scramble, C.compose(inverse_root(scramble), P.solved_cells())), P.replay(scramble, inverse_root(scramble)), P.solved_cells(), Equal.cong(P.PieceCells, P.PieceCells, cells => P.replay(scramble, cells), C.compose(inverse_root(scramble), P.solved_cells()), inverse_root(scramble), C.compose_identity(inverse_root(scramble))), I.cancel_reverse(scramble, P.solved_cells())))

def solution_inverse(+scramble: +List<M.Move>, +word: +List<M.Move>, solution: {P.replay(word, root(scramble)) == P.solved_cells() : P.PieceCells}) -> {inverse_root(scramble) == P.replay(word, P.solved_cells()) : P.PieceCells}:
  Equal.trans(P.PieceCells, inverse_root(scramble), C.compose(inverse_root(scramble), P.solved_cells()), P.replay(word, P.solved_cells()), Equal.sym(P.PieceCells, C.compose(inverse_root(scramble), P.solved_cells()), inverse_root(scramble), C.compose_identity(inverse_root(scramble))), Equal.trans(P.PieceCells, C.compose(inverse_root(scramble), P.solved_cells()), C.compose(inverse_root(scramble), P.replay(word, root(scramble))), P.replay(word, P.solved_cells()), Equal.cong(P.PieceCells, P.PieceCells, cells => C.compose(inverse_root(scramble), cells), P.solved_cells(), P.replay(word, root(scramble)), Equal.sym(P.PieceCells, P.replay(word, root(scramble)), P.solved_cells(), solution)), Equal.trans(P.PieceCells, C.compose(inverse_root(scramble), P.replay(word, root(scramble))), P.replay(word, C.compose(inverse_root(scramble), root(scramble))), P.replay(word, P.solved_cells()), C.compose_word(inverse_root(scramble), word, root(scramble)), Equal.cong(P.PieceCells, P.PieceCells, cells => P.replay(word, cells), C.compose(inverse_root(scramble), root(scramble)), P.solved_cells(), compose_inverse(scramble)))))

def invert_solution(+scramble: +List<M.Move>, +word: +List<M.Move>, solution: {P.replay(word, root(scramble)) == P.solved_cells() : P.PieceCells}) -> {P.replay(I.inverse_word(word), inverse_root(scramble)) == P.solved_cells() : P.PieceCells}:
  Equal.trans(P.PieceCells, P.replay(I.inverse_word(word), inverse_root(scramble)), P.replay(I.inverse_word(word), P.replay(word, P.solved_cells())), P.solved_cells(), Equal.cong(P.PieceCells, P.PieceCells, cells => P.replay(I.inverse_word(word), cells), inverse_root(scramble), P.replay(word, P.solved_cells()), solution_inverse(scramble, word, solution)), I.cancel_word(word, P.solved_cells()))

def inverse_unique(+a: +List<M.Move>, +b: +List<M.Move>, same: {root(a) == root(b) : P.PieceCells}) -> {inverse_root(a) == inverse_root(b) : P.PieceCells}:
  solution_inverse(a, I.inverse_word(b), Equal.trans(P.PieceCells, P.replay(I.inverse_word(b), root(a)), P.replay(I.inverse_word(b), root(b)), P.solved_cells(), Equal.cong(P.PieceCells, P.PieceCells, cells => P.replay(I.inverse_word(b), cells), root(a), root(b), same), I.cancel_word(b, P.solved_cells())))

def typed_solution(+scramble: +List<M.Move>, +word: +List<M.Move>, solution: {M.replay(word, P.to_facelets(root(scramble))) == M.solved() : M.Cube}) -> {P.replay(word, root(scramble)) == P.solved_cells() : P.PieceCells}:
  P.facelets_injective(P.replay(word, root(scramble)), P.solved_cells(), Equal.trans(M.Cube, P.to_facelets(P.replay(word, root(scramble))), M.replay(word, P.to_facelets(root(scramble))), P.to_facelets(P.solved_cells()), P.replay_refinement(word, root(scramble)), Equal.trans(M.Cube, M.replay(word, P.to_facelets(root(scramble))), M.solved(), P.to_facelets(P.solved_cells()), solution, Equal.sym(M.Cube, P.to_facelets(P.solved_cells()), M.solved(), P.solved_refinement()))))

def reference_inverse_word(+scramble: +List<M.Move>, +word: +List<M.Move>, solution: {M.replay(word, P.to_facelets(root(scramble))) == M.solved() : M.Cube}) -> {M.replay(I.inverse_word(word), P.to_facelets(inverse_root(scramble))) == M.solved() : M.Cube}:
  Equal.trans(M.Cube, M.replay(I.inverse_word(word), P.to_facelets(inverse_root(scramble))), P.to_facelets(P.replay(I.inverse_word(word), inverse_root(scramble))), M.solved(), Equal.sym(M.Cube, P.to_facelets(P.replay(I.inverse_word(word), inverse_root(scramble))), M.replay(I.inverse_word(word), P.to_facelets(inverse_root(scramble))), P.replay_refinement(I.inverse_word(word), inverse_root(scramble))), Equal.trans(M.Cube, P.to_facelets(P.replay(I.inverse_word(word), inverse_root(scramble))), P.to_facelets(P.solved_cells()), M.solved(), Equal.cong(P.PieceCells, M.Cube, P.to_facelets, P.replay(I.inverse_word(word), inverse_root(scramble)), P.solved_cells(), invert_solution(scramble, word, typed_solution(scramble, word, solution))), P.solved_refinement()))

def bridge_apply(+scramble: +List<M.Move>, +first: M.Move, +suffix: +List<M.Move>, solution: {M.replay(first <> suffix, P.to_facelets(root(scramble))) == M.solved() : M.Cube}) -> {K.replay(M.inverse(first) <> K.inverse_suffix(suffix), P.to_facelets(inverse_root(scramble))) == M.solved() : M.Cube}:
  Equal.trans(M.Cube, K.replay(M.inverse(first) <> K.inverse_suffix(suffix), P.to_facelets(inverse_root(scramble))), M.replay(K.forward_word(K.inverse_suffix(first <> suffix)), P.to_facelets(inverse_root(scramble))), M.solved(), K.forward_replay(K.inverse_suffix(first <> suffix), P.to_facelets(inverse_root(scramble))), Equal.trans(M.Cube, M.replay(K.forward_word(K.inverse_suffix(first <> suffix)), P.to_facelets(inverse_root(scramble))), M.replay(I.inverse_word(first <> suffix), P.to_facelets(inverse_root(scramble))), M.solved(), Equal.cong(+List<M.Move>, M.Cube, word => M.replay(word, P.to_facelets(inverse_root(scramble))), K.forward_word(K.inverse_suffix(first <> suffix)), I.inverse_word(first <> suffix), Equal.sym(+List<M.Move>, I.inverse_word(first <> suffix), K.forward_word(K.inverse_suffix(first <> suffix)), I.inverse_kernel_word(first <> suffix))), reference_inverse_word(scramble, first <> suffix, solution)))

def bridge(+scramble: +List<M.Move>) -> K.InversionBridge(P.to_facelets(root(scramble)), P.to_facelets(inverse_root(scramble))):
  first => suffix => solution => bridge_apply(scramble, first, suffix, solution)

def first_exclusion(-inside: M.Cube -> Bool, -member: M.Move -> Bool, +scramble: +List<M.Move>, +first: M.Move, +suffix: +List<M.Move>, +bound: Nat, identity: {inside(M.solved()) == True{} : Bool}, closed: K.Closed(inside, member), admissible: K.AdmissibleAt(inside, P.to_facelets(inverse_root(scramble)), bound), tight: K.Le(1n+K.length(suffix), bound), solution: {M.replay(first <> suffix, P.to_facelets(root(scramble))) == M.solved() : M.Cube}) -> {member(first) != True{} : Bool}:
  K.inverse_first_exclusion(inside, member, P.to_facelets(root(scramble)), P.to_facelets(inverse_root(scramble)), first, suffix, bound, identity, closed, admissible, bridge(scramble), tight, solution)
