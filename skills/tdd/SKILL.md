---
name: tdd
description: Fix a bug test-first. Write a focused regression test that fails before the fix and passes after it, when a cheap local test path exists.
disable-model-invocation: true
---

# TDD bug fix

When a bug has a clear, cheap test path, make the broken behaviour executable before changing production code. The goal is one focused regression test that fails before the fix and passes after it.

Use this when the user asks for TDD, a failing test or a regression test, or when the bug has an obvious, cheap local test target. When a test would need broad harness setup, brittle mocks, slow end-to-end infrastructure, production-only state, vague reproduction steps or large unrelated fixture changes, use the closest useful check instead (see below).

Tests follow Test Behavior, Not Implementation, and the project's testing rules.

## Steps

1. **Understand the bug:** the intended behaviour, the current behaviour, the affected path, and the smallest observable reproduction.
2. **Choose the narrowest executable check.** Prefer the closest unit, component, integration or regression test the project already uses for that code path. When no practical test path is obvious, take the fallback below instead of building one from scratch.
3. **Write the failing test first:** the smallest test that would have caught the bug, asserting the intended behaviour, not the current implementation.
4. **Run it before fixing.** Confirm it fails for the intended reason. When it passes, or fails for another reason, fix the test or the reproduction before touching the implementation.
5. **Fix the bug** with the smallest production change that gives the intended behaviour and keeps nearby contracts.
6. **Rerun the test** and confirm it passes. Run the nearby tests too.

## When a failing test is impractical

Use the closest executable check instead: a targeted script, a reproduction command, browser automation, a snapshot comparison, a log assertion, or a focused integration check.

No new test beats a bad test. A bad test mostly tests mocks, pins implementation details, depends on timing or unrelated global state, needs expensive infrastructure for a small fix, or would be deleted right after proving the fix.

## Guardrails

- Change a test only when the expected behaviour changed, never to match a wrong implementation.
- Keep existing assertions as strong as they are, unless the expected behaviour genuinely changed and you can say why.
- Keep the regression test focused on the bug; avoid broad fixture changes and unrelated coverage.
- For a flaky bug, make the test deterministic where possible, and say which signal it locks down.
- When the bug reveals a wider class of failures, land the focused regression test first, then consider sibling cases.

## Report

Report the evidence, not only the outcome:

- the failing test or check, and the failure it produced before the fix;
- the passing run after the fix, and any nearby checks;
- when you could not show a failure before the fix, why not, and the closest check you used instead.
