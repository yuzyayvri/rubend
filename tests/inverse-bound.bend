import Base
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/inverse-bound.bend as I

def meta(profile: S.Profile) -> S.Meta:
  S.Meta{C.solved(), 0, 21, Nil{}, 31, S.ExactContour{}, 2, 0, 0, S.Running{}, profile}

def parent(goal: S.Goal) -> S.Frame:
  S.Node{C.solved(), 0, 0, 0, 2, 6, 1, goal, Nil{}, 0}

def admitted(state: S.Search) -> Bool:
  match state:
    case S.Search{table, Con{S.Node{cube, a, b, c, 1, previous, next, phase, path, 1}, rest}, meta}: True{}
    case _: False{}

def policy(goal: S.Goal, profile: S.Profile) -> Bool:
  admitted(S.inverse_policy([4294967295 : U32^2n], parent(goal), Nil{}, meta(profile), C.solved(), 0, 0, 0, 0))

def result(goal: S.Goal, value: U32) -> Bool:
  admitted(S.inverse_result(([0 : U32^2n], I.CubeBound{value}), parent(goal), Nil{}, meta(S.RawInverseOne{}), C.solved(), 0, 0, 0, 0))

def checks() -> Bool:
  S.profile_matches(S.RawInverseOne{}, 536870912) &&
  S.profile_matches(S.RawInverseThree{}, 536870912) &&
  Bool.not(S.profile_matches(S.RawInverseThree{}, 8388608)) &&
  policy(S.Reduction{}, S.RawInverseOne{}) &&
  policy(S.Reduction{}, S.RawInverseThree{}) &&
  policy(S.Subgroup{}, S.RawInverseOne{}) &&
  policy(S.Subgroup{}, S.RawInverseThree{}) &&
  policy(S.FullCube{}, S.RawJoint{}) &&
  Bool.not(policy(S.FullCube{}, S.RawInverseOne{})) &&
  Bool.not(policy(S.FullCube{}, S.RawInverseThree{})) &&
  result(S.Reduction{}, 15) && result(S.Subgroup{}, 15) &&
  result(S.FullCube{}, 1) && Bool.not(result(S.FullCube{}, 2))

def report(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("Synthetic inverse-bound goal guards passed.")
    case False{}: IO.die(Unit, 2, "Inverse-bound goal guard failed")

def main() -> IO(Unit):
  report(checks())
