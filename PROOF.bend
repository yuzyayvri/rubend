import Base
import ./LAWS.bend as Laws
import ./src/model-proof.bend as CubeProof
import ./src/packed-symmetry.bend as PackedSymmetry
import ./src/joint-table.bend as JointTable
import ./src/joint-audit.bend as JointAudit
import ./src/block-table.bend as BlockTable
import ./src/search.bend as Search
import ./src/portfolio.bend as Portfolio
import ./src/small-table.bend as SmallTable
import ./src/small/search.bend as SmallSearch
import ./src/small/portfolio.bend as SmallPortfolio
import ./src/small/tables.bend as SmallTables
import ./src/corner-table.bend as CornerTable
import ./src/corner-bound.bend as CornerBound
import ./src/corner/search.bend as CornerSearch
import ./src/corner/portfolio.bend as CornerPortfolio
import ./src/corner-first/search.bend as CornerFirstSearch
import ./src/corner-first/portfolio.bend as CornerFirstPortfolio
import ./src/symmetry48-proof.bend as Symmetry48Proof
import ./src/h0-corners.bend as H0Corners

def Laws.toolchain_flip_roundtrip(value):
  match value:
    case False{}:
      {==}
    case True{}:
      {==}
