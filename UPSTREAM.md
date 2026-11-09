# Upstream

mori started from pstack, by Lauren Tan, MIT licensed.

- Repository: https://github.com/cursor/plugins, path `pstack`
- Commit: `2776ddd2355d6d6c8747d3964600f28daf62f049` (pstack 0.15.36)

Review upstream changes by hand. Automatic syncing would undo the rewrites below.

What was ported was decided by usage: every skill or playbook an agent ran for real work at least once, in the session scan described below. Skills that were only read while reviewing pstack itself were left out.

## Why it changed

A scan of 1,263 Pi session logs (October and November 2026) measured how pstack was used:

- The core `poteto-mode` skill was read in 209 sessions. Agents applied its principles 190 times, almost always from the one-line index in the core file.
- The 24 principle files were opened about 30 times in total. Several said less than their index line.
- 20 of 23 playbooks were rarely or never opened.
- The routed skills the core made mandatory (`architect`, `how`, `deslop`, `unslop`, `no-comments`, `interrogate`) were loaded in 0 to 5 sessions each.
- The Pi adapter, about 1,100 words translating Cursor terms, was read in 175 sessions.

The conclusion: agents follow what is in the file in front of them and skip chains of "now read another file". mori puts what every task needs in one file, and moves the rest into files that playbooks read as explicit steps.

## What changed

| pstack | mori |
|---|---|
| `poteto-mode` core, ~3,400 words, about 20 triggers routing to other skills | `mori-mode` core: working agreement, delegation, six principles in full, run log, playbook index |
| 24 principle files behind "read the leaf for any principle you apply" | Six principles in the core; the other 18 grouped into `design.md`, `change.md`, `evidence.md`, each read as a playbook step |
| 23 playbooks | 11 that were used at least once: feature, bug fix, refactoring, investigation, prototype, perf issue, multi-phase plan, babysit, authoring a skill, opening a PR, session pickup |
| 40 non-principle skills | 12 that were used at least once, under their upstream names: how, architect, interrogate, tdd, deslop, no-comments, unslop, technical-writing, and the four verification skills. Playbook steps call them by name. |
| `arena`, `swarm`, `statechart`, `why`, `benchmark-checklist` and the `comment-sicko` agent | Not ported. The parts other skills relied on are written into those skills: parallel runners and grafting in `architect`, adversary fan-out in `interrogate`, history reading for why questions, Explain the Number for benchmarks, the reviewer brief in `no-comments`, plain-words counterexamples in the formal verification skills |
| `watch-pr` script, Origin forge, `/loop`, cloud-VM swarm lanes | `gh` commands, and live lanes through the project's own verify method |
| Model tiers and `/setup-pstack` | The project's rules, or a one-line default |
| `pstack-pi` adapter and Pi extension | None; plain skills work in every harness |
| Compaction reminder via the Pi extension | The run log, with standing grants, re-read after compaction |
| Always-autonomous lead | A lead that talks with the user, with an explicit list of what goes to the user |

## writing-for-agents

`skills/writing-for-agents` is copied unchanged from Matt Pocock's skills, MIT licensed.

- Repository: https://github.com/mattpocock/skills, path `skills/productivity/writing-for-agents`
- Commit: `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`

Keep it unchanged, so it can be refreshed by copying the folder again. To update, compare it with upstream:

```sh
gh api repos/mattpocock/skills/contents/skills/productivity/writing-for-agents/SKILL.md --jq .content | base64 -d | diff - skills/writing-for-agents/SKILL.md
```
