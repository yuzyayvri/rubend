import Base
import ./subgroup-proof-kernel.bend as K

def combine(+a: Bool, +b: Bool, left: {a == True{} : Bool}, right: {b == True{} : Bool}) -> {Bool.and(a, b) == True{} : Bool}:
  %Equal.sym(Bool, a, True{}, left) : {Bool.and(_, b) == True{} : Bool}
  right

def left(+a: Bool, +b: Bool, evidence: {Bool.and(a, b) == True{} : Bool}) -> {a == True{} : Bool}:
  match a:
    case False{}: evidence
    case True{}: {==}

def right(+a: Bool, +b: Bool, evidence: {Bool.and(a, b) == True{} : Bool}) -> {b == True{} : Bool}:
  match a:
    case False{}: Empty.absurd({b == True{} : Bool}, K.false_clash(evidence))
    case True{}: evidence
