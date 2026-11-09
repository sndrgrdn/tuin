# mori

> 守 mori: "keeper, protector." A tool that serves long enough earns a spirit (付喪神); this one helps tend the garden.

A small set of agent skills for working with one lead agent that talks with you, delegates to autonomous subagents, and verifies their work. It is plain `SKILL.md` files, so it works in any harness that reads skills: Pi, Claude Code, Amp, Codex, Cursor.

Derived from Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack). See [UPSTREAM.md](UPSTREAM.md) for what changed and why.

## Skills

| Skill | Role |
|---|---|
| `mori-mode` | The lead. You invoke it with `/mori-mode`. Holds the working agreement, delegation rules, the six always-on principles, the run log and the playbook index. |
| `mori-mode/principles/` | The other principles, grouped by when they apply: `design.md`, `change.md`, `evidence.md`. |
| `mori-mode/playbooks/` | Feature, bug fix, refactoring, investigation, prototype, perf issue, multi-phase plan, babysit, authoring a skill, opening a PR, session pickup. |
| `mori-agent` | The brief every subagent reads first. |
| `how`, `architect`, `interrogate` | Understand, design and attack a change. |
| `tdd`, `deslop`, `no-comments` | Fix test-first, and clean a diff before commit and review. |
| `unslop`, `technical-writing` | Prose and documentation standards. |
| `create-verification`, `maintain-verification` | Build and maintain a project skill that drives the app like a user. |
| `create-formal-verification`, `maintain-formal-verification` | Build and maintain formal verification for costly, hard-to-test properties. |

## Install into a project

Copy the skills into the folder your harness reads, usually `.agents/skills/`:

```sh
cp -R skills/* <project>/.agents/skills/
```

Copy instead of symlinking when cloud agents (Amp orbs, Codex cloud, background agents) must see the files, because they only see what is committed.

## What the project provides

A project with established conventions, such as one with an `AGENTS.md` that points to its working rules, CI and verify skill, needs nothing extra. For a new project, mori-mode relies on the project's `AGENTS.md` to say:

- how to verify a change on the real surface;
- the command that gates a merge;
- where decisions and conventions live;
- who merges, and when.

Project rules win over mori-mode wherever they overlap. Put project-specific skills, such as a verify skill, in the project, not here.

## Measure it

`tools/scan-usage.mjs` scans Pi session logs and counts which mori files agents actually read:

```sh
node tools/scan-usage.mjs ~/.pi/agent/sessions
```
