import Base
import ./cubie.bend as C
import ./model.bend as M
import ./symmetry.bend as Y
import ./search.bend as S

type Request is Data:
  Fast{}
  ExactWaiting{}
  ExactActive{}

def request_mode(exact: Bool) -> Request:
  match exact:
    case True{}: ExactWaiting{}
    case False{}: Fast{}

def request_code(request: Request) -> U32:
  match request:
    case Fast{}: 0
    case ExactWaiting{}: 2
    case ExactActive{}: 1

def is_fast(request: Request) -> Bool:
  match request:
    case Fast{}: True{}
    case _: False{}

def is_waiting(request: Request) -> Bool:
  match request:
    case ExactWaiting{}: True{}
    case _: False{}

type Task is Data:
  Task{axis: U32, stack: +List<S.Frame>, meta: S.Meta}

type Session is Type:
  Session{table: Array<U32>, tasks: +List<Task>, root: C.Cubie, best: +List<U32>, best_len: U32, lower: U32, nodes: U32, request: Request, status: S.Completion}

def task(+axis: U32, +root: C.Cubie, profile: S.Profile) -> Task:
  Task{axis, S.root_frame(root, 0, S.Reduction{}) <> Nil{}, S.Meta{root, 0, 21, Nil{}, 31, S.Improve{}, 0, 0, 0, S.Running{}, profile}}

def same(a: C.Cubie, b: C.Cubie) -> Bool:
  match a b:
    case C.Cubie{a, b, c, d, e} C.Cubie{f, g, h, i, j}:
      U32.is_eq(a, f) && U32.is_eq(b, g) && U32.is_eq(c, h) && U32.is_eq(d, i) && U32.is_eq(e, j)

def task_root(task: Task) -> C.Cubie:
  match task:
    case Task{axis, stack, S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, status, +profile}}:
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

def validated(a: C.Validation, b: C.Validation, table: Array<U32>, +root: C.Cubie, +request: Request, +profile: S.Profile) -> Session:
  match a b:
    case C.Valid{+first} C.Valid{+second}:
      Session{table, distinct([task(0, root, profile), task(1, first, profile), task(2, second, profile), task(3, C.inverse(root), profile), task(4, C.inverse(first), profile), task(5, C.inverse(second), profile)], Nil{}), root, Nil{}, 31, 0, 0, request, S.Running{}}
    case _ _:
      Session{table, Nil{}, root, Nil{}, 31, 0, 0, request, S.InvalidTransform{}}

def profiled(accepted: Bool, table: Array<U32>, +original: M.Cube, +root: C.Cubie, +request: Request, +profile: S.Profile) -> Session:
  match accepted:
    case True{}: validated(C.validate(Y.rotate(original)), C.validate(Y.rotate(Y.rotate(original))), table, root, request, profile)
    case False{}: Session{table, Nil{}, root, Nil{}, 31, 0, 0, request, S.ProfileMismatch{}}

def profile_size(read: Array<U32> & U32, original: M.Cube, root: C.Cubie, request: Request, +profile: S.Profile) -> Session:
  match read:
    case Tuple{table, size}: profiled(S.profile_matches(profile, size), table, original, root, request, profile)

def initialize(table: Array<U32>, original: M.Cube, root: C.Cubie, request: Request, profile: S.Profile) -> Session:
  profile_size(Array.size(U32, table), original, root, request, profile)

def append(tasks: +List<Task>, tail: +List<Task>) -> +List<Task>:
  List.append(&2, Task, tasks, tail)

def schedule(tasks: +List<Task>, axis: U32, stack: +List<S.Frame>, +meta: S.Meta) -> +List<Task>:
  match meta:
    case S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, S.Running{}, +profile}:
      append(tasks, [Task{axis, stack, meta}])
    case _:
      tasks

def restart_task(entry: Task, +best: +List<U32>, +length: U32) -> Task:
  match entry:
    case Task{+axis, stack, S.Meta{+root, p1, ceiling, old, old_len, mode, bound, lower, nodes, status, +profile}}:
      Task{axis, S.root_frame(root, 0, S.Reduction{}) <> Nil{}, S.Meta{root, 0, 21, Y.to_local(axis, best), length, S.Improve{}, 0, 0, nodes, S.Running{}, profile}}

def restart(tasks: +List<Task>, +best: +List<U32>, +length: U32) -> +List<Task>:
  match tasks:
    case Nil{}: Nil{}
    case Con{entry, rest}: restart_task(entry, best, length) <> restart(rest, best, length)

def restart_if(first: Bool, tasks: +List<Task>, best: +List<U32>, length: U32) -> +List<Task>:
  match first:
    case True{}: restart(tasks, best, length)
    case False{}: tasks

def update_found(exact: Bool, table: Array<U32>, tasks: +List<Task>, +root: C.Cubie, +best: +List<U32>, +length: U32, +request: Request, +axis: U32, stack: +List<S.Frame>, +meta: S.Meta, +total: U32, +established: U32, first: Bool) -> Session:
  match exact meta:
    case True{} S.Meta{local_root, p1, ceiling, local_best, local_len, mode, bound, lower, local_nodes, status, +profile}:
      Session{table, append(restart_if(first, schedule(tasks, axis, stack, meta), best, length), [Task{0, S.root_frame(root, 0, S.FullCube{}) <> Nil{}, S.Meta{root, 0, 21, best, length, S.ExactContour{}, 0, 0, 0, S.Running{}, profile}}]), root, best, length, established, total, ExactActive{}, S.completion(U32.is_eq(length, established))}
    case False{} S.Meta{local_root, p1, ceiling, local_best, local_len, +mode, bound, +lower, local_nodes, +status, +profile}:
      +bound = S.maximum(established, C.pick(S.is_exact(mode), lower, 0))
      Session{table, restart_if(first, schedule(tasks, axis, stack, meta), best, length), root, best, length, bound, total, request, S.completion(U32.is_eq(length, bound))}

def update(changed: Bool, table: Array<U32>, tasks: +List<Task>, +root: C.Cubie, old_best: +List<U32>, +old_len: U32, +request: Request, +axis: U32, stack: +List<S.Frame>, +meta: S.Meta, +total: U32, +established: U32) -> Session:
  match changed meta:
    case True{} S.Meta{local_root, p1, ceiling, +best, +length, mode, bound, lower, local_nodes, status, +profile}:
      update_found(is_waiting(request), table, tasks, root, Y.to_global(axis, best), length, request, axis, stack, meta, total, established, U32.is_eq(old_len, 31))
    case False{} S.Meta{local_root, p1, ceiling, best, length, +mode, bound, +lower, local_nodes, +status, +profile}:
      +bound = S.maximum(established, C.pick(S.is_exact(mode), lower, 0))
      Session{table, schedule(tasks, axis, stack, meta), root, old_best, old_len, bound, total, request, S.completion(U32.is_eq(old_len, bound))}

def finish_slice(result: S.Search, tasks: +List<Task>, +root: C.Cubie, +best: +List<U32>, +length: U32, +request: Request, +axis: U32, +before: U32, +nodes: U32, established: U32) -> Session:
  match result:
    case S.Search{table, stack, S.Meta{local_root, p1, ceiling, local_best, +local_len, mode, bound, lower, +local_nodes, status, +profile}}:
      update(U32.is_lt(local_len, length), table, tasks, root, best, length, request, axis, stack, S.Meta{local_root, p1, ceiling, local_best, local_len, mode, bound, lower, local_nodes, status, profile}, (nodes + local_nodes - before : U32), established)

def run_slice(table: Array<U32>, tasks: +List<Task>, +root: C.Cubie, +best: +List<U32>, +length: U32, +request: Request, +axis: U32, stack: +List<S.Frame>, +meta: S.Meta, +nodes: U32, established: U32) -> Session:
  match meta:
    case S.Meta{local_root, p1, ceiling, old_best, old_len, +mode, bound, lower, +before, status, +profile}:
      finish_slice(S.run(U32.to_nat(C.pick(S.is_exact(mode), 60000, 20000)), S.Search{table, stack, S.Meta{local_root, p1, ceiling, Y.to_local(axis, best), length, mode, bound, lower, before, status, profile}}), tasks, root, best, length, request, axis, before, nodes, established)

def advance(state: Session) -> Session:
  match state:
    case Session{table, Con{Task{axis, stack, meta}, tasks}, root, best, length, lower, nodes, request, S.Running{}}:
      run_slice(table, tasks, root, best, length, request, axis, stack, meta, nodes, lower)
    case Session{table, Nil{}, root, best, length, lower, nodes, request, S.Running{}}:
      Session{table, Nil{}, root, best, length, lower, nodes, request, S.TaskFinished{}}
    case state:
      state
