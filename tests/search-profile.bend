import Base
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ../src/cubie.bend as C

def refused(value: P.Session) -> Bool:
  match value:
    case P.Session{table, tasks, root, best, length, lower, nodes, request, 5}: True{}
    case _: False{}

def search_refused(value: S.Search) -> Bool:
  match value:
    case S.Search{table, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, 5, profile}}: True{}
    case _: False{}

def checks() -> Bool:
  S.profile_matches(S.Light{}, 8388608) &&
  S.profile_matches(S.RawJoint{}, 536870912) &&
  S.profile_matches(S.BlockJoint{}, 268435456) &&
  Bool.not(S.profile_matches(S.Light{}, 536870912)) &&
  Bool.not(S.profile_matches(S.RawJoint{}, 268435456)) &&
  Bool.not(S.profile_matches(S.BlockJoint{}, 536870912)) &&
  refused(P.initialize([0 : U32^2n], C.to_facelets(C.solved()), C.solved(), 2, S.RawJoint{})) &&
  refused(P.initialize([0 : U32^2n], C.to_facelets(C.solved()), C.solved(), 0, S.Light{})) &&
  search_refused(S.initialize([0 : U32^2n], C.solved(), 2, S.BlockJoint{}))

def report(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("Explicit profile geometry and rejection checks passed.")
    case False{}: IO.die(Unit, 2, "Explicit profile checks failed")

def main() -> IO(Unit):
  report(checks())
