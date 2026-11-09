---
name: mori-deslop
description: Remove AI-generated slop from a branch's code diff before committing, keeping behaviour unchanged.
disable-model-invocation: true
---

# Deslop

Check the branch's diff against its base and remove the AI-generated slop it introduced. Touch only lines the branch added or changed.

## Look for

- Comments that narrate the code, restate a name, or do not match the file's style. (`mori-no-comments` is the thorough pass; this one catches the obvious.)
- Defensive checks, rescue or try/catch blocks, and nil or null guards that are unusual for a trusted internal path (Boundary Discipline).
- Type escapes used only to silence the checker: `any`, casts, `T.unsafe`, `# type: ignore`, `rubocop:disable` and the like.
- Deep nesting that early returns would flatten.
- Leftovers: debug output, unused variables and imports, commented-out code, abandoned experiments.
- One-caller helpers, wrappers and options added "for flexibility" (Laziness Protocol).
- Anything else that differs from the surrounding file and codebase.

## Rules

- Keep behaviour unchanged, unless you are fixing a clear bug, which you report.
- Prefer small, focused edits to rewrites.
- Run the project's linters and the tests for the touched files afterwards.
- Report in one to three sentences what you removed.
