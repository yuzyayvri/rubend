import Base

def Truth(value: Bool) -> Type:
  match value:
    case False{}: Unit
    case True{}: Empty

def false_true(evidence: {False{} == True{} : Bool}) -> Empty:
  %evidence : Truth(_)
  Unit{}

def bool_equal(+left: Bool, +right: Bool, evidence: {Cmp.is_eq(Bool.cmp(left, right)) == True{} : Bool}) -> {left == right : Bool}:
  match left right:
    case False{} False{}: {==}
    case True{} True{}: {==}
    case False{} True{}: Empty.absurd({False{} == True{} : Bool}, false_true(evidence))
    case True{} False{}: Empty.absurd({True{} == False{} : Bool}, false_true(evidence))

def cmp_eliminate(-Result: Type, +left: Bool, +right: Bool, +tail: Cmp, evidence: {Cmp.is_eq(Word.cmp.fin(left, right, tail)) == True{} : Bool}, consume: {tail == EQ{} : Cmp} -> {Cmp.is_eq(Bool.cmp(left, right)) == True{} : Bool} -> Result) -> Result:
  match tail:
    case LT{}: Empty.absurd(Result, false_true(evidence))
    case GT{}: Empty.absurd(Result, false_true(evidence))
    case EQ{}: consume({==}, evidence)

def word_equal(+size: Nat, +left: Word(size), +right: Word(size), evidence: {Cmp.is_eq(Word.cmp(size, left, right)) == True{} : Bool}) -> {left == right : Word(size)}:
  match size:
    case 0n:
      match left right:
        case WNil{} WNil{}: {==}
    case 1n+rest:
      match left right:
        case WCon{+a, +xs} WCon{+b, +ys}:
          cmp_eliminate({WCon{a, xs} == WCon{b, ys} : Word(1n+rest)}, a, b, Word.cmp(rest, xs, ys), evidence, tail => bit => Equal.trans(Word(1n+rest), WCon{a, xs}, WCon{b, xs}, WCon{b, ys}, Equal.cong(Bool, Word(1n+rest), value => WCon{value, xs}, a, b, bool_equal(a, b, bit)), Equal.cong(Word(rest), Word(1n+rest), value => WCon{b, value}, xs, ys, word_equal(rest, xs, ys, Equal.cong(Cmp, Bool, Cmp.is_eq, Word.cmp(rest, xs, ys), EQ{}, tail)))))

def u32_equal(+left: U32, +right: U32, evidence: {U32.is_eq(left, right) == True{} : Bool}) -> {left == right : U32}:
  match left right:
    case U32{+a} U32{+b}: Equal.cong(Word(32n), U32, value => U32{value}, a, b, word_equal(32n, a, b, evidence))

def and_eliminate(-Result: Type, +left: Bool, +right: Bool, evidence: {Bool.and(left, right) == True{} : Bool}, consume: {left == True{} : Bool} -> {right == True{} : Bool} -> Result) -> Result:
  match left:
    case False{}: Empty.absurd(Result, false_true(evidence))
    case True{}: consume({==}, evidence)

type CRTTree is Data:
  CRTLeaf{left: U32, right: U32}
  CRTBranch{left: CRTTree, right: CRTTree}

def tree_value(tree: CRTTree) -> Bool:
  match tree:
    case CRTLeaf{left, right}: U32.is_eq(left, right)
    case CRTBranch{left, right}: Bool.and(tree_value(left), tree_value(right))

def TreeEvidence(tree: CRTTree) -> Type:
  match tree:
    case CRTLeaf{left, right}: {left == right : U32}
    case CRTBranch{left, right}: TreeEvidence(left) & TreeEvidence(right)

def reflect_tree(+tree: CRTTree, evidence: {tree_value(tree) == True{} : Bool}) -> TreeEvidence(tree):
  match tree:
    case CRTLeaf{+left, +right}: u32_equal(left, right, evidence)
    case CRTBranch{+left, +right}: and_eliminate(TreeEvidence(left) & TreeEvidence(right), tree_value(left), tree_value(right), evidence, first => second => (reflect_tree(left, first), reflect_tree(right, second)))
