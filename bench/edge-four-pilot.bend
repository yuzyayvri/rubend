import Base
import ../src/cubie.bend as C
import ./edge-pattern-table.bend as T
import ../build/experiments/u03-edge-pattern-v1/generated/edge-pattern.bend as E

def goal(labels: +List<U32>, cube: C.Cubie) -> U32:
  match cube:
    case C.Cubie{cp, co, ep, eh, eo}: E.test_project(labels, ep, eh, eo)

def seeded(read: Array<U32> & U32, +index: U32) -> T.Build & U32:
  match read:
    case Tuple{array, +words}: (T.seed(U32.is_eq(words, 262144) && U32.is_lt(index, 190080), array, index), words)

def initial(index: U32) -> T.Build & U32:
  seeded(Array.size(U32, [255 : U32^18n]), index)

def texts(values: +List<U32>) -> +List<String>:
  match values:
    case Nil{}: Nil{}
    case Con{head, rest}: U32.show(head) <> texts(rest)

def print_values(read: Array<U32> & +List<U32>, prefix: String) -> IO(Unit):
  match read:
    case Tuple{array, values}: IO.print(prefix ++ ",\"values\":[" ++ String.join(texts(values), ",") ++ "]}")

def report(valid: Bool, array: Array<U32>, prefix: String) -> IO(Unit):
  match valid:
    case True{}: print_values(T.values(190080n, 0, (array, Nil{})), prefix)
    case False{}: IO.print(prefix ++ ",\"values\":[]}")

def cells(cells: T.Cells, pattern: U32, index: U32, words: U32, +complete: Bool, depth: U32, started: Nat) -> IO(Unit):
  match cells:
    case T.Cells{array, +reached, +expanded, +bad}:
      do IO<Unit>:
        ended : Nat <- IO.now()
        report(complete && U32.is_eq(reached, 190080) && U32.is_eq(expanded, 190080) && U32.is_eq(bad, 0), array, "{\"pattern\":" ++ U32.show(pattern) ++ ",\"count\":4,\"goal\":" ++ U32.show(index) ++ ",\"allocatedWords\":" ++ U32.show(words) ++ ",\"complete\":" ++ U32.show(C.pick(complete, 1, 0)) ++ ",\"depth\":" ++ U32.show(depth) ++ ",\"reached\":" ++ U32.show(reached) ++ ",\"expanded\":" ++ U32.show(expanded) ++ ",\"bad\":" ++ U32.show(bad) ++ ",\"nativeGenerationMs\":" ++ Nat.show(Nat.sub(ended, started)))

def finished(result: T.Build, pattern: U32, index: U32, words: U32, started: Nat) -> IO(Unit):
  match result:
    case T.Active{state, depth}: cells(state, pattern, index, words, False{}, depth, started)
    case T.Finished{state, depth, complete}: cells(state, pattern, index, words, complete, depth, started)

def build_seed(seed: T.Build & U32, pattern: U32, index: U32, started: Nat) -> IO(Unit):
  match seed:
    case Tuple{state, words}: finished(T.run(~E.test_next, 32n, 4, 190080, state), pattern, index, words, started)

def build(pattern: U32, +index: U32) -> IO(Unit):
  do IO<Unit>:
    started : Nat <- IO.now()
    build_seed(initial(index), pattern, index, started)

def main() -> IO(Unit):
  do IO<Unit>:
    build(0, goal([0, 2, 4, 6], C.solved()))
    build(1, goal([1, 3, 5, 7], C.solved()))
