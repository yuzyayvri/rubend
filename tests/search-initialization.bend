import Base
import ../src/cubie.bend as C
import ../src/search.bend as S

def goal(state: S.Search) -> U32:
  match state:
    case S.Search{table, Con{S.Node{cube, a, b, c, left, previous, next, phase, path, length}, rest}, meta}: S.goal_code(phase)
    case _: 255

def initial_goal(stage: S.Stage) -> U32:
  goal(S.initialize([0 : U32^23n], C.solved(), stage, S.Light{}))

def mismatch(state: S.Search) -> Bool:
  match state:
    case S.Search{table, Nil{}, S.Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, S.ProfileMismatch{}, profile}}: True{}
    case _: False{}

def checked(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("Search stage/goal initialization and profile rejection passed.")
    case False{}: IO.die(Unit, 2, "Search initializer contract failed")

def report(+exact: U32) -> IO(Unit):
  do IO<Unit>:
    IO.print("{\"exactGoalExpected\":2,\"exactGoalObserved\":" ++ U32.show(exact) ++ "}")
    checked(U32.is_eq(exact, 2) && U32.is_eq(initial_goal(S.Improve{}), 0) && U32.is_eq(initial_goal(S.FirstThenExact{}), 0) && mismatch(S.initialize([0 : U32^0n], C.solved(), S.ExactContour{}, S.Light{})))

def main() -> IO(Unit):
  report(initial_goal(S.ExactContour{}))
