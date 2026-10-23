import Base
import ../src/model.bend as M

type Corner is Data:
  C00{}
  C01{}
  C02{}
  C10{}
  C11{}
  C12{}
  C20{}
  C21{}
  C22{}
  C30{}
  C31{}
  C32{}
  C40{}
  C41{}
  C42{}
  C50{}
  C51{}
  C52{}
  C60{}
  C61{}
  C62{}
  C70{}
  C71{}
  C72{}

type CornerColors is Data:
  CornerColors{a0: U32, a1: U32, a2: U32}

def corner_encode(state: Corner) -> CornerColors:
  match state:
    case C00{}: CornerColors{0, 1, 2}
    case C01{}: CornerColors{2, 0, 1}
    case C02{}: CornerColors{1, 2, 0}
    case C10{}: CornerColors{0, 2, 4}
    case C11{}: CornerColors{4, 0, 2}
    case C12{}: CornerColors{2, 4, 0}
    case C20{}: CornerColors{0, 4, 5}
    case C21{}: CornerColors{5, 0, 4}
    case C22{}: CornerColors{4, 5, 0}
    case C30{}: CornerColors{0, 5, 1}
    case C31{}: CornerColors{1, 0, 5}
    case C32{}: CornerColors{5, 1, 0}
    case C40{}: CornerColors{3, 2, 1}
    case C41{}: CornerColors{1, 3, 2}
    case C42{}: CornerColors{2, 1, 3}
    case C50{}: CornerColors{3, 4, 2}
    case C51{}: CornerColors{2, 3, 4}
    case C52{}: CornerColors{4, 2, 3}
    case C60{}: CornerColors{3, 5, 4}
    case C61{}: CornerColors{4, 3, 5}
    case C62{}: CornerColors{5, 4, 3}
    case C70{}: CornerColors{3, 1, 5}
    case C71{}: CornerColors{5, 3, 1}
    case C72{}: CornerColors{1, 5, 3}

def corner_decode(colors: CornerColors) -> Maybe<&2, Corner>:
  match colors:
    case CornerColors{0, 1, 2}: Some{C00{}}
    case CornerColors{2, 0, 1}: Some{C01{}}
    case CornerColors{1, 2, 0}: Some{C02{}}
    case CornerColors{0, 2, 4}: Some{C10{}}
    case CornerColors{4, 0, 2}: Some{C11{}}
    case CornerColors{2, 4, 0}: Some{C12{}}
    case CornerColors{0, 4, 5}: Some{C20{}}
    case CornerColors{5, 0, 4}: Some{C21{}}
    case CornerColors{4, 5, 0}: Some{C22{}}
    case CornerColors{0, 5, 1}: Some{C30{}}
    case CornerColors{1, 0, 5}: Some{C31{}}
    case CornerColors{5, 1, 0}: Some{C32{}}
    case CornerColors{3, 2, 1}: Some{C40{}}
    case CornerColors{1, 3, 2}: Some{C41{}}
    case CornerColors{2, 1, 3}: Some{C42{}}
    case CornerColors{3, 4, 2}: Some{C50{}}
    case CornerColors{2, 3, 4}: Some{C51{}}
    case CornerColors{4, 2, 3}: Some{C52{}}
    case CornerColors{3, 5, 4}: Some{C60{}}
    case CornerColors{4, 3, 5}: Some{C61{}}
    case CornerColors{5, 4, 3}: Some{C62{}}
    case CornerColors{3, 1, 5}: Some{C70{}}
    case CornerColors{5, 3, 1}: Some{C71{}}
    case CornerColors{1, 5, 3}: Some{C72{}}
    case _: None{}

def corner_recover(colors: CornerColors) -> Corner:
  match colors:
    case CornerColors{0, 1, 2}: C00{}
    case CornerColors{2, 0, 1}: C01{}
    case CornerColors{1, 2, 0}: C02{}
    case CornerColors{0, 2, 4}: C10{}
    case CornerColors{4, 0, 2}: C11{}
    case CornerColors{2, 4, 0}: C12{}
    case CornerColors{0, 4, 5}: C20{}
    case CornerColors{5, 0, 4}: C21{}
    case CornerColors{4, 5, 0}: C22{}
    case CornerColors{0, 5, 1}: C30{}
    case CornerColors{1, 0, 5}: C31{}
    case CornerColors{5, 1, 0}: C32{}
    case CornerColors{3, 2, 1}: C40{}
    case CornerColors{1, 3, 2}: C41{}
    case CornerColors{2, 1, 3}: C42{}
    case CornerColors{3, 4, 2}: C50{}
    case CornerColors{2, 3, 4}: C51{}
    case CornerColors{4, 2, 3}: C52{}
    case CornerColors{3, 5, 4}: C60{}
    case CornerColors{4, 3, 5}: C61{}
    case CornerColors{5, 4, 3}: C62{}
    case CornerColors{3, 1, 5}: C70{}
    case CornerColors{5, 3, 1}: C71{}
    case CornerColors{1, 5, 3}: C72{}
    case _: C00{}

def corner_decode_encoded(+state: Corner) -> { corner_decode(corner_encode(state)) == Some{state} : Maybe<&2, Corner>}:
  match state:
    case C00{}: {==}
    case C01{}: {==}
    case C02{}: {==}
    case C10{}: {==}
    case C11{}: {==}
    case C12{}: {==}
    case C20{}: {==}
    case C21{}: {==}
    case C22{}: {==}
    case C30{}: {==}
    case C31{}: {==}
    case C32{}: {==}
    case C40{}: {==}
    case C41{}: {==}
    case C42{}: {==}
    case C50{}: {==}
    case C51{}: {==}
    case C52{}: {==}
    case C60{}: {==}
    case C61{}: {==}
    case C62{}: {==}
    case C70{}: {==}
    case C71{}: {==}
    case C72{}: {==}

def corner_roundtrip(+state: Corner) -> {corner_recover(corner_encode(state)) == state : Corner}:
  match state:
    case C00{}: {==}
    case C01{}: {==}
    case C02{}: {==}
    case C10{}: {==}
    case C11{}: {==}
    case C12{}: {==}
    case C20{}: {==}
    case C21{}: {==}
    case C22{}: {==}
    case C30{}: {==}
    case C31{}: {==}
    case C32{}: {==}
    case C40{}: {==}
    case C41{}: {==}
    case C42{}: {==}
    case C50{}: {==}
    case C51{}: {==}
    case C52{}: {==}
    case C60{}: {==}
    case C61{}: {==}
    case C62{}: {==}
    case C70{}: {==}
    case C71{}: {==}
    case C72{}: {==}

def corner_injective(+a: Corner, +b: Corner, evidence: {corner_encode(a) == corner_encode(b) : CornerColors}) -> {a == b : Corner}:
  Equal.trans(Corner, a, corner_recover(corner_encode(a)), b, Equal.sym(Corner, corner_recover(corner_encode(a)), a, corner_roundtrip(a)), Equal.trans(Corner, corner_recover(corner_encode(a)), corner_recover(corner_encode(b)), b, Equal.cong(CornerColors, Corner, corner_recover, corner_encode(a), corner_encode(b), evidence), corner_roundtrip(b)))

def corner_rotate(state: Corner) -> Corner:
  match state:
    case C00{}: C01{}
    case C01{}: C02{}
    case C02{}: C00{}
    case C10{}: C11{}
    case C11{}: C12{}
    case C12{}: C10{}
    case C20{}: C21{}
    case C21{}: C22{}
    case C22{}: C20{}
    case C30{}: C31{}
    case C31{}: C32{}
    case C32{}: C30{}
    case C40{}: C41{}
    case C41{}: C42{}
    case C42{}: C40{}
    case C50{}: C51{}
    case C51{}: C52{}
    case C52{}: C50{}
    case C60{}: C61{}
    case C61{}: C62{}
    case C62{}: C60{}
    case C70{}: C71{}
    case C71{}: C72{}
    case C72{}: C70{}

def corner_colors_rotate(colors: CornerColors) -> CornerColors:
  match colors:
    case CornerColors{a0, a1, a2}: CornerColors{a2, a0, a1}

def corner_encode_rotate(+state: Corner) -> {corner_encode(corner_rotate(state)) == corner_colors_rotate(corner_encode(state)) : CornerColors}:
  match state:
    case C00{}: {==}
    case C01{}: {==}
    case C02{}: {==}
    case C10{}: {==}
    case C11{}: {==}
    case C12{}: {==}
    case C20{}: {==}
    case C21{}: {==}
    case C22{}: {==}
    case C30{}: {==}
    case C31{}: {==}
    case C32{}: {==}
    case C40{}: {==}
    case C41{}: {==}
    case C42{}: {==}
    case C50{}: {==}
    case C51{}: {==}
    case C52{}: {==}
    case C60{}: {==}
    case C61{}: {==}
    case C62{}: {==}
    case C70{}: {==}
    case C71{}: {==}
    case C72{}: {==}

def corner_cycle(+state: Corner) -> {corner_rotate(corner_rotate(corner_rotate(state))) == state : Corner}:
  match state:
    case C00{}: {==}
    case C01{}: {==}
    case C02{}: {==}
    case C10{}: {==}
    case C11{}: {==}
    case C12{}: {==}
    case C20{}: {==}
    case C21{}: {==}
    case C22{}: {==}
    case C30{}: {==}
    case C31{}: {==}
    case C32{}: {==}
    case C40{}: {==}
    case C41{}: {==}
    case C42{}: {==}
    case C50{}: {==}
    case C51{}: {==}
    case C52{}: {==}
    case C60{}: {==}
    case C61{}: {==}
    case C62{}: {==}
    case C70{}: {==}
    case C71{}: {==}
    case C72{}: {==}

def corner_index(state: Corner) -> U32:
  match state:
    case C00{}: 0
    case C01{}: 1
    case C02{}: 2
    case C10{}: 3
    case C11{}: 4
    case C12{}: 5
    case C20{}: 6
    case C21{}: 7
    case C22{}: 8
    case C30{}: 9
    case C31{}: 10
    case C32{}: 11
    case C40{}: 12
    case C41{}: 13
    case C42{}: 14
    case C50{}: 15
    case C51{}: 16
    case C52{}: 17
    case C60{}: 18
    case C61{}: 19
    case C62{}: 20
    case C70{}: 21
    case C71{}: 22
    case C72{}: 23

def corner_test_at(index: U32) -> Corner:
  match index:
    case 0: C00{}
    case 1: C01{}
    case 2: C02{}
    case 3: C10{}
    case 4: C11{}
    case 5: C12{}
    case 6: C20{}
    case 7: C21{}
    case 8: C22{}
    case 9: C30{}
    case 10: C31{}
    case 11: C32{}
    case 12: C40{}
    case 13: C41{}
    case 14: C42{}
    case 15: C50{}
    case 16: C51{}
    case 17: C52{}
    case 18: C60{}
    case 19: C61{}
    case 20: C62{}
    case 21: C70{}
    case 22: C71{}
    case _: C72{}

def corner_color0_read(colors: CornerColors) -> U32:
  match colors:
    case CornerColors{a0, a1, a2}: a0

def corner_color0(state: Corner) -> U32:
  corner_color0_read(corner_encode(state))

def corner_color1_read(colors: CornerColors) -> U32:
  match colors:
    case CornerColors{a0, a1, a2}: a1

def corner_color1(state: Corner) -> U32:
  corner_color1_read(corner_encode(state))

def corner_color2_read(colors: CornerColors) -> U32:
  match colors:
    case CornerColors{a0, a1, a2}: a2

def corner_color2(state: Corner) -> U32:
  corner_color2_read(corner_encode(state))

type Edge is Data:
  E00{}
  E01{}
  E10{}
  E11{}
  E20{}
  E21{}
  E30{}
  E31{}
  E40{}
  E41{}
  E50{}
  E51{}
  E60{}
  E61{}
  E70{}
  E71{}
  E80{}
  E81{}
  E90{}
  E91{}
  E100{}
  E101{}
  E110{}
  E111{}

type EdgeColors is Data:
  EdgeColors{a0: U32, a1: U32}

def edge_encode(state: Edge) -> EdgeColors:
  match state:
    case E00{}: EdgeColors{0, 1}
    case E01{}: EdgeColors{1, 0}
    case E10{}: EdgeColors{0, 2}
    case E11{}: EdgeColors{2, 0}
    case E20{}: EdgeColors{0, 4}
    case E21{}: EdgeColors{4, 0}
    case E30{}: EdgeColors{0, 5}
    case E31{}: EdgeColors{5, 0}
    case E40{}: EdgeColors{3, 1}
    case E41{}: EdgeColors{1, 3}
    case E50{}: EdgeColors{3, 2}
    case E51{}: EdgeColors{2, 3}
    case E60{}: EdgeColors{3, 4}
    case E61{}: EdgeColors{4, 3}
    case E70{}: EdgeColors{3, 5}
    case E71{}: EdgeColors{5, 3}
    case E80{}: EdgeColors{2, 1}
    case E81{}: EdgeColors{1, 2}
    case E90{}: EdgeColors{2, 4}
    case E91{}: EdgeColors{4, 2}
    case E100{}: EdgeColors{5, 4}
    case E101{}: EdgeColors{4, 5}
    case E110{}: EdgeColors{5, 1}
    case E111{}: EdgeColors{1, 5}

def edge_decode(colors: EdgeColors) -> Maybe<&2, Edge>:
  match colors:
    case EdgeColors{0, 1}: Some{E00{}}
    case EdgeColors{1, 0}: Some{E01{}}
    case EdgeColors{0, 2}: Some{E10{}}
    case EdgeColors{2, 0}: Some{E11{}}
    case EdgeColors{0, 4}: Some{E20{}}
    case EdgeColors{4, 0}: Some{E21{}}
    case EdgeColors{0, 5}: Some{E30{}}
    case EdgeColors{5, 0}: Some{E31{}}
    case EdgeColors{3, 1}: Some{E40{}}
    case EdgeColors{1, 3}: Some{E41{}}
    case EdgeColors{3, 2}: Some{E50{}}
    case EdgeColors{2, 3}: Some{E51{}}
    case EdgeColors{3, 4}: Some{E60{}}
    case EdgeColors{4, 3}: Some{E61{}}
    case EdgeColors{3, 5}: Some{E70{}}
    case EdgeColors{5, 3}: Some{E71{}}
    case EdgeColors{2, 1}: Some{E80{}}
    case EdgeColors{1, 2}: Some{E81{}}
    case EdgeColors{2, 4}: Some{E90{}}
    case EdgeColors{4, 2}: Some{E91{}}
    case EdgeColors{5, 4}: Some{E100{}}
    case EdgeColors{4, 5}: Some{E101{}}
    case EdgeColors{5, 1}: Some{E110{}}
    case EdgeColors{1, 5}: Some{E111{}}
    case _: None{}

def edge_recover(colors: EdgeColors) -> Edge:
  match colors:
    case EdgeColors{0, 1}: E00{}
    case EdgeColors{1, 0}: E01{}
    case EdgeColors{0, 2}: E10{}
    case EdgeColors{2, 0}: E11{}
    case EdgeColors{0, 4}: E20{}
    case EdgeColors{4, 0}: E21{}
    case EdgeColors{0, 5}: E30{}
    case EdgeColors{5, 0}: E31{}
    case EdgeColors{3, 1}: E40{}
    case EdgeColors{1, 3}: E41{}
    case EdgeColors{3, 2}: E50{}
    case EdgeColors{2, 3}: E51{}
    case EdgeColors{3, 4}: E60{}
    case EdgeColors{4, 3}: E61{}
    case EdgeColors{3, 5}: E70{}
    case EdgeColors{5, 3}: E71{}
    case EdgeColors{2, 1}: E80{}
    case EdgeColors{1, 2}: E81{}
    case EdgeColors{2, 4}: E90{}
    case EdgeColors{4, 2}: E91{}
    case EdgeColors{5, 4}: E100{}
    case EdgeColors{4, 5}: E101{}
    case EdgeColors{5, 1}: E110{}
    case EdgeColors{1, 5}: E111{}
    case _: E00{}

def edge_decode_encoded(+state: Edge) -> { edge_decode(edge_encode(state)) == Some{state} : Maybe<&2, Edge>}:
  match state:
    case E00{}: {==}
    case E01{}: {==}
    case E10{}: {==}
    case E11{}: {==}
    case E20{}: {==}
    case E21{}: {==}
    case E30{}: {==}
    case E31{}: {==}
    case E40{}: {==}
    case E41{}: {==}
    case E50{}: {==}
    case E51{}: {==}
    case E60{}: {==}
    case E61{}: {==}
    case E70{}: {==}
    case E71{}: {==}
    case E80{}: {==}
    case E81{}: {==}
    case E90{}: {==}
    case E91{}: {==}
    case E100{}: {==}
    case E101{}: {==}
    case E110{}: {==}
    case E111{}: {==}

def edge_roundtrip(+state: Edge) -> {edge_recover(edge_encode(state)) == state : Edge}:
  match state:
    case E00{}: {==}
    case E01{}: {==}
    case E10{}: {==}
    case E11{}: {==}
    case E20{}: {==}
    case E21{}: {==}
    case E30{}: {==}
    case E31{}: {==}
    case E40{}: {==}
    case E41{}: {==}
    case E50{}: {==}
    case E51{}: {==}
    case E60{}: {==}
    case E61{}: {==}
    case E70{}: {==}
    case E71{}: {==}
    case E80{}: {==}
    case E81{}: {==}
    case E90{}: {==}
    case E91{}: {==}
    case E100{}: {==}
    case E101{}: {==}
    case E110{}: {==}
    case E111{}: {==}

def edge_injective(+a: Edge, +b: Edge, evidence: {edge_encode(a) == edge_encode(b) : EdgeColors}) -> {a == b : Edge}:
  Equal.trans(Edge, a, edge_recover(edge_encode(a)), b, Equal.sym(Edge, edge_recover(edge_encode(a)), a, edge_roundtrip(a)), Equal.trans(Edge, edge_recover(edge_encode(a)), edge_recover(edge_encode(b)), b, Equal.cong(EdgeColors, Edge, edge_recover, edge_encode(a), edge_encode(b), evidence), edge_roundtrip(b)))

def edge_rotate(state: Edge) -> Edge:
  match state:
    case E00{}: E01{}
    case E01{}: E00{}
    case E10{}: E11{}
    case E11{}: E10{}
    case E20{}: E21{}
    case E21{}: E20{}
    case E30{}: E31{}
    case E31{}: E30{}
    case E40{}: E41{}
    case E41{}: E40{}
    case E50{}: E51{}
    case E51{}: E50{}
    case E60{}: E61{}
    case E61{}: E60{}
    case E70{}: E71{}
    case E71{}: E70{}
    case E80{}: E81{}
    case E81{}: E80{}
    case E90{}: E91{}
    case E91{}: E90{}
    case E100{}: E101{}
    case E101{}: E100{}
    case E110{}: E111{}
    case E111{}: E110{}

def edge_colors_rotate(colors: EdgeColors) -> EdgeColors:
  match colors:
    case EdgeColors{a0, a1}: EdgeColors{a1, a0}

def edge_encode_rotate(+state: Edge) -> {edge_encode(edge_rotate(state)) == edge_colors_rotate(edge_encode(state)) : EdgeColors}:
  match state:
    case E00{}: {==}
    case E01{}: {==}
    case E10{}: {==}
    case E11{}: {==}
    case E20{}: {==}
    case E21{}: {==}
    case E30{}: {==}
    case E31{}: {==}
    case E40{}: {==}
    case E41{}: {==}
    case E50{}: {==}
    case E51{}: {==}
    case E60{}: {==}
    case E61{}: {==}
    case E70{}: {==}
    case E71{}: {==}
    case E80{}: {==}
    case E81{}: {==}
    case E90{}: {==}
    case E91{}: {==}
    case E100{}: {==}
    case E101{}: {==}
    case E110{}: {==}
    case E111{}: {==}

def edge_cycle(+state: Edge) -> {edge_rotate(edge_rotate(state)) == state : Edge}:
  match state:
    case E00{}: {==}
    case E01{}: {==}
    case E10{}: {==}
    case E11{}: {==}
    case E20{}: {==}
    case E21{}: {==}
    case E30{}: {==}
    case E31{}: {==}
    case E40{}: {==}
    case E41{}: {==}
    case E50{}: {==}
    case E51{}: {==}
    case E60{}: {==}
    case E61{}: {==}
    case E70{}: {==}
    case E71{}: {==}
    case E80{}: {==}
    case E81{}: {==}
    case E90{}: {==}
    case E91{}: {==}
    case E100{}: {==}
    case E101{}: {==}
    case E110{}: {==}
    case E111{}: {==}

def edge_index(state: Edge) -> U32:
  match state:
    case E00{}: 0
    case E01{}: 1
    case E10{}: 2
    case E11{}: 3
    case E20{}: 4
    case E21{}: 5
    case E30{}: 6
    case E31{}: 7
    case E40{}: 8
    case E41{}: 9
    case E50{}: 10
    case E51{}: 11
    case E60{}: 12
    case E61{}: 13
    case E70{}: 14
    case E71{}: 15
    case E80{}: 16
    case E81{}: 17
    case E90{}: 18
    case E91{}: 19
    case E100{}: 20
    case E101{}: 21
    case E110{}: 22
    case E111{}: 23

def edge_test_at(index: U32) -> Edge:
  match index:
    case 0: E00{}
    case 1: E01{}
    case 2: E10{}
    case 3: E11{}
    case 4: E20{}
    case 5: E21{}
    case 6: E30{}
    case 7: E31{}
    case 8: E40{}
    case 9: E41{}
    case 10: E50{}
    case 11: E51{}
    case 12: E60{}
    case 13: E61{}
    case 14: E70{}
    case 15: E71{}
    case 16: E80{}
    case 17: E81{}
    case 18: E90{}
    case 19: E91{}
    case 20: E100{}
    case 21: E101{}
    case 22: E110{}
    case _: E111{}

def edge_color0_read(colors: EdgeColors) -> U32:
  match colors:
    case EdgeColors{a0, a1}: a0

def edge_color0(state: Edge) -> U32:
  edge_color0_read(edge_encode(state))

def edge_color1_read(colors: EdgeColors) -> U32:
  match colors:
    case EdgeColors{a0, a1}: a1

def edge_color1(state: Edge) -> U32:
  edge_color1_read(edge_encode(state))

type PieceCells is Data:
  PieceCells{c0: Corner, c1: Corner, c2: Corner, c3: Corner, c4: Corner, c5: Corner, c6: Corner, c7: Corner, e0: Edge, e1: Edge, e2: Edge, e3: Edge, e4: Edge, e5: Edge, e6: Edge, e7: Edge, e8: Edge, e9: Edge, e10: Edge, e11: Edge}

def turn(move: M.Move, cells: PieceCells) -> PieceCells:
  match move cells:
    case M.U{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c3, c0, c1, c2, c4, c5, c6, c7, e3, e0, e1, e2, e4, e5, e6, e7, e8, e9, e10, e11}
    case M.U2{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c2, c3, c0, c1, c4, c5, c6, c7, e2, e3, e0, e1, e4, e5, e6, e7, e8, e9, e10, e11}
    case M.Ui{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c1, c2, c3, c0, c4, c5, c6, c7, e1, e2, e3, e0, e4, e5, e6, e7, e8, e9, e10, e11}
    case M.R{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{corner_rotate(corner_rotate(c4)), c1, c2, corner_rotate(c0), corner_rotate(c7), c5, c6, corner_rotate(corner_rotate(c3)), e8, e1, e2, e3, e11, e5, e6, e7, e4, e9, e10, e0}
    case M.R2{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c7, c1, c2, c4, c3, c5, c6, c0, e4, e1, e2, e3, e0, e5, e6, e7, e11, e9, e10, e8}
    case M.Ri{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{corner_rotate(corner_rotate(c3)), c1, c2, corner_rotate(c7), corner_rotate(c0), c5, c6, corner_rotate(corner_rotate(c4)), e11, e1, e2, e3, e8, e5, e6, e7, e0, e9, e10, e4}
    case M.F{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{corner_rotate(c1), corner_rotate(corner_rotate(c5)), c2, c3, corner_rotate(corner_rotate(c0)), corner_rotate(c4), c6, c7, e0, edge_rotate(e9), e2, e3, e4, edge_rotate(e8), e6, e7, edge_rotate(e1), edge_rotate(e5), e10, e11}
    case M.F2{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c5, c4, c2, c3, c1, c0, c6, c7, e0, e5, e2, e3, e4, e1, e6, e7, e9, e8, e10, e11}
    case M.Fi{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{corner_rotate(c4), corner_rotate(corner_rotate(c0)), c2, c3, corner_rotate(corner_rotate(c5)), corner_rotate(c1), c6, c7, e0, edge_rotate(e8), e2, e3, e4, edge_rotate(e9), e6, e7, edge_rotate(e5), edge_rotate(e1), e10, e11}
    case M.D{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c0, c1, c2, c3, c5, c6, c7, c4, e0, e1, e2, e3, e5, e6, e7, e4, e8, e9, e10, e11}
    case M.D2{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c0, c1, c2, c3, c6, c7, c4, c5, e0, e1, e2, e3, e6, e7, e4, e5, e8, e9, e10, e11}
    case M.Di{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c0, c1, c2, c3, c7, c4, c5, c6, e0, e1, e2, e3, e7, e4, e5, e6, e8, e9, e10, e11}
    case M.L{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c0, corner_rotate(c2), corner_rotate(corner_rotate(c6)), c3, c4, corner_rotate(corner_rotate(c1)), corner_rotate(c5), c7, e0, e1, e10, e3, e4, e5, e9, e7, e8, e2, e6, e11}
    case M.L2{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c0, c6, c5, c3, c4, c2, c1, c7, e0, e1, e6, e3, e4, e5, e2, e7, e8, e10, e9, e11}
    case M.Li{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c0, corner_rotate(c5), corner_rotate(corner_rotate(c1)), c3, c4, corner_rotate(corner_rotate(c6)), corner_rotate(c2), c7, e0, e1, e9, e3, e4, e5, e10, e7, e8, e6, e2, e11}
    case M.B{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c0, c1, corner_rotate(c3), corner_rotate(corner_rotate(c7)), c4, c5, corner_rotate(corner_rotate(c2)), corner_rotate(c6), e0, e1, e2, edge_rotate(e11), e4, e5, e6, edge_rotate(e10), e8, e9, edge_rotate(e3), edge_rotate(e7)}
    case M.B2{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c0, c1, c7, c6, c4, c5, c3, c2, e0, e1, e2, e7, e4, e5, e6, e3, e8, e9, e11, e10}
    case M.Bi{} PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      PieceCells{c0, c1, corner_rotate(c6), corner_rotate(corner_rotate(c2)), c4, c5, corner_rotate(corner_rotate(c7)), corner_rotate(c3), e0, e1, e2, edge_rotate(e10), e4, e5, e6, edge_rotate(e11), e8, e9, edge_rotate(e7), edge_rotate(e3)}

def to_facelets(cells: PieceCells) -> M.Cube:
  match cells:
    case PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      M.Cube{corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6)}

def indices(cells: PieceCells) -> +List<U32>:
  match cells:
    case PieceCells{c0, c1, c2, c3, c4, c5, c6, c7, e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11}:
      [corner_index(c0), corner_index(c1), corner_index(c2), corner_index(c3), corner_index(c4), corner_index(c5), corner_index(c6), corner_index(c7), edge_index(e0), edge_index(e1), edge_index(e2), edge_index(e3), edge_index(e4), edge_index(e5), edge_index(e6), edge_index(e7), edge_index(e8), edge_index(e9), edge_index(e10), edge_index(e11)]

def test_facelets(c0: U32, c1: U32, c2: U32, c3: U32, c4: U32, c5: U32, c6: U32, c7: U32, e0: U32, e1: U32, e2: U32, e3: U32, e4: U32, e5: U32, e6: U32, e7: U32, e8: U32, e9: U32, e10: U32, e11: U32) -> M.Cube:
  to_facelets(PieceCells{corner_test_at(c0), corner_test_at(c1), corner_test_at(c2), corner_test_at(c3), corner_test_at(c4), corner_test_at(c5), corner_test_at(c6), corner_test_at(c7), edge_test_at(e0), edge_test_at(e1), edge_test_at(e2), edge_test_at(e3), edge_test_at(e4), edge_test_at(e5), edge_test_at(e6), edge_test_at(e7), edge_test_at(e8), edge_test_at(e9), edge_test_at(e10), edge_test_at(e11)})

def test_turn(move: U32, c0: U32, c1: U32, c2: U32, c3: U32, c4: U32, c5: U32, c6: U32, c7: U32, e0: U32, e1: U32, e2: U32, e3: U32, e4: U32, e5: U32, e6: U32, e7: U32, e8: U32, e9: U32, e10: U32, e11: U32) -> M.Cube:
  to_facelets(turn(M.from_index(move), PieceCells{corner_test_at(c0), corner_test_at(c1), corner_test_at(c2), corner_test_at(c3), corner_test_at(c4), corner_test_at(c5), corner_test_at(c6), corner_test_at(c7), edge_test_at(e0), edge_test_at(e1), edge_test_at(e2), edge_test_at(e3), edge_test_at(e4), edge_test_at(e5), edge_test_at(e6), edge_test_at(e7), edge_test_at(e8), edge_test_at(e9), edge_test_at(e10), edge_test_at(e11)}))

def test_indices(move: U32, c0: U32, c1: U32, c2: U32, c3: U32, c4: U32, c5: U32, c6: U32, c7: U32, e0: U32, e1: U32, e2: U32, e3: U32, e4: U32, e5: U32, e6: U32, e7: U32, e8: U32, e9: U32, e10: U32, e11: U32) -> +List<U32>:
  indices(turn(M.from_index(move), PieceCells{corner_test_at(c0), corner_test_at(c1), corner_test_at(c2), corner_test_at(c3), corner_test_at(c4), corner_test_at(c5), corner_test_at(c6), corner_test_at(c7), edge_test_at(e0), edge_test_at(e1), edge_test_at(e2), edge_test_at(e3), edge_test_at(e4), edge_test_at(e5), edge_test_at(e6), edge_test_at(e7), edge_test_at(e8), edge_test_at(e9), edge_test_at(e10), edge_test_at(e11)}))

def solved_cells() -> PieceCells:
  PieceCells{C00{}, C10{}, C20{}, C30{}, C40{}, C50{}, C60{}, C70{}, E00{}, E10{}, E20{}, E30{}, E40{}, E50{}, E60{}, E70{}, E80{}, E90{}, E100{}, E110{}}

def solved_refinement() -> {to_facelets(solved_cells()) == M.solved() : M.Cube}:
  {==}

def cube_ext(+a0: U32, +a1: U32, +a2: U32, +a3: U32, +a4: U32, +a5: U32, +a6: U32, +a7: U32, +a8: U32, +a9: U32, +a10: U32, +a11: U32, +a12: U32, +a13: U32, +a14: U32, +a15: U32, +a16: U32, +a17: U32, +a18: U32, +a19: U32, +a20: U32, +a21: U32, +a22: U32, +a23: U32, +a24: U32, +a25: U32, +a26: U32, +a27: U32, +a28: U32, +a29: U32, +a30: U32, +a31: U32, +a32: U32, +a33: U32, +a34: U32, +a35: U32, +a36: U32, +a37: U32, +a38: U32, +a39: U32, +a40: U32, +a41: U32, +a42: U32, +a43: U32, +a44: U32, +a45: U32, +a46: U32, +a47: U32, +a48: U32, +a49: U32, +a50: U32, +a51: U32, +a52: U32, +a53: U32, +b0: U32, +b1: U32, +b2: U32, +b3: U32, +b4: U32, +b5: U32, +b6: U32, +b7: U32, +b8: U32, +b9: U32, +b10: U32, +b11: U32, +b12: U32, +b13: U32, +b14: U32, +b15: U32, +b16: U32, +b17: U32, +b18: U32, +b19: U32, +b20: U32, +b21: U32, +b22: U32, +b23: U32, +b24: U32, +b25: U32, +b26: U32, +b27: U32, +b28: U32, +b29: U32, +b30: U32, +b31: U32, +b32: U32, +b33: U32, +b34: U32, +b35: U32, +b36: U32, +b37: U32, +b38: U32, +b39: U32, +b40: U32, +b41: U32, +b42: U32, +b43: U32, +b44: U32, +b45: U32, +b46: U32, +b47: U32, +b48: U32, +b49: U32, +b50: U32, +b51: U32, +b52: U32, +b53: U32, e0: {a0 == b0 : U32}, e1: {a1 == b1 : U32}, e2: {a2 == b2 : U32}, e3: {a3 == b3 : U32}, e4: {a4 == b4 : U32}, e5: {a5 == b5 : U32}, e6: {a6 == b6 : U32}, e7: {a7 == b7 : U32}, e8: {a8 == b8 : U32}, e9: {a9 == b9 : U32}, e10: {a10 == b10 : U32}, e11: {a11 == b11 : U32}, e12: {a12 == b12 : U32}, e13: {a13 == b13 : U32}, e14: {a14 == b14 : U32}, e15: {a15 == b15 : U32}, e16: {a16 == b16 : U32}, e17: {a17 == b17 : U32}, e18: {a18 == b18 : U32}, e19: {a19 == b19 : U32}, e20: {a20 == b20 : U32}, e21: {a21 == b21 : U32}, e22: {a22 == b22 : U32}, e23: {a23 == b23 : U32}, e24: {a24 == b24 : U32}, e25: {a25 == b25 : U32}, e26: {a26 == b26 : U32}, e27: {a27 == b27 : U32}, e28: {a28 == b28 : U32}, e29: {a29 == b29 : U32}, e30: {a30 == b30 : U32}, e31: {a31 == b31 : U32}, e32: {a32 == b32 : U32}, e33: {a33 == b33 : U32}, e34: {a34 == b34 : U32}, e35: {a35 == b35 : U32}, e36: {a36 == b36 : U32}, e37: {a37 == b37 : U32}, e38: {a38 == b38 : U32}, e39: {a39 == b39 : U32}, e40: {a40 == b40 : U32}, e41: {a41 == b41 : U32}, e42: {a42 == b42 : U32}, e43: {a43 == b43 : U32}, e44: {a44 == b44 : U32}, e45: {a45 == b45 : U32}, e46: {a46 == b46 : U32}, e47: {a47 == b47 : U32}, e48: {a48 == b48 : U32}, e49: {a49 == b49 : U32}, e50: {a50 == b50 : U32}, e51: {a51 == b51 : U32}, e52: {a52 == b52 : U32}, e53: {a53 == b53 : U32}) -> {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}:
  %e0 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{_, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e1 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, _, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e2 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, _, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e3 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, _, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e4 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, _, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e5 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, _, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e6 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, _, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e7 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, _, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e8 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, _, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e9 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, _, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e10 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, _, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e11 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, _, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e12 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, _, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e13 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, _, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e14 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, _, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e15 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, _, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e16 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, _, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e17 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, _, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e18 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, _, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e19 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, _, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e20 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, _, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e21 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, _, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e22 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, _, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e23 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, _, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e24 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, _, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e25 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, _, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e26 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, _, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e27 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, _, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e28 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, _, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e29 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, _, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e30 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, _, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e31 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, _, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e32 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, _, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e33 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, _, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e34 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, _, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e35 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, _, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e36 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, _, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e37 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, _, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e38 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, _, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e39 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, _, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e40 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, _, b41, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e41 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, _, b42, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e42 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, _, b43, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e43 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, _, b44, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e44 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, _, b45, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e45 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, _, b46, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e46 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, _, b47, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e47 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, _, b48, b49, b50, b51, b52, b53} : M.Cube}
  %e48 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, _, b49, b50, b51, b52, b53} : M.Cube}
  %e49 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, _, b50, b51, b52, b53} : M.Cube}
  %e50 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, _, b51, b52, b53} : M.Cube}
  %e51 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, _, b52, b53} : M.Cube}
  %e52 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, _, b53} : M.Cube}
  %e53 : {M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53} == M.Cube{a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, _} : M.Cube}
  {==}

def corner_project_1_0(+state: Corner) -> {corner_color0(corner_rotate(state)) == corner_color2(state) : U32}:
  match state:
    case C00{}: {==}
    case C01{}: {==}
    case C02{}: {==}
    case C10{}: {==}
    case C11{}: {==}
    case C12{}: {==}
    case C20{}: {==}
    case C21{}: {==}
    case C22{}: {==}
    case C30{}: {==}
    case C31{}: {==}
    case C32{}: {==}
    case C40{}: {==}
    case C41{}: {==}
    case C42{}: {==}
    case C50{}: {==}
    case C51{}: {==}
    case C52{}: {==}
    case C60{}: {==}
    case C61{}: {==}
    case C62{}: {==}
    case C70{}: {==}
    case C71{}: {==}
    case C72{}: {==}

def corner_project_1_1(+state: Corner) -> {corner_color1(corner_rotate(state)) == corner_color0(state) : U32}:
  match state:
    case C00{}: {==}
    case C01{}: {==}
    case C02{}: {==}
    case C10{}: {==}
    case C11{}: {==}
    case C12{}: {==}
    case C20{}: {==}
    case C21{}: {==}
    case C22{}: {==}
    case C30{}: {==}
    case C31{}: {==}
    case C32{}: {==}
    case C40{}: {==}
    case C41{}: {==}
    case C42{}: {==}
    case C50{}: {==}
    case C51{}: {==}
    case C52{}: {==}
    case C60{}: {==}
    case C61{}: {==}
    case C62{}: {==}
    case C70{}: {==}
    case C71{}: {==}
    case C72{}: {==}

def corner_project_1_2(+state: Corner) -> {corner_color2(corner_rotate(state)) == corner_color1(state) : U32}:
  match state:
    case C00{}: {==}
    case C01{}: {==}
    case C02{}: {==}
    case C10{}: {==}
    case C11{}: {==}
    case C12{}: {==}
    case C20{}: {==}
    case C21{}: {==}
    case C22{}: {==}
    case C30{}: {==}
    case C31{}: {==}
    case C32{}: {==}
    case C40{}: {==}
    case C41{}: {==}
    case C42{}: {==}
    case C50{}: {==}
    case C51{}: {==}
    case C52{}: {==}
    case C60{}: {==}
    case C61{}: {==}
    case C62{}: {==}
    case C70{}: {==}
    case C71{}: {==}
    case C72{}: {==}

def corner_project_2_0(+state: Corner) -> {corner_color0(corner_rotate(corner_rotate(state))) == corner_color1(state) : U32}:
  match state:
    case C00{}: {==}
    case C01{}: {==}
    case C02{}: {==}
    case C10{}: {==}
    case C11{}: {==}
    case C12{}: {==}
    case C20{}: {==}
    case C21{}: {==}
    case C22{}: {==}
    case C30{}: {==}
    case C31{}: {==}
    case C32{}: {==}
    case C40{}: {==}
    case C41{}: {==}
    case C42{}: {==}
    case C50{}: {==}
    case C51{}: {==}
    case C52{}: {==}
    case C60{}: {==}
    case C61{}: {==}
    case C62{}: {==}
    case C70{}: {==}
    case C71{}: {==}
    case C72{}: {==}

def corner_project_2_1(+state: Corner) -> {corner_color1(corner_rotate(corner_rotate(state))) == corner_color2(state) : U32}:
  match state:
    case C00{}: {==}
    case C01{}: {==}
    case C02{}: {==}
    case C10{}: {==}
    case C11{}: {==}
    case C12{}: {==}
    case C20{}: {==}
    case C21{}: {==}
    case C22{}: {==}
    case C30{}: {==}
    case C31{}: {==}
    case C32{}: {==}
    case C40{}: {==}
    case C41{}: {==}
    case C42{}: {==}
    case C50{}: {==}
    case C51{}: {==}
    case C52{}: {==}
    case C60{}: {==}
    case C61{}: {==}
    case C62{}: {==}
    case C70{}: {==}
    case C71{}: {==}
    case C72{}: {==}

def corner_project_2_2(+state: Corner) -> {corner_color2(corner_rotate(corner_rotate(state))) == corner_color0(state) : U32}:
  match state:
    case C00{}: {==}
    case C01{}: {==}
    case C02{}: {==}
    case C10{}: {==}
    case C11{}: {==}
    case C12{}: {==}
    case C20{}: {==}
    case C21{}: {==}
    case C22{}: {==}
    case C30{}: {==}
    case C31{}: {==}
    case C32{}: {==}
    case C40{}: {==}
    case C41{}: {==}
    case C42{}: {==}
    case C50{}: {==}
    case C51{}: {==}
    case C52{}: {==}
    case C60{}: {==}
    case C61{}: {==}
    case C62{}: {==}
    case C70{}: {==}
    case C71{}: {==}
    case C72{}: {==}

def edge_project_1_0(+state: Edge) -> {edge_color0(edge_rotate(state)) == edge_color1(state) : U32}:
  match state:
    case E00{}: {==}
    case E01{}: {==}
    case E10{}: {==}
    case E11{}: {==}
    case E20{}: {==}
    case E21{}: {==}
    case E30{}: {==}
    case E31{}: {==}
    case E40{}: {==}
    case E41{}: {==}
    case E50{}: {==}
    case E51{}: {==}
    case E60{}: {==}
    case E61{}: {==}
    case E70{}: {==}
    case E71{}: {==}
    case E80{}: {==}
    case E81{}: {==}
    case E90{}: {==}
    case E91{}: {==}
    case E100{}: {==}
    case E101{}: {==}
    case E110{}: {==}
    case E111{}: {==}

def edge_project_1_1(+state: Edge) -> {edge_color1(edge_rotate(state)) == edge_color0(state) : U32}:
  match state:
    case E00{}: {==}
    case E01{}: {==}
    case E10{}: {==}
    case E11{}: {==}
    case E20{}: {==}
    case E21{}: {==}
    case E30{}: {==}
    case E31{}: {==}
    case E40{}: {==}
    case E41{}: {==}
    case E50{}: {==}
    case E51{}: {==}
    case E60{}: {==}
    case E61{}: {==}
    case E70{}: {==}
    case E71{}: {==}
    case E80{}: {==}
    case E81{}: {==}
    case E90{}: {==}
    case E91{}: {==}
    case E100{}: {==}
    case E101{}: {==}
    case E110{}: {==}
    case E111{}: {==}

def move_refinement(+move: M.Move, +cells: PieceCells) -> {to_facelets(turn(move, cells)) == M.turn(move, to_facelets(cells)) : M.Cube}:
  match move cells:
    case M.U{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c1), edge_color0(e2), corner_color0(c2), edge_color0(e1), 0, edge_color0(e3), corner_color0(c0), edge_color0(e0), corner_color0(c3), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color0(c1), edge_color0(e2), corner_color0(c2), edge_color0(e1), 0, edge_color0(e3), corner_color0(c0), edge_color0(e0), corner_color0(c3), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.U2{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c0), edge_color0(e1), corner_color0(c1), edge_color0(e0), 0, edge_color0(e2), corner_color0(c3), edge_color0(e3), corner_color0(c2), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color0(c0), edge_color0(e1), corner_color0(c1), edge_color0(e0), 0, edge_color0(e2), corner_color0(c3), edge_color0(e3), corner_color0(c2), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.Ui{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c3), edge_color0(e0), corner_color0(c0), edge_color0(e3), 0, edge_color0(e1), corner_color0(c2), edge_color0(e2), corner_color0(c1), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color0(c3), edge_color0(e0), corner_color0(c0), edge_color0(e3), 0, edge_color0(e1), corner_color0(c2), edge_color0(e2), corner_color0(c1), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.R{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c2), edge_color0(e3), corner_color0(corner_rotate(c0)), edge_color0(e2), 0, edge_color0(e8), corner_color0(c1), edge_color0(e1), corner_color0(corner_rotate(corner_rotate(c4))), corner_color1(corner_rotate(corner_rotate(c4))), edge_color1(e8), corner_color2(corner_rotate(c0)), edge_color1(e4), 1, edge_color1(e0), corner_color2(corner_rotate(c7)), edge_color1(e11), corner_color1(corner_rotate(corner_rotate(c3))), corner_color1(c1), edge_color1(e1), corner_color2(corner_rotate(corner_rotate(c4))), edge_color0(e9), 2, edge_color0(e4), corner_color2(c5), edge_color1(e5), corner_color1(corner_rotate(c7)), corner_color0(c5), edge_color0(e5), corner_color0(corner_rotate(c7)), edge_color0(e6), 3, edge_color0(e11), corner_color0(c6), edge_color0(e7), corner_color0(corner_rotate(corner_rotate(c3))), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(corner_rotate(c0)), edge_color1(e3), corner_color2(c2), edge_color0(e0), 5, edge_color0(e10), corner_color2(corner_rotate(corner_rotate(c3))), edge_color1(e7), corner_color1(c6), corner_color0(c2), edge_color0(e3), corner_color2(c0), edge_color0(e2), 0, edge_color0(e8), corner_color0(c1), edge_color0(e1), corner_color1(c4), corner_color2(c4), edge_color1(e8), corner_color1(c0), edge_color1(e4), 1, edge_color1(e0), corner_color1(c7), edge_color1(e11), corner_color2(c3), corner_color1(c1), edge_color1(e1), corner_color0(c4), edge_color0(e9), 2, edge_color0(e4), corner_color2(c5), edge_color1(e5), corner_color0(c7), corner_color0(c5), edge_color0(e5), corner_color2(c7), edge_color0(e6), 3, edge_color0(e11), corner_color0(c6), edge_color0(e7), corner_color1(c3), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color0(c0), edge_color1(e3), corner_color2(c2), edge_color0(e0), 5, edge_color0(e10), corner_color0(c3), edge_color1(e7), corner_color1(c6), {==}, {==}, corner_project_1_0(c0), {==}, {==}, {==}, {==}, {==}, corner_project_2_0(c4), corner_project_2_1(c4), {==}, corner_project_1_2(c0), {==}, {==}, {==}, corner_project_1_2(c7), {==}, corner_project_2_1(c3), {==}, {==}, corner_project_2_2(c4), {==}, {==}, {==}, {==}, {==}, corner_project_1_1(c7), {==}, {==}, corner_project_1_0(c7), {==}, {==}, {==}, {==}, {==}, corner_project_2_0(c3), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, corner_project_1_1(c0), {==}, {==}, {==}, {==}, {==}, corner_project_2_2(c3), {==}, {==})
    case M.R2{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c2), edge_color0(e3), corner_color0(c4), edge_color0(e2), 0, edge_color0(e4), corner_color0(c1), edge_color0(e1), corner_color0(c7), corner_color1(c7), edge_color1(e4), corner_color2(c4), edge_color1(e11), 1, edge_color1(e8), corner_color2(c3), edge_color1(e0), corner_color1(c0), corner_color1(c1), edge_color1(e1), corner_color2(c7), edge_color0(e9), 2, edge_color0(e11), corner_color2(c5), edge_color1(e5), corner_color1(c3), corner_color0(c5), edge_color0(e5), corner_color0(c3), edge_color0(e6), 3, edge_color0(e0), corner_color0(c6), edge_color0(e7), corner_color0(c0), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(c4), edge_color1(e3), corner_color2(c2), edge_color0(e8), 5, edge_color0(e10), corner_color2(c0), edge_color1(e7), corner_color1(c6), corner_color0(c2), edge_color0(e3), corner_color0(c4), edge_color0(e2), 0, edge_color0(e4), corner_color0(c1), edge_color0(e1), corner_color0(c7), corner_color1(c7), edge_color1(e4), corner_color2(c4), edge_color1(e11), 1, edge_color1(e8), corner_color2(c3), edge_color1(e0), corner_color1(c0), corner_color1(c1), edge_color1(e1), corner_color2(c7), edge_color0(e9), 2, edge_color0(e11), corner_color2(c5), edge_color1(e5), corner_color1(c3), corner_color0(c5), edge_color0(e5), corner_color0(c3), edge_color0(e6), 3, edge_color0(e0), corner_color0(c6), edge_color0(e7), corner_color0(c0), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(c4), edge_color1(e3), corner_color2(c2), edge_color0(e8), 5, edge_color0(e10), corner_color2(c0), edge_color1(e7), corner_color1(c6), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.Ri{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c2), edge_color0(e3), corner_color0(corner_rotate(c7)), edge_color0(e2), 0, edge_color0(e11), corner_color0(c1), edge_color0(e1), corner_color0(corner_rotate(corner_rotate(c3))), corner_color1(corner_rotate(corner_rotate(c3))), edge_color1(e11), corner_color2(corner_rotate(c7)), edge_color1(e0), 1, edge_color1(e4), corner_color2(corner_rotate(c0)), edge_color1(e8), corner_color1(corner_rotate(corner_rotate(c4))), corner_color1(c1), edge_color1(e1), corner_color2(corner_rotate(corner_rotate(c3))), edge_color0(e9), 2, edge_color0(e0), corner_color2(c5), edge_color1(e5), corner_color1(corner_rotate(c0)), corner_color0(c5), edge_color0(e5), corner_color0(corner_rotate(c0)), edge_color0(e6), 3, edge_color0(e8), corner_color0(c6), edge_color0(e7), corner_color0(corner_rotate(corner_rotate(c4))), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(corner_rotate(c7)), edge_color1(e3), corner_color2(c2), edge_color0(e4), 5, edge_color0(e10), corner_color2(corner_rotate(corner_rotate(c4))), edge_color1(e7), corner_color1(c6), corner_color0(c2), edge_color0(e3), corner_color2(c7), edge_color0(e2), 0, edge_color0(e11), corner_color0(c1), edge_color0(e1), corner_color1(c3), corner_color2(c3), edge_color1(e11), corner_color1(c7), edge_color1(e0), 1, edge_color1(e4), corner_color1(c0), edge_color1(e8), corner_color2(c4), corner_color1(c1), edge_color1(e1), corner_color0(c3), edge_color0(e9), 2, edge_color0(e0), corner_color2(c5), edge_color1(e5), corner_color0(c0), corner_color0(c5), edge_color0(e5), corner_color2(c0), edge_color0(e6), 3, edge_color0(e8), corner_color0(c6), edge_color0(e7), corner_color1(c4), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color0(c7), edge_color1(e3), corner_color2(c2), edge_color0(e4), 5, edge_color0(e10), corner_color0(c4), edge_color1(e7), corner_color1(c6), {==}, {==}, corner_project_1_0(c7), {==}, {==}, {==}, {==}, {==}, corner_project_2_0(c3), corner_project_2_1(c3), {==}, corner_project_1_2(c7), {==}, {==}, {==}, corner_project_1_2(c0), {==}, corner_project_2_1(c4), {==}, {==}, corner_project_2_2(c3), {==}, {==}, {==}, {==}, {==}, corner_project_1_1(c0), {==}, {==}, corner_project_1_0(c0), {==}, {==}, {==}, {==}, {==}, corner_project_2_0(c4), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, corner_project_1_1(c7), {==}, {==}, {==}, {==}, {==}, corner_project_2_2(c4), {==}, {==})
    case M.F{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color0(corner_rotate(corner_rotate(c5))), edge_color0(edge_rotate(e9)), corner_color0(corner_rotate(c1)), corner_color1(corner_rotate(c1)), edge_color1(e0), corner_color2(c3), edge_color1(edge_rotate(e1)), 1, edge_color1(e11), corner_color2(corner_rotate(corner_rotate(c0))), edge_color1(e4), corner_color1(c7), corner_color1(corner_rotate(corner_rotate(c5))), edge_color1(edge_rotate(e9)), corner_color2(corner_rotate(c1)), edge_color0(edge_rotate(e5)), 2, edge_color0(edge_rotate(e1)), corner_color2(corner_rotate(c4)), edge_color1(edge_rotate(e8)), corner_color1(corner_rotate(corner_rotate(c0))), corner_color0(corner_rotate(c4)), edge_color0(edge_rotate(e8)), corner_color0(corner_rotate(corner_rotate(c0))), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c2), edge_color1(e2), corner_color2(corner_rotate(corner_rotate(c5))), edge_color1(e10), 4, edge_color1(edge_rotate(e5)), corner_color2(c6), edge_color1(e6), corner_color1(corner_rotate(c4)), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color1(c5), edge_color1(e9), corner_color2(c1), corner_color0(c1), edge_color1(e0), corner_color2(c3), edge_color0(e1), 1, edge_color1(e11), corner_color0(c0), edge_color1(e4), corner_color1(c7), corner_color2(c5), edge_color0(e9), corner_color1(c1), edge_color1(e5), 2, edge_color1(e1), corner_color1(c4), edge_color0(e8), corner_color2(c0), corner_color2(c4), edge_color1(e8), corner_color1(c0), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c2), edge_color1(e2), corner_color0(c5), edge_color1(e10), 4, edge_color0(e5), corner_color2(c6), edge_color1(e6), corner_color0(c4), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), {==}, {==}, {==}, {==}, {==}, {==}, corner_project_2_0(c5), edge_project_1_0(e9), corner_project_1_0(c1), corner_project_1_1(c1), {==}, {==}, edge_project_1_1(e1), {==}, {==}, corner_project_2_2(c0), {==}, {==}, corner_project_2_1(c5), edge_project_1_1(e9), corner_project_1_2(c1), edge_project_1_0(e5), {==}, edge_project_1_0(e1), corner_project_1_2(c4), edge_project_1_1(e8), corner_project_2_1(c0), corner_project_1_0(c4), edge_project_1_0(e8), corner_project_2_0(c0), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, corner_project_2_2(c5), {==}, {==}, edge_project_1_1(e5), {==}, {==}, corner_project_1_1(c4), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.F2{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color0(c4), edge_color0(e5), corner_color0(c5), corner_color1(c5), edge_color1(e0), corner_color2(c3), edge_color1(e9), 1, edge_color1(e11), corner_color2(c1), edge_color1(e4), corner_color1(c7), corner_color1(c4), edge_color1(e5), corner_color2(c5), edge_color0(e8), 2, edge_color0(e9), corner_color2(c0), edge_color1(e1), corner_color1(c1), corner_color0(c0), edge_color0(e1), corner_color0(c1), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c2), edge_color1(e2), corner_color2(c4), edge_color1(e10), 4, edge_color1(e8), corner_color2(c6), edge_color1(e6), corner_color1(c0), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color0(c4), edge_color0(e5), corner_color0(c5), corner_color1(c5), edge_color1(e0), corner_color2(c3), edge_color1(e9), 1, edge_color1(e11), corner_color2(c1), edge_color1(e4), corner_color1(c7), corner_color1(c4), edge_color1(e5), corner_color2(c5), edge_color0(e8), 2, edge_color0(e9), corner_color2(c0), edge_color1(e1), corner_color1(c1), corner_color0(c0), edge_color0(e1), corner_color0(c1), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c2), edge_color1(e2), corner_color2(c4), edge_color1(e10), 4, edge_color1(e8), corner_color2(c6), edge_color1(e6), corner_color1(c0), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.Fi{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color0(corner_rotate(corner_rotate(c0))), edge_color0(edge_rotate(e8)), corner_color0(corner_rotate(c4)), corner_color1(corner_rotate(c4)), edge_color1(e0), corner_color2(c3), edge_color1(edge_rotate(e5)), 1, edge_color1(e11), corner_color2(corner_rotate(corner_rotate(c5))), edge_color1(e4), corner_color1(c7), corner_color1(corner_rotate(corner_rotate(c0))), edge_color1(edge_rotate(e8)), corner_color2(corner_rotate(c4)), edge_color0(edge_rotate(e1)), 2, edge_color0(edge_rotate(e5)), corner_color2(corner_rotate(c1)), edge_color1(edge_rotate(e9)), corner_color1(corner_rotate(corner_rotate(c5))), corner_color0(corner_rotate(c1)), edge_color0(edge_rotate(e9)), corner_color0(corner_rotate(corner_rotate(c5))), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c2), edge_color1(e2), corner_color2(corner_rotate(corner_rotate(c0))), edge_color1(e10), 4, edge_color1(edge_rotate(e1)), corner_color2(c6), edge_color1(e6), corner_color1(corner_rotate(c1)), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color1(c0), edge_color1(e8), corner_color2(c4), corner_color0(c4), edge_color1(e0), corner_color2(c3), edge_color0(e5), 1, edge_color1(e11), corner_color0(c5), edge_color1(e4), corner_color1(c7), corner_color2(c0), edge_color0(e8), corner_color1(c4), edge_color1(e1), 2, edge_color1(e5), corner_color1(c1), edge_color0(e9), corner_color2(c5), corner_color2(c1), edge_color1(e9), corner_color1(c5), edge_color0(e6), 3, edge_color0(e4), corner_color0(c6), edge_color0(e7), corner_color0(c7), corner_color1(c2), edge_color1(e2), corner_color0(c0), edge_color1(e10), 4, edge_color0(e1), corner_color2(c6), edge_color1(e6), corner_color0(c1), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c7), edge_color1(e7), corner_color1(c6), {==}, {==}, {==}, {==}, {==}, {==}, corner_project_2_0(c0), edge_project_1_0(e8), corner_project_1_0(c4), corner_project_1_1(c4), {==}, {==}, edge_project_1_1(e5), {==}, {==}, corner_project_2_2(c5), {==}, {==}, corner_project_2_1(c0), edge_project_1_1(e8), corner_project_1_2(c4), edge_project_1_0(e1), {==}, edge_project_1_0(e5), corner_project_1_2(c1), edge_project_1_1(e9), corner_project_2_1(c5), corner_project_1_0(c1), edge_project_1_0(e9), corner_project_2_0(c5), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, corner_project_2_2(c0), {==}, {==}, edge_project_1_1(e1), {==}, {==}, corner_project_1_1(c1), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.D{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color0(c6), edge_color0(e6), corner_color0(c5), edge_color0(e7), 3, edge_color0(e5), corner_color0(c7), edge_color0(e4), corner_color0(c4), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color0(c6), edge_color0(e6), corner_color0(c5), edge_color0(e7), 3, edge_color0(e5), corner_color0(c7), edge_color0(e4), corner_color0(c4), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c4), edge_color1(e4), corner_color1(c7), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.D2{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color0(c7), edge_color0(e7), corner_color0(c6), edge_color0(e4), 3, edge_color0(e6), corner_color0(c4), edge_color0(e5), corner_color0(c5), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color0(c7), edge_color0(e7), corner_color0(c6), edge_color0(e4), 3, edge_color0(e6), corner_color0(c4), edge_color0(e5), corner_color0(c5), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c5), edge_color1(e5), corner_color1(c4), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.Di{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color0(c4), edge_color0(e4), corner_color0(c7), edge_color0(e5), 3, edge_color0(e7), corner_color0(c5), edge_color0(e6), corner_color0(c6), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c6), edge_color1(e6), corner_color1(c5), corner_color0(c2), edge_color0(e3), corner_color0(c3), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c7), edge_color1(e7), corner_color1(c6), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color0(c4), edge_color0(e4), corner_color0(c7), edge_color0(e5), 3, edge_color0(e7), corner_color0(c5), edge_color0(e6), corner_color0(c6), corner_color1(c2), edge_color1(e2), corner_color2(c1), edge_color1(e10), 4, edge_color1(e9), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color1(c3), edge_color1(e3), corner_color2(c2), edge_color0(e11), 5, edge_color0(e10), corner_color2(c6), edge_color1(e6), corner_color1(c5), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.L{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(corner_rotate(corner_rotate(c6))), edge_color0(e3), corner_color0(c3), edge_color0(e10), 0, edge_color0(e0), corner_color0(corner_rotate(c2)), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(corner_rotate(c2)), edge_color1(e1), corner_color2(c0), edge_color0(e2), 2, edge_color0(e8), corner_color2(corner_rotate(corner_rotate(c1))), edge_color1(e5), corner_color1(c4), corner_color0(corner_rotate(corner_rotate(c1))), edge_color0(e5), corner_color0(c4), edge_color0(e9), 3, edge_color0(e4), corner_color0(corner_rotate(c5)), edge_color0(e7), corner_color0(c7), corner_color1(corner_rotate(corner_rotate(c6))), edge_color1(e10), corner_color2(corner_rotate(c2)), edge_color1(e6), 4, edge_color1(e2), corner_color2(corner_rotate(c5)), edge_color1(e9), corner_color1(corner_rotate(corner_rotate(c1))), corner_color1(c3), edge_color1(e3), corner_color2(corner_rotate(corner_rotate(c6))), edge_color0(e11), 5, edge_color0(e6), corner_color2(c7), edge_color1(e7), corner_color1(corner_rotate(c5)), corner_color1(c6), edge_color0(e3), corner_color0(c3), edge_color0(e10), 0, edge_color0(e0), corner_color2(c2), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color0(c2), edge_color1(e1), corner_color2(c0), edge_color0(e2), 2, edge_color0(e8), corner_color0(c1), edge_color1(e5), corner_color1(c4), corner_color1(c1), edge_color0(e5), corner_color0(c4), edge_color0(e9), 3, edge_color0(e4), corner_color2(c5), edge_color0(e7), corner_color0(c7), corner_color2(c6), edge_color1(e10), corner_color1(c2), edge_color1(e6), 4, edge_color1(e2), corner_color1(c5), edge_color1(e9), corner_color2(c1), corner_color1(c3), edge_color1(e3), corner_color0(c6), edge_color0(e11), 5, edge_color0(e6), corner_color2(c7), edge_color1(e7), corner_color0(c5), corner_project_2_0(c6), {==}, {==}, {==}, {==}, {==}, corner_project_1_0(c2), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, corner_project_1_1(c2), {==}, {==}, {==}, {==}, {==}, corner_project_2_2(c1), {==}, {==}, corner_project_2_0(c1), {==}, {==}, {==}, {==}, {==}, corner_project_1_0(c5), {==}, {==}, corner_project_2_1(c6), {==}, corner_project_1_2(c2), {==}, {==}, {==}, corner_project_1_2(c5), {==}, corner_project_2_1(c1), {==}, {==}, corner_project_2_2(c6), {==}, {==}, {==}, {==}, {==}, corner_project_1_1(c5))
    case M.L2{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c5), edge_color0(e3), corner_color0(c3), edge_color0(e6), 0, edge_color0(e0), corner_color0(c6), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(c6), edge_color1(e1), corner_color2(c0), edge_color0(e10), 2, edge_color0(e8), corner_color2(c2), edge_color1(e5), corner_color1(c4), corner_color0(c2), edge_color0(e5), corner_color0(c4), edge_color0(e2), 3, edge_color0(e4), corner_color0(c1), edge_color0(e7), corner_color0(c7), corner_color1(c5), edge_color1(e6), corner_color2(c6), edge_color1(e9), 4, edge_color1(e10), corner_color2(c1), edge_color1(e2), corner_color1(c2), corner_color1(c3), edge_color1(e3), corner_color2(c5), edge_color0(e11), 5, edge_color0(e9), corner_color2(c7), edge_color1(e7), corner_color1(c1), corner_color0(c5), edge_color0(e3), corner_color0(c3), edge_color0(e6), 0, edge_color0(e0), corner_color0(c6), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(c6), edge_color1(e1), corner_color2(c0), edge_color0(e10), 2, edge_color0(e8), corner_color2(c2), edge_color1(e5), corner_color1(c4), corner_color0(c2), edge_color0(e5), corner_color0(c4), edge_color0(e2), 3, edge_color0(e4), corner_color0(c1), edge_color0(e7), corner_color0(c7), corner_color1(c5), edge_color1(e6), corner_color2(c6), edge_color1(e9), 4, edge_color1(e10), corner_color2(c1), edge_color1(e2), corner_color1(c2), corner_color1(c3), edge_color1(e3), corner_color2(c5), edge_color0(e11), 5, edge_color0(e9), corner_color2(c7), edge_color1(e7), corner_color1(c1), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.Li{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(corner_rotate(corner_rotate(c1))), edge_color0(e3), corner_color0(c3), edge_color0(e9), 0, edge_color0(e0), corner_color0(corner_rotate(c5)), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color1(corner_rotate(c5)), edge_color1(e1), corner_color2(c0), edge_color0(e6), 2, edge_color0(e8), corner_color2(corner_rotate(corner_rotate(c6))), edge_color1(e5), corner_color1(c4), corner_color0(corner_rotate(corner_rotate(c6))), edge_color0(e5), corner_color0(c4), edge_color0(e10), 3, edge_color0(e4), corner_color0(corner_rotate(c2)), edge_color0(e7), corner_color0(c7), corner_color1(corner_rotate(corner_rotate(c1))), edge_color1(e9), corner_color2(corner_rotate(c5)), edge_color1(e2), 4, edge_color1(e6), corner_color2(corner_rotate(c2)), edge_color1(e10), corner_color1(corner_rotate(corner_rotate(c6))), corner_color1(c3), edge_color1(e3), corner_color2(corner_rotate(corner_rotate(c1))), edge_color0(e11), 5, edge_color0(e2), corner_color2(c7), edge_color1(e7), corner_color1(corner_rotate(c2)), corner_color1(c1), edge_color0(e3), corner_color0(c3), edge_color0(e9), 0, edge_color0(e0), corner_color2(c5), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c3), edge_color1(e8), 1, edge_color1(e11), corner_color2(c4), edge_color1(e4), corner_color1(c7), corner_color0(c5), edge_color1(e1), corner_color2(c0), edge_color0(e6), 2, edge_color0(e8), corner_color0(c6), edge_color1(e5), corner_color1(c4), corner_color1(c6), edge_color0(e5), corner_color0(c4), edge_color0(e10), 3, edge_color0(e4), corner_color2(c2), edge_color0(e7), corner_color0(c7), corner_color2(c1), edge_color1(e9), corner_color1(c5), edge_color1(e2), 4, edge_color1(e6), corner_color1(c2), edge_color1(e10), corner_color2(c6), corner_color1(c3), edge_color1(e3), corner_color0(c1), edge_color0(e11), 5, edge_color0(e2), corner_color2(c7), edge_color1(e7), corner_color0(c2), corner_project_2_0(c1), {==}, {==}, {==}, {==}, {==}, corner_project_1_0(c5), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, corner_project_1_1(c5), {==}, {==}, {==}, {==}, {==}, corner_project_2_2(c6), {==}, {==}, corner_project_2_0(c6), {==}, {==}, {==}, {==}, {==}, corner_project_1_0(c2), {==}, {==}, corner_project_2_1(c1), {==}, corner_project_1_2(c5), {==}, {==}, {==}, corner_project_1_2(c2), {==}, corner_project_2_1(c6), {==}, {==}, corner_project_2_2(c1), {==}, {==}, {==}, {==}, {==}, corner_project_1_1(c2))
    case M.B{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(corner_rotate(c3)), edge_color0(edge_rotate(e11)), corner_color0(corner_rotate(corner_rotate(c7))), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(corner_rotate(corner_rotate(c7))), edge_color1(e8), 1, edge_color1(edge_rotate(e7)), corner_color2(c4), edge_color1(e4), corner_color1(corner_rotate(c6)), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color0(corner_rotate(corner_rotate(c2))), edge_color0(edge_rotate(e10)), corner_color0(corner_rotate(c6)), corner_color1(corner_rotate(c3)), edge_color1(e2), corner_color2(c1), edge_color1(edge_rotate(e3)), 4, edge_color1(e9), corner_color2(corner_rotate(corner_rotate(c2))), edge_color1(e6), corner_color1(c5), corner_color1(corner_rotate(corner_rotate(c7))), edge_color1(edge_rotate(e11)), corner_color2(corner_rotate(c3)), edge_color0(edge_rotate(e7)), 5, edge_color0(edge_rotate(e3)), corner_color2(corner_rotate(c6)), edge_color1(edge_rotate(e10)), corner_color1(corner_rotate(corner_rotate(c2))), corner_color2(c3), edge_color1(e11), corner_color1(c7), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color0(c7), edge_color1(e8), 1, edge_color0(e7), corner_color2(c4), edge_color1(e4), corner_color0(c6), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color1(c2), edge_color1(e10), corner_color2(c6), corner_color0(c3), edge_color1(e2), corner_color2(c1), edge_color0(e3), 4, edge_color1(e9), corner_color0(c2), edge_color1(e6), corner_color1(c5), corner_color2(c7), edge_color0(e11), corner_color1(c3), edge_color1(e7), 5, edge_color1(e3), corner_color1(c6), edge_color0(e10), corner_color2(c2), corner_project_1_0(c3), edge_project_1_0(e11), corner_project_2_0(c7), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, corner_project_2_2(c7), {==}, {==}, edge_project_1_1(e7), {==}, {==}, corner_project_1_1(c6), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, corner_project_2_0(c2), edge_project_1_0(e10), corner_project_1_0(c6), corner_project_1_1(c3), {==}, {==}, edge_project_1_1(e3), {==}, {==}, corner_project_2_2(c2), {==}, {==}, corner_project_2_1(c7), edge_project_1_1(e11), corner_project_1_2(c3), edge_project_1_0(e7), {==}, edge_project_1_0(e3), corner_project_1_2(c6), edge_project_1_1(e10), corner_project_2_1(c2))
    case M.B2{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(c7), edge_color0(e7), corner_color0(c6), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c6), edge_color1(e8), 1, edge_color1(e10), corner_color2(c4), edge_color1(e4), corner_color1(c2), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color0(c3), edge_color0(e3), corner_color0(c2), corner_color1(c7), edge_color1(e2), corner_color2(c1), edge_color1(e11), 4, edge_color1(e9), corner_color2(c3), edge_color1(e6), corner_color1(c5), corner_color1(c6), edge_color1(e7), corner_color2(c7), edge_color0(e10), 5, edge_color0(e11), corner_color2(c2), edge_color1(e3), corner_color1(c3), corner_color0(c7), edge_color0(e7), corner_color0(c6), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(c6), edge_color1(e8), 1, edge_color1(e10), corner_color2(c4), edge_color1(e4), corner_color1(c2), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color0(c3), edge_color0(e3), corner_color0(c2), corner_color1(c7), edge_color1(e2), corner_color2(c1), edge_color1(e11), 4, edge_color1(e9), corner_color2(c3), edge_color1(e6), corner_color1(c5), corner_color1(c6), edge_color1(e7), corner_color2(c7), edge_color0(e10), 5, edge_color0(e11), corner_color2(c2), edge_color1(e3), corner_color1(c3), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==})
    case M.Bi{} PieceCells{+c0, +c1, +c2, +c3, +c4, +c5, +c6, +c7, +e0, +e1, +e2, +e3, +e4, +e5, +e6, +e7, +e8, +e9, +e10, +e11}:
      cube_ext(corner_color0(corner_rotate(c6)), edge_color0(edge_rotate(e10)), corner_color0(corner_rotate(corner_rotate(c2))), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color2(corner_rotate(corner_rotate(c2))), edge_color1(e8), 1, edge_color1(edge_rotate(e3)), corner_color2(c4), edge_color1(e4), corner_color1(corner_rotate(c3)), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color0(corner_rotate(corner_rotate(c7))), edge_color0(edge_rotate(e11)), corner_color0(corner_rotate(c3)), corner_color1(corner_rotate(c6)), edge_color1(e2), corner_color2(c1), edge_color1(edge_rotate(e7)), 4, edge_color1(e9), corner_color2(corner_rotate(corner_rotate(c7))), edge_color1(e6), corner_color1(c5), corner_color1(corner_rotate(corner_rotate(c2))), edge_color1(edge_rotate(e10)), corner_color2(corner_rotate(c6)), edge_color0(edge_rotate(e3)), 5, edge_color0(edge_rotate(e7)), corner_color2(corner_rotate(c3)), edge_color1(edge_rotate(e11)), corner_color1(corner_rotate(corner_rotate(c7))), corner_color2(c6), edge_color1(e10), corner_color1(c2), edge_color0(e2), 0, edge_color0(e0), corner_color0(c1), edge_color0(e1), corner_color0(c0), corner_color1(c0), edge_color1(e0), corner_color0(c2), edge_color1(e8), 1, edge_color0(e3), corner_color2(c4), edge_color1(e4), corner_color0(c3), corner_color1(c1), edge_color1(e1), corner_color2(c0), edge_color0(e9), 2, edge_color0(e8), corner_color2(c5), edge_color1(e5), corner_color1(c4), corner_color0(c5), edge_color0(e5), corner_color0(c4), edge_color0(e6), 3, edge_color0(e4), corner_color1(c7), edge_color1(e11), corner_color2(c3), corner_color0(c6), edge_color1(e2), corner_color2(c1), edge_color0(e7), 4, edge_color1(e9), corner_color0(c7), edge_color1(e6), corner_color1(c5), corner_color2(c2), edge_color0(e10), corner_color1(c6), edge_color1(e3), 5, edge_color1(e7), corner_color1(c3), edge_color0(e11), corner_color2(c7), corner_project_1_0(c6), edge_project_1_0(e10), corner_project_2_0(c2), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, corner_project_2_2(c2), {==}, {==}, edge_project_1_1(e3), {==}, {==}, corner_project_1_1(c3), {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, {==}, corner_project_2_0(c7), edge_project_1_0(e11), corner_project_1_0(c3), corner_project_1_1(c6), {==}, {==}, edge_project_1_1(e7), {==}, {==}, corner_project_2_2(c7), {==}, {==}, corner_project_2_1(c2), edge_project_1_1(e10), corner_project_1_2(c6), edge_project_1_0(e3), {==}, edge_project_1_0(e7), corner_project_1_2(c3), edge_project_1_1(e11), corner_project_2_1(c7))

def replay(word: +List<M.Move>, cells: PieceCells) -> PieceCells:
  match word:
    case Nil{}: cells
    case Con{move, rest}: replay(rest, turn(move, cells))

def replay_refinement(+word: +List<M.Move>, +cells: PieceCells) -> {to_facelets(replay(word, cells)) == M.replay(word, to_facelets(cells)) : M.Cube}:
  match word:
    case Nil{}: {==}
    case Con{+move, +rest}:
      Equal.trans(M.Cube, to_facelets(replay(rest, turn(move, cells))), M.replay(rest, to_facelets(turn(move, cells))), M.replay(rest, M.turn(move, to_facelets(cells))), replay_refinement(rest, turn(move, cells)), Equal.cong(M.Cube, M.Cube, view => M.replay(rest, view), to_facelets(turn(move, cells)), M.turn(move, to_facelets(cells)), move_refinement(move, cells)))
