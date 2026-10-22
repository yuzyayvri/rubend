# Keyboard seeks bypassed the search lock

Status is fixed. Rebuilt-browser checks, full regression, and proof gates pass
in [the completed source-bound queue](../verification/next-plan/U01/u01-redesign-v1/index.json).
The fix was pushed to main at Yuzy's explicit request on October 22.

The live pre-fix probe pressed ArrowRight three times while the native search
was active and next/play/timeline controls were disabled. The committed step
advanced from zero to three. The focused actual-main regression independently
fails with `1 !== 0`. All seven older keyboard cases pass before that failure.

`play()` already refused active search, and visible seek controls were disabled.
`jump()` omitted that boundary check, so the global arrow handler bypassed the
lock. It now refuses active search at the shared seek entrypoint. Healthy
post-search playback and failure recovery retain their existing checks.

The frozen U00 main source has the same pre-fix digest as the reproduced app.
The keyboard test accepts an explicit source path, so failing-before behavior
can be rerun without reverting current source. This changes no cube or search law.
