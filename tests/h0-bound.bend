import Base
import ../src/cubie.bend as C
import ../src/h0/search.bend as S
import ../src/h0-bound.bend as K

def meta(profile: S.Profile) -> S.Meta:
  S.Meta{C.solved(), 0, 21, Nil{}, 31, S.ExactContour{}, 2, 0, 0, S.Running{}, profile}

def parent(goal: S.Goal) -> S.Frame:
  S.Node{C.solved(), 0, 0, 0, 2, 6, 1, goal, Nil{}, 0}

def admitted(state: S.Search) -> Bool:
  match state:
    case S.Search{table, Con{S.Node{cube, a, b, c, 1, previous, next, phase, path, 1}, rest}, meta}: S.solved(cube)
    case _: False{}

def policy(goal: S.Goal, profile: S.Profile) -> Bool:
  admitted(S.accept_child(True{}, [4294967295 : U32^2n], parent(goal), Nil{}, meta(profile), C.solved(), 0, 0, 0, 0))

def result(value: U32) -> Bool:
  admitted(S.h0_result(([0 : U32^2n], K.CubeBound{value}), parent(S.FullCube{}), Nil{}, meta(S.ForwardH0{}), C.solved(), 0, 0, 0, 0))

def checks() -> Bool:
  S.profile_matches(S.ForwardH0{}, 536870912) &&
  S.profile_matches(S.InverseH0{}, 536870912) &&
  S.profile_matches(S.ForwardH0Fast{}, 536870912) &&
  S.profile_matches(S.InverseH0Fast{}, 536870912) &&
  Bool.not(S.profile_matches(S.Light{}, 8388608)) &&
  Bool.not(S.profile_matches(S.ForwardH0{}, 8388608)) &&
  policy(S.Reduction{}, S.ForwardH0{}) && policy(S.Reduction{}, S.InverseH0{}) &&
  policy(S.Subgroup{}, S.ForwardH0{}) && policy(S.Subgroup{}, S.InverseH0{}) &&
  policy(S.Reduction{}, S.ForwardH0Fast{}) && policy(S.Reduction{}, S.InverseH0Fast{}) &&
  policy(S.Subgroup{}, S.ForwardH0Fast{}) && policy(S.Subgroup{}, S.InverseH0Fast{}) &&
  policy(S.FullCube{}, S.RawJoint{}) && policy(S.FullCube{}, S.RawInverseThree{}) &&
  Bool.not(policy(S.FullCube{}, S.ForwardH0{})) && Bool.not(policy(S.FullCube{}, S.InverseH0{})) &&
  Bool.not(policy(S.FullCube{}, S.ForwardH0Fast{})) && Bool.not(policy(S.FullCube{}, S.InverseH0Fast{})) &&
  result(1) && Bool.not(result(2))

def report(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("H0 profile, FullCube goal guard, cutoff, and child reuse checks passed.")
    case False{}: IO.die(Unit, 2, "H0 bound checks failed")

def main() -> IO(Unit):
  report(checks())
