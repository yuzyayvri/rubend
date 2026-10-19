# Rubend

A Rubik's cube solver built in [Bend 2](https://github.com/bendlang/bend).
Short solutions, honest answers, and a cube you can actually play with.

Turn the cube, enter a scramble, find a solution, and play it back at your own
pace. Rubend runs locally, with a native solver and an interactive 3D workbench.

![The Rubend workbench](docs/verification/portfolio-v1/ui-desktop.jpg)

## Explore the cube

- Paste a scramble or edit stickers, with checks for impossible cube states.
- Use **Fast** for a quick answer, or **Exact** to also search for the shortest
  solution. If time runs out, keep the best verified answer found so far.
- Play, pause, seek, and step through a solution forward or backward.
- Export a replay-checked solution record, including its search bounds.
- Use the sticker net when 3D rendering is unavailable.

Rubend solves the standard fixed-center 3×3 cube. It counts a half-turn as one
move, just like a quarter-turn.

## Bend at the core

The search, cube rules, pruning-table generation, and replay checks are written
in Bend 2. JavaScript supplies the local service and interface, not a hidden
third-party solver.

Cube laws and the accepted-solution replay boundary are checked with Bend and
its independent proof kernel. A verified solution means its moves solve the
input. A completed optimal search is a stronger result; the full search engine
has not been formally certified. Rubend keeps those claims separate.

## Run locally

From a checkout with Nix installed:

```sh
nix run .
```

The current Nix package targets x86-64 Linux. It pins Bend 2.0.37, Node.js, and
the proof checker. The first build also downloads the matching Lean toolchain,
so setup can take a while. No system configuration changes are required.

Open the local address printed in the terminal; no window opens automatically.
Everything stays on your machine. The standard app uses small pruning tables.
Larger experimental profiles are opt-in and are not loaded or generated during
normal startup.

For development:

```sh
nix develop
npm ci --ignore-scripts
just dev
```

Use `just check` for the proof/toolchain checks and `just test` for the build,
independent cube checks, solver tests, and local-service tests.

## How strong is it?

Rubend is a working solver and an early development project. It finds short
answers and establishes shallow optima, but difficult optimal solves can take
longer than the available budget. It does not yet claim state-of-the-art speed
or general formally certified optimality.

See the [performance and roadmap overview](docs/verification/ROADMAP-REPORT-2026-10-19.md)
for measured results, memory tradeoffs, and what remains. Experimental tables
and scheduling policies are adopted only when their results justify them.

The [current status](docs/CURRENT.md) records the latest results and unfinished
work. The [build plan](docs/PLAN.md) covers the longer-term goals, and the
[research notes](docs/research/FINDINGS.md) explain the choices.

## License

Rubend is free software under the [GNU GPL, version 3 or later](LICENSE).
Copyright © 2026 Yuzy. Third-party tools and any future reused code retain their
own notices and licenses.
