---
name: handoff
description: Write the current conversation into a handoff document so a fresh agent can continue the work.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# Handoff

Write a handoff so a fresh agent, in this harness or another, can continue the work without this conversation. It is a snapshot of this moment, written once from this conversation. Save it at the project's scratch path, `tmp/handoffs/<task-slug>.md` by default; when no project is involved, use the OS temporary directory (`$TMPDIR`, else `/tmp`).

## Contents

Use these sections, in this order:

- **Goal:** the user's goal, in their words and yours.
- **Standing grants:** each grant in the user's quoted words, with the scope they named.
- **Decisions:** each decision with its reason and who made it.
- **In flight:** subagents, branches, worktrees, PRs and running processes, each with its state.
- **Next:** the next steps, in order, with the check that ends each one.
- **Suggested skills:** the skills and playbooks the next agent should read and follow, each with the path to its file.

When the user passed arguments, treat them as what the next session will focus on, and tailor the document to it.

## Rules

- Reference existing artifacts (specs, plans, decision records, issues, commits, diffs, PRs) by path or URL instead of copying their content.
- Redact sensitive information: keys, tokens, passwords, personal data.
- Write it so an agent that has never seen this conversation can act on it; name real paths, branches and commands.

Return the path of the handoff to the user.
