import Base
import ../src/corner-table-io.bend as A
import ../src/corner/main.bend as H
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/corner/search.bend as S

def profile(text: String) -> S.Profile:
  match text:
    case "forward": S.RawJoint{}
    case "corner": S.ForwardCorner{}
    case "combined": S.InverseCorner{}
    case "inverse-three": S.RawInverseThree{}
    case _: S.Light{}

def profile_code(profile: S.Profile) -> U32:
  match profile:
    case S.RawJoint{}: 0
    case S.ForwardCorner{}: 4
    case S.InverseCorner{}: 7
    case S.RawInverseThree{}: 3
    case _: 99

def gate(state: S.Search, +target: U32) -> S.Search & Bool:
  match state:
    case S.Search{table, stack, S.Meta{root, p1, ceiling, best, best_len, mode, bound, +lower, nodes, +status, profile}}:
      (S.Search{table, stack, S.Meta{root, p1, ceiling, best, best_len, mode, bound, lower, nodes, status, profile}}, S.is_running(status) && U32.is_lt(lower, target))

def work(fuel: Nat, +target: U32, pair: S.Search & Bool) -> S.Search:
  match fuel pair:
    case 1n+p Tuple{state, True{}}: work(p, target, gate(S.advance(state), target))
    case _ Tuple{state, allowed}: state

def finish(state: S.Search, original: M.Cube, +target: U32, started: Nat) -> IO(Array<U32>):
  match state:
    case S.Search{table, stack, S.Meta{root, p1, ceiling, +best, +length, mode, +bound, +lower, +nodes, +status, profile}}:
      do IO<Array<U32>>:
        ended : Nat <- IO.now()
        H.emit(U32.is_lt(length, 31), original, best, length, lower, nodes, S.is_optimal(status))
        IO.print("{\"type\":\"measurement\",\"profile\":" ++ U32.show(profile_code(profile)) ++ ",\"nativeMs\":" ++ Nat.show(Nat.sub(ended, started)) ++ ",\"target\":" ++ U32.show(target) ++ ",\"bound\":" ++ U32.show(bound) ++ ",\"status\":" ++ U32.show(S.completion_code(status)) ++ ",\"moves\":[" ++ String.join(H.move_text(List.reverse(&2, U32, best)), ",") ++ "]}")
        IO.print("{\"type\":\"done\",\"length\":" ++ U32.show(length) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"nodes\":" ++ U32.show(nodes) ++ ",\"optimal\":" ++ U32.show(C.pick(S.is_optimal(status), 1, 0)) ++ "}")
        return table

def solve(valid: C.Validation, +original: M.Cube, table: Array<U32>, profile: S.Profile, +target: U32) -> IO(Array<U32>):
  match valid:
    case C.Valid{+root}:
      do IO<Array<U32>>:
        started : Nat <- IO.now()
        finish(work(20000000n, target, gate(S.Search{table, S.root_frame(root, 0, S.FullCube{}) <> Nil{}, S.Meta{root, 0, 21, Nil{}, 31, S.ExactContour{}, 0, 0, 0, S.Running{}, profile}}, target)), original, target, started)
    case _: IO.die(Array<U32>, 2, "Invalid contour cube")

def parsed(value: Maybe<&2, M.Cube>, table: Array<U32>, profile: S.Profile, target: U32) -> IO(Array<U32>):
  match value:
    case Some{+original}: solve(C.validate(original), original, table, profile, target)
    case _: IO.die(Array<U32>, 2, "Invalid contour facelets")

def command(args: +List<String>, table: Array<U32>, profile: S.Profile, target: U32) -> IO(Array<U32>):
  match args:
    case Con{text, Con{mode, Con{budget, Nil{}}}}: parsed(M.from_list(H.colors(text)), table, profile, target)
    case _: IO.die(Array<U32>, 2, "Expected contour request")

def loop(fuel: Nat, table: Array<U32>, read: File & Result<&1, &1, U32 & String, String>, +profile: S.Profile, +target: U32) -> IO(Unit):
  match fuel read:
    case 1n+p Tuple{file, Done{SCon{head, rest}}}:
      do IO<Unit>:
        table : Array<U32> <- command(String.split(String.trim(SCon{head, rest}), Chr{9}), table, profile, target)
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
        loop(p, table, read, profile, target)
    case _ Tuple{file, result}: File.close(file)

def admitted(ok: Bool, table: Array<U32>, file: File, +profile: S.Profile, +target: U32) -> IO(Unit):
  match ok:
    case True{}:
      do IO<Unit>:
        IO.print("{\"type\":\"ready\"}")
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
        loop(1000000n, table, read, profile, target)
    case False{}: IO.die(Unit, 2, "Invalid contour profile or target")

def sized(read: Array<U32> & U32, file: File, +profile: S.Profile, +target: U32) -> IO(Unit):
  match read:
    case Tuple{table, size}: admitted(S.profile_matches(profile, size) && U32.is_ge(target, 1) && U32.is_le(target, 20), table, file, profile, target)

def worker(file: File, profile: S.Profile, target: Maybe<&2, U32>) -> IO(Unit):
  match target:
    case Some{target}:
      do IO<Unit>:
        IO.print("{\"type\":\"initializing\"}")
        table : Array<U32> <- A.table()
        sized(Array.size(U32, table), file, profile, target)
    case _: IO.die(Unit, 2, "Invalid contour target")

def start(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{path, Nil{}}}:
      do IO<Unit>:
        file : File <- IO.try(File, File.open(path, "r"))
        policy : String <- IO.try(String, IO.get_env("RUBEND_CONTOUR_PROFILE"))
        target : String <- IO.try(String, IO.get_env("RUBEND_CONTOUR_TARGET"))
        worker(file, profile(policy), U32.read(target))
    case _: IO.die(Unit, 2, "Expected contour worker pipe")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    start(args)
