# Late cancellation acknowledgement during the frozen comparison

Status is observed and preserved, with no repair applied to the frozen campaign.
The [first final quality group](../verification/next-plan/U07/u07-final-quality-00-p1/index.json)
records two adapter errors among 5,000 planned attempts. Every slot is retained.
The canonical checker verifies all 4,972 seals and two receipts. The worker is
gone and no resource stop occurred.

## Observed sequence

Both observations use `rubend-default` on CPU3. The affected case IDs are
`release-89` and `release-861`. They fail after 5.203681 ms and 0.582748 ms,
respectively, with no candidate frame in the failed observation. These short
error durations are not successful-answer latencies.

The saved session stdout shows these ordered events.

1. The preceding request emits `done` for request 22 or 192.
2. The adapter resolves that request and starts request 23 or 193.
3. The child emits `cancelled` for the preceding request with `alreadySettled`
   set to true.
4. The adapter rejects the old ID against the new active request. The observed
   assertion differences are `22 !== 23` and `192 !== 193`.
5. The adapter kills that session. Each recorded process owner settles, and the
   worker starts a new initialized session for subsequent unclaimed slots.

The raw evidence is in the archived `quality-lane-3.json` output and its session
stdout, under the canonical index above. The ledger preserves exact slot IDs
`42a410dfe39666ebd9869c4f50d1f810bb8ef5169034005e21fac440610e2e6b` and
`ec61729706afcb009bb7d514b98e3ac2fdde5ab63ba3b408b810cb9c6ebc12b5`.

## Cause and scope

The [second final quality group](../verification/next-plan/U07/u07-final-quality-01-p1/index.json)
records one more instance on `release-1550`, slot
`86e1d7e6ecb4828fb937318cca17bfdbbd93b090f7c271af712be86450b2c58d`.
Its raw session stdout ends with `done 137`, `cancelled 137 alreadySettled`,
then `bound 138`. The assertion difference is `137 !== 138`. The session
settles. This raises the preserved count to three across 10,000 planned slots.
The additional observation does not change the frozen-campaign disposition.

`bench/comparison-node-child.mjs` can emit an `alreadySettled` cancellation
acknowledgement after a request completes. That is a legitimate child event.
`ComparisonActor.line` in `bench/comparison-actor.mjs` ignores an old cancellation
acknowledgement only when no request is active. If the next request has started,
the same legitimate acknowledgement instead reaches the new-request identity
assertion. This is a benchmark-adapter lifecycle defect, not evidence that the
native solver returns an invalid solution.

The identity guard rejects the stale event. No candidate from one request is
accepted as an answer to another. Raw frames and every complete returned answer
remain subject to the unchanged independent replay checks. The two failed
requests still belong in coverage denominators, and their durations cannot
support a speed claim.

The [third final quality group](../verification/next-plan/U07/u07-final-quality-02-p1/index.json)
records the fourth instance, on `release-2411`, slot
`69e22aa7286c4cee401309ebe8a6ef0ea4d464f20166bdf83fad7acc2190dfd1`.
Its raw sequence is `done 102`, `cancelled 102 alreadySettled`, then `bound 103`.
The assertion difference is `102 !== 103`; the session settles. All four errors
remain terminal among the first 15,000 planned attempts. No repair or rerun.

## Frozen-campaign disposition

The [paired fourth-cohort timing group](../verification/next-plan/U07/u07-final-timing-c3-b-p1/index.json)
records one default-profile instance on warm `release-8453`, repeat one.
The raw stream shows `done 22`, late `cancelled 22 alreadySettled`, then the
assertion against request 23. The session settles. Twelve timing errors remain
failed observations, separate from the 35 quality-stage errors. No attempt is
repeated and no failed duration becomes a successful-answer latency.

The [fourth-cohort reverse timing group](../verification/next-plan/U07/u07-final-timing-c3-a-p1/index.json)
records four warm instances. Default exact-request affects `release-1895` in
repeat one. Preserved inverse affects `release-1032` and `release-9590` in
repeat zero. Preserved small affects `release-7993` in repeat one. All four
raw streams contain the prior `done` and late `alreadySettled` acknowledgement,
then next-ID assertion. All sessions settle. Eleven timing errors are now
retained, separate from the 35 quality-stage errors. The exact-request failure
does not become an optimality completion or a short successful latency.

The [paired third-cohort timing group](../verification/next-plan/U07/u07-final-timing-c2-b-p1/index.json)
records two small-profile instances, on warm `release-1032` in repeat zero and
warm `release-7993` in repeat one. Raw streams show the prior `done`, late
`alreadySettled` cancellation, then assertions for requests 31 versus 32 and
18 versus 19. Both sessions settle. Seven timing instances are retained in
addition to the 35 quality-stage instances. No failed attempt is replaced.

The [paired reverse-order timing group](../verification/next-plan/U07/u07-final-timing-c1-b-p1/index.json)
records one Rubend-default instance on warm `release-7022`, repeat zero.
The raw stream shows `done 23`, late `cancelled 23 alreadySettled`, then the
assertion against request 24. The session settles. This is the fifth retained
timing instance, separate from the 35 quality-stage instances. Its short failed
duration cannot support a successful-answer or native-search speed claim.

The [first reverse-order timing group](../verification/next-plan/U07/u07-final-timing-c1-a-p1/index.json)
records two instances in `rubend-u00-small`. They affect warm `release-9590` in
repeat zero and warm `release-7022` in repeat one. The raw streams show completed
request 8 followed by late `cancelled 8 alreadySettled` during request 9, and
the same sequence for requests 23 and 24. Both sessions settle. These remain
failed timing observations. There are now four timing instances in addition to
the 35 quality-stage instances. No repair or replacement run is substituted.

The [paired first-cohort timing group](../verification/next-plan/U07/u07-final-timing-c0-b-p1/index.json)
records two instances in `rubend-u00-inverse`, both warm requests in repeat zero.
They affect `release-4391` and `release-9332`. The raw streams show `done 7`,
late `cancelled 7 alreadySettled`, then the assertion against request 8, and the
same sequence for requests 3 and 4. Both sessions settle. These two timing errors
remain distinct from the 35 broad-quality errors and stay in timing denominators.
The race therefore affects this preserved Rubend profile too. It is not an
intrinsic native-search failure or a successful short-latency observation.

The [tenth final quality group](../verification/next-plan/U07/u07-final-quality-09-p1/index.json)
records eleven further instances on `release-9058`, `release-9097`,
`release-9130`, `release-9540`, `release-9602`, `release-9696`, `release-9761`,
`release-9762`, `release-9807`, `release-9837` and `release-9859`. All eleven raw
streams show the same preceding `done`, late `alreadySettled` cancellation and
next-ID assertion. All eleven sessions settle. The complete 50,000-slot quality
population retains 35 errors. They belong to the pinned solver-plus-adapter
contract, not an intrinsic native-search failure rate. No failed slot is rerun.

The [ninth final quality group](../verification/next-plan/U07/u07-final-quality-08-p1/index.json)
records four further instances on `release-8198`, `release-8392`, `release-8461`
and `release-8823`. All four raw streams show the same preceding `done`, late
`alreadySettled` cancellation and next-ID assertion. All four sessions settle.
Twenty-four errors remain terminal among 45,000 planned attempts. No repair,
configuration change or repeat attempt is substituted.

The [eighth final quality group](../verification/next-plan/U07/u07-final-quality-07-p1/index.json)
records six further instances on `release-7087`, `release-7154`, `release-7187`,
`release-7457`, `release-7575` and `release-7884`. All six raw streams show the
same preceding `done`, late `alreadySettled` cancellation and next-ID assertion.
All six sessions settle. Twenty errors remain terminal among 40,000 planned
attempts. Frozen configurations and failure-retention rules remain unchanged.

The [seventh final quality group](../verification/next-plan/U07/u07-final-quality-06-p1/index.json)
records nine further instances on `release-6057`, `release-6113`, `release-6119`,
`release-6237`, `release-6681`, `release-6696`, `release-6747`, `release-6822` and
`release-6891`. All nine raw session streams contain the preceding `done`, then
its late `cancelled` with `alreadySettled`, and the assertion against the next
request ID. Each next ID is the old ID plus one. All nine sessions settle.
Fourteen errors remain terminal among 35,000 planned attempts. No repair,
configuration change or rerun is substituted. No native-only coverage or timing
claim may silently omit these adapter failures.

The [fifth final quality group](../verification/next-plan/U07/u07-final-quality-04-p1/index.json)
records the fifth instance, on `release-4509`, slot
`e8ec12ab102892bb09d6a16ab5f53e0d07b278f54c08423fde8052c5b25c201a`.
Its raw sequence is `done 127`, `cancelled 127 alreadySettled`, then `bound 128`.
The assertion difference is `127 !== 128`; the session settles. Five errors
remain terminal among 25,000 planned attempts. No repair or rerun.

The configuration seal precedes all final cases. This campaign explicitly keeps
errors and never repeats completed attempts. Changing the adapter now would
change a frozen measurement configuration after holdout access. The campaign
therefore retains both failures, keeps all sources and analysis rules unchanged,
and continues only never-claimed slots. No favorable post-fix replacement result
is substituted.

The final report must identify this limitation when interpreting coverage and
timing. It measures the pinned solver-plus-adapter contracts, not a clean native
search-only experiment. Any later repair needs a separate configuration and
fresh evaluation evidence before a performance-acceptance claim. A deterministic
control for a completed request, new active request, then prior `alreadySettled`
acknowledgement is the required regression target. No such repair or fresh
post-fix evaluation is claimed here.
