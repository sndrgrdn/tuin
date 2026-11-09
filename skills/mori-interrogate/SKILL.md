---
name: mori-interrogate
description: Adversarial review. Several agents on different models try to break a change or design, and only findings proven by a run survive. Reports findings and applies no fixes.
disable-model-invocation: true
---

# Interrogate

Adversaries try to break a change or a design. A finding survives only when a run proves it. Report the findings; apply no fixes.

## 1. Frame

The scope is what the user names. Otherwise it is the branch diff from its merge base with the base branch, including the working tree.

State the intent in your own words, from the user's message, the commits and the PR description. Ask the user when the intent is unclear.

## 2. Fan out

Spawn at least two adversaries at once, on different model families where the harness allows. Give each its own worktree with the scope's uncommitted changes copied in, the scope, the intent, and this brief:

> Break this change. Prove each finding with a run against the real code: a failing test, a reproduction script, or command output that shows the wrong behaviour. For a design or plan, build a prototype or probe the current code. Keep reproductions in your own worktree. Report each finding with a title, the exact command, the output it printed, and the output the intent requires. Report only what you ran; style, naming, structure and risks that need a future change to matter are out of scope. No findings is a valid result.

An adversary that returns nothing is dropped and noted.

## 3. Verify

Rerun each finding's command yourself. Keep a finding when the output shows the failure and the failure breaks the intent. Drop the rest. Merge findings that share a root cause.

Adversaries find different failures, so the result keeps every verified finding from every adversary.

## Output

- **Intent:** the restatement.
- **Findings:** for each verified finding, the command, its output, how it breaks the intent, and which adversaries found it. Say "no verified findings" when none survive.
- **Dropped:** for each adversary, how many findings were dropped and why.
