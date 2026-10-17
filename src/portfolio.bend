import Base
import ./cubie.bend as C
import ./model.bend as M
import ./symmetry.bend as Y
import ./search.bend as S

type Task is Data:
  Task{axis: U32, stack: +List<S.Frame>, meta: S.Meta}

type Session is Type:
  Session{table: Array<U32>, tasks: +List<Task>, root: C.Cubie, best: +List<U32>, best_len: U32, lower: U32, nodes: U32, request: U32, status: U32}

def task(+axis: U32, +root: C.Cubie) -> Task:
  Task{axis, S.root_frame(root, 0, 0) <> Nil{}, S.Meta{root, 0, 21, Nil{}, 31, 0, 0, 0, 0, 0}}

def same(a: C.Cubie, b: C.Cubie) -> Bool:
  match a b:
    case C.Cubie{a, b, c, d, e} C.Cubie{f, g, h, i, j}:
      U32.is_eq(a, f) && U32.is_eq(b, g) && U32.is_eq(c, h) && U32.is_eq(d, i) && U32.is_eq(e, j)

def task_root(task: Task) -> C.Cubie:
  match task:
    case Task{axis, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, status}}:
      root

def contains(tasks: +List<Task>, +root: C.Cubie) -> Bool:
  match tasks:
    case Nil{}: False{}
    case Con{entry, rest}: same(task_root(entry), root) || contains(rest, root)

def keep_entry(duplicate: Bool, entry: Task, acc: +List<Task>) -> +List<Task>:
  match duplicate:
    case True{}: acc
    case False{}: List.append(&2, Task, acc, [entry])

def distinct(tasks: +List<Task>, +acc: +List<Task>) -> +List<Task>:
  match tasks:
    case Nil{}: acc
    case Con{+entry, rest}: distinct(rest, keep_entry(contains(acc, task_root(entry)), entry, acc))

def validated(a: C.Validation, b: C.Validation, table: Array<U32>, +root: C.Cubie, +request: U32) -> Session:
  match a b:
    case C.Valid{+first} C.Valid{+second}:
      Session{table, distinct([task(0, root), task(1, first), task(2, second), task(3, C.inverse(root)), task(4, C.inverse(first)), task(5, C.inverse(second))], Nil{}), root, Nil{}, 31, 0, 0, request, 0}
    case _ _:
      Session{table, Nil{}, root, Nil{}, 31, 0, 0, request, 4}

def initialize(table: Array<U32>, +original: M.Cube, +root: C.Cubie, +request: U32) -> Session:
  validated(C.validate(Y.rotate(original)), C.validate(Y.rotate(Y.rotate(original))), table, root, request)

def append(tasks: +List<Task>, tail: +List<Task>) -> +List<Task>:
  List.append(&2, Task, tasks, tail)

def schedule(tasks: +List<Task>, axis: U32, stack: +List<S.Frame>, +meta: S.Meta) -> +List<Task>:
  match meta:
    case S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, 0}:
      append(tasks, [Task{axis, stack, meta}])
    case _:
      tasks

def restart_task(entry: Task, +best: +List<U32>, +length: U32) -> Task:
  match entry:
    case Task{+axis, stack, S.Meta{+root, p1, ceiling, old, old_len, mode, bound, lower, nodes, status}}:
      Task{axis, S.root_frame(root, 0, 0) <> Nil{}, S.Meta{root, 0, 21, Y.to_local(axis, best), length, 0, 0, 0, nodes, 0}}

def restart(tasks: +List<Task>, +best: +List<U32>, +length: U32) -> +List<Task>:
  match tasks:
    case Nil{}: Nil{}
    case Con{entry, rest}: restart_task(entry, best, length) <> restart(rest, best, length)

def restart_if(first: Bool, tasks: +List<Task>, best: +List<U32>, length: U32) -> +List<Task>:
  match first:
    case True{}: restart(tasks, best, length)
    case False{}: tasks

def update_found(exact: Bool, table: Array<U32>, tasks: +List<Task>, +root: C.Cubie, +best: +List<U32>, +length: U32, +request: U32, +axis: U32, stack: +List<S.Frame>, +meta: S.Meta, +total: U32, +established: U32, first: Bool) -> Session:
  match exact meta:
    case True{} _:
      Session{table, append(restart_if(first, schedule(tasks, axis, stack, meta), best, length), [Task{0, S.root_frame(root, 0, 2) <> Nil{}, S.Meta{root, 0, 21, best, length, 1, 0, 0, 0, 0}}]), root, best, length, established, total, 1, C.pick(U32.is_eq(length, established), 1, 0)}
    case False{} S.Meta{local_root, p1, ceiling, local_best, local_len, +mode, bound, +lower, local_nodes, +status}:
      +bound = S.maximum(established, C.pick(U32.is_eq(mode, 1), lower, 0))
      Session{table, restart_if(first, schedule(tasks, axis, stack, meta), best, length), root, best, length, bound, total, request, C.pick(U32.is_eq(length, bound), 1, 0)}

def update(changed: Bool, table: Array<U32>, tasks: +List<Task>, +root: C.Cubie, old_best: +List<U32>, +old_len: U32, +request: U32, +axis: U32, stack: +List<S.Frame>, +meta: S.Meta, +total: U32, +established: U32) -> Session:
  match changed meta:
    case True{} S.Meta{local_root, p1, ceiling, +best, +length, mode, bound, lower, local_nodes, status}:
      update_found(U32.is_eq(request, 2), table, tasks, root, Y.to_global(axis, best), length, request, axis, stack, meta, total, established, U32.is_eq(old_len, 31))
    case False{} S.Meta{local_root, p1, ceiling, best, length, +mode, bound, +lower, local_nodes, +status}:
      +bound = S.maximum(established, C.pick(U32.is_eq(mode, 1), lower, 0))
      Session{table, schedule(tasks, axis, stack, meta), root, old_best, old_len, bound, total, request, C.pick(U32.is_eq(old_len, bound), 1, 0)}

def finish_slice(result: S.Search, tasks: +List<Task>, +root: C.Cubie, +best: +List<U32>, +length: U32, +request: U32, +axis: U32, +before: U32, +nodes: U32, established: U32) -> Session:
  match result:
    case S.Search{table, stack, S.Meta{local_root, p1, ceiling, local_best, +local_len, mode, bound, lower, +local_nodes, status}}:
      update(U32.is_lt(local_len, length), table, tasks, root, best, length, request, axis, stack, S.Meta{local_root, p1, ceiling, local_best, local_len, mode, bound, lower, local_nodes, status}, (nodes + local_nodes - before : U32), established)

def run_slice(table: Array<U32>, tasks: +List<Task>, +root: C.Cubie, +best: +List<U32>, +length: U32, +request: U32, +axis: U32, stack: +List<S.Frame>, +meta: S.Meta, +nodes: U32, established: U32) -> Session:
  match meta:
    case S.Meta{local_root, p1, ceiling, old_best, old_len, +mode, bound, lower, +before, status}:
      finish_slice(S.run(U32.to_nat(C.pick(U32.is_eq(mode, 1), 60000, 20000)), S.Search{table, stack, S.Meta{local_root, p1, ceiling, Y.to_local(axis, best), length, mode, bound, lower, before, status}}), tasks, root, best, length, request, axis, before, nodes, established)

def advance(state: Session) -> Session:
  match state:
    case Session{table, Con{Task{axis, stack, meta}, tasks}, root, best, length, lower, nodes, request, 0}:
      run_slice(table, tasks, root, best, length, request, axis, stack, meta, nodes, lower)
    case Session{table, Nil{}, root, best, length, lower, nodes, request, 0}:
      Session{table, Nil{}, root, best, length, lower, nodes, request, 3}
    case state:
      state
