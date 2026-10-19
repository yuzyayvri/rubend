import Base
import ../src/segmented-table.bend as R
import ../src/segmented/search.bend as S
import ../src/segmented/portfolio.bend as P
import ../src/cubie.bend as C

def located(value: Maybe<&2, R.Slot>, tag: U32, offset: U32) -> Bool:
  match value:
    case Some{R.PrefixSlot{at}}: U32.is_eq(tag, 0) && U32.is_eq(at, offset)
    case Some{R.LowerSlot{at}}: U32.is_eq(tag, 1) && U32.is_eq(at, offset)
    case Some{R.UpperSlot{at}}: U32.is_eq(tag, 2) && U32.is_eq(at, offset)
    case None{}: U32.is_eq(tag, 3)

def read_ok(read: R.Table & U32, value: U32) -> Bool:
  match read:
    case Tuple{table, word}: U32.is_eq(word, value)

def tiny() -> R.Table:
  R.RawSegments{[11 : U32^2n], [22 : U32^2n], [33 : U32^2n]}

def rejected(state: P.Session) -> Bool:
  match state:
    case P.Session{table, tasks, root, best, length, lower, nodes, request, S.ProfileMismatch{}}: True{}
    case _: False{}

def rejects_bad_dimensions(profile: S.Profile) -> Bool:
  rejected(P.initialize(tiny(), C.to_facelets(C.solved()), C.solved(), P.Fast{}, profile))

def checks() -> Bool:
  located(R.parse(0), 0, 0) && located(R.parse(8388607), 0, 8388607) &&
  located(R.parse(8388608), 1, 0) && located(R.parse(276824063), 1, 268435455) &&
  located(R.parse(276824064), 2, 0) && located(R.parse(285525247), 2, 8701183) &&
  located(R.parse(285525248), 3, 0) && located(R.parse(4294967295), 3, 0) &&
  read_ok(R.get(tiny(), 0), 11) && read_ok(R.get(tiny(), 8388608), 22) &&
  read_ok(R.get(tiny(), 276824064), 33) && read_ok(R.size(tiny()), 0) &&
  rejects_bad_dimensions(S.RawJoint{}) && rejects_bad_dimensions(S.Light{}) &&
  Bool.not(S.profile_matches(S.Light{}, 0)) && Bool.not(S.profile_matches(S.BlockJoint{}, 0))

def report(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("Segmented address boundaries, logical range, field routing, and invalid dimensions pass.")
    case False{}: IO.die(Unit, 2, "Segmented address checks failed")

def main() -> IO(Unit):
  do IO<Unit>:
    IO.print("{\"rawRejected\":" ++ U32.show(C.pick(rejects_bad_dimensions(S.RawJoint{}), 1, 0)) ++ ",\"lightRejected\":" ++ U32.show(C.pick(rejects_bad_dimensions(S.Light{}), 1, 0)) ++ ",\"lightZeroAccepted\":" ++ U32.show(C.pick(S.profile_matches(S.Light{}, 0), 1, 0)) ++ "}")
    report(checks())
