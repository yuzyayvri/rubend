import Base
import ./coordinates.bend as Q
import ./cubie.bend as C

type Spec is Data:
  Spec{base: U32, second: U32, count: U32, moves: U32, ao: U32, bo: U32}

type Breadth is Type:
  BReady{table: Array<U32>, queue: Array<U32>, head: U32, tail: U32}
  BWork{table: Array<U32>, queue: Array<U32>, head: U32, tail: U32, x: U32, y: U32, move: U32, depth: U32}
  BEnd{table: Array<U32>, count: U32}

def fill(fuel: Nat, table: Array<U32>, +kind: Q.Coord, +at: U32, +width: U32, +offset: U32) -> Array<U32>:
  match fuel:
    case 0n:
      table
    case 1n+p:
      table[(offset + at : U32)] <- Q.transition(kind, (at / width : U32), (at % width : U32))
      fill(p, table, kind, (at + 1 : U32), width, offset)

def transitions() -> Array<U32>:
  table = [255 : U32^23n]
  table = fill(39366n, table, Q.Twist{}, 0, 18, 0)
  table = fill(36864n, table, Q.Flip{}, 0, 18, 39366)
  table = fill(8910n, table, Q.Slice{}, 0, 18, 76230)
  table = fill(403200n, table, Q.Corners{}, 0, 10, 85140)
  table = fill(403200n, table, Q.Edges{}, 0, 10, 488340)
  fill(240n, table, Q.Middle{}, 0, 10, 891540)

def enqueue(fresh: Bool, table: Array<U32>, queue: Array<U32>, +head: U32, +tail: U32, +x: U32, +y: U32, +move: U32, +depth: U32, +index: U32, +base: U32) -> Breadth:
  match fresh:
    case False{}:
      BWork{table, queue, head, tail, x, y, move, depth}
    case True{}:
      table[(base + index : U32)] <- (depth + 1 : U32)
      queue[tail] <- index
      BWork{table, queue, head, (tail + 1 : U32), x, y, move, depth}

def seen(read: Array<U32> & U32, queue: Array<U32>, +head: U32, +tail: U32, +x: U32, +y: U32, +move: U32, +depth: U32, +index: U32, +base: U32) -> Breadth:
  match read:
    case Tuple{table, value}:
      enqueue(U32.is_eq(value, 255), table, queue, head, tail, x, y, move, depth, index, base)

def next_y(read: Array<U32> & U32, queue: Array<U32>, +head: U32, +tail: U32, +x: U32, +y: U32, +move: U32, +depth: U32, +nx: U32, spec: Spec) -> Breadth:
  match read spec:
    case Tuple{table, ny} Spec{+base, second, count, moves, ao, bo}:
      +index = (nx * second + ny : U32)
      seen(table[(base + index : U32)], queue, head, tail, x, y, (move + 1 : U32), depth, index, base)

def next_x(read: Array<U32> & U32, queue: Array<U32>, +head: U32, +tail: U32, +x: U32, +y: U32, +move: U32, +depth: U32, +spec: Spec) -> Breadth:
  match read spec:
    case Tuple{table, nx} Spec{base, second, count, +moves, ao, +bo}:
      next_y(table[(bo + y * moves + move : U32)], queue, head, tail, x, y, move, depth, nx, Spec{base, second, count, moves, ao, bo})

def expand(ok: Bool, table: Array<U32>, queue: Array<U32>, +head: U32, +tail: U32, +x: U32, +y: U32, +move: U32, +depth: U32, spec: Spec) -> Breadth:
  match ok spec:
    case False{} _:
      BReady{table, queue, (head + 1 : U32), tail}
    case True{} Spec{base, second, count, +moves, +ao, bo}:
      next_x(table[(ao + x * moves + move : U32)], queue, head, tail, x, y, move, depth, Spec{base, second, count, moves, ao, bo})

def node_depth(read: Array<U32> & U32, queue: Array<U32>, +head: U32, +tail: U32, +index: U32, +second: U32) -> Breadth:
  match read:
    case Tuple{table, depth}:
      BWork{table, queue, head, tail, (index / second : U32), (index % second : U32), 0, depth}

def node(read: Array<U32> & U32, table: Array<U32>, +head: U32, +tail: U32, spec: Spec) -> Breadth:
  match read spec:
    case Tuple{queue, +index} Spec{base, second, count, moves, ao, bo}:
      node_depth(table[(base + index : U32)], queue, head, tail, index, second)

def start_node(ok: Bool, table: Array<U32>, queue: Array<U32>, +head: U32, +tail: U32, spec: Spec) -> Breadth:
  match ok:
    case False{}:
      BEnd{table, tail}
    case True{}:
      node(queue[head], table, head, tail, spec)

def step(state: Breadth, +spec: Spec) -> Breadth:
  match state spec:
    case BReady{table, queue, +head, +tail} _:
      start_node(U32.is_lt(head, tail), table, queue, head, tail, spec)
    case BWork{table, queue, head, tail, x, y, +move, depth} Spec{base, second, count, +moves, ao, bo}:
      expand(U32.is_lt(move, moves), table, queue, head, tail, x, y, move, depth, Spec{base, second, count, moves, ao, bo})
    case BEnd{table, count} _:
      BEnd{table, count}

def breadth(fuel: Nat, state: Breadth, +spec: Spec) -> Breadth:
  match fuel state:
    case _ BEnd{table, count}:
      BEnd{table, count}
    case 0n state:
      state
    case 1n+p state:
      breadth(p, step(state, spec), spec)

def counted(ok: Bool, table: Array<U32>) -> Array<U32>:
  match ok:
    case True{}:
      table
    case False{}:
      [0 : U32^0n]

def finish(state: Breadth, +expected: U32) -> Array<U32>:
  match state:
    case BEnd{table, count}:
      counted(U32.is_eq(count, expected), table)
    case _:
      [0 : U32^0n]

def generate_pair(table: Array<U32>, +spec: Spec) -> Array<U32>:
  match spec:
    case Spec{+base, second, +count, +moves, ao, bo}:
      table[base] <- 0
      finish(breadth(U32.to_nat((count * (moves + 2) + 1 : U32)), BReady{table, [0 : U32^21n], 0, 1}, Spec{base, second, count, moves, ao, bo}), count)

def generate() -> Array<U32>:
  table = transitions()
  table = generate_pair(table, Spec{891780, 495, 1082565, 18, 0, 76230})
  table = generate_pair(table, Spec{1974345, 495, 1013760, 18, 39366, 76230})
  table = generate_pair(table, Spec{2988105, 24, 967680, 10, 85140, 891540})
  generate_pair(table, Spec{3955785, 24, 967680, 10, 488340, 891540})
