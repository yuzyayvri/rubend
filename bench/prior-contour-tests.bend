import Base
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ./portfolio-observer.bend as O
import ./prior-contour-policy.bend as Q

def stage(exact: Bool) -> S.Stage:
  match exact:
    case True{}: S.ExactContour{}
    case False{}: S.Improve{}

def tasks(tags: +List<U32>) -> +List<P.Task>:
  match tags:
    case Nil{}: Nil{}
    case Con{+tag, rest}:
      P.Task{(tag % 8 : U32), Nil{}, S.Meta{C.solved(), 0, 21, Nil{}, 31, stage(U32.is_ge(tag, 8)), 0, 0, 0, S.Running{}, S.Light{}}} <> tasks(rest)

def history(costs: +List<U32>, +axis: U32) -> +List<Q.Track>:
  match costs:
    case Nil{}: Nil{}
    case Con{cost, rest}: Q.Track{axis, 0, 31, False{}, cost} <> history(rest, (axis + 1 : U32))

def tags(entries: +List<P.Task>) -> +List<U32>:
  match entries:
    case Nil{}: Nil{}
    case Con{head, rest}: Q.tag(head) <> tags(rest)

def ordered(result: +List<P.Task> & Q.Book) -> +List<U32>:
  match result:
    case Tuple{entries, Q.Book{history, remaining, rounds, reorders, served}}:
      remaining <> rounds <> reorders <> tags(entries)

def test_order(order: +List<U32>, costs: +List<U32>, +remaining: U32, enabled: U32) -> +List<U32>:
  ordered(Q.arrange(U32.is_eq(remaining, 0), U32.is_eq(enabled, 1), tasks(order), Q.Book{history(costs, 0), remaining, 0, 0, 4294967295}))

def track_values(track: Q.Track) -> +List<U32>:
  match track:
    case Q.Track{axis, start, best, tainted, cost}: [start, best, C.pick(tainted, 1, 0), cost]

def test_sample(start: U32, old_best: U32, tainted: U32, cost: U32, +before_p1: U32, +after_p1: U32, before_best: U32, after_best: U32, +nodes: U32) -> +List<U32>:
  track_values(Q.sample(O.ContourEvent{0, S.Meta{C.solved(), before_p1, 21, Nil{}, before_best, S.Improve{}, before_p1, 0, (nodes - 1 : U32), S.Running{}, S.Light{}}, S.Meta{C.solved(), after_p1, 21, Nil{}, after_best, S.Improve{}, after_p1, 0, nodes, S.Running{}, S.Light{}}}, Q.Track{0, start, old_best, U32.is_eq(tainted, 1), cost}))

def test_sync(start: U32, old_best: U32, tainted: U32, cost: U32, nodes: U32, best: U32) -> +List<U32>:
  track_values(Q.synchronized(Q.Track{0, start, old_best, U32.is_eq(tainted, 1), cost}, nodes, best))
