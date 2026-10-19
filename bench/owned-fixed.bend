import Base
import ../src/owned/main.bend as H
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/owned/search.bend as S
import ../src/owned/portfolio.bend as P
import ../src/tables.bend as T
import ./owned-advanced.bend as A
import ./owned-search-observer.bend as V

def numbers(xs: +List<U32>) -> String:
  "[" ++ String.join(H.move_text(xs), ",") ++ "]"

def cube(value: C.Cubie) -> String:
  match value:
    case C.Cubie{a, b, c, d, e}: numbers([a, b, c, d, e])

def meta(value: S.Meta) -> String:
  match value:
    case S.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, status, +profile}:
      "[" ++ cube(root) ++ "," ++ numbers([p1, ceiling, length, S.stage_code(mode), bound, lower, nodes, S.completion_code(status)]) ++ "," ++ numbers(best) ++ "]"

type TaskView is Type:
  TaskView{entry: P.Task, text: String}

type TaskViews is Type:
  TaskViews{entries: P.Tasks, texts: +List<String>}

def task_view(view: V.FramesView, +axis: U32, +state: S.Meta) -> TaskView:
  match view:
    case V.Frames{store, frames}:
      TaskView{P.Task{axis, store, state}, "[" ++ U32.show(axis) ++ "," ++ meta(state) ++ "," ++ V.frames_text(frames) ++ "]"}
    case V.FramesFailed{store}: TaskView{P.Task{axis, store, state}, "{\"error\":\"Continuation observation failed\"}"}

def task_cons(first: TaskView, rest: TaskViews) -> TaskViews:
  match first rest:
    case TaskView{entry, text} TaskViews{entries, texts}: TaskViews{P.MoreTasks{entry, entries}, text <> texts}

def tasks(entries: P.Tasks) -> TaskViews:
  match entries:
    case P.NoTasks{}: TaskViews{P.NoTasks{}, Nil{}}
    case P.MoreTasks{P.Task{axis, stack, state}, rest}:
      task_cons(task_view(V.frames(stack), axis, state), tasks(rest))

def snapshot_view(view: TaskViews, +id: String, +original: M.Cube, initial_request: U32, slice: U32, root: C.Cubie, +best: +List<U32>, +length: U32, +lower: U32, +nodes: U32, request: P.Request, +status: S.Completion) -> IO(P.Tasks):
  match view:
    case TaskViews{entries, texts}:
      do IO<P.Tasks>:
        H.emit(U32.is_lt(length, 31), original, best, length, lower, nodes, S.is_optimal(status))
        IO.print("{\"type\":\"snapshot\",\"id\":\"" ++ id ++ "\",\"request\":" ++ U32.show(initial_request) ++ ",\"slice\":" ++ U32.show(slice) ++ ",\"nodes\":" ++ U32.show(nodes) ++ ",\"moves\":" ++ numbers(List.reverse(&2, U32, best)) ++ ",\"length\":" ++ U32.show(length) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"status\":" ++ U32.show(S.completion_code(status)) ++ ",\"state\":[" ++ cube(root) ++ "," ++ U32.show(P.request_code(request)) ++ ",[" ++ String.join(texts, ",") ++ "]]}")
        return entries

def snapshot(+id: String, +original: M.Cube, initial_request: U32, slice: U32, entries: P.Tasks, root: C.Cubie, best: +List<U32>, length: U32, lower: U32, nodes: U32, request: P.Request, status: S.Completion) -> IO(P.Tasks):
  snapshot_view(tasks(entries), id, original, initial_request, slice, root, best, length, lower, nodes, request, status)

def snapshots(fuel: Nat, +id: String, +original: M.Cube, +initial_request: U32, +slice: U32, state: P.Session) -> IO(Array<U32>):
  match fuel state:
    case 0n P.Session{table, entries, root, best, length, lower, nodes, request, status}:
      do IO<Array<U32>>:
        entries : P.Tasks <- snapshot(id, original, initial_request, slice, entries, root, best, length, lower, nodes, request, status)
        return table
    case 1n+p P.Session{table, entries, +root, +best, +length, +lower, +nodes, +request, +status}:
      do IO<Array<U32>>:
        entries : P.Tasks <- snapshot(id, original, initial_request, slice, entries, root, best, length, lower, nodes, request, status)
        snapshots(p, id, original, initial_request, (slice + 1 : U32), P.advance(P.Session{table, entries, root, best, length, lower, nodes, request, status}))

def solve(valid: C.Validation, +original: M.Cube, id: String, +request: U32, slices: U32, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match valid:
    case C.Valid{root}: snapshots(U32.to_nat(slices), id, original, request, 0, P.initialize(table, original, root, P.request_mode(U32.is_eq(request, 2)), profile))
    case _: IO.die(Array<U32>, 2, "Invalid fixed-work cube")

def parsed(value: Maybe<&2, M.Cube>, id: String, request: Maybe<&2, U32>, slices: Maybe<&2, U32>, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match value request slices:
    case Some{+original} Some{request} Some{slices}: solve(C.validate(original), original, id, request, slices, table, profile)
    case _ _ _: IO.die(Array<U32>, 2, "Invalid fixed-work request")

def command(args: +List<String>, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match args:
    case Con{id, Con{text, Con{request, Con{slices, Nil{}}}}}: parsed(M.from_list(H.colors(text)), id, U32.read(request), U32.read(slices), table, profile)
    case _: IO.die(Array<U32>, 2, "Expected id, facelets, request, slices")

def read_requests(fuel: Nat, acc: String, read: File & Result<&1, &1, U32 & String, String>) -> IO(String):
  match fuel read:
    case _ Tuple{file, Done{SNil{}}}:
      do IO<String>:
        File.close(file)
        return acc
    case 1n+p Tuple{file, Done{text}}:
      do IO<String>:
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
        read_requests(p, acc ++ text, read)
    case _ Tuple{file, result}:
      do IO<String>:
        File.close(file)
        IO.die(String, 2, "Fixed-work request file read failed or exceeded 64 KiB")

def commands(lines: +List<String>, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match lines:
    case Nil{}: IO.pure(Array<U32>, table)
    case Con{SNil{}, rest}: commands(rest, table, profile)
    case Con{line, rest}:
      do IO<Array<U32>>:
        table : Array<U32> <- command(String.split(line, Chr{9}), table, profile)
        commands(rest, table, profile)

def load(raw: Bool) -> IO(Array<U32>):
  match raw:
    case True{}: A.table()
    case False{}: H.checked_table(Array.size(U32, T.generate()))

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{+tier, Con{path, Nil{}}}}:
      do IO<Unit>:
        table : Array<U32> <- load(String.eq(tier, "raw"))
        file : File <- IO.try(File, File.open(path, "r"))
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
        text : String <- read_requests(16n, "", read)
        table : Array<U32> <- commands(String.split(text, Chr{10}), table, S.raw_profile(String.eq(tier, "raw")))
        IO.pure(Unit, Unit{})
    case _: IO.die(Unit, 2, "Expected light|raw and request file")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
