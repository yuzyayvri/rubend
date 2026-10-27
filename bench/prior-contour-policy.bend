import Base
import ../src/cubie.bend as C
import ../src/search.bend as S
import ../src/portfolio.bend as P
import ./portfolio-observer.bend as O
import ../src/symmetry.bend as Y

type Track is Data:
  Track{axis: U32, start: U32, best: U32, tainted: Bool, cost: U32}

type Book is Data:
  Book{history: +List<Track>, remaining: U32, rounds: U32, reorders: U32, served: U32}

def initial() -> Book:
  Book{Nil{}, 0, 0, 0, 4294967295}

def cost(history: +List<Track>, +axis: U32) -> U32:
  match history:
    case Nil{}: 4294967295
    case Con{Track{other, start, best, tainted, value}, rest}:
      C.pick(U32.is_eq(other, axis), value, cost(rest, axis))

def select_track(equal: Bool, entry: Track, other: Track) -> Track:
  match equal:
    case True{}: entry
    case False{}: other

def get(history: +List<Track>, +axis: U32, +nodes: U32, +best: U32) -> Track:
  match history:
    case Nil{}: Track{axis, nodes, best, False{}, 4294967295}
    case Con{+entry, rest}:
      match entry:
        case Track{other, start, old, tainted, value}:
          select_track(U32.is_eq(other, axis), entry, get(rest, axis, nodes, best))

def sync(equal: Bool, track: Track, nodes: U32, best: U32) -> Track:
  match equal track:
    case True{} track: track
    case False{} Track{axis, start, old, tainted, value}:
      Track{axis, nodes, best, True{}, 4294967295}

def synchronized(+track: Track, nodes: U32, +best: U32) -> Track:
  match track:
    case Track{axis, start, old, tainted, value}:
      sync(U32.is_eq(old, best), track, nodes, best)

def update(changed: Bool, crossing: Bool, track: Track, +nodes: U32, best: U32) -> Track:
  match changed crossing track:
    case True{} _ Track{axis, start, old, tainted, value}:
      Track{axis, nodes, best, True{}, 4294967295}
    case False{} True{} Track{axis, start, old, tainted, value}:
      Track{axis, nodes, best, False{}, C.pick(tainted, value, (nodes - start : U32))}
    case False{} False{} track: track

def sample(event: O.ContourEvent, track: Track) -> Track:
  match event:
    case O.ContourEvent{axis, S.Meta{a, p1, ceiling, b, length, c, bound, d, e, f, g}, S.Meta{h, next_p1, next_ceiling, i, +next_length, j, next_bound, k, next_nodes, l, m}}:
      update(U32.is_ne(length, next_length), U32.is_ne(p1, next_p1) || U32.is_ne(ceiling, next_ceiling) || U32.is_ne(bound, next_bound), track, next_nodes, next_length)

def collect(events: +List<O.ContourEvent>, track: Track) -> Track:
  match events:
    case Nil{}: track
    case Con{event, rest}: collect(rest, sample(event, track))

def choose_store(equal: Bool, track: Track, entry: Track, rest: +List<Track>, replaced: +List<Track>) -> +List<Track>:
  match equal:
    case True{}: track <> rest
    case False{}: entry <> replaced

def store(history: +List<Track>, +track: Track, +axis: U32) -> +List<Track>:
  match history:
    case Nil{}: [track]
    case Con{+entry, +rest}:
      match entry:
        case Track{other, start, best, tainted, value}:
          choose_store(U32.is_eq(other, axis), track, entry, rest, store(rest, track, axis))

def history_after(improve: Bool, events: +List<O.ContourEvent>, track: Track, history: +List<Track>, axis: U32) -> +List<Track>:
  match improve:
    case True{}: store(history, collect(events, track), axis)
    case False{}: history

def exact(task: P.Task) -> Bool:
  match task:
    case P.Task{axis, stack, S.Meta{a, b, c, d, e, mode, f, g, h, i, j}}: S.is_exact(mode)

def tag(task: P.Task) -> U32:
  match task:
    case P.Task{axis, stack, S.Meta{a, b, c, d, e, mode, f, g, h, i, j}}:
      (axis + C.pick(S.is_exact(mode), 8, 0) : U32)

def score(task: P.Task, history: +List<Track>) -> U32:
  match task:
    case P.Task{axis, stack, meta}: cost(history, axis)

def bit(axis: U32) -> U32:
  (1 << U32.to_nat(axis) : U32)

def mask(tasks: +List<P.Task>) -> U32:
  match tasks:
    case Nil{}: 0
    case Con{P.Task{+axis, stack, S.Meta{a, b, c, d, e, mode, f, g, h, i, j}}, rest}:
      (C.pick(S.is_exact(mode), 0, bit(axis)) .|. mask(rest) : U32)

def code(tasks: +List<P.Task>) -> U32:
  match tasks:
    case Nil{}: 0
    case Con{head, rest}: (tag(head) + 1 + 16 * code(rest) : U32)

def place(before: Bool, entry: P.Task, head: P.Task, rest: +List<P.Task>, later: +List<P.Task>) -> +List<P.Task>:
  match before:
    case True{}: entry <> head <> rest
    case False{}: head <> later

def insert(tasks: +List<P.Task>, +entry: P.Task, +value: U32, +history: +List<Track>) -> +List<P.Task>:
  match tasks:
    case Nil{}: [entry]
    case Con{+head, +rest}:
      place(U32.is_le(value, score(head, history)), entry, head, rest, insert(rest, entry, value, history))

def include(skip: Bool, entry: P.Task, value: U32, history: +List<Track>, tasks: +List<P.Task>) -> +List<P.Task>:
  match skip:
    case True{}: tasks
    case False{}: insert(tasks, entry, value, history)

def gather(tasks: +List<P.Task>, +history: +List<Track>) -> +List<P.Task>:
  match tasks:
    case Nil{}: Nil{}
    case Con{+head, rest}: include(exact(head), head, score(head, history), history, gather(rest, history))

def chosen(exact: Bool, original: P.Task, replacement: P.Task) -> P.Task:
  match exact:
    case True{}: original
    case False{}: replacement

def sorted_tail(exact: Bool, original: +List<P.Task>, remaining: +List<P.Task>) -> +List<P.Task>:
  match exact:
    case True{}: original
    case False{}: remaining

def merge(tasks: +List<P.Task>, sorted: +List<P.Task>) -> +List<P.Task>:
  match tasks sorted:
    case Nil{} _: Nil{}
    case Con{head, rest} Nil{}: head <> merge(rest, Nil{})
    case Con{+head, rest} Con{+entry, +tail}:
      chosen(exact(head), head, entry) <> merge(rest, sorted_tail(exact(head), entry <> tail, tail))

def arrange(start: Bool, enabled: Bool, +tasks: +List<P.Task>, book: Book) -> +List<P.Task> & Book:
  match start enabled book:
    case False{} _ book: (tasks, book)
    case True{} False{} Book{history, remaining, rounds, reorders, served}:
      (tasks, Book{history, mask(tasks), (rounds + 1 : U32), reorders, served})
    case True{} True{} Book{+history, remaining, rounds, reorders, served}:
      +next = {merge(tasks, gather(tasks, history)) : +List<P.Task>}
      (next, Book{history, mask(next), (rounds + 1 : U32), (reorders + C.pick(U32.is_ne(code(tasks), code(next)), 1, 0) : U32), served})

def ready(result: +List<P.Task> & Book, table: Array<U32>, root: C.Cubie, best: +List<U32>, length: U32, lower: U32, nodes: U32, request: P.Request) -> P.Session & Book:
  match result:
    case Tuple{tasks, book}: (P.Session{table, tasks, root, best, length, lower, nodes, request, S.Running{}}, book)

def prepare(enabled: Bool, result: P.Session & Book) -> P.Session & Book:
  match result:
    case Tuple{P.Session{table, tasks, root, best, length, lower, nodes, request, S.Running{}}, Book{history, +remaining, rounds, reorders, served}}:
      ready(arrange(U32.is_eq(remaining, 0), enabled, tasks, Book{history, remaining, rounds, reorders, served}), table, root, best, length, lower, nodes, request)
    case result: result

def book_after(first: Bool, history: +List<Track>, remaining: U32, rounds: U32, reorders: U32, served: U32) -> Book:
  match first:
    case True{}: Book{Nil{}, 0, rounds, reorders, served}
    case False{}: Book{history, remaining, rounds, reorders, served}

def finish(result: P.Session & +List<O.ContourEvent>, book: Book, +axis: U32, +improve: Bool, +before: U32, track: Track, served: U32) -> P.Session & Book:
  match result book:
    case Tuple{P.Session{table, tasks, root, best, +length, lower, nodes, request, status}, events} Book{history, remaining, rounds, reorders, old_served}:
      (P.Session{table, tasks, root, best, length, lower, nodes, request, status}, book_after(U32.is_eq(before, 31) && U32.is_lt(length, 31), history_after(improve, events, track, history, axis), (remaining .&. (4294967295 .^. C.pick(improve, bit(axis), 0) : U32) : U32), rounds, reorders, served))

def work(+limit: U32, state: P.Session) -> P.Session & +List<O.ContourEvent>:
  match state:
    case P.Session{table, Con{P.Task{+axis, stack, S.Meta{a, b, c, d, e, +mode, f, g, +local_nodes, h, i}}, tasks}, root, +best, +length, lower, nodes, request, S.Running{}}:
      +quantum = C.pick(S.is_exact(mode), 60000, 20000)
      O.finish(O.run(U32.to_nat(C.pick(U32.is_lt(limit, quantum), limit, quantum)), axis, (S.Search{table, stack, S.Meta{a, b, c, Y.to_local(axis, best), length, mode, f, g, local_nodes, h, i}}, Nil{})), tasks, root, best, length, request, axis, local_nodes, nodes, lower)
    case state: (P.advance(state), Nil{})

def advance_ready(limit: U32, result: P.Session & Book) -> P.Session & Book:
  match result:
    case Tuple{P.Session{table, Con{P.Task{+axis, stack, S.Meta{a, b, c, d, e, +mode, f, g, +local_nodes, h, i}}, tasks}, root, best, +length, lower, nodes, request, S.Running{}}, Book{+history, remaining, rounds, reorders, served}}:
      finish(work(limit, P.Session{table, P.Task{axis, stack, S.Meta{a, b, c, d, e, mode, f, g, local_nodes, h, i}} <> tasks, root, best, length, lower, nodes, request, S.Running{}}), Book{history, remaining, rounds, reorders, served}, axis, S.is_improving(mode), length, synchronized(get(history, axis, local_nodes, length), local_nodes, length), (axis + C.pick(S.is_exact(mode), 8, 0) : U32))
    case Tuple{state, book}: (P.advance(state), book)

def advance(enabled: Bool, result: P.Session & Book) -> P.Session & Book:
  advance_ready(60000, prepare(enabled, result))

def admitted(allowed: Bool, enabled: Bool, result: P.Session & Book, limit: U32) -> P.Session & Book:
  match allowed:
    case True{}: advance_ready(limit, prepare(enabled, result))
    case False{}: result

def budget_advance(enabled: Bool, +budget: U32, result: P.Session & Book) -> P.Session & Book:
  match result:
    case Tuple{P.Session{table, tasks, root, best, length, lower, +nodes, request, status}, book}:
      admitted(U32.is_lt(nodes, budget), enabled, (P.Session{table, tasks, root, best, length, lower, nodes, request, status}, book), (budget - nodes : U32))
