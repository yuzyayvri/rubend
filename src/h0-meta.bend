import Base
import ./h0-corners.bend as H
import ./h0-classes.bend as G
import ./h0-edges.bend as E
import ./h0-edge-table.bend as T
import ./model.bend as M

def words() -> U32:
  2892000

def count() -> U32:
  117567450

def representatives() -> U32:
  524288

def stabilizers_lo() -> U32:
  528384

def stabilizers_hi() -> U32:
  532480

def corner_moves() -> U32:
  536576

def edge_moves() -> U32:
  602112

def edge_symmetries() -> U32:
  1228800

type Source is Data:
  MCorners{}
  MEdges{}

type Build is Type:
  H0MWork{corners: Array<U32>, edges: Array<U32>, meta: Array<U32>}
  H0MComplete{meta: Array<U32>}
  H0MFailed{index: U32, code: U32}

def copied_corner(read: Array<U32> & U32, edges: Array<U32>, meta: Array<U32>, target: U32) -> Build:
  match read:
    case Tuple{corners, value}: H0MWork{corners, edges, meta[target] <- value}

def copied_edge(read: Array<U32> & U32, corners: Array<U32>, meta: Array<U32>, target: U32) -> Build:
  match read:
    case Tuple{edges, value}: H0MWork{corners, edges, meta[target] <- value}

def copy(fuel: Nat, source: Source, +from: U32, +to: U32, +index: U32, state: Build) -> Build:
  match fuel source state:
    case 1n+p MCorners{} H0MWork{corners, edges, meta}: copy(p, MCorners{}, from, to, (index + 1 : U32), copied_corner(corners[(from + index : U32)], edges, meta, (to + index : U32)))
    case 1n+p MEdges{} H0MWork{corners, edges, meta}: copy(p, MEdges{}, from, to, (index + 1 : U32), copied_edge(edges[(from + index : U32)], corners, meta, (to + index : U32)))
    case _ _ state: state

def sparse_corner(value: Maybe<&2, H.Corner>, corners: Array<U32>, edges: Array<U32>, meta: Array<U32>, index: U32) -> Build:
  match value:
    case Some{corner}: copied_corner(corners[index], edges, meta, H.sparse_key(corner))
    case None{}: H0MFailed{index, 1}

def sparse(fuel: Nat, +index: U32, state: Build) -> Build:
  match fuel state:
    case 1n+p H0MWork{corners, edges, meta}: sparse(p, (index + 1 : U32), sparse_corner(H.from_index(index), corners, edges, meta, index))
    case _ state: state

def child_allowed(ok: Bool, corners: Array<U32>, edges: Array<U32>, meta: Array<U32>, +child: U32, index: U32) -> Build:
  match ok:
    case False{}: H0MFailed{index, 2}
    case True{}: copied_corner(corners[child], edges, meta, (corner_moves() + index : U32))

def move_corner(value: Maybe<&2, H.Corner>, corners: Array<U32>, edges: Array<U32>, meta: Array<U32>, +index: U32) -> Build:
  match value:
    case None{}: H0MFailed{index, 1}
    case Some{corner}:
      +child = H.index(H.transition(M.from_index((index % 18 : U32)), corner))
      child_allowed(U32.is_lt(child, H.size()), corners, edges, meta, child, index)

def move_rep(read: Array<U32> & U32, edges: Array<U32>, meta: Array<U32>, index: U32) -> Build:
  match read:
    case Tuple{corners, rep}: move_corner(H.from_index(rep), corners, edges, meta, index)

def fill_moves(fuel: Nat, +index: U32, state: Build) -> Build:
  match fuel state:
    case 1n+p H0MWork{corners, edges, meta}: fill_moves(p, (index + 1 : U32), move_rep(corners[(G.representatives() + index / 18 : U32)], edges, meta, index))
    case _ state: state

def header(ok: Bool, meta: Array<U32>, +class: U32) -> Build:
  match ok:
    case False{}: H0MFailed{0, 3}
    case True{}:
      meta[0] <- 1
      meta[1] <- G.count()
      meta[2] <- E.size()
      meta[3] <- count()
      meta[4] <- (class * E.size() + E.index(E.goal()) : U32)
      meta[5] <- words()
      meta[6] <- 48000001
      H0MComplete{meta}

def goal_read(read: Array<U32> & U32) -> Build:
  match read:
    case Tuple{meta, +value}:
      +class = (value .&. 65535 : U32)
      header(U32.is_lt(class, G.count()) && U32.is_eq((value >> 16n : U32), 0), meta, class)

def finished(state: Build) -> Build:
  match state:
    case H0MWork{corners, edges, meta}: goal_read(meta[H.sparse_key(H.goal())])
    case state: state

def copied(state: Build) -> Build:
  finished(fill_moves(61074n, 0, copy(1663200n, MEdges{}, T.sym_base(), edge_symmetries(), 0, copy(623700n, MEdges{}, T.moves_base(), edge_moves(), 0, copy(3393n, MCorners{}, G.stabilizers_hi(), stabilizers_hi(), 0, copy(3393n, MCorners{}, G.stabilizers_lo(), stabilizers_lo(), 0, copy(3393n, MCorners{}, G.representatives(), representatives(), 0, sparse(153090n, 0, state))))))))

def generate(corners: G.Audit, edges: T.Audit) -> Build:
  match corners edges:
    case G.ClassAudited{corners, 153090} T.E0Audited{edges}: copied(H0MWork{corners, edges, [4294967295 : U32^22n]})
    case _ _: H0MFailed{0, 4}

type Audit is Type:
  H0MAuditWork{actual: Array<U32>, expected: Array<U32>, checked: U32}
  H0MAudited{meta: Array<U32>}
  H0MAuditFailed{index: U32, code: U32}

def compared(ok: Bool, actual: Array<U32>, expected: Array<U32>, +index: U32) -> Audit:
  match ok:
    case False{}: H0MAuditFailed{index, 1}
    case True{}: H0MAuditWork{actual, expected, (index + 1 : U32)}

def expected_word(read: Array<U32> & U32, actual: Array<U32>, value: U32, index: U32) -> Audit:
  match read:
    case Tuple{expected, reference}: compared(U32.is_eq(value, reference), actual, expected, index)

def actual_word(read: Array<U32> & U32, expected: Array<U32>, +index: U32) -> Audit:
  match read:
    case Tuple{actual, value}: expected_word(expected[index], actual, value, index)

def compare(fuel: Nat, +index: U32, state: Audit) -> Audit:
  match fuel state:
    case 1n+p H0MAuditWork{actual, expected, checked}: compare(p, (index + 1 : U32), actual_word(actual[index], expected, index))
    case _ state: state

def audited(state: Audit) -> Audit:
  match state:
    case H0MAuditWork{actual, expected, 2892000}: H0MAudited{actual}
    case H0MAuditFailed{index, code}: H0MAuditFailed{index, code}
    case _: H0MAuditFailed{0, 2}

def expected_meta(state: Build, actual: Array<U32>) -> Audit:
  match state:
    case H0MComplete{expected}: audited(compare(2892000n, 0, H0MAuditWork{actual, expected, 0}))
    case _: H0MAuditFailed{0, 3}

def audit_sized(read: Array<U32> & U32, corners: G.Audit, edges: T.Audit) -> Audit:
  match read:
    case Tuple{actual, 4194304}: expected_meta(generate(corners, edges), actual)
    case _: H0MAuditFailed{0, 4}

def audit(actual: Array<U32>, corners: G.Audit, edges: T.Audit) -> Audit:
  audit_sized(Array.size(U32, actual), corners, edges)
