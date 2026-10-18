import Base
import ./h0-corners.bend as H
import ./h0-classes.bend as G
import ./coordinates.bend as Q
import ./model.bend as M
import ./cubie.bend as C

type Graph is Data:
  Raw{}
  Reduced{}

def size(graph: Graph) -> U32:
  match graph:
    case Raw{}: 153090
    case Reduced{}: 3393

def base(graph: Graph) -> U32:
  match graph:
    case Raw{}: 300000
    case Reduced{}: 600000

def separation(value: Maybe<&2, H.Corner>, move: U32) -> U32:
  match value:
    case None{}: 4294967295
    case Some{corner}: (H.index(H.transition(M.from_index(move), corner)) % 70 : U32)

def fill_separation(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[(39366 + index : U32)] <- separation(H.from_index((index / 18 : U32)), (index % 18 : U32))
      fill_separation(p, table, (index + 1 : U32))

def fill_twist(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[index] <- Q.transition(Q.Twist{}, (index / 18 : U32), (index % 18 : U32))
      fill_twist(p, table, (index + 1 : U32))

def transitions() -> Array<U32>:
  fill_separation(1260n, fill_twist(39366n, [0 : U32^16n], 0), 0)

def target_separation(read: Array<U32> & U32, +twist: U32) -> Array<U32> & U32:
  match read:
    case Tuple{moves, +separation}: (moves, C.pick(U32.is_lt(twist, 2187) && U32.is_lt(separation, 70), (twist * 70 + separation : U32), 4294967295))

def target_twist(read: Array<U32> & U32, +source: U32, move: U32) -> Array<U32> & U32:
  match read:
    case Tuple{moves, twist}: target_separation(moves[(39366 + source % 70 * 18 + move : U32)], twist)

def transition(moves: Array<U32>, +source: U32, +move: U32) -> Array<U32> & U32:
  target_twist(moves[(source / 70 * 18 + move : U32)], source, move)

type Build is Type:
  DReady{moves: Array<U32>, table: Array<U32>, queue: Array<U32>, head: U32, tail: U32, maximum: U32}
  DWork{moves: Array<U32>, table: Array<U32>, queue: Array<U32>, head: U32, tail: U32, source: U32, move: U32, depth: U32, maximum: U32}
  DComplete{moves: Array<U32>, table: Array<U32>, visited: U32, maximum: U32}
  DFailed{index: U32, code: U32}

def enqueued(ok: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, +graph: Graph, head: U32, +tail: U32, source: U32, move: U32, +depth: U32, +maximum: U32, +target: U32) -> Build:
  match ok:
    case False{}: DFailed{target, 1}
    case True{}:
      +next = (depth + 1 : U32)
      table[(base(graph) + target : U32)] <- next
      queue[tail] <- target
      DWork{moves, table, queue, head, (tail + 1 : U32), source, (move + 1 : U32), depth, C.pick(U32.is_gt(next, maximum), next, maximum)}

def distance_read(read: Array<U32> & U32, moves: Array<U32>, queue: Array<U32>, +graph: Graph, head: U32, +tail: U32, source: U32, move: U32, +depth: U32, maximum: U32, target: U32) -> Build:
  match read:
    case Tuple{table, 4294967295}: enqueued(U32.is_lt(tail, size(graph)) && U32.is_lt(depth, 254), moves, table, queue, graph, head, tail, source, move, depth, maximum, target)
    case Tuple{table, old}: DWork{moves, table, queue, head, tail, source, (move + 1 : U32), depth, maximum}

def target_allowed(ok: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, +graph: Graph, head: U32, tail: U32, source: U32, move: U32, depth: U32, maximum: U32, +target: U32) -> Build:
  match ok:
    case False{}: DFailed{target, 2}
    case True{}: distance_read(table[(base(graph) + target : U32)], moves, queue, graph, head, tail, source, move, depth, maximum, target)

def class_target(read: Array<U32> & U32, moves: Array<U32>, queue: Array<U32>, head: U32, tail: U32, source: U32, move: U32, depth: U32, maximum: U32) -> Build:
  match read:
    case Tuple{table, value}:
      +target = (value .&. 65535 : U32)
      target_allowed(U32.is_lt(target, 3393), moves, table, queue, Reduced{}, head, tail, source, move, depth, maximum, target)

def raw_target_allowed(ok: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, graph: Graph, head: U32, tail: U32, source: U32, move: U32, depth: U32, maximum: U32, +target: U32) -> Build:
  match ok graph:
    case True{} Raw{}: target_allowed(True{}, moves, table, queue, Raw{}, head, tail, source, move, depth, maximum, target)
    case True{} Reduced{}: class_target(table[target], moves, queue, head, tail, source, move, depth, maximum)
    case False{} _: DFailed{target, 3}

def raw_target(read: Array<U32> & U32, table: Array<U32>, queue: Array<U32>, graph: Graph, head: U32, tail: U32, source: U32, move: U32, depth: U32, maximum: U32) -> Build:
  match read:
    case Tuple{moves, +target}: raw_target_allowed(U32.is_lt(target, 153090), moves, table, queue, graph, head, tail, source, move, depth, maximum, target)

def expand(ok: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, graph: Graph, +head: U32, tail: U32, +source: U32, +move: U32, depth: U32, maximum: U32) -> Build:
  match ok:
    case False{}: DReady{moves, table, queue, (head + 1 : U32), tail, maximum}
    case True{}: raw_target(transition(moves, source, move), table, queue, graph, head, tail, source, move, depth, maximum)

def source_allowed(ok: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, head: U32, tail: U32, source: U32, depth: U32, maximum: U32) -> Build:
  match ok:
    case False{}: DFailed{source, 4}
    case True{}: DWork{moves, table, queue, head, tail, source, 0, depth, maximum}

def source_read(read: Array<U32> & U32, moves: Array<U32>, queue: Array<U32>, head: U32, tail: U32, +depth: U32, maximum: U32) -> Build:
  match read:
    case Tuple{table, +source}: source_allowed(U32.is_lt(source, 153090) && U32.is_lt(depth, 255), moves, table, queue, head, tail, source, depth, maximum)

def node_distance(read: Array<U32> & U32, moves: Array<U32>, queue: Array<U32>, graph: Graph, head: U32, tail: U32, node: U32, maximum: U32) -> Build:
  match read graph:
    case Tuple{table, +depth} Raw{}: source_allowed(U32.is_lt(depth, 255), moves, table, queue, head, tail, node, depth, maximum)
    case Tuple{table, depth} Reduced{}: source_read(table[(G.representatives() + node : U32)], moves, queue, head, tail, depth, maximum)

def node_allowed(ok: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, +graph: Graph, head: U32, tail: U32, +node: U32, maximum: U32) -> Build:
  match ok:
    case False{}: DFailed{node, 5}
    case True{}: node_distance(table[(base(graph) + node : U32)], moves, queue, graph, head, tail, node, maximum)

def queued(read: Array<U32> & U32, moves: Array<U32>, table: Array<U32>, +graph: Graph, head: U32, tail: U32, maximum: U32) -> Build:
  match read:
    case Tuple{queue, +node}: node_allowed(U32.is_lt(node, size(graph)), moves, table, queue, graph, head, tail, node, maximum)

def finished(ok: Bool, moves: Array<U32>, table: Array<U32>, visited: U32, maximum: U32) -> Build:
  match ok:
    case True{}: DComplete{moves, table, visited, maximum}
    case False{}: DFailed{visited, 8}

def next_node(active: Bool, moves: Array<U32>, table: Array<U32>, queue: Array<U32>, +graph: Graph, +head: U32, +tail: U32, maximum: U32) -> Build:
  match active:
    case True{}: queued(queue[head], moves, table, graph, head, tail, maximum)
    case False{}: finished(U32.is_eq(tail, size(graph)), moves, table, tail, maximum)

def step(state: Build, +graph: Graph) -> Build:
  match state:
    case DReady{moves, table, queue, +head, +tail, maximum}: next_node(U32.is_lt(head, tail), moves, table, queue, graph, head, tail, maximum)
    case DWork{moves, table, queue, head, tail, source, +move, depth, maximum}: expand(U32.is_lt(move, 18), moves, table, queue, graph, head, tail, source, move, depth, maximum)
    case state: state

def run(fuel: Nat, state: Build, +graph: Graph) -> Build:
  match fuel state:
    case 1n+p DReady{moves, table, queue, head, tail, maximum}: run(p, step(DReady{moves, table, queue, head, tail, maximum}, graph), graph)
    case 1n+p DWork{moves, table, queue, head, tail, source, move, depth, maximum}: run(p, step(DWork{moves, table, queue, head, tail, source, move, depth, maximum}, graph), graph)
    case _ state: state

def rooted(ok: Bool, moves: Array<U32>, table: Array<U32>, +graph: Graph, +goal: U32) -> Build:
  match ok:
    case False{}: DFailed{goal, 6}
    case True{}:
      table[(base(graph) + goal : U32)] <- 0
      queue = [0 : U32^18n]
      queue[0] <- goal
      run(U32.to_nat((size(graph) * 20 + 1 : U32)), DReady{moves, table, queue, 0, 1, 0}, graph)

def reduced_root(read: Array<U32> & U32, moves: Array<U32>) -> Build:
  match read:
    case Tuple{table, value}:
      +goal = (value .&. 65535 : U32)
      rooted(U32.is_lt(goal, 3393), moves, table, Reduced{}, goal)

def reset(fuel: Nat, table: Array<U32>, +base: U32, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[(base + index : U32)] <- 4294967295
      reset(p, table, base, (index + 1 : U32))

def initialized(graph: Graph, moves: Array<U32>, table: Array<U32>) -> Build:
  match graph:
    case Raw{}: rooted(True{}, moves, table, Raw{}, H.index(H.goal()))
    case Reduced{}: reduced_root(table[H.index(H.goal())], moves)

def table_sized(read: Array<U32> & U32, +graph: Graph, moves: Array<U32>) -> Build:
  match read:
    case Tuple{table, 1048576}: initialized(graph, moves, reset(U32.to_nat(size(graph)), table, base(graph), 0))
    case _: DFailed{0, 9}

def moves_sized(read: Array<U32> & U32, graph: Graph, table: Array<U32>) -> Build:
  match read:
    case Tuple{moves, 65536}: table_sized(Array.size(U32, table), graph, moves)
    case _: DFailed{0, 10}

def generate(graph: Graph, moves: Array<U32>, classes: G.Audit) -> Build:
  match classes:
    case G.ClassAudited{table, 153090}: moves_sized(Array.size(U32, moves), graph, table)
    case _: DFailed{0, 7}

type Audit is Type:
  H0DNode{moves: Array<U32>, table: Array<U32>, index: U32, maximum: U32, sum: U32}
  H0DMoves{moves: Array<U32>, table: Array<U32>, index: U32, depth: U32, move: U32, decreasing: Bool, maximum: U32, sum: U32}
  H0DAudited{moves: Array<U32>, table: Array<U32>, maximum: U32, sum: U32}
  H0DAuditFailed{index: U32, code: U32}

def neighbor_valid(ok: Bool, moves: Array<U32>, table: Array<U32>, index: U32, depth: U32, move: U32, decreasing: Bool, maximum: U32, sum: U32) -> Audit:
  match ok:
    case False{}: H0DAuditFailed{index, 4}
    case True{}: H0DMoves{moves, table, index, depth, (move + 1 : U32), decreasing, maximum, sum}

def neighbor_read(read: Array<U32> & U32, moves: Array<U32>, index: U32, +depth: U32, move: U32, decreasing: Bool, maximum: U32, sum: U32) -> Audit:
  match read:
    case Tuple{table, +neighbor}: neighbor_valid(U32.is_lt(neighbor, 255) && U32.is_le(depth, (neighbor + 1 : U32)) && U32.is_le(neighbor, (depth + 1 : U32)), moves, table, index, depth, move, decreasing || U32.is_eq((neighbor + 1 : U32), depth), maximum, sum)

def neighbor_allowed(ok: Bool, moves: Array<U32>, table: Array<U32>, index: U32, depth: U32, move: U32, decreasing: Bool, maximum: U32, sum: U32, target: U32) -> Audit:
  match ok:
    case False{}: H0DAuditFailed{index, 1}
    case True{}: neighbor_read(table[(300000 + target : U32)], moves, index, depth, move, decreasing, maximum, sum)

def neighbor_target(read: Array<U32> & U32, table: Array<U32>, index: U32, depth: U32, move: U32, decreasing: Bool, maximum: U32, sum: U32) -> Audit:
  match read:
    case Tuple{moves, +target}: neighbor_allowed(U32.is_lt(target, 153090), moves, table, index, depth, move, decreasing, maximum, sum, target)

def row_finished(ok: Bool, moves: Array<U32>, table: Array<U32>, +index: U32, maximum: U32, sum: U32) -> Audit:
  match ok:
    case False{}: H0DAuditFailed{index, 5}
    case True{}: H0DNode{moves, table, (index + 1 : U32), maximum, sum}

def row_expand(active: Bool, moves: Array<U32>, table: Array<U32>, +index: U32, depth: U32, +move: U32, decreasing: Bool, maximum: U32, sum: U32) -> Audit:
  match active:
    case False{}: row_finished(decreasing || U32.is_eq(index, H.index(H.goal())), moves, table, index, maximum, sum)
    case True{}: neighbor_target(transition(moves, index, move), table, index, depth, move, decreasing, maximum, sum)

def class_equal(ok: Bool, moves: Array<U32>, table: Array<U32>, index: U32, +depth: U32, +maximum: U32, sum: U32) -> Audit:
  match ok:
    case False{}: H0DAuditFailed{index, 2}
    case True{}: H0DMoves{moves, table, index, depth, 0, False{}, C.pick(U32.is_gt(depth, maximum), depth, maximum), (sum + depth : U32)}

def class_distance(read: Array<U32> & U32, moves: Array<U32>, index: U32, +depth: U32, maximum: U32, sum: U32) -> Audit:
  match read:
    case Tuple{table, value}: class_equal(U32.is_eq(value, depth), moves, table, index, depth, maximum, sum)

def class_allowed(ok: Bool, moves: Array<U32>, table: Array<U32>, index: U32, depth: U32, maximum: U32, sum: U32, class: U32) -> Audit:
  match ok:
    case False{}: H0DAuditFailed{index, 7}
    case True{}: class_distance(table[(600000 + class : U32)], moves, index, depth, maximum, sum)

def class_read(read: Array<U32> & U32, moves: Array<U32>, index: U32, depth: U32, maximum: U32, sum: U32) -> Audit:
  match read:
    case Tuple{table, value}:
      +class = (value .&. 65535 : U32)
      class_allowed(U32.is_lt(class, 3393), moves, table, index, depth, maximum, sum, class)

def depth_allowed(ok: Bool, moves: Array<U32>, table: Array<U32>, +index: U32, depth: U32, maximum: U32, sum: U32) -> Audit:
  match ok:
    case False{}: H0DAuditFailed{index, 3}
    case True{}: class_read(table[index], moves, index, depth, maximum, sum)

def depth_read(read: Array<U32> & U32, moves: Array<U32>, +index: U32, maximum: U32, sum: U32) -> Audit:
  match read:
    case Tuple{table, +depth}:
      +goal = U32.is_eq(index, H.index(H.goal()))
      depth_allowed(U32.is_lt(depth, 255) && ((goal && U32.is_eq(depth, 0)) || (Bool.not(goal) && U32.is_gt(depth, 0))), moves, table, index, depth, maximum, sum)

def audit_node(active: Bool, moves: Array<U32>, table: Array<U32>, +index: U32, maximum: U32, sum: U32) -> Audit:
  match active:
    case False{}: H0DAudited{moves, table, maximum, sum}
    case True{}: depth_read(table[(300000 + index : U32)], moves, index, maximum, sum)

def audit_step(state: Audit) -> Audit:
  match state:
    case H0DNode{moves, table, +index, maximum, sum}: audit_node(U32.is_lt(index, 153090), moves, table, index, maximum, sum)
    case H0DMoves{moves, table, index, depth, +move, decreasing, maximum, sum}: row_expand(U32.is_lt(move, 18), moves, table, index, depth, move, decreasing, maximum, sum)
    case state: state

def audit_run(fuel: Nat, state: Audit) -> Audit:
  match fuel state:
    case 1n+p H0DNode{moves, table, index, maximum, sum}: audit_run(p, audit_step(H0DNode{moves, table, index, maximum, sum}))
    case 1n+p H0DMoves{moves, table, index, depth, move, decreasing, maximum, sum}: audit_run(p, audit_step(H0DMoves{moves, table, index, depth, move, decreasing, maximum, sum}))
    case _ state: state

def audit_goal(read: Array<U32> & U32, moves: Array<U32>) -> Audit:
  match read:
    case Tuple{table, 0}: audit_run(3061801n, H0DNode{moves, table, 0, 0, 0})
    case _: H0DAuditFailed{23, 3}

def audit_table_sized(read: Array<U32> & U32, moves: Array<U32>) -> Audit:
  match read:
    case Tuple{table, 1048576}: audit_goal(table[(300000 + H.index(H.goal()) : U32)], moves)
    case _: H0DAuditFailed{0, 6}

def audit_moves_sized(read: Array<U32> & U32, table: Array<U32>) -> Audit:
  match read:
    case Tuple{moves, 65536}: audit_table_sized(Array.size(U32, table), moves)
    case _: H0DAuditFailed{0, 6}

def audit(state: Build) -> Audit:
  match state:
    case DComplete{moves, table, 3393, maximum}: audit_moves_sized(Array.size(U32, moves), table)
    case _: H0DAuditFailed{0, 6}

def copy_word(read: Array<U32> & U32, table: Array<U32>, index: U32) -> Array<U32> & Array<U32>:
  match read:
    case Tuple{moves, value}: (moves, table[(800000 + index : U32)] <- value)

def copy_moves(fuel: Nat, state: Array<U32> & Array<U32>, +index: U32) -> Array<U32> & Array<U32>:
  match fuel state:
    case 1n+p Tuple{moves, table}: copy_moves(p, copy_word(moves[index], table, index), (index + 1 : U32))
    case _ state: state
