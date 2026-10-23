# Small-edge information screen has no discriminating radius

Observed October 24, 2026. The U03 saved-native-trace screen is data-valid but
scientifically inconclusive. All 52,584 eligible entries have remaining radii
7 through 13. The one-, two- and three-edge references have diameters 3, 5 and 6.
Zero hypothetical cuts therefore follows from the ranges before lookup.

The analysis currently reports correct visit/cut counts but has no executable
classification of this range mismatch. A zero count alone could be misread as a
negative performance or larger-PDB result. No production decision was made.

Keep the original passed archive and explicit inconclusive disposition at
`docs/verification/next-plan/U03/u03-conditional-v1/index.json`. Add a model check
that labels a sample inconclusive when no sampled radius is below the reference
upper bound. Derive that verdict from saved per-radius counts. Reuse the passing
cube/rank/codec evidence rather than rerunning the unchanged trace analysis.
Test an all-high-radius sample, a sample with eligible radii, missing counts and
conflicting policy histograms. No new search, table or law is needed for this fix.

The reporting guard is now implemented and [canonically checked](../verification/next-plan/U03/u03-range-v1/index.json).
The focused regression failed before the fix and passes afterward. Twelve
malformed observation/histogram controls pass. All original counts are preserved
and the derived verdict is inconclusive. The missing lower-radius sample remains
an observation gap. No larger-PDB or performance conclusion is established.
