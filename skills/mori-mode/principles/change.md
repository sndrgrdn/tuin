# Change principles

Read this file in full for migrations, sweeps of similar edits, refactors, operations that may be retried or crash halfway, several actors writing at once, and stacking commits or PRs. Apply every principle whose situation matches, and name it in your reply with the choice it changed.

## Sequence Work into Verifiable Units

Break the work into small units that each end in a state you can check. Check each unit before starting the next. A break caught at the unit that caused it is cheap to find. A break caught after a batch is buried under everything built on top of it.

- **Execution.** Each unit is a bracket: known-good state, one change, the check, then the next unit. Rebase onto a clean main first, so each check measures against the real baseline.
- **Delivery.** Order commits and PRs so the sequence proves the work. The usual shapes: the failing test, then the fix; the deletion, then the reshape; the baseline, then the change; the scaffold, then the feature. Each commit stands on its own.

## Make Operations Idempotent

Every operation that changes state answers two questions: "what happens if this runs twice?" and "what happens if the previous run crashed halfway?" The answer must be "it converges to the same end state".

- Derive each step from the state that exists, not from what the previous run meant to do. Read the current state, compare it with the goal, and apply only the difference.
- Anything a run leaves behind (a lock, a temporary file, a half-written record, a claimed job) must be recognisable as stale by the next run, wherever the previous run stopped. Write to a temporary path and rename into place. Compare by content, not by creation order.

If any answer is "it depends on what was left behind", add a reconciliation step.

## Separate Before Serializing Shared State

When several actors might write the same file, branch, key or record, first ask whether they need the same object at all. Usually they publish independent facts, so give each one its own file, key, branch or worktree, and merge only where the results are read. Serialise access (a lock, sequential phases, a single writer) only when one shared target is a real invariant, and enforce it in structure. A convention written in a doc does not prevent a race.

## Migrate Callers Then Delete Legacy APIs

When a new internal API replaces an old one, migrate every caller and delete the old API in the same change. Update tests to assert the new contract, and delete tests that only protected the old internals. Skip compatibility shims and parallel old and new paths, unless outside users depend on the old API.

## Outcome-Oriented Execution

In a planned rewrite or migration, aim for the verified end state rather than keeping every intermediate step fully working. Temporary compatibility code tends to become permanent.

- Declare up front where temporary breakage is acceptable, and keep it scoped and reversible.
- Keep fast checks running on the areas being touched.
- Run full static and runtime verification when the plan completes.
