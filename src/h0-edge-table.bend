import Base
import ./h0-edges.bend as E
import ./model.bend as M
import ./cubie.bend as C
import ./symmetry48.bend as S

def moves_base() -> U32:
  65536

def sym_base() -> U32:
  1048576

def word(edge: E.Edge) -> U32:
  match edge:
    case E.Edge{word}: word

def canonical_valid(value: C.Validation, +edge: E.Edge, +index: U32) -> U32:
  match value:
    case C.Valid{cube}: C.pick(U32.is_eq(E.index(E.project(cube)), index) && U32.is_eq(E.index(edge), index), word(edge), 4294967295)
    case C.Invalid{code}: 4294967295

def canonical(value: Maybe<&2, E.Edge>, index: U32) -> U32:
  match value:
    case Some{+edge}: canonical_valid(C.validate(C.to_facelets(E.representative(edge))), edge, index)
    case None{}: 4294967295

def fill_words(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[index] <- canonical(E.from_index(index), index)
      fill_words(p, table, (index + 1 : U32))

def moved(value: Maybe<&2, E.Edge>, move: U32) -> U32:
  match value:
    case Some{edge}: E.index(E.transition(M.from_index(move), edge))
    case None{}: 4294967295

def fill_moves(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[(moves_base() + index : U32)] <- moved(E.from_index((index / 18 : U32)), (index % 18 : U32))
      fill_moves(p, table, (index + 1 : U32))

def transformed(value: Maybe<&2, E.Edge>) -> U32:
  match value:
    case Some{edge}: E.index(edge)
    case None{}: 4294967295

def transform(selected: Maybe<&2, S.Symmetry>, value: Maybe<&2, E.Edge>) -> U32:
  match selected value:
    case Some{sym} Some{edge}: transformed(E.reference_transform(sym, edge))
    case _ _: 4294967295

def fill_symmetries(fuel: Nat, table: Array<U32>, +index: U32) -> Array<U32>:
  match fuel:
    case 0n: table
    case 1n+p:
      table[(sym_base() + index : U32)] <- transform(S.from_index((index % 48 : U32)), E.from_index((index / 48 : U32)))
      fill_symmetries(p, table, (index + 1 : U32))

def generate() -> Array<U32>:
  fill_symmetries(1663200n, fill_moves(623700n, fill_words(34650n, [4294967295 : U32^22n], 0), 0), 0)

type Audit is Type:
  E0Work{table: Array<U32>, checked: U32}
  E0Audited{table: Array<U32>}
  E0Failed{index: U32, code: U32}

def checked(ok: Bool, table: Array<U32>, +index: U32, code: U32) -> Audit:
  match ok:
    case False{}: E0Failed{index, code}
    case True{}: E0Work{table, (index + 1 : U32)}

def codec_parsed(value: Maybe<&2, E.Edge>, table: Array<U32>, +index: U32) -> Audit:
  match value:
    case Some{edge}: checked(U32.is_eq(E.index(edge), index), table, index, 1)
    case None{}: E0Failed{index, 1}

def codec_read(read: Array<U32> & U32, index: U32) -> Audit:
  match read:
    case Tuple{table, value}: codec_parsed(E.from_word(value), table, index)

def codecs(fuel: Nat, +index: U32, state: Audit) -> Audit:
  match fuel state:
    case 1n+p E0Work{table, count}: codecs(p, (index + 1 : U32), codec_read(table[index], index))
    case _ state: state

def inverse_checked(read: Array<U32> & U32, +index: U32, source: U32) -> Audit:
  match read:
    case Tuple{table, value}: checked(U32.is_eq(value, source), table, index, 3)

def move_range(ok: Bool, table: Array<U32>, +index: U32, target: U32) -> Audit:
  match ok:
    case False{}: E0Failed{index, 2}
    case True{}:
      inverse = (index % 18 / 3 * 3 + 2 - index % 3 : U32)
      inverse_checked(table[(moves_base() + target * 18 + inverse : U32)], index, (index / 18 : U32))

def move_read(read: Array<U32> & U32, index: U32) -> Audit:
  match read:
    case Tuple{table, +target}: move_range(U32.is_lt(target, E.size()), table, index, target)

def moves(fuel: Nat, +index: U32, state: Audit) -> Audit:
  match fuel state:
    case 1n+p E0Work{table, count}: moves(p, (index + 1 : U32), move_read(table[(moves_base() + index : U32)], index))
    case _ state: state

def inverse_sym(selected: Maybe<&2, S.Symmetry>, table: Array<U32>, +index: U32, target: U32) -> Audit:
  match selected:
    case None{}: E0Failed{index, 4}
    case Some{sym}: inverse_checked(table[(sym_base() + target * 48 + S.index(S.inverse(sym)) : U32)], index, (index / 48 : U32))

def sym_range(ok: Bool, table: Array<U32>, +index: U32, target: U32) -> Audit:
  match ok:
    case False{}: E0Failed{index, 2}
    case True{}: inverse_sym(S.from_index((index % 48 : U32)), table, index, target)

def sym_read(read: Array<U32> & U32, index: U32) -> Audit:
  match read:
    case Tuple{table, +target}: sym_range(U32.is_lt(target, E.size()), table, index, target)

def symmetries(fuel: Nat, +index: U32, state: Audit) -> Audit:
  match fuel state:
    case 1n+p E0Work{table, count}: symmetries(p, (index + 1 : U32), sym_read(table[(sym_base() + index : U32)], index))
    case _ state: state

def commute_checked(read: Array<U32> & U32, +index: U32, left: U32) -> Audit:
  match read:
    case Tuple{table, right}: checked(U32.is_eq(left, right), table, index, 5)

def commute_selected(selected: Maybe<&2, S.Symmetry>, table: Array<U32>, +index: U32, left: U32, source: U32) -> Audit:
  match selected:
    case None{}: E0Failed{index, 4}
    case Some{sym}: commute_checked(table[(moves_base() + source * 18 + M.index(S.map_move(sym, M.from_index((index % 18 : U32)))) : U32)], index, left)

def commute_right(read: Array<U32> & U32, +index: U32, left: U32) -> Audit:
  match read:
    case Tuple{table, source}: commute_selected(S.from_index((index / 18 % 48 : U32)), table, index, left, source)

def commute_left(read: Array<U32> & U32, +index: U32) -> Audit:
  match read:
    case Tuple{table, left}: commute_right(table[(sym_base() + index / 864 * 48 + index / 18 % 48 : U32)], index, left)

def commute_move(read: Array<U32> & U32, +index: U32) -> Audit:
  match read:
    case Tuple{table, target}: commute_left(table[(sym_base() + target * 48 + index / 18 % 48 : U32)], index)

def commutations(fuel: Nat, +index: U32, state: Audit) -> Audit:
  match fuel state:
    case 1n+p E0Work{table, count}: commutations(p, (index + 1 : U32), commute_move(table[(moves_base() + index / 864 * 18 + index % 18 : U32)], index))
    case _ state: state

def final(state: Audit) -> Audit:
  match state:
    case E0Work{table, 29937600}: E0Audited{table}
    case E0Failed{index, code}: E0Failed{index, code}
    case _: E0Failed{0, 6}

def audit_sized(read: Array<U32> & U32) -> Audit:
  match read:
    case Tuple{table, 4194304}: final(commutations(29937600n, 0, symmetries(1663200n, 0, moves(623700n, 0, codecs(34650n, 0, E0Work{table, 0})))))
    case _: E0Failed{0, 7}

def audit(table: Array<U32>) -> Audit:
  audit_sized(Array.size(U32, table))
