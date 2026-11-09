---
name: simplify
description: Simplify a branch's implementation before committing. Remove AI slop, deduplicate, reorganise, and drop low-value tests and needless churn, keeping behaviour unchanged.
disable-model-invocation: true
---

# Simplify

Refine the branch's implementation: simplify, deduplicate, reorganise, and remove what does not earn its place, while keeping behaviour unchanged. Work on the branch's diff against its base, and touch only what the branch added or changed.

## Look for

- **Slop.** Comments that narrate the code or do not match the file's style (`no-comments` is the thorough pass), debug output, unused variables and imports, commented-out code, abandoned experiments.
- **Defensive noise.** Checks, rescue or try/catch blocks, and nil or null guards that are unusual for a trusted internal path (Boundary Discipline).
- **Type escapes** used only to silence the checker: `any`, casts, `T.unsafe`, `# type: ignore`, `rubocop:disable` and the like.
- **Shape.** Deep nesting that early returns would flatten; one-caller helpers, wrappers and options added "for flexibility" (Laziness Protocol); logic duplicated within the diff or against existing code that already does the job.
- **Placement.** Code that sits in the wrong owner or file for what it does (`mori-mode/principles/design.md`).
- **Tests.** Tautological tests that cannot fail, tests that restate the implementation, and duplicate cases that add no coverage (`mori-mode/principles/testing.md`).
- **Churn.** Renames, reformatting, reordering and incidental edits that the goal does not need. Revert them.
- Anything else that differs from the surrounding file and codebase.

## Rules

- Keep behaviour unchanged, unless you are fixing a clear bug, which you report.
- Prefer small, focused edits to rewrites. Keep unrelated cleanup out.
- Run the project's linters and the tests for the touched files afterwards.
- Report in one to three sentences what you removed or changed.
