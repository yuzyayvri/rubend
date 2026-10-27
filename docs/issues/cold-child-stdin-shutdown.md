# Cold adapter must close its owned stdin

The new cold-process fixture initially paused stdin after a stop acknowledgement.
That left an owned handle alive. A normal partial-answer timeout needed the
parent's forced group termination. The regression failed with actual `true`,
expected `false` for forced shutdown.

The [failed probe](../verification/next-plan/U07/control-failures/cold-stdin-v1.json.gz)
preserves the actual process record and both source files. Change the one-shot
child's completed-input path to destroy its owned stdin after closing readline.
Keep stdout available to flush terminal records. Rubend's Engine must still close
and await native/IPC cleanup first. No application source or global stream is
changed; these are owned benchmark child processes.

Keep the partial, late, forced-hang, malformed and wrong-job process controls.
Normal stop must not require a forced kill. A deliberately hung child must still
be bounded. All six controls, including the final-frame control, and all nine real
backend calibrations pass in the [canonical archive](../verification/next-plan/U07/u07-cold-v1/index.json).
It verifies 2,481 seals and three receipts. Real children exit without a forced
kill, and all Rubend native owners and IPC directories are removed.
