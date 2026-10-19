import Base
import ../model.bend as M
import ../cubie.bend as C
import ./search.bend as S
import ./portfolio.bend as P
import ../tables.bend as T
import ../certificate.bend as Cert
import ../h0-table-io.bend as A
import ../worker-control.bend as Control

def color(code: U32) -> U32:
  match code:
    case 48: 0
    case 49: 1
    case 50: 2
    case 51: 3
    case 52: 4
    case 53: 5
    case 85: 0
    case 82: 1
    case 70: 2
    case 68: 3
    case 76: 4
    case 66: 5
    case _: 255

def colors(text: String) -> +List<U32>:
  match text:
    case SNil{}:
      Nil{}
    case SCon{Chr{code}, rest}:
      color(code) <> colors(rest)

def to_moves(xs: +List<U32>) -> +List<M.Move>:
  match xs:
    case Nil{}:
      Nil{}
    case Con{x, rest}:
      M.from_index(x) <> to_moves(rest)

def move_text(xs: +List<U32>) -> +List<String>:
  match xs:
    case Nil{}:
      Nil{}
    case Con{x, rest}:
      U32.show(x) <> move_text(rest)

def candidate_for(ok: Bool, moves: +List<U32>, length: U32, lower: U32, nodes: U32, optimal: Bool, tag: String) -> IO(Unit):
  match ok:
    case False{}:
      IO.die(Unit, 2, "Candidate replay failed")
    case True{}:
      IO.print("{\"type\":\"candidate\",\"moves\":[" ++ String.join(move_text(moves), ",") ++ "],\"length\":" ++ U32.show(length) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"nodes\":" ++ U32.show(nodes) ++ ",\"optimal\":" ++ U32.show(C.pick(optimal, 1, 0)) ++ tag ++ "}")

def candidate(ok: Bool, moves: +List<U32>, length: U32, lower: U32, nodes: U32, optimal: Bool) -> IO(Unit):
  candidate_for(ok, moves, length, lower, nodes, optimal, "")

def indices(xs: +List<M.Move>) -> +List<U32>:
  match xs:
    case Nil{}:
      Nil{}
    case Con{move, rest}:
      M.index(move) <> indices(rest)

def certified_for(-original: M.Cube, result: Maybe<&2, Cert.Certificate<original>>, length: U32, lower: U32, nodes: U32, optimal: Bool, tag: String) -> IO(Unit):
  match result:
    case None{}:
      IO.die(Unit, 2, "Candidate certificate failed")
    case Some{certificate}:
      candidate_for(True{}, indices(Cert.moves(original, certificate)), length, lower, nodes, optimal, tag)

def certified(-original: M.Cube, result: Maybe<&2, Cert.Certificate<original>>, length: U32, lower: U32, nodes: U32, optimal: Bool) -> IO(Unit):
  certified_for(original, result, length, lower, nodes, optimal, "")

def emit_for(changed: Bool, +original: M.Cube, +best: +List<U32>, length: U32, lower: U32, nodes: U32, optimal: Bool, tag: String) -> IO(Unit):
  match changed:
    case False{}:
      IO.pure(Unit, Unit{})
    case True{}:
      +moves = List.reverse(&2, U32, best)
      certified_for(original, Cert.certify(original, to_moves(moves)), length, lower, nodes, optimal, tag)

def emit(changed: Bool, +original: M.Cube, +best: +List<U32>, length: U32, lower: U32, nodes: U32, optimal: Bool) -> IO(Unit):
  emit_for(changed, original, best, length, lower, nodes, optimal, "")

def service(fuel: Nat, active: Bool, state: P.Session, +original: M.Cube, +started: Nat, +budget: Nat, previous: U32, +profile: S.Profile) -> IO(Array<U32>):
  match fuel active state:
    case _ _ P.Session{table, tasks, root, best, length, lower, nodes, request, S.InvalidTransform{}}:
      IO.die(Array<U32>, 2, "Transformed cube failed validation")
    case _ _ P.Session{table, tasks, root, best, length, lower, nodes, request, S.ProfileMismatch{}}:
      IO.die(Array<U32>, 2, "Lookup profile does not match loaded storage")
    case 1n+p True{} P.Session{table, tasks, root, +best, +length, +lower, +nodes, request, +status}:
      do IO<Array<U32>>:
        emit(U32.is_lt(length, previous) || S.is_optimal(status), original, best, length, lower, nodes, S.is_optimal(status))
        +now : Nat <- IO.now()
        IO.print("{\"type\":\"progress\",\"nodes\":" ++ U32.show(nodes) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"elapsedMs\":" ++ Nat.show(Nat.sub(now, started)) ++ "}")
        service(p, Nat.is_lt(now, Nat.add(started, budget)) && S.is_running(status), P.advance(P.Session{table, tasks, root, best, length, lower, nodes, request, status}), original, started, budget, length, profile)
    case _ _ P.Session{table, tasks, root, best, +length, +lower, +nodes, request, +status}:
      do IO<Array<U32>>:
        emit(U32.is_lt(length, previous) || S.is_optimal(status), original, best, length, lower, nodes, S.is_optimal(status))
        IO.print("{\"type\":\"done\",\"length\":" ++ U32.show(length) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"nodes\":" ++ U32.show(nodes) ++ ",\"optimal\":" ++ U32.show(C.pick(S.is_optimal(status), 1, 0)) ++ "}")
        return table

def solve(valid: C.Validation, +original: M.Cube, +request: P.Request, budget: U32, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match valid:
    case C.Invalid{code}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"invalid\",\"code\":" ++ U32.show(code) ++ "}")
        return table
    case C.Valid{cube}:
      do IO<Array<U32>>:
        started : Nat <- IO.now()
        service(U32.to_nat(C.pick(P.is_fast(request), 180000, 60000)), True{}, P.initialize(table, original, cube, request, profile), original, started, U32.to_nat(budget), 31, profile)

def parsed(result: Maybe<&2, M.Cube>, request: P.Request, budget: U32, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match result:
    case None{}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"invalid\",\"code\":6}")
        return table
    case Some{+cube}:
      solve(C.validate(cube), cube, request, budget, table, profile)

def command_budget(limit: Maybe<&2, U32>, text: String, mode: String, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match limit:
    case None{}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"invalid\",\"code\":7}")
        return table
    case Some{+budget}:
      parsed(M.from_list(colors(text)), P.request_mode(String.eq(mode, "exact")), C.pick(U32.is_ge(budget, 1) && U32.is_le(budget, 60000), budget, 5000), table, profile)

def worker_command(args: +List<String>, table: Array<U32>, +profile: S.Profile) -> IO(Array<U32>):
  match args:
    case Con{text, Con{mode, Con{limit, Nil{}}}}:
      command_budget(U32.read(limit), text, mode, table, profile)
    case _:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"invalid\",\"code\":7}")
        return table

def worker_loop(fuel: Nat, table: Array<U32>, read: File & Result<&1, &1, U32 & String, String>, +profile: S.Profile) -> IO(Unit):
  match fuel read:
    case 1n+p Tuple{file, Done{SCon{head, rest}}}:
      do IO<Unit>:
        table : Array<U32> <- worker_command(String.split(String.trim(SCon{head, rest}), Chr{9}), table, profile)
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
        worker_loop(p, table, read, profile)
    case _ Tuple{file, result}:
      File.close(file)

def choose_controlled(checked: Control.Context & Bool, table: Array<U32>, yes: Array<U32> -> Control.Context -> IO(Array<U32> & Control.Context), no: Array<U32> -> Control.Context -> IO(Array<U32> & Control.Context)) -> IO(Array<U32> & Control.Context):
  match checked:
    case Tuple{control, True{}}: yes(table, control)
    case Tuple{control, False{}}: no(table, control)

def cancel_table(table: Array<U32>, control: Control.Context, id: U32) -> IO(Array<U32> & Control.Context):
  do IO<Array<U32> & Control.Context>:
    IO.print("{\"type\":\"cancelled\"" ++ Control.tag(id) ++ "}")
    return (table, control)

def service_controlled(fuel: Nat, active: Bool, state: P.Session, +original: M.Cube, +started: Nat, +budget: Nat, previous: U32, +profile: S.Profile, control: Control.Context, +id: U32, +pulse: U32) -> IO(Array<U32> & Control.Context):
  match fuel active state:
    case _ _ P.Session{table, tasks, root, best, length, lower, nodes, request, S.InvalidTransform{}}:
      IO.die(Array<U32> & Control.Context, 2, "Transformed cube failed validation")
    case _ _ P.Session{table, tasks, root, best, length, lower, nodes, request, S.ProfileMismatch{}}:
      IO.die(Array<U32> & Control.Context, 2, "Lookup profile does not match loaded storage")
    case 1n+p True{} P.Session{table, tasks, root, +best, +length, +lower, +nodes, request, +status}:
      do IO<Array<U32> & Control.Context>:
        checked : Control.Context & Bool <- Control.checkpoint(pulse, id, control)
        choose_controlled(checked, table, t => c => cancel_table(t, c, id), (t => c =>
          do IO<Array<U32> & Control.Context>:
            emit_for(U32.is_lt(length, previous) || S.is_optimal(status), original, best, length, lower, nodes, S.is_optimal(status), Control.tag(id))
            +now : Nat <- IO.now()
            IO.print("{\"type\":\"progress\",\"nodes\":" ++ U32.show(nodes) ++ ",\"lower\":" ++ U32.show(lower) ++ Control.tag(id) ++ "}")
            service_controlled(p, Nat.is_lt(now, Nat.add(started, budget)) && S.is_running(status), P.advance(P.Session{t, tasks, root, best, length, lower, nodes, request, status}), original, started, budget, length, profile, c, id, ((pulse + 1) .&. 7 : U32))))
    case _ _ P.Session{table, tasks, root, best, +length, +lower, +nodes, request, +status}:
      do IO<Array<U32> & Control.Context>:
        emit_for(U32.is_lt(length, previous) || S.is_optimal(status), original, best, length, lower, nodes, S.is_optimal(status), Control.tag(id))
        IO.print("{\"type\":\"done\",\"length\":" ++ U32.show(length) ++ ",\"lower\":" ++ U32.show(lower) ++ ",\"nodes\":" ++ U32.show(nodes) ++ ",\"optimal\":" ++ U32.show(C.pick(S.is_optimal(status), 1, 0)) ++ Control.tag(id) ++ "}")
        return (table, control)

def solve_controlled(valid: C.Validation, +original: M.Cube, +request: P.Request, budget: U32, table: Array<U32>, +profile: S.Profile, control: Control.Context, +id: U32) -> IO(Array<U32> & Control.Context):
  match valid:
    case C.Invalid{code}:
      do IO<Array<U32> & Control.Context>:
        IO.print("{\"type\":\"invalid\",\"code\":" ++ U32.show(code) ++ Control.tag(id) ++ "}")
        return (table, control)
    case C.Valid{cube}:
      do IO<Array<U32> & Control.Context>:
        started : Nat <- IO.now()
        service_controlled(U32.to_nat(C.pick(P.is_fast(request), 180000, 60000)), True{}, P.initialize(table, original, cube, request, profile), original, started, U32.to_nat(budget), 31, profile, control, id, 0)

def parsed_controlled(result: Maybe<&2, M.Cube>, request: P.Request, budget: U32, table: Array<U32>, +profile: S.Profile, control: Control.Context, id: U32) -> IO(Array<U32> & Control.Context):
  match result:
    case None{}:
      do IO<Array<U32> & Control.Context>:
        IO.print("{\"type\":\"invalid\",\"code\":6" ++ Control.tag(id) ++ "}")
        return (table, control)
    case Some{+cube}: solve_controlled(C.validate(cube), cube, request, budget, table, profile, control, id)

def checked_command(valid: Bool, text: String, mode: String, budget: U32, table: Array<U32>, +profile: S.Profile, control: Control.Context, id: U32) -> IO(Array<U32> & Control.Context):
  match valid:
    case True{}: parsed_controlled(M.from_list(colors(text)), P.request_mode(String.eq(mode, "exact")), budget, table, profile, control, id)
    case False{}:
      do IO<Array<U32> & Control.Context>:
        IO.print("{\"type\":\"invalid\",\"code\":7" ++ Control.tag(id) ++ "}")
        return (table, control)

def tracked_command(text: String, +mode: String, limit: Maybe<&2, U32>, id: Maybe<&2, U32>, table: Array<U32>, +profile: S.Profile, control: Control.Context) -> IO(Array<U32> & Control.Context):
  match limit id:
    case Some{+budget} Some{+job}:
      checked_command(U32.is_gt(job, 0) && U32.is_ge(budget, 50) && U32.is_le(budget, 30000) && (String.eq(mode, "fast") || String.eq(mode, "exact")), text, mode, budget, table, profile, control, job)
    case _ _: IO.die(Array<U32> & Control.Context, 2, "Invalid tracked worker command")

def command_controlled(args: +List<String>, table: Array<U32>, profile: S.Profile, control: Control.Context) -> IO(Array<U32> & Control.Context):
  match args control:
    case Con{text, Con{mode, Con{limit, Con{job, Nil{}}}}} Control.Attached{file, value, digits}:
      tracked_command(text, mode, U32.read(limit), U32.read(job), table, profile, Control.Attached{file, value, digits})
    case _ Control.Detached{}:
      do IO<Array<U32> & Control.Context>:
        table : Array<U32> <- worker_command(args, table, profile)
        return (table, Control.Detached{})
    case _ _: IO.die(Array<U32> & Control.Context, 2, "Expected tracked worker command")

def reuse_controlled(read: Array<U32> & Control.Context, next: Array<U32> -> Control.Context -> IO(Unit)) -> IO(Unit):
  match read:
    case Tuple{table, control}: next(table, control)

def worker_loop_controlled(fuel: Nat, table: Array<U32>, read: File & Result<&1, &1, U32 & String, String>, +profile: S.Profile, control: Control.Context) -> IO(Unit):
  match fuel read:
    case 1n+p Tuple{file, Done{SCon{head, rest}}}:
      do IO<Unit>:
        result : Array<U32> & Control.Context <- command_controlled(String.split(String.trim(SCon{head, rest}), Chr{9}), table, profile, control)
        reuse_controlled(result, t => c =>
          do IO<Unit>:
            read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
            worker_loop_controlled(p, t, read, profile, c))
    case _ Tuple{file, result}:
      do IO<Unit>:
        Control.close(control)
        File.close(file)

def checked_table(read: Array<U32> & U32) -> IO(Array<U32>):
  match read:
    case Tuple{table, 8388608}:
      IO.pure(Array<U32>, table)
    case _:
      IO.die(Array<U32>, 2, "Lookup table generation was incomplete")

def policy(text: String) -> IO(S.Profile):
  match text:
    case "forward": IO.pure(S.Profile, S.RawJoint{})
    case "inverse-three": IO.pure(S.Profile, S.RawInverseThree{})
    case "h0": IO.pure(S.Profile, S.ForwardH0{})
    case "combined": IO.pure(S.Profile, S.InverseH0{})
    case _: IO.die(S.Profile, 2, "Invalid H0 policy")

def selected_profile() -> IO(S.Profile):
  do IO<S.Profile>:
    text : String <- IO.try(String, IO.get_env("RUBEND_H0_POLICY"))
    policy(text)

def worker(file: File) -> IO(Unit):
  do IO<Unit>:
    IO.print("{\"type\":\"initializing\"}")
    profile : S.Profile <- selected_profile()
    table : Array<U32> <- A.table()
    control : Control.Context <- Control.open()
    control : Control.Context <- Control.ready(control)
    read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
    worker_loop_controlled(1000000n, table, read, profile, control)

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{text, Con{mode, Con{limit, Nil{}}}}}:
      do IO<Unit>:
        profile : S.Profile <- selected_profile()
        table : Array<U32> <- A.table()
        table : Array<U32> <- command_budget(U32.read(limit), text, mode, table, profile)
        IO.pure(Unit, Unit{})
    case Con{program, Con{worker_arg, Nil{}}}:
      do IO<Unit>:
        file : File <- IO.try(File, File.open(worker_arg, "r"))
        worker(file)
    case _:
      IO.print("Rubend: pass 54 URFDLB facelets, fast|exact, and a millisecond budget.")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
