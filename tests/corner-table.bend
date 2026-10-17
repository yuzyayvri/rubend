import Base
import ../src/corner-table.bend as G

def audit_code(state: G.Audit, expected: U32) -> Bool:
  match state:
    case G.CornerAuditFailed{index, move, code}: U32.is_eq(code, expected)
    case _: False{}

def self_moves(fuel: Nat, +at: U32, moves: Array<U32>) -> Array<U32>:
  match fuel:
    case 0n: moves
    case 1n+p:
      moves[(18 + at : U32)] <- 1
      self_moves(p, (at + 1 : U32), moves)

def mutation(state: G.Build, kind: U32) -> Bool:
  match state kind:
    case G.CornerComplete{moves, table, count, maximum} 0:
      audit_code(G.audit(G.CornerComplete{moves, G.put(table, 0, 255), count, maximum}, G.Permutation{}), 3)
    case G.CornerComplete{moves, table, count, maximum} 1:
      audit_code(G.audit(G.CornerComplete{moves, G.put(table, 0, 1), count, maximum}, G.Permutation{}), 3)
    case G.CornerComplete{moves, table, count, maximum} 2:
      audit_code(G.audit(G.CornerComplete{moves, G.put(table, 1, 0), count, maximum}, G.Permutation{}), 3)
    case G.CornerComplete{moves, table, count, maximum} 3:
      audit_code(G.audit(G.CornerComplete{moves, G.put(table, 1, 254), count, maximum}, G.Permutation{}), 1)
    case G.CornerComplete{moves, table, count, maximum} 4:
      audit_code(G.audit(G.CornerComplete{self_moves(18n, 0, moves), table, count, maximum}, G.Permutation{}), 4)
    case G.CornerComplete{moves, table, count, maximum} 5:
      moves[0] <- 40320
      audit_code(G.audit(G.CornerComplete{moves, table, count, maximum}, G.Permutation{}), 2)
    case G.CornerComplete{moves, table, count, maximum} 6:
      audit_code(G.audit(G.CornerComplete{moves, table, (count - 1 : U32), maximum}, G.Permutation{}), 5)
    case _ _: False{}

def mutations(fuel: Nat, +kind: U32) -> Bool:
  match fuel:
    case 0n: True{}
    case 1n+p: mutation(G.generate(G.transitions(), G.Permutation{}), kind) && mutations(p, (kind + 1 : U32))

def failed(state: G.Build) -> Bool:
  match state:
    case G.CornerFailed{}: True{}
    case _: False{}

def depth_guard() -> Bool:
  failed(G.step(G.CornerWork{G.transitions(), G.put([4294967295 : U32^14n], 0, 0), [0 : U32^16n], 0, 1, 0, 0, 0, 254, 254}, G.Permutation{}))

def queue_guard() -> Bool:
  failed(G.step(G.CornerWork{G.transitions(), G.put([4294967295 : U32^14n], 0, 0), [0 : U32^16n], 0, 40320, 0, 0, 0, 0, 0}, G.Permutation{}))

def node_guard() -> Bool:
  queue = [0 : U32^16n]
  queue[0] <- 40320
  failed(G.step(G.CornerReady{G.transitions(), G.put([4294967295 : U32^14n], 0, 0), queue, 0, 1, 0}, G.Permutation{}))

def checks() -> Bool:
  mutations(7n, 0) && depth_guard() && queue_guard() && node_guard() &&
  failed(G.start([0 : U32^0n], G.Permutation{})) &&
  audit_code(G.audit(G.start(G.transitions(), G.Permutation{}), G.Permutation{}), 5)

def report(ok: Bool) -> IO(Unit):
  match ok:
    case True{}: IO.print("{\"passed\":true,\"auditMutations\":7,\"builderGuards\":4,\"partialAuditRejected\":true}")
    case False{}: IO.die(Unit, 2, "Corner table rejecting fixtures failed")

def main() -> IO(Unit):
  report(checks())
