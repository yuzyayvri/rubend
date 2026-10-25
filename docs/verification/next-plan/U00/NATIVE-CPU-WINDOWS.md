# CPU accounting for isolated native requests

This unit checks initialization and warm-request CPU windows in an isolated
ordinary Light benchmark. It does not change production protocol or claim a
solver speedup. Existing warm host events report wall time, not exact in-process
CPU. The calibrated [process CPU clock](PROCESS-CPU-CLOCK.md) supplies that
missing measurement.

## Ownership and measurement contract

The native benchmark imports the actual `src/main.bend`, `src/portfolio.bend`,
`src/search.bend` and `src/tables.bend`. One affine table owner initializes the
ordinary Light table once and serves a fixed request file. It uses actual
`P.initialize` and `P.advance`, with no search-policy edits. This is not the
private packed-small profile or the installed application request loop.

Initialization starts after the request file has been read and closed. It
includes ordinary Light generation, checked capacity and capacity output.
Each warm request includes facelet parsing, validation, portfolio initialization,
fixed portfolio work and final certificate/snapshot serialization and output.
The benchmark consumes the complete snapshot before taking the ending sample.
The CPU windows exclude later timing records and process teardown. Their sum
is compared with GNU Time's whole-command CPU using the calibrated 30-ms
quantization allowance and 100-ms outside-window allowance.

The pair of U32 seconds/nanoseconds counters is checked with BigInt subtraction.
Windows are disjoint and monotone. Enabled counters fail on clock errors.
Clock-off controls are explicitly unavailable, with null CPU in host records,
never measured zero. No observer overhead is subtracted. Native maximum RSS
from GNU Time remains distinct from the resource runner's aggregate tree peak.

## Solo design decision

Host `/proc` sampling at event arrival would add tick quantization and event
delivery delay to the boundary. Native brackets avoid those ambiguities and
reuse the calibrated effect. The chosen isolated file-request adapter leaves
the public engine protocol and existing wall-time studies unchanged.
One binary runs with the clock enabled or disabled. The host compares all
final search-state fields and independently replays every emitted answer.
This is sequential design exploration, not independent review.

## Fixed development calibration

The recovery batch is `u00-native-cpu-v2`. Five alternating cohorts each start one
clock-on and one clock-off native process on CPU2. Every owner handles the
same eight requests, with request order reversed on alternate cohorts.
Four shallow exact guards cover solved, U, R and F. The first two existing
development roots supply one fast and one exact case, each repeated twice.
All eight requests use twenty portfolio slices, at most 400,000 fast or 1,200,000 exact
state-machine steps. These are development inputs, not untouched release cases.

All eighty requests, forty measured request windows, five measured initialization
windows and ten whole-command records are retained. Missing answers are valid
observations, not deleted requests. Shallow optima, every candidate replay,
clock-on/off equality and repeated-order equality must pass. Ten actual record
mutations reject missing counters, wall substitution, backwards/missing/duplicate
windows, identity mismatch, disabled-as-zero, wrong capacity, impossible work
and altered answers. Synthetic tests exercise the same boundary before launch.

Five-sample CPU and wall medians and ranges are reported per request.
A request shorter than 100 ms or with more than 5% spread has no stable timing
verdict. This unit cannot establish first-answer CPU, a pure-search cost,
whole-application speed, an observer-overhead ratio or the cause of historical
A/A noise. It does not repeat an unchanged historical comparison for a win.

The [first failed batch](u00-native-cpu-v1-failed/index.json) preserves 3,278
seals, both executed receipts, worker cleanup and its first native record.
Its compile, pure-helper verdict and emitted-storage checks pass. One slice
finds the correct one-move answer but does not finish the exact contour.
The unchanged completion assertion rejects that insufficient guard budget.
See the [budget defect](../../../issues/native-cpu-shallow-contour-budget.md).

Recovery changes only the four shallow budgets from one to twenty slices.
Development inputs, their budgets and all correctness requirements stay fixed.
An executable regression replays the original incomplete U-turn record and
requires rejection. The passing native binary, full source graph, emitted C
and helper verdict are hash-verified and reused. No compilation or proof check
is repeated on unchanged sources. Explicit binary metadata selects the retained
owner while records are written to a fresh directory.

Prepare and confirmation use 512 MiB. The serial observation uses 2 GiB on
CPU2. Expected one minute with a six-minute cap. The current desktop reserve
and no-swap policy remain active. The unchanged 87-input root gate is explicitly
reused. No raw joint cache, new database, competitor, browser, final holdout,
new law or publication.

## Verified accounting result

The [canonical recovery archive](u00-native-cpu-v2/index.json) verifies 3,290
source seals and three resource receipts. The worker is gone, and no resource
stop occurred. All eighty requests, eighty independent candidate replays,
forty measured warm windows and ten actual record mutations pass. Every
shallow guard establishes its known optimum. Clock-on/off and repeated-order
final search states are identical, including the retained task and frame data.
The actual failed one-slice U record still fails the completion requirement.

Five clock-on processes measure initialization CPU at median 218.041 ms,
range 216.704 to 218.176 ms. The following request CPU values each have five
observations. Copies are repeated requests on the same two development roots,
not extra independent cubes.

| Request | Minimum CPU, ms | Median CPU, ms | Maximum CPU, ms |
| --- | ---: | ---: | ---: |
| Development 0 fast, first copy | 13.306 | 16.762 | 17.091 |
| Development 0 fast, second copy | 13.053 | 14.220 | 16.068 |
| Development 1 exact, first copy | 15.486 | 16.741 | 17.844 |
| Development 1 exact, second copy | 15.218 | 16.156 | 19.467 |

Every warm request is below the frozen 100-ms floor. These short windows have
no stable timing verdict, even when a particular shallow guard has less than
5% spread. This is accepted CPU accounting, not accepted solver performance.
GNU Time whole-command CPU ranges from 280 to 290 ms including initialization
and all eight requests. All five disjoint measured sums agree within the frozen
quantization allowance. Clock-off windows remain null in host results.
No overhead correction or first-answer CPU is inferred.

Maximum native RSS is 44,028 KiB. The outer observation job peaks at 254,572 KiB
aggregate tree RSS including host and measurement processes. These figures have
different scopes. They do not describe larger profiles or installed-app memory.

The original helper verdict and native compilation pass in v1 and are reused
unchanged in v2. The v2 confirmation incorrectly retains a constant
`pureHelperFreshVerdict: true` from the initial compile path. Its compile and
recovery records correctly say reused. The
[checked interpretation](u00-native-cpu-v2/interpretation.json.gz) records this
erratum without changing original bytes. `bench/native-cpu-evidence.mjs`
verifies the actual archived counters, source and artifact hashes, identifies
the overstatement, and rejects a fresh-proof interpretation. Its
[bounded check receipt](u00-native-cpu-v2/interpretation-resource.json.gz)
passes. The confirmation producer now derives both fresh and reused flags
from the actual compile disposition.

The root87 gate remains source-identically reused. Historical A/A attribution,
first-answer CPU, production integration and the final benchmark remain open.
No release holdout is opened, no competitor is set up, and no stronger formal
or performance label is enabled. Independent review is not run.
