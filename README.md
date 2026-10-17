# Rubend

A Rubik's cube solver built in [Bend 2](https://github.com/bendlang/bend).
Short solutions, honest answers, and a cube you can actually play with.

Rubend now has a working local 3D workbench and a native Bend solver. It can
solve legal cubes, improve answers, and search for the shortest solution.
This is an early development version, not a world-class performance claim.

![The Rubend workbench](docs/verification/portfolio-v1/ui-desktop.jpg)

## The idea

- Find a good solution quickly, then keep looking for a shorter one.
- Tell you when a solution is proven shortest—and when it isn't.
- Use Bend's proofs to protect the rules that matter.
- Make it fun to explore: turn a 3D cube, enter a scramble, and play a solution
  forward or backward.

The first version will focus on the standard 3×3 cube. A half-turn counts as one
move. Speed matters, but it won't be a reason to quietly weaken a result.

## Run locally

On this NixOS machine:

```sh
nix run .
```

The environment pins Bend 2.0.37, its native compiler, Node.js, and the independent
proof checker. The first setup also fetches the matching Lean toolchain; it is a
larger download. Nothing needs to be added to the system configuration.

Open the local address printed in the terminal; no window opens automatically.
For development, use `nix develop`, `npm ci --ignore-scripts`, then `just dev`.
Scramble the cube, paste moves,
edit stickers, and play a solution forward or backward. Everything stays on your
machine. Exact search may need more time on difficult positions; a timeout
never means an answer is shortest.

Use `just check` for the proof/toolchain checks and `just test` for the build,
independent cube checks, solver tests, and local-service tests.

## What's next?

The [current status](docs/CURRENT.md) records the latest results and unfinished
work. The [build plan](docs/PLAN.md) covers the longer-term goals, and the
[research notes](docs/research/FINDINGS.md) explain the choices. Replay
certificates and core move laws are checked; the entire search engine has not
been formally certified.

## License

Rubend is free software under the [GNU GPL, version 3 or later](LICENSE).
Copyright © 2026 Yuzy. Third-party tools and any future reused code retain their
own notices and licenses.
