import Base
import ../src/cubie.bend as C
import ../src/search.bend as S

type InteriorPoint is Data:
  InteriorPoint{kind: U32, nodes: U32, cube: C.Cubie, a: U32, b: U32, c: U32, left: U32, previous: U32, length: U32, bound: U32, best_length: U32}

def keep(eligible: Bool, point: InteriorPoint, events: +List<InteriorPoint>) -> +List<InteriorPoint>:
  match eligible:
    case True{}: point <> events
    case False{}: events

def capture(frame: S.Frame, meta: S.Meta, events: +List<InteriorPoint>) -> +List<InteriorPoint>:
  match frame meta:
    case S.Node{+cube, a, b, c, +left, +previous, +next, S.FullCube{}, path, +length} S.Meta{root, p1, ceiling, best, +best_length, S.ExactContour{}, +bound, lower, nodes, S.Running{}, profile}:
      keep(U32.is_gt(length, 0) && U32.is_gt(left, 0) && U32.is_lt(previous, 6) && U32.is_lt(bound, best_length) && Bool.not(S.solved(cube)) && (U32.is_eq(next, 0) || U32.is_eq(next, 18)), InteriorPoint{C.pick(U32.is_eq(next, 18), 1, 0), nodes, cube, a, b, c, left, previous, length, bound, best_length}, events)
    case _ _: events

def top(stack: +List<S.Frame>, meta: S.Meta, events: +List<InteriorPoint>) -> +List<InteriorPoint>:
  match stack:
    case Nil{}: events
    case Con{head, rest}: capture(head, meta, events)

def run(fuel: Nat, state: S.Search, events: +List<InteriorPoint>) -> S.Search & +List<InteriorPoint>:
  match fuel state:
    case 0n state: (state, events)
    case 1n+rest S.Search{table, +stack, S.Meta{root, p1, ceiling, best, best_length, mode, bound, lower, nodes, S.Running{}, profile}}:
      +meta = {S.Meta{root, p1, ceiling, best, best_length, mode, bound, lower, nodes, S.Running{}, profile} : S.Meta}
      run(rest, S.advance(S.Search{table, stack, meta}), top(stack, meta, events))
    case _ state: (state, events)

def values(point: InteriorPoint) -> +List<U32>:
  match point:
    case InteriorPoint{kind, nodes, C.Cubie{cp, co, ep, eh, eo}, a, b, c, left, previous, length, bound, best_length}:
      [kind, nodes, cp, co, ep, eh, eo, a, b, c, left, previous, length, bound, best_length]

def first(points: +List<InteriorPoint>) -> +List<U32>:
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

def cube(solved: U32) -> C.Cubie:
  match solved:
    case 1: C.solved()
    case _: C.turn(0, C.solved())

def test_capture(next: U32, phase: U32, mode: U32, length: U32, left: U32, bound: U32, best: U32, previous: U32, solved: U32) -> +List<U32>:
  first(capture(S.Node{cube(solved), 11, 22, 33, left, previous, next, goal(phase), Nil{}, length}, S.Meta{C.solved(), 0, 21, Nil{}, best, stage(mode), bound, 0, 17, S.Running{}, S.RawInverseThree{}}, Nil{}))
