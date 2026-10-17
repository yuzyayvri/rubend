import Base
import ./cubie.bend as C
import ./coordinates.bend as Q
import ./symmetry.bend as Y
import ./packed-symmetry.bend as R
import ./joint-table.bend as J
import ./block-table.bend as B

type Meta is Data:
  Meta{root: C.Cubie, p1: U32, ceiling: U32, best: +List<U32>, best_len: U32, mode: U32, bound: U32, lower: U32, nodes: U32, status: U32}

type Frame is Data:
  Node{cube: C.Cubie, a: U32, b: U32, c: U32, left: U32, previous: U32, next: U32, phase: U32, path: +List<U32>, length: U32}
  Retry{cube: C.Cubie, a: U32, b: U32, c: U32, depth: U32, previous: U32, path: +List<U32>, length: U32}

type Search is Type:
  Search{table: Array<U32>, stack: +List<Frame>, meta: Meta}

def maximum(+a: U32, +b: U32) -> U32:
  C.pick(U32.is_ge(a, b), a, b)

def solved(+cube: C.Cubie) -> Bool:
  match cube:
    case C.Cubie{cp, co, ep, eh, eo}:
      U32.is_eq(cp, 1985229328) && U32.is_eq(co, 0) && U32.is_eq(ep, 1985229328) && U32.is_eq(eh, 47768) && U32.is_eq(eo, 0)

def fixed(root: C.Cubie, transformed: C.Validation) -> Bool:
  match root transformed:
    case C.Cubie{a, b, c, d, e} C.Valid{C.Cubie{f, g, h, i, j}}:
      U32.is_eq(a, f) && U32.is_eq(b, g) && U32.is_eq(c, h) && U32.is_eq(d, i) && U32.is_eq(e, j)
    case _ _: False{}

def root_mask(ud: Bool, flip: Bool) -> U32:
  match ud flip:
    case True{} True{}: 7
    case True{} False{}: 8
    case False{} True{}: 9
    case False{} False{}: 6

def root_allowed(previous: U32, +face: U32) -> Bool:
  match previous:
    case 7: U32.is_eq(face, 0) || U32.is_eq(face, 1)
    case 8: U32.is_eq(face, 0) || U32.is_eq(face, 1) || U32.is_eq(face, 3)
    case 9: U32.is_eq(face, 0) || U32.is_eq(face, 1) || U32.is_eq(face, 2) || U32.is_eq(face, 4)
    case _: True{}

def root_frame(+root: C.Cubie, +depth: U32, +phase: U32) -> Frame:
  +view = C.to_facelets(root)
  previous = root_mask(fixed(root, C.validate(Y.ud(view))), fixed(root, C.validate(Y.flip(view))))
  Node{root, Q.encode(Q.Twist{}, root), Q.encode(Q.Flip{}, root), Q.encode(Q.Slice{}, root), depth, previous, 0, phase, Nil{}, 0}

def record(table: Array<U32>, rest: +List<Frame>, +meta: Meta, path: +List<U32>, +length: U32) -> Search:
  match meta:
    case Meta{+root, p1, ceiling, best, best_len, 2, bound, lower, nodes, status}:
      Search{table, root_frame(root, 0, 2) <> Nil{}, Meta{root, p1, ceiling, path, length, 1, 0, 0, nodes, 0}}
    case Meta{+root, p1, ceiling, best, best_len, +mode, bound, lower, nodes, status}:
      Search{table, rest, Meta{root, p1, ceiling, path, length, mode, bound, C.pick(U32.is_eq(mode, 1), length, lower), nodes, C.pick(U32.is_eq(mode, 1), 1, 0)}}

def maybe_record(better: Bool, table: Array<U32>, rest: +List<Frame>, +meta: Meta, path: +List<U32>, +length: U32) -> Search:
  match better:
    case True{}:
      record(table, rest, meta, path, length)
    case False{}:
      Search{table, rest, meta}

def push_child(table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, child: C.Cubie, +move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match parent:
    case Node{cube, a, b, c, +left, previous, next, +phase, +path, +length}:
      Search{table, Node{child, nx, ny, nz, (left - 1 : U32), (move / 3 : U32), 0, phase, move <> path, (length + 1 : U32)} <> Node{cube, a, b, c, left, previous, next, phase, path, length} <> rest, meta}
    case parent: Search{table, parent <> rest, meta}

def push(ok: Bool, table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match ok parent:
    case True{} Node{+cube, a, b, c, left, previous, next, phase, path, length}:
      push_child(table, Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta, C.turn(move, cube), move, nx, ny, nz)
    case _ parent: Search{table, parent <> rest, meta}

def joint_index(+cube: C.Cubie) -> U32:
  ((Q.encode(Q.Twist{}, cube) * 2048 + Q.encode(Q.Flip{}, cube)) * 495 + Q.encode(Q.Slice{}, cube) : U32)

def raw_lookup(table: Array<U32>, index: U32) -> Array<U32> & U32:
  J.get_at(table, 8388608, index)

def block_lookup(table: Array<U32>, index: U32) -> Array<U32> & U32:
  B.get_at(table, 8388608, index, 34642080)

def accept_child(ok: Bool, table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match ok:
    case True{}: push_child(table, parent, rest, meta, child, move, nx, ny, nz)
    case False{}: Search{table, parent <> rest, meta}

def last_joint(read: Array<U32> & U32, +parent: Frame, rest: +List<Frame>, +meta: Meta, child: C.Cubie, move: U32, nx: U32, ny: U32, nz: U32) -> Search:
  match read parent:
    case Tuple{table, bound} Node{cube, a, b, c, +left, previous, next, phase, path, length}:
      accept_child(U32.is_lt(bound, left), table, Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta, child, move, nx, ny, nz)
    case Tuple{table, bound} parent: Search{table, parent <> rest, meta}

def second_allowed(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), ok: Bool, table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, child: C.Cubie, +move: U32, +nx: U32, +ny: U32, +nz: U32, rotated: C.Cubie) -> Search:
  match ok:
    case False{}: push(False{}, table, parent, rest, meta, move, nx, ny, nz)
    case True{}: last_joint(lookup(table, joint_index(R.rotate(rotated))), parent, rest, meta, child, move, nx, ny, nz)

def second_joint(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), read: Array<U32> & U32, +parent: Frame, rest: +List<Frame>, +meta: Meta, child: C.Cubie, +move: U32, +nx: U32, +ny: U32, +nz: U32, rotated: C.Cubie) -> Search:
  match read parent:
    case Tuple{table, bound} Node{cube, a, b, c, +left, previous, next, phase, path, length}:
      second_allowed(~lookup, U32.is_lt(bound, left), table, Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta, child, move, nx, ny, nz, rotated)
    case Tuple{table, bound} parent: Search{table, parent <> rest, meta}

def other_axes(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), exact: Bool, table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match exact parent:
    case True{} Node{+cube, a, b, c, left, previous, next, phase, path, length}:
      +child = C.turn(move, cube)
      +rotated = R.rotate(child)
      second_joint(~lookup, lookup(table, joint_index(rotated)), Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta, child, move, nx, ny, nz, rotated)
    case _ parent: push(True{}, table, parent, rest, meta, move, nx, ny, nz)

def joint_allowed(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), ok: Bool, exact: Bool, table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match ok:
    case False{}: push(False{}, table, parent, rest, meta, move, nx, ny, nz)
    case True{}: other_axes(~lookup, exact, table, parent, rest, meta, move, nx, ny, nz)

def first_joint(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), read: Array<U32> & U32, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match read parent:
    case Tuple{table, bound} Node{cube, a, b, c, +left, previous, next, +phase, path, length}:
      joint_allowed(~lookup, U32.is_lt(bound, left), U32.is_eq(phase, 2), table, Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta, move, nx, ny, nz)
    case Tuple{table, bound} parent: Search{table, parent <> rest, meta}

def joint_size(read: Array<U32> & U32, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match read:
    case Tuple{table, 268435456}: first_joint(~block_lookup, block_lookup(table, ((nx * 2048 + ny) * 495 + nz : U32)), parent, rest, meta, move, nx, ny, nz)
    case Tuple{table, 536870912}: first_joint(~raw_lookup, raw_lookup(table, ((nx * 2048 + ny) * 495 + nz : U32)), parent, rest, meta, move, nx, ny, nz)
    case Tuple{table, size}: push(True{}, table, parent, rest, meta, move, nx, ny, nz)

def stronger(ok: Bool, table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32) -> Search:
  match ok parent:
    case True{} Node{cube, a, b, c, left, previous, next, 1, path, length}: push(True{}, table, Node{cube, a, b, c, left, previous, next, 1, path, length}, rest, meta, move, nx, ny, nz)
    case True{} parent: joint_size(Array.size(U32, table), parent, rest, meta, move, nx, ny, nz)
    case False{} parent: push(False{}, table, parent, rest, meta, move, nx, ny, nz)

def bound_y(read: Array<U32> & U32, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32, +hx: U32) -> Search:
  match read parent:
    case Tuple{table, hy} Node{cube, a, b, c, +left, previous, next, phase, path, length}:
      stronger(U32.is_lt(maximum(hx, hy), left), table, Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta, move, nx, ny, nz)
    case Tuple{table, hy} parent:
      Search{table, parent <> rest, meta}

def bound_x(read: Array<U32> & U32, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +nx: U32, +ny: U32, +nz: U32, +second: U32, +base: U32) -> Search:
  match read:
    case Tuple{table, hx}:
      bound_y(table[(base + ny * second + nz : U32)], parent, rest, meta, move, nx, ny, nz, hx)

def transition_z(read: Array<U32> & U32, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +nx: U32, +ny: U32) -> Search:
  match read parent:
    case Tuple{table, +nz} Node{cube, a, b, c, left, previous, next, +phase, path, length}:
      +second = C.pick(U32.is_eq(phase, 1), 24, 495)
      +base = C.pick(U32.is_eq(phase, 1), 2988105, 891780)
      bound_x(table[(base + nx * second + nz : U32)], Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta, move, nx, ny, nz, second, C.pick(U32.is_eq(phase, 1), 3955785, 1974345))
    case Tuple{table, nz} parent:
      Search{table, parent <> rest, meta}

def transition_y(read: Array<U32> & U32, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +nx: U32, +column: U32) -> Search:
  match read parent:
    case Tuple{table, ny} Node{cube, a, b, +c, left, previous, next, +phase, path, length}:
      width = C.pick(U32.is_eq(phase, 1), 10, 18)
      offset = C.pick(U32.is_eq(phase, 1), 891540, 76230)
      transition_z(table[(offset + c * width + column : U32)], Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta, move, nx, ny)
    case Tuple{table, ny} parent:
      Search{table, parent <> rest, meta}

def transition_x(read: Array<U32> & U32, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +column: U32) -> Search:
  match read parent:
    case Tuple{table, nx} Node{cube, a, +b, c, left, previous, next, +phase, path, length}:
      width = C.pick(U32.is_eq(phase, 1), 10, 18)
      offset = C.pick(U32.is_eq(phase, 1), 488340, 39366)
      transition_y(table[(offset + b * width + column : U32)], Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta, move, nx, column)
    case Tuple{table, nx} parent:
      Search{table, parent <> rest, meta}

def child(ok: Bool, table: Array<U32>, +parent: Frame, rest: +List<Frame>, +meta: Meta, +move: U32, +column: U32) -> Search:
  match ok parent:
    case False{} parent:
      Search{table, parent <> rest, meta}
    case True{} Node{cube, +a, b, c, left, previous, next, +phase, path, length}:
      width = C.pick(U32.is_eq(phase, 1), 10, 18)
      offset = C.pick(U32.is_eq(phase, 1), 85140, 0)
      transition_x(table[(offset + a * width + column : U32)], Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta, move, column)
    case _ parent:
      Search{table, parent <> rest, meta}

def enumerate(ok: Bool, table: Array<U32>, +frame: Frame, rest: +List<Frame>, +meta: Meta) -> Search:
  match ok frame:
    case False{} _:
      Search{table, rest, meta}
    case True{} Node{cube, a, b, c, left, +previous, +next, +phase, path, length}:
      +move = C.pick(U32.is_eq(phase, 1), Q.phase2_move(next), next)
      +face = (move / 3 : U32)
      child(root_allowed(previous, face) && U32.is_ne(face, previous) && (U32.is_ne(((face + 3) % 6 : U32), previous) || U32.is_lt(previous, face)), table, Node{cube, a, b, c, left, previous, (next + 1 : U32), phase, path, length}, rest, meta, move, next)
    case _ _:
      Search{table, rest, meta}

def phase2_depth(read: Array<U32> & U32, +cube: C.Cubie, +a: U32, +b: U32, +c: U32, +previous: U32, path: +List<U32>, +length: U32, rest: +List<Frame>, +meta: Meta, +hx: U32) -> Search:
  match read:
    case Tuple{table, hy}:
      Search{table, Retry{cube, a, b, c, maximum(hx, hy), previous, path, length} <> rest, meta}

def phase2_bound(read: Array<U32> & U32, +cube: C.Cubie, +a: U32, +b: U32, +c: U32, +previous: U32, path: +List<U32>, +length: U32, rest: +List<Frame>, +meta: Meta) -> Search:
  match read:
    case Tuple{table, hx}:
      phase2_depth(table[(3955785 + b * 24 + c : U32)], cube, a, b, c, previous, path, length, rest, meta, hx)

def phase2(table: Array<U32>, +cube: C.Cubie, +previous: U32, path: +List<U32>, +length: U32, rest: +List<Frame>, +meta: Meta) -> Search:
  +a = Q.encode(Q.Corners{}, cube)
  b = Q.encode(Q.Edges{}, cube)
  +c = Q.encode(Q.Middle{}, cube)
  phase2_bound(table[(2988105 + a * 24 + c : U32)], cube, a, b, c, previous, path, length, rest, meta)

def leaf(group: Bool, table: Array<U32>, +frame: Frame, rest: +List<Frame>, +meta: Meta) -> Search:
  match group frame:
    case True{} Node{cube, a, b, c, left, previous, next, phase, path, length}:
      phase2(table, cube, previous, path, length, rest, meta)
    case _ _:
      Search{table, rest, meta}

def node_open(leaf_node: Bool, table: Array<U32>, +frame: Frame, rest: +List<Frame>, +meta: Meta) -> Search:
  match leaf_node frame meta:
    case True{} Node{cube, +a, +b, +c, left, previous, next, +phase, path, length} meta:
      leaf(U32.is_eq(phase, 0) && U32.is_eq(a, 0) && U32.is_eq(b, 0) && U32.is_eq(c, 0), table, Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta)
    case False{} Node{cube, a, b, c, left, previous, +next, +phase, path, +length} Meta{root, p1, ceiling, best, +best_len, mode, bound, lower, nodes, status}:
      enumerate(U32.is_lt(next, C.pick(U32.is_eq(phase, 1), 10, 18)) && U32.is_lt(length, best_len), table, Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status})
    case _ _ meta:
      Search{table, rest, meta}

def node_goal(goal: Bool, table: Array<U32>, +frame: Frame, rest: +List<Frame>, +meta: Meta) -> Search:
  match goal frame meta:
    case True{} Node{cube, a, b, c, left, previous, next, phase, path, +length} Meta{root, p1, ceiling, best, +best_len, mode, bound, lower, nodes, status}:
      maybe_record(U32.is_lt(length, best_len), table, rest, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status}, path, length)
    case False{} Node{cube, a, b, c, +left, previous, next, phase, path, length} meta:
      node_open(U32.is_eq(left, 0), table, Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta)
    case _ _ meta:
      Search{table, rest, meta}

def retry(ok: Bool, table: Array<U32>, +frame: Frame, rest: +List<Frame>, +meta: Meta) -> Search:
  match ok frame:
    case True{} Retry{+cube, +a, +b, +c, +depth, +previous, +path, +length}:
      Search{table, Node{cube, a, b, c, depth, previous, 0, 1, path, length} <> Retry{cube, a, b, c, (depth + 1 : U32), previous, path, length} <> rest, meta}
    case _ _:
      Search{table, rest, meta}

def next_root(done: Bool, table: Array<U32>, +meta: Meta) -> Search:
  match done meta:
    case True{} Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status}:
      Search{table, Nil{}, Meta{root, p1, ceiling, best, best_len, mode, bound, C.pick(U32.is_eq(mode, 1), best_len, lower), nodes, C.pick(U32.is_eq(mode, 1), 1, 3)}}
    case False{} Meta{+root, +p1, +ceiling, best, best_len, +mode, +bound, +lower, nodes, status}:
      +next_p1 = C.pick(U32.is_lt(p1, 12), (p1 + 1 : U32), 0)
      +next_ceiling = C.pick(U32.is_lt(p1, 12), ceiling, (ceiling + 1 : U32))
      +exact = U32.is_eq(mode, 1)
      +next_bound = (bound + 1 : U32)
      Search{table, root_frame(root, C.pick(exact, next_bound, next_p1), C.pick(exact, 2, 0)) <> Nil{}, Meta{root, next_p1, next_ceiling, best, best_len, mode, next_bound, C.pick(exact, next_bound, lower), nodes, 0}}

def next(table: Array<U32>, stack: +List<Frame>, +meta: Meta) -> Search:
  match stack meta:
    case Nil{} Meta{root, p1, +ceiling, best, +best_len, +mode, +bound, lower, nodes, status}:
      next_root((U32.is_eq(mode, 1) && U32.is_ge((bound + 1 : U32), best_len)) || (U32.is_eq(mode, 0) && U32.is_ge(ceiling, 31)), table, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status})
    case Con{Node{+cube, +a, +b, +c, left, previous, next, +phase, path, length}, rest} meta:
      node_goal((U32.is_eq(phase, 1) && U32.is_eq(a, 0) && U32.is_eq(b, 0) && U32.is_eq(c, 0)) || (U32.is_ne(phase, 1) && solved(cube)), table, Node{cube, a, b, c, left, previous, next, phase, path, length}, rest, meta)
    case Con{Retry{cube, a, b, c, +depth, previous, path, +length}, rest} Meta{root, p1, +ceiling, best, +best_len, mode, bound, lower, nodes, status}:
      retry(U32.is_le(depth, C.pick(U32.is_eq(best_len, 31) && U32.is_le(ceiling, 24), 12, 18)) && U32.is_le((depth + length : U32), ceiling) && U32.is_lt((depth + length : U32), best_len), table, Retry{cube, a, b, c, depth, previous, path, length}, rest, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status})

def advance(state: Search) -> Search:
  match state:
    case Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status}}:
      next(table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, (nodes + 1 : U32), status})

def run(fuel: Nat, state: Search) -> Search:
  match fuel state:
    case 0n state:
      state
    case 1n+p Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, 0}}:
      run(p, advance(Search{table, stack, Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, 0}}))
    case _ state:
      state

def initialize(table: Array<U32>, +root: C.Cubie, request: U32) -> Search:
  Search{table, root_frame(root, 0, 0) <> Nil{}, Meta{root, 0, 21, Nil{}, 31, request, 0, 0, 0, 0}}
