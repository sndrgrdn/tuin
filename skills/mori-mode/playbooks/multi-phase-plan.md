# Multi-phase or multi-PR plan

You own the plan, not the code. The plan is a checklist that subagents run box by box and the user audits from the evidence. The plan is the deliverable: do not implement.

1. **Skip the plan** when the change is one or two files with an obvious approach. Say so and stop.
2. **Align with the user first.** Run `grill-me` until the goal, premise and design tree are shared. Then **settle open questions by prototype before writing.** Run `prototype.md` for each. Keep the branch, the commit and the screenshots for Appendix A. Ask the user only about a product or preference call no run can settle, with options (Never Block on the Human).
3. **Explore through subagents** (Guard the Context Window). Each returns file pointers, conventions, test commands and entry points, not pasted file contents.
4. **Read `principles/change.md`,** and every other principle file whose topic the program touches. Then copy the skeleton below into the plan file and fill every placeholder. Unless the user names a path, write it to the project's scratch folder (default `tmp/plans/<slug>.md`). Keep every heading and sub-block, in the order shown. One section per PR, and one PR is one change with its own evidence (Sequence Work into Verifiable Units).
5. **Write it** under `technical-writing`, then `unslop`. The body is a how-to; the appendices hold explanation and reference. Each heading states the task or the finding. No long dashes, no mid-sentence colons.
6. **Run the check:** `node <skills>/mori-mode/scripts/check-plan.mjs <plan.md>`, and fix every line it prints (Encode Lessons in Structure).
7. **Hand back.** Post the plan path and the script's output, then stop. Execution starts on the user's explicit go. Record that go, and any grants that come with it, in the run log.

## Verification rule

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. That sentence is the rule, and every verification block opens with it.

- **Live is mandatory.** Live lanes drive the real surface at the PR head through the project's verify method. Each lane is one box with a concrete scenario, the screenshot or output it saves, and its pass condition. Size the lane count to the change; three is a floor for an interaction change.
- **Lane 1 is the regression lane against main.** It runs the same main scenario on main and on the PR head. When main does not have the feature, the lane records that, and instead gates the behaviour the diff adds plus the end state the user waits for. It never invents a main result.
- **Perf is two-sided.** Main and the head must both produce the named metric. When main lacks the feature, also isolate the work the diff adds and set an absolute budget for it and for the end state the user waits for. Never claim a ratio between unlike scenarios.
- **Interaction changes are review-gated.** The user reviews them with screenshots and a recording before merge. A PR that changes no interaction writes `**Review gate.** None. <PR id> is not review-gated.` with no boxes under it.

## Skeleton

````markdown
# <Program> plan

<Under ten lines. What changes, for whom, the rule the program enforces, and the PR ids in order.>

## How to read this

One box is one unit of work. Every box names the evidence that checks it. A nested box is a sub-step of the box above it. Check a box only when its evidence exists, such as a file, a log line, a screenshot, a test run, or a commit. The body is a how-to. The appendices explain and record.

Each PR runs `mori-mode/playbooks/<feature, bug-fix, refactoring or perf-issue>.md`. <Who merges, and which PRs stop at merge-ready for the user.>

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Program checklist

### Arm the program

- [ ] State this plan to the user, then stop. Start only on the user's explicit go, and record it in the run log.
- [ ] Re-read these at program start and at each phase boundary.
  - [ ] `mori-mode/SKILL.md` and the playbook each PR runs.
  - [ ] The project's verify skill or method.
  - [ ] `mori-mode/playbooks/opening-a-pr.md`.
- [ ] On a hold from the user, tell every subagent to stop writing at once.

### Owners

- [ ] Give each PR a fresh subagent owner, briefed per `mori-agent`.
- [ ] Follow this dependency graph. Start dependent work only after its parent merges, or base it on the parent branch when stacking.
  - [ ] <PR id> and <PR id> are independent and first. Both branch from `main`.
  - [ ] <PR id> after <PR id>.
- [ ] Hold the file boundaries. <PR id> touches only `<glob>`.
- [ ] Hold the review gate. <PR ids> change an interaction. They wait for the user's review with screenshots and a recording before merge.

### PR mechanics

- [ ] Each owner works in its own worktree or branch.
- [ ] Run `simplify` before each commit and `no-comments` before review.
- [ ] Run the project's linters and merge gate before the PR-facing push.
- [ ] Open each PR ready for review, per `opening-a-pr.md`. A stack child targets its parent branch.
- [ ] Triage review-bot comments per `mori-mode/references/bot-triage.md`.
- [ ] Rebase onto current main before the code-ready report. Rebase again only for merge, a conflict with main, a CI failure caused by a change on main, or a known concurrent change to the same files.

### Verdict and merge

- [ ] Run an independent check once at the code-ready head, covering the PR's live and perf blocks. Run another only for new behaviour, a redesign or a large new diff. A rebase, a conflict resolution or a small fix gets a single re-check of the affected lanes. A wording-only change gets none.
- [ ] A finding blocks only when a run shows it, at the head, or when the PR made a doc wrong. A failure in the regression lane on main's behaviour is recorded against main and does not block the PR.
- [ ] <The merge rule. Who merges, and on what signal.>

### Live recipe

- [ ] Check out the PR head in a clean worktree.
- [ ] <Start the app through the project's verify method. Wait until it is usable.>
- [ ] <Drive input only through the verify method. Name its read-only diagnostics.>
- [ ] Save every artifact under `tmp/verify/<pr-id>/` and return the paths with the report.

## <Task as a verb phrase> (<PR id>)

**Depends on.** <PR id, or None.>

**Files.**

- [ ] Edit `<path>`.
- [ ] Create `<path>`.
- [ ] Delete `<path>`.

**Build.**

- [ ] <One change. Name the symbol and the file.>

**You see.**

- [ ] <One observable result, with the exact log line or screen state.>

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] <Test file and the case it gains.> Run `<command>`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Lanes run at the PR head, per the live recipe.

- [ ] Lane 1. Regression lane against main. Run <the main scenario> on main and on the head. If main lacks the feature, record that and gate <the behaviour the diff adds plus the end state the user waits for>. Save `<slug>.png`. Pass when <condition>.
- [ ] Lane 2. <Scenario.> Save `<slug>.png`. Pass when <condition>.
- [ ] Lane 3. <Scenario.> Save `<slug>.png`. Pass when <condition>.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. <What is measured on main and the head. If main lacks the feature, also name the added work and the end state the user waits for.>
- [ ] Probe. <The command, run on main and the head, interleaved. Both sides must produce the metric.>
- [ ] Baseline. Record the main <value> first.
- [ ] Rule. <Head against main, with the number that fails. For unlike scenarios, absolute budgets instead of a ratio.>

**Review gate.** The user reviews before merge.

- [ ] Copy the lane screenshots into the PR description.
- [ ] Record a 30 to 60 second video of the change and attach it to the PR.
- [ ] Post the screenshots and the video to the user. Stop at merge-ready and wait for the user's go.

**Merge.**

- [ ] A clean verdict at the exact head commit.
- [ ] Review-bot triage done.
- [ ] Rebased onto current main after the verdict, with no change to the patch.
- [ ] <Who merges, per the project's rules and the run log's grants.>

## Close the program

- [ ] Every box above is checked with its evidence.
- [ ] Report to the user with each PR, its verdict, and what remains open.

## Appendix A. Prototype evidence

<Each open question a prototype answered, with the branch, the commit and the artifact links. Each question that stays unproven.>

## Appendix B. Alternatives rejected

<Each approach weighed, and why it lost.>

## Appendix C. Risks

<Each risk, the PR it lands in, and what the owner watches.>

## Appendix D. Links and reading list

<Docs to read before editing. Which PRs get `how`, `architect` or `interrogate`.>
````

**Reply:** the plan path, the PR ids with their dependencies and the review-gated set, what the prototypes proved and what stays unproven, and the check script's output.
