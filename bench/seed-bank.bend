import Base
import ../src/model.bend as M
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ../src/certificate.bend as Cert
import ./premove-paths.bend as E
import ./bounded-portfolio.bend as B

type Lane is Data:
  Lane{tasks: +List<P.Task>, root: C.Cubie, best: +List<U32>, length: U32, lower: U32, nodes: U32, request: P.Request, status: S.Completion}

type Bank is Data:
  NoBank{}
  Bank{lane: Lane}

type Split is Type:
  Split{table: Array<U32>, lane: Lane}

type Session is Type:
  Session{table: Array<U32>, original: M.Cube, seed: E.Seed, main: Lane, bank: Bank, ticks: U32, branch: U32, accepted: U32, fault: U32, profile: S.Profile}

def attach(table: Array<U32>, lane: Lane) -> P.Session:
  match lane:
    case Lane{tasks, root, best, length, lower, nodes, request, status}:
      P.Session{table, tasks, root, best, length, lower, nodes, request, status}

def split(state: P.Session) -> Split:
  match state:
    case P.Session{table, tasks, root, best, length, lower, nodes, request, status}:
      Split{table, Lane{tasks, root, best, length, lower, nodes, request, status}}

def nodes(lane: Lane) -> U32:
  match lane:
    case Lane{tasks, root, best, length, lower, nodes, request, status}: nodes

def length(lane: Lane) -> U32:
  match lane:
    case Lane{tasks, root, best, length, lower, nodes, request, status}: length

def running(lane: Lane) -> Bool:
  match lane:
    case Lane{tasks, root, best, length, lower, nodes, request, status}: U32.is_eq(S.completion_code(status), 0)

def failed(lane: Lane) -> Lane:
  match lane:
    case Lane{tasks, root, best, length, lower, nodes, request, status}:
      Lane{tasks, root, best, length, lower, nodes, request, S.InvalidTransform{}}

def bank_nodes(bank: Bank) -> U32:
  match bank:
    case NoBank{}: 0
    case Bank{lane}: nodes(lane)

def bank_running(bank: Bank) -> Bool:
  match bank:
    case NoBank{}: False{}
    case Bank{lane}: running(lane)

def child_ready(child: Split, original: M.Cube, seed: E.Seed, main: Lane, profile: S.Profile) -> Session:
  match child:
    case Split{table, lane}: Session{table, original, seed, main, Bank{lane}, 0, 0, 0, 0, profile}

def distinct_child(duplicate: Bool, table: Array<U32>, original: M.Cube, seed: E.Seed, main: Lane, child: M.Cube, root: C.Cubie, +profile: S.Profile) -> Session:
  match duplicate:
    case True{}: Session{table, original, seed, main, NoBank{}, 0, 0, 0, 0, profile}
    case False{}: child_ready(split(P.initialize(table, child, root, P.Fast{}, profile)), original, seed, main, profile)

def validated_child(valid: C.Validation, table: Array<U32>, original: M.Cube, seed: E.Seed, +main: Lane, child: M.Cube, profile: S.Profile) -> Session:
  match valid main:
    case C.Valid{+root} Lane{tasks, a, b, c, d, e, f, g}:
      distinct_child(P.contains(tasks, root), table, original, seed, main, child, root, profile)
    case C.Invalid{code} main: Session{table, original, seed, failed(main), NoBank{}, 0, 0, 0, 1, profile}

def enabled(seed: E.Seed, state: Split, +original: M.Cube, +profile: S.Profile) -> Session:
  match seed state:
    case E.NoSeed{} Split{table, main}:
      Session{table, original, E.NoSeed{}, main, NoBank{}, 0, 0, 0, 0, profile}
    case E.Preturn{+move} Split{table, main}:
      +child = {M.turn(move, original) : M.Cube}
      validated_child(C.validate(child), table, original, E.Preturn{move}, main, child, profile)

def initialize(table: Array<U32>, +original: M.Cube, root: C.Cubie, request: P.Request, seed: E.Seed, +profile: S.Profile) -> Session:
  enabled(seed, split(P.initialize(table, original, root, request, profile)), original, profile)

def after_main(result: Split, original: M.Cube, seed: E.Seed, bank: Bank, ticks: U32, accepted: U32, fault: U32, profile: S.Profile) -> Session:
  match result:
    case Split{table, main}: Session{table, original, seed, main, bank, (ticks + 1 : U32), 0, accepted, fault, profile}

def after_accept(result: Split, original: M.Cube, seed: E.Seed, bank: Bank, ticks: U32, branch: U32, accepted: U32, fault: U32, profile: S.Profile) -> Session:
  match result:
    case Split{table, main}: Session{table, original, seed, main, bank, ticks, branch, (accepted + 1 : U32), fault, profile}

def certified(+original: M.Cube, evidence: Maybe<&2, Cert.Certificate<original>>, table: Array<U32>, seed: E.Seed, main: Lane, bank: Bank, ticks: U32, branch: U32, accepted: U32, fault: U32, +profile: S.Profile, +best: +List<U32>, +length: U32) -> Session:
  match evidence main:
    case None{} main:
      Session{table, original, seed, failed(main), bank, ticks, branch, accepted, (fault + 1 : U32), profile}
    case Some{certificate} Lane{tasks, +root, old_best, old_length, +lower, +nodes, +request, status}:
      after_accept(split(P.update_found(P.is_waiting(request), table, tasks, root, best, length, request, 0, Nil{}, S.Meta{root, 0, 21, Nil{}, 31, S.Improve{}, 0, 0, 0, S.TaskFinished{}, profile}, nodes, lower, U32.is_eq(old_length, 31))), original, seed, bank, ticks, branch, accepted, fault, profile)

def consider(better: Bool, +candidate: +List<U32>, length: U32, state: Session) -> Session:
  match better state:
    case False{} state: state
    case True{} Session{table, +original, seed, main, bank, ticks, branch, accepted, fault, profile}:
      certified(original, Cert.certify(original, E.moves(List.reverse(&2, U32, candidate))), table, seed, main, bank, ticks, branch, accepted, fault, profile, candidate, length)

def after_seed(result: Split, original: M.Cube, +seed: E.Seed, +main: Lane, ticks: U32, accepted: U32, fault: U32, profile: S.Profile) -> Session:
  match result:
    case Split{table, Lane{tasks, root, +child_best, +child_length, lower, child_nodes, request, status}}:
      +candidate = {E.reconstruct(seed, 0, child_best) : +List<U32>}
      +candidate_length = U32.from_nat(List.length(&2, U32, candidate))
      consider(U32.is_lt(child_length, 31) && U32.is_lt(candidate_length, length(main)), candidate, candidate_length, Session{table, original, seed, main, Bank{Lane{tasks, root, child_best, child_length, lower, child_nodes, request, status}}, (ticks + 1 : U32), 1, accepted, fault, profile})

def dispatch(child: Bool, limit: U32, state: Session) -> Session:
  match child state:
    case True{} Session{table, original, seed, main, Bank{lane}, ticks, branch, accepted, fault, profile}:
      after_seed(split(B.advance(limit, attach(table, lane))), original, seed, main, ticks, accepted, fault, profile)
    case _ Session{table, original, seed, main, bank, ticks, branch, accepted, fault, profile}:
      after_main(split(B.advance(limit, attach(table, main))), original, seed, bank, ticks, accepted, fault, profile)

def admitted(active: Bool, limit: U32, state: Session) -> Session:
  match active state:
    case False{} state: state
    case True{} Session{table, original, seed, main, +bank, +ticks, branch, accepted, fault, profile}:
      dispatch(bank_running(bank) && U32.is_eq((ticks % 8 : U32), 7), limit, Session{table, original, seed, main, bank, ticks, branch, accepted, fault, profile})

def advance(+budget: U32, state: Session) -> Session:
  match state:
    case Session{table, original, seed, +main, +bank, ticks, branch, accepted, +fault, profile}:
      +used = (nodes(main) + bank_nodes(bank) : U32)
      admitted(U32.is_lt(used, budget) && running(main) && U32.is_eq(fault, 0), (budget - used : U32), Session{table, original, seed, main, bank, ticks, branch, accepted, fault, profile})
