import Base
import ./model.bend as M

def color(value: U32) -> U32:
  match value:
    case 0:
      1
    case 1:
      2
    case 2:
      0
    case 3:
      4
    case 4:
      5
    case 5:
      3
    case value:
      value

def rotate(cube: M.Cube) -> M.Cube:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{color(s24), color(s21), color(s18), color(s25), color(s22), color(s19), color(s26), color(s23), color(s20), color(s8), color(s7), color(s6), color(s5), color(s4), color(s3), color(s2), color(s1), color(s0), color(s15), color(s12), color(s9), color(s16), color(s13), color(s10), color(s17), color(s14), color(s11), color(s51), color(s48), color(s45), color(s52), color(s49), color(s46), color(s53), color(s50), color(s47), color(s27), color(s28), color(s29), color(s30), color(s31), color(s32), color(s33), color(s34), color(s35), color(s38), color(s41), color(s44), color(s37), color(s40), color(s43), color(s36), color(s39), color(s42)}

def rotate_move(move: M.Move) -> M.Move:
  match move:
    case M.U{}:
      M.R{}
    case M.U2{}:
      M.R2{}
    case M.Ui{}:
      M.Ri{}
    case M.R{}:
      M.F{}
    case M.R2{}:
      M.F2{}
    case M.Ri{}:
      M.Fi{}
    case M.F{}:
      M.U{}
    case M.F2{}:
      M.U2{}
    case M.Fi{}:
      M.Ui{}
    case M.D{}:
      M.L{}
    case M.D2{}:
      M.L2{}
    case M.Di{}:
      M.Li{}
    case M.L{}:
      M.B{}
    case M.L2{}:
      M.B2{}
    case M.Li{}:
      M.Bi{}
    case M.B{}:
      M.D{}
    case M.B2{}:
      M.D2{}
    case M.Bi{}:
      M.Di{}

def rotate_index(index: U32) -> U32:
  match index:
    case 0:
      3
    case 1:
      4
    case 2:
      5
    case 3:
      6
    case 4:
      7
    case 5:
      8
    case 6:
      0
    case 7:
      1
    case 8:
      2
    case 9:
      12
    case 10:
      13
    case 11:
      14
    case 12:
      15
    case 13:
      16
    case 14:
      17
    case 15:
      9
    case 16:
      10
    case 17:
      11
    case value:
      value

def view(axis: U32, +cube: M.Cube) -> M.Cube:
  match axis:
    case 0: cube
    case 1: rotate(cube)
    case _: rotate(rotate(cube))

def map_move(axis: U32, move: U32) -> U32:
  match axis:
    case 0: move
    case 1: rotate_index(move)
    case _: rotate_index(rotate_index(move))

def map_path(moves: +List<U32>, +axis: U32) -> +List<U32>:
  match moves:
    case Nil{}: Nil{}
    case Con{move, rest}: map_move(axis, move) <> map_path(rest, axis)

def invert_moves(moves: +List<U32>) -> +List<U32>:
  match moves:
    case Nil{}: Nil{}
    case Con{+move, rest}: ((move / 3) * 3 + 2 - move % 3 : U32) <> invert_moves(rest)

def maybe_inverse(enabled: Bool, moves: +List<U32>) -> +List<U32>:
  match enabled:
    case False{}: moves
    case True{}: invert_moves(List.reverse(&2, U32, moves))

def to_local(+variant: U32, moves: +List<U32>) -> +List<U32>:
  map_path(maybe_inverse(U32.is_ge(variant, 3), moves), (variant % 3 : U32))

def to_global(+variant: U32, moves: +List<U32>) -> +List<U32>:
  maybe_inverse(U32.is_ge(variant, 3), map_path(moves, ((3 - variant % 3) % 3 : U32)))

law commutes:
  for +move: M.Move
  for +cube: M.Cube
  {rotate(M.turn(move, cube)) == M.turn(rotate_move(move), rotate(cube)) : M.Cube}

def commutes(move, cube):
  match move cube:
    case M.U{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.U2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Ui{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.R{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.R2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Ri{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.F{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.F2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Fi{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.D{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.D2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Di{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.L{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.L2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Li{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.B{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.B2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Bi{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}

law solved_fixed:
  {rotate(M.solved()) == M.solved() : M.Cube}

def solved_fixed():
  {==}

def finish_move(move: M.Move) -> Bool:
  match move:
    case M.U{}:
      True{}
    case M.U2{}:
      True{}
    case M.Ui{}:
      True{}
    case M.R{}:
      False{}
    case M.R2{}:
      True{}
    case M.Ri{}:
      False{}
    case M.F{}:
      False{}
    case M.F2{}:
      True{}
    case M.Fi{}:
      False{}
    case M.D{}:
      True{}
    case M.D2{}:
      True{}
    case M.Di{}:
      True{}
    case M.L{}:
      False{}
    case M.L2{}:
      True{}
    case M.Li{}:
      False{}
    case M.B{}:
      False{}
    case M.B2{}:
      True{}
    case M.Bi{}:
      False{}

def ud_color(value: U32) -> U32:
  match value:
    case 0:
      0
    case 1:
      2
    case 2:
      4
    case 3:
      3
    case 4:
      5
    case 5:
      1
    case value: value

def ud(cube: M.Cube) -> M.Cube:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{ud_color(s6), ud_color(s3), ud_color(s0), ud_color(s7), ud_color(s4), ud_color(s1), ud_color(s8), ud_color(s5), ud_color(s2), ud_color(s45), ud_color(s46), ud_color(s47), ud_color(s48), ud_color(s49), ud_color(s50), ud_color(s51), ud_color(s52), ud_color(s53), ud_color(s9), ud_color(s10), ud_color(s11), ud_color(s12), ud_color(s13), ud_color(s14), ud_color(s15), ud_color(s16), ud_color(s17), ud_color(s29), ud_color(s32), ud_color(s35), ud_color(s28), ud_color(s31), ud_color(s34), ud_color(s27), ud_color(s30), ud_color(s33), ud_color(s18), ud_color(s19), ud_color(s20), ud_color(s21), ud_color(s22), ud_color(s23), ud_color(s24), ud_color(s25), ud_color(s26), ud_color(s36), ud_color(s37), ud_color(s38), ud_color(s39), ud_color(s40), ud_color(s41), ud_color(s42), ud_color(s43), ud_color(s44)}

def ud_move(move: M.Move) -> M.Move:
  match move:
    case M.U{}:
      M.U{}
    case M.U2{}:
      M.U2{}
    case M.Ui{}:
      M.Ui{}
    case M.R{}:
      M.F{}
    case M.R2{}:
      M.F2{}
    case M.Ri{}:
      M.Fi{}
    case M.F{}:
      M.L{}
    case M.F2{}:
      M.L2{}
    case M.Fi{}:
      M.Li{}
    case M.D{}:
      M.D{}
    case M.D2{}:
      M.D2{}
    case M.Di{}:
      M.Di{}
    case M.L{}:
      M.B{}
    case M.L2{}:
      M.B2{}
    case M.Li{}:
      M.Bi{}
    case M.B{}:
      M.R{}
    case M.B2{}:
      M.R2{}
    case M.Bi{}:
      M.Ri{}

law ud_commutes:
  for +move: M.Move
  for +cube: M.Cube
  {ud(M.turn(move, cube)) == M.turn(ud_move(move), ud(cube)) : M.Cube}

def ud_commutes(move, cube):
  match move cube:
    case M.U{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.U2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Ui{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.R{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.R2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Ri{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.F{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.F2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Fi{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.D{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.D2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Di{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.L{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.L2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Li{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.B{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.B2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Bi{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}

law ud_solved_fixed:
  {ud(M.solved()) == M.solved() : M.Cube}

def ud_solved_fixed():
  {==}

law ud_finish_moves_closed:
  for +move: M.Move
  {finish_move(ud_move(move)) == finish_move(move) : Bool}

def ud_finish_moves_closed(move):
  match move:
    case M.U{}:
      {==}
    case M.U2{}:
      {==}
    case M.Ui{}:
      {==}
    case M.R{}:
      {==}
    case M.R2{}:
      {==}
    case M.Ri{}:
      {==}
    case M.F{}:
      {==}
    case M.F2{}:
      {==}
    case M.Fi{}:
      {==}
    case M.D{}:
      {==}
    case M.D2{}:
      {==}
    case M.Di{}:
      {==}
    case M.L{}:
      {==}
    case M.L2{}:
      {==}
    case M.Li{}:
      {==}
    case M.B{}:
      {==}
    case M.B2{}:
      {==}
    case M.Bi{}:
      {==}

def flip_color(value: U32) -> U32:
  match value:
    case 0:
      3
    case 1:
      1
    case 2:
      5
    case 3:
      0
    case 4:
      4
    case 5:
      2
    case value: value

def flip(cube: M.Cube) -> M.Cube:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{flip_color(s27), flip_color(s28), flip_color(s29), flip_color(s30), flip_color(s31), flip_color(s32), flip_color(s33), flip_color(s34), flip_color(s35), flip_color(s17), flip_color(s16), flip_color(s15), flip_color(s14), flip_color(s13), flip_color(s12), flip_color(s11), flip_color(s10), flip_color(s9), flip_color(s53), flip_color(s52), flip_color(s51), flip_color(s50), flip_color(s49), flip_color(s48), flip_color(s47), flip_color(s46), flip_color(s45), flip_color(s0), flip_color(s1), flip_color(s2), flip_color(s3), flip_color(s4), flip_color(s5), flip_color(s6), flip_color(s7), flip_color(s8), flip_color(s44), flip_color(s43), flip_color(s42), flip_color(s41), flip_color(s40), flip_color(s39), flip_color(s38), flip_color(s37), flip_color(s36), flip_color(s26), flip_color(s25), flip_color(s24), flip_color(s23), flip_color(s22), flip_color(s21), flip_color(s20), flip_color(s19), flip_color(s18)}

def flip_move(move: M.Move) -> M.Move:
  match move:
    case M.U{}:
      M.D{}
    case M.U2{}:
      M.D2{}
    case M.Ui{}:
      M.Di{}
    case M.R{}:
      M.R{}
    case M.R2{}:
      M.R2{}
    case M.Ri{}:
      M.Ri{}
    case M.F{}:
      M.B{}
    case M.F2{}:
      M.B2{}
    case M.Fi{}:
      M.Bi{}
    case M.D{}:
      M.U{}
    case M.D2{}:
      M.U2{}
    case M.Di{}:
      M.Ui{}
    case M.L{}:
      M.L{}
    case M.L2{}:
      M.L2{}
    case M.Li{}:
      M.Li{}
    case M.B{}:
      M.F{}
    case M.B2{}:
      M.F2{}
    case M.Bi{}:
      M.Fi{}

law flip_commutes:
  for +move: M.Move
  for +cube: M.Cube
  {flip(M.turn(move, cube)) == M.turn(flip_move(move), flip(cube)) : M.Cube}

def flip_commutes(move, cube):
  match move cube:
    case M.U{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.U2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Ui{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.R{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.R2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Ri{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.F{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.F2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Fi{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.D{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.D2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Di{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.L{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.L2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Li{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.B{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.B2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}
    case M.Bi{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      {==}

law flip_solved_fixed:
  {flip(M.solved()) == M.solved() : M.Cube}

def flip_solved_fixed():
  {==}

law flip_finish_moves_closed:
  for +move: M.Move
  {finish_move(flip_move(move)) == finish_move(move) : Bool}

def flip_finish_moves_closed(move):
  match move:
    case M.U{}:
      {==}
    case M.U2{}:
      {==}
    case M.Ui{}:
      {==}
    case M.R{}:
      {==}
    case M.R2{}:
      {==}
    case M.Ri{}:
      {==}
    case M.F{}:
      {==}
    case M.F2{}:
      {==}
    case M.Fi{}:
      {==}
    case M.D{}:
      {==}
    case M.D2{}:
      {==}
    case M.Di{}:
      {==}
    case M.L{}:
      {==}
    case M.L2{}:
      {==}
    case M.Li{}:
      {==}
    case M.B{}:
      {==}
    case M.B2{}:
      {==}
    case M.Bi{}:
      {==}
