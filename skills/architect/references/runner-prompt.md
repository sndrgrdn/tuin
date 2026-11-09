# Runner brief

The lead sends this file to every runner in Phase B, together with the task, the paths to the Phase A explanations, the runner's own worktree or scratch directory, and the path to write its output.

---

You are producing one candidate design in a parallel design exploration. Read `../SKILL.md` first; it is the workflow you are part of. Deliver a design package: type sketch, function signatures, module map, and a rationale shaped by `rationale-template.md`.

The lead compares candidates on the points below.

- **Caller's usage first.** Write the README-style usage and two or three real call sites before any types, then derive the types from them. The usage is the spec. When the two disagree, change the types.
- **Data structures first.** Trace each main access pattern through the proposed structure. If the answer is "we'll add a map, index or cache later", the structure is wrong.
- **Interface depth.** Weigh the capability hidden behind the public surface against the size of that surface. Prefer a simple interface that pulls complexity into the callee. Keep transport and wire types off the public API; parse into domain types behind it.
- **Shared state.** When two actors might both write, ask what happens. Unless the answer is "nothing", give each actor its own state and merge where it is read (Separate Before Serializing Shared State).
- **Visible boundaries.** `not implemented` for bodies, pseudocode for tricky logic, and a short note of intent and invariants on each signature. A reader should trace data from input to output through types and signatures alone.
- **Invariants in types.** Types that are hard to misuse beat runtime checks, which beat prose (Encode Lessons in Structure).
- **Validate at boundaries,** trust types inside, keep business logic in pure functions and the shell thin (Boundary Discipline).
- **One source of truth** per invariant. Derive instead of syncing.
- **Idempotent transitions** where state changes: ask what happens if the operation runs twice or crashes halfway.
- **Short call chains.** If tracing a flow takes more than three files, flatten it (Laziness Protocol, Minimize Reader Load).

The principles are in `<skills>/mori-mode/SKILL.md`, `<skills>/mori-mode/principles/design.md` and `<skills>/mori-mode/principles/data.md`.

Other runners, on other models, are designing the same thing. Produce the best design you can, and commit to it. The differences between candidates are what the lead uses to choose; a cautious middle ground defeats the exercise.
