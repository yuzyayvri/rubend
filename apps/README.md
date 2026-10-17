# Local application

`server.mjs` serves only loopback and manages the native Bend worker through
`engine.mjs`. `model.mjs` is a checked codec around Bend-generated JavaScript;
it is not a second solver. `web/` contains the Three.js view and controls.

Run the packaged app with `nix run .`, or use `just dev` inside the development
environment after installing locked npm dependencies. No browser opens
automatically. Agent previews must remain hidden.

See [CURRENT.md](../docs/CURRENT.md), the
[application design](../docs/design/APPLICATION.md), and the
[verification report](../docs/verification/PORTFOLIO.md).
