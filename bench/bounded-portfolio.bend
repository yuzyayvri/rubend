import Base
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ../src/symmetry.bend as Y

def slice(+limit: U32, table: Array<U32>, tasks: +List<P.Task>, root: C.Cubie, +best: +List<U32>, +length: U32, request: P.Request, +axis: U32, stack: +List<S.Frame>, meta: S.Meta, nodes: U32, lower: U32) -> P.Session:
  match meta:
    case S.Meta{local_root, p1, ceiling, old, old_len, +mode, bound, local_lower, +before, status, profile}:
      +quantum = C.pick(S.is_exact(mode), 60000, 20000)
      P.finish_slice(S.run(U32.to_nat(C.pick(U32.is_lt(limit, quantum), limit, quantum)), S.Search{table, stack, S.Meta{local_root, p1, ceiling, Y.to_local(axis, best), length, mode, bound, local_lower, before, status, profile}}), tasks, root, best, length, request, axis, before, nodes, lower)

def advance(limit: U32, state: P.Session) -> P.Session:
  match state:
    case P.Session{table, Con{P.Task{axis, stack, meta}, tasks}, root, best, length, lower, nodes, request, S.Running{}}:
      slice(limit, table, tasks, root, best, length, request, axis, stack, meta, nodes, lower)
    case state: P.advance(state)
