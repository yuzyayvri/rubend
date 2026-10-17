import Base
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ../src/cubie.bend as C
import ../src/coordinates.bend as Q
import ../src/packed-symmetry.bend as R
import ../src/symmetry.bend as Y

type Cut is Data:
  Admitted{}
  PairCut{}
  JointOne{}
  JointTwo{}
  JointThree{}

type Action is Data:
  Quiet{}
  CanonicalReject{}
  Tried{a: U32, b: U32, c: U32, move: U32, cut: Cut, probes: U32}
  PhaseTwo{}
  Contour{}

type Observation is Data:
  Observation{goal: S.Goal, expanded: Bool, action: Action}

type Run is Type:
  Run{search: S.Search, counts: Array<Nat>, sound: Bool}

type Session is Type:
  Session{state: P.Session, counts: Array<Nat>, sound: Bool}

def empty_counts() -> Array<Nat>:
  [0n : Nat^5n]

def event(goal: S.Goal, expanded: Bool, action: Action, table: Array<U32>) -> Array<U32> & Observation:
  (table, Observation{goal, expanded, action})

def tried(table: Array<U32>, +frame: S.Frame, expanded: Bool, a: U32, b: U32, c: U32, move: U32, cut: Cut, probes: U32) -> Array<U32> & Observation:
  match frame:
    case S.Node{cube, x, y, z, left, previous, next, phase, path, length}:
      event(phase, expanded, Tried{a, b, c, move, cut, probes}, table)
    case _: event(S.Reduction{}, False{}, Quiet{}, table)

def last_cut(allowed: Bool, table: Array<U32>, frame: S.Frame, expanded: Bool, a: U32, b: U32, c: U32, move: U32) -> Array<U32> & Observation:
  match allowed:
    case True{}: tried(table, frame, expanded, a, b, c, move, Admitted{}, 3)
    case False{}: tried(table, frame, expanded, a, b, c, move, JointThree{}, 3)

def joint_three(read: Array<U32> & U32, +frame: S.Frame, expanded: Bool, a: U32, b: U32, c: U32, move: U32) -> Array<U32> & Observation:
  match read frame:
    case Tuple{table, bound} S.Node{cube, x, y, z, +left, previous, next, phase, path, length}:
      last_cut(U32.is_lt(bound, left), table, frame, expanded, a, b, c, move)
    case Tuple{table, value} _: event(S.Reduction{}, False{}, Quiet{}, table)

def third_axis(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), allowed: Bool, table: Array<U32>, +frame: S.Frame, expanded: Bool, a: U32, b: U32, c: U32, move: U32, rotated: C.Cubie) -> Array<U32> & Observation:
  match allowed:
    case True{}: joint_three(lookup(table, S.joint_index(R.rotate(rotated))), frame, expanded, a, b, c, move)
    case False{}: tried(table, frame, expanded, a, b, c, move, JointTwo{}, 2)

def joint_two(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), read: Array<U32> & U32, +frame: S.Frame, expanded: Bool, a: U32, b: U32, c: U32, move: U32, rotated: C.Cubie) -> Array<U32> & Observation:
  match read frame:
    case Tuple{table, bound} S.Node{cube, x, y, z, +left, previous, next, phase, path, length}:
      third_axis(~lookup, U32.is_lt(bound, left), table, frame, expanded, a, b, c, move, rotated)
    case Tuple{table, value} _: event(S.Reduction{}, False{}, Quiet{}, table)

def other_axes(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), full: Bool, table: Array<U32>, +frame: S.Frame, expanded: Bool, a: U32, b: U32, c: U32, +move: U32) -> Array<U32> & Observation:
  match full frame:
    case True{} S.Node{+cube, x, y, z, left, previous, next, phase, path, length}:
      +rotated = R.rotate(C.turn(move, cube))
      joint_two(~lookup, lookup(table, S.joint_index(rotated)), frame, expanded, a, b, c, move, rotated)
    case _ _: tried(table, frame, expanded, a, b, c, move, Admitted{}, 1)

def first_allowed(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), allowed: Bool, table: Array<U32>, +frame: S.Frame, expanded: Bool, a: U32, b: U32, c: U32, move: U32) -> Array<U32> & Observation:
  match allowed frame:
    case True{} S.Node{cube, x, y, z, left, previous, next, +phase, path, length}:
      other_axes(~lookup, S.is_full_cube(phase), table, frame, expanded, a, b, c, move)
    case _ _: tried(table, frame, expanded, a, b, c, move, JointOne{}, 1)

def joint_one(~lookup: Array<U32> -> U32 -> (Array<U32> & U32), read: Array<U32> & U32, +frame: S.Frame, expanded: Bool, a: U32, b: U32, c: U32, move: U32) -> Array<U32> & Observation:
  match read frame:
    case Tuple{table, bound} S.Node{cube, x, y, z, +left, previous, next, phase, path, length}:
      first_allowed(~lookup, U32.is_lt(bound, left), table, frame, expanded, a, b, c, move)
    case Tuple{table, value} _: event(S.Reduction{}, False{}, Quiet{}, table)

def joint_profile(profile: S.Profile, table: Array<U32>, +frame: S.Frame, expanded: Bool, +a: U32, +b: U32, +c: U32, move: U32) -> Array<U32> & Observation:
  match profile:
    case S.Light{}: tried(table, frame, expanded, a, b, c, move, Admitted{}, 0)
    case S.RawJoint{}: joint_one(~S.raw_lookup, S.raw_lookup(table, ((a * 2048 + b) * 495 + c : U32)), frame, expanded, a, b, c, move)
    case S.BlockJoint{}: joint_one(~S.block_lookup, S.block_lookup(table, ((a * 2048 + b) * 495 + c : U32)), frame, expanded, a, b, c, move)

def pair_result(allowed: Bool, table: Array<U32>, +frame: S.Frame, expanded: Bool, a: U32, b: U32, c: U32, move: U32, profile: S.Profile) -> Array<U32> & Observation:
  match allowed frame:
    case True{} S.Node{cube, x, y, z, left, previous, next, S.Subgroup{}, path, length}:
      tried(table, frame, expanded, a, b, c, move, Admitted{}, 0)
    case True{} _: joint_profile(profile, table, frame, expanded, a, b, c, move)
    case False{} _: tried(table, frame, expanded, a, b, c, move, PairCut{}, 0)

def pair_y(read: Array<U32> & U32, +frame: S.Frame, expanded: Bool, a: U32, b: U32, c: U32, move: U32, profile: S.Profile, hx: U32) -> Array<U32> & Observation:
  match read frame:
    case Tuple{table, hy} S.Node{cube, x, y, z, +left, previous, next, phase, path, length}:
      pair_result(U32.is_lt(S.maximum(hx, hy), left), table, frame, expanded, a, b, c, move, profile)
    case Tuple{table, value} _: event(S.Reduction{}, False{}, Quiet{}, table)

def pair_x(read: Array<U32> & U32, +frame: S.Frame, expanded: Bool, a: U32, +b: U32, +c: U32, move: U32, profile: S.Profile, +subgroup: Bool) -> Array<U32> & Observation:
  match read:
    case Tuple{table, hx}:
      pair_y(table[(C.pick(subgroup, 3955785, 1974345) + b * C.pick(subgroup, 24, 495) + c : U32)], frame, expanded, a, b, c, move, profile, hx)

def coordinate_kind(subgroup: Bool, axis: U32) -> Q.Coord:
  match subgroup axis:
    case True{} 0: Q.Corners{}
    case True{} 1: Q.Edges{}
    case True{} _: Q.Middle{}
    case False{} 0: Q.Twist{}
    case False{} 1: Q.Flip{}
    case False{} _: Q.Slice{}

def legal(allowed: Bool, table: Array<U32>, +frame: S.Frame, expanded: Bool, +move: U32, +column: U32, profile: S.Profile) -> Array<U32> & Observation:
  match allowed frame:
    case False{} S.Node{cube, a, b, c, left, previous, next, phase, path, length}: event(phase, expanded, CanonicalReject{}, table)
    case True{} S.Node{cube, a, b, c, left, previous, next, +phase, path, length}:
      +subgroup = S.is_subgroup(phase)
      +nx = Q.transition(coordinate_kind(subgroup, 0), a, column)
      +ny = Q.transition(coordinate_kind(subgroup, 1), b, column)
      +nz = Q.transition(coordinate_kind(subgroup, 2), c, column)
      pair_x(table[(C.pick(subgroup, 2988105, 891780) + nx * C.pick(subgroup, 24, 495) + nz : U32)], frame, expanded, nx, ny, nz, move, profile, subgroup)
    case _ _: event(S.Reduction{}, False{}, Quiet{}, table)

def considered(allowed: Bool, table: Array<U32>, +frame: S.Frame, profile: S.Profile) -> Array<U32> & Observation:
  match allowed frame:
    case False{} S.Node{cube, a, b, c, left, previous, next, phase, path, length}: event(phase, False{}, Quiet{}, table)
    case True{} S.Node{cube, a, b, c, left, +previous, +next, +phase, path, length}:
      +move = C.pick(S.is_subgroup(phase), Q.phase2_move(next), next)
      +face = (move / 3 : U32)
      legal(S.root_allowed(previous, face) && U32.is_ne(face, previous) && (U32.is_ne(((face + 3) % 6 : U32), previous) || U32.is_lt(previous, face)), table, frame, U32.is_eq(next, 0), move, next, profile)
    case _ _: event(S.Reduction{}, False{}, Quiet{}, table)

def leaf_event(launch: Bool, goal: S.Goal, table: Array<U32>) -> Array<U32> & Observation:
  match launch:
    case True{}: event(goal, False{}, PhaseTwo{}, table)
    case False{}: event(goal, False{}, Quiet{}, table)

def nong_goal(leaf: Bool, table: Array<U32>, +frame: S.Frame, best: U32, profile: S.Profile) -> Array<U32> & Observation:
  match leaf frame:
    case True{} S.Node{cube, +a, +b, +c, left, previous, next, +phase, path, length}:
      leaf_event(S.is_reduction(phase) && U32.is_eq(a, 0) && U32.is_eq(b, 0) && U32.is_eq(c, 0), phase, table)
    case False{} S.Node{cube, a, b, c, left, previous, +next, +phase, path, +length}:
      considered(U32.is_lt(next, C.pick(S.is_subgroup(phase), 10, 18)) && U32.is_lt(length, best), table, frame, profile)
    case _ _: event(S.Reduction{}, False{}, Quiet{}, table)

def node_goal(goal: Bool, table: Array<U32>, +frame: S.Frame, best: U32, profile: S.Profile) -> Array<U32> & Observation:
  match goal frame:
    case True{} S.Node{cube, a, b, c, left, previous, next, phase, path, length}: event(phase, False{}, Quiet{}, table)
    case False{} S.Node{cube, a, b, c, +left, previous, next, phase, path, length}: nong_goal(U32.is_eq(left, 0), table, frame, best, profile)
    case _ _: event(S.Reduction{}, False{}, Quiet{}, table)

def inspect(table: Array<U32>, +stack: +List<S.Frame>, meta: S.Meta) -> Array<U32> & Observation:
  match stack meta:
    case Nil{} S.Meta{root, p1, ceiling, best, length, S.ExactContour{}, bound, lower, nodes, status, profile}: event(S.FullCube{}, False{}, Contour{}, table)
    case Nil{} _: event(S.Reduction{}, False{}, Quiet{}, table)
    case Con{S.Retry{cube, a, b, c, depth, previous, path, length}, rest} _: event(S.Subgroup{}, False{}, Quiet{}, table)
    case Con{S.Node{+cube, +a, +b, +c, left, previous, next, +phase, path, length}, rest} S.Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, profile}:
      node_goal((S.is_subgroup(phase) && U32.is_eq(a, 0) && U32.is_eq(b, 0) && U32.is_eq(c, 0)) || (Bool.not(S.is_subgroup(phase)) && S.solved(cube)), table, S.Node{cube, a, b, c, left, previous, next, phase, path, length}, best_len, profile)

def action_values(action: Action) -> +List<U32>:
  match action:
    case Quiet{}: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    case CanonicalReject{}: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    case PhaseTwo{}: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0]
    case Contour{}: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    case Tried{a, b, c, move, Admitted{}, probes}: [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 3, 2, probes]
    case Tried{a, b, c, move, PairCut{}, probes}: [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 3, 2, probes]
    case Tried{a, b, c, move, JointOne{}, probes}: [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 3, 2, probes]
    case Tried{a, b, c, move, JointTwo{}, probes}: [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 2, probes]
    case Tried{a, b, c, move, JointThree{}, probes}: [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 3, 2, probes]

def values(event: Observation) -> +List<U32>:
  match event:
    case Observation{+goal, expanded, action}: List.append(&2, U32, [1, C.pick(S.is_reduction(goal), 1, 0), C.pick(S.is_subgroup(goal), 1, 0), C.pick(S.is_full_cube(goal), 1, 0), C.pick(expanded, 1, 0)], action_values(action))

def add_read(read: Array<Nat> & Nat, +index: U32, delta: U32) -> Array<Nat>:
  match read:
    case Tuple{counts, old}: Array.set(Nat, counts, index, Nat.add(old, U32.to_nat(delta)))

def add(xs: +List<U32>, counts: Array<Nat>, +index: U32) -> Array<Nat>:
  match xs:
    case Nil{}: counts
    case Con{delta, rest}: add(rest, add_read(Array.get(Nat, counts, index), index, delta), (index + 1 : U32))

def admitted(cut: Cut) -> Bool:
  match cut:
    case Admitted{}: True{}
    case _: False{}

def checked_child(yes: Bool, before: S.Frame, after: +List<S.Frame>, a: U32, b: U32, c: U32, move: U32) -> Bool:
  match yes before after:
    case True{} S.Node{cube, x, y, z, +left, previous, next, +phase, path, +length} Con{S.Node{child, nx, ny, nz, child_left, child_previous, child_next, child_phase, child_path, child_length}, rest}:
      U32.is_eq(nx, a) && U32.is_eq(ny, b) && U32.is_eq(nz, c) && U32.is_eq(child_left, (left - 1 : U32)) && U32.is_eq(child_previous, (move / 3 : U32)) && U32.is_eq(child_next, 0) && U32.is_eq(S.goal_code(child_phase), S.goal_code(phase)) && U32.is_eq(child_length, (length + 1 : U32))
    case False{} S.Node{cube, +x, +y, +z, +left, previous, +next, +phase, path, +length} Con{S.Node{parent, nx, ny, nz, parent_left, parent_previous, parent_next, parent_phase, parent_path, parent_length}, rest}:
      U32.is_eq(nx, x) && U32.is_eq(ny, y) && U32.is_eq(nz, z) && U32.is_eq(parent_left, left) && U32.is_eq(parent_next, (next + 1 : U32)) && U32.is_eq(S.goal_code(parent_phase), S.goal_code(phase)) && U32.is_eq(parent_length, length)
    case _ _ _: False{}

def verified(action: Action, before: +List<S.Frame>, after: +List<S.Frame>) -> Bool:
  match action before:
    case Tried{a, b, c, move, cut, probes} Con{frame, rest}: checked_child(admitted(cut), frame, after, a, b, c, move)
    case CanonicalReject{} Con{frame, rest}: checked_child(False{}, frame, after, 0, 0, 0, 0)
    case _ _: True{}

def advanced(result: S.Search, before: +List<S.Frame>, +observed: Observation, counts: Array<Nat>) -> Run:
  match result observed:
    case S.Search{table, +after, meta} Observation{goal, expanded, action}:
      Run{S.Search{table, after, meta}, add(values(observed), counts, 0), verified(action, before, after)}

def observed(read: Array<U32> & Observation, +stack: +List<S.Frame>, +meta: S.Meta, counts: Array<Nat>) -> Run:
  match read:
    case Tuple{table, event}: advanced(S.advance(S.Search{table, stack, meta}), stack, event, counts)

def run(fuel: Nat, state: Run) -> Run:
  match fuel state:
    case 1n+p Run{S.Search{table, +stack, S.Meta{+root, +p1, +ceiling, +best, +length, +mode, +bound, +lower, +nodes, S.Running{}, +profile}}, counts, True{}}:
      run(p, observed(inspect(table, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, S.Running{}, profile}), stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, S.Running{}, profile}, counts))
    case _ state: state

def finish(result: Run, tasks: +List<P.Task>, root: C.Cubie, best: +List<U32>, length: U32, request: P.Request, axis: U32, before: U32, nodes: U32, lower: U32) -> Session:
  match result:
    case Run{search, counts, sound}: Session{P.finish_slice(search, tasks, root, best, length, request, axis, before, nodes, lower), counts, sound}

def slice(+meta: S.Meta, table: Array<U32>, stack: +List<S.Frame>, tasks: +List<P.Task>, +root: C.Cubie, +best: +List<U32>, +length: U32, lower: U32, +nodes: U32, +request: P.Request, +axis: U32, counts: Array<Nat>) -> Session:
  match meta:
    case S.Meta{local_root, p1, ceiling, old_best, old_length, +mode, bound, local_lower, +before, status, profile}:
      finish(run(U32.to_nat(C.pick(S.is_exact(mode), 60000, 20000)), Run{S.Search{table, stack, S.Meta{local_root, p1, ceiling, Y.to_local(axis, best), length, mode, bound, local_lower, before, status, profile}}, counts, True{}}), tasks, root, best, length, request, axis, before, nodes, lower)

def advance(state: Session) -> Session:
  match state:
    case Session{P.Session{table, Con{P.Task{+axis, stack, +meta}, tasks}, +root, +best, +length, lower, +nodes, +request, S.Running{}}, counts, True{}}:
      slice(meta, table, stack, tasks, root, best, length, lower, nodes, request, axis, counts)
    case Session{session, counts, False{}}: Session{session, counts, False{}}
    case Session{session, counts, sound}: Session{P.advance(session), counts, sound}
