import Base
import ../src/model.bend as M
import ./subgroup-proof-kernel.bend as K
import ./subgroup-targets.bend as T

type AxisBound<-root: M.Cube, -radius: Nat, -move: M.Move> is Type:
  AxisBound{axis: T.Axis, +bound: Nat, admissible: K.AdmissibleAt(T.inside(axis), root, bound), tight: K.Le(radius, bound), membership: {T.member(axis, move) == True{} : Bool}}

def covered(-root: M.Cube, -radius: Nat, -move: M.Move, witness: AxisBound<root, radius, move>) -> K.Covered<root, radius, move>:
  match witness:
    case AxisBound{T.UD{}, +bound, admissible, tight, membership}:
      K.Covered{T.inside_ud, T.member_ud, bound, T.identity_ud(), T.closed_ud, T.inverse_ud, admissible, tight, membership}
    case AxisBound{T.FB{}, +bound, admissible, tight, membership}:
      K.Covered{T.inside_fb, T.member_fb, bound, T.identity_fb(), T.closed_fb, T.inverse_fb, admissible, tight, membership}
    case AxisBound{T.RL{}, +bound, admissible, tight, membership}:
      K.Covered{T.inside_rl, T.member_rl, bound, T.identity_rl(), T.closed_rl, T.inverse_rl, admissible, tight, membership}

law reference_covered_radius:
  for +root: M.Cube
  for +predecessor: Nat
  for +word: +List<M.Move>
  for cover: @move: M.Move -> AxisBound<root, 1n+predecessor, move>
  for within: K.Le(K.length(word), 1n+predecessor)
  {M.replay(word, root) != M.solved() : M.Cube}

def reference_covered_radius(root, predecessor, word, cover, within):
  K.covered_forward_radius(root, predecessor, word, move => covered(root, 1n+predecessor, move, cover(move)), within)
