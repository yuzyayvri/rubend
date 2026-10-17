import Base
import ./src/toolchain.bend as Toolchain
import ./src/model-laws.bend as CubeLaws
import ./src/certificate.bend as Certificate
import ./src/symmetry.bend as Symmetry
import ./src/notation.bend as Notation
import ./src/pruning-laws.bend as Pruning

law toolchain_flip_roundtrip:
  for value: Bool
  {Toolchain.flip(Toolchain.flip(value)) == value : Bool}
