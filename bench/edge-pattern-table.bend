import Base
import ./edge-pattern-coordinate.bend as P

type Pilot is Data:
  One{}
  Two{}
  Three{}

def count(pilot: Pilot) -> U32:
  match pilot:
    case One{}: 1
    case Two{}: 2
    case Three{}: 3

def allocate(pilot: Pilot) -> Array<U32>:
  match pilot:
    case One{}: [255 : U32^5n]
    case Two{}: [255 : U32^10n]
    case Three{}: [255 : U32^14n]

type Cells is Type:
  Cells{array: Array<U32>, reached: U32, expanded: U32, bad: U32}

type Build is Type:
  Active{cells: Cells, depth: U32}
  Finished{cells: Cells, depth: U32, complete: Bool}

def discovered(empty: Bool, array: Array<U32>, +index: U32, depth: U32, reached: U32, expanded: U32, bad: U32) -> Cells:
  match empty:
    case True{}:
      array[index] <- depth
      Cells{array, (reached + 1 : U32), expanded, bad}
    case False{}: Cells{array, reached, expanded, bad}

def read_target(read: Array<U32> & U32, index: U32, depth: U32, reached: U32, expanded: U32, bad: U32) -> Cells:
  match read:
    case Tuple{array, old}:
      discovered(U32.is_eq(old, 255), array, index, depth, reached, expanded, bad)

def target(valid: Bool, cells: Cells, +index: U32, depth: U32) -> Cells:
  match valid cells:
    case True{} Cells{array, reached, expanded, bad}:
      read_target(array[index], index, depth, reached, expanded, bad)
    case False{} Cells{array, reached, expanded, bad}:
      Cells{array, reached, expanded, (bad + 1 : U32)}

def expand(~next: U32 -> U32 -> U32 -> U32, fuel: Nat, +k: U32, +size: U32, +index: U32, +move: U32, +depth: U32, cells: Cells) -> Cells:
  match fuel:
    case 0n: cells
    case 1n+rest:
      +child = next(k, index, move)
      expand(~next, rest, k, size, index, (move + 1 : U32), depth, target(U32.is_lt(child, size), cells, child, depth))

def visit(~next: U32 -> U32 -> U32 -> U32, present: Bool, +k: U32, +size: U32, index: U32, +depth: U32, cells: Cells) -> Cells:
  match present cells:
    case True{} Cells{array, reached, expanded, bad}:
      expand(~next, 18n, k, size, index, 0, (depth + 1 : U32), Cells{array, reached, (expanded + 1 : U32), bad})
    case False{} cells: cells

def read_scan(~next: U32 -> U32 -> U32 -> U32, read: Array<U32> & U32, k: U32, size: U32, index: U32, +depth: U32, reached: U32, expanded: U32, bad: U32) -> Cells:
  match read:
    case Tuple{array, value}:
      visit(~next, U32.is_eq(value, depth), k, size, index, depth, Cells{array, reached, expanded, bad})

def scan(~next: U32 -> U32 -> U32 -> U32, fuel: Nat, +k: U32, +size: U32, +index: U32, +depth: U32, cells: Cells) -> Cells:
  match fuel cells:
    case 0n cells: cells
    case 1n+rest Cells{array, reached, expanded, bad}:
      scan(~next, rest, k, size, (index + 1 : U32), depth, read_scan(~next, array[index], k, size, index, depth, reached, expanded, bad))

def done(stop: Bool, cells: Cells, depth: U32, complete: Bool) -> Build:
  match stop:
    case True{}: Finished{cells, depth, complete}
    case False{}: Active{cells, (depth + 1 : U32)}

def layer(cells: Cells, +depth: U32, +size: U32, before: U32) -> Build:
  match cells:
    case Cells{array, +reached, expanded, +bad}:
      done(U32.is_eq(reached, before) || U32.is_ne(bad, 0), Cells{array, reached, expanded, bad}, depth, U32.is_eq(reached, size) && U32.is_eq(bad, 0))

def step(~next: U32 -> U32 -> U32 -> U32, +k: U32, +size: U32, state: Build) -> Build:
  match state:
    case Active{Cells{array, +reached, expanded, bad}, +depth}:
      layer(scan(~next, U32.to_nat(size), k, size, 0, depth, Cells{array, reached, expanded, bad}), depth, size, reached)
    case state: state

def run(~next: U32 -> U32 -> U32 -> U32, fuel: Nat, +k: U32, +size: U32, state: Build) -> Build:
  match fuel state:
    case 0n state: state
    case 1n+rest Active{cells, depth}:
      run(~next, rest, k, size, step(~next, k, size, Active{cells, depth}))
    case _ state: state

def seed(valid: Bool, array: Array<U32>, goal: U32) -> Build:
  match valid:
    case True{}:
      array[goal] <- 0
      Active{Cells{array, 1, 0, 0}, 0}
    case False{}: Finished{Cells{array, 0, 0, 1}, 0, False{}}

def initial(+pilot: Pilot, +goal: U32) -> Build:
  seed(U32.is_lt(goal, P.cardinality(count(pilot))), allocate(pilot), goal)

def value_read(read: Array<U32> & U32, acc: +List<U32>) -> Array<U32> & +List<U32>:
  match read:
    case Tuple{array, value}: (array, value <> acc)

def values(fuel: Nat, +index: U32, result: Array<U32> & +List<U32>) -> Array<U32> & +List<U32>:
  match fuel result:
    case 0n Tuple{array, acc}: (array, List.reverse(&2, U32, acc))
    case 1n+rest Tuple{array, acc}:
      values(rest, (index + 1 : U32), value_read(array[index], acc))
