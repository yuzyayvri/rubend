import Base
import ../src/search.bend as S
import ../src/cubie.bend as C
import ./phase2-small-product.bend as E

type Point is Data:
  Point{cube: C.Cubie, a: U32, b: U32, c: U32, left: U32, previous: U32, length: U32, best_len: U32}

type Observed is Type:
  Observed{search: S.Search, small: Array<U32>, points: +List<+List<U32>>, steps: U32, quota: U32}

def selected(ok: Bool, point: Point) -> Maybe<&2, Point>:
  match ok:
    case True{}: Some{point}
    case False{}: None{}

def point(frame: S.Frame, +best_len: U32) -> Maybe<&2, Point>:
  match frame:
    case S.Node{cube, +a, +b, +c, +left, previous, 0, S.Subgroup{}, path, +length}:
      selected(U32.is_gt(left, 0) && U32.is_lt(length, best_len) && Bool.not(U32.is_eq(a, 0) && U32.is_eq(b, 0) && U32.is_eq(c, 0)), Point{cube, a, b, c, left, previous, length, best_len})
    case _: None{}

def peek(stack: +List<S.Frame>, meta: S.Meta) -> Maybe<&2, Point>:
  match stack meta:
    case Con{frame, rest} S.Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, profile}: point(frame, best_len)
    case _ _: None{}

def product(read: Array<U32> & U32, table: Array<U32>, stack: +List<S.Frame>, meta: S.Meta, fact: Point, points: +List<+List<U32>>, +steps: U32, quota: U32, hx: U32, hy: U32, index: U32) -> Observed:
  match read fact:
    case Tuple{small, value} Point{C.Cubie{cp, co, ep, eh, eo}, a, b, c, left, previous, length, best_len}:
      Observed{S.Search{table, stack, meta}, small, [steps, cp, co, ep, eh, eo, a, b, c, left, previous, length, hx, hy, index, value, best_len] <> points, steps, (quota - 1 : U32)}

def second(read: Array<U32> & U32, small: Array<U32>, stack: +List<S.Frame>, meta: S.Meta, +fact: Point, points: +List<+List<U32>>, steps: U32, quota: U32, hx: U32) -> Observed:
  match read fact:
    case Tuple{table, hy} Point{cube, a, b, c, left, previous, length, best_len}:
      +index = E.encode_known(cube)
      product(small[index], table, stack, meta, fact, points, steps, quota, hx, hy, index)

def first(read: Array<U32> & U32, small: Array<U32>, stack: +List<S.Frame>, meta: S.Meta, +fact: Point, points: +List<+List<U32>>, steps: U32, quota: U32) -> Observed:
  match read fact:
    case Tuple{table, hx} Point{cube, a, +b, +c, left, previous, length, best_len}:
      second(table[(3955785 + b * 24 + c : U32)], small, stack, meta, fact, points, steps, quota, hx)

def collect(value: Maybe<&2, Point>, search: S.Search, small: Array<U32>, points: +List<+List<U32>>, steps: U32, quota: U32) -> Observed:
  match value search:
    case Some{Point{cube, +a, b, +c, left, previous, length, best_len}} S.Search{table, stack, meta}:
      first(table[(2988105 + a * 24 + c : U32)], small, stack, meta, Point{cube, a, b, c, left, previous, length, best_len}, points, steps, quota)
    case None{} search: Observed{search, small, points, steps, quota}

def observe(state: Observed) -> Observed:
  match state:
    case Observed{S.Search{table, +stack, +meta}, small, points, steps, quota}:
      collect(peek(stack, meta), S.Search{table, stack, meta}, small, points, steps, quota)

def tick(state: Observed) -> Observed:
  match state:
    case Observed{search, small, points, steps, quota}:
      Observed{S.advance(search), small, points, (steps + 1 : U32), quota}

def run(fuel: Nat, state: Observed) -> Observed:
  match fuel state:
    case 0n state: state
    case _ Observed{search, small, points, steps, 0}: Observed{search, small, points, steps, 0}
    case 1n+rest Observed{S.Search{table, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, S.Running{}, profile}}, small, points, steps, quota}:
      run(rest, tick(observe(Observed{S.Search{table, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, S.Running{}, profile}}, small, points, steps, quota})))
    case _ state: state
