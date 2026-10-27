import Base
import ./partition-prefix.bend as P
import ../src/cubie.bend as C
import ../src/search.bend as S

type Digest is Data:
  Digest{a: U32, b: U32, c: U32, d: U32, e: U32, f: U32, g: U32, h: U32}

type Scope is Data:
  Scope{root: C.Cubie, contour: U32, depth: U32, epoch: U32, table: Digest, policy: Digest}

type Job is Data:
  ShortJob{}
  PrefixJob{code: U32}

type PartitionEvent is Data:
  PartStarted{}
  PartExhausted{}
  PartFailed{}
  PartCancelled{}

type Cell is Data:
  LedgerMissing{}
  LedgerPending{}
  LedgerRunning{}
  LedgerExhausted{}
  LedgerFailed{}
  LedgerCancelled{}

type Receipt is Data:
  LedgerApplied{}
  LedgerRepeated{}
  LedgerOutOfScope{}
  LedgerUnknownJob{}
  LedgerBadTransition{}
  LedgerBadEnvelope{}

type Ledger is Type:
  Ledger{scope: Scope, cells: Array<Cell>, short: Cell}

type Acknowledgement is Type:
  Acknowledgement{ledger: Ledger, receipt: Receipt}

type Transition is Data:
  Transition{cell: Cell, receipt: Receipt}

def same_digest(a: Digest, b: Digest) -> Bool:
  match a b:
    case Digest{a0, a1, a2, a3, a4, a5, a6, a7} Digest{b0, b1, b2, b3, b4, b5, b6, b7}:
      U32.is_eq(a0, b0) && U32.is_eq(a1, b1) && U32.is_eq(a2, b2) && U32.is_eq(a3, b3) && U32.is_eq(a4, b4) && U32.is_eq(a5, b5) && U32.is_eq(a6, b6) && U32.is_eq(a7, b7)

def same_scope(a: Scope, b: Scope) -> Bool:
  match a b:
    case Scope{root, contour, depth, epoch, table, policy} Scope{other_root, other_contour, other_depth, other_epoch, other_table, other_policy}:
      S.fixed(root, C.Valid{other_root}) && U32.is_eq(contour, other_contour) && U32.is_eq(depth, other_depth) && U32.is_eq(epoch, other_epoch) && same_digest(table, other_table) && same_digest(policy, other_policy)

def root_mask(root: C.Cubie) -> U32:
  match root:
    case C.Cubie{cp, co, ep, eh, eo}: P.test_mask(cp, co, ep, eh, eo)

def word_limit(depth: U32) -> U32:
  match depth:
    case 2: 324
    case 3: 5832
    case 4: 104976
    case _: 0

def initialized(ids: +List<U32>, cells: Array<Cell>) -> Array<Cell>:
  match ids:
    case Nil{}: cells
    case Con{code, rest}: initialized(rest, Array.set(Cell, cells, code, LedgerPending{}))

def admitted(ok: Bool, +scope: Scope, mask: U32, depth: U32) -> Maybe<&1, Ledger>:
  match ok:
    case False{}: None{}
    case True{}: Some{Ledger{scope, initialized(P.words(S.FullCube{}, mask, depth), [LedgerMissing{} : Cell^17n]), LedgerPending{}}}

def open(goal: S.Goal, profile: S.Profile, +scope: Scope) -> Maybe<&1, Ledger>:
  match goal profile scope:
    case S.FullCube{} S.RawInverseThree{} Scope{+root, +contour, +depth, epoch, table, policy}:
      +mask = root_mask(root)
      admitted(U32.is_ge(mask, 6) && U32.is_le(mask, 9) && U32.is_ge(depth, 2) && U32.is_le(depth, 4) && U32.is_ge(contour, depth) && U32.is_le(contour, 30) && U32.is_gt(epoch, 0), scope, mask, depth)
    case _ _ _: None{}

def transition(cell: Cell, event: PartitionEvent) -> Transition:
  match cell event:
    case LedgerPending{} PartStarted{}: Transition{LedgerRunning{}, LedgerApplied{}}
    case LedgerRunning{} PartStarted{}: Transition{LedgerRunning{}, LedgerRepeated{}}
    case LedgerRunning{} PartExhausted{}: Transition{LedgerExhausted{}, LedgerApplied{}}
    case LedgerExhausted{} PartExhausted{}: Transition{LedgerExhausted{}, LedgerRepeated{}}
    case LedgerPending{} PartFailed{}: Transition{LedgerFailed{}, LedgerApplied{}}
    case LedgerRunning{} PartFailed{}: Transition{LedgerFailed{}, LedgerApplied{}}
    case LedgerFailed{} PartFailed{}: Transition{LedgerFailed{}, LedgerRepeated{}}
    case LedgerPending{} PartCancelled{}: Transition{LedgerCancelled{}, LedgerApplied{}}
    case LedgerRunning{} PartCancelled{}: Transition{LedgerCancelled{}, LedgerApplied{}}
    case LedgerCancelled{} PartCancelled{}: Transition{LedgerCancelled{}, LedgerRepeated{}}
    case cell _: Transition{cell, LedgerBadTransition{}}

def changed_prefix(result: Transition, scope: Scope, cells: Array<Cell>, short: Cell, code: U32) -> Acknowledgement:
  match result:
    case Transition{cell, receipt}: Acknowledgement{Ledger{scope, Array.set(Cell, cells, code, cell), short}, receipt}

def read_prefix(read: Array<Cell> & Cell, scope: Scope, short: Cell, code: U32, event: PartitionEvent) -> Acknowledgement:
  match read:
    case Tuple{cells, LedgerMissing{}}: Acknowledgement{Ledger{scope, cells, short}, LedgerUnknownJob{}}
    case Tuple{cells, cell}: changed_prefix(transition(cell, event), scope, cells, short, code)

def prefix_indexed(ok: Bool, ledger: Ledger, +code: U32, event: PartitionEvent) -> Acknowledgement:
  match ok ledger:
    case True{} Ledger{scope, cells, short}: read_prefix(Array.get(Cell, cells, code), scope, short, code, event)
    case False{} ledger: Acknowledgement{ledger, LedgerUnknownJob{}}

def changed_short(result: Transition, scope: Scope, cells: Array<Cell>) -> Acknowledgement:
  match result:
    case Transition{short, receipt}: Acknowledgement{Ledger{scope, cells, short}, receipt}

def scoped(ok: Bool, ledger: Ledger, job: Job, event: PartitionEvent) -> Acknowledgement:
  match ok ledger job:
    case False{} ledger _: Acknowledgement{ledger, LedgerOutOfScope{}}
    case True{} Ledger{scope, cells, short} ShortJob{}: changed_short(transition(short, event), scope, cells)
    case True{} Ledger{Scope{root, contour, +depth, epoch, table, policy}, cells, short} PrefixJob{+code}:
      prefix_indexed(U32.is_lt(code, word_limit(depth)), Ledger{Scope{root, contour, depth, epoch, table, policy}, cells, short}, code, event)

def apply(ledger: Ledger, other: Scope, job: Job, event: PartitionEvent) -> Acknowledgement:
  match ledger:
    case Ledger{+scope, cells, short}: scoped(same_scope(scope, other), Ledger{scope, cells, short}, job, event)

def is_exhausted(cell: Cell) -> Bool:
  match cell:
    case LedgerExhausted{}: True{}
    case _: False{}

type Inspection is Type:
  Inspection{cells: Array<Cell>, okay: Bool, seen: U32}

def inspected(read: Array<Cell> & Cell, okay: Bool, seen: U32) -> Inspection:
  match read:
    case Tuple{cells, cell}: Inspection{cells, okay && is_exhausted(cell), (seen + 1 : U32)}

def scan(ids: +List<U32>, state: Inspection) -> Inspection:
  match ids state:
    case Nil{} state: state
    case Con{code, rest} Inspection{cells, okay, seen}: scan(rest, inspected(Array.get(Cell, cells, code), okay, seen))

def finished_scan(result: Inspection, scope: Scope, +short: Cell) -> Ledger & U32:
  match result:
    case Inspection{cells, okay, seen}: (Ledger{scope, cells, short}, C.pick(okay && is_exhausted(short) && U32.is_gt(seen, 0), 1, 0))

def complete(ledger: Ledger) -> Ledger & U32:
  match ledger:
    case Ledger{Scope{+root, contour, +depth, epoch, table, policy}, cells, short}:
      finished_scan(scan(P.words(S.FullCube{}, root_mask(root), depth), Inspection{cells, True{}, 0}), Scope{root, contour, depth, epoch, table, policy}, short)

def receipt_code(receipt: Receipt) -> U32:
  match receipt:
    case LedgerApplied{}: 0
    case LedgerRepeated{}: 1
    case LedgerOutOfScope{}: 2
    case LedgerUnknownJob{}: 3
    case LedgerBadTransition{}: 4
    case LedgerBadEnvelope{}: 5

def cell_code(cell: Cell) -> U32:
  match cell:
    case LedgerMissing{}: 0
    case LedgerPending{}: 1
    case LedgerRunning{}: 2
    case LedgerExhausted{}: 3
    case LedgerFailed{}: 4
    case LedgerCancelled{}: 5

def read_status(read: Array<Cell> & Cell, scope: Scope, short: Cell) -> Ledger & U32:
  match read:
    case Tuple{cells, cell}: (Ledger{scope, cells, short}, cell_code(cell))

def status_indexed(ok: Bool, ledger: Ledger, code: U32) -> Ledger & U32:
  match ok ledger:
    case True{} Ledger{scope, cells, short}: read_status(Array.get(Cell, cells, code), scope, short)
    case False{} ledger: (ledger, 0)

def status(ledger: Ledger, job: Job) -> Ledger & U32:
  match ledger job:
    case Ledger{scope, cells, +short} ShortJob{}: (Ledger{scope, cells, short}, cell_code(short))
    case Ledger{Scope{root, contour, +depth, epoch, table, policy}, cells, short} PrefixJob{+code}:
      status_indexed(U32.is_lt(code, word_limit(depth)), Ledger{Scope{root, contour, depth, epoch, table, policy}, cells, short}, code)

def open_codes(ok: Bool, scope: Scope) -> Maybe<&1, Ledger>:
  match ok:
    case True{}: open(S.FullCube{}, S.RawInverseThree{}, scope)
    case False{}: None{}

def test_open(goal: U32, profile: U32, scope: Scope) -> Maybe<&1, Ledger>:
  open_codes(U32.is_eq(goal, 2) && U32.is_eq(profile, 3), scope)

def event_from(code: U32) -> PartitionEvent:
  match code:
    case 0: PartStarted{}
    case 1: PartExhausted{}
    case 2: PartFailed{}
    case _: PartCancelled{}

def job_from(kind: U32, code: U32) -> Job:
  match kind:
    case 0: ShortJob{}
    case _: PrefixJob{code}

def envelope(ok: Bool, ledger: Ledger, scope: Scope, kind: U32, code: U32, event: U32) -> Acknowledgement:
  match ok:
    case True{}: apply(ledger, scope, job_from(kind, code), event_from(event))
    case False{}: Acknowledgement{ledger, LedgerBadEnvelope{}}

def test_apply(ledger: Ledger, scope: Scope, +kind: U32, +code: U32, +event: U32) -> Acknowledgement:
  envelope((U32.is_eq(kind, 0) && U32.is_eq(code, 0) || U32.is_eq(kind, 1)) && U32.is_lt(event, 4), ledger, scope, kind, code, event)

def test_status(ledger: Ledger, kind: U32, code: U32) -> Ledger & U32:
  match kind code:
    case 0 0: status(ledger, ShortJob{})
    case 1 code: status(ledger, PrefixJob{code})
    case _ _: (ledger, 0)

def test_scope(root: +List<U32>, bounds: +List<U32>, table: +List<U32>, policy: +List<U32>) -> Maybe<&2, Scope>:
  match root bounds table policy:
    case Con{cp, Con{co, Con{ep, Con{eh, Con{eo, Nil{}}}}}} Con{contour, Con{depth, Con{epoch, Nil{}}}} Con{a0, Con{a1, Con{a2, Con{a3, Con{a4, Con{a5, Con{a6, Con{a7, Nil{}}}}}}}}} Con{b0, Con{b1, Con{b2, Con{b3, Con{b4, Con{b5, Con{b6, Con{b7, Nil{}}}}}}}}}:
      Some{Scope{C.Cubie{cp, co, ep, eh, eo}, contour, depth, epoch, Digest{a0, a1, a2, a3, a4, a5, a6, a7}, Digest{b0, b1, b2, b3, b4, b5, b6, b7}}}
    case _ _ _ _: None{}
