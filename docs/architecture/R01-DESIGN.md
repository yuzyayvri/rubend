# R01 implementation shape

## Problem

The approved roadmap needs stable corpora, coverage-first result scoring, and
explicit goal/profile/completion contracts before changing search. The current
large-profile capability is inferred from array size. Existing node counts are
state-machine steps. The historical warm summarizer intentionally rejects misses.

## Usage

Benchmark code loads one frozen corpus by name. It scores every planned case,
including deadline misses, and reports exact excess only where an independent
optimum is known. It never silently drops failed or missing jobs.

The native initializer selects a validated Small, RawJoint, or BlockJoint table
owner. Portfolio code receives that owner and a Fast or Exact request. Search
receives an explicit goal. The effect boundary translates results into the
existing numeric protocol until a separate versioned protocol change is needed.

## Shape

The first unit adds a pure scorecard and reproducible corpus utility. Its input
is a fixed case list and complete event trajectories. Its output separates
coverage, conditional lengths, oracle-known excess, and censored exact completion.
Boundary validation rejects missing/duplicate cases, invalid replay, inconsistent
optima, non-monotone trajectories, or unsubstantiated optimal labels.

The next unit uses tagged owned tables and explicit search enums. Preserve the
existing fixed-work numeric serialization through adapters, not a second search.
Do not make subgroup membership a recorded-solution goal. Phase-one membership
launches phase two only at the existing reduction leaf.

Diagnostic counting is a separate compile product. Release builds cannot carry
runtime meter branches. If template erasure fails inspection, a sealed mechanical
diagnostic derivative must prove matching semantic traces.

## Synthesis decision

One read-only gpt-6-sol candidate proposed runtime algebraic table/goal/state
types. The second agent dispatch hit host capacity. The user then prohibited
all further subagents. There is no independent cross-judge verdict.

The solo alternative is compile-time profile/goal templates propagated through
the kernel, with no runtime tags. That can specialize lookup paths, but it
duplicates compiled search bodies and couples every helper to the template.
Choose tagged ownership as the initial contract and consider static
specialization later only when measurements justify it. Graft the alternative's
release-erasure check into diagnostics. This is a solo design decision.

## Tradeoffs accepted

Use existing Bend-generated model and test-only independent cubie sampler for
fixtures. Corpus generation is not product search. Preserve old benchmark
artifacts and the old zero-miss-only summarizer unchanged.
Retain the original generator/model source hashes as provenance. Loading frozen
states does not require the candidate engine's source to match the generator's
historical source. Otherwise a valid cube-model optimization would invalidate
the benchmark input. Regeneration checks compare the resulting states.

## Alternatives considered

Do not use a numeric missing-answer penalty such as 31 as the sole score. A
survivor-only mean can reward missing difficult cases. Report coverage first,
then paired shared-answer lengths and their individual losses.

Do not thread a runtime Quiet/Counting flag through timed release nodes.
It changes the measured work even when counting is disabled.

## Implementation reconciliation

Start with R01a independently of the kernel refactor. A scorecard must not
require the historical warm runner's exact 1,990-job shape. It validates a
general finite event-record contract and leaves its source artifact intact.

## Open questions and risks

All new speed targets are unmeasured. Typed contracts alone do not prove
validator correctness or traversal completeness. Required independent review
remains not run under the user's solo-work instruction.

## Next implementation step

Freeze pilot/development/release corpora and test coverage-first scoring with
positive and adversarial fixtures before changing the native kernel.
