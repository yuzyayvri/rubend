import Base

def and_cong(+a: Bool, +b: Bool, +c: Bool, +d: Bool, ea: {a == c : Bool}, eb: {b == d : Bool}) -> {Bool.and(a, b) == Bool.and(c, d) : Bool}:
  Equal.trans(Bool, Bool.and(a, b), Bool.and(c, b), Bool.and(c, d), Equal.cong(Bool, Bool, x => Bool.and(x, b), a, c, ea), Equal.cong(Bool, Bool, x => Bool.and(c, x), b, d, eb))

def or_cong(+a: Bool, +b: Bool, +c: Bool, +d: Bool, ea: {a == c : Bool}, eb: {b == d : Bool}) -> {Bool.or(a, b) == Bool.or(c, d) : Bool}:
  Equal.trans(Bool, Bool.or(a, b), Bool.or(c, b), Bool.or(c, d), Equal.cong(Bool, Bool, x => Bool.or(x, b), a, c, ea), Equal.cong(Bool, Bool, x => Bool.or(c, x), b, d, eb))

def xor_cong(+a: Bool, +b: Bool, +c: Bool, +d: Bool, ea: {a == c : Bool}, eb: {b == d : Bool}) -> {Bool.xor(a, b) == Bool.xor(c, d) : Bool}:
  Equal.trans(Bool, Bool.xor(a, b), Bool.xor(c, b), Bool.xor(c, d), Equal.cong(Bool, Bool, x => Bool.xor(x, b), a, c, ea), Equal.cong(Bool, Bool, x => Bool.xor(c, x), b, d, eb))

def and_false(+a: Bool) -> {Bool.and(a, False{}) == False{} : Bool}:
  match a:
    case False{}: {==}
    case True{}: {==}

def and_true(+a: Bool) -> {Bool.and(a, True{}) == a : Bool}:
  match a:
    case False{}: {==}
    case True{}: {==}

def or_false(+a: Bool) -> {Bool.or(a, False{}) == a : Bool}:
  match a:
    case False{}: {==}
    case True{}: {==}

def or_true(+a: Bool) -> {Bool.or(a, True{}) == True{} : Bool}:
  match a:
    case False{}: {==}
    case True{}: {==}

def xor_false(+a: Bool) -> {Bool.xor(a, False{}) == a : Bool}:
  match a:
    case False{}: {==}
    case True{}: {==}

def xor_true(+a: Bool) -> {Bool.xor(a, True{}) == Bool.not(a) : Bool}:
  match a:
    case False{}: {==}
    case True{}: {==}
