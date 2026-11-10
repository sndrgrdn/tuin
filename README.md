# mori

> 守 mori: "keeper, protector." A tool that serves long enough earns a spirit (付喪神); this one helps tend the garden.

A small set of agent skills for working with one lead agent that talks with you, delegates to autonomous subagents, and verifies their work. It is plain `SKILL.md` files, so it works in any harness that reads skills: Pi, Claude Code, Amp, Codex, Cursor.

Derived from Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack) and Sander's [skills](https://github.com/sndrgrdn/skills), with skills from Matt Pocock's [skills](https://github.com/mattpocock/skills). See [UPSTREAM.md](UPSTREAM.md) for sources and what changed.

## Skills

| Skill | Role |
|---|---|
| `mori-mode` | The lead. You invoke it with `/mori-mode`. Holds the working agreement, delegation rules, the six always-on principles, the run log and the playbook index. |
| `mori-mode/principles/` | The engineering principles, one file per topic: `design`, `data`, `change`, `runtime`, `security`, `testing`, `evidence`. |
| `mori-mode/playbooks/` | Feature, bug fix, refactoring, investigation, prototype, perf issue, multi-phase plan, babysit, authoring a skill, opening a PR, session pickup. |
| `mori-agent` | The brief every subagent reads first. |
| `grill-me`, `domain-modeling` | Align with the user on the goal, the plan and the words, and record the project's rules as RFCs. |
| `how`, `research`, `deep-research`, `show-me` | Understand the codebase and the outside world, and explain it visually. |
| `architect`, `interrogate` | Design a change with competing models, and try to break it. |
| `tdd`, `simplify`, `no-comments` | Fix test-first, and clean a diff before commit and review. |
| `prove-it`, `create-verification`, `maintain-verification` | Prove work on the real surface, and build and maintain the project skill that drives it. |
| `create-formal-verification`, `maintain-formal-verification` | Formal verification for costly, hard-to-test properties. |
| `pr-description`, `technical-writing`, `unslop` | PR bodies, docs and commits, and prose without AI tells. |
| `code-review` | Reviews a diff for defects and needless complexity. |
| `handoff`, `retro`, `reprompt` | Hand work to a fresh session, learn from a finished one, and sharpen a prompt. |
| `writing-for-agents` | How to write skills, `AGENTS.md` files and briefs. |

## Install in Pi

The repo is a Pi package. Install it from the local checkout, which loads in place without copying:

```sh
pi install ~/Developer/mori
```

This loads every skill, the `mori-agent` subagent (for `pi-subagents`), and the `mori-mode` extension. `/mori-mode` toggles mori mode for the session and shows `mori` in the status bar. While it is on, every request follows the skill. Compaction writes a mori handover instead of Pi's summary: goal, standing grants quoted word for word, decisions, work in flight, next steps and critical context, using the newest run log in `tmp/runs/` when one exists. After the compaction, the agent rereads the skill, the run log and the active playbook.

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
