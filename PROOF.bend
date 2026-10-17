import Base
import ./LAWS.bend as Laws
import ./src/model-proof.bend as CubeProof
import ./src/packed-symmetry.bend as PackedSymmetry
import ./src/joint-table.bend as JointTable
import ./src/joint-audit.bend as JointAudit

def Laws.toolchain_flip_roundtrip(value):
  match value:
    case False{}:
      {==}
    case True{}:
      {==}
