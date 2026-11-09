---
name: architect
description: Sketch types, signatures and module structure before writing code, compare competing designs from different models, then implement against the chosen sketch.
disable-model-invocation: true
---

# Architect

Sketch the types, function signatures, class shapes and module boundaries, with `not implemented` bodies and pseudocode. Have several models design it independently, combine the best into one sketch, then fill in the code against it.

Copy these phases into your todo list before starting: Ground, Sketch, Agree, Implement, Scrap.

## Phase A: Ground

Build a real mental model of every system the new code touches. Run `how` over each affected subsystem and produce its explanation; naming a file is not grounding. When the design changes ownership or layering, also read the history of the current shape (`git log`, blame, the project's RFCs or other decision records), so the reasons behind it become constraints instead of guesses.

Skip this phase only for greenfield work with no surrounding system.

## Phase B: Sketch

**Design it twice.** Get at least two structurally different candidates before choosing, even when the first looks good enough (Exhaust the Design Space). Candidates are whole alternative shapes, not variations inside one shape.

1. **Frame.** Write the task and a rubric of three to six concrete, gradeable criteria for this design. The runners see the task and the grounding, not the rubric.
2. **Fan out.** Spawn at least two runners at once, on different model families where the harness allows. Give each its own worktree or scratch directory, the task, the paths to the Phase A explanations, and `references/runner-prompt.md` as its brief. A runner that returns nothing is dropped and noted.
3. **Screen.** Check every candidate against `references/design-red-flags.md`. Assume the next contributor is an agent that sees only the files it opens, copies the nearest example, and takes the shortest path that compiles. Prefer the design where a change that looks right from one file is right for the whole codebase.
4. **Judge.** Read every candidate end to end and score it against the rubric, criterion by criterion. When you can, have a read-only judge on another model family score them too. Agreement confirms the pick. Disagreement means the rubric was unclear or one of you is biased; read both rationales before deciding.
5. **Pick a base:** the design a future maintainer can extend most easily without breaking its invariants. Between two close candidates, prefer the deeper interface: more complexity hidden behind a smaller, simpler public surface.
6. **Graft.** Walk each other candidate once more for the one or two parts worth porting, and fold them in by hand so the result stays one coherent design. When all candidates converge, note the agreement and keep the shared shape. When they diverge wildly, the framing was unclear: reframe and rerun instead of averaging.

Write the result as one design package with its rationale, shaped by `references/rationale-template.md`. Record the base, each graft and its source, and what you rejected, in the rationale's Synthesis decision section.

## Phase C: Agree (only on request)

By default, continue straight to implementation.

When the user asks for a checkpoint ("show me before implementing"), present the design and wait for sign-off.

Either way, the sketch can land as its own commit (scaffold first, Foundational Thinking). Planned, scoped breakage during fill-in is fine (Outcome-Oriented Execution). For adversarial pressure on the design before implementing, run `interrogate` on the sketch.

When the user pushes back on the shape, treat it as new Phase A evidence: re-ground and rerun Phase B before writing more code.

## Phase D: Implement against the sketch

Replace `not implemented` bodies with code and pseudocode with logic. The sketch is the contract. Report every deviation instead of absorbing it quietly. When a function needs a parameter the sketch did not anticipate, decide whether the sketch was wrong, a requirement was missed, or the implementation overreaches.

## Phase E: Scrap when the architecture is wrong

When implementation keeps producing friction the sketch cannot absorb, throw the sketch out instead of bolting fixes onto it (Redesign From First Principles, Fix Root Causes).

The signal is a pattern, not one instance:

- the same kind of workaround in unrelated places;
- several unrelated edge cases that each need a special branch;
- types that need escape hatches to compile: casts, `any`, optional fields that are always set;
- a lock appearing where the sketch said state was not shared;
- callers that must know the abstraction's internal rules to use it;
- two or more independent Phase D deviations of the same kind.

Use judgement. A few edge cases do not condemn a design, and complexity in the data is not complexity in the design.

To scrap:

1. Run `how` over what has been built.
2. Redesign as if the new constraints had been there from day one.
3. Subtract first: the new sketch is smaller than the old one before it grows.
4. Return to Phase B.

## Output

The caller's usage first, with the type sketch derived from it. One file of new types and signatures for a small change; a module map plus type definitions for larger work. The rationale ships alongside, per `references/rationale-template.md`.
