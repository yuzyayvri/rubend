import Base
import ../src/coordinates.bend as Q
import ../src/tables.bend as T
import ../src/table-audit.bend as A
import ../src/joint-table.bend as J

type Compared is Type:
  Compared{packed: Array<U32>, reference: Array<U32>, passed: Bool}

def same_value(read: Array<U32> & U32, reference: Array<U32>, actual: U32) -> Compared:
  match read:
    case Tuple{packed, value}: Compared{packed, reference, U32.is_eq(value, actual)}

def reference_value(read: Array<U32> & U32, packed: Array<U32>, +index: U32) -> Compared:
  match read:
    case Tuple{reference, value}: same_value(J.get(packed, index), reference, value)

def compare(fuel: Nat, result: Compared, +index: U32) -> Compared:
  match fuel result:
    case 1n+p Compared{packed, reference, True{}}: compare(p, reference_value(reference[(85140 + index : U32)], packed, index), (index + 1 : U32))
    case _ result: result

def reference() -> Array<U32>:
  table = [255 : U32^23n]
  table = T.fill(39366n, table, Q.Twist{}, 0, 18, 0)
  table = T.fill(36864n, table, Q.Flip{}, 0, 18, 39366)
  table[85140] <- 0
  T.finish(T.breadth(89579521n, T.BReady{table, [0 : U32^23n], 0, 1}, T.Spec{85140, 2048, 4478976, 18, 0, 39366}), 4478976)

def checked(result: A.Audit) -> IO(Unit):
  match result:
    case A.ADone{table, 0, maximum, hash}: IO.print("{\"type\":\"referenceAudit\",\"passed\":true,\"states\":4478976,\"directedEdges\":80621568,\"maximum\":" ++ U32.show(maximum) ++ ",\"fingerprint\":" ++ U32.show(hash) ++ "}")
    case _: IO.die(Unit, 2, "Uncompressed reference audit failed")

def compared(result: Compared) -> IO(Array<U32>):
  match result:
    case Compared{packed, reference, True{}}:
      do IO<Array<U32>>:
        IO.print("{\"type\":\"referenceAgreement\",\"passed\":true,\"states\":4478976}")
        checked(A.audit(reference, T.Spec{85140, 2048, 4478976, 18, 0, 39366}))
        return packed
    case _: IO.die(Array<U32>, 2, "Packed/reference disagreement")

def verify(packed: Array<U32>) -> IO(Array<U32>):
  compared(compare(4478976n, Compared{packed, reference(), True{}}, 0))
