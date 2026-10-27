import Base
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ../src/symmetry.bend as Y

type ContourEvent is Data:
  ContourEvent{axis: U32, before: S.Meta, after: S.Meta}

def changed(before: S.Meta, after: S.Meta) -> Bool:
  match before after:
    case S.Meta{a, b, c, d, e, f, g, h, i, j, k} S.Meta{l, m, n, o, p, q, r, s, t, u, v}:
      U32.is_ne(b, m) || U32.is_ne(c, n) || U32.is_ne(e, p) || U32.is_ne(S.stage_code(f), S.stage_code(q)) || U32.is_ne(g, r) || U32.is_ne(h, s) || U32.is_ne(S.completion_code(j), S.completion_code(u))

def retain(keep: Bool, axis: U32, before: S.Meta, after: S.Meta, events: +List<ContourEvent>) -> +List<ContourEvent>:
  match keep:
    case True{}: ContourEvent{axis, before, after} <> events
    case False{}: events

def observed(+axis: U32, +before: S.Meta, result: S.Search, events: +List<ContourEvent>) -> S.Search & +List<ContourEvent>:
  match result:
    case S.Search{table, stack, +after}:
      (S.Search{table, stack, after}, retain(changed(before, after), axis, before, after, events))

def run(fuel: Nat, +axis: U32, result: S.Search & +List<ContourEvent>) -> S.Search & +List<ContourEvent>:
  match fuel result:
    case 0n result: result
    case 1n+rest Tuple{S.Search{table, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, S.Running{}, profile}}, events}:
      +before = {S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, S.Running{}, profile} : S.Meta}
      run(rest, axis, observed(axis, before, S.advance(S.Search{table, stack, before}), events))
    case _ result: result

def finish(result: S.Search & +List<ContourEvent>, tasks: +List<P.Task>, root: C.Cubie, best: +List<U32>, length: U32, request: P.Request, axis: U32, before: U32, nodes: U32, established: U32) -> P.Session & +List<ContourEvent>:
  match result:
    case Tuple{search, events}:
      (P.finish_slice(search, tasks, root, best, length, request, axis, before, nodes, established), List.reverse(&2, ContourEvent, events))

def slice(table: Array<U32>, tasks: +List<P.Task>, root: C.Cubie, +best: +List<U32>, +length: U32, request: P.Request, +axis: U32, stack: +List<S.Frame>, meta: S.Meta, nodes: U32, established: U32) -> P.Session & +List<ContourEvent>:
  match meta:
    case S.Meta{local_root, p1, ceiling, old_best, old_len, +mode, bound, lower, +before, status, profile}:
      finish(run(U32.to_nat(C.pick(S.is_exact(mode), 60000, 20000)), axis, (S.Search{table, stack, S.Meta{local_root, p1, ceiling, Y.to_local(axis, best), length, mode, bound, lower, before, status, profile}}, Nil{})), tasks, root, best, length, request, axis, before, nodes, established)

def advance(state: P.Session) -> P.Session & +List<ContourEvent>:
  match state:
    case P.Session{table, Con{P.Task{axis, stack, meta}, tasks}, root, best, length, lower, nodes, request, S.Running{}}:
      slice(table, tasks, root, best, length, request, axis, stack, meta, nodes, lower)
    case state:
      (P.advance(state), Nil{})
