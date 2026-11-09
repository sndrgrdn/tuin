# Evidence principles

Read this file in full before you measure something or act on a number, when two fixes in a row have failed, when a product or UX tradeoff comes up, when work is big enough to deserve a tool, and when you notice a correction you have seen before. Apply every principle whose situation matches, and name it in your reply with the choice it changed.

## Explain the Number

Apply before you measure, and before you trust, report or act on a measured number: a speedup, a regression, a latency, a count, an eval result.

- **Write the decision down before the run.** Name the result that would change a decision, and the noise level. Stop when run-to-run spread is larger than the effect.
- **Ask "why not double?"** Name what limits the result (a core, a lock, the disk, the network, the load generator), taken from a profile or counters during the run, not from reading code.
- **List what else the number could be measuring,** and rule out each with evidence: errors, skipped or cached work, code that never ran, an untuned side, noise, a part too small to matter overall.
- **Keep the evidence with the number:** run count, spread and the limiter.

## Attack the Premise

When two or more fixes that share one assumption have failed the same check, suspect the assumption, not the fixes.

- Write the assumption down as one sentence.
- Find an observation that would come out differently if the assumption were false, and make it before the next fix. Look at how the failures are distributed, not only how big they are.
- If the evidence contradicts the assumption, the cause is elsewhere. If it confirms it, ask the next "why" (Fix Root Causes).
- Remove the condition that causes the failure, instead of adding a mechanism that cleans up after it.

## Experience First

When implementation convenience conflicts with the experience of whoever uses the work, choose the experience.

- Every feature, control and option justifies its place. Ship fewer things, finished well.
- Get the details right: alignment, spacing, transitions, feedback, error and empty states.
- Every feature serves the core workflow or stays out of its way.
- The user is whoever consumes the work: the end user of a screen, the colleague who imports a library, and the engineer who maintains the code next.

Foundations decide the order of the work. Experience decides its target.

## Build the Lever

When the work is more than a couple of obvious edits, build the tool that does it or proves it: a codemod, a script, a generator, a rerunnable check, or a skill your subagents follow. A tool does the work the same way every time, and a reviewer can rerun it instead of trusting you.

- Do the first unit by hand to learn the recipe, then build the tool, and prove it by rerunning it on that unit.
- One script that processes every unit beats many subagents editing by hand.
- When subagents share a recipe, write it as one file they all read, kept outside what they may edit.
- Build the smallest script that does the job, not a framework. Commit it when the work outlives the session.

If you cite this principle and the diff contains no tool, you did not apply it.

## Encode Lessons in Structure

When you catch yourself giving the same instruction a second time, or the user corrects the same mistake twice, encode the rule as structure: a lint rule, a CI check, a test, a script, a type. Text in a doc is the weakest form. Propose the structural fix in the project's own checks, and once it exists, rely on it instead of the instruction.

When the lesson needs judgement and cannot be checked by a machine, put it where it will be read, with an example of the mistake.
