# Startup fixture cleanup needs process identity

Status is resolved. The independent measurement review found that the fixture
suite's final cleanup signaled accumulated numeric PIDs, including workers
already confirmed exited. PID reuse could target an unrelated process. Its
liveness checks and the measurement's RSS sampling also need to distinguish
process identity from a recycled number.

The suite now sends no cleanup signals to historical PIDs. Liveness checks use
PID plus Linux start ticks. RSS sampling checks that identity through one opened
process-directory descriptor before reading status. Regressions cover simulated
PID reuse and an unexpected signal before ready. All 30 cases and 97 worker
cleanup checks passed, and independent Luna re-review approved freezing.

Evidence is `.audit/rubend-startup-review-notes.md` and
`docs/verification/optimization-v1/startup-measure-fixtures.json`.
