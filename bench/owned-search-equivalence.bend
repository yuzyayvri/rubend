import Base
import ../src/owned/search.bend as O
import ../src/search.bend as R
import ../src/cubie.bend as C
import ../src/tables.bend as T
import ./owned-search-observer.bend as V

type Checked is Type:
  Checked{owned: Array<U32>, reference: Array<U32>, passed: Bool, comparisons: U32, maximum: U32, diagnostic: String}

type Suite is Type:
  Suite{owned: Array<U32>, reference: Array<U32>, passed: Bool, records: +List<String>}

def owned_stage(value: U32) -> O.Stage:
  match value:
    case 0: O.Improve{}
    case 1: O.ExactContour{}
    case _: O.FirstThenExact{}

def reference_stage(value: U32) -> R.Stage:
  match value:
    case 0: R.Improve{}
    case 1: R.ExactContour{}
    case _: R.FirstThenExact{}

def scramble(moves: +List<U32>, cube: C.Cubie) -> C.Cubie:
  match moves:
    case Nil{}: cube
    case Con{move, rest}: scramble(rest, C.turn(move, cube))

def root(value: U32) -> C.Cubie:
  match value:
    case 0: C.solved()
    case 1: scramble([0], C.solved())
    case 2: scramble([3, 0, 5, 2], C.solved())
    case 3: scramble([1, 4, 7], C.solved())
    case _: scramble([0, 3, 6, 9, 12, 15, 1, 4, 7, 10, 13, 16], C.solved())

def finish(owned: O.Search, reference: R.Search, passed: Bool, comparisons: U32, maximum: U32, diagnostic: String) -> Checked:
  match owned reference:
    case O.Search{table, store, meta} R.Search{other, stack, other_meta}:
      Checked{table, other, passed, comparisons, maximum, diagnostic}

def active(running: Bool, owned: O.Search, reference: R.Search, count: U32, maximum: U32, next: O.Search -> R.Search -> U32 -> U32 -> Checked) -> Checked:
  match running:
    case True{}: next(owned, reference, count, maximum)
    case False{}: finish(owned, reference, True{}, count, maximum, "")

def compared(comparison: V.Comparison, +count: U32, +maximum: U32, next: O.Search -> R.Search -> U32 -> U32 -> Checked) -> Checked:
  match comparison:
    case V.Comparison{owned, reference, False{}, frames, running, diagnostic}:
      finish(owned, reference, False{}, count, maximum, diagnostic)
    case V.Comparison{owned, reference, True{}, +frames, +running, diagnostic}:
      active(running, owned, reference, (count + 1 : U32), C.pick(U32.is_gt(frames, maximum), frames, maximum), next)

def loop(fuel: Nat, owned: O.Search, reference: R.Search, count: U32, maximum: U32) -> Checked:
  match fuel:
    case 0n: compared(V.compare(owned, reference), count, maximum, o => r => c => m => finish(o, r, True{}, c, m, ""))
    case 1n+p: compared(V.compare(owned, reference), count, maximum, o => r => c => m => loop(p, O.run(1n, o), R.run(1n, r), c, m))

def show(value: Bool) -> String:
  match value:
    case True{}: "true"
    case False{}: "false"

def record(index: U32, passed: Bool, comparisons: U32, maximum: U32, diagnostic: String) -> String:
  "{\"case\":" ++ U32.show(index) ++ ",\"passed\":" ++ show(passed) ++ ",\"comparisons\":" ++ U32.show(comparisons) ++ ",\"maximumFrames\":" ++ U32.show(maximum) ++ ",\"diagnostic\":" ++ diagnostic ++ "}"

def case_check(+index: U32, owned: Array<U32>, reference: Array<U32>) -> Checked:
  loop(20000n, O.initialize(owned, root((index / 3 : U32)), owned_stage((index % 3 : U32)), O.Light{}), R.initialize(reference, root((index / 3 : U32)), reference_stage((index % 3 : U32)), R.Light{}), 0, 0)

def suite_checked(result: Checked, +index: U32, records: +List<String>, next: Array<U32> -> Array<U32> -> (+List<String>) -> Suite) -> Suite:
  match result:
    case Checked{owned, reference, False{}, comparisons, maximum, diagnostic}:
      Suite{owned, reference, False{}, record(index, False{}, comparisons, maximum, diagnostic) <> records}
    case Checked{owned, reference, True{}, comparisons, maximum, diagnostic}:
      next(owned, reference, record(index, True{}, comparisons, maximum, "null") <> records)

def suite(fuel: Nat, +index: U32, owned: Array<U32>, reference: Array<U32>, records: +List<String>) -> Suite:
  match fuel:
    case 0n: Suite{owned, reference, True{}, records}
    case 1n+p: suite_checked(case_check(index, owned, reference), index, records, o => r => rows => suite(p, (index + 1 : U32), o, r, rows))

def verdict(passed: Bool) -> IO(Unit):
  match passed:
    case True{}: IO.pure(Unit, Unit{})
    case False{}: IO.die(Unit, 2, "Owned search differs from reference")

def report(result: Suite) -> IO(Unit):
  match result:
    case Suite{owned, reference, +passed, records}:
      do IO<Unit>:
        IO.print("{\"passed\":" ++ show(passed) ++ ",\"cases\":[" ++ String.join(List.reverse(&2, String, records), ",") ++ "]}")
        verdict(passed)

def main() -> IO(Unit):
  report(suite(15n, 0, T.generate(), T.generate(), Nil{}))
