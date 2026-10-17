# Third-party notices

Original Rubend code is GPL-3.0-or-later, copyright 2026 Yuzy.

The native compiler emits Bend runtime code into the executable. Bend 2.0.37 is
Apache-2.0, copyright the Bend authors. Its full license is retained in
[`licenses/Bend-Apache-2.0.txt`](licenses/Bend-Apache-2.0.txt). The compiler is
provided through the pinned upstream flake; its release tag is
`4ff8545f19b09b7d2b8ca2303668100eac8efd66`. Rubend does not modify upstream Bend.

The browser bundle uses Three.js 0.186.1, MIT, copyright 2010–2026 Three.js
authors. See [`licenses/Three-MIT.txt`](licenses/Three-MIT.txt). Its bundled
license notices remain in the generated browser artifact.

Node.js, Clang, Lean, Nix tooling, and esbuild retain their respective upstream
licenses. Their pinned packages supply their own notices. Lean and the BendTT
kernel are build/proof-checking dependencies, not services required by a
running packaged app. The Nix runtime closure contains Node.js and its normal
dependencies, which remain separately licensed.

Cubing.js 0.66.0 is used only for independent development tests and the reference
benchmark. It is not the Rubend search engine and is not included in the shipped
browser bundle or local server. Its original code is dual MPL/GPL with
separately licensed vendored components; consult the installed package and
[upstream notices](https://github.com/cubing/cubing.js#license).

The cube model and geometry generator, coordinate code, table builder, search,
portfolio, and replay-certificate code are Rubend implementations. Mathematical
methods are credited in [`docs/research/SOURCES.json`](docs/research/SOURCES.json).
No min2phase, Nissy/H48, or vcube implementation is vendored into the product.
Reference benchmark results are explicitly labeled as external results.

When distributing binaries, retain these notices and provide the corresponding
Rubend source, build inputs, and license as required by GPLv3. This notice does
not relicense third-party work.
