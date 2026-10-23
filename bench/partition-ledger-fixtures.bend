import Base
import ./partition-ledger.bend as L
import ./partition-prefix.bend as P
import ../src/cubie.bend as C
import ../src/search.bend as S

def scope(epoch: U32) -> L.Scope:
  L.Scope{C.turn(3, C.turn(0, C.solved())), 6, 2, epoch, L.Digest{1, 2, 3, 4, 5, 6, 7, 8}, L.Digest{8, 7, 6, 5, 4, 3, 2, 1}}

def take(result: L.Acknowledgement) -> L.Ledger:
  match result:
    case L.Acknowledgement{ledger, receipt}: ledger

def settle(ledger: L.Ledger, +scope: L.Scope, +job: L.Job) -> L.Ledger:
  take(L.apply(take(L.apply(ledger, scope, job, L.PartStarted{})), scope, job, L.PartExhausted{}))

def settle_all(ids: +List<U32>, +scope: L.Scope, ledger: L.Ledger) -> L.Ledger:
  match ids:
    case Nil{}: ledger
    case Con{code, rest}: settle_all(rest, scope, settle(ledger, scope, L.PrefixJob{code}))

def raw_exhaustions(ids: +List<U32>, +scope: L.Scope, ledger: L.Ledger) -> L.Ledger:
  match ids:
    case Nil{}: take(L.apply(ledger, scope, L.ShortJob{}, L.PartExhausted{}))
    case Con{code, rest}: raw_exhaustions(rest, scope, take(L.apply(ledger, scope, L.PrefixJob{code}, L.PartExhausted{})))

def rest_ids(ids: +List<U32>) -> +List<U32>:
  match ids:
    case Nil{}: Nil{}
    case Con{head, rest}: rest

def ready(scope: L.Scope, ledger: L.Ledger) -> L.Ledger:
  settle_all(P.words(S.FullCube{}, 6, 2), scope, ledger)

def prepare(which: U32, +value: L.Scope, ledger: L.Ledger, +seed: U32) -> L.Ledger:
  match which:
    case 0: settle(ready(value, ledger), value, L.ShortJob{})
    case 1: ready(value, ledger)
    case 2: settle(settle(ledger, value, L.PrefixJob{3}), value, L.ShortJob{})
    case 3: settle(settle_all(rest_ids(P.words(S.FullCube{}, 6, 2)), value, ledger), value, L.ShortJob{})
    case 4: take(L.apply(settle(ready(value, ledger), value, L.ShortJob{}), value, L.PrefixJob{3}, L.PartExhausted{}))
    case 5: settle(ready(value, take(L.apply(ledger, value, L.PrefixJob{3}, L.PartFailed{}))), value, L.ShortJob{})
    case 6: settle(ready(value, take(L.apply(ledger, value, L.PrefixJob{3}, L.PartCancelled{}))), value, L.ShortJob{})
    case 7: settle(settle_all(rest_ids(P.words(S.FullCube{}, 6, 2)), value, take(L.apply(ledger, scope((seed + 1 : U32)), L.PrefixJob{3}, L.PartStarted{}))), value, L.ShortJob{})
    case 8: take(L.apply(ledger, value, L.PrefixJob{131075}, L.PartStarted{}))
    case _: raw_exhaustions(P.words(S.FullCube{}, 6, 2), value, ledger)

def short_packet(read: L.Ledger & U32, which: U32, complete: U32, first: U32) -> +List<U32>:
  match read:
    case Tuple{ledger, short}: [which, complete, first, short]

def first_packet(read: L.Ledger & U32, which: U32, complete: U32) -> +List<U32>:
  match read:
    case Tuple{ledger, first}: short_packet(L.status(ledger, L.ShortJob{}), which, complete, first)

def complete_packet(read: L.Ledger & U32, which: U32) -> +List<U32>:
  match read:
    case Tuple{ledger, complete}: first_packet(L.status(ledger, L.PrefixJob{3}), which, complete)

def opened(result: Maybe<&1, L.Ledger>, +which: U32, value: L.Scope, seed: U32) -> +List<U32>:
  match result:
    case None{}: [which, 0, 0, 0]
    case Some{ledger}: complete_packet(L.complete(prepare(which, value, ledger, seed)), which)

def test_scenario(which: U32, +seed: U32) -> +List<U32>:
  +value = scope(seed)
  opened(L.open(S.FullCube{}, S.RawInverseThree{}, value), which, value, seed)
