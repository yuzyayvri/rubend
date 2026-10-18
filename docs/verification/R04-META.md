# Compact H0 metadata

The Bend assembler combines audited corner and edge data into 2,892,000 logical
words. Independent assembly agrees on every serialized word. The sparse map
has 153,090 valid entries, and the derived full-product goal is 450,429.
No raw 5.3-billion-state index is flattened into U32.

Metadata validation regenerates the expected array from audited component
inputs and compares all logical words. Nine mutations reject wrong format,
class map, stabilizer, corner move, edge move, symmetry, array size, or
incomplete component input. The unchanged twenty-three-law kernel check and
targeted tests pass. Combined regression remains due before integration.

An additional 36,000 coupled move checks compare raw-component transitions
with canonical product transitions. In 812 cases, numeric edge indexes differ
but the complete stabilizer orbit connects them. A concrete case is class
1612, edge 14376 versus edge 28646, connected by symmetry 42. Requiring only
numeric identity fails this check. The full generator must test actual orbit
assignment separately, not treat this comparison as proof of its updates.

Run just h0-meta-test in nix develop. The
[archive index](r04-meta-v1/index.json) binds the source and raw records to the
read-only metadata payload in ignored build/evidence. This metadata admits
small generator experiments only. A full product build still needs measured
prefix admission and every-entry/edge/stabilizer distance audits. No engine
strength gain or universal projection theorem is claimed. Independent review
remains unrun under solo work.
