---
name: no-comments
description: Have a fresh reviewer delete needless comments and flag the code they excuse, then fix accepted findings and offer to encode stated constraints as checks.
disable-model-invocation: true
---

# No comments

A fresh reviewer, who did not write the code, hunts the comments. You judge its findings and act on the accepted ones. Defer to the reviewer's fresh view unless a step below says otherwise.

## Scope

The files or diff the caller names. Otherwise the current diff against the base branch (default `main`), including the working tree.

## Steps

1. **Spawn the reviewer.** Spawn a subagent, ideally on a model other than the one that wrote the code, briefed with `references/reviewer-brief.md` and the scope. Pass the brief as it is; do not restate its rules.
2. **Judge the report and its diff.**
   - Reject: edits to application code, edits outside the scope, deletions of comments the brief's exceptions protect, `MUST KILL` reasons that misstate the code, and flags that condemn code kept on purpose.
   - Flags asking to reshape a surprise in our own code stay actionable. Do not restore those comments.
   - A kept comment survives only with proof that it is about something we cannot change.
   - Check for scoped lint and type-checker suppressions the reviewer missed. A suppression of a rule that protects correctness or safety is an actionable `MUST KILL`.
   - Restore a deletion only with the exact exception and proof within the scope.
   - Before accepting a thin `IMPORTANT` or "do not remove" kill or keep, run `how` on its symbol and read its history (`git log -L`, blame). An ambiguous kill stays deleted. A keep that is refuted or still ambiguous is deleted.
   - When you reject a report, revert it and rerun the reviewer once, naming the failure. If the second report is also rejected, report it as open and fail this skill.
3. **Fix trivial accepted flags directly:** delete the dead path, drop the parameter, call the real API. When any fix needs a new shape, run `architect` once for the accepted set and its surrounding code, and stop at the sketch. Step 4 implements it.
4. **Implement the smallest root-cause fix within the scope,** removing every workaround the flags name. When the root cause lies outside the scope, land the smallest fix inside it and report the rest as open. Fix Root Causes and Redesign From First Principles guide the intent; neither widens the scope. Add no symptom guards.
5. **Constraint comments** ("do not remove", "do not change wording", "talk to X before changing"): leave the ones about things we cannot change. For the rest, offer the cheapest in-scope type, runtime check, test or lint rule that enforces the constraint, and wait for the user's approval. In unattended runs, the caller must have approved in advance. When approved, encode it, then delete the comment. Otherwise delete the comment, report the constraint as open, and sketch the out-of-scope work.
6. **Report:** the number of deletions, restored comments, reruns, the architect sketch, the fixes, the encodings offered and made, the constraints left unenforced, and other open work.
