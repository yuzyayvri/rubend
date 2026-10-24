import Base
import ../src/model.bend as M
import ./piece-cells.bend as P
import ./reference-inversion.bend as R
import ./subgroup-proof-kernel.bend as K
import ./np01-group.bend as G

type NP02Index<-count: Nat> is Type:
  NP02At{+value: Nat, within: K.Le(1n+value, count)}

type NP02Bound<-reaching: +List<M.Move>> is Type:
  NP02Value{-inside: P.PieceCells -> Type, -h: P.PieceCells -> Nat, subgroup: G.Subgroup<inside>, admissible: G.Admissible(inside, h), +value: Nat, at_root: {h(R.root(reaching)) == value : Nat}}

def evaluated(-inside: P.PieceCells -> Type, h: P.PieceCells -> Nat, +reaching: +List<M.Move>, subgroup: G.Subgroup<inside>, admissible: G.Admissible(inside, h)) -> NP02Bound<reaching>:
  +value = h(R.root(reaching))
  NP02Value{inside, h, subgroup, admissible, value, {==}}

def Family(-reaching: +List<M.Move>, -count: Nat) -> Type:
  NP02Index<count> -> NP02Bound<reaching>

def Covers(-reaching: +List<M.Move>, -radius: Nat, -move: M.Move, bound: NP02Bound<reaching>) -> Type:
  match bound:
    case NP02Value{inside, h, subgroup, admissible, value, at_root}:
      K.Le(radius, value) & inside(P.turn(move, P.solved_cells()))

type NP02Selection<-reaching: +List<M.Move>, -radius: Nat, -count: Nat, -move: M.Move, -family: Family(reaching, count)> is Type:
  NP02Pick{slot: NP02Index<count>, covered: Covers(reaching, radius, move, family(slot))}

def Coverage(-reaching: +List<M.Move>, -radius: Nat, -count: Nat, -family: Family(reaching, count)) -> Type:
  @+move: M.Move -> NP02Selection<reaching, radius, count, move, family>

def valued_below(-original: Nat, -value: Nat, -length: Nat, equality: {original == value : Nat}, below: K.Le(original, length)) -> K.Le(value, length):
  %equality : K.Le(_, length)
  below

def root_inside(-inside: P.PieceCells -> Type, +root: P.PieceCells, solution: {root == P.solved_cells() : P.PieceCells}, identity: inside(P.solved_cells())) -> inside(root):
  %Equal.sym(P.PieceCells, root, P.solved_cells(), solution) : inside(_)
  identity

def reject_empty(+reaching: +List<M.Move>, +predecessor: Nat, bound: NP02Bound<reaching>, covered: Covers(reaching, 1n+predecessor, M.U{}, bound), solution: {R.root(reaching) == P.solved_cells() : P.PieceCells}) -> Empty:
  match bound covered:
    case NP02Value{inside, h, G.Subgroup{identity, products, inverses}, admissible, +value, at_root} Tuple{tight, member}:
      below = admissible(reaching, Nil{}, root_inside(inside, R.root(reaching), solution, identity))
      K.gap_impossible(0n, value, K.positive_bound(predecessor, value, tight), valued_below(h(R.root(reaching)), value, 0n, at_root, below))

def snoc_bound(+prefix: +List<M.Move>, +last: M.Move, -bound: Nat, within: K.Le(K.length(List.append(&2, M.Move, prefix, last <> Nil{})), bound)) -> K.Le(1n+K.length(prefix), bound):
  %K.snoc_length(prefix, last) : K.Le(_, bound)
  within

def reject_last(+reaching: +List<M.Move>, +predecessor: Nat, +prefix: +List<M.Move>, +last: M.Move, bound: NP02Bound<reaching>, covered: Covers(reaching, 1n+predecessor, last, bound), within: K.Le(K.length(List.append(&2, M.Move, prefix, last <> Nil{})), 1n+predecessor), solution: {P.replay(List.append(&2, M.Move, prefix, last <> Nil{}), R.root(reaching)) == P.solved_cells() : P.PieceCells}) -> Empty:
  match bound covered:
    case NP02Value{inside, h, G.Subgroup{identity, products, inverses}, admissible, +value, at_root} Tuple{tight, member}:
      reached = G.prefix_inside(inside, R.root(reaching), prefix, last, solution, inverses(last <> Nil{}, member))
      below = admissible(reaching, prefix, reached)
      above = K.le_trans(K.length(List.append(&2, M.Move, prefix, last <> Nil{})), 1n+predecessor, value, within, tight)
      K.gap_impossible(K.length(prefix), value, snoc_bound(prefix, last, value, above), valued_below(h(R.root(reaching)), value, K.length(prefix), at_root, below))

def selected_empty(+reaching: +List<M.Move>, +predecessor: Nat, -size: Nat, family: Family(reaching, 1n+size), choice: NP02Selection<reaching, 1n+predecessor, 1n+size, M.U{}, family>, solution: {R.root(reaching) == P.solved_cells() : P.PieceCells}) -> Empty:
  match choice:
    case NP02Pick{slot, covered}: reject_empty(reaching, predecessor, family(slot), covered, solution)

def selected_last(+reaching: +List<M.Move>, +predecessor: Nat, -size: Nat, +prefix: +List<M.Move>, +last: M.Move, family: Family(reaching, 1n+size), choice: NP02Selection<reaching, 1n+predecessor, 1n+size, last, family>, within: K.Le(K.length(List.append(&2, M.Move, prefix, last <> Nil{})), 1n+predecessor), solution: {P.replay(List.append(&2, M.Move, prefix, last <> Nil{}), R.root(reaching)) == P.solved_cells() : P.PieceCells}) -> Empty:
  match choice:
    case NP02Pick{slot, covered}: reject_last(reaching, predecessor, prefix, last, family(slot), covered, within, solution)

def split_exclusion(+reaching: +List<M.Move>, +predecessor: Nat, -size: Nat, +head: M.Move, +tail: +List<M.Move>, family: Family(reaching, 1n+size), coverage: Coverage(reaching, 1n+predecessor, 1n+size, family), witness: G.NP01Split<head, tail>) -> K.Le(K.length(head <> tail), 1n+predecessor) -> {P.replay(head <> tail, R.root(reaching)) == P.solved_cells() : P.PieceCells} -> Empty:
  match witness:
    case G.NP01Witness{+prefix, +last, rebuild}:
      %Equal.sym(+List<M.Move>, head <> tail, List.append(&2, M.Move, prefix, last <> Nil{}), rebuild) : K.Le(K.length(_), 1n+predecessor) -> {P.replay(_, R.root(reaching)) == P.solved_cells() : P.PieceCells} -> Empty
      within => solution => selected_last(reaching, predecessor, size, prefix, last, family, coverage(last), within, solution)

law np02_excludes:
  for +reaching: +List<M.Move>
  for +predecessor: Nat
  for -size: Nat
  for family: Family(reaching, 1n+size)
  for coverage: Coverage(reaching, 1n+predecessor, 1n+size, family)
  for +word: +List<M.Move>
  K.Le(K.length(word), 1n+predecessor) -> {P.replay(word, R.root(reaching)) == P.solved_cells() : P.PieceCells} -> Empty

def np02_excludes(reaching, predecessor, size, family, coverage, word):
  match word:
    case Nil{}: within => solution => selected_empty(reaching, predecessor, size, family, coverage(M.U{}), solution)
    case Con{+head, +tail}: split_exclusion(reaching, predecessor, size, head, tail, family, coverage, G.positive_split(tail, head))

type NP02Order<-length: Nat, -radius: Nat> is Type:
  NP02Within{within: K.Le(length, radius)}
  NP02Above{above: K.Le(1n+radius, length)}

def lift_order(-length: Nat, -radius: Nat, order: NP02Order<length, radius>) -> NP02Order<1n+length, 1n+radius>:
  match order:
    case NP02Within{within}: NP02Within{within}
    case NP02Above{above}: NP02Above{above}

def compare(+length: Nat, +radius: Nat) -> NP02Order<length, radius>:
  match length radius:
    case 0n _: NP02Within{Unit{}}
    case 1n+rest 0n: NP02Above{Unit{}}
    case 1n+rest 1n+tail: lift_order(rest, tail, compare(rest, tail))

def lower_order(+reaching: +List<M.Move>, +predecessor: Nat, -size: Nat, +word: +List<M.Move>, family: Family(reaching, 1n+size), coverage: Coverage(reaching, 1n+predecessor, 1n+size, family), solution: {P.replay(word, R.root(reaching)) == P.solved_cells() : P.PieceCells}, order: NP02Order<K.length(word), 1n+predecessor>) -> K.Le(1n+1n+predecessor, K.length(word)):
  match order:
    case NP02Within{within}: Empty.absurd(K.Le(1n+1n+predecessor, K.length(word)), np02_excludes(reaching, predecessor, size, family, coverage, word, within, solution))
    case NP02Above{above}: above

law np02_lower:
  for +reaching: +List<M.Move>
  for +predecessor: Nat
  for -size: Nat
  for family: Family(reaching, 1n+size)
  for coverage: Coverage(reaching, 1n+predecessor, 1n+size, family)
  for +word: +List<M.Move>
  for solution: {P.replay(word, R.root(reaching)) == P.solved_cells() : P.PieceCells}
  K.Le(1n+1n+predecessor, K.length(word))

def np02_lower(reaching, predecessor, size, family, coverage, word, solution):
  lower_order(reaching, predecessor, size, word, family, coverage, solution, compare(K.length(word), 1n+predecessor))

def test_ordered(-length: Nat, -radius: Nat, order: NP02Order<length, radius>) -> U32:
  match order:
    case NP02Within{within}: 0
    case NP02Above{above}: 1

def test_order(+length: U32, +radius: U32) -> U32:
  test_ordered(U32.to_nat(length), U32.to_nat(radius), compare(U32.to_nat(length), U32.to_nat(radius)))

def index_packet(-count: Nat, index: NP02Index<count>) -> +List<U32>:
  match index:
    case NP02At{value, within}: [U32.from_nat(value)]

def index_order(-count: Nat, +value: Nat, order: NP02Order<1n+value, count>) -> +List<U32>:
  match order:
    case NP02Within{within}: index_packet(count, NP02At{value, within})
    case NP02Above{above}: Nil{}

def test_index(+count: U32, +value: U32) -> +List<U32>:
  index_order(U32.to_nat(count), U32.to_nat(value), compare(1n+U32.to_nat(value), U32.to_nat(count)))

def singleton(slot: NP02Index<1n>) -> NP02Bound<M.U{} <> Nil{}>:
  evaluated(G.Identity, G.identity_bound, M.U{} <> Nil{}, G.identity_subgroup(), G.identity_admissible)

def test_value_read(bound: NP02Bound<M.U{} <> Nil{}>) -> U32:
  match bound:
    case NP02Value{inside, h, subgroup, admissible, value, at_root}: U32.from_nat(value)

def test_value() -> U32:
  test_value_read(singleton(NP02At{0n, Unit{}}))
