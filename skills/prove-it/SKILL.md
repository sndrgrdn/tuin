---
name: prove-it
description: Substantiate a claim that completed work works as intended, with independent, irrefutable evidence.
disable-model-invocation: true
---

# Prove it

Show that the work is done and works as intended, with evidence the user can judge without trusting your word. Size the proof to the change: the smallest evidence that shows it.

1. **State the claim.** Write down exactly what is claimed to work, and for whom, from the user's request, the brief or the PR. List the behaviours the change adds or alters, and the edge cases the user named.
2. **Hand the check to a fresh agent.** Spawn an independent checker, ideally on a different model from the one that did the work, that has not seen the original reasoning. Give it the claim, the list of behaviours, the branch or commit, and the project's verify method (its `verify-*` skill if it has one). Brief it to drive the real surface the way a user would, and capture one piece of evidence per behaviour: a screenshot, a recording, command output or stored state. A behaviour that a test already shows needs no other evidence. The checker changes nothing in the work it checks: it reports what it finds to you, and a fresh builder fixes it.
3. **Check the evidence yourself.** Open each artifact and confirm it shows what it is said to show, When evidence is missing or contradicts the claim, report it as unproven.
4. **Report** in three lists:
   - **Proven:** each behaviour, with the evidence that shows it.
   - **Proven elsewhere:** behaviour shown on a different surface, environment or commit than claimed, and why that matters.
   - **Unproven:** what could not be shown, and what it would take.

Never present an unproven behaviour as proven. When something fails, say so plainly, with the evidence.
