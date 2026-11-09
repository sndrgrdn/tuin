---
name: maintain-formal-verification
description: Bring a project's formal verification back in line after the code changed. Find the commits that touched verified code, update the model, harness or properties to describe the code as it is now, rerun, and say whether each failure is drift in the verification or a bug in the code.
disable-model-invocation: true
---

# Maintain a formal verification skill

A formal check proves a property of what it describes. When the code changes and the verification does not, the check can keep passing while it describes code that no longer exists. That pass is the dangerous case, because it looks like a proof.

This is the upkeep loop for a verify skill made by `create-formal-verification`, or any project-local skill that runs a model checker, prover or code-level verifier against named code. The project-local skill handles changes made while an agent uses it. This skill handles the changes that skipped it: merges, edits made without the skill, and drift built up across many commits.

## Outcomes

Give each check one outcome, and say which:

- **in sync:** nothing since the last sync changes what the check describes, and the check passes.
- **updated:** the code changed, the verification now describes the new code, and the check passes.
- **bug:** the verification describes the current code, and the code breaks the property. This is a finding about the code, not drift.
- **blocked:** the check could not be brought back in line, or could not run. Say exactly why.

A check can be both updated and bug: the update makes the verification describe the code again, and then the property fails on it.

## Edit scope

Edit only the verification: models, harnesses, property files and the verify skill itself. Leave product code alone during a run unless the user asks. When a property fails on the current code, keep the property and the model as strong as they are, and report the failure.

## Pass

1. **Find the checks.** A verify skill has no fixed name, so find it by what it does: a project skill that runs a model checker, prover or other verifier against named code. Read each one, or the one the user named. For each check, collect the property, the code it covers, the bounds and assumptions, the command that runs it, and the commit where it was last confirmed to describe the code. When no verify skill exists, stop and point at `create-formal-verification`. When the skill records no sync commit, use the last commit that changed the verification files, and say so.

2. **Run it as it is.** Run each check once before changing anything, and record the result. A pass here does not say the code is correct; it says the old description still holds. A failure here can be drift or a bug. Decide which only in step 5.

3. **Read every change to covered code.** Diff the covered files from the sync commit to now, and read each commit message. Look for code that moved: a covered function that was renamed, split or moved to another file is still covered. Look for new code that touches the state a check guards, such as a new function writing the same fields. Classify each change:
   - **No effect.** It alters nothing the verification describes: formatting, comments, paths the verification does not cover. Check this against the model or harness, not against the commit message.
   - **The verification no longer describes the code.** One indivisible step is now two, a branch was added or removed, a check moved, a new path reaches the guarded state, or a value has a new range. The model or harness must change.
   - **The promise changed on purpose.** The change alters what the code promises, and evidence in the change says this is intended: the doc comment, the tests, the changelog or the commit message. The property must change, and you cite that evidence.
   - **The promise may be broken.** The code changed and no evidence says the promise changed. Treat a failure that follows as a bug candidate.

4. **Update from the code, not from the result.** Change the model or harness so each changed part again points to code a reviewer can open, and one indivisible step in the code stays one step in the verification. Write the update from the code before rerunning; never shape it by what makes the check pass. Change a property only for a promise that changed on purpose, and write down the old wording, the new wording and the evidence. Keep the bounds unless the change makes them wrong. When you must reduce a bound, say so in the report.

5. **Rerun and judge each result.**
   - **Pass:** a check can pass on a description that has lost the ability to fail. Break the new code the way the property guards against (remove a new check, reorder a new step), confirm the check catches it, then drop the break.
   - **Fail:** replay the counterexample against the real code, step by step. When a step cannot happen in the code, the verification is wrong: fix it, and say what was wrong. When every step can happen, it is a bug: name the commit that introduced it, tell the counterexample as steps in the code's words, and state the harm in one sentence. When a cheap test or reproduction against the real code shows the bug, add it to the report as evidence, without committing it to product code.

6. **Update the verify skill:** the code each check covers, the commands, the bounds, the assumptions and the sync commit. Set the sync commit to the commit you checked. Leave the sync commit of a blocked check where it was, and say so. Then follow the verify skill once as the next agent would, so you know its steps still run.

## Report

For each check:

- the outcome, and the commits you read;
- what changed in the verification and why, with a short reason for each change: the code changed shape, or the promise changed on purpose (with the evidence);
- the rerun result, and the break you used to show the updated check can still fail;
- each bug in plain words: the counterexample as steps in the code's words, the harm, and the commit that introduced it;
- what the verification still does not cover, including new code it should cover.

Say plainly which failures were drift in the verification and which were bugs in the code. For a check that passed before your update and fails after, say the old pass was on a stale description.

Put verification updates in a change of their own, separate from any product fix.
