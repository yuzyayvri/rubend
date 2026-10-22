# Application design

The current visual implementation and comparison are recorded in
[the October 22 redesign](REDESIGN-2026-10-22.md). The specification below is
historical; it is not a description of the new layout.

Original design specification. The local application is now implemented; use
[PORTFOLIO.md](../verification/PORTFOLIO.md) for actual checks and limitations.

## Direction

Rubend should feel like a focused cube workbench, not a wall of lab instruments.
A charcoal scene, restrained typography, bright cube stickers, soft contact
shadows, and precise turn animation put the puzzle first. Use a light appearance
as well. Render the actual state, never a decorative cube that disagrees with
the solver. A custom Three.js scene is the provisional choice; evaluate
cubing.js/TwistyPlayer in the first spike before locking this in.

```text
 RUBEND                                     Local engine · Ready
 ┌────────────────────────────────┬───────────────────────────┐
 │                                │ Your cube                 │
 │       draggable 3D cube        │ [Scramble] [Edit stickers] │
 │       with U / F labels        │ [Paste moves or facelets] │
 │                                │                           │
 │       orbit / zoom / home      │ Search                    │
 │                                │ [Fast + improve v]        │
 │                                │ [       Solve       ]     │
 ├────────────────────────────────┴───────────────────────────┤
 │ Solution: move sequence, populated only by the real engine │
 │ [Back] [Play] [Forward]    step / total    speed    [Copy]   │
 │ Best length · lower bound · verified / searching / optimal │
 └────────────────────────────────────────────────────────────┘
```

No fabricated solve lengths or timings are used in this design. A real visual
prototype belongs to the implementation phase. Narrow layouts put the cube
above controls and keep playback reachable without horizontal scrolling.

## Cube interactions

- Orbit with pointer drag; zoom within useful limits; reset the camera without
  changing puzzle state. Touch has separate orbit and turn gestures.
- Face-turn buttons and keyboard `U R F D L B`; explicit inverse/half-turn
  modifiers; visible key hints. Avoid grabbing keys while editing text.
- Input accepts standard outer-face moves and a canonical 54-facelet string.
  A labeled 2D net supports sticker editing, including hidden faces. Explain
  flipped edges, twisted corners, and parity errors plainly.
- A scramble is recorded as a reproducible sequence. Offer distinct random-move
  and uniform-random-legal-state generation; do not confuse their distributions.
- Camera orientation never changes the canonical move frame silently. Mark
  reference faces and provide a deliberate frame-normalization action.

## Solve and playback

Fast + improve returns verified candidates and keeps searching under a stated
budget. Exact mode continues complete search; it does not promise instant
optimality. Controls show elapsed time, best HTM length, established lower bound,
and the actual result status. Advanced node counts/memory are collapsible.

Playback has play/pause, next/previous turn, move-list selection, a position
slider, and adjustable speed. Keep the committed canonical state separate from
the fractional animation pose. At the end of a turn, snap to exact integer
geometry and replay state. Scrubbing reconstructs from canonical replay or
checked checkpoints; it does not accumulate float rotations.

Each search has an input revision and job ID. Changing the cube invalidates its
result, cancels the old job, and ignores late responses. Cancel preserves the
best verified solution and last completed lower bound. A no-answer timeout
does not claim that the cube is impossible. Finishing animation alone does not
mark a solution valid; replay does.

## Accessibility and resilience

Face letters and optional sticker patterns complement color. Offer keyboard
operation, readable contrast, reduced motion, focus visibility, and status text
for screen readers. A 2D net remains usable without WebGL. Test context loss,
renderer failure, engine crash/restart, table initialization, table corruption,
invalid input, cancellation, and zero-move solutions.

Never require a public service for normal solving. Serve only on loopback, with
origin checks, bounded messages, and a per-session capability. Do not expose a
native process endpoint to arbitrary websites. File paths and executable names
are not accepted from browser messages. No analytics or uploads by default.

## Transport proposal

Start with a small Node.js local bridge, not a second solver. Use a versioned,
strictly validated browser message format and a bounded ASCII line protocol to
the native process. This avoids requiring Bend to grow an HTTP/JSON stack.
Return explicit `progress`, `candidate`, `completed`, `cancelled`, and `error`
events, each with the job ID and input revision. Stop work between small search
slices so the event loop can service cancellation. Killing the worker process
is a fallback, not proof that a timeout cancels descendant work.

The browser uses a worker for Bend-generated model/replay work. DOM and rendering
stay in the main thread. Verify the generated ABI through explicit codecs:
the setup probe already shows that this compiler exports Boolean values as JS
primitives, so a generic constructor-object assumption is not safe.

Sources: [Three.js](https://threejs.org/docs/pages/WebGLRenderer.html),
[OrbitControls](https://threejs.org/docs/pages/OrbitControls.html),
[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers),
[Bend JS emitter](https://github.com/bendlang/bend/blob/v2.0.37/bend2/comp.ts).
