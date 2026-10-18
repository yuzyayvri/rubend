import Base
import ./model.bend as M
import ./symmetry48.bend as S48

law sym48_identity_action:
  for +cube: M.Cube
  {S48.apply(S48.identity(), cube) == cube : M.Cube}

law sym48_composition_action:
  for +left: S48.Symmetry
  for +right: S48.Symmetry
  for +cube: M.Cube
  {S48.apply(S48.compose(left, right), cube) == S48.apply(left, S48.apply(right, cube)) : M.Cube}

law sym48_inverse_action:
  for +sym: S48.Symmetry
  for +cube: M.Cube
  {S48.apply(S48.inverse(sym), S48.apply(sym, cube)) == cube : M.Cube}

law sym48_move_conjugacy:
  for +sym: S48.Symmetry
  for +move: M.Move
  for +cube: M.Cube
  {S48.apply(sym, M.turn(move, cube)) == M.turn(S48.map_move(sym, move), S48.apply(sym, cube)) : M.Cube}

law sym48_solved_fixed:
  for sym: S48.Symmetry
  {S48.apply(sym, M.solved()) == M.solved() : M.Cube}
