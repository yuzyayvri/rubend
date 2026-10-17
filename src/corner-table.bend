import Base
import ./cubie.bend as C
import ./coordinates.bend as Q

type Space is Data:
  Permutation{}
  FullCorners{}

def width(space: Space) -> U32:
  match space:
    case Permutation{}: 1
    case FullCorners{}: 2187

def count(space: Space) -> U32:
  match space:
    case Permutation{}: 40320
    case FullCorners{}: 88179840

def distance_depth(space: Space) -> Nat:
  match space:
    case Permutation{}: 14n
    case FullCorners{}: 25n

def queue_depth(space: Space) -> Nat:
  match space:
    case Permutation{}: 16n
    case FullCorners{}: 27n

def permutation_transition(+index: U32, +move: U32) -> U32:
  Q.encode(Q.Corners{}, C.turn(move, Q.decode(Q.Corners{}, index)))

def fill_permutations(fuel: Nat, table: Array<U32>, +at: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[at] <- permutation_transition((at / 18 : U32), (at % 18 : U32))
      fill_permutations(p, table, (at + 1 : U32))

def fill_twists(fuel: Nat, table: Array<U32>, +at: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[(725760 + at : U32)] <- Q.transition(Q.Twist{}, (at / 18 : U32), (at % 18 : U32))
      fill_twists(p, table, (at + 1 : U32))

def transitions() -> Array<U32>:
  fill_twists(39366n, fill_permutations(725760n, [0 : U32^20n], 0), 0)

def extracted(read: Array<U32> & U32, index: U32) -> Array<U32> & U32:
  match read:
    case Tuple{table, word}: (table, ((word >> U32.to_nat((index % 4 * 8 : U32))) .&. 255 : U32))

def get(table: Array<U32>, +index: U32) -> Array<U32> & U32:
  extracted(table[(index / 4 : U32)], index)

def replaced(read: Array<U32> & U32, at: U32, value: U32, +shift: Nat) -> Array<U32>:
  match read:
    case Tuple{table, word}:
      table[at] <- ((word .&. ((255 << shift : U32) .^. 4294967295 : U32)) .|. (value << shift : U32) : U32)

def put(table: Array<U32>, +index: U32, value: U32) -> Array<U32>:
  replaced(table[(index / 4 : U32)], (index / 4 : U32), value, U32.to_nat((index % 4 * 8 : U32)))

type Build is Type:
  CornerReady{moves: Array<U32>, table: Array<U32>, queue: Array<U32>, head: U32, tail: U32, maximum: U32}
  CornerWork{moves: Array<U32>, table: Array<U32>, queue: Array<U32>, head: U32, tail: U32, x: U32, y: U32, move: U32, depth: U32, maximum: U32}
  CornerComplete{moves: Array<U32>, table: Array<U32>, count: U32, maximum: U32}
  CornerFailed{}

def maximum(+a: U32, +b: U32) -> U32:
  C.pick(U32.is_ge(a, b), a, b)

def enqueue(allowed: Bool, fresh: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, head: U32, +tail: U32, x: U32, y: U32, move: U32, +depth: U32, previous_max: U32, +index: U32) -> Build:
  match allowed fresh:
    case True{} True{}:
      table = put(table, index, (depth + 1 : U32))
      queue[tail] <- index
      CornerWork{moves, table, queue, head, (tail + 1 : U32), x, y, move, depth, maximum(previous_max, (depth + 1 : U32))}
    case True{} False{}: CornerWork{moves, table, queue, head, tail, x, y, move, depth, previous_max}
    case _ _: CornerFailed{}

def seen(read: Array<U32> & U32, moves: Array<U32>, queue: Array<U32>, +space: Space, head: U32, +tail: U32, x: U32, y: U32, +move: U32, +depth: U32, previous_max: U32, index: U32) -> Build:
  match read:
    case Tuple{table, value}:
      +fresh = U32.is_eq(value, 255)
      enqueue(Bool.not(fresh) || (U32.is_lt(depth, 254) && U32.is_lt(tail, count(space))), fresh, moves, table, queue, head, tail, x, y, (move + 1 : U32), depth, previous_max, index)

def target_allowed(allowed: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, space: Space, head: U32, tail: U32, x: U32, y: U32, move: U32, depth: U32, previous_max: U32, +index: U32) -> Build:
  match allowed:
    case True{}: seen(get(table, index), moves, queue, space, head, tail, x, y, move, depth, previous_max, index)
    case False{}: CornerFailed{}

def target(read: Array<U32> & U32, table: Array<U32>, queue: Array<U32>, +space: Space, head: U32, tail: U32, x: U32, y: U32, move: U32, depth: U32, previous_max: U32, +nx: U32) -> Build:
  match read:
    case Tuple{moves, +ny}:
      target_allowed(U32.is_lt(nx, 40320) && U32.is_lt(ny, width(space)), moves, table, queue, space, head, tail, x, y, move, depth, previous_max, (nx * width(space) + ny : U32))

def next_permutation(read: Array<U32> & U32, table: Array<U32>, queue: Array<U32>, space: Space, head: U32, tail: U32, x: U32, +y: U32, +move: U32, depth: U32, previous_max: U32) -> Build:
  match read space:
    case Tuple{moves, nx} Permutation{}: target((moves, 0), table, queue, Permutation{}, head, tail, x, y, move, depth, previous_max, nx)
    case Tuple{moves, nx} FullCorners{}: target(moves[(725760 + y * 18 + move : U32)], table, queue, FullCorners{}, head, tail, x, y, move, depth, previous_max, nx)

def expand(allowed: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, space: Space, +head: U32, tail: U32, +x: U32, y: U32, +move: U32, depth: U32, previous_max: U32) -> Build:
  match allowed:
    case True{}: next_permutation(moves[(x * 18 + move : U32)], table, queue, space, head, tail, x, y, move, depth, previous_max)
    case False{}: CornerReady{moves, table, queue, (head + 1 : U32), tail, previous_max}

def depth_allowed(allowed: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, +space: Space, head: U32, tail: U32, +index: U32, depth: U32, previous_max: U32) -> Build:
  match allowed:
    case True{}: CornerWork{moves, table, queue, head, tail, (index / width(space) : U32), (index % width(space) : U32), 0, depth, previous_max}
    case False{}: CornerFailed{}

def node_depth(read: Array<U32> & U32, moves: Array<U32>, queue: Array<U32>, space: Space, head: U32, tail: U32, index: U32, previous_max: U32) -> Build:
  match read:
    case Tuple{table, +depth}: depth_allowed(U32.is_lt(depth, 255), moves, table, queue, space, head, tail, index, depth, previous_max)

def node_allowed(allowed: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, space: Space, head: U32, tail: U32, +index: U32, previous_max: U32) -> Build:
  match allowed:
    case True{}: node_depth(get(table, index), moves, queue, space, head, tail, index, previous_max)
    case False{}: CornerFailed{}

def node(read: Array<U32> & U32, moves: Array<U32>, table: Array<U32>, +space: Space, head: U32, tail: U32, previous_max: U32) -> Build:
  match read:
    case Tuple{queue, +index}: node_allowed(U32.is_lt(index, count(space)), moves, table, queue, space, head, tail, index, previous_max)

def next_node(available: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, space: Space, +head: U32, tail: U32, previous_max: U32) -> Build:
  match available:
    case True{}: node(queue[head], moves, table, space, head, tail, previous_max)
    case False{}: CornerComplete{moves, table, tail, previous_max}

def step(state: Build, +space: Space) -> Build:
  match state:
    case CornerReady{moves, table, queue, +head, +tail, previous_max}: next_node(U32.is_lt(head, tail), moves, table, queue, space, head, tail, previous_max)
    case CornerWork{moves, table, queue, head, tail, x, y, +move, depth, previous_max}: expand(U32.is_lt(move, 18), moves, table, queue, space, head, tail, x, y, move, depth, previous_max)
    case state: state

def run(fuel: Nat, state: Build, +space: Space) -> Build:
  match fuel state:
    case 1n+p CornerReady{moves, table, queue, head, tail, previous_max}: run(p, step(CornerReady{moves, table, queue, head, tail, previous_max}, space), space)
    case 1n+p CornerWork{moves, table, queue, head, tail, x, y, move, depth, previous_max}: run(p, step(CornerWork{moves, table, queue, head, tail, x, y, move, depth, previous_max}, space), space)
    case _ state: state

def start_sized(read: Array<U32> & U32, +space: Space) -> Build:
  match read:
    case Tuple{moves, 1048576}: CornerReady{moves, put([4294967295 : U32^distance_depth(space)], 0, 0), [0 : U32^queue_depth(space)], 0, 1, 0}
    case _: CornerFailed{}

def start(moves: Array<U32>, space: Space) -> Build:
  start_sized(Array.size(U32, moves), space)

def generate(moves: Array<U32>, +space: Space) -> Build:
  run(U32.to_nat((count(space) * 20 + 1 : U32)), start(moves, space), space)

type RowCheck is Type:
  CornerRow{moves: Array<U32>, table: Array<U32>, decreasing: Bool}
  CornerInvalid{index: U32, move: U32, code: U32}

def checked_neighbor(allowed: Bool, moves: Array<U32>, table: Array<U32>, decreasing: Bool, index: U32, move: U32) -> RowCheck:
  match allowed:
    case True{}: CornerRow{moves, table, decreasing}
    case False{}: CornerInvalid{index, move, 1}

def neighbor(read: Array<U32> & U32, moves: Array<U32>, +depth: U32, decreasing: Bool, index: U32, move: U32) -> RowCheck:
  match read:
    case Tuple{table, +value}:
      checked_neighbor(U32.is_lt(value, 255) && U32.is_le(depth, (value + 1 : U32)) && U32.is_le(value, (depth + 1 : U32)), moves, table, decreasing || U32.is_eq((value + 1 : U32), depth), index, move)

def check_target_allowed(allowed: Bool, moves: Array<U32>, table: Array<U32>, depth: U32, decreasing: Bool, index: U32, move: U32, target: U32) -> RowCheck:
  match allowed:
    case True{}: neighbor(get(table, target), moves, depth, decreasing, index, move)
    case False{}: CornerInvalid{index, move, 2}

def check_target(read: Array<U32> & U32, table: Array<U32>, +space: Space, +nx: U32, depth: U32, decreasing: Bool, index: U32, move: U32) -> RowCheck:
  match read:
    case Tuple{moves, +ny}:
      check_target_allowed(U32.is_lt(nx, 40320) && U32.is_lt(ny, width(space)), moves, table, depth, decreasing, index, move, (nx * width(space) + ny : U32))

def check_permutation(read: Array<U32> & U32, table: Array<U32>, +space: Space, depth: U32, decreasing: Bool, +index: U32, +move: U32) -> RowCheck:
  match read space:
    case Tuple{moves, nx} Permutation{}: check_target((moves, 0), table, Permutation{}, nx, depth, decreasing, index, move)
    case Tuple{moves, nx} FullCorners{}: check_target(moves[(725760 + (index % 2187) * 18 + move : U32)], table, FullCorners{}, nx, depth, decreasing, index, move)

def check_moves(fuel: Nat, +space: Space, +index: U32, +depth: U32, +move: U32, state: RowCheck) -> RowCheck:
  match fuel state:
    case 1n+p CornerRow{moves, table, decreasing}:
      check_moves(p, space, index, depth, (move + 1 : U32), check_permutation(moves[((index / width(space)) * 18 + move : U32)], table, space, depth, decreasing, index, move))
    case _ state: state

type Audit is Type:
  CornerAudit{moves: Array<U32>, table: Array<U32>, index: U32, maximum: U32, total: Nat}
  CornerAudited{moves: Array<U32>, table: Array<U32>, count: U32, maximum: U32, total: Nat}
  CornerAuditFailed{index: U32, move: U32, code: U32}

def row_accepted(allowed: Bool, moves: Array<U32>, table: Array<U32>, +index: U32, +depth: U32, previous_max: U32, total: Nat) -> Audit:
  match allowed:
    case True{}: CornerAudit{moves, table, (index + 1 : U32), maximum(previous_max, depth), Nat.add(total, U32.to_nat(depth))}
    case False{}: CornerAuditFailed{index, 18, 4}

def row_checked(state: RowCheck, +index: U32, depth: U32, previous_max: U32, total: Nat) -> Audit:
  match state:
    case CornerRow{moves, table, decreasing}: row_accepted(U32.is_eq(index, 0) || decreasing, moves, table, index, depth, previous_max, total)
    case CornerInvalid{index, move, code}: CornerAuditFailed{index, move, code}

def row_depth_allowed(allowed: Bool, moves: Array<U32>, table: Array<U32>, space: Space, +index: U32, +depth: U32, previous_max: U32, total: Nat) -> Audit:
  match allowed:
    case True{}: row_checked(check_moves(18n, space, index, depth, 0, CornerRow{moves, table, False{}}), index, depth, previous_max, total)
    case False{}: CornerAuditFailed{index, 0, 3}

def row_depth(read: Array<U32> & U32, moves: Array<U32>, space: Space, +index: U32, previous_max: U32, total: Nat) -> Audit:
  match read:
    case Tuple{table, +depth}:
      row_depth_allowed((U32.is_eq(index, 0) && U32.is_eq(depth, 0)) || (U32.is_gt(index, 0) && U32.is_gt(depth, 0) && U32.is_lt(depth, 255)), moves, table, space, index, depth, previous_max, total)

def audit_available(available: Bool, moves: Array<U32>, table: Array<U32>, space: Space, +index: U32, previous_max: U32, total: Nat) -> Audit:
  match available:
    case True{}: row_depth(get(table, index), moves, space, index, previous_max, total)
    case False{}: CornerAudited{moves, table, index, previous_max, total}

def audit_step(state: Audit, +space: Space) -> Audit:
  match state:
    case CornerAudit{moves, table, +index, previous_max, total}: audit_available(U32.is_lt(index, count(space)), moves, table, space, index, previous_max, total)
    case state: state

def audit_run(fuel: Nat, state: Audit, +space: Space) -> Audit:
  match fuel state:
    case 1n+p CornerAudit{moves, table, index, previous_max, total}: audit_run(p, audit_step(CornerAudit{moves, table, index, previous_max, total}, space), space)
    case _ state: state

def begin_audit_counted(complete: Bool, moves: Array<U32>, table: Array<U32>) -> Audit:
  match complete:
    case True{}: CornerAudit{moves, table, 0, 0, 0n}
    case False{}: CornerAuditFailed{0, 0, 5}

def begin_audit(state: Build, space: Space) -> Audit:
  match state:
    case CornerComplete{moves, table, visited, maximum}: begin_audit_counted(U32.is_eq(visited, count(space)), moves, table)
    case _: CornerAuditFailed{0, 0, 5}

def audit(state: Build, +space: Space) -> Audit:
  audit_run(U32.to_nat((count(space) + 1 : U32)), begin_audit(state, space), space)
