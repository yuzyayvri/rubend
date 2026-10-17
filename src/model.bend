import Base

type Move is Data:
  U{}
  U2{}
  Ui{}
  R{}
  R2{}
  Ri{}
  F{}
  F2{}
  Fi{}
  D{}
  D2{}
  Di{}
  L{}
  L2{}
  Li{}
  B{}
  B2{}
  Bi{}

type Cube is Data:
  Cube{s0: U32, s1: U32, s2: U32, s3: U32, s4: U32, s5: U32, s6: U32, s7: U32, s8: U32, s9: U32, s10: U32, s11: U32, s12: U32, s13: U32, s14: U32, s15: U32, s16: U32, s17: U32, s18: U32, s19: U32, s20: U32, s21: U32, s22: U32, s23: U32, s24: U32, s25: U32, s26: U32, s27: U32, s28: U32, s29: U32, s30: U32, s31: U32, s32: U32, s33: U32, s34: U32, s35: U32, s36: U32, s37: U32, s38: U32, s39: U32, s40: U32, s41: U32, s42: U32, s43: U32, s44: U32, s45: U32, s46: U32, s47: U32, s48: U32, s49: U32, s50: U32, s51: U32, s52: U32, s53: U32}

def solved() -> Cube:
  Cube{0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5}

def turn_U(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s6, s3, s0, s7, s4, s1, s8, s5, s2, s45, s46, s47, s12, s13, s14, s15, s16, s17, s9, s10, s11, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s18, s19, s20, s39, s40, s41, s42, s43, s44, s36, s37, s38, s48, s49, s50, s51, s52, s53}

def turn_U2(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s8, s7, s6, s5, s4, s3, s2, s1, s0, s36, s37, s38, s12, s13, s14, s15, s16, s17, s45, s46, s47, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s9, s10, s11, s39, s40, s41, s42, s43, s44, s18, s19, s20, s48, s49, s50, s51, s52, s53}

def turn_Ui(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s2, s5, s8, s1, s4, s7, s0, s3, s6, s18, s19, s20, s12, s13, s14, s15, s16, s17, s36, s37, s38, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s45, s46, s47, s39, s40, s41, s42, s43, s44, s9, s10, s11, s48, s49, s50, s51, s52, s53}

def turn_R(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s0, s1, s20, s3, s4, s23, s6, s7, s26, s15, s12, s9, s16, s13, s10, s17, s14, s11, s18, s19, s29, s21, s22, s32, s24, s25, s35, s27, s28, s51, s30, s31, s48, s33, s34, s45, s36, s37, s38, s39, s40, s41, s42, s43, s44, s8, s46, s47, s5, s49, s50, s2, s52, s53}

def turn_R2(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s0, s1, s29, s3, s4, s32, s6, s7, s35, s17, s16, s15, s14, s13, s12, s11, s10, s9, s18, s19, s51, s21, s22, s48, s24, s25, s45, s27, s28, s2, s30, s31, s5, s33, s34, s8, s36, s37, s38, s39, s40, s41, s42, s43, s44, s26, s46, s47, s23, s49, s50, s20, s52, s53}

def turn_Ri(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s0, s1, s51, s3, s4, s48, s6, s7, s45, s11, s14, s17, s10, s13, s16, s9, s12, s15, s18, s19, s2, s21, s22, s5, s24, s25, s8, s27, s28, s20, s30, s31, s23, s33, s34, s26, s36, s37, s38, s39, s40, s41, s42, s43, s44, s35, s46, s47, s32, s49, s50, s29, s52, s53}

def turn_F(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s0, s1, s2, s3, s4, s5, s44, s41, s38, s6, s10, s11, s7, s13, s14, s8, s16, s17, s24, s21, s18, s25, s22, s19, s26, s23, s20, s15, s12, s9, s30, s31, s32, s33, s34, s35, s36, s37, s27, s39, s40, s28, s42, s43, s29, s45, s46, s47, s48, s49, s50, s51, s52, s53}

def turn_F2(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s0, s1, s2, s3, s4, s5, s29, s28, s27, s44, s10, s11, s41, s13, s14, s38, s16, s17, s26, s25, s24, s23, s22, s21, s20, s19, s18, s8, s7, s6, s30, s31, s32, s33, s34, s35, s36, s37, s15, s39, s40, s12, s42, s43, s9, s45, s46, s47, s48, s49, s50, s51, s52, s53}

def turn_Fi(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s0, s1, s2, s3, s4, s5, s9, s12, s15, s29, s10, s11, s28, s13, s14, s27, s16, s17, s20, s23, s26, s19, s22, s25, s18, s21, s24, s38, s41, s44, s30, s31, s32, s33, s34, s35, s36, s37, s8, s39, s40, s7, s42, s43, s6, s45, s46, s47, s48, s49, s50, s51, s52, s53}

def turn_D(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s24, s25, s26, s18, s19, s20, s21, s22, s23, s42, s43, s44, s33, s30, s27, s34, s31, s28, s35, s32, s29, s36, s37, s38, s39, s40, s41, s51, s52, s53, s45, s46, s47, s48, s49, s50, s15, s16, s17}

def turn_D2(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s42, s43, s44, s18, s19, s20, s21, s22, s23, s51, s52, s53, s35, s34, s33, s32, s31, s30, s29, s28, s27, s36, s37, s38, s39, s40, s41, s15, s16, s17, s45, s46, s47, s48, s49, s50, s24, s25, s26}

def turn_Di(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s51, s52, s53, s18, s19, s20, s21, s22, s23, s15, s16, s17, s29, s32, s35, s28, s31, s34, s27, s30, s33, s36, s37, s38, s39, s40, s41, s24, s25, s26, s45, s46, s47, s48, s49, s50, s42, s43, s44}

def turn_L(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s53, s1, s2, s50, s4, s5, s47, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s0, s19, s20, s3, s22, s23, s6, s25, s26, s18, s28, s29, s21, s31, s32, s24, s34, s35, s42, s39, s36, s43, s40, s37, s44, s41, s38, s45, s46, s33, s48, s49, s30, s51, s52, s27}

def turn_L2(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s27, s1, s2, s30, s4, s5, s33, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s53, s19, s20, s50, s22, s23, s47, s25, s26, s0, s28, s29, s3, s31, s32, s6, s34, s35, s44, s43, s42, s41, s40, s39, s38, s37, s36, s45, s46, s24, s48, s49, s21, s51, s52, s18}

def turn_Li(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s18, s1, s2, s21, s4, s5, s24, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s27, s19, s20, s30, s22, s23, s33, s25, s26, s53, s28, s29, s50, s31, s32, s47, s34, s35, s38, s41, s44, s37, s40, s43, s36, s39, s42, s45, s46, s6, s48, s49, s3, s51, s52, s0}

def turn_B(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s11, s14, s17, s3, s4, s5, s6, s7, s8, s9, s10, s35, s12, s13, s34, s15, s16, s33, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s36, s39, s42, s2, s37, s38, s1, s40, s41, s0, s43, s44, s51, s48, s45, s52, s49, s46, s53, s50, s47}

def turn_B2(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s35, s34, s33, s3, s4, s5, s6, s7, s8, s9, s10, s42, s12, s13, s39, s15, s16, s36, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s2, s1, s0, s17, s37, s38, s14, s40, s41, s11, s43, s44, s53, s52, s51, s50, s49, s48, s47, s46, s45}

def turn_Bi(cube: Cube) -> Cube:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      Cube{s42, s39, s36, s3, s4, s5, s6, s7, s8, s9, s10, s0, s12, s13, s1, s15, s16, s2, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s17, s14, s11, s33, s37, s38, s34, s40, s41, s35, s43, s44, s47, s50, s53, s46, s49, s52, s45, s48, s51}

def turn(move: Move, cube: Cube) -> Cube:
  match move:
    case U{}:
      turn_U(cube)
    case U2{}:
      turn_U2(cube)
    case Ui{}:
      turn_Ui(cube)
    case R{}:
      turn_R(cube)
    case R2{}:
      turn_R2(cube)
    case Ri{}:
      turn_Ri(cube)
    case F{}:
      turn_F(cube)
    case F2{}:
      turn_F2(cube)
    case Fi{}:
      turn_Fi(cube)
    case D{}:
      turn_D(cube)
    case D2{}:
      turn_D2(cube)
    case Di{}:
      turn_Di(cube)
    case L{}:
      turn_L(cube)
    case L2{}:
      turn_L2(cube)
    case Li{}:
      turn_Li(cube)
    case B{}:
      turn_B(cube)
    case B2{}:
      turn_B2(cube)
    case Bi{}:
      turn_Bi(cube)

def inverse(move: Move) -> Move:
  match move:
    case U{}:
      Ui{}
    case U2{}:
      U2{}
    case Ui{}:
      U{}
    case R{}:
      Ri{}
    case R2{}:
      R2{}
    case Ri{}:
      R{}
    case F{}:
      Fi{}
    case F2{}:
      F2{}
    case Fi{}:
      F{}
    case D{}:
      Di{}
    case D2{}:
      D2{}
    case Di{}:
      D{}
    case L{}:
      Li{}
    case L2{}:
      L2{}
    case Li{}:
      L{}
    case B{}:
      Bi{}
    case B2{}:
      B2{}
    case Bi{}:
      B{}

def index(move: Move) -> U32:
  match move:
    case U{}:
      0
    case U2{}:
      1
    case Ui{}:
      2
    case R{}:
      3
    case R2{}:
      4
    case Ri{}:
      5
    case F{}:
      6
    case F2{}:
      7
    case Fi{}:
      8
    case D{}:
      9
    case D2{}:
      10
    case Di{}:
      11
    case L{}:
      12
    case L2{}:
      13
    case Li{}:
      14
    case B{}:
      15
    case B2{}:
      16
    case Bi{}:
      17

def from_index(index: U32) -> Move:
  match index:
    case 0:
      U{}
    case 1:
      U2{}
    case 2:
      Ui{}
    case 3:
      R{}
    case 4:
      R2{}
    case 5:
      Ri{}
    case 6:
      F{}
    case 7:
      F2{}
    case 8:
      Fi{}
    case 9:
      D{}
    case 10:
      D2{}
    case 11:
      Di{}
    case 12:
      L{}
    case 13:
      L2{}
    case 14:
      Li{}
    case 15:
      B{}
    case 16:
      B2{}
    case 17:
      Bi{}
    case _:
      U{}

def show_move(move: Move) -> String:
  match move:
    case U{}:
      "U"
    case U2{}:
      "U2"
    case Ui{}:
      "U'"
    case R{}:
      "R"
    case R2{}:
      "R2"
    case Ri{}:
      "R'"
    case F{}:
      "F"
    case F2{}:
      "F2"
    case Fi{}:
      "F'"
    case D{}:
      "D"
    case D2{}:
      "D2"
    case Di{}:
      "D'"
    case L{}:
      "L"
    case L2{}:
      "L2"
    case Li{}:
      "L'"
    case B{}:
      "B"
    case B2{}:
      "B2"
    case Bi{}:
      "B'"

def to_list(cube: Cube) -> +List<U32>:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53]

def from_list(values: +List<U32>) -> Maybe<&2, Cube>:
  match values:
    case Con{s0, Con{s1, Con{s2, Con{s3, Con{s4, Con{s5, Con{s6, Con{s7, Con{s8, Con{s9, Con{s10, Con{s11, Con{s12, Con{s13, Con{s14, Con{s15, Con{s16, Con{s17, Con{s18, Con{s19, Con{s20, Con{s21, Con{s22, Con{s23, Con{s24, Con{s25, Con{s26, Con{s27, Con{s28, Con{s29, Con{s30, Con{s31, Con{s32, Con{s33, Con{s34, Con{s35, Con{s36, Con{s37, Con{s38, Con{s39, Con{s40, Con{s41, Con{s42, Con{s43, Con{s44, Con{s45, Con{s46, Con{s47, Con{s48, Con{s49, Con{s50, Con{s51, Con{s52, Con{s53, Nil{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}:
      Some{Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}}
    case _:
      None{}

def is_solved(cube: Cube) -> Bool:
  match cube:
    case Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      U32.is_eq(s0, 0) && U32.is_eq(s1, 0) && U32.is_eq(s2, 0) && U32.is_eq(s3, 0) && U32.is_eq(s4, 0) && U32.is_eq(s5, 0) && U32.is_eq(s6, 0) && U32.is_eq(s7, 0) && U32.is_eq(s8, 0) && U32.is_eq(s9, 1) && U32.is_eq(s10, 1) && U32.is_eq(s11, 1) && U32.is_eq(s12, 1) && U32.is_eq(s13, 1) && U32.is_eq(s14, 1) && U32.is_eq(s15, 1) && U32.is_eq(s16, 1) && U32.is_eq(s17, 1) && U32.is_eq(s18, 2) && U32.is_eq(s19, 2) && U32.is_eq(s20, 2) && U32.is_eq(s21, 2) && U32.is_eq(s22, 2) && U32.is_eq(s23, 2) && U32.is_eq(s24, 2) && U32.is_eq(s25, 2) && U32.is_eq(s26, 2) && U32.is_eq(s27, 3) && U32.is_eq(s28, 3) && U32.is_eq(s29, 3) && U32.is_eq(s30, 3) && U32.is_eq(s31, 3) && U32.is_eq(s32, 3) && U32.is_eq(s33, 3) && U32.is_eq(s34, 3) && U32.is_eq(s35, 3) && U32.is_eq(s36, 4) && U32.is_eq(s37, 4) && U32.is_eq(s38, 4) && U32.is_eq(s39, 4) && U32.is_eq(s40, 4) && U32.is_eq(s41, 4) && U32.is_eq(s42, 4) && U32.is_eq(s43, 4) && U32.is_eq(s44, 4) && U32.is_eq(s45, 5) && U32.is_eq(s46, 5) && U32.is_eq(s47, 5) && U32.is_eq(s48, 5) && U32.is_eq(s49, 5) && U32.is_eq(s50, 5) && U32.is_eq(s51, 5) && U32.is_eq(s52, 5) && U32.is_eq(s53, 5)

def replay(moves: +List<Move>, cube: Cube) -> Cube:
  match moves:
    case Nil{}:
      cube
    case Con{move, rest}:
      replay(rest, turn(move, cube))
