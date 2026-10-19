import Base
import ../src/main.bend as H
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/h0-bound.bend as K
import ../src/h0-corners.bend as Corners
import ../src/h0-edges.bend as Edges
import ../src/h0-table-io.bend as Load
import ../src/joint-cache.bend as Cache
import ./rejected-h0-fused.bend as Rejected

def answer(read: Array<U32> & K.CubeBound, sparse: U32, edge: U32) -> IO(Array<U32>):
  match read:
    case Tuple{table, K.CubeBound{distance}}:
      do IO<Array<U32>>:
        IO.print("{\"distance\":" ++ U32.show(distance) ++ ",\"sparse\":" ++ U32.show(sparse) ++ ",\"edge\":" ++ U32.show(edge) ++ "}")
        return table

def lookup(fast: Bool, table: Array<U32>, cube: C.Cubie) -> Array<U32> & K.CubeBound:
  match fast:
    case True{}: Rejected.full_cube_fast(table, cube)
    case False{}: K.full_cube(table, cube)

def valid(value: C.Validation, table: Array<U32>, fast: Bool) -> IO(Array<U32>):
  match value:
    case C.Valid{+cube}: answer(lookup(fast, table, cube), Corners.sparse_key(Corners.project(cube)), Edges.index(Edges.project(cube)))
    case _: IO.die(Array<U32>, 2, "Invalid bound-query cube")

def parsed(value: Maybe<&2, M.Cube>, table: Array<U32>, fast: Bool) -> IO(Array<U32>):
  match value:
    case Some{cube}: valid(C.validate(cube), table, fast)
    case _: IO.die(Array<U32>, 2, "Invalid bound-query facelets")

def loop(fuel: Nat, read: File & Result<&1, &1, U32 & String, String>, table: Array<U32>, +fast: Bool) -> IO(Unit):
  match fuel read:
    case 1n+p Tuple{file, Done{SCon{head, rest}}}:
      do IO<Unit>:
        table : Array<U32> <- parsed(M.from_list(H.colors(String.trim(SCon{head, rest}))), table, fast)
        read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 55)
        loop(p, read, table, fast)
    case _ Tuple{file, read}: File.close(file)

def run(input: String, meta: String, distance: String, fast: Bool) -> IO(Unit):
  do IO<Unit>:
    table : Array<U32> <- Cache.load_words(meta, [0 : U32^29n], K.meta_base(), 2892000)
    table : Array<U32> <- Load.meta_digest(Cache.fingerprint_at(2892000n, Cache.Digest{table, 2166136261}, K.meta_base(), 0))
    table : Array<U32> <- Cache.load_words(distance, table, K.distance_base(), 29391863)
    table : Array<U32> <- Load.distance_digest(Cache.fingerprint_at(29391863n, Cache.Digest{table, 2166136261}, K.distance_base(), 0))
    file : File <- IO.try(File, File.open(input, "r"))
    read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 55)
    loop(100000n, read, table, fast)

def args(values: List<String>) -> IO(Unit):
  match values:
    case Con{program, Con{input, Con{meta, Con{distance, Nil{}}}}}: run(input, meta, distance, False{})
    case Con{program, Con{input, Con{meta, Con{distance, Con{"fast", Nil{}}}}}}: run(input, meta, distance, True{})
    case _: IO.die(Unit, 2, "Expected input, metadata, and distance paths")

def main() -> IO(Unit):
  do IO<Unit>:
    values : List<String> <- IO.args()
    args(values)
