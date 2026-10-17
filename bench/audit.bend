import Base
import ../src/tables.bend as T
import ../src/table-audit.bend as A

def report(result: A.Audit, label: String) -> IO(Array<U32>):
  match result:
    case A.ADone{table, 0, maximum, hash}:
      do IO<Array<U32>>:
        IO.print("{\"table\":\"" ++ label ++ "\",\"failures\":0,\"maximum\":" ++ U32.show(maximum) ++ ",\"fingerprint\":" ++ U32.show(hash) ++ "}")
        return table
    case _:
      IO.die(Array<U32>, 1, "Table admissibility audit failed")

def main() -> IO(Unit):
  do IO<Unit>:
    table : Array<U32> = T.generate()
    table : Array<U32> <- report(A.audit(table, T.Spec{891780, 495, 1082565, 18, 0, 76230}), "twist-slice")
    table : Array<U32> <- report(A.audit(table, T.Spec{1974345, 495, 1013760, 18, 39366, 76230}), "flip-slice")
    table : Array<U32> <- report(A.audit(table, T.Spec{2988105, 24, 967680, 10, 85140, 891540}), "corners-middle")
    table : Array<U32> <- report(A.audit(table, T.Spec{3955785, 24, 967680, 10, 488340, 891540}), "edges-middle")
    IO.print("All projected distances and transitions audited.")
