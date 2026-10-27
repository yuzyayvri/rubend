# Overlapping review screenshot callers failed in IAB

The first launched review-video queue used a background screenshot sampler
while existing UI helpers also saved screenshots. Two sampled images completed.
The actual native four-move solve and its diagnostics passed, then the browser
reported `Unable to capture screenshot` before the helper returned.
The source had overlapping screenshot callers on the same tab. This is a
capture-transport failure, not evidence of an application or renderer defect.

The [failed archive](../verification/next-plan/U06/u06-review-video-v2-failed/index.json)
preserves all 2,849 source seals and its resource receipt, worker gone.
The [browser and cleanup snapshot](../verification/next-plan/U06/u06-review-video-v2-failed/browser-failure-and-cleanup.json.gz)
retains both images, the exact error, valid native solve diagnostics, actual tab
closure and clean native/IPC shutdown. No failed clip is presented as a video.

The recorder now has one serial screenshot owner. It captures between semantic
actions, with a few serial observations during slow playback. Existing helper
captures finish before the next review frame. There is no retry loop, browser
visibility change or application patch. Sample timestamps remain explicit.
This changes the recording mechanism rather than repeating the same overlap.
The [complete v3 guard](../verification/next-plan/U06/u06-review-video-v3/index.json)
now passes all three flows, serial captures, encoding, decoded frames and actual
tab/native/IPC cleanup. No screenshot retry loop or product change was needed.
