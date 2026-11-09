# Feature

You own the design: plan, delegate, review, verify. Subagents write the code.

1. **Map the area** with `mori-how` over the affected subsystem, plus the project rules that apply. Done when you can name every file the change touches.
2. **Read `principles/design.md`.** Name the data shape and the structure that organises it (Model the Domain) before any logic is written.
3. **Run `mori-architect` when the change crosses a function boundary.** Skip with a reason for a change inside one function.
4. **Plan the throughput.** Write four todo items, each answered or marked `n/a: <reason>`:
   - blocking first steps that must land before any fan-out;
   - independent workstreams (disjoint files, services or layers) that can run in parallel;
   - shared state that parallel writers would touch, split per Separate Before Serializing Shared State (`principles/change.md`);
   - the smallest safe split, and why one worker is enough when it is.
5. **Delegate the build.** Brief each subagent with the goal, the files, the named data shape, the success criteria and how to prove it. One coupled change goes to one owner, who may fan out after the blocking steps.
6. **Verify on the real surface** per Prove It Works and the project's verify method. Review every diff yourself. Run an independent check before the user reviews.
7. **When the design is contested,** run `mori-interrogate` before shipping.
8. **Order the commits** into small units that each pass on their own (Sequence Work into Verifiable Units).
9. Run `opening-a-pr.md`.

**Reply:** what you built, what you chose and why, open decisions. Use a table for design alternatives.
