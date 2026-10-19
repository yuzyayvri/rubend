# Commit signatures and messages

All published commits must be signed and GitHub-verified. Messages contain one
subject line, with no description. A signature authenticates the commit; it
does not mean tests passed or a reviewer approved the change.

The earlier local commits were unsigned because signing was not configured.
The PR 2 squash merge was GitHub-signed and had an explicitly supplied body.
Yuzy requested retrospective signing and removal of all bodies on October 20.

## Local setup

Use an existing SSH key already registered as a signing key on your GitHub
account. Do not put private keys in the checkout or CI secrets. Configure this
checkout with:

```sh
node scripts/configure-git-signing.mjs /absolute/path/to/signing-key
```

The command checks GitHub's registered public signing keys, configures local
SSH signing, writes a local allowed-signers file inside Git metadata, and
enables `.githooks`. It does not upload a key or change other repositories.
`commit-msg` rejects descriptions. `pre-push` checks every newly published
commit's message and verifies its signature, including rewritten histories.
Keep GitHub's squash/merge description defaults blank and never supply a
description when merging through an API.

## Retrospective signing

`scripts/rewrite-signed-history.mjs` implements the scoped migration for Rubend's
three published branches. It creates a verified local recovery bundle before
rewriting. It preserves trees, parent topology, author identities, author dates,
and commit dates. Rewritten commits use Yuzy's committer identity, including the
former GitHub-committed squash merge, so the registered key authenticates them.
Signatures added now do not claim those commits were signed historically.

The old-to-new map and verification receipts live in the plan file printed by
the prepare command under `.cache/history-signing-*/plan.json`. Each directory
also contains `original.bundle`. The bundle includes all original local refs,
including unpublished experiments; no table, binary, or sealed evidence file
is rewritten. Historical SHA references in evidence retain their original
meaning and can be resolved through this map or the recovery bundle.

The migration proceeds through prepare, stage, verify, publish, and cleanup.
Staging branches expose the replacement objects without moving public branch
tips. GitHub must report a valid signature associated with Yuzy for every
replacement commit. Every tree and subject is also read back. Only then may
all three tips move in one atomic push, guarded by explicit old-SHA leases.
Temporary staging branches are removed after successful publication.

Old commit URLs, closed PR snapshots, and other clones can still refer to the
old objects. Their signatures cannot be edited in place. The guarantee applies
to the replacement histories reachable from the published branches. Other
repositories and unpublished experimental branches are not rewritten.

An existing clone must reconcile with the rewritten remote before pushing.
Preserve local work first. Do not merge the old unsigned graph back into main.

GitHub documents [signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
and [SSH signing configuration](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key).
The local allowed-signers file and private key paths are never committed.

## Migration receipt

The [history receipt](signing-history-v1/history.json.gz) records 111 replacement
commits across the three published branches, including the initial policy commit.
GitHub verified every signature as valid and associated with Yuzy before the
atomic replacement. Every mapped tree is identical and all messages are subject
only. Six old descriptions were removed, including the PR 2 squash body.
The final receipt commit is added afterward and checked separately.

The original bundle is `.cache/history-signing-mAT8gW/original.bundle`.
Unpublished experimental branches and the detached roadmap checkout were left
unchanged. The three temporary signing-check branches were removed.

The [hook checks](signing-history-v1/hooks.json.gz) confirm rejection of an
unsigned push and a description, and acceptance of a signed subject. No remote
ref is changed by those probes. GitHub [ruleset 25420163](https://github.com/yuzyayvri/rubend/rules/25420163)
actively requires verified signatures on every branch with no bypass actors.
Its [configuration receipt](signing-history-v1/ruleset.json.gz) preserves that
setting. Both GitHub merge-message defaults are `BLANK`.

The API rejected a separate `commit_message_pattern` rule with HTTP 422, so
server-side message-pattern enforcement is not claimed. Commit bodies are
blocked by the local hook and omitted by the configured merge defaults.
