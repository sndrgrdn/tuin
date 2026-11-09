---
name: how
description: Explain how a part of the codebase works, at the level a senior engineer needs to start working in it. Also answers where something should live and which layer owns it.
disable-model-invocation: true
---

# How

Answer "how does X work?" with an architectural explanation: enough for a senior engineer new to the area to build a working mental model, without reading like annotated source code. Also use it for placement questions: where should this live, which module owns this, is this the right layer.

Every subagent here is read-only. Explorers run on a fast model; the explainer runs on your strongest model, unless the project's rules say otherwise.

## 1. Assess the scope

When the question is ambiguous, state your interpretation and continue. The user can redirect.

- **Simple** (one module, a small utility, one function): skip the explorers. Spawn one explainer that explores and explains in one pass, briefed from `references/explainer-prompt.md` without the findings section. Go to step 4.
- **Complex** (a subsystem across several files or services, a cross-cutting feature, an architectural overview): go to step 2.

When in doubt, take the simple path.

## 2. Explore (complex only)

Split the question into two to four angles, each a distinct slice of the subsystem. Spawn all explorers at once, each briefed from `references/explorer-prompt.md` with its angle filled in.

## 3. Synthesise (complex only)

When every explorer has returned, spawn one explainer briefed from `references/explainer-prompt.md` with all findings filled in.

## 4. Present

Present the explainer's output. Light edits for clarity or for context from the conversation are fine; keep its substance.

The explanation uses these sections, dropping any that do not apply: Overview, Key Concepts, How It Works, Where Things Live, Gotchas.
