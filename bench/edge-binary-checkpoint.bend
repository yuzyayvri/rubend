import Base
import ./edge-pattern-table.bend as T

type Scan is Type:
  Scan{table: Array<U32>, known: U32, before: U32, bad: U32}

def checked(read: Array<U32> & U32, +index: U32, +goal: U32, +depth: U32, known: U32, before: U32, bad: U32) -> Scan:
  match read:
    case Tuple{table, +value}:
      +valid = (U32.is_eq(value, 255) || U32.is_le(value, depth)) && (U32.is_ne(value, 0) || U32.is_eq(index, goal)) && (U32.is_ne(index, goal) || U32.is_eq(value, 0))
      Scan{table, (known + Bool.to_u32(U32.is_ne(value, 255)) : U32), (before + Bool.to_u32(U32.is_lt(value, depth)) : U32), (bad + Bool.to_u32(Bool.not(valid)) : U32)}

def scan(fuel: Nat, +index: U32, +goal: U32, +depth: U32, state: Scan) -> Scan:
  match fuel state:
    case 0n state: state
    case 1n+rest Scan{table, known, before, bad}:
      scan(rest, (index + 1 : U32), goal, depth, checked(table[index], index, goal, depth, known, before, bad))

def finish(ok: Bool, table: Array<U32>, depth: U32, reached: U32, expanded: U32) -> T.Build:
  match ok:
    case True{}: T.Active{T.Cells{table, reached, expanded, 0}, depth}
    case False{}: T.Finished{T.Cells{table, 0, 0, 1}, depth, False{}}

def scanned(state: Scan, +depth: U32, +reached: U32, +expanded: U32) -> T.Build:
  match state:
    case Scan{table, known, before, bad}:
      finish(U32.is_eq(known, reached) && U32.is_eq(before, expanded) && U32.is_eq(bad, 0), table, depth, reached, expanded)

def admitted(ok: Bool, table: Array<U32>, goal: U32, +depth: U32, reached: U32, expanded: U32) -> T.Build:
  match ok:
    case True{}: scanned(scan(190080n, 0, goal, depth, Scan{table, 0, 0, 0}), depth, reached, expanded)
    case False{}: finish(False{}, table, depth, reached, expanded)

def sized(read: Array<U32> & U32, +goal: U32, +depth: U32, +reached: U32, +expanded: U32) -> T.Build:
  match read:
    case Tuple{table, size}: admitted(U32.is_eq(size, 262144) && U32.is_lt(goal, 190080) && U32.is_le(depth, 32) && U32.is_le(expanded, reached) && U32.is_le(reached, 190080), table, goal, depth, reached, expanded)

def admit(table: Array<U32>, goal: U32, depth: U32, reached: U32, expanded: U32) -> T.Build:
  sized(Array.size(U32, table), goal, depth, reached, expanded)
