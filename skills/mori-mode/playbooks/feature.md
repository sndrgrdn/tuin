# Feature

You own the design: plan, delegate, review, verify. Subagents write the code. Distinguish a new feature from a defect correction (`bug-fix.md`) and a behaviour-preserving change (`refactoring.md`).

1. **Establish the outcome.** State who consumes the behaviour, what they should observe, and the check that will prove it (Experience First). Read the project's rules, configuration, decision records, the callers, the tests and the established implementations. Note the runtime and dependency versions that matter. Verify factual premises against the repo, runtime or data: an author's explanation tells you intent, not truth.
   **Complete when** the outcome, constraints, current behaviour and verification path are known, and each material unknown has an investigation or is reported as a blocker.
2. **Map the area** with `how` over the affected subsystem.
   **Complete when** you can name every file the change touches and the current owner of each concern.
3. **Choose the shape and owner.** Read `principles/design.md`, plus `principles/data.md` when values, state or failures change. Sketch a real caller's usage, then the input, output, failures, invariants and effects of each new or materially changed interface. Extend an established owner when it fits. Run `architect` when the change crosses a function boundary; skip it with a reason for a change inside one function.
   **Complete when** every changed concern has an intentional owner, the caller-facing contract is explicit, and the shape accounts for the whole operation without speculative flexibility.
4. **Load the other contracts.** Read every remaining principle file whose topic the change touches (the table in `SKILL.md`): `runtime.md` for config, storage, jobs or retries, `security.md` for personal data, auth or logging, and always `testing.md`.
   **Complete when** every applicable rule is met by the design, or has a narrow, evidence-backed exception.
5. **Plan the throughput.** Write four todo items, each answered or marked `n/a: <reason>`:
   - blocking first steps that must land before any fan-out, including a tracer bullet through any unproven boundary (`principles/change.md`);
   - independent vertical slices that can run in parallel;
   - shared state that parallel writers would touch, split per Separate Before Serializing Shared State;
   - the smallest safe split, and why one worker is enough when it is.
6. **Build it slice by slice.** Brief each subagent with the goal, the files, the named data shape, the principle files to read, the success criteria and how to prove it. One coupled change goes to one owner. Each slice completes one caller-visible behaviour and runs its checks before the next starts. Remove what the change makes obsolete; keep unrelated cleanup out.
   **Complete when** every traced path is implemented through its owner, every supporting change serves the goal, and each slice has direct verification evidence.
7. **Prove it works** on the real surface with the project's verify method (Prove It Works). Exercise required failure paths, invariants and effects, not only the happy path. Review the whole diff against the outcome and the chosen owners, and check callers and obsolete references after any move. Run an independent check before the user reviews; run `interrogate` when the design is contested.
   **Complete when** each changed contract has evidence or a concrete, reported blocker, every changed hunk serves the goal, and nothing unmet is presented as done.
8. **Order the commits** into small units that each pass on their own (Sequence Work into Verifiable Units).
9. Run `opening-a-pr.md`.

**Reply:** what you built, what you chose and why, commands and results, and open decisions. Separate verified behaviour from inference and from checks not run. Use a table for design alternatives.
