import Base

type Tree is Data:
  Tip{value: U32}
  Node{left: Tree, right: Tree}

def tree_new(+depth: Nat) -> Tree:
  match depth:
    case 0n:
      Tip{7}
    case 1n+p:
      Node{tree_new(p), tree_new(p)}

def tree_get(tree: Tree, +index: U32, side: Bool) -> U32:
  match tree side:
    case Tip{value} _:
      value
    case Node{left, right} True{}:
      tree_get(left, (index >> 1n : U32), U32.is_eq((index .&. 2 : U32), 0))
    case Node{left, right} False{}:
      tree_get(right, (index >> 1n : U32), U32.is_eq((index .&. 2 : U32), 0))

def array_loop(fuel: Nat, read: Array<U32> & U32, +index: U32, acc: U32) -> Array<U32> & U32:
  match fuel read:
    case 0n Tuple{table, value}:
      (table, acc)
    case 1n+p Tuple{table, value}:
      +next = (index * 1664525 + 1013904223 : U32)
      array_loop(p, table[next], next, (acc + value : U32))

def tree_loop(fuel: Nat, +table: Tree, +index: U32, acc: U32) -> U32:
  match fuel:
    case 0n:
      acc
    case 1n+p:
      tree_loop(p, table, (index * 1664525 + 1013904223 : U32), (acc + tree_get(table, index, U32.is_eq((index .&. 1 : U32), 0)) : U32))

def report(result: Array<U32> & U32, a: Nat, b: Nat) -> IO(Unit):
  match result:
    case (table, sum):
      IO.print("array " ++ Nat.show(Nat.sub(b, a)) ++ " " ++ U32.show(sum))

def main() -> IO(Unit):
  do IO<Unit>:
    a : Nat <- IO.now()
    result : Array<U32> & U32 = array_loop(1000000n, Array.get(U32, [7 : U32^20n], 42), 42, 0)
    b : Nat <- IO.now()
    report(result, a, b)
    c : Nat <- IO.now()
    total : U32 = tree_loop(1000000n, tree_new(20n), 42, 0)
    d : Nat <- IO.now()
    IO.print("tree " ++ Nat.show(Nat.sub(d, c)) ++ " " ++ U32.show(total))
