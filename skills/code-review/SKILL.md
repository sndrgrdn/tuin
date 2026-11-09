---
name: code-review
description: Review code for correctness and unnecessary complexity. Use when the user asks to review a diff, branch, pull request, working-tree changes, or selected code.
---

Review thoroughly within the requested scope. Find defects and simpler designs that preserve the required behavior. Diagnose and report; leave files unchanged unless the user requests edits.

## Review procedure

1. **Establish scope and purpose.** Resolve the requested files or comparison, including staged, unstaged, and untracked work when requested. Read the applicable repository instructions, requirements, and decisions, including the RFC statements of each changed domain in `docs/rfcs/INDEX.md` when the project keeps RFCs. Cite a broken statement by its number, such as `RFC-0404.2`. Ask when ambiguity changes the review target or required behavior; distinguish missing evidence from inferred intent.

2. **Understand the change.** Read every changed part in scope and the surrounding callers, implementations, and tests needed to understand it. Trace caller-visible behavior, guarantees, state transitions, failures, and effects, including what the change now does differently that the diff does not spell out. Verify material premises rather than treating the author's explanation as proof.

3. **Apply relevant principles.** Select the principle files from the routing table in `mori-mode/SKILL.md` and read each applicable one completely, together with the review notes below. Apply their engineering rules to the reviewed work, not their implementation workflow. Documented repository requirements override these defaults. Investigate both broken behavior and unnecessary complexity; preserve justified boundaries and real case distinctions.

4. **Look where search stops.** Callers are cheap to list; the breakage a symbol search misses is the job. Read the source of libraries the change calls at their pinned version, and work out when code runs (teardown, async ordering, transactions). Follow what crosses a boundary without a shared symbol: an API response shape, a database column, a wire format, a feature flag, a job payload, a consumer several hops downstream.

5. **Substantiate findings.** Trace each concern to a reachable failure, a concrete maintenance burden, or a violated applicable requirement. Look for counterevidence in contracts, callers, constraints, and existing mechanisms. For a simplification, show what becomes easier and account for the behavior, invariants, compatibility, and costs it must preserve. When the change is safe because of one fact, name that fact and push it as far down this ladder as is cheap, saying where it stopped:
   1. asserted;
   2. pointed at: a real `file:line` or the library's own source;
   3. walked: the failure path traced step by step and shown not to reach;
   4. run: a script or test that calls the real code and fails loudly if the fact is false;
   5. reproduced in the running application.

   Run relevant existing checks or a focused, non-mutating reproduction when useful and safe. State what the evidence establishes and what remains unknown.

6. **Report.** Prioritize findings by consequence, consolidate shared root causes, and suggest the smallest useful remedy. Attribute findings to the reviewed work; inspect unchanged context without turning unrelated debt into findings. Separate unresolved material questions from confirmed issues, and list the risks you checked and cleared. State the reviewed scope, checks, and limitations. If no supported issues remain, say **no findings**.

## Review notes per principle file

- **`design.md`:** Distinguish domain behavior, application policy, technology mechanics, and composition; inspect existing owners and callers to assess where changed responsibilities belong. Substantiate misplaced knowledge or duplicated policy through a concrete consequence, not a preferred layer name. Assess reader load, information hiding, current need, and simpler equivalent designs.
- **`testing.md`:** Examine whether the tests would detect the relevant regression, not merely whether they pass.
- **`change.md` and `evidence.md`:** Assess root-cause correction, behavioral equivalence, caller migration, shared-write ownership, and measurement validity as applicable. Judge the resulting code and supporting evidence; do not require the author's implementation sequence, TDD, prototypes, delegation, or work cadence.

A pattern is an investigation signal, not a verdict. Establish what is wrong here before prescribing a different structure. Omit preference-only findings and checks already covered by verified active tooling.

## Finding format

For each finding, give:

- **Location and problem:** the smallest useful code location and a direct description.
- **Consequence and evidence:** the affected behavior or maintenance burden, the relevant path or contract, its likelihood and cost, and a reproduction or rule citation when applicable.
- **Remedy:** a proportionate correction or concrete simplification direction, with the cheapest test or reproduction that would catch it.

Distinguish required corrections from non-blocking improvements. No finding quota applies.

## Completion criterion

Every changed part in scope has been inspected, relevant principles applied, and candidate findings supported or discarded. The fact the change's safety rests on is named with its rung on the ladder, or marked unproven. Report blocked investigations explicitly; do not present incomplete coverage as a clean review.
