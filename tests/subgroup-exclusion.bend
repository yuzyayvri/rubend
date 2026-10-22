import Base
import ../bench/subgroup-exclusion.bend as E
import ../src/cubie.bend as C

def final_bits(mask: E.FinalMask) -> U32:
  match mask:
    case E.FinalMask{bits}: bits

def checks() -> Bool:
  U32.is_eq(E.full_cube_lower(E.ForwardBounds{0, 0, 0}), 0) &&
  U32.is_eq(E.full_cube_lower(E.ForwardBounds{2, 2, 2}), 3) &&
  U32.is_eq(E.full_cube_lower(E.ForwardBounds{2, 1, 2}), 2) &&
  U32.is_eq(E.full_cube_lower(E.ForwardBounds{15, 2, 2}), 0) &&
  U32.is_eq(final_bits(E.forward_exclusions(0, E.ForwardBounds{0, 0, 0})), 0) &&
  U32.is_eq(final_bits(E.forward_exclusions(2, E.ForwardBounds{1, 1, 1})), 0) &&
  U32.is_eq(final_bits(E.forward_exclusions(1, E.ForwardBounds{1, 0, 0})), 77463) &&
  Bool.not(E.allows_first(E.inverse_exclusions(1, E.InverseBounds{1, 0, 0}), 0)) &&
  E.allows_first(E.inverse_exclusions(1, E.InverseBounds{1, 0, 0}), 3) &&
  Bool.not(E.allows_first(E.FirstMask{0}, 18)) &&
  E.subgroup_axis(0, C.turn(0, C.solved())) &&
  Bool.not(E.subgroup_axis(1, C.turn(0, C.solved()))) &&
  E.subgroup_axis(1, C.turn(6, C.solved())) &&
  E.subgroup_axis(2, C.turn(3, C.solved()))

def report(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("Subgroup exclusion synthetic checks passed.")
    case False{}: IO.die(Unit, 2, "Subgroup exclusion synthetic check failed")

def main() -> IO(Unit):
  report(checks())
