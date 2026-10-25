# Time seeking selected the next coded review frame

The review videos passed full source hashes, duration, H.264 decode and
frame-distinctness checks. The first media archiver extracted a preview at a
source frame's presentation timestamp plus 50 ms. In these variable-frame-rate
clips, accurate seeking selects the next coded frame rather than the image
being held on screen. The intended answer preview showed the export dialog.

Visual inspection found the mismatch. An executable source-image comparison
measures SSIM 0.809285 for that desktop preview, below the 0.96 alignment guard.
The original script, comparison command, diagnostic and hashes are preserved in
[the before record](../verification/next-plan/U06/review-video-v3/preview-alignment-before.json.gz).
The original previews and media index remain unchanged and superseded.
The videos themselves are not reclassified or rerun.

The archiver now requires exactly one decoded frame per source image plus the
explicit final duplicate. It selects the intended decoded frame by index,
then compares it against that source image through the same scale/pad filter.
A mismatched or missing index fails instead of guessing a timestamp.
Existing archives also require the same archiver source hash before reuse.
New previews go to a fresh destination. No browser capture or app source changes.

The [corrected media archive](../verification/next-plan/U06/review-video-v3-indexed/index.json)
passes source-image SSIM 0.997142, 0.997343 and 0.996582 for desktop, fallback
and failure. Its executable regression preserves the old 0.809285 disagreement,
checks exact accepted video hashes, rejects the stale archiver revision and
confirms idempotent reuse of the current archive. All decoded previews were
visually inspected. The original videos and captures were not rerun.
