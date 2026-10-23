import Base
import ../src/cubie.bend as C
import ../src/coordinates.bend as Q
import ../src/search.bend as S

type Projection is Data:
  Projection{edges: U32, corners: U32}

def corner_mask_loop(fuel: Nat, +word: U32, +position: U32, mask: U32) -> U32:
  match fuel:
    case 0n: mask
    case 1n+rest:
      corner_mask_loop(rest, word, (position + 1 : U32), (mask .|. (C.pick(U32.is_lt(C.nib(word, position), 4), 1, 0) << U32.to_nat(position)) : U32))

def rank_mask_loop(fuel: Nat, +mask: U32, +position: U32, +selected: U32, rank: U32) -> U32:
  match fuel:
    case 0n: rank
    case 1n+rest:
      +flag = C.bit(mask, position)
      rank_mask_loop(rest, mask, (position + 1 : U32), (selected + flag : U32), (rank + flag * Q.choose(position, selected) : U32))

def corner_index(+word: U32) -> U32:
  (rank_mask_loop(8n, corner_mask_loop(8n, word, 0, 0), 0, 1, 0) * 2 + C.parity(8n, word, 0, 8, 0, 0) : U32)

def corner_word_loop(fuel: Nat, +mask: U32, +position: U32, +low: U32, +high: U32, word: U32) -> U32:
  match fuel:
    case 0n: word
    case 1n+rest:
      +flag = C.bit(mask, position)
      corner_word_loop(rest, mask, (position + 1 : U32), (low + flag : U32), (high + 1 - flag : U32), (word .|. (C.pick(U32.is_eq(flag, 1), low, high) << U32.to_nat((position * 4 : U32))) : U32))

def swap01_loop(fuel: Nat, +word: U32, +position: U32, +swap: Bool, result: U32) -> U32:
  match fuel:
    case 0n: result
    case 1n+rest:
      +value = C.nib(word, position)
      swap01_loop(rest, word, (position + 1 : U32), swap, (result .|. (C.pick(swap && U32.is_eq(value, 0), 1, C.pick(swap && U32.is_eq(value, 1), 0, value)) << U32.to_nat((position * 4 : U32))) : U32))

def corner_word(+index: U32) -> U32:
  +word = corner_word_loop(8n, Q.slice_mask_loop(8n, (index / 2 : U32), 4, 0), 0, 0, 4, 0)
  swap01_loop(8n, word, 0, U32.is_ne(C.parity(8n, word, 0, 8, 0, 0), (index % 2 : U32)), 0)

def decode_known(edges: U32, corners: U32) -> C.Cubie:
  +cp = corner_word(corners)
  +ep = Q.unrank8(edges)
  C.Cubie{cp, 0, ep, C.pick(U32.is_eq(C.parity(8n, cp, 0, 8, 0, 0), C.parity(8n, ep, 0, 8, 0, 0)), 47768, 47753), 0}

def decoded(ok: Bool, edges: U32, corners: U32) -> Maybe<&2, C.Cubie>:
  match ok:
    case True{}: Some{decode_known(edges, corners)}
    case False{}: None{}

def decode(+edges: U32, +corners: U32) -> Maybe<&2, C.Cubie>:
  decoded(U32.is_lt(edges, 40320) && U32.is_lt(corners, 140), edges, corners)

def encode_known(+cube: C.Cubie) -> Projection:
  match cube:
    case C.Cubie{cp, co, ep, eh, eo}: Projection{Q.encode(Q.Edges{}, cube), corner_index(cp)}

def projected(ok: Bool, cube: C.Cubie) -> Maybe<&2, Projection>:
  match ok:
    case True{}: Some{encode_known(cube)}
    case False{}: None{}

def project(goal: S.Goal, validation: C.Validation) -> Maybe<&2, Projection>:
  match goal validation:
    case S.Subgroup{} C.Valid{+cube}:
      projected(U32.is_eq(Q.encode(Q.Twist{}, cube), 0) && U32.is_eq(Q.encode(Q.Flip{}, cube), 0) && U32.is_eq(Q.encode(Q.Slice{}, cube), 0), cube)
    case _ _: None{}

def corner_from_cube(cube: C.Cubie) -> U32:
  match cube:
    case C.Cubie{cp, co, ep, eh, eo}: corner_index(cp)

def corner_next(index: U32, column: U32) -> U32:
  corner_from_cube(C.turn(Q.phase2_move(column), decode_known(0, index)))

def step_known(value: Projection, +column: U32) -> Projection:
  match value:
    case Projection{edges, corners}: Projection{Q.transition(Q.Edges{}, edges, column), corner_next(corners, column)}

def stepped(ok: Bool, value: Projection, column: U32) -> Maybe<&2, Projection>:
  match ok:
    case True{}: Some{step_known(value, column)}
    case False{}: None{}

def step(goal: S.Goal, value: Projection, +column: U32) -> Maybe<&2, Projection>:
  match goal value:
    case S.Subgroup{} Projection{+edges, +corners}:
      stepped(U32.is_lt(edges, 40320) && U32.is_lt(corners, 140) && U32.is_lt(column, 10), Projection{edges, corners}, column)
    case _ _: None{}

def projection_packet(value: Maybe<&2, Projection>) -> +List<U32>:
  match value:
    case Some{Projection{edges, corners}}: [1, edges, corners]
    case None{}: Nil{}

def cube_packet(value: Maybe<&2, C.Cubie>) -> +List<U32>:
  match value:
    case Some{C.Cubie{cp, co, ep, eh, eo}}: [1, cp, co, ep, eh, eo]
    case None{}: Nil{}

def same(a: C.Cubie, b: C.Cubie) -> Bool:
  match a b:
    case C.Cubie{cp, co, ep, eh, eo} C.Cubie{cp2, co2, ep2, eh2, eo2}:
      U32.is_eq(cp, cp2) && U32.is_eq(co, co2) && U32.is_eq(ep, ep2) && U32.is_eq(eh, eh2) && U32.is_eq(eo, eo2)

def normalized(ok: Bool, validation: C.Validation) -> C.Validation:
  match ok:
    case True{}: validation
    case False{}: C.Invalid{6}

def checked_cube(validation: C.Validation, raw: C.Cubie) -> C.Validation:
  match validation:
    case C.Valid{+cube}: normalized(same(cube, raw), C.Valid{cube})
    case invalid: invalid

def project_code(code: U32, validation: C.Validation) -> Maybe<&2, Projection>:
  match code:
    case 0: project(S.Reduction{}, validation)
    case 1: project(S.Subgroup{}, validation)
    case 2: project(S.FullCube{}, validation)
    case _: None{}

def test_project(code: U32, cp: U32, co: U32, ep: U32, eh: U32, eo: U32) -> +List<U32>:
  +cube = {C.Cubie{cp, co, ep, eh, eo} : C.Cubie}
  projection_packet(project_code(code, checked_cube(C.validate(C.to_facelets(cube)), cube)))

def test_decode(edges: U32, corners: U32) -> +List<U32>:
  cube_packet(decode(edges, corners))

def step_code(code: U32, value: Projection, column: U32) -> Maybe<&2, Projection>:
  match code:
    case 0: step(S.Reduction{}, value, column)
    case 1: step(S.Subgroup{}, value, column)
    case 2: step(S.FullCube{}, value, column)
    case _: None{}

def test_step(code: U32, edges: U32, corners: U32, column: U32) -> +List<U32>:
  projection_packet(step_code(code, Projection{edges, corners}, column))

def corner_checked(ok: Bool, index: U32, column: U32) -> U32:
  match ok:
    case True{}: corner_next(index, column)
    case False{}: 4294967295

def test_corner_next(+index: U32, +column: U32) -> U32:
  corner_checked(U32.is_lt(index, 140) && U32.is_lt(column, 10), index, column)

def test_corner_word(word: U32) -> U32:
  corner_index(word)

def checksum_loop(fuel: Nat, +index: U32, checksum: U32) -> U32:
  match fuel:
    case 0n: checksum
    case 1n+rest:
      checksum_loop(rest, (index + 1 : U32), (checksum * 33 + corner_next((index / 10 : U32), (index % 10 : U32)) + index : U32))

def test_checksum(seed: U32) -> U32:
  checksum_loop(1400n, 0, seed)
