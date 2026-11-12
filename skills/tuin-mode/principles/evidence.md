# Evidence principles

Read this file in full when debugging, when two fixes in a row have failed, before you measure something or act on a number, when a product or UX tradeoff comes up, and when you notice a mistake or correction you have seen before. Apply every section whose situation matches, and name the principle in your reply with the choice it changed.

## Fix Root Causes

Fix the first broken contract or unhandled legitimate state, not the place where the symptom surfaced. A symptom fix hides the evidence and leaves the fault free to surface elsewhere.

- **Reproduce first,** before changing production code, when practical.
- **Ask "why"** until the answer is a wrong decision in the code, not a consequence of an earlier one.
- **Instrument when stuck.** Read the actual error and the actual state; add instrumentation on the real path when evidence is missing.
- **Is the state legitimate?** A guard is correct when it handles a legitimate state owned by that location. When the state breaks an established producer invariant, correct the producer instead of hiding its output. Guards, retries, swallowed errors, clamped values and discarded state are the usual ways to hide a bug.
- **After a restart,** suspect persisted state first: config files, caches, lock files, serialised state.
- **Fix the pattern,** not only the instance: find every place with the same fault.
- A workaround that needs a paragraph-long comment means the code is wrong.
- When the deciding fact took a deep dig to find, propose the cheap, always-on signal that would have shown it at first look.

**Regression test first** when there is a reliable, proportionate path through a real interface (`tdd`): confirm it fails for the intended reason, fix, and rerun. When that path is impractical, use the closest trustworthy reproduction or executable check and report the coverage gap. An inconvenient harness does not silently waive the coverage `testing.md` requires.

## Mistake-proofing

When correcting a defect, identify the condition that made it possible, and where practical remove it at the narrowest owner shared by every demonstrated recurrence path. Prefer the smallest enforceable mechanism, in this order:

1. an existing domain representation or invariant;
2. a narrower API or workflow;
3. a storage or configuration constraint;
4. existing compiler, static-analysis or CI enforcement;
5. detection through an existing test seam, when prevention is impractical.

Prevent the demonstrated failure class, not hypothetical variants. New mechanisms still pass YAGNI and the deletion test (`design.md`).

## Attack the Premise

When two or more fixes that share an assumption have failed the same check, stop patching and suspect the assumption.

- Write the shared premise down as one sentence.
- Find an observation that would come out differently if the premise were false, and make it before the next fix. Look at how the failures are distributed, not only how big they are.
- Follow the evidence. If it contradicts the premise, the cause is elsewhere. If it confirms it, ask the next "why". Unsupported does not mean disproved, and repeated failure does not by itself identify the cause.
- Remove the condition that causes the failure, instead of adding a mechanism that cleans up after it.

## Explain the Number

Apply before you measure, and before you trust, report or act on a measured number: a speedup, a regression, a latency, a count, an eval result.

- **State the claim and the decision first.** Name the result that would change a decision, and the noise level. Inspect what the harness actually measures.
- **Check the work ran.** Confirm the intended work executed, its outputs are correct, and errors, skipped or cached work did not produce the result.
- **Ask "why not double?"** Name what limits the result (a core, a lock, the disk, the network, the load generator itself) from runtime evidence such as a profile or counters, not from reading code. Profile only in runs you don't report.
- **Compare like with like.** Use equivalent workloads and production-like settings. Confirm the machine is idle first (`uptime`). Run each side at least 5 times, alternating, and report the median and range. Stop when run-to-run spread is larger than the effect. A side left on untuned settings means no winner.
- **Report the evidence with the number:** units, sample count, spread, relevant settings and the limiter. Check that the result is physically plausible and matters end to end before extrapolating from a microbenchmark.

A requested ballpark may use one run labelled as such, but still needs correct output and proof the work ran. Call close, confounded or unexplained comparisons inconclusive instead of picking a winner.

## Experience First

When implementation convenience conflicts with the experience of whoever uses the work, choose the experience. State who consumes the behaviour, what they should observe, and the check that will show it; include the maintainer's burden when structure changes.

- Every feature, control and option justifies its place. Ship fewer things, finished well.
- Get the details right: alignment, spacing, transitions, feedback, error and empty states.
- Every feature serves the core workflow or stays out of its way.
- The user is whoever consumes the work: the end user of a screen, the colleague who imports a library, and the engineer who maintains the code next.

Foundations decide the order of the work. Experience decides its target.

## Encode Lessons in Structure

When a demonstrated mistake recurs, or the user corrects the same thing twice, look first for an owning representation, interface, constraint or existing enforcement path that prevents it (see Mistake-proofing). Add a focused regression test when prevention is impractical. Change written instructions only when the lesson needs judgement the system cannot enforce. Record a rule that applies across the codebase as an RFC statement with `domain-modeling` when the project keeps RFCs; otherwise put it where it will be read, with an example of the mistake. Keep the mechanism proportional to the demonstrated recurrence, and verify it rejects the mistake without rejecting required behaviour.

## Complete when

The enabling condition of each defect is corrected, or its remaining recurrence path is explicit, and the reproduction passes after the fix with before and after evidence, or its absence reported. Each failed-twice premise was written down and tested. Every reported number is no stronger than its measurements, with the evidence needed to reproduce or challenge it. Each recurring lesson has an enforceable fix or a specific, justified judgement rule.
