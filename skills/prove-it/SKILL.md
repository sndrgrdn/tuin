---
name: prove-it
description: Substantiate a claim that completed work works as intended, with independent, irrefutable evidence.
disable-model-invocation: true
---

# Prove it

Show irrefutable proof that the work is done and works as intended. The proof must be strong enough for the user to judge the claim without trusting your word.

1. **State the claim.** Write down exactly what is claimed to work, and for whom, from the user's request, the brief or the PR. List every behaviour the claim covers, including failure paths and the edge cases the user mentioned. After an earlier verdict, list only the behaviours that the changes since it can affect.
2. **Hand the check to a fresh agent.** Spawn an independent checker, ideally on a different model from the one that did the work, that has not seen the original reasoning. Give it the claim, the list of behaviours, the branch or commit, and the project's verify method (its `verify-*` skill if it has one). Brief it to drive the real surface the way a user would, capture evidence for each behaviour (screenshots, recordings, command output, stored state), and try to break the claim rather than confirm it. The checker changes nothing in the work it checks: it reports what it finds to you, and a fresh builder fixes it.
3. **Check the evidence yourself.** Open each artifact and confirm it shows what it is said to show, on the right surface, at the right commit. When the evidence is missing, weak or contradicts the claim, keep investigating, or send the checker back with the gap named.
4. **Report** in three lists:
   - **Proven:** each behaviour, with the evidence that shows it.
   - **Proven elsewhere:** behaviour shown on a different surface, environment or commit than claimed, and why that matters.
   - **Unproven:** what could not be shown, and what it would take.

Never present an unproven behaviour as proven. When something fails, say so plainly, with the evidence.
