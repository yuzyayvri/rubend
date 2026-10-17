import Base
import ./tables.bend as T
import ./cubie.bend as C

type Audit is Type:
  AReady{table: Array<U32>, index: U32, failures: U32, maximum: U32, hash: U32}
  AWork{table: Array<U32>, index: U32, x: U32, y: U32, move: U32, depth: U32, descended: Bool, failures: U32, maximum: U32, hash: U32}
  ADone{table: Array<U32>, failures: U32, maximum: U32, hash: U32}

def checked(read: Array<U32> & U32, +index: U32, x: U32, y: U32, +move: U32, +depth: U32, descended: Bool, +failures: U32, maximum: U32, hash: U32) -> Audit:
  match read:
    case Tuple{table, +neighbor}:
      AWork{table, index, x, y, (move + 1 : U32), depth, descended || U32.is_eq(depth, (neighbor + 1 : U32)), (failures + C.pick(U32.is_lt(neighbor, 255) && U32.is_le(depth, (neighbor + 1 : U32)), 0, 1) : U32), maximum, hash}

def bounded(ok: Bool, table: Array<U32>, index: U32, x: U32, y: U32, move: U32, depth: U32, descended: Bool, failures: U32, maximum: U32, hash: U32, at: U32) -> Audit:
  match ok:
    case True{}:
      checked(table[at], index, x, y, move, depth, descended, failures, maximum, hash)
    case False{}:
      ADone{table, (failures + 1 : U32), maximum, hash}

def next_y(read: Array<U32> & U32, +index: U32, x: U32, y: U32, move: U32, depth: U32, descended: Bool, failures: U32, maximum: U32, hash: U32, +nx: U32, spec: T.Spec) -> Audit:
  match read spec:
    case Tuple{table, +ny} T.Spec{base, +second, count, moves, ao, bo}:
      bounded(U32.is_lt(nx, (count / second : U32)) && U32.is_lt(ny, second), table, index, x, y, move, depth, descended, failures, maximum, hash, (base + nx * second + ny : U32))

def next_x(read: Array<U32> & U32, index: U32, x: U32, +y: U32, +move: U32, depth: U32, descended: Bool, failures: U32, maximum: U32, hash: U32, spec: T.Spec) -> Audit:
  match read spec:
    case Tuple{table, nx} T.Spec{base, second, count, +moves, ao, +bo}:
      next_y(table[(bo + y * moves + move : U32)], index, x, y, move, depth, descended, failures, maximum, hash, nx, T.Spec{base, second, count, moves, ao, bo})

def expand(active: Bool, table: Array<U32>, +index: U32, +x: U32, y: U32, +move: U32, +depth: U32, descended: Bool, +failures: U32, maximum: U32, hash: U32, spec: T.Spec) -> Audit:
  match active spec:
    case True{} T.Spec{base, second, count, +moves, +ao, bo}:
      next_x(table[(ao + x * moves + move : U32)], index, x, y, move, depth, descended, failures, maximum, hash, T.Spec{base, second, count, moves, ao, bo})
    case False{} _:
      AReady{table, (index + 1 : U32), (failures + C.pick(U32.is_eq(depth, 0) || descended, 0, 1) : U32), maximum, hash}

def depth(read: Array<U32> & U32, +index: U32, +failures: U32, +maximum: U32, +hash: U32, +second: U32) -> Audit:
  match read:
    case Tuple{table, +value}:
      AWork{table, index, (index / second : U32), (index % second : U32), 0, value, False{}, (failures + C.pick(U32.is_lt(value, 255) && (U32.is_eq(index, 0) && U32.is_eq(value, 0) || U32.is_ne(index, 0) && U32.is_gt(value, 0)), 0, 1) : U32), C.pick(U32.is_gt(value, maximum), value, maximum), ((hash * 16777619) .^. value .^. index : U32)}

def begin(active: Bool, table: Array<U32>, +index: U32, failures: U32, maximum: U32, hash: U32, spec: T.Spec) -> Audit:
  match active spec:
    case True{} T.Spec{base, second, count, moves, ao, bo}:
      depth(table[(base + index : U32)], index, failures, maximum, hash, second)
    case False{} _:
      ADone{table, failures, maximum, hash}

def step(state: Audit, +spec: T.Spec) -> Audit:
  match state spec:
    case AReady{table, +index, failures, maximum, hash} T.Spec{base, second, +count, moves, ao, bo}:
      begin(U32.is_lt(index, count), table, index, failures, maximum, hash, T.Spec{base, second, count, moves, ao, bo})
    case AWork{table, index, x, y, +move, depth, descended, failures, maximum, hash} T.Spec{base, second, count, +moves, ao, bo}:
      expand(U32.is_lt(move, moves), table, index, x, y, move, depth, descended, failures, maximum, hash, T.Spec{base, second, count, moves, ao, bo})
    case state _:
      state

def run(fuel: Nat, state: Audit, +spec: T.Spec) -> Audit:
  match fuel state:
    case _ ADone{table, failures, maximum, hash}:
      ADone{table, failures, maximum, hash}
    case 0n state:
      state
    case 1n+p state:
      run(p, step(state, spec), spec)

def audit(table: Array<U32>, +spec: T.Spec) -> Audit:
  match spec:
    case T.Spec{base, second, +count, +moves, ao, bo}:
      run(U32.to_nat((count * (moves + 2) + 1 : U32)), AReady{table, 0, 0, 0, 2166136261}, T.Spec{base, second, count, moves, ao, bo})
