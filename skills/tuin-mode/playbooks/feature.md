# Feature

You own the design: plan, delegate, review, verify. Subagents write the code. Distinguish a new feature from a defect correction (`bug-fix.md`) and a behaviour-preserving change (`refactoring.md`).

1. **Establish the outcome.** State who uses the change and what they should see. For a new or redesigned screen, run `prototype.md` and get the user's pick before building, and name the user's reference material in the brief.
2. **Map the area** with `how` over the affected subsystem. Skip it for code you already read this session.
3. **Choose the shape and owner.** Name the data shape and the owner of each changed concern, extending an established owner when it fits. Run `architect` when the change crosses a function boundary. Read the principle files whose topic the change touches when the decision is not obvious.
4. **Plan the throughput.** Write four todo items, each answered or marked `n/a: <reason>`:
   - blocking first steps that must land before any fan-out;
   - independent vertical slices that can run in parallel;
   - shared state that parallel writers would touch, split per Separate Before Serializing Shared State;
   - the smallest safe split, and why one worker is enough when it is.
5. **Build it slice by slice.** Brief each subagent with the goal, the files, the named data shape and the success criteria. One coupled change goes to one owner. Remove what the change makes obsolete; keep unrelated cleanup out.
6. **Verify on the real surface** with the project's verify method, sized to the change (Prove It Works). Run `interrogate` when the design is contested.
7. **Order the commits** into small units that each pass on their own.
8. Run `opening-a-pr.md`.

**Reply:** what you built, what you chose and why, and open decisions.
