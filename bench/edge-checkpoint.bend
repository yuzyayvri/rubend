import Base
import ./edge-pattern-coordinate.bend as P
import ./edge-pattern-table.bend as T
import ../build/experiments/u03-edge-pattern-v1/generated/edge-pattern.bend as E

def pilot(count: U32) -> Maybe<&2, T.Pilot>:
  match count:
    case 1: Some{T.One{}}
    case 2: Some{T.Two{}}
    case 3: Some{T.Three{}}
    case _: None{}

def cells_packet(read: Array<U32> & +List<U32>, tag: U32, depth: U32, reached: U32, expanded: U32, bad: U32) -> +List<U32>:
  match read:
    case Tuple{array, values}: tag <> depth <> reached <> expanded <> bad <> values

def packet_cells(pilot: T.Pilot, cells: T.Cells, tag: U32, depth: U32) -> +List<U32>:
  match cells:
    case T.Cells{array, reached, expanded, bad}:
      cells_packet(T.values(U32.to_nat(P.cardinality(T.count(pilot))), 0, (array, Nil{})), tag, depth, reached, expanded, bad)

def packet(pilot: T.Pilot, result: T.Build) -> +List<U32>:
  match result:
    case T.Active{cells, depth}: packet_cells(pilot, cells, 0, depth)
    case T.Finished{cells, depth, True{}}: packet_cells(pilot, cells, 1, depth)
    case T.Finished{cells, depth, False{}}: packet_cells(pilot, cells, 2, depth)

def fill(values: +List<U32>, array: Array<U32>, +index: U32) -> Array<U32>:
  match values:
    case Nil{}: array
    case Con{head, rest}:
      array[index] <- head
      fill(rest, array, (index + 1 : U32))

def initial(selected: Maybe<&2, T.Pilot>, goal: U32, fuel: U32) -> +List<U32>:
  match selected:
    case None{}: Nil{}
    case Some{+pilot}: packet(pilot, T.run(~E.test_next, U32.to_nat(fuel), T.count(pilot), P.cardinality(T.count(pilot)), T.initial(pilot, goal)))

def start(count: U32, goal: U32, fuel: U32) -> +List<U32>:
  initial(pilot(count), goal, fuel)

def admitted(valid: Bool, +pilot: T.Pilot, depth: U32, reached: U32, expanded: U32, values: +List<U32>, fuel: U32) -> +List<U32>:
  match valid:
    case False{}: Nil{}
    case True{}:
      packet(pilot, T.run(~E.test_next, U32.to_nat(fuel), T.count(pilot), P.cardinality(T.count(pilot)), T.Active{T.Cells{fill(values, T.allocate(pilot), 0), reached, expanded, 0}, depth}))

def sized(values: +List<U32>, left: U32) -> Bool:
  match values left:
    case Nil{} 0: True{}
    case Nil{} _: False{}
    case Con{head, rest} 0: False{}
    case Con{head, rest} left: sized(rest, (left - 1 : U32))

def resume_known(selected: Maybe<&2, T.Pilot>, +depth: U32, +reached: U32, +expanded: U32, +values: +List<U32>, fuel: U32) -> +List<U32>:
  match selected:
    case None{}: Nil{}
    case Some{+pilot}: admitted(sized(values, P.cardinality(T.count(pilot))) && U32.is_le(depth, 32) && U32.is_le(expanded, reached) && U32.is_le(reached, P.cardinality(T.count(pilot))), pilot, depth, reached, expanded, values, fuel)

def resume_admitted(count: U32, depth: U32, reached: U32, expanded: U32, values: +List<U32>, fuel: U32) -> +List<U32>:
  resume_known(pilot(count), depth, reached, expanded, values, fuel)

def checksum(values: +List<U32>, acc: U32) -> U32:
  match values:
    case Nil{}: acc
    case Con{head, rest}: checksum(rest, ((acc * 33 : U32) + head : U32))
