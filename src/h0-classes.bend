import Base
import ./h0-corners.bend as H
import ./symmetry48.bend as S
import ./cubie.bend as C

def count() -> U32:
  3393

def representatives() -> U32:
  262144

def stabilizers_lo() -> U32:
  524288

def stabilizers_hi() -> U32:
  786432

type Build is Type:
  ClassWork{table: Array<U32>, classes: U32, visited: U32}
  ClassComplete{table: Array<U32>, classes: U32, visited: U32}
  ClassFailed{index: U32, code: U32}

type Orbit is Type:
  OrbitWork{table: Array<U32>, visited: U32, lo: U32, hi: U32}
  OrbitFailed{index: U32, code: U32}

def insert_allowed(ok: Bool, table: Array<U32>, +old: U32, +target: U32, +rep: U32, +class: U32, +visited: U32, +sym: U32, inverse: U32, lo: U32, hi: U32) -> Orbit:
  match ok:
    case False{}: OrbitFailed{target, 3}
    case True{}:
      +fresh = U32.is_eq(old, 4294967295)
      +bit = (C.pick(U32.is_eq(target, rep), 1, 0) << U32.to_nat((sym % 32 : U32)) : U32)
      table[target] <- C.pick(fresh, (class .|. (inverse << 16n) : U32), old)
      OrbitWork{table, (visited + C.pick(fresh, 1, 0) : U32), (lo .|. C.pick(U32.is_lt(sym, 32), bit, 0) : U32), (hi .|. C.pick(U32.is_ge(sym, 32), bit, 0) : U32)}

def target_read(read: Array<U32> & U32, target: U32, rep: U32, +class: U32, visited: U32, sym: U32, inverse: U32, lo: U32, hi: U32) -> Orbit:
  match read:
    case Tuple{table, +old}: insert_allowed(U32.is_eq(old, 4294967295) || U32.is_eq((old .&. 65535 : U32), class), table, old, target, rep, class, visited, sym, inverse, lo, hi)

def target_allowed(ok: Bool, table: Array<U32>, +target: U32, rep: U32, class: U32, visited: U32, sym: U32, inverse: U32, lo: U32, hi: U32) -> Orbit:
  match ok:
    case False{}: OrbitFailed{target, 2}
    case True{}: target_read(table[target], target, rep, class, visited, sym, inverse, lo, hi)

def orbit_target(value: Maybe<&2, H.Corner>, table: Array<U32>, rep: U32, class: U32, visited: U32, sym: U32, inverse: U32, lo: U32, hi: U32) -> Orbit:
  match value:
    case None{}: OrbitFailed{rep, 1}
    case Some{corner}:
      +target = H.index(corner)
      target_allowed(U32.is_lt(target, H.size()), table, target, rep, class, visited, sym, inverse, lo, hi)

def orbit_selected(selected: Maybe<&2, S.Symmetry>, corner: Maybe<&2, H.Corner>, table: Array<U32>, rep: U32, class: U32, visited: U32, sym_index: U32, lo: U32, hi: U32) -> Orbit:
  match selected corner:
    case Some{+sym} Some{corner}: orbit_target(H.reference_transform(sym, corner), table, rep, class, visited, sym_index, S.index(S.inverse(sym)), lo, hi)
    case _ _: OrbitFailed{rep, 4}

def orbit(fuel: Nat, +sym: U32, +rep: U32, +class: U32, state: Orbit) -> Orbit:
  match fuel state:
    case 1n+p OrbitWork{table, visited, lo, hi}:
      orbit(p, (sym + 1 : U32), rep, class, orbit_selected(S.from_index(sym), H.from_index(rep), table, rep, class, visited, sym, lo, hi))
    case _ state: state

def orbit_finished(state: Orbit, +rep: U32, +class: U32) -> Build:
  match state:
    case OrbitFailed{index, code}: ClassFailed{index, code}
    case OrbitWork{table, visited, lo, hi}:
      table[(representatives() + class : U32)] <- rep
      table[(stabilizers_lo() + class : U32)] <- lo
      table[(stabilizers_hi() + class : U32)] <- hi
      table[(200000 + class : U32)] <- 0
      ClassWork{table, (class + 1 : U32), visited}

def class_allowed(ok: Bool, table: Array<U32>, +index: U32, +class: U32, visited: U32) -> Build:
  match ok:
    case False{}: ClassFailed{index, 5}
    case True{}: orbit_finished(orbit(48n, 0, index, class, OrbitWork{table, visited, 0, 0}), index, class)

def scan_read(read: Array<U32> & U32, index: U32, +class: U32, visited: U32) -> Build:
  match read:
    case Tuple{table, 4294967295}: class_allowed(U32.is_lt(class, count()), table, index, class, visited)
    case Tuple{table, old}: ClassWork{table, class, visited}

def scan(state: Build, +index: U32) -> Build:
  match state:
    case ClassWork{table, class, visited}: scan_read(table[index], index, class, visited)
    case state: state

def run(fuel: Nat, +index: U32, state: Build) -> Build:
  match fuel state:
    case 1n+p ClassWork{table, class, visited}: run(p, (index + 1 : U32), scan(ClassWork{table, class, visited}, index))
    case _ state: state

def completed(ok: Bool, table: Array<U32>, classes: U32, visited: U32) -> Build:
  match ok:
    case False{}: ClassFailed{visited, 6}
    case True{}: ClassComplete{table, classes, visited}

def complete(state: Build) -> Build:
  match state:
    case ClassWork{table, +classes, +visited}: completed(U32.is_eq(classes, count()) && U32.is_eq(visited, H.size()), table, classes, visited)
    case state: state

def start() -> Build:
  ClassWork{[4294967295 : U32^20n], 0, 0}

def generate() -> Build:
  complete(run(153090n, 0, start()))

type Audit is Type:
  ClassAuditWork{table: Array<U32>, checked: U32}
  ClassAudited{table: Array<U32>, checked: U32}
  ClassAuditFailed{index: U32, code: U32}

def count_allowed(ok: Bool, table: Array<U32>, +old: U32, class: U32, +index: U32) -> Audit:
  match ok:
    case False{}: ClassAuditFailed{index, 7}
    case True{}:
      table[(200000 + class : U32)] <- (old + 1 : U32)
      ClassAuditWork{table, (index + 1 : U32)}

def raw_counted(read: Array<U32> & U32, +class: U32, +index: U32) -> Audit:
  match read:
    case Tuple{table, +old}: count_allowed(U32.is_lt(old, 48), table, old, class, index)

def raw_compared(ok: Bool, table: Array<U32>, +class: U32, index: U32) -> Audit:
  match ok:
    case False{}: ClassAuditFailed{index, 3}
    case True{}: raw_counted(table[(200000 + class : U32)], class, index)

def raw_transformed(value: Maybe<&2, H.Corner>, table: Array<U32>, class: U32, index: U32, rep: U32) -> Audit:
  match value:
    case None{}: ClassAuditFailed{index, 2}
    case Some{corner}: raw_compared(U32.is_eq(H.index(corner), rep), table, class, index)

def raw_selected(selected: Maybe<&2, S.Symmetry>, corner: Maybe<&2, H.Corner>, table: Array<U32>, class: U32, index: U32, rep: U32) -> Audit:
  match selected corner:
    case Some{sym} Some{corner}: raw_transformed(H.reference_transform(sym, corner), table, class, index, rep)
    case _ _: ClassAuditFailed{index, 4}

def raw_rep_allowed(ok: Bool, table: Array<U32>, class: U32, +index: U32, transform: U32, rep: U32) -> Audit:
  match ok:
    case False{}: ClassAuditFailed{index, 5}
    case True{}: raw_selected(S.from_index(transform), H.from_index(index), table, class, index, rep)

def raw_rep(read: Array<U32> & U32, class: U32, index: U32, transform: U32) -> Audit:
  match read:
    case Tuple{table, +rep}: raw_rep_allowed(U32.is_lt(rep, H.size()), table, class, index, transform, rep)

def raw_allowed(ok: Bool, table: Array<U32>, +class: U32, index: U32, transform: U32) -> Audit:
  match ok:
    case False{}: ClassAuditFailed{index, 1}
    case True{}: raw_rep(table[(representatives() + class : U32)], class, index, transform)

def raw_read(read: Array<U32> & U32, index: U32) -> Audit:
  match read:
    case Tuple{table, +value}:
      +class = (value .&. 65535 : U32)
      +transform = (value >> 16n : U32)
      raw_allowed(U32.is_lt(class, count()) && U32.is_lt(transform, 48), table, class, index, transform)

def audit_raw(fuel: Nat, +index: U32, state: Audit) -> Audit:
  match fuel state:
    case 1n+p ClassAuditWork{table, checked}: audit_raw(p, (index + 1 : U32), raw_read(table[index], index))
    case _ state: state

type Stabilizer is Data:
  Mask{lo: U32, hi: U32}
  MaskFailed{}

def mask_record(value: Maybe<&2, H.Corner>, +rep: U32, +sym: U32, mask: Stabilizer) -> Stabilizer:
  match value mask:
    case Some{corner} Mask{lo, hi}:
      +bit = (C.pick(U32.is_eq(H.index(corner), rep), 1, 0) << U32.to_nat((sym % 32 : U32)) : U32)
      Mask{(lo .|. C.pick(U32.is_lt(sym, 32), bit, 0) : U32), (hi .|. C.pick(U32.is_ge(sym, 32), bit, 0) : U32)}
    case _ _: MaskFailed{}

def mask_selected(selected: Maybe<&2, S.Symmetry>, corner: H.Corner, rep: U32, sym: U32, mask: Stabilizer) -> Stabilizer:
  match selected:
    case Some{selected}: mask_record(H.reference_transform(selected, corner), rep, sym, mask)
    case None{}: MaskFailed{}

def mask_run(fuel: Nat, +sym: U32, +corner: H.Corner, +rep: U32, mask: Stabilizer) -> Stabilizer:
  match fuel:
    case 0n: mask
    case 1n+p: mask_run(p, (sym + 1 : U32), corner, rep, mask_selected(S.from_index(sym), corner, rep, sym, mask))

def mask_corner(value: Maybe<&2, H.Corner>, rep: U32) -> Stabilizer:
  match value:
    case Some{corner}: mask_run(48n, 0, corner, rep, Mask{0, 0})
    case None{}: MaskFailed{}

def popcount(fuel: Nat, +word: U32, count: U32) -> U32:
  match fuel:
    case 0n: count
    case 1n+p: popcount(p, (word >> 1n : U32), (count + (word .&. 1) : U32))

def class_valid(ok: Bool, table: Array<U32>, +class: U32) -> Audit:
  match ok:
    case False{}: ClassAuditFailed{class, 9}
    case True{}: ClassAuditWork{table, (class + 1 : U32)}

def class_mask(mask: Stabilizer, table: Array<U32>, class: U32, +lo: U32, +hi: U32, +size: U32) -> Audit:
  match mask:
    case MaskFailed{}: ClassAuditFailed{class, 10}
    case Mask{+expected_lo, +expected_hi}:
      +stabilizers = (popcount(32n, expected_lo, 0) + popcount(16n, expected_hi, 0) : U32)
      class_valid(U32.is_eq(lo, expected_lo) && U32.is_eq(hi, expected_hi) && U32.is_eq((lo .&. 1 : U32), 1) && U32.is_lt(hi, 65536) && U32.is_gt(stabilizers, 0) && U32.is_eq((size * stabilizers : U32), 48), table, class)

def class_header(table: Array<U32>, class: U32, +rep: U32, lo: U32, hi: U32, size: U32) -> Audit:
  class_mask(mask_corner(H.from_index(rep), rep), table, class, lo, hi, size)

def header_size(read: Array<U32> & U32, class: U32, rep: U32, lo: U32, hi: U32) -> Audit:
  match read:
    case Tuple{table, size}: class_header(table, class, rep, lo, hi, size)

def header_hi(read: Array<U32> & U32, +class: U32, rep: U32, lo: U32) -> Audit:
  match read:
    case Tuple{table, hi}: header_size(table[(200000 + class : U32)], class, rep, lo, hi)

def header_lo(read: Array<U32> & U32, +class: U32, rep: U32) -> Audit:
  match read:
    case Tuple{table, lo}: header_hi(table[(stabilizers_hi() + class : U32)], class, rep, lo)

def header_rep(read: Array<U32> & U32, +class: U32) -> Audit:
  match read:
    case Tuple{table, rep}: header_lo(table[(stabilizers_lo() + class : U32)], class, rep)

def audit_class(state: Audit, +class: U32) -> Audit:
  match state:
    case ClassAuditWork{table, checked}:
      header_rep(table[(representatives() + class : U32)], class)
    case state: state

def audit_classes(fuel: Nat, +class: U32, state: Audit) -> Audit:
  match fuel state:
    case 1n+p ClassAuditWork{table, checked}: audit_classes(p, (class + 1 : U32), audit_class(ClassAuditWork{table, checked}, class))
    case _ state: state

def audit_finished(state: Audit) -> Audit:
  match state:
    case ClassAuditWork{table, 3393}: ClassAudited{table, 153090}
    case ClassAuditFailed{index, code}: ClassAuditFailed{index, code}
    case _: ClassAuditFailed{0, 11}

def raw_finished(state: Audit) -> Audit:
  match state:
    case ClassAuditWork{table, 153090}: audit_finished(audit_classes(3393n, 0, ClassAuditWork{table, 0}))
    case ClassAuditFailed{index, code}: ClassAuditFailed{index, code}
    case _: ClassAuditFailed{0, 12}

def reset_counts(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[(200000 + index : U32)] <- 0
      reset_counts(p, table, (index + 1 : U32))

def audit_sized(ok: Bool, read: Array<U32> & U32) -> Audit:
  match ok read:
    case True{} Tuple{table, 1048576}: raw_finished(audit_raw(153090n, 0, ClassAuditWork{reset_counts(3393n, table, 0), 0}))
    case _ _: ClassAuditFailed{0, 8}

def audit(state: Build) -> Audit:
  match state:
    case ClassComplete{table, classes, visited}: audit_sized(U32.is_eq(classes, count()) && U32.is_eq(visited, H.size()), Array.size(U32, table))
    case _: ClassAuditFailed{0, 6}
