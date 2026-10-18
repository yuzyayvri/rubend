import Base
import ../src/model.bend as M
import ../src/symmetry48.bend as S

def json_tail(values: +List<U32>) -> String:
  match values:
    case Nil{}: ""
    case Con{head, tail}: "," ++ U32.show(head) ++ json_tail(tail)

def json_values(values: +List<U32>) -> String:
  match values:
    case Nil{}: "[]"
    case Con{head, tail}: "[" ++ U32.show(head) ++ json_tail(tail) ++ "]"

def composition_index(+left: S.Symmetry, right: Maybe<&2, S.Symmetry>) -> U32:
  match right:
    case Some{right}: S.index(S.compose(left, right))
    case None{}: 255

def compositions(fuel: Nat, +sym: S.Symmetry, +index: U32) -> +List<U32>:
  match fuel:
    case 0n: Nil{}
    case 1n+p: composition_index(sym, S.from_index(index)) <> compositions(p, sym, (index + 1 : U32))

def mapped(fuel: Nat, +sym: S.Symmetry, +index: U32) -> +List<U32>:
  match fuel:
    case 0n: Nil{}
    case 1n+p: M.index(S.map_move(sym, M.from_index(index))) <> mapped(p, sym, (index + 1 : U32))

def emit(selected: Maybe<&2, S.Symmetry>) -> IO(Unit):
  match selected:
    case None{}: IO.die(Unit, 2, "invalid symmetry")
    case Some{+sym}:
      IO.print("{\"sym\":" ++ U32.show(S.index(sym)) ++ ",\"inverse\":" ++ U32.show(S.index(S.inverse(sym))) ++ ",\"compositions\":" ++ json_values(compositions(48n, sym, 0)) ++ ",\"moves\":" ++ json_values(mapped(18n, sym, 0)) ++ ",\"cubes\":[" ++ json_values(M.to_list(S.apply(sym, M.Cube{6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59}))) ++ "," ++ json_values(M.to_list(S.apply(sym, M.Cube{0, 1, 2, 3, 4, 5, 6, 7, 255, 65535, 2147483648, 4294967295, 0, 1, 2, 3, 4, 5, 6, 7, 255, 65535, 2147483648, 4294967295, 0, 1, 2, 3, 4, 5, 6, 7, 255, 65535, 2147483648, 4294967295, 0, 1, 2, 3, 4, 5, 6, 7, 255, 65535, 2147483648, 4294967295, 0, 1, 2, 3, 4, 5}))) ++ "," ++ json_values(M.to_list(S.apply(sym, M.Cube{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}))) ++ "," ++ json_values(M.to_list(S.apply(sym, M.Cube{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}))) ++ "," ++ json_values(M.to_list(S.apply(sym, M.Cube{2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2}))) ++ "," ++ json_values(M.to_list(S.apply(sym, M.Cube{3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3}))) ++ "," ++ json_values(M.to_list(S.apply(sym, M.Cube{4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4}))) ++ "," ++ json_values(M.to_list(S.apply(sym, M.Cube{5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5}))) ++ "]}")

def rows(fuel: Nat, +index: U32) -> IO(Unit):
  match fuel:
    case 0n: IO.pure(Unit, Unit{})
    case 1n+p:
      do IO<Unit>:
        emit(S.from_index(index))
        rows(p, (index + 1 : U32))

def main() -> IO(Unit):
  rows(48n, 0)
