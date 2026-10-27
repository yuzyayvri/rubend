import Base
import ../src/model.bend as M
import ../src/model-laws.bend as L
import ./piece-cells.bend as P
import ./piece-cell-inverse.bend as I
import ./reference-inversion.bend as R
import ./subgroup-proof-kernel.bend as K
import ./np01-group.bend as G

def double_member(-inside: P.PieceCells -> Type, +first: M.Move, member: inside(P.turn(first, P.solved_cells()))) -> inside(P.turn(M.inverse(M.inverse(first)), P.solved_cells())):
  %Equal.sym(M.Move, M.inverse(M.inverse(first)), first, L.inverse_involution(first)) : inside(P.turn(_, P.solved_cells()))
  member

def inverse_below(+suffix: +List<M.Move>, -bound: Nat, below: K.Le(bound, K.length(I.inverse_word(suffix)))) -> K.Le(bound, K.length(suffix)):
  %I.inverse_length(suffix) : K.Le(bound, _)
  below

law np03_first:
  for -inside: P.PieceCells -> Type
  for h: P.PieceCells -> Nat
  for +reaching: +List<M.Move>
  for +first: M.Move
  for +suffix: +List<M.Move>
  for subgroup: G.Subgroup<inside>
  for admissible: G.Admissible(inside, h)
  for tight: K.Le(1n+K.length(suffix), h(R.inverse_root(reaching)))
  for solution: {P.replay(first <> suffix, R.root(reaching)) == P.solved_cells() : P.PieceCells}
  inside(P.turn(first, P.solved_cells())) -> Empty

def np03_first(inside, h, reaching, first, suffix, subgroup, admissible, tight, solution):
  member =>
    inverse_solution = R.invert_solution(reaching, first <> suffix, solution)
    prefix_member = G.prefix_inside(inside, R.inverse_root(reaching), I.inverse_word(suffix), M.inverse(first), inverse_solution, double_member(inside, first, member))
    below = admissible(I.inverse_word(reaching), I.inverse_word(suffix), prefix_member)
    K.gap_impossible(K.length(suffix), h(R.inverse_root(reaching)), tight, inverse_below(suffix, h(R.inverse_root(reaching)), below))

def identity_first_example() -> G.Identity(P.turn(M.Ui{}, P.solved_cells())) -> Empty:
  np03_first(G.Identity, G.identity_bound, M.U{} <> Nil{}, M.Ui{}, Nil{}, G.identity_subgroup(), G.identity_admissible, Unit{}, I.inverse_step(M.U{}, P.solved_cells()))

def test_transfer(reaching: +List<U32>, solving: +List<U32>) -> M.Cube:
  P.to_facelets(P.replay(I.inverse_word(I.test_moves(solving)), R.inverse_root(I.test_moves(reaching))))

def test_inverse(word: +List<U32>) -> +List<U32>:
  I.test_numbers(I.inverse_word(I.test_moves(word)))
