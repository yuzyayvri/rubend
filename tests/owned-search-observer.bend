import Base
import ../src/owned/search.bend as O
import ../src/search.bend as R
import ../src/cubie.bend as C
import ../bench/owned-search-observer.bend as V

def owned() -> O.Search:
  O.initialize_checked(True{}, [0 : U32*1n], C.solved(), O.Improve{}, O.Light{})

def frame(+variant: U32, value: R.Frame) -> R.Frame:
  match value:
    case R.Node{cube, +a, b, c, +left, previous, next, phase, path, length}:
      R.Node{C.turn(C.pick(U32.is_eq(variant, 1), 0, 18), cube), (a + C.pick(U32.is_eq(variant, 2), 1, 0) : U32), b, c, (left + C.pick(U32.is_eq(variant, 3), 1, 0) : U32), previous, next, R.next_goal(U32.is_eq(variant, 4)), List.append(&2, U32, path, List.replicate(U32, U32.to_nat(C.pick(U32.is_eq(variant, 5), 1, 0)), 0)), length}
    case value: value

def reference_state(state: R.Search, +variant: U32) -> R.Search:
  match state:
    case R.Search{table, Con{first, rest}, R.Meta{root, p1, ceiling, best, length, mode, bound, +lower, +nodes, status, profile}}:
      R.Search{table, frame(variant, first) <> rest, R.Meta{root, p1, ceiling, best, length, mode, bound, (lower + C.pick(U32.is_eq(variant, 6), 1, 0) : U32), (nodes + C.pick(U32.is_eq(variant, 7), 1, 0) : U32), status, profile}}
    case state: state

def reference(variant: U32) -> R.Search:
  reference_state(R.initialize_checked(True{}, [0 : U32*1n], C.solved(), R.Improve{}, R.Light{}), variant)

def equal(comparison: V.Comparison) -> Bool:
  match comparison:
    case V.Comparison{owned, reference, same, frames, running, diagnostic}: same

def failed(state: O.Search, expected: U32) -> Bool:
  match state:
    case O.Search{table, store, O.Meta{root, p1, ceiling, best, length, mode, bound, lower, nodes, O.ContinuationFailure{fault}, profile}}:
      U32.is_eq(O.store_fault_code(fault), expected)
    case _: False{}

def corrupted(state: O.Search, fault: O.Fault) -> O.Search:
  match state:
    case O.Search{table, O.Store{frames, path, used, cursor, old}, meta}:
      O.Search{table, O.Store{[O.EmptySlot{} : O.Slot*64n], path, used, cursor, fault}, meta}

def flag(value: Bool) -> U32:
  C.pick(value, 1, 0)

def checks(fuel: Nat, +index: U32) -> +List<U32>:
  match fuel:
    case 0n: Nil{}
    case 1n+p: flag(U32.is_eq(flag(equal(V.compare(owned(), reference(index)))), flag(U32.is_eq(index, 0)))) <> checks(p, (index + 1 : U32))

def all(values: +List<U32>) -> Bool:
  match values:
    case Nil{}: True{}
    case Con{value, rest}: U32.is_eq(value, 1) && all(rest)

def report(passed: Bool) -> IO(Unit):
  match passed:
    case True{}: IO.print("{\"passed\":true,\"observerPositive\":1,\"observerNegatives\":7,\"propagatedFailures\":2}")
    case False{}: IO.die(Unit, 2, "Owned search observer or fault propagation failed")

def main() -> IO(Unit):
  +values = List.append(&2, U32, checks(8n, 0), [flag(failed(O.run(0n, corrupted(owned(), O.FrameCapacity{})), 1)), flag(failed(O.run(1n, corrupted(owned(), O.Healthy{})), 5))])
  do IO<Unit>:
    IO.print(V.vector(values))
    report(all(values))
