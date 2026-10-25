import Base
import ./edge-binary-checkpoint.bend as A
import ./edge-pattern-table.bend as T
import ../src/joint-cache.bend as Cache
import ../build/experiments/u03-edge-pattern-v1/generated/edge-pattern.bend as E

def goal(pattern: U32) -> U32:
  match pattern:
    case 0: 1776
    case _: 19216

def saved(table: Array<U32>, pattern: U32, tag: U32, depth: U32, reached: U32, expanded: U32, bad: U32) -> IO(Unit):
  IO.print("{\"pattern\":" ++ U32.show(pattern) ++ ",\"tag\":" ++ U32.show(tag) ++ ",\"depth\":" ++ U32.show(depth) ++ ",\"reached\":" ++ U32.show(reached) ++ ",\"expanded\":" ++ U32.show(expanded) ++ ",\"bad\":" ++ U32.show(bad) ++ "}")

def cells(cells: T.Cells, output: String, pattern: U32, tag: U32, depth: U32) -> IO(Unit):
  match cells:
    case T.Cells{table, reached, expanded, bad}:
      do IO<Unit>:
        table : Array<U32> <- Cache.save(output, table, 190080)
        saved(table, pattern, tag, depth, reached, expanded, bad)

def result(state: T.Build, output: String, pattern: U32) -> IO(Unit):
  match state:
    case T.Active{state, depth}: cells(state, output, pattern, 0, depth)
    case T.Finished{state, depth, True{}}: cells(state, output, pattern, 1, depth)
    case _: IO.die(Unit, 2, "Binary checkpoint admission or build failed")

def resume(allowed: Bool, state: T.Build, output: String, pattern: U32) -> IO(Unit):
  match allowed:
    case True{}: result(T.run(~E.test_next, 1n, 4, 190080, state), output, pattern)
    case False{}: IO.die(Unit, 2, "Injected binary checkpoint failure after read and close")

def loaded(action: String, +pattern: U32, input: String, output: String, depth: U32, reached: U32, expanded: U32) -> IO(Unit):
  do IO<Unit>:
    table : Array<U32> <- Cache.load(input, [255 : U32^18n], 0, 190080)
    resume(String.eq(action, "resume"), A.admit(table, goal(pattern), depth, reached, expanded), output, pattern)

def dispatch(action: String, +pattern: U32, input: String, output: String, depth: U32, reached: U32, expanded: U32) -> IO(Unit):
  match action:
    case "seed": result(T.seed(True{}, [255 : U32^18n], goal(pattern)), output, pattern)
    case action: loaded(action, pattern, input, output, depth, reached, expanded)

def allowed(ok: Bool, action: String, pattern: U32, input: String, output: String, depth: U32, reached: U32, expanded: U32) -> IO(Unit):
  match ok:
    case True{}: dispatch(action, pattern, input, output, depth, reached, expanded)
    case False{}: IO.die(Unit, 2, "Invalid binary checkpoint arguments")

def numbers(+action: String, pattern: Maybe<&2, U32>, input: String, output: String, depth: Maybe<&2, U32>, reached: Maybe<&2, U32>, expanded: Maybe<&2, U32>) -> IO(Unit):
  match pattern depth reached expanded:
    case Some{+pattern} Some{depth} Some{reached} Some{expanded}:
      allowed(U32.is_lt(pattern, 2) && (String.eq(action, "seed") || String.eq(action, "resume") || String.eq(action, "fail")), action, pattern, input, output, depth, reached, expanded)
    case _ _ _ _: IO.die(Unit, 2, "Invalid binary checkpoint numbers")

def command(args: List<String>) -> IO(Unit):
  match args:
    case Con{program, Con{+action, Con{pattern, Con{input, Con{output, Con{depth, Con{reached, Con{expanded, Nil{}}}}}}}}}:
      numbers(action, U32.read(pattern), input, output, U32.read(depth), U32.read(reached), U32.read(expanded))
    case _: IO.die(Unit, 2, "Expected action, pattern, input, output, depth, reached and expanded")

def main() -> IO(Unit):
  do IO<Unit>:
    args : List<String> <- IO.args()
    command(args)
