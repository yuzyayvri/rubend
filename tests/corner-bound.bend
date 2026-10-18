import Base
import ../src/cubie.bend as C
import ../src/corner/search.bend as S
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
  admitted(S.accept_child(True{}, [4294967295 : U32^2n], parent(goal), Nil{}, meta(profile), C.solved(), 0, 0, 0, 0))

def result(value: U32) -> Bool:
  admitted(S.corner_result(([0 : U32^2n], K.CubeBound{value}), parent(S.FullCube{}), Nil{}, meta(S.ForwardCorner{}), C.solved(), 0, 0, 0, 0))

def byte_value(read: Array<U32> & K.CubeBound, expected: U32) -> Bool:
  match read:
    case Tuple{table, K.CubeBound{distance}}: U32.is_eq(distance, expected)

def checks() -> Bool:
  S.profile_matches(S.ForwardCorner{}, 536870912) &&
  S.profile_matches(S.InverseCorner{}, 536870912) &&
  Bool.not(S.profile_matches(S.Light{}, 8388608)) &&
  Bool.not(S.profile_matches(S.RawInverseOne{}, 536870912)) &&
  Bool.not(S.profile_matches(S.ForwardCorner{}, 8388608)) &&
  policy(S.Reduction{}, S.ForwardCorner{}) && policy(S.Reduction{}, S.InverseCorner{}) &&
  policy(S.Subgroup{}, S.ForwardCorner{}) && policy(S.Subgroup{}, S.InverseCorner{}) &&
  policy(S.FullCube{}, S.RawJoint{}) && policy(S.FullCube{}, S.RawInverseThree{}) &&
  Bool.not(policy(S.FullCube{}, S.ForwardCorner{})) && Bool.not(policy(S.FullCube{}, S.InverseCorner{})) &&
  result(1) && Bool.not(result(2)) &&
  U32.is_eq(K.index(C.solved()), 0) &&
  byte_value(K.full_cube_at([185204992 : U32^0n], 0, 0), 0) &&
  byte_value(K.full_cube_at([185204992 : U32^0n], 0, 1), 1) &&
  byte_value(K.full_cube_at([185204992 : U32^0n], 0, 2), 10) &&
  byte_value(K.full_cube_at([185204992 : U32^0n], 0, 3), 11)

def report(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("Corner profile, goal, cutoff, child reuse, and byte checks passed.")
    case False{}: IO.die(Unit, 2, "Corner bound checks failed")

def main() -> IO(Unit):
  report(checks())
