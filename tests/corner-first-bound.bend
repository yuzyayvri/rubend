import Base
import ../src/cubie.bend as C
import ../src/corner-first/search.bend as S
import ../src/corner-bound.bend as K

def meta(profile: S.Profile) -> S.Meta:
  S.Meta{C.solved(), 0, 21, Nil{}, 31, S.ExactContour{}, 2, 0, 0, S.Running{}, profile}

def parent(goal: S.Goal) -> S.Frame:
  S.Node{C.solved(), 0, 0, 0, 2, 6, 1, goal, Nil{}, 0}

def admitted(state: S.Search) -> Bool:
  match state:
    case S.Search{table, Con{S.Node{cube, a, b, c, 1, previous, next, phase, path, 1}, rest}, meta}: S.solved(cube)
    case _: False{}

def policy(goal: S.Goal, profile: S.Profile) -> Bool:
  admitted(S.inverse_policy([4294967295 : U32^2n], parent(goal), Nil{}, meta(profile), C.solved(), 0, 0, 0, 0))

def result(value: U32, word: U32) -> Bool:
  admitted(S.corner_first_result(([word : U32^2n], K.CubeBound{value}), parent(S.FullCube{}), Nil{}, meta(S.InverseCorner{}), C.solved(), 0, 0, 0, 0))

def checks() -> Bool:
  S.profile_matches(S.InverseCorner{}, 536870912) &&
  policy(S.Reduction{}, S.ForwardCorner{}) && policy(S.Reduction{}, S.InverseCorner{}) &&
  policy(S.Subgroup{}, S.ForwardCorner{}) && policy(S.Subgroup{}, S.InverseCorner{}) &&
  policy(S.FullCube{}, S.RawJoint{}) &&
  Bool.not(policy(S.FullCube{}, S.ForwardCorner{})) && Bool.not(policy(S.FullCube{}, S.InverseCorner{})) &&
  result(1, 0) && Bool.not(result(2, 0)) && Bool.not(result(1, 4294967295))

def report(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("Corner-first goal guards, both pruning stages, and child reuse passed.")
    case False{}: IO.die(Unit, 2, "Corner-first checks failed")

def main() -> IO(Unit):
  report(checks())
