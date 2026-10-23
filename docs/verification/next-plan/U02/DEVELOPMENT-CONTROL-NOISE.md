# Development control is not stable enough

The [development confirmation](u02-axis-cost-confirm-v1/index.json) passed
receipt verification with 1,645 seals, four resources, no stop and its worker
gone. The measurement outcome is inconclusive. One same-binary cohort differs
by 5.33 percent, outside the fixed five-percent gate. The runner correctly
skipped A/B. No retry or relaxed threshold replaces that result.

The five paired A/A ratios are 1.0038, 1.0533, 1.0339, 1.0143 and 0.9975.
The failed pair takes 3,433 versus 3,616 native milliseconds for identical
twenty-million-step cohorts. Its process CPU ticks also rise from 340 to 358.
Most of the difference is in the first two cases. Thus scheduler delay alone
is not an adequate explanation. The receipt does not identify the cause of the
additional on-CPU time. Frequency, cache effects and external contention remain
hypotheses, not findings.

The longer profiler records about four sampled CPU seconds. Leading samples
now fall in packed lookup and array-read code. `spin_16` decodes a joint-table
nibble, and the sampled `COMMAND_C453` region includes the second small-bound
lookup from `Search.bound_x`. Initialization is still visible but no longer
dominates the largest entries. These are instrumented source-location samples,
not measured memory bandwidth, cache-miss counts or a precise latency model.

## One control-only diagnostic

The next fixed batch reuses the already verified control binary. It does not
rebuild Search, rerun candidate acceptance or compute a new A/A verdict.
Six fresh workers each run the same four development cases at five million
advances, with reversed case order on alternate workers. Results must match
the saved confirmation results.

Each request records Linux scheduler runtime and runnable-wait counters,
minor and major faults, voluntary and involuntary switches, selected processor,
and the observer's own CPU. The selected lane's current frequency is sampled
every 100 milliseconds when available. Missing frequency information is null.
Scheduler counters sum every process thread. Thread identities and individual
counters are preserved, and a membership change rejects the observation.
Process CPU ticks and faults remain process counters rather than thread sums.
The observation window includes request submission and output. These counters
are diagnostic evidence, not uninstrumented timings or proof of causation.

No kernel, affinity policy, governor, ASLR or security settings change. Work
stays on the same low-priority CPU lane with three GiB and a three-minute cap.
Expected duration is two minutes. The existing half-hour heartbeat checks it.

```sh
nix develop --command node bench/u02-noise-diagnostic.mjs plan u02-noise-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-noise-v1-plan.json
```

The focused parser checks process names containing parentheses, every counter
field, deltas, malformed input, missing counters, process replacement and
regression. The runner verifies the previous compiled artifacts and unchanged
production, proof and toolchain-fixture sources before reusing their passing
evidence. New telemetry does not change those sources. Independent review
remains not run. The original pilot hint remains unconfirmed, and production
defaults remain unchanged.
