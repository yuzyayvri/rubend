# Redesign verification

The selected paper-workbench UI is implemented locally. It preserves the Bend
model/native transport, source-bound replay, and all sixty controller targets.
The [design record](../../../design/REDESIGN-2026-10-22.md) names the alternatives
and the [keyboard issue](../../../issues/keyboard-seek-during-search.md).

The pre-fix browser probe observed step three instead of zero during active
search with disabled playback controls. The actual-main regression independently
fails at one instead of zero. The frozen control source has the verified digest
`7ede4fbb70e71f632ffdfed80eb263d7c7275b638ca5e5eaa2b8b01f87938e76`.
It can be tested without reverting current source:

```sh
nix develop --command node tests/keyboard-playback.mjs build/experiments/u00-controls-v1/control/apps/web/main.mjs
```

That command is expected to fail specifically on the search-lock assertion.
Current source passes all nine scenarios. Static markup checks find sixty unique
ids and every controller target. Six checked theme text pairs exceed 4.5:1.
Pure rail geometry covers visible, earlier, later, and end positions.

[Final browser evidence](redesign-final-v1/index.json) passes actual rebuilt UI
checks at desktop and narrow sizes. It includes keyboard lock, repeated seeks,
both ends of a long mobile rail, native shallow optimum/export, canonical
playback, stored theme, and sticker-net boundaries/save. A full audit of
accessibility, touch gestures, or rendering performance is not claimed.

The next fixed queue runs a negative frozen-source control and focused checks,
then complete `just test`, then `just check`. Full regression intentionally
rebuilds development artifacts rather than treating the visual prototype as proof.
It also checks saved browser replay, current source identity, and cleanup.

```sh
nix develop --command node bench/u01-redesign-checks.mjs plan u01-redesign-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u01-redesign-v1-plan.json
```

The serial job caps are three, twenty, and three minutes. Each requests three
GiB and leaves the existing eight-GiB desktop reserve. Full regression/proof
can use four low-priority CPU lanes. Expected total duration is twelve minutes,
with a twenty-six-minute hard ceiling. No new tables, benchmark, cloud work,
publication, or automatic model wakeup is part of the queue.

Old GUI/CI receipts remain historical, not relabeled to the new source graph.
The optional delivered-artifact fixture correctly requires matching sources;
the old artifact is not a current redesigned package. Clipboard denial and
actual downloaded-file verification remain open under their observation issue.
Nix sandbox packaging and a new hosted CI artifact are not claimed for this
redesign. Publication remains separately gated.
