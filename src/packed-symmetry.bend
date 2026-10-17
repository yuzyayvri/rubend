import Base
import ./cubie.bend as C

def corner_piece(+piece: U32) -> U32:
  C.nib(1445021488, piece)

def corner_delta(piece: U32) -> U32:
  (((8840 >> U32.to_nat((piece * 2 : U32))) .&. 3) : U32)

def edge_piece(+piece: U32) -> U32:
  C.nib(C.pick(U32.is_lt(piece, 8), 1781091080, 22321), (piece % 8 : U32))

def edge_delta(piece: U32) -> U32:
  (((3840 >> U32.to_nat((piece * 1 : U32))) .&. 1) : U32)

def rotate(cube: C.Cubie) -> C.Cubie:
  match cube:
    case C.Cubie{+cp, +co, +ep, +eh, +eo}:
      C.Cubie{(corner_piece(C.nib(cp, 0)) .|. (corner_piece(C.nib(cp, 4)) << 4n : U32) .|. (corner_piece(C.nib(cp, 5)) << 8n : U32) .|. (corner_piece(C.nib(cp, 1)) << 12n : U32) .|. (corner_piece(C.nib(cp, 3)) << 16n : U32) .|. (corner_piece(C.nib(cp, 7)) << 20n : U32) .|. (corner_piece(C.nib(cp, 6)) << 24n : U32) .|. (corner_piece(C.nib(cp, 2)) << 28n : U32) : U32), (((((co >> 0n) .&. 3 : U32) + corner_delta(C.nib(cp, 0)) + 0) % 3 : U32) .|. (((((co >> 8n) .&. 3 : U32) + corner_delta(C.nib(cp, 4)) + 1) % 3 : U32) << 2n : U32) .|. (((((co >> 10n) .&. 3 : U32) + corner_delta(C.nib(cp, 5)) + 0) % 3 : U32) << 4n : U32) .|. (((((co >> 2n) .&. 3 : U32) + corner_delta(C.nib(cp, 1)) + 1) % 3 : U32) << 6n : U32) .|. (((((co >> 6n) .&. 3 : U32) + corner_delta(C.nib(cp, 3)) + 1) % 3 : U32) << 8n : U32) .|. (((((co >> 14n) .&. 3 : U32) + corner_delta(C.nib(cp, 7)) + 0) % 3 : U32) << 10n : U32) .|. (((((co >> 12n) .&. 3 : U32) + corner_delta(C.nib(cp, 6)) + 1) % 3 : U32) << 12n : U32) .|. (((((co >> 4n) .&. 3 : U32) + corner_delta(C.nib(cp, 2)) + 0) % 3 : U32) << 14n : U32) : U32), (edge_piece(C.nib(ep, 1)) .|. (edge_piece(C.nib(eh, 0)) << 4n : U32) .|. (edge_piece(C.nib(ep, 5)) << 8n : U32) .|. (edge_piece(C.nib(eh, 1)) << 12n : U32) .|. (edge_piece(C.nib(ep, 3)) << 16n : U32) .|. (edge_piece(C.nib(eh, 3)) << 20n : U32) .|. (edge_piece(C.nib(ep, 7)) << 24n : U32) .|. (edge_piece(C.nib(eh, 2)) << 28n : U32) : U32), (edge_piece(C.nib(ep, 0)) .|. (edge_piece(C.nib(ep, 4)) << 4n : U32) .|. (edge_piece(C.nib(ep, 6)) << 8n : U32) .|. (edge_piece(C.nib(ep, 2)) << 12n : U32) : U32), ((((eo >> 1n) .&. 1 : U32) .^. edge_delta(C.nib(ep, 1)) .^. 0 : U32) .|. ((((eo >> 8n) .&. 1 : U32) .^. edge_delta(C.nib(eh, 0)) .^. 1 : U32) << 1n : U32) .|. ((((eo >> 5n) .&. 1 : U32) .^. edge_delta(C.nib(ep, 5)) .^. 0 : U32) << 2n : U32) .|. ((((eo >> 9n) .&. 1 : U32) .^. edge_delta(C.nib(eh, 1)) .^. 1 : U32) << 3n : U32) .|. ((((eo >> 3n) .&. 1 : U32) .^. edge_delta(C.nib(ep, 3)) .^. 0 : U32) << 4n : U32) .|. ((((eo >> 11n) .&. 1 : U32) .^. edge_delta(C.nib(eh, 3)) .^. 1 : U32) << 5n : U32) .|. ((((eo >> 7n) .&. 1 : U32) .^. edge_delta(C.nib(ep, 7)) .^. 0 : U32) << 6n : U32) .|. ((((eo >> 10n) .&. 1 : U32) .^. edge_delta(C.nib(eh, 2)) .^. 1 : U32) << 7n : U32) .|. ((((eo >> 0n) .&. 1 : U32) .^. edge_delta(C.nib(ep, 0)) .^. 0 : U32) << 8n : U32) .|. ((((eo >> 4n) .&. 1 : U32) .^. edge_delta(C.nib(ep, 4)) .^. 0 : U32) << 9n : U32) .|. ((((eo >> 6n) .&. 1 : U32) .^. edge_delta(C.nib(ep, 6)) .^. 0 : U32) << 10n : U32) .|. ((((eo >> 2n) .&. 1 : U32) .^. edge_delta(C.nib(ep, 2)) .^. 0 : U32) << 11n : U32) : U32)}
