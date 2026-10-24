import Base
import ../src/cubie.bend as C
import ../src/small/search.bend as S

type RangePoint is Data:
  RangePoint{nodes: U32, cube: C.Cubie, a: U32, b: U32, c: U32, left: U32, previous: U32, next: U32, length: U32, bound: U32, best_length: U32, goal: U32, mode: U32, profile: U32, status: U32, path: +List<U32>}

def keep(eligible: Bool, point: RangePoint, events: +List<RangePoint>) -> +List<RangePoint>:
  match eligible:
    case True{}: point <> events
    case False{}: events

def capture(frame: S.Frame, meta: S.Meta, events: +List<RangePoint>) -> +List<RangePoint>:
  match frame meta:
    case S.Node{+cube, a, b, c, +left, +previous, +next, +phase, path, +length} S.Meta{root, p1, ceiling, best, +best_length, +mode, +bound, lower, +nodes, +status, +profile}:
      keep(S.is_full_cube(phase) && U32.is_eq(S.stage_code(mode), 1) && U32.is_eq(S.completion_code(status), 0) && U32.is_eq(S.profile_words(profile), 1048576) && U32.is_gt(length, 0) && U32.is_gt(left, 0) && U32.is_lt(previous, 6) && U32.is_lt(bound, best_length) && Bool.not(S.solved(cube)) && U32.is_eq(next, 0), RangePoint{nodes, cube, a, b, c, left, previous, next, length, bound, best_length, S.goal_code(phase), S.stage_code(mode), S.profile_words(profile), S.completion_code(status), path}, events)
    case _ _: events

def top(stack: +List<S.Frame>, meta: S.Meta, events: +List<RangePoint>) -> +List<RangePoint>:
  match stack:
    case Nil{}: events
    case Con{head, rest}: capture(head, meta, events)

def run(fuel: Nat, state: S.Search, events: +List<RangePoint>) -> S.Search & +List<RangePoint>:
  match fuel state:
    case 0n state: (state, events)
    case 1n+rest S.Search{table, +stack, S.Meta{root, p1, ceiling, best, best_length, mode, bound, lower, nodes, S.Running{}, profile}}:
      +meta = {S.Meta{root, p1, ceiling, best, best_length, mode, bound, lower, nodes, S.Running{}, profile} : S.Meta}
      run(rest, S.advance(S.Search{table, stack, meta}), top(stack, meta, events))
    case _ state: (state, events)

def values(point: RangePoint) -> +List<U32>:
  match point:
    case RangePoint{nodes, C.Cubie{cp, co, ep, eh, eo}, a, b, c, left, previous, next, length, bound, best, goal, mode, profile, status, path}:
      [nodes, cp, co, ep, eh, eo, a, b, c, left, previous, next, length, bound, best, goal, mode, profile, status]

def path(point: RangePoint) -> +List<U32>:
  match point:
    case RangePoint{nodes, cube, a, b, c, left, previous, next, length, bound, best, goal, mode, profile, status, path}: path

def first(points: +List<RangePoint>) -> +List<U32>:
  match points:
    case Nil{}: Nil{}
    case Con{point, rest}: values(point)

def goal(index: U32) -> S.Goal:
  match index:
    case 2: S.FullCube{}
    case 1: S.Subgroup{}
    case _: S.Reduction{}

def stage(index: U32) -> S.Stage:
  match index:
    case 1: S.ExactContour{}
    case 2: S.FirstThenExact{}
    case _: S.Improve{}

def profile(index: U32) -> S.Profile:
  match index:
    case 0: S.Light{}
    case _: S.RawJoint{}

def status(index: U32) -> S.Completion:
  match index:
    case 0: S.Running{}
    case _: S.SearchOptimal{}

def cube(solved: U32) -> C.Cubie:
  match solved:
    case 1: C.solved()
    case _: C.turn(0, C.solved())

def test_capture(next: U32, phase: U32, mode: U32, length: U32, left: U32, bound: U32, best: U32, previous: U32, solved: U32, selected_profile: U32, completion: U32) -> +List<U32>:
  first(capture(S.Node{cube(solved), 11, 22, 33, left, previous, next, goal(phase), [0, 3], length}, S.Meta{C.solved(), 0, 21, Nil{}, best, stage(mode), bound, 0, 17, status(completion), profile(selected_profile)}, Nil{}))

def steps(result: S.Search & +List<RangePoint>) -> U32:
  match result:
    case Tuple{S.Search{table, stack, S.Meta{root, p1, ceiling, best, best_length, mode, bound, lower, nodes, status, profile}}, points}: nodes

def test_steps() -> U32:
  steps(run(1n, S.Search{[0 : U32^0n], Nil{}, S.Meta{C.turn(0, C.solved()), 0, 21, Nil{}, 31, S.ExactContour{}, 0, 0, 0, S.Running{}, S.Light{}}}, Nil{}))
