# Change principles

Read this file in full for refactors, migrations, sweeps of similar edits, work that crosses system boundaries, several actors writing at once, and stacking commits or PRs. Apply every section whose situation matches, and name the principle in your reply with the choice it changed.

## Sequence Work into Verifiable Units

Break the work into small units that each end in a state you can check, and check each one before starting the next. A break caught at the unit that caused it is cheap to find; a break caught after a batch is buried under everything built on it.

- **Tracer bullet first.** When a change crosses system boundaries or depends on an unproven architectural path, start with the smallest end-to-end implementation through the real boundaries that produces an observable result and can grow into the final one. Use it to test the architecture's assumptions before expanding. (When the code exists only to answer a design question, use a throwaway prototype instead.)
- **Vertical slices.** Extend the system one caller-visible behaviour at a time, across every component it needs. Avoid horizontal batches of one layer that postpone integration evidence.
- **Execution.** Each unit is a bracket: known-good state, one change, the check, then the next. Rebase onto a clean main first, so each check measures against the real baseline.
- **Delivery.** Order commits and PRs so the sequence proves the work: the failing test, then the fix; the deletion, then the reshape; the baseline, then the change; the scaffold, then the feature. Each commit stands on its own.

## Refactor against pinned behaviour

Before changing structure, pin the observable contract with existing tests, characterisation tests, baseline outputs or an equivalence check. Keep required failures, effects, ordering and compatibility as well as successful outputs. Static checks alone do not prove equivalence.

Refactor by giving a calculation, policy, translation, persistence operation or effect a clear owner, while keeping the coordinating operation's control flow, data flow, decisions and effect order visible. Give extracted behaviour explicit inputs and outputs: methods that talk through shared mutable instance state move complexity instead of reducing it. Judge the reasoning burden at both the definition and the call sites. When a complexity metric still complains, report it instead of carving up cohesive behaviour to satisfy it.

## Migrate Callers Then Delete Legacy APIs

When a new internal API replaces an old one with no independent compatibility obligation, migrate every caller and delete the old surface and its obsolete tests in the same change. Keep the tests for behaviour the new interface must still provide. Check for published or separately deployed consumers before assuming callers can move together.

## Outcome-Oriented Execution

In a planned rewrite or migration, aim for the verified end state rather than keeping every intermediate step fully working; temporary compatibility code tends to become permanent.

- Identify the verification boundaries, and declare up front where temporary breakage is acceptable.
- Keep breakage local, recoverable, and out of deployed or shared baselines.
- Run the relevant checks at each declared boundary, and full verification at completion.
- Prefer safe incremental delivery when deployment or compatibility requires it.

## Build the Lever

For error-prone sweeps, repeated transformations or complex comparisons, build the smallest deterministic tool that makes the work repeatable and reviewable: a codemod, script, query, generator or verification harness. A reviewer can rerun a tool instead of trusting you.

- Do the first unit by hand to establish the expected result, then build the tool and check it against that unit.
- Reuse existing tooling when possible. A direct edit or an existing command is enough when it is easier to verify than a new tool.
- One script that processes every unit beats many subagents editing by hand. When subagents share a recipe, write it as one file they all read, outside what they may edit.
- Build the smallest script that does the job, not a framework. Keep it when rerunning or auditing the work has lasting value.

If you cite this principle and the diff contains no tool, you did not apply it.

## Separate Before Serializing Shared State

Before running work concurrently, identify every shared mutable target: files, branches, keys, records, worktrees, ports, databases. Usually the actors publish independent facts, so give each its own owner and write target, and merge only where the results are read. When one canonical target is a real invariant, enforce coordination in structure: a transaction, lock, single writer or atomic conditional operation. Instructions to avoid collisions are not synchronisation.

## Complete when

Required behaviour is pinned and stays equivalent, callers are accounted for, and temporary scaffolding and obsolete surfaces are removed, or kept for a stated compatibility need. Each unproven cross-boundary path had a tracer bullet before expansion, and each slice completes a caller-visible behaviour with its own check. Automation matches the intended transformation, and concurrent writes have structural ownership.
