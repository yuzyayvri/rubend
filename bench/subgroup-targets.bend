import Base
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/symmetry.bend as Y
import ./subgroup-proof-kernel.bend as K
import ./subgroup-target-logic.bend as T
import ./subgroup-exclusion.bend as E

def ud(+value: U32) -> Bool:
  U32.is_eq(value, 0) || U32.is_eq(value, 3)

def fb(+value: U32) -> Bool:
  U32.is_eq(value, 2) || U32.is_eq(value, 5)

def p0(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s0)

def p1(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s1)

def p2(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s2)

def p3(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s3)

def p4(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s5)

def p5(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s6)

def p6(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s7)

def p7(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s8)

def p8(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s27)

def p9(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s28)

def p10(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s29)

def p11(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s30)

def p12(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s32)

def p13(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s33)

def p14(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s34)

def p15(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      ud(s35)

def p16(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      fb(s21)

def p17(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      fb(s23)

def p18(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      fb(s48)

def p19(cube: M.Cube) -> Bool:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      fb(s50)

def inside_ud(cube: M.Cube) -> Bool:
  +shared = cube
  Bool.and(p0(shared), Bool.and(p1(shared), Bool.and(p2(shared), Bool.and(p3(shared), Bool.and(p4(shared), Bool.and(p5(shared), Bool.and(p6(shared), Bool.and(p7(shared), Bool.and(p8(shared), Bool.and(p9(shared), Bool.and(p10(shared), Bool.and(p11(shared), Bool.and(p12(shared), Bool.and(p13(shared), Bool.and(p14(shared), Bool.and(p15(shared), Bool.and(p16(shared), Bool.and(p17(shared), Bool.and(p18(shared), p19(shared))))))))))))))))))))

type UDWitness<-cube: M.Cube> is Data:
  UDWitness{w0: {p0(cube) == True{} : Bool}, w1: {p1(cube) == True{} : Bool}, w2: {p2(cube) == True{} : Bool}, w3: {p3(cube) == True{} : Bool}, w4: {p4(cube) == True{} : Bool}, w5: {p5(cube) == True{} : Bool}, w6: {p6(cube) == True{} : Bool}, w7: {p7(cube) == True{} : Bool}, w8: {p8(cube) == True{} : Bool}, w9: {p9(cube) == True{} : Bool}, w10: {p10(cube) == True{} : Bool}, w11: {p11(cube) == True{} : Bool}, w12: {p12(cube) == True{} : Bool}, w13: {p13(cube) == True{} : Bool}, w14: {p14(cube) == True{} : Bool}, w15: {p15(cube) == True{} : Bool}, w16: {p16(cube) == True{} : Bool}, w17: {p17(cube) == True{} : Bool}, w18: {p18(cube) == True{} : Bool}, w19: {p19(cube) == True{} : Bool}}

def witness(+cube: M.Cube, evidence: {inside_ud(cube) == True{} : Bool}) -> UDWitness<cube>:
  +all = evidence
  UDWitness{T.left(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all), T.left(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all)), T.left(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all))), T.left(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all)))), T.left(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all))))), T.left(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all)))))), T.left(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all))))))), T.left(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all)))))))), T.left(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all))))))))), T.left(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), T.right(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all)))))))))), T.left(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))), T.right(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), T.right(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all))))))))))), T.left(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))), T.right(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))), T.right(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), T.right(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all)))))))))))), T.left(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))), T.right(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))), T.right(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))), T.right(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), T.right(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all))))))))))))), T.left(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))), T.right(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))), T.right(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))), T.right(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))), T.right(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), T.right(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all)))))))))))))), T.left(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))), T.right(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))), T.right(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))), T.right(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))), T.right(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))), T.right(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), T.right(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all))))))))))))))), T.left(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))), T.right(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))), T.right(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))), T.right(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))), T.right(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))), T.right(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))), T.right(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), T.right(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all)))))))))))))))), T.left(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))), T.right(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))), T.right(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))), T.right(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))), T.right(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))), T.right(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))), T.right(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))), T.right(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), T.right(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all))))))))))))))))), T.left(p17(cube), Bool.and(p18(cube), p19(cube)), T.right(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))), T.right(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))), T.right(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))), T.right(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))), T.right(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))), T.right(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))), T.right(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))), T.right(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), T.right(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all)))))))))))))))))), T.left(p18(cube), p19(cube), T.right(p17(cube), Bool.and(p18(cube), p19(cube)), T.right(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))), T.right(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))), T.right(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))), T.right(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))), T.right(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))), T.right(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))), T.right(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))), T.right(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), T.right(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all))))))))))))))))))), T.right(p18(cube), p19(cube), T.right(p17(cube), Bool.and(p18(cube), p19(cube)), T.right(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))), T.right(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))), T.right(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))), T.right(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))), T.right(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))), T.right(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))), T.right(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))), T.right(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), T.right(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), T.right(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), T.right(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), T.right(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), T.right(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), T.right(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), T.right(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), T.right(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), T.right(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), all)))))))))))))))))))}

def assemble(+cube: M.Cube, evidence: UDWitness<cube>) -> {inside_ud(cube) == True{} : Bool}:
  match evidence:
    case UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}:
      T.combine(p0(cube), Bool.and(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))))), w0, T.combine(p1(cube), Bool.and(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))))), w1, T.combine(p2(cube), Bool.and(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))))), w2, T.combine(p3(cube), Bool.and(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))))), w3, T.combine(p4(cube), Bool.and(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))))), w4, T.combine(p5(cube), Bool.and(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))))), w5, T.combine(p6(cube), Bool.and(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))))), w6, T.combine(p7(cube), Bool.and(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))))), w7, T.combine(p8(cube), Bool.and(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))))), w8, T.combine(p9(cube), Bool.and(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))))), w9, T.combine(p10(cube), Bool.and(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))))), w10, T.combine(p11(cube), Bool.and(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))))), w11, T.combine(p12(cube), Bool.and(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))))), w12, T.combine(p13(cube), Bool.and(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))))), w13, T.combine(p14(cube), Bool.and(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))))), w14, T.combine(p15(cube), Bool.and(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube)))), w15, T.combine(p16(cube), Bool.and(p17(cube), Bool.and(p18(cube), p19(cube))), w16, T.combine(p17(cube), Bool.and(p18(cube), p19(cube)), w17, T.combine(p18(cube), p19(cube), w18, w19)))))))))))))))))))

def transport_U(cube: M.Cube, evidence: UDWitness<cube>) -> UDWitness<M.turn(M.U{}, cube)>:
  match cube evidence:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53} UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}:
      UDWitness{w5, w3, w0, w6, w1, w7, w4, w2, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}

def transport_U2(cube: M.Cube, evidence: UDWitness<cube>) -> UDWitness<M.turn(M.U2{}, cube)>:
  match cube evidence:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53} UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}:
      UDWitness{w7, w6, w5, w4, w3, w2, w1, w0, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}

def transport_Ui(cube: M.Cube, evidence: UDWitness<cube>) -> UDWitness<M.turn(M.Ui{}, cube)>:
  match cube evidence:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53} UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}:
      UDWitness{w2, w4, w7, w1, w6, w0, w3, w5, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}

def transport_R2(cube: M.Cube, evidence: UDWitness<cube>) -> UDWitness<M.turn(M.R2{}, cube)>:
  match cube evidence:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53} UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}:
      UDWitness{w0, w1, w10, w3, w12, w5, w6, w15, w8, w9, w2, w11, w4, w13, w14, w7, w16, w18, w17, w19}

def transport_F2(cube: M.Cube, evidence: UDWitness<cube>) -> UDWitness<M.turn(M.F2{}, cube)>:
  match cube evidence:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53} UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}:
      UDWitness{w0, w1, w2, w3, w4, w10, w9, w8, w7, w6, w5, w11, w12, w13, w14, w15, w17, w16, w18, w19}

def transport_D(cube: M.Cube, evidence: UDWitness<cube>) -> UDWitness<M.turn(M.D{}, cube)>:
  match cube evidence:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53} UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}:
      UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w13, w11, w8, w14, w9, w15, w12, w10, w16, w17, w18, w19}

def transport_D2(cube: M.Cube, evidence: UDWitness<cube>) -> UDWitness<M.turn(M.D2{}, cube)>:
  match cube evidence:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53} UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}:
      UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w15, w14, w13, w12, w11, w10, w9, w8, w16, w17, w18, w19}

def transport_Di(cube: M.Cube, evidence: UDWitness<cube>) -> UDWitness<M.turn(M.Di{}, cube)>:
  match cube evidence:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53} UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}:
      UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w10, w12, w15, w9, w14, w8, w11, w13, w16, w17, w18, w19}

def transport_L2(cube: M.Cube, evidence: UDWitness<cube>) -> UDWitness<M.turn(M.L2{}, cube)>:
  match cube evidence:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53} UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}:
      UDWitness{w8, w1, w2, w11, w4, w13, w6, w7, w0, w9, w10, w3, w12, w5, w14, w15, w19, w17, w18, w16}

def transport_B2(cube: M.Cube, evidence: UDWitness<cube>) -> UDWitness<M.turn(M.B2{}, cube)>:
  match cube evidence:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53} UDWitness{w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19}:
      UDWitness{w15, w14, w13, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w2, w1, w0, w16, w17, w19, w18}

def member_ud(move: M.Move) -> Bool:
  match move:
    case M.U{}: True{}
    case M.U2{}: True{}
    case M.Ui{}: True{}
    case M.R{}: False{}
    case M.R2{}: True{}
    case M.Ri{}: False{}
    case M.F{}: False{}
    case M.F2{}: True{}
    case M.Fi{}: False{}
    case M.D{}: True{}
    case M.D2{}: True{}
    case M.Di{}: True{}
    case M.L{}: False{}
    case M.L2{}: True{}
    case M.Li{}: False{}
    case M.B{}: False{}
    case M.B2{}: True{}
    case M.Bi{}: False{}

def closed_ud(move: M.Move, cube: M.Cube, membership: {member_ud(move) == True{} : Bool}, reached: {inside_ud(cube) == True{} : Bool}) -> {inside_ud(M.turn(move, cube)) == True{} : Bool}:
  match move:
    case M.U{}:
      +shared = cube
      assemble(M.turn(M.U{}, shared), transport_U(shared, witness(shared, reached)))
    case M.U2{}:
      +shared = cube
      assemble(M.turn(M.U2{}, shared), transport_U2(shared, witness(shared, reached)))
    case M.Ui{}:
      +shared = cube
      assemble(M.turn(M.Ui{}, shared), transport_Ui(shared, witness(shared, reached)))
    case M.R{}: Empty.absurd({inside_ud(M.turn(M.R{}, cube)) == True{} : Bool}, K.false_clash(membership))
    case M.R2{}:
      +shared = cube
      assemble(M.turn(M.R2{}, shared), transport_R2(shared, witness(shared, reached)))
    case M.Ri{}: Empty.absurd({inside_ud(M.turn(M.Ri{}, cube)) == True{} : Bool}, K.false_clash(membership))
    case M.F{}: Empty.absurd({inside_ud(M.turn(M.F{}, cube)) == True{} : Bool}, K.false_clash(membership))
    case M.F2{}:
      +shared = cube
      assemble(M.turn(M.F2{}, shared), transport_F2(shared, witness(shared, reached)))
    case M.Fi{}: Empty.absurd({inside_ud(M.turn(M.Fi{}, cube)) == True{} : Bool}, K.false_clash(membership))
    case M.D{}:
      +shared = cube
      assemble(M.turn(M.D{}, shared), transport_D(shared, witness(shared, reached)))
    case M.D2{}:
      +shared = cube
      assemble(M.turn(M.D2{}, shared), transport_D2(shared, witness(shared, reached)))
    case M.Di{}:
      +shared = cube
      assemble(M.turn(M.Di{}, shared), transport_Di(shared, witness(shared, reached)))
    case M.L{}: Empty.absurd({inside_ud(M.turn(M.L{}, cube)) == True{} : Bool}, K.false_clash(membership))
    case M.L2{}:
      +shared = cube
      assemble(M.turn(M.L2{}, shared), transport_L2(shared, witness(shared, reached)))
    case M.Li{}: Empty.absurd({inside_ud(M.turn(M.Li{}, cube)) == True{} : Bool}, K.false_clash(membership))
    case M.B{}: Empty.absurd({inside_ud(M.turn(M.B{}, cube)) == True{} : Bool}, K.false_clash(membership))
    case M.B2{}:
      +shared = cube
      assemble(M.turn(M.B2{}, shared), transport_B2(shared, witness(shared, reached)))
    case M.Bi{}: Empty.absurd({inside_ud(M.turn(M.Bi{}, cube)) == True{} : Bool}, K.false_clash(membership))

def inside_fb(cube: M.Cube) -> Bool:
  inside_ud(Y.rotate(cube))

def member_fb(move: M.Move) -> Bool:
  member_ud(Y.rotate_move(move))

def inside_rl(cube: M.Cube) -> Bool:
  inside_fb(Y.rotate(cube))

def member_rl(move: M.Move) -> Bool:
  member_fb(Y.rotate_move(move))

def closed_fb(move: M.Move, cube: M.Cube, membership: {member_fb(move) == True{} : Bool}, reached: {inside_fb(cube) == True{} : Bool}) -> {inside_fb(M.turn(move, cube)) == True{} : Bool}:
  +m = move
  +c = cube
  %Equal.sym(M.Cube, Y.rotate(M.turn(m, c)), M.turn(Y.rotate_move(m), Y.rotate(c)), Y.commutes(m, c)) : {inside_ud(_) == True{} : Bool}
  closed_ud(Y.rotate_move(m), Y.rotate(c), membership, reached)

def closed_rl(move: M.Move, cube: M.Cube, membership: {member_rl(move) == True{} : Bool}, reached: {inside_rl(cube) == True{} : Bool}) -> {inside_rl(M.turn(move, cube)) == True{} : Bool}:
  +m = move
  +c = cube
  %Equal.sym(M.Cube, Y.rotate(M.turn(m, c)), M.turn(Y.rotate_move(m), Y.rotate(c)), Y.commutes(m, c)) : {inside_ud(Y.rotate(_)) == True{} : Bool}
  closed_fb(Y.rotate_move(m), Y.rotate(c), membership, reached)

def identity_ud() -> {inside_ud(M.solved()) == True{} : Bool}:
  {==}

def inverse_ud(move: M.Move, evidence: {member_ud(move) == True{} : Bool}) -> {member_ud(M.inverse(move)) == True{} : Bool}:
  match move:
    case M.U{}: evidence
    case M.U2{}: evidence
    case M.Ui{}: evidence
    case M.R{}: evidence
    case M.R2{}: evidence
    case M.Ri{}: evidence
    case M.F{}: evidence
    case M.F2{}: evidence
    case M.Fi{}: evidence
    case M.D{}: evidence
    case M.D2{}: evidence
    case M.Di{}: evidence
    case M.L{}: evidence
    case M.L2{}: evidence
    case M.Li{}: evidence
    case M.B{}: evidence
    case M.B2{}: evidence
    case M.Bi{}: evidence

law member_ud_matches_target:
  for +move: M.Move
  {inside_ud(M.turn(move, M.solved())) == member_ud(move) : Bool}

def member_ud_matches_target(move):
  match move:
    case M.U{}: {==}
    case M.U2{}: {==}
    case M.Ui{}: {==}
    case M.R{}: {==}
    case M.R2{}: {==}
    case M.Ri{}: {==}
    case M.F{}: {==}
    case M.F2{}: {==}
    case M.Fi{}: {==}
    case M.D{}: {==}
    case M.D2{}: {==}
    case M.Di{}: {==}
    case M.L{}: {==}
    case M.L2{}: {==}
    case M.Li{}: {==}
    case M.B{}: {==}
    case M.B2{}: {==}
    case M.Bi{}: {==}

def identity_fb() -> {inside_fb(M.solved()) == True{} : Bool}:
  {==}

def inverse_fb(move: M.Move, evidence: {member_fb(move) == True{} : Bool}) -> {member_fb(M.inverse(move)) == True{} : Bool}:
  match move:
    case M.U{}: evidence
    case M.U2{}: evidence
    case M.Ui{}: evidence
    case M.R{}: evidence
    case M.R2{}: evidence
    case M.Ri{}: evidence
    case M.F{}: evidence
    case M.F2{}: evidence
    case M.Fi{}: evidence
    case M.D{}: evidence
    case M.D2{}: evidence
    case M.Di{}: evidence
    case M.L{}: evidence
    case M.L2{}: evidence
    case M.Li{}: evidence
    case M.B{}: evidence
    case M.B2{}: evidence
    case M.Bi{}: evidence

law member_fb_matches_target:
  for +move: M.Move
  {inside_fb(M.turn(move, M.solved())) == member_fb(move) : Bool}

def member_fb_matches_target(move):
  match move:
    case M.U{}: {==}
    case M.U2{}: {==}
    case M.Ui{}: {==}
    case M.R{}: {==}
    case M.R2{}: {==}
    case M.Ri{}: {==}
    case M.F{}: {==}
    case M.F2{}: {==}
    case M.Fi{}: {==}
    case M.D{}: {==}
    case M.D2{}: {==}
    case M.Di{}: {==}
    case M.L{}: {==}
    case M.L2{}: {==}
    case M.Li{}: {==}
    case M.B{}: {==}
    case M.B2{}: {==}
    case M.Bi{}: {==}

def identity_rl() -> {inside_rl(M.solved()) == True{} : Bool}:
  {==}

def inverse_rl(move: M.Move, evidence: {member_rl(move) == True{} : Bool}) -> {member_rl(M.inverse(move)) == True{} : Bool}:
  match move:
    case M.U{}: evidence
    case M.U2{}: evidence
    case M.Ui{}: evidence
    case M.R{}: evidence
    case M.R2{}: evidence
    case M.Ri{}: evidence
    case M.F{}: evidence
    case M.F2{}: evidence
    case M.Fi{}: evidence
    case M.D{}: evidence
    case M.D2{}: evidence
    case M.Di{}: evidence
    case M.L{}: evidence
    case M.L2{}: evidence
    case M.Li{}: evidence
    case M.B{}: evidence
    case M.B2{}: evidence
    case M.Bi{}: evidence

law member_rl_matches_target:
  for +move: M.Move
  {inside_rl(M.turn(move, M.solved())) == member_rl(move) : Bool}

def member_rl_matches_target(move):
  match move:
    case M.U{}: {==}
    case M.U2{}: {==}
    case M.Ui{}: {==}
    case M.R{}: {==}
    case M.R2{}: {==}
    case M.Ri{}: {==}
    case M.F{}: {==}
    case M.F2{}: {==}
    case M.Fi{}: {==}
    case M.D{}: {==}
    case M.D2{}: {==}
    case M.Di{}: {==}
    case M.L{}: {==}
    case M.L2{}: {==}
    case M.Li{}: {==}
    case M.B{}: {==}
    case M.B2{}: {==}
    case M.Bi{}: {==}

type Axis is Data:
  UD{}
  FB{}
  RL{}

def inside(axis: Axis, cube: M.Cube) -> Bool:
  match axis:
    case UD{}: inside_ud(cube)
    case FB{}: inside_fb(cube)
    case RL{}: inside_rl(cube)

def member(axis: Axis, move: M.Move) -> Bool:
  match axis:
    case UD{}: member_ud(move)
    case FB{}: member_fb(move)
    case RL{}: member_rl(move)

def member_index(axis: Axis, index: U32) -> Bool:
  +shared = index
  U32.is_lt(shared, 18) && member(axis, M.from_index(shared))

def inside_words(axis: Axis, cp: U32, co: U32, ep: U32, eh: U32, eo: U32) -> Bool:
  inside(axis, C.to_facelets(C.Cubie{cp, co, ep, eh, eo}))

def axis_index(axis: Axis) -> U32:
  match axis:
    case UD{}: 0
    case FB{}: 1
    case RL{}: 2

def mask_member(axis: Axis, move: M.Move) -> Bool:
  U32.is_ne((E.subgroup_mask(axis_index(axis)) .&. (1 << U32.to_nat(M.index(move)) : U32) : U32), 0)

law mask_matches_target_member:
  for +axis: Axis
  for +move: M.Move
  {mask_member(axis, move) == member(axis, move) : Bool}

def mask_matches_target_member(axis, move):
  match axis move:
    case UD{} M.U{}: {==}
    case UD{} M.U2{}: {==}
    case UD{} M.Ui{}: {==}
    case UD{} M.R{}: {==}
    case UD{} M.R2{}: {==}
    case UD{} M.Ri{}: {==}
    case UD{} M.F{}: {==}
    case UD{} M.F2{}: {==}
    case UD{} M.Fi{}: {==}
    case UD{} M.D{}: {==}
    case UD{} M.D2{}: {==}
    case UD{} M.Di{}: {==}
    case UD{} M.L{}: {==}
    case UD{} M.L2{}: {==}
    case UD{} M.Li{}: {==}
    case UD{} M.B{}: {==}
    case UD{} M.B2{}: {==}
    case UD{} M.Bi{}: {==}
    case FB{} M.U{}: {==}
    case FB{} M.U2{}: {==}
    case FB{} M.Ui{}: {==}
    case FB{} M.R{}: {==}
    case FB{} M.R2{}: {==}
    case FB{} M.Ri{}: {==}
    case FB{} M.F{}: {==}
    case FB{} M.F2{}: {==}
    case FB{} M.Fi{}: {==}
    case FB{} M.D{}: {==}
    case FB{} M.D2{}: {==}
    case FB{} M.Di{}: {==}
    case FB{} M.L{}: {==}
    case FB{} M.L2{}: {==}
    case FB{} M.Li{}: {==}
    case FB{} M.B{}: {==}
    case FB{} M.B2{}: {==}
    case FB{} M.Bi{}: {==}
    case RL{} M.U{}: {==}
    case RL{} M.U2{}: {==}
    case RL{} M.Ui{}: {==}
    case RL{} M.R{}: {==}
    case RL{} M.R2{}: {==}
    case RL{} M.Ri{}: {==}
    case RL{} M.F{}: {==}
    case RL{} M.F2{}: {==}
    case RL{} M.Fi{}: {==}
    case RL{} M.D{}: {==}
    case RL{} M.D2{}: {==}
    case RL{} M.Di{}: {==}
    case RL{} M.L{}: {==}
    case RL{} M.L2{}: {==}
    case RL{} M.Li{}: {==}
    case RL{} M.B{}: {==}
    case RL{} M.B2{}: {==}
    case RL{} M.Bi{}: {==}
