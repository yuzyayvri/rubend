import Base
import ./h0-meta.bend as M
import ./cubie.bend as C

def extracted(read: Array<U32> & U32, +index: U32) -> Array<U32> & U32:
  match read:
    case Tuple{data, word}: (data, ((word >> U32.to_nat((index % 4 * 8 : U32))) .&. 255 : U32))

def get(data: Array<U32>, +index: U32) -> Array<U32> & U32:
  extracted(data[(index / 4 : U32)], index)

def replaced(read: Array<U32> & U32, index: U32, value: U32, +shift: Nat) -> Array<U32>:
  match read:
    case Tuple{data, word}: data[index] <- ((word .&. U32.not((255 << shift : U32))) .|. (value << shift : U32) : U32)

def put(data: Array<U32>, +index: U32, value: U32) -> Array<U32>:
  replaced(data[(index / 4 : U32)], (index / 4 : U32), value, U32.to_nat((index % 4 * 8 : U32)))

type Build is Type:
  H0TWork{meta: Array<U32>, data: Array<U32>, queue: Array<U32>, head: U32, tail: U32, limit: U32, maximum: U32}
  H0TComplete{meta: Array<U32>, data: Array<U32>, expanded: U32, maximum: U32}
  H0TFailed{index: U32, code: U32}

def enqueued(ok: Bool, meta: Array<U32>, data: Array<U32>, queue: Array<U32>, head: U32, +tail: U32, limit: U32, +maximum: U32, +target: U32, +depth: U32) -> Build:
  match ok:
    case False{}: H0TFailed{target, 1}
    case True{}:
      data = put(data, target, depth)
      queue[tail] <- target
      H0TWork{meta, data, queue, head, (tail + 1 : U32), limit, C.pick(U32.is_gt(depth, maximum), depth, maximum)}

def orbit_existing(ok: Bool, meta: Array<U32>, data: Array<U32>, queue: Array<U32>, head: U32, tail: U32, limit: U32, maximum: U32, target: U32) -> Build:
  match ok:
    case False{}: H0TFailed{target, 2}
    case True{}: H0TWork{meta, data, queue, head, tail, limit, maximum}

def orbit_read(read: Array<U32> & U32, meta: Array<U32>, queue: Array<U32>, head: U32, +tail: U32, +limit: U32, maximum: U32, target: U32, +depth: U32) -> Build:
  match read:
    case Tuple{data, 255}: enqueued(U32.is_lt(tail, limit) && U32.is_lt(tail, M.count()) && U32.is_lt(depth, 255), meta, data, queue, head, tail, limit, maximum, target, depth)
    case Tuple{data, old}: orbit_existing(U32.is_eq(old, depth), meta, data, queue, head, tail, limit, maximum, target)

def orbit_target(ok: Bool, meta: Array<U32>, data: Array<U32>, queue: Array<U32>, head: U32, tail: U32, limit: U32, maximum: U32, +target: U32, depth: U32) -> Build:
  match ok:
    case False{}: H0TFailed{target, 3}
    case True{}: orbit_read(get(data, target), meta, queue, head, tail, limit, maximum, target, depth)

def orbit_edge(read: Array<U32> & U32, data: Array<U32>, queue: Array<U32>, head: U32, tail: U32, limit: U32, maximum: U32, class: U32, depth: U32) -> Build:
  match read:
    case Tuple{meta, +edge}: orbit_target(U32.is_lt(edge, 34650), meta, data, queue, head, tail, limit, maximum, (class * 34650 + edge : U32), depth)

def orbit_selected(enabled: Bool, +sym: U32, class: U32, +edge: U32, depth: U32, state: Build) -> Build:
  match enabled state:
    case True{} H0TWork{meta, data, queue, head, tail, limit, maximum}: orbit_edge(meta[(M.edge_symmetries() + edge * 48 + sym : U32)], data, queue, head, tail, limit, maximum, class, depth)
    case _ state: state

def has(+lo: U32, +hi: U32, +sym: U32) -> Bool:
  U32.is_eq(((C.pick(U32.is_lt(sym, 32), lo, hi) >> U32.to_nat((sym % 32 : U32))) .&. 1 : U32), 1)

def orbit(fuel: Nat, +sym: U32, +class: U32, +edge: U32, +depth: U32, +lo: U32, +hi: U32, state: Build) -> Build:
  match fuel state:
    case 1n+p H0TWork{meta, data, queue, head, tail, limit, maximum}: orbit(p, (sym + 1 : U32), class, edge, depth, lo, hi, orbit_selected(has(lo, hi, sym), sym, class, edge, depth, H0TWork{meta, data, queue, head, tail, limit, maximum}))
    case _ state: state

def masked(identity: Bool, meta: Array<U32>, data: Array<U32>, queue: Array<U32>, head: U32, +tail: U32, +limit: U32, maximum: U32, +target: U32, +depth: U32, lo: U32, hi: U32) -> Build:
  match identity:
    case True{}: enqueued(U32.is_lt(tail, limit) && U32.is_lt(tail, M.count()) && U32.is_lt(depth, 255), meta, data, queue, head, tail, limit, maximum, target, depth)
    case False{}: orbit(48n, 0, (target / 34650 : U32), (target % 34650 : U32), depth, lo, hi, H0TWork{meta, data, queue, head, tail, limit, maximum})

def mask_hi(read: Array<U32> & U32, data: Array<U32>, queue: Array<U32>, head: U32, tail: U32, limit: U32, maximum: U32, target: U32, depth: U32, +lo: U32) -> Build:
  match read:
    case Tuple{meta, +hi}: masked(U32.is_eq(lo, 1) && U32.is_eq(hi, 0), meta, data, queue, head, tail, limit, maximum, target, depth, lo, hi)

def mask_lo(read: Array<U32> & U32, data: Array<U32>, queue: Array<U32>, head: U32, tail: U32, limit: U32, maximum: U32, +target: U32, depth: U32) -> Build:
  match read:
    case Tuple{meta, lo}: mask_hi(meta[(M.stabilizers_hi() + target / 34650 : U32)], data, queue, head, tail, limit, maximum, target, depth, lo)

def visit_read(read: Array<U32> & U32, meta: Array<U32>, queue: Array<U32>, head: U32, tail: U32, limit: U32, maximum: U32, +target: U32, +depth: U32) -> Build:
  match read:
    case Tuple{data, 255}: mask_lo(meta[(M.stabilizers_lo() + target / 34650 : U32)], data, queue, head, tail, limit, maximum, target, depth)
    case Tuple{data, old}: orbit_existing(U32.is_le(old, depth), meta, data, queue, head, tail, limit, maximum, target)

def visit_allowed(ok: Bool, +target: U32, depth: U32, state: Build) -> Build:
  match ok state:
    case True{} H0TWork{meta, data, queue, head, tail, limit, maximum}: visit_read(get(data, target), meta, queue, head, tail, limit, maximum, target, depth)
    case False{} _: H0TFailed{target, 3}
    case _ state: state

def visit(+target: U32, depth: U32, state: Build) -> Build:
  visit_allowed(U32.is_lt(target, M.count()), target, depth, state)

def neighbor_sym(read: Array<U32> & U32, class: U32) -> Array<U32> & U32:
  match read:
    case Tuple{meta, edge}: (meta, (class * 34650 + edge : U32))

def neighbor_edge(read: Array<U32> & U32, +packed: U32) -> Array<U32> & U32:
  match read:
    case Tuple{meta, edge}: neighbor_sym(meta[(M.edge_symmetries() + edge * 48 + (packed >> 16n) : U32)], (packed .&. 65535 : U32))

def neighbor_corner(read: Array<U32> & U32, edge: U32, move: U32) -> Array<U32> & U32:
  match read:
    case Tuple{meta, packed}: neighbor_edge(meta[(M.edge_moves() + edge * 18 + move : U32)], packed)

def neighbor(meta: Array<U32>, class: U32, edge: U32, +move: U32) -> Array<U32> & U32:
  neighbor_corner(meta[(M.corner_moves() + class * 18 + move : U32)], edge, move)

def moved_target(read: Array<U32> & U32, data: Array<U32>, queue: Array<U32>, head: U32, tail: U32, limit: U32, maximum: U32, depth: U32) -> Build:
  match read:
    case Tuple{meta, target}: visit(target, depth, H0TWork{meta, data, queue, head, tail, limit, maximum})

def move_one(+class: U32, edge: U32, +move: U32, depth: U32, state: Build) -> Build:
  match state:
    case H0TWork{meta, data, queue, head, tail, limit, maximum}: moved_target(neighbor(meta, class, edge, move), data, queue, head, tail, limit, maximum, depth)
    case state: state

def moves(fuel: Nat, +move: U32, +class: U32, +edge: U32, +depth: U32, state: Build) -> Build:
  match fuel state:
    case 1n+p H0TWork{meta, data, queue, head, tail, limit, maximum}: moves(p, (move + 1 : U32), class, edge, depth, move_one(class, edge, move, depth, H0TWork{meta, data, queue, head, tail, limit, maximum}))
    case _ state: state

def node_finished(state: Build) -> Build:
  match state:
    case H0TWork{meta, data, queue, head, tail, limit, maximum}: H0TWork{meta, data, queue, (head + 1 : U32), tail, limit, maximum}
    case state: state

def depth_read(read: Array<U32> & U32, meta: Array<U32>, queue: Array<U32>, head: U32, tail: U32, limit: U32, maximum: U32, +node: U32) -> Build:
  match read:
    case Tuple{data, depth}: node_finished(moves(18n, 0, (node / 34650 : U32), (node % 34650 : U32), (depth + 1 : U32), H0TWork{meta, data, queue, head, tail, limit, maximum}))

def queued(read: Array<U32> & U32, meta: Array<U32>, data: Array<U32>, head: U32, tail: U32, limit: U32, maximum: U32) -> Build:
  match read:
    case Tuple{queue, +node}: depth_read(get(data, node), meta, queue, head, tail, limit, maximum, node)

def next(complete: Bool, active: Bool, meta: Array<U32>, data: Array<U32>, queue: Array<U32>, +head: U32, tail: U32, limit: U32, maximum: U32) -> Build:
  match complete active:
    case True{} _: H0TComplete{meta, data, head, maximum}
    case False{} True{}: queued(queue[head], meta, data, head, tail, limit, maximum)
    case _ _: H0TFailed{tail, 4}

def step(state: Build) -> Build:
  match state:
    case H0TWork{meta, data, queue, +head, +tail, limit, maximum}: next(U32.is_eq(tail, M.count()), U32.is_lt(head, tail), meta, data, queue, head, tail, limit, maximum)
    case state: state

def run(fuel: Nat, state: Build) -> Build:
  match fuel state:
    case 1n+p H0TWork{meta, data, queue, head, tail, limit, maximum}: run(p, step(H0TWork{meta, data, queue, head, tail, limit, maximum}))
    case _ state: state

def seeded(read: Array<U32> & U32) -> Build:
  match read:
    case Tuple{meta, goal}: visit(goal, 0, H0TWork{meta, [4294967295 : U32^25n], [0 : U32^27n], 0, 0, 134217728, 0})

def start(meta: M.Audit) -> Build:
  match meta:
    case M.H0MAudited{meta}: seeded(meta[4])
    case _: H0TFailed{0, 5}
