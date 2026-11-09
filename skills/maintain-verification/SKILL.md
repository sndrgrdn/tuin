---
name: maintain-verification
description: Periodic pass that keeps a project's verification skill and feature map honest. Read-only source readers per feature, one live session driving every feature, and at most one PR of proven corrections.
disable-model-invocation: true
---

# Maintain a verification skill

A feature map starts to rot the moment the app changes. This is the upkeep loop for a skill made by `create-verification`, or any project-local verification skill with a feature map.

The unit of rigour is the feature, not the sentence: cover every feature file from source, and use every feature live, without turning every bullet into a terminal command.

## Outcomes

End with exactly one, and say which:

- **clean:** every feature got source and live coverage, and nothing is worth shipping. No branch, no PR.
- **changed:** one PR ships proven corrections to the docs, the harness or the map.
- **blocked:** coverage could not finish, or a proven fix could not ship safely. Say exactly what blocked it.

## Edit scope

Edit only the verification skill's own folder: its `SKILL.md`, `features/`, and the harness scripts it owns. Never edit product code during a run. When the map describes behaviour the app no longer has, it is either doc drift (fix the map) or a product regression (report it; never paper over it in the docs).

## Pass

0. **Find the target:** the project-local skill whose body has launch and drive sections and a feature map (usually `<skills>/verify-*/`). Several candidates: ask which one. None: stop and point at `create-verification` instead of inventing a target.

1. **Index hygiene.** Read the feature map README and list its sibling files. Fix missing, extra, duplicate and dead entries. Keep this light; generate no inventory.

2. **Source wave.** Spawn one read-only subagent per feature file, all at once. Each explains how its user-facing feature works from the source, flags likely doc drift with citations, and returns one concise recipe for verifying it live. They never drive the app and never edit files. Each returns: feature summary, source entry points, likely drift (or none), one recipe.

3. **Reconcile.** Check that every feature file has a summary. Merge overlapping recipes into as few app states as practical. Spot-check the cited drift; do not re-prove clean claims. Sweep recent changes (`git log` since the map last changed) for user-facing features missing from the map. Call one missing only with a concrete source path.

4. **Live pass.** Required even when the source looks clean. You, the lead, do all the driving. Follow the verification skill's own launch model: one long-lived instance driven serially for servers and UIs, or a fresh isolated session per drive for short-lived CLIs. The skill's Launch section decides.

   Use every feature at least once, and hold three invariants for the whole pass, whatever fails:

   1. **Healthy before driving.** Never drive an instance you have not health-checked since it last did something surprising. Run doctor before the first drive, on each fresh session where sessions are the unit, and again after any failed drive. Where doctor cannot see the failure (a stuck UI on a healthy process), reset to a known state or relaunch.
   2. **Evidence survives.** The evidence captured so far survives every cleanup. Check it at its named location; do not assume.
   3. **Nothing lingers.** Nothing a drive started outlives its usefulness. Clean up the residue of failed attempts whether the session is stuck, exited or shared. For a shared instance, clean the residue, not the instance.

   A doctor failure caused by skill drift is drift: fix it within the edit scope and retry once, restarting only what the fix invalidated, before calling the pass blocked.

   A feature that cannot be reached is `verified-unreachable` only with the concrete prerequisite (auth, entitlement, OS, external state) and the route you tried. When the map omits that prerequisite, that is drift.

   Drive every harness fix from triage live again before it ships. Final teardown happens after the last drive of the run, including those re-proofs, so nothing outlives the run. The evidence stays, per the skill.

5. **Triage.**
   - A wrong or missing user-facing description is doc drift: fix it.
   - Working behaviour the harness cannot drive is a harness gap: fix it. A harness fix follows the same helpers rule as generation: scripts are executable, and the skill body shows how to run them.
   - App behaviour that is actually broken is a product gap: record it for the user and keep it out of this PR.

6. **Ship or stop.** For **changed:** open one PR of proven corrections, after re-reading every changed file. For **clean** or **blocked:** no PR; report the outcome and the coverage honestly.

Keep short run notes (features covered, unreachable prerequisites, confirmed drift, outcome) in a scratch location, uncommitted.
