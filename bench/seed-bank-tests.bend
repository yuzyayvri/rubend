import Base
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/portfolio.bend as P
import ../src/search.bend as S
import ./premove-paths.bend as E
import ./seed-bank.bend as Q

def output(state: Q.Session) -> +List<U32>:
  match state:
    case Q.Session{table, original, seed, Q.Lane{tasks, root, best, length, lower, nodes, request, status}, bank, ticks, branch, accepted, fault, profile}:
      length <> lower <> S.completion_code(status) <> P.request_code(request) <> accepted <> fault <> nodes <> Q.bank_nodes(bank) <> U32.from_nat(List.length(&2, P.Task, tasks)) <> best

def candidate(valid: C.Validation, +original: M.Cube, +solution: +List<U32>, exact: U32) -> +List<U32>:
  match valid:
    case C.Invalid{code}: Nil{}
    case C.Valid{+root}:
      output(Q.consider(True{}, solution, U32.from_nat(List.length(&2, U32, solution)), Q.Session{[0 : U32^0n], original, E.Preturn{M.U{}}, Q.Lane{[P.task(0, root, S.Light{})], root, Nil{}, 31, 0, 123, P.request_mode(U32.is_eq(exact, 1)), S.Running{}}, Q.NoBank{}, 8, 1, 0, 0, S.Light{}}))

def test_candidate(scramble: +List<U32>, solution: +List<U32>, exact: U32) -> +List<U32>:
  +original = {M.replay(E.moves(scramble), M.solved()) : M.Cube}
  candidate(C.validate(original), original, solution, exact)

def seeded(valid: C.Validation, +original: M.Cube, +global: +List<U32>) -> +List<U32>:
  match valid:
    case C.Invalid{code}: Nil{}
    case C.Valid{+root}:
      +child_best = {E.local_incumbent(E.Preturn{M.U{}}, 0, global) : +List<U32>}
      output(Q.after_seed(Q.Split{[0 : U32^0n], Q.Lane{Nil{}, C.turn(0, root), child_best, U32.from_nat(List.length(&2, U32, child_best)), 3, 456, P.ExactActive{}, S.TaskFinished{}}}, original, E.Preturn{M.U{}}, Q.Lane{[P.task(0, root, S.Light{})], root, Nil{}, 31, 0, 123, P.ExactWaiting{}, S.Running{}}, 7, 0, 0, S.Light{}))

def test_seed(scramble: +List<U32>, global: +List<U32>) -> +List<U32>:
  +original = {M.replay(E.moves(scramble), M.solved()) : M.Cube}
  seeded(C.validate(original), original, global)
