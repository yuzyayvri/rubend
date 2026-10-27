import Base
import ../src/model.bend as M
import ../src/model-laws.bend as L
import ../src/model-proof.bend as Verified

def Le(a: Nat, b: Nat) -> Type:
  match a b:
    case 0n _: Unit
    case 1n+p 0n: Empty
    case 1n+p 1n+q: Le(p, q)

def false_kind(value: Bool) -> Type:
  match value:
    case False{}: Unit
    case True{}: Empty

def false_clash(evidence: {False{} == True{} : Bool}) -> Empty:
  %evidence : false_kind(_)
  Unit{}

def le_bool(+a: Nat, +b: Nat, evidence: Le(a, b)) -> {Nat.is_le(a, b) == True{} : Bool}:
  match a b:
    case 0n 0n: {==}
    case 0n 1n+q: {==}
    case 1n+p 0n: Empty.absurd({Nat.is_le(a, b) == True{} : Bool}, evidence)
    case 1n+p 1n+q: le_bool(p, q, evidence)

def bool_le(+a: Nat, +b: Nat, evidence: {Nat.is_le(a, b) == True{} : Bool}) -> Le(a, b):
  match a b:
    case 0n _: Unit{}
    case 1n+p 0n: false_clash(evidence)
    case 1n+p 1n+q: bool_le(p, q, evidence)

def le_trans(+a: Nat, +b: Nat, +c: Nat, ab: Le(a, b), bc: Le(b, c)) -> Le(a, c):
  match a b c:
    case 0n _ _: Unit{}
    case 1n+p 0n _: Empty.absurd(Le(a, c), ab)
    case 1n+p 1n+q 0n: Empty.absurd(Le(a, c), bc)
    case 1n+p 1n+q 1n+r: le_trans(p, q, r, ab, bc)

def gap_impossible(+n: Nat, +bound: Nat, above: Le(1n+n, bound), below: Le(bound, n)) -> Empty:
  match n bound:
    case 0n 0n: above
    case 0n 1n+q: below
    case 1n+p 0n: above
    case 1n+p 1n+q: gap_impossible(p, q, above, below)

def length(word: +List<M.Move>) -> Nat:
  match word:
    case Nil{}: 0n
    case Con{last, prefix}: 1n+length(prefix)

def replay(word: +List<M.Move>, root: M.Cube) -> M.Cube:
  match word:
    case Nil{}: root
    case Con{last, prefix}: M.turn(last, replay(prefix, root))

def forward_word(word: +List<M.Move>) -> +List<M.Move>:
  match word:
    case Nil{}: Nil{}
    case Con{last, prefix}: List.append(&2, M.Move, forward_word(prefix), last <> Nil{})

def snoc_length(+prefix: +List<M.Move>, +last: M.Move) -> {length(List.append(&2, M.Move, prefix, last <> Nil{})) == 1n+length(prefix) : Nat}:
  match prefix:
    case Nil{}: {==}
    case Con{head, +tail}:
      Equal.cong(Nat, Nat, n => 1n+n, length(List.append(&2, M.Move, tail, last <> Nil{})), 1n+length(tail), snoc_length(tail, last))

law forward_length:
  for +word: +List<M.Move>
  {length(forward_word(word)) == length(word) : Nat}

def forward_length(word):
  match word:
    case Nil{}: {==}
    case Con{+last, +prefix}:
      Equal.trans(Nat, length(List.append(&2, M.Move, forward_word(prefix), last <> Nil{})), 1n+length(forward_word(prefix)), 1n+length(prefix), snoc_length(forward_word(prefix), last), Equal.cong(Nat, Nat, n => 1n+n, length(forward_word(prefix)), length(prefix), forward_length(prefix)))

law forward_replay:
  for +word: +List<M.Move>
  for +root: M.Cube
  {replay(word, root) == M.replay(forward_word(word), root) : M.Cube}

def forward_replay(word, root):
  match word:
    case Nil{}: {==}
    case Con{+last, +prefix}:
      %Equal.sym(M.Cube, M.replay(List.append(&2, M.Move, forward_word(prefix), last <> Nil{}), root), M.turn(last, M.replay(forward_word(prefix), root)), L.replay_append(forward_word(prefix), last <> Nil{}, root)) : {replay(last <> prefix, root) == _ : M.Cube}
      Equal.cong(M.Cube, M.Cube, x => M.turn(last, x), replay(prefix, root), M.replay(forward_word(prefix), root), forward_replay(prefix, root))

def forward_snoc(+prefix: +List<M.Move>, +last: M.Move) -> {forward_word(List.append(&2, M.Move, prefix, last <> Nil{})) == last <> forward_word(prefix) : +List<M.Move>}:
  match prefix:
    case Nil{}: {==}
    case Con{+head, +tail}:
      Equal.cong(+List<M.Move>, +List<M.Move>, xs => List.append(&2, M.Move, xs, head <> Nil{}), forward_word(List.append(&2, M.Move, tail, last <> Nil{})), last <> forward_word(tail), forward_snoc(tail, last))

law forward_involution:
  for +word: +List<M.Move>
  {forward_word(forward_word(word)) == word : +List<M.Move>}

def forward_involution(word):
  match word:
    case Nil{}: {==}
    case Con{+last, +prefix}:
      Equal.trans(+List<M.Move>, forward_word(List.append(&2, M.Move, forward_word(prefix), last <> Nil{})), last <> forward_word(forward_word(prefix)), last <> prefix, forward_snoc(forward_word(prefix), last), Equal.cong(+List<M.Move>, +List<M.Move>, xs => last <> xs, forward_word(forward_word(prefix)), prefix, forward_involution(prefix)))

def Closed(-inside: M.Cube -> Bool, -member: M.Move -> Bool) -> Type:
  @move: M.Move -> @cube: M.Cube -> {member(move) == True{} : Bool} -> {inside(cube) == True{} : Bool} -> {inside(M.turn(move, cube)) == True{} : Bool}

def InverseClosed(-member: M.Move -> Bool) -> Type:
  @move: M.Move -> {member(move) == True{} : Bool} -> {member(M.inverse(move)) == True{} : Bool}

def AdmissibleAt(-inside: M.Cube -> Bool, -root: M.Cube, -bound: Nat) -> Type:
  @word: +List<M.Move> -> {inside(replay(word, root)) == True{} : Bool} -> Le(bound, length(word))

def recover_prefix(-inside: M.Cube -> Bool, +root: M.Cube, +prefix: +List<M.Move>, +last: M.Move, solution: {replay(last <> prefix, root) == M.solved() : M.Cube}, reached: {inside(M.turn(M.inverse(last), M.solved())) == True{} : Bool}) -> {inside(replay(prefix, root)) == True{} : Bool}:
  %L.turn_inverse(last, replay(prefix, root)) : {inside(_) == True{} : Bool}
  %Equal.sym(M.Cube, M.turn(last, replay(prefix, root)), M.solved(), solution) : {inside(M.turn(M.inverse(last), _)) == True{} : Bool}
  reached

law target_final_exclusion:
  for -inside: M.Cube -> Bool
  for -member: M.Move -> Bool
  for +root: M.Cube
  for +prefix: +List<M.Move>
  for +last: M.Move
  for +bound: Nat
  for identity: {inside(M.solved()) == True{} : Bool}
  for closed: Closed(inside, member)
  for inverses: InverseClosed(member)
  for admissible: AdmissibleAt(inside, root, bound)
  for tight: Le(1n+length(prefix), bound)
  for solution: {replay(last <> prefix, root) == M.solved() : M.Cube}
  {member(last) != True{} : Bool}

def target_final_exclusion(inside, member, root, prefix, last, bound, identity, closed, inverses, admissible, tight, solution):
  membership =>
    inverse_member = inverses(last, membership)
    inverse_reached = closed(M.inverse(last), M.solved(), inverse_member, identity)
    prefix_reached = recover_prefix(inside, root, prefix, last, solution, inverse_reached)
    gap_impossible(length(prefix), bound, tight, admissible(prefix, prefix_reached))

type Covered<-root: M.Cube, -radius: Nat, -move: M.Move> is Type:
  Covered{-inside: M.Cube -> Bool, -member: M.Move -> Bool, +bound: Nat, identity: {inside(M.solved()) == True{} : Bool}, closed: Closed(inside, member), inverses: InverseClosed(member), admissible: AdmissibleAt(inside, root, bound), tight: Le(radius, bound), membership: {member(move) == True{} : Bool}}

def positive_bound(+predecessor: Nat, +bound: Nat, tight: Le(1n+predecessor, bound)) -> Le(1n, bound):
  match bound:
    case 0n: Empty.absurd(Le(1n, bound), tight)
    case 1n+q: Unit{}

def recover_empty(-inside: M.Cube -> Bool, +root: M.Cube, solution: {root == M.solved() : M.Cube}, identity: {inside(M.solved()) == True{} : Bool}) -> {inside(root) == True{} : Bool}:
  %Equal.sym(M.Cube, root, M.solved(), solution) : {inside(_) == True{} : Bool}
  identity

def reject_empty(+root: M.Cube, +predecessor: Nat, witness: Covered<root, 1n+predecessor, M.U{}>, solution: {root == M.solved() : M.Cube}) -> Empty:
  match witness:
    case Covered{inside, member, +bound, identity, closed, inverses, admissible, tight, membership}:
      gap_impossible(0n, bound, positive_bound(predecessor, bound, tight), admissible(Nil{}, recover_empty(inside, root, solution, identity)))

def reject_nonempty(+root: M.Cube, +predecessor: Nat, +prefix: +List<M.Move>, +last: M.Move, within: Le(1n+length(prefix), 1n+predecessor), witness: Covered<root, 1n+predecessor, last>, solution: {replay(last <> prefix, root) == M.solved() : M.Cube}) -> Empty:
  match witness:
    case Covered{inside, member, +bound, identity, closed, inverses, admissible, tight, membership}:
      excluded = target_final_exclusion(inside, member, root, prefix, last, bound, identity, closed, inverses, admissible, le_trans(1n+length(prefix), 1n+predecessor, bound, within, tight), solution)
      excluded(membership)

def reject_covered_word(+root: M.Cube, +predecessor: Nat, +word: +List<M.Move>, cover: @move: M.Move -> Covered<root, 1n+predecessor, move>, within: Le(length(word), 1n+predecessor), solution: {replay(word, root) == M.solved() : M.Cube}) -> Empty:
  match word:
    case Nil{}: reject_empty(root, predecessor, cover(M.U{}), solution)
    case Con{+last, +prefix}: reject_nonempty(root, predecessor, prefix, last, within, cover(last), solution)

law covered_radius_exclusion:
  for +root: M.Cube
  for +predecessor: Nat
  for +word: +List<M.Move>
  for cover: @move: M.Move -> Covered<root, 1n+predecessor, move>
  for within: Le(length(word), 1n+predecessor)
  {replay(word, root) != M.solved() : M.Cube}

def covered_radius_exclusion(root, predecessor, word, cover, within):
  solution => reject_covered_word(root, predecessor, word, cover, within, solution)

def reverse_within(+word: +List<M.Move>, +radius: Nat, within: Le(length(word), radius)) -> Le(length(forward_word(word)), radius):
  %Equal.sym(Nat, length(forward_word(word)), length(word), forward_length(word)) : Le(_, radius)
  within

def reverse_solution(+word: +List<M.Move>, +root: M.Cube, solution: {M.replay(word, root) == M.solved() : M.Cube}) -> {replay(forward_word(word), root) == M.solved() : M.Cube}:
  bridge = Equal.trans(M.Cube, replay(forward_word(word), root), M.replay(forward_word(forward_word(word)), root), M.replay(word, root), forward_replay(forward_word(word), root), Equal.cong(+List<M.Move>, M.Cube, xs => M.replay(xs, root), forward_word(forward_word(word)), word, forward_involution(word)))
  Equal.trans(M.Cube, replay(forward_word(word), root), M.replay(word, root), M.solved(), bridge, solution)

law covered_forward_radius:
  for +root: M.Cube
  for +predecessor: Nat
  for +word: +List<M.Move>
  for cover: @move: M.Move -> Covered<root, 1n+predecessor, move>
  for within: Le(length(word), 1n+predecessor)
  {M.replay(word, root) != M.solved() : M.Cube}

def covered_forward_radius(root, predecessor, word, cover, within):
  solution =>
    excluded = covered_radius_exclusion(root, predecessor, forward_word(word), cover, reverse_within(word, 1n+predecessor, within))
    excluded(reverse_solution(word, root, solution))

def inverse_suffix(word: +List<M.Move>) -> +List<M.Move>:
  match word:
    case Nil{}: Nil{}
    case Con{move, rest}: M.inverse(move) <> inverse_suffix(rest)

law inverse_suffix_length:
  for +word: +List<M.Move>
  {length(inverse_suffix(word)) == length(word) : Nat}

def inverse_suffix_length(word):
  match word:
    case Nil{}: {==}
    case Con{move, +rest}:
      Equal.cong(Nat, Nat, n => 1n+n, length(inverse_suffix(rest)), length(rest), inverse_suffix_length(rest))

def InversionBridge(-root: M.Cube, -inverse_root: M.Cube) -> Type:
  @first: M.Move -> @suffix: +List<M.Move> -> {M.replay(first <> suffix, root) == M.solved() : M.Cube} -> {replay(M.inverse(first) <> inverse_suffix(suffix), inverse_root) == M.solved() : M.Cube}

def inverse_prefix_length(+suffix: +List<M.Move>, +bound: Nat, below: Le(bound, length(inverse_suffix(suffix)))) -> Le(bound, length(suffix)):
  %inverse_suffix_length(suffix) : Le(bound, _)
  below

def double_inverse_reached(-inside: M.Cube -> Bool, +first: M.Move, reached: {inside(M.turn(first, M.solved())) == True{} : Bool}) -> {inside(M.turn(M.inverse(M.inverse(first)), M.solved())) == True{} : Bool}:
  %Equal.sym(M.Move, M.inverse(M.inverse(first)), first, L.inverse_involution(first)) : {inside(M.turn(_, M.solved())) == True{} : Bool}
  reached

law inverse_first_exclusion:
  for -inside: M.Cube -> Bool
  for -member: M.Move -> Bool
  for +root: M.Cube
  for +inverse_root: M.Cube
  for +first: M.Move
  for +suffix: +List<M.Move>
  for +bound: Nat
  for identity: {inside(M.solved()) == True{} : Bool}
  for closed: Closed(inside, member)
  for admissible: AdmissibleAt(inside, inverse_root, bound)
  for inversion: InversionBridge(root, inverse_root)
  for tight: Le(1n+length(suffix), bound)
  for solution: {M.replay(first <> suffix, root) == M.solved() : M.Cube}
  {member(first) != True{} : Bool}

def inverse_first_exclusion(inside, member, root, inverse_root, first, suffix, bound, identity, closed, admissible, inversion, tight, solution):
  membership =>
    first_reached = closed(first, M.solved(), membership, identity)
    inverse_reached = double_inverse_reached(inside, first, first_reached)
    prefix_reached = recover_prefix(inside, inverse_root, inverse_suffix(suffix), M.inverse(first), inversion(first, suffix, solution), inverse_reached)
    gap_impossible(length(suffix), bound, tight, inverse_prefix_length(suffix, bound, admissible(inverse_suffix(suffix), prefix_reached)))
