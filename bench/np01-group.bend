import Base
import ../src/model.bend as M
import ./piece-cells.bend as P
import ./piece-cell-inverse.bend as I
import ./reference-inversion.bend as R
import ./subgroup-proof-kernel.bend as K

def ProductClosed(-inside: P.PieceCells -> Type) -> Type:
  @+left: +List<M.Move> -> @+right: +List<M.Move> -> inside(R.root(left)) -> inside(R.root(right)) -> inside(R.root(List.append(&2, M.Move, left, right)))

def InverseClosed(-inside: P.PieceCells -> Type) -> Type:
  @+word: +List<M.Move> -> inside(R.root(word)) -> inside(R.inverse_root(word))

type Subgroup<-inside: P.PieceCells -> Type> is Type:
  Subgroup{identity: inside(P.solved_cells()), products: ProductClosed(inside), inverses: InverseClosed(inside)}

def Admissible(-inside: P.PieceCells -> Type, -h: P.PieceCells -> Nat) -> Type:
  @+reaching: +List<M.Move> -> @+path: +List<M.Move> -> inside(P.replay(path, R.root(reaching))) -> K.Le(h(R.root(reaching)), K.length(path))

def recover_prefix(+root: P.PieceCells, +prefix: +List<M.Move>, +last: M.Move, solution: {P.replay(List.append(&2, M.Move, prefix, last <> Nil{}), root) == P.solved_cells() : P.PieceCells}) -> {P.replay(prefix, root) == P.turn(M.inverse(last), P.solved_cells()) : P.PieceCells}:
  turn_solved = Equal.trans(P.PieceCells, P.turn(last, P.replay(prefix, root)), P.replay(List.append(&2, M.Move, prefix, last <> Nil{}), root), P.solved_cells(), Equal.sym(P.PieceCells, P.replay(List.append(&2, M.Move, prefix, last <> Nil{}), root), P.turn(last, P.replay(prefix, root)), I.replay_append(prefix, last <> Nil{}, root)), solution)
  Equal.trans(P.PieceCells, P.replay(prefix, root), P.turn(M.inverse(last), P.turn(last, P.replay(prefix, root))), P.turn(M.inverse(last), P.solved_cells()), Equal.sym(P.PieceCells, P.turn(M.inverse(last), P.turn(last, P.replay(prefix, root))), P.replay(prefix, root), I.inverse_step(last, P.replay(prefix, root))), Equal.cong(P.PieceCells, P.PieceCells, cells => P.turn(M.inverse(last), cells), P.turn(last, P.replay(prefix, root)), P.solved_cells(), turn_solved))

def prefix_inside(-inside: P.PieceCells -> Type, +root: P.PieceCells, +prefix: +List<M.Move>, +last: M.Move, solution: {P.replay(List.append(&2, M.Move, prefix, last <> Nil{}), root) == P.solved_cells() : P.PieceCells}, inverse_member: inside(P.turn(M.inverse(last), P.solved_cells()))) -> inside(P.replay(prefix, root)):
  %Equal.sym(P.PieceCells, P.replay(prefix, root), P.turn(M.inverse(last), P.solved_cells()), recover_prefix(root, prefix, last, solution)) : inside(_)
  inverse_member

law np01_final:
  for -inside: P.PieceCells -> Type
  for h: P.PieceCells -> Nat
  for +reaching: +List<M.Move>
  for +prefix: +List<M.Move>
  for +last: M.Move
  for subgroup: Subgroup<inside>
  for admissible: Admissible(inside, h)
  for tight: K.Le(1n+K.length(prefix), h(R.root(reaching)))
  for solution: {P.replay(List.append(&2, M.Move, prefix, last <> Nil{}), R.root(reaching)) == P.solved_cells() : P.PieceCells}
  inside(P.turn(last, P.solved_cells())) -> Empty

def np01_final(inside, h, reaching, prefix, last, subgroup, admissible, tight, solution):
  match subgroup:
    case Subgroup{identity, products, inverses}:
      member =>
        inverse_member = inverses(last <> Nil{}, member)
        reached = prefix_inside(inside, R.root(reaching), prefix, last, solution, inverse_member)
        K.gap_impossible(K.length(prefix), h(R.root(reaching)), tight, admissible(reaching, prefix, reached))

type NP01Split<-head: M.Move, -tail: +List<M.Move>> is Type:
  NP01Witness{+prefix: +List<M.Move>, +last: M.Move, rebuild: {head <> tail == List.append(&2, M.Move, prefix, last <> Nil{}) : +List<M.Move>}}

def extend_split(+head: M.Move, +next: M.Move, +rest: +List<M.Move>, witness: NP01Split<next, rest>) -> NP01Split<head, next <> rest>:
  match witness:
    case NP01Witness{+prefix, +last, rebuild}:
      NP01Witness{head <> prefix, last, Equal.cong(+List<M.Move>, +List<M.Move>, xs => head <> xs, next <> rest, List.append(&2, M.Move, prefix, last <> Nil{}), rebuild)}

def positive_split(+tail: +List<M.Move>, +head: M.Move) -> NP01Split<head, tail>:
  match tail:
    case Nil{}: NP01Witness{Nil{}, head, {==}}
    case Con{+next, +rest}: extend_split(head, next, rest, positive_split(rest, next))

def Identity(cells: P.PieceCells) -> Type:
  {cells == P.solved_cells() : P.PieceCells}

def identity_product(+left: +List<M.Move>, +right: +List<M.Move>, first: Identity(R.root(left)), second: Identity(R.root(right))) -> Identity(R.root(List.append(&2, M.Move, left, right))):
  Equal.trans(P.PieceCells, R.root(List.append(&2, M.Move, left, right)), P.replay(right, R.root(left)), P.solved_cells(), I.replay_append(left, right, P.solved_cells()), Equal.trans(P.PieceCells, P.replay(right, R.root(left)), R.root(right), P.solved_cells(), Equal.cong(P.PieceCells, P.PieceCells, cells => P.replay(right, cells), R.root(left), P.solved_cells(), first), second))

def identity_inverse(+word: +List<M.Move>, evidence: Identity(R.root(word))) -> Identity(R.inverse_root(word)):
  R.inverse_unique(word, Nil{}, evidence)

def identity_subgroup() -> Subgroup<Identity>:
  Subgroup{{==}, identity_product, identity_inverse}

def indicator(solved: Bool) -> Nat:
  match solved:
    case True{}: 0n
    case False{}: 1n

def identity_bound(cells: P.PieceCells) -> Nat:
  indicator(M.is_solved(P.to_facelets(cells)))

def indicator_positive(solved: Bool, radius: Nat) -> K.Le(indicator(solved), 1n+radius):
  match solved:
    case True{}: Unit{}
    case False{}: Unit{}

def identity_admissible(+reaching: +List<M.Move>, +path: +List<M.Move>, solution: Identity(P.replay(path, R.root(reaching)))) -> K.Le(identity_bound(R.root(reaching)), K.length(path)):
  match path:
    case Nil{}:
      %Equal.sym(P.PieceCells, R.root(reaching), P.solved_cells(), solution) : K.Le(identity_bound(_), 0n)
      Unit{}
    case Con{move, +rest}: indicator_positive(M.is_solved(P.to_facelets(R.root(reaching))), K.length(rest))

def identity_example() -> Identity(P.turn(M.Ui{}, P.solved_cells())) -> Empty:
  np01_final(Identity, identity_bound, M.U{} <> Nil{}, Nil{}, M.Ui{}, identity_subgroup(), identity_admissible, Unit{}, I.inverse_step(M.U{}, P.solved_cells()))

def split_packet(-head: M.Move, -tail: +List<M.Move>, witness: NP01Split<head, tail>) -> +List<U32>:
  match witness:
    case NP01Witness{prefix, last, rebuild}: M.index(last) <> I.test_numbers(prefix)

def test_split(word: +List<U32>) -> +List<U32>:
  match word:
    case Nil{}: Nil{}
    case Con{head, tail}:
      +first = M.from_index(head)
      +rest = I.test_moves(tail)
      split_packet(first, rest, positive_split(rest, first))

def test_recovery(prefix: +List<U32>, last: U32) -> M.Cube:
  +word = I.test_moves(prefix)
  +move = M.from_index(last)
  P.to_facelets(P.replay(word, R.root(I.inverse_word(List.append(&2, M.Move, word, move <> Nil{})))))

def test_bound(word: +List<U32>) -> U32:
  U32.from_nat(identity_bound(R.root(I.test_moves(word))))
