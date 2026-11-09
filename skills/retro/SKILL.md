---
name: retro
description: "Conduct a retrospective on a coding session."
disable-model-invocation: true
---

The user has asked for a **retrospective**. You are suggesting improvements to the coding agent's **environment** (the repo, its checks, its instruction files and the skills) to improve future runs. One-offs are not learnings; skip a retro when the session was trivial or followed an existing skill correctly.

## Steps

1. Read and follow the [writing-for-agents skill](../writing-for-agents/SKILL.md) for the writing style guide.

2. **Locate the transcript.** Read the primary sources for the session the user specifies. This may mean searching the harness's session logs on this machine; search only the current project's logs, never other projects'. If the user doesn't specify a session, default to the current one. When no transcript file can be found, write a tight digest of the session instead.

3. **Fan out three reviewers in parallel,** each a fresh subagent with its prompt from `references/` passed verbatim and the transcript path or digest filled in. Use your strongest model for judgment, divergent and the synthesizer; the tooling reviewer may use a fast one.

   | Lens | Prompt |
   |---|---|
   | Judgment: the durable principle behind an incident | `references/judgment-reviewer.md` |
   | Tooling: commands, paths and quirks, and context the user pasted that the agent could have fetched | `references/tooling-reviewer.md` |
   | Divergent: blind spots, second-order effects, skills that should have fired | `references/divergent-reviewer.md` |

   Each reviewer checks the session against the categories below.

4. **Synthesize.** Give a fresh subagent `references/synthesizer.md` verbatim with each reviewer's full output inlined. It returns Accepted, Rejected and Backlog lists.

5. **Check for structure.** Move any Accepted item that a lint rule, script, type, hook or CI job would enforce more reliably into a check proposal (Encode Lessons in Structure, `mori-mode/principles/evidence.md`).

6. **Present** the candidates to the user in order of severity, and wait for approval before applying any of them. The user picks the subset and may redirect routings.

7. **Apply** each approved item. A trivial edit (a bullet, a tightened sentence, a stale fact) is made directly. A new section, a new skill, or a description tuned to make a skill trigger follows `mori-mode/playbooks/authoring-a-skill.md`. Every new check is proven to fail on a real past instance of the mistake, and runs through the same command locally and in CI. Never push or open a PR without asking.

## Categories

- **Navigation**: how easy was it for the agent to find the right files? Are there hidden dependencies between files? Would a **navigation pointer** make it easier? _Use when_ the session took a long time to find a piece of information.
- **Automated checks**: are there automated checks that could catch errors the agent made? Linting, typing, tests, filesystem linters? Read the repo's own check command first (its `package.json`/build-tool `lint`/`check` scripts, its CI workflow), so a check that already exists but sits unwired or silently broken is the finding, not a reinvention. A repo with no **guardrail** (no pre-commit hook and no CI job running its lint/typecheck/test command) is itself a finding: an un-linted repo is a standing missed opportunity, not a neutral default. _Use when_ the agent made a mistake an automated check could have caught, or the repo has no guardrail at all.
- **Coding standards**: do implementation and review need a new rule? Should an existing rule be removed or clarified? Classify the violation first: a **mechanical** one (a fixed syntactic pattern, a banned API, an import shape, a file-location rule) gets a deterministic check, full stop: a custom rule in the repo's own linter, a new pre-commit hook, or a new CI job, whichever the repo's language and existing guardrail make cheapest. Default to building the check over writing the rule, and prefer an architecture or type change that makes the mistake impossible over either. Keep shared engineering rules in [`mori-mode/principles/`](../mori-mode/principles/). Reserve `CODING_STANDARDS.md` for project-specific **judgement calls** (cross-file consistency, "matches the surrounding style," anything no guardrail could ever substitute for). _Use when_ implementation or review missed an applicable rule.
- **Global AGENTS.md**: are there any steering instructions that should be moved to coding standards (or automated checks) instead? _Use when_ the AGENTS.md file is particularly large - in the repo OR the user's global scope.
- **Tool economy**: did the agent make expensive tool calls that could be streamlined? Is there any custom tooling (CLI's, MCP's) that is particularly token-inefficient? _Use when_ the agent made an expensive tool call.
- **No-ops**: look for instructions in steering files that don't modify the agent's behavior. _Use when_ the steering files are large and unwieldy.
- **Information access**: look for opportunities to increase the agent's access to information. Teeing dev server logs, readonly access to third-party services. _Use when_ a crucial piece of information was not available to the agent, or the user pasted context the agent could have fetched.
- **Skills**: did a skill the session used have a real gap, or did a skill that would have helped fail to trigger? _Use when_ the agent improvised a workflow a skill already describes.

## Reference

### Implementation vs Review

Implementation applies the relevant shared engineering rules and project-specific standards while designing, changing, and verifying code. Review independently checks the resulting behavior and evidence, including surrounding callers, implementations, and tests where needed. Use the [mori-mode playbooks](../mori-mode/SKILL.md) and the [code-review skill](../code-review/SKILL.md) for their respective workflows.

### Files

You have access to several files in the repo:

- `CLAUDE.md`/`AGENTS.md`: these files are pushed to the context window of any agent working in this repo. They should be used incredibly sparingly, usually only for **navigation pointers** to other files.
- `CODING_STANDARDS.md`: project-specific requirements and conventions, read during both implementation and review. Keep shared engineering rules in [`mori-mode/principles/`](../mori-mode/principles/). Disclose topic-specific references behind **navigation pointers** when only some work needs them.
- Docs: use docs as references files, pointed to by other files. Look for existing docs before writing new ones.
- Skills: use skills for docs (since their description goes into the agent's context window), or for user-invoked commands. Read and follow [`writing-for-agents`](../writing-for-agents/SKILL.md).
