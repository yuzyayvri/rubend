import Base
import ./phase2-projection.bend as P
import ../src/coordinates.bend as Q

type Maps is Type:
  Maps{words: Array<U32>, classes: Array<U32>, checksum: U32}

type Sample is Type:
  Sample{values: Array<U32>, checksum: U32, steps: U32}

def fill(fuel: Nat, +rank: U32, words: Array<U32>, classes: Array<U32>, checksum: U32) -> Maps:
  match fuel:
    case 0n: Maps{words, classes, checksum}
    case 1n+rest:
      +word = Q.unrank8(rank)
      +value = P.corner_index(word)
      words[rank] <- word
      classes[rank] <- value
      fill(rest, (rank + 1 : U32), words, classes, (checksum * 33 + value : U32))

def build() -> Maps:
  fill(40320n, 0, [0 : U32^16n], [0 : U32^16n], 0)

def direct(word: U32) -> U32:
  P.corner_index(word)

def mapped(value: U32) -> U32:
  value

def read_work(~project: U32 -> U32, fuel: Nat, read: Array<U32> & U32, rank: U32, step: U32, checksum: U32) -> Sample:
  match fuel read:
    case 0n Tuple{values, value}: Sample{values, checksum, step}
    case 1n+rest Tuple{values, value}:
      +sum = (checksum * 1664525 + project(value) : U32)
      +next = ((rank * 1664525 + sum + 1013904223 : U32) % 40320 : U32)
      read_work(~project, rest, values[next], next, (step + 1 : U32), sum)

def work(~project: U32 -> U32, +fuel: Nat, values: Array<U32>, +seed: U32) -> Sample:
  +rank = (seed % 40320 : U32)
  read_work(~project, fuel, values[rank], rank, 0, seed)

def test_direct(fuel: Nat, values: Array<U32>, seed: U32) -> Sample:
  work(~direct, fuel, values, seed)

def test_mapped(fuel: Nat, values: Array<U32>, seed: U32) -> Sample:
  work(~mapped, fuel, values, seed)
