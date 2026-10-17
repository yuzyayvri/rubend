import Base
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ../src/cubie.bend as C

def refused(value: P.Session) -> Bool:
  match value:
    case P.Session{table, tasks, root, best, length, lower, nodes, request, S.ProfileMismatch{}}: True{}
    case _: False{}

def search_refused(value: S.Search) -> Bool:
  match value:
    case S.Search{table, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, S.ProfileMismatch{}, profile}}: True{}
    case _: False{}

def checks() -> Bool:
  S.profile_matches(S.Light{}, 8388608) &&
  S.profile_matches(S.RawJoint{}, 536870912) &&
  S.profile_matches(S.BlockJoint{}, 268435456) &&
  Bool.not(S.profile_matches(S.Light{}, 536870912)) &&
  Bool.not(S.profile_matches(S.RawJoint{}, 268435456)) &&
  Bool.not(S.profile_matches(S.BlockJoint{}, 536870912)) &&
  refused(P.initialize([0 : U32^2n], C.to_facelets(C.solved()), C.solved(), P.ExactWaiting{}, S.RawJoint{})) &&
  refused(P.initialize([0 : U32^2n], C.to_facelets(C.solved()), C.solved(), P.Fast{}, S.Light{})) &&
  search_refused(S.initialize([0 : U32^2n], C.solved(), S.FirstThenExact{}, S.BlockJoint{}))

def domain_checks() -> Bool:
  U32.is_eq(S.goal_code(S.Reduction{}), 0) &&
  U32.is_eq(S.goal_code(S.Subgroup{}), 1) &&
  U32.is_eq(S.goal_code(S.FullCube{}), 2) &&
  S.is_reduction(S.next_goal(False{})) &&
  S.is_full_cube(S.next_goal(True{})) &&
  Bool.not(S.is_subgroup(S.FullCube{})) &&
  S.is_exact(S.ExactContour{}) &&
  Bool.not(S.is_exact(S.Improve{})) &&
  U32.is_eq(S.stage_code(S.FirstThenExact{}), 2) &&
  S.is_running(S.completion(False{})) &&
  S.is_optimal(S.completion(True{})) &&
  U32.is_eq(S.completion_code(S.finished(False{})), 3) &&
  U32.is_eq(S.completion_code(S.InvalidTransform{}), 4) &&
  U32.is_eq(S.completion_code(S.ProfileMismatch{}), 5) &&
  U32.is_eq(P.request_code(P.request_mode(True{})), 2) &&
  U32.is_eq(P.request_code(P.request_mode(False{})), 0) &&
  U32.is_eq(P.request_code(P.ExactActive{}), 1) &&
  P.is_waiting(P.request_mode(True{})) &&
  P.is_fast(P.request_mode(False{}))

def report(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("Explicit profile geometry and rejection checks passed.")
    case False{}: IO.die(Unit, 2, "Explicit profile checks failed")

def main() -> IO(Unit):
  report(checks() && domain_checks())
