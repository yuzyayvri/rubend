import Base
import ./h0-table.bend as B
import ./h0-meta.bend as M
import ./cubie.bend as C

type Audit is Type:
  H0TAWork{meta: Array<U32>, data: Array<U32>, index: U32, goal: U32, maximum: U32, sum: Nat}
  H0TANode{meta: Array<U32>, data: Array<U32>, index: U32, goal: U32, maximum: U32, sum: Nat, depth: U32, down: Bool}
  H0TAAudited{meta: Array<U32>, data: Array<U32>, maximum: U32, sum: Nat}
  H0TAFailed{index: U32, code: U32}

def compared(ok: Bool, data: Array<U32>, meta: Array<U32>, index: U32, goal: U32, maximum: U32, sum: Nat, depth: U32, down: Bool) -> Audit:
  match ok:
    case True{}: H0TANode{meta, data, index, goal, maximum, sum, depth, down}
    case False{}: H0TAFailed{index, 1}

def edge_depth(read: Array<U32> & U32, meta: Array<U32>, index: U32, goal: U32, maximum: U32, sum: Nat, +depth: U32, down: Bool) -> Audit:
  match read:
    case Tuple{data, +other}: compared(U32.is_lt(other, 255) && U32.is_le(other, (depth + 1 : U32)) && U32.is_le(depth, (other + 1 : U32)), data, meta, index, goal, maximum, sum, depth, down || U32.is_lt(other, depth))

def edge_target(read: Array<U32> & U32, data: Array<U32>, index: U32, goal: U32, maximum: U32, sum: Nat, depth: U32, down: Bool) -> Audit:
  match read:
    case Tuple{meta, target}: edge_depth(B.get(data, target), meta, index, goal, maximum, sum, depth, down)

def edges(fuel: Nat, +move: U32, state: Audit) -> Audit:
  match fuel state:
    case 1n+p H0TANode{meta, data, +index, goal, maximum, sum, depth, down}: edges(p, (move + 1 : U32), edge_target(B.neighbor(meta, (index / 34650 : U32), (index % 34650 : U32), move), data, index, goal, maximum, sum, depth, down))
    case _ state: state

def orbit_depth(read: Array<U32> & U32, meta: Array<U32>, index: U32, goal: U32, maximum: U32, sum: Nat, +depth: U32, down: Bool) -> Audit:
  match read:
    case Tuple{data, other}: compared(U32.is_eq(other, depth), data, meta, index, goal, maximum, sum, depth, down)

def orbit_target(read: Array<U32> & U32, data: Array<U32>, +index: U32, goal: U32, maximum: U32, sum: Nat, depth: U32, down: Bool) -> Audit:
  match read:
    case Tuple{meta, edge}: orbit_depth(B.get(data, (index / 34650 * 34650 + edge : U32)), meta, index, goal, maximum, sum, depth, down)

def orbit_selected(enabled: Bool, sym: U32, state: Audit) -> Audit:
  match enabled state:
    case True{} H0TANode{meta, data, +index, goal, maximum, sum, depth, down}: orbit_target(meta[(M.edge_symmetries() + index % 34650 * 48 + sym : U32)], data, index, goal, maximum, sum, depth, down)
    case _ state: state

def orbit(fuel: Nat, +sym: U32, +lo: U32, +hi: U32, state: Audit) -> Audit:
  match fuel state:
    case 1n+p H0TANode{meta, data, index, goal, maximum, sum, depth, down}: orbit(p, (sym + 1 : U32), lo, hi, orbit_selected(B.has(lo, hi, sym), sym, H0TANode{meta, data, index, goal, maximum, sum, depth, down}))
    case _ state: state

def orbit_masks(read: Array<U32> & U32, data: Array<U32>, index: U32, goal: U32, maximum: U32, sum: Nat, depth: U32, down: Bool, lo: U32) -> Audit:
  match read:
    case Tuple{meta, hi}: orbit(47n, 1, lo, hi, H0TANode{meta, data, index, goal, maximum, sum, depth, down})

def orbit_lo(read: Array<U32> & U32, data: Array<U32>, +index: U32, goal: U32, maximum: U32, sum: Nat, depth: U32, down: Bool) -> Audit:
  match read:
    case Tuple{meta, lo}: orbit_masks(meta[(M.stabilizers_hi() + index / 34650 : U32)], data, index, goal, maximum, sum, depth, down, lo)

def orbits(state: Audit) -> Audit:
  match state:
    case H0TANode{meta, data, +index, goal, maximum, sum, depth, down}: orbit_lo(meta[(M.stabilizers_lo() + index / 34650 : U32)], data, index, goal, maximum, sum, depth, down)
    case state: state

def finished_node(ok: Bool, meta: Array<U32>, data: Array<U32>, +index: U32, goal: U32, maximum: U32, sum: Nat) -> Audit:
  match ok:
    case True{}: H0TAWork{meta, data, (index + 1 : U32), goal, maximum, sum}
    case False{}: H0TAFailed{index, 2}

def finished(state: Audit) -> Audit:
  match state:
    case H0TANode{meta, data, +index, +goal, maximum, sum, depth, down}: finished_node(U32.is_eq(index, goal) || down, meta, data, index, goal, maximum, sum)
    case state: state

def valid_node(ok: Bool, meta: Array<U32>, data: Array<U32>, index: U32, goal: U32, +maximum: U32, sum: Nat, +depth: U32) -> Audit:
  match ok:
    case True{}: finished(orbits(edges(18n, 0, H0TANode{meta, data, index, goal, C.pick(U32.is_gt(depth, maximum), depth, maximum), (sum + U32.to_nat(depth) : Nat), depth, False{}})))
    case False{}: H0TAFailed{index, 3}

def node(read: Array<U32> & U32, meta: Array<U32>, +index: U32, +goal: U32, maximum: U32, sum: Nat) -> Audit:
  match read:
    case Tuple{data, +depth}: valid_node(U32.is_lt(depth, 255) && ((U32.is_eq(depth, 0) && U32.is_eq(index, goal)) || (U32.is_gt(depth, 0) && Bool.not(U32.is_eq(index, goal)))), meta, data, index, goal, maximum, sum, depth)

def padding_ok(ok: Bool, meta: Array<U32>, data: Array<U32>, maximum: U32, sum: Nat) -> Audit:
  match ok:
    case True{}: H0TAAudited{meta, data, maximum, sum}
    case False{}: H0TAFailed{117567450, 4}

def pad_second(read: Array<U32> & U32, meta: Array<U32>, maximum: U32, sum: Nat, first: U32) -> Audit:
  match read:
    case Tuple{data, second}: padding_ok(U32.is_eq(first, 255) && U32.is_eq(second, 255), meta, data, maximum, sum)

def pad_first(read: Array<U32> & U32, meta: Array<U32>, maximum: U32, sum: Nat) -> Audit:
  match read:
    case Tuple{data, first}: pad_second(B.get(data, 117567451), meta, maximum, sum, first)

def next(complete: Bool, meta: Array<U32>, data: Array<U32>, +index: U32, goal: U32, maximum: U32, sum: Nat) -> Audit:
  match complete:
    case True{}: pad_first(B.get(data, 117567450), meta, maximum, sum)
    case False{}: node(B.get(data, index), meta, index, goal, maximum, sum)

def run(fuel: Nat, state: Audit) -> Audit:
  match fuel state:
    case 1n+p H0TAWork{meta, data, +index, goal, maximum, sum}: run(p, next(U32.is_eq(index, M.count()), meta, data, index, goal, maximum, sum))
    case _ state: state

def goal_checked(ok: Bool, meta: Array<U32>, data: Array<U32>, goal: U32) -> Audit:
  match ok:
    case True{}: H0TAWork{meta, data, 0, goal, 0, 0n}
    case False{}: H0TAFailed{goal, 5}

def goal_depth(read: Array<U32> & U32, meta: Array<U32>, +goal: U32) -> Audit:
  match read:
    case Tuple{data, depth}: goal_checked(U32.is_eq(depth, 0), meta, data, goal)

def goal(read: Array<U32> & U32, data: Array<U32>) -> Audit:
  match read:
    case Tuple{meta, +goal}: goal_depth(B.get(data, goal), meta, goal)

def sized(ok: Bool, meta: Array<U32>, data: Array<U32>) -> Audit:
  match ok:
    case True{}: goal(meta[4], data)
    case False{}: H0TAFailed{0, 6}

def size_data(read: Array<U32> & U32, meta: Array<U32>) -> Audit:
  match read:
    case Tuple{data, size}: sized(U32.is_eq(size, 33554432), meta, data)

def start(state: B.Build) -> Audit:
  match state:
    case B.H0TComplete{meta, data, expanded, maximum}: size_data(Array.size(U32, data), meta)
    case _: H0TAFailed{0, 7}
