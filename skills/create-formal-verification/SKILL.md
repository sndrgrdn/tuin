---
name: create-formal-verification
description: Generate a project-local skill that formally verifies the code where a bug costs most and tests reach least, in any language, with the verification tool that fits. Use for races, invariants, retries, state machines, parsers and unsafe code that need more than tests.
disable-model-invocation: true
---

# Create a formal verification skill

A test checks the cases someone thought to write. Formal verification checks every case in a stated scope: every order of steps in a model, every input up to a bound, or every input.

This skill finds the part of the repo where that matters most, verifies one property of it, and leaves a project-local skill that lets the next agent check a change against that property. Write that skill for an agent who reads it cold, in the middle of a change, and has never seen your work. The user must be able to trust the result and act on it without learning the verification language.

## Choose the target from the code

Answer from the codebase; ask the user only what you cannot observe. When the user named an area or a bug, start there.

A good target is a promise the code makes, where a break harms users and tests rarely reach the case that breaks it. Choose the strongest such target in the repo, not the easiest to verify.

## Let the question choose the tool

Pick the tool that answers the question at the lowest cost: a model checker, a proof assistant, an SMT-backed verifier, or another tool.

- **Can events happen in a bad order?** Usually a model checker over a small model of the design. TLA+ is the default for that, in any language.
- **Does the code itself behave for every input** (memory safety, overflow, a data-structure invariant)? Usually a verifier that runs on the code. When no verifier runs on this language, say so, and test the real code with generated inputs (property-based testing), not a hand-written model of the function.
- **Must the property hold at every size,** where a bound is not enough? That can need a proof.

Prefer a tool the repo's developers can install and run, and tell the user why you chose it.

## What makes it good

- **True to the code.** Every part of the model or proof points to code a reviewer can open. What the verification treats as one indivisible step is one indivisible step in the code. Names come from this repo.
- **Able to fail.** A check you have never seen fail proves nothing. Show each property failing on a broken variant of the code it guards, such as a removed check or a reordered step.
- **Findings stay findings.** When the current code breaks the property, report it with the counterexample in the code's terms. Keep the property and the model as strong as they are, and leave product code alone unless the user asks.
- **Honest about scope.** Say what is verified, under which bounds and assumptions, and what is left out. A pass covers the model or the bound, not the whole system.
- **Readable without the tool.** State the property and the harm in one plain sentence each. Tell a counterexample as a short sequence of steps in the code's words.
- **Cheap to rerun.** One command, a pinned tool version, and a run short enough that the next agent uses it on every relevant change.
- **Kept in step with the code.** Record which files and functions each check covers, and the commit at which you last confirmed the verification describes them. When covered code changes after that commit, the next agent can see the verification needs another look.

## Generate the verify skill

Write a project-local skill, in the folder where the project keeps its skills, with frontmatter that names the area and says when to use it. Without frontmatter, the skill never registers.

From the skill alone, the next agent must be able to:

- tell whether a change touches the verified code;
- run the check;
- tell a real bug from a modelling error;
- update the verification when a change is intended.

Put the coverage record and the sync commit in the skill, and tell the next agent to move the sync commit forward only after confirming the verification describes the code at the new commit. Use this repo's real commands, paths and nouns, with no placeholders.

Tell the next agent how to read results for a human: explain each violation the checker finds as its shortest path of steps, in plain words and the code's names; and when a model check passes, draw how the system moves between states as a small diagram (Mermaid works), so the user can see what was checked.

## Prove it before you hand off

Follow the generated skill once, as the next agent would, on a scratch change that breaks the property in the real code. It must catch the break. Then drop the scratch change and confirm the check is back where it started: passing, or failing only on the findings you will report.

A verify skill that has never run is a draft. When the skill misses the break or a step does not run, fix the skill or the verification, not the scratch change.

## Hand off

Tell the user what you verified, which tool you used and why, the bounds, what the check found in plain words, how to run it, and what it does not cover. Suggest a second target only when you found a close one. Point the user at `maintain-formal-verification` for bringing the verification back in line after changes that skipped the check.
