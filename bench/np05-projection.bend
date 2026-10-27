import Base
import ../src/model.bend as M
import ../src/model-laws.bend as L
import ../src/model-proof.bend as Verified
import ./subgroup-proof-kernel.bend as K

def root(word: +List<M.Move>) -> M.Cube:
  M.replay(word, M.solved())

type ProjectedPath<-A: Data, -step: M.Move -> A -> A, -start: A, -goal: A, -length: Nat> is Type:
  AtGoal{empty: {length == 0n : Nat}, same: {start == goal : A}}
  Next{+move: M.Move, +remaining: Nat, count: {length == 1n+remaining : Nat}, tail: ProjectedPath<A, step, step(move, start), goal, remaining>}

def CommutesOn(-A: Data, -project: M.Cube -> A, -step: M.Move -> A -> A, word: +List<M.Move>, reaching: +List<M.Move>) -> Type:
  match word:
    case Nil{}: Unit
    case Con{+move, tail}:
      {project(M.turn(move, root(reaching))) == step(move, project(root(reaching))) : A} & CommutesOn(A, project, step, tail, List.append(&2, M.Move, reaching, move <> Nil{}))

def next_root(+reaching: +List<M.Move>, +move: M.Move) -> {root(List.append(&2, M.Move, reaching, move <> Nil{})) == M.turn(move, root(reaching)) : M.Cube}:
  L.replay_append(reaching, move <> Nil{}, M.solved())

def next_solution(+reaching: +List<M.Move>, +move: M.Move, +tail: +List<M.Move>, solution: {M.replay(move <> tail, root(reaching)) == M.solved() : M.Cube}) -> {M.replay(tail, root(List.append(&2, M.Move, reaching, move <> Nil{}))) == M.solved() : M.Cube}:
  %Equal.sym(M.Cube, root(List.append(&2, M.Move, reaching, move <> Nil{})), M.turn(move, root(reaching)), next_root(reaching, move)) : {M.replay(tail, _) == M.solved() : M.Cube}
  solution

def next_projected(-A: Data, -project: M.Cube -> A, -step: M.Move -> A -> A, +reaching: +List<M.Move>, +move: M.Move, +remaining: Nat, commute: {project(M.turn(move, root(reaching))) == step(move, project(root(reaching))) : A}, path: ProjectedPath<A, step, project(root(List.append(&2, M.Move, reaching, move <> Nil{}))), project(M.solved()), remaining>) -> ProjectedPath<A, step, step(move, project(root(reaching))), project(M.solved()), remaining>:
  %Equal.trans(A, project(root(List.append(&2, M.Move, reaching, move <> Nil{}))), project(M.turn(move, root(reaching))), step(move, project(root(reaching))), Equal.cong(M.Cube, A, project, root(List.append(&2, M.Move, reaching, move <> Nil{})), M.turn(move, root(reaching)), next_root(reaching, move)), commute) : ProjectedPath<A, step, _, project(M.solved()), remaining>
  path

law lift_solution:
  for -A: Data
  for -project: M.Cube -> A
  for -step: M.Move -> A -> A
  for +word: +List<M.Move>
  for +reaching: +List<M.Move>
  for commutes: CommutesOn(A, project, step, word, reaching)
  for solution: {M.replay(word, root(reaching)) == M.solved() : M.Cube}
  ProjectedPath<A, step, project(root(reaching)), project(M.solved()), K.length(word)>

def lift_solution(A, project, step, word, reaching, commutes, solution):
  match word:
    case Nil{}: AtGoal{{==}, Equal.cong(M.Cube, A, project, root(reaching), M.solved(), solution)}
    case Con{+move, +tail}:
      match commutes:
        case Tuple{current, rest}:
          lifted = lift_solution(A, project, step, tail, List.append(&2, M.Move, reaching, move <> Nil{}), rest, next_solution(reaching, move, tail, solution))
          Next{move, K.length(tail), {==}, next_projected(A, project, step, reaching, move, K.length(tail), current, lifted)}

type ProjectedMinimum<-A: Data, -step: M.Move -> A -> A, -start: A, -goal: A, -distance: Nat> is Type:
  Shortest{witness: ProjectedPath<A, step, start, goal, distance>, minimal: @+length: Nat -> ProjectedPath<A, step, start, goal, length> -> K.Le(distance, length)}

law np05_word_bound:
  for -A: Data
  for -project: M.Cube -> A
  for -step: M.Move -> A -> A
  for +reaching: +List<M.Move>
  for +distance: Nat
  for shortest: ProjectedMinimum<A, step, project(root(reaching)), project(M.solved()), distance>
  for +word: +List<M.Move>
  for commutes: CommutesOn(A, project, step, word, reaching)
  for solution: {M.replay(word, root(reaching)) == M.solved() : M.Cube}
  K.Le(distance, K.length(word))

def np05_word_bound(A, project, step, reaching, distance, shortest, word, commutes, solution):
  match shortest:
    case Shortest{witness, minimal}:
      minimal(K.length(word), lift_solution(A, project, step, word, reaching, commutes, solution))

def maximum(left: Nat, right: Nat) -> Nat:
  match left right:
    case 0n other: other
    case 1n+rest 0n: 1n+rest
    case 1n+rest 1n+tail: 1n+maximum(rest, tail)

law maximum_preserves_bound:
  for +left: Nat
  for +right: Nat
  for +limit: Nat
  for first: K.Le(left, limit)
  for second: K.Le(right, limit)
  K.Le(maximum(left, right), limit)

def maximum_preserves_bound(left, right, limit, first, second):
  match left right limit:
    case 0n _ _: second
    case 1n+rest 0n _: first
    case 1n+rest 1n+tail 0n: Empty.absurd(K.Le(maximum(left, right), limit), first)
    case 1n+rest 1n+tail 1n+bound: maximum_preserves_bound(rest, tail, bound, first, second)

def test_max(left: U32, right: U32) -> U32:
  U32.from_nat(maximum(U32.to_nat(left), U32.to_nat(right)))

def unit_project(cube: M.Cube) -> Unit:
  Unit{}

def unit_step(move: M.Move, state: Unit) -> Unit:
  Unit{}

def unit_commutes(word: +List<M.Move>, +reaching: +List<M.Move>) -> CommutesOn(Unit, unit_project, unit_step, word, reaching):
  match word:
    case Nil{}: Unit{}
    case Con{+move, tail}: ({==}, unit_commutes(tail, List.append(&2, M.Move, reaching, move <> Nil{})))

def unit_minimal(+length: Nat, path: ProjectedPath<Unit, unit_step, Unit{}, Unit{}, length>) -> K.Le(0n, length):
  Unit{}

def unit_shortest() -> ProjectedMinimum<Unit, unit_step, Unit{}, Unit{}, 0n>:
  Shortest{AtGoal{{==}, {==}}, unit_minimal}

def actual_one_move(+move: M.Move) -> ProjectedPath<Unit, unit_step, Unit{}, Unit{}, 1n>:
  lift_solution(Unit, unit_project, unit_step, M.inverse(move) <> Nil{}, move <> Nil{}, unit_commutes(M.inverse(move) <> Nil{}, move <> Nil{}), L.turn_inverse(move, M.solved()))

def one_move_bound(+move: M.Move) -> K.Le(0n, 1n):
  np05_word_bound(Unit, unit_project, unit_step, move <> Nil{}, 0n, unit_shortest(), M.inverse(move) <> Nil{}, unit_commutes(M.inverse(move) <> Nil{}, move <> Nil{}), L.turn_inverse(move, M.solved()))

def path_moves(-A: Data, -step: M.Move -> A -> A, -start: A, -goal: A, -length: Nat, path: ProjectedPath<A, step, start, goal, length>) -> +List<U32>:
  match path:
    case AtGoal{empty, same}: Nil{}
    case Next{+move, remaining, count, tail}: M.index(move) <> path_moves(A, step, step(move, start), goal, remaining, tail)

def test_one_move(index: U32) -> +List<U32>:
  path_moves(Unit, unit_step, Unit{}, Unit{}, 1n, actual_one_move(M.from_index(index)))
