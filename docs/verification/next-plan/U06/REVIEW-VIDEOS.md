# Sampled videos for operator review

The accepted demand-rendering app already has functional browser evidence and
review stills. This pass adds short sampled full-page clips for its existing
desktop, narrow fallback and model-worker-failure interactions. It changes no
application source, default, proof label or package.

The CUA driver operates real controls against the unchanged rebuilt native app.
An independent geometry model checks committed replay at scenario boundaries.
Actual full-page screenshots are captured serially between actions and during
slow playback. No background sampler shares the screenshot channel. Each source
frame keeps its file hash and capture timestamp. The desktop clip covers native
solve/export, animated and reduced-motion playback, rewind, camera and idle.
The narrow fallback clip covers its native solve and playback. The failure clip
covers rewind failure, repeated Space presses, responsive timers and retained
export. Temporary viewport changes are reset and owned tabs close before fixture
shutdown. Native owners and IPC must stop cleanly.

The clips retain the observed intervals between samples. They are sampled UI
review evidence, not real-time screen capture or active frame-cadence benchmarks.
Intermediate animation pixels are not committed cube states. Only completed
phase boundaries are replay assertions. Screenshots and videos are not operator
approval. Clipboard denial and actual downloaded-file verification stay open in
the IAB connection. Do not relabel either as passed.

An existing local FFmpeg/FFprobe pair encodes H.264 on one CPU thread. No package,
browser extension or GPU stack is installed. Source frames, encoder arguments,
tool hashes, video probe data and decoded-frame hashes are retained. Every clip
must decode with multiple distinct frames and the expected sampled duration.
Raw frame sequences stay under build. Small reviewed clips can be archived only
after the canonical queue checker verifies all seals, receipts and cleanup.

`u06-review-video-v3` has sequential desktop, fallback, failure, encoding and
confirmation jobs. Expected six minutes, hard cap thirteen. Fixture jobs request
1 GiB on low-priority CPU2, encoding and confirmation 512 MiB, with the desktop
reserve. The browser itself is outside that cgroup, as in prior accepted checks.
No enforced browser CPU/RSS or performance gain is claimed. No new data, theorem,
holdout, publication, merge, release or deployment is included.

The unlaunched v1 plan is retained. V2 additionally freezes the tracked queue
pointer and explicit tab/viewport cleanup receipts before any fixture starts.

## Capture-channel recovery

V2 failed when its background sampler overlapped the existing helpers' own
screenshot calls. The app had completed its native four-move solve correctly.
Both sampled frames, solve diagnostics and actual clean tab/native/IPC shutdown
are preserved in [the failed record](u06-review-video-v2-failed/index.json) and
[browser snapshot](u06-review-video-v2-failed/browser-failure-and-cleanup.json.gz).
Read [the overlap record](../../../issues/browser-review-capture-overlap.md).

V3 gives screenshot capture one serial owner. No background task, retry loop,
browser visibility change or product modification is used. It records named
states between semantic actions and serial samples during slow playback.
The complete scenario and encoding checks remain required. The failed run stays
failed, and no partial image sequence is presented as a finished review video.

## Result

The [canonical archive](u06-review-video-v3/index.json) verifies 2,860 source
seals and all five resource receipts. The worker is gone, with no resource stop.
All three scenarios pass independent committed-state replay. Desktop verifies
native solve/export, animated and reduced-motion playback, rewind, actual
camera drag and idle. Narrow fallback solves and plays without WebGL. The failed
model retains its committed step and export after repeated Space and arrow keys.
All owned tabs close, the temporary narrow viewport resets, and fixtures,
native owners and IPC stop cleanly. No application source changed.

The [media archive](review-video-v3-indexed/index.json) contains the verified
H.264 clips and previews decoded from them.

| Scenario | Clip | Sampled frames | Decoded frames | Duration | Bytes |
| --- | --- | ---: | ---: | ---: | ---: |
| Desktop | [Video](review-video-v3-indexed/desktop.mp4) | 11 | 12 | 22.92 s | 339,304 |
| Narrow fallback | [Video](review-video-v3-indexed/fallback.mp4) | 8 | 9 | 11.48 s | 104,879 |
| Worker failure | [Video](review-video-v3-indexed/failure.mp4) | 7 | 8 | 2.72 s | 155,300 |

The extra decoded frame is the explicit final duplicate used to hold the last
sample. Source timestamps and hashes are retained. Multiple source and decoded
frames differ. These durations describe sampled review media, not application
latency or frame cadence. The fixture's diagnostic controls can appear in the
images. They are not newly shipped interface elements.

Visual inspection found that the first time-seek previews selected the next
coded frame instead of their intended held image. The original media archive
and mismatch are preserved. The corrected archiver requires source/decoded
frame-count correspondence, selects by frame index and compares the image
through the original scale/pad filter. SSIM is 0.997142 for desktop, 0.997343
for fallback and 0.996582 for failure. The old desktop mismatch was 0.809285.
The executable regression also rejects reuse with an old archiver revision and
confirms stable repeated archiving. Video bytes do not change during this repair.
Read [the preview alignment record](../../../issues/review-preview-frame-alignment.md).

The actual decoded previews were inspected. The copied media and poster work
also has bounded resource receipts. Existing local tools were reused on one CPU
thread, without installing software. The original overlapping screenshot run
stays failed. A fresh CUA kernel was used after editing the driver because its
module loader does not support query-suffixed imports.

This closes the sampled-video evidence gap. It does not supply operator approval,
clipboard denial, downloaded-file acceptance, final package rollout, independent
review or general browser performance evidence. The holdout remains untouched.
