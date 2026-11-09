# Refactoring

You own the contract. The structure changes and the behaviour does not. When the work uncovers a missing feature or a real bug, split it out: ship the structural change first, then route the rest to Feature or Bug fix.

1. **Pin the behaviour first.** Run `how` over the area to learn the contract, then pin it with existing tests, a characterisation test, baseline outputs or an equivalence script, before any structure moves. Pin required failures, effects and ordering too. A type check and a lint run are not a pin.
   **Complete when** a check exists that fails if the observable behaviour changes.
2. **Read `principles/design.md` and `principles/change.md`,** plus any other file whose topic the change touches.
3. **Name the target shape:** the modules, types, owners and call graph you would build today (Redesign From First Principles). The reshape must delete branches, invalid states or leaked knowledge, not add indirection. When the target crosses a function boundary, run `architect` on the shape first.
4. **Subtract first.** Delete dead code, one-caller wrappers, redundant guards and orphaned references before introducing the new shape.
5. **Move in small steps** that each keep the pin green. When an API changes, migrate every caller and delete the old API in the same change. Check every rename against the actual files, including strings and docs.
6. **Prove behaviour is unchanged** on the real artifact: the pin, plus an equivalence run or smoke test for a larger reshape.
7. **Keep it only if reader load went down** (Minimize Reader Load), judged at both definitions and call sites. Otherwise revert. When a complexity metric still complains, report it instead of carving up cohesive code.
   **Complete when** behaviour is equivalent, callers are accounted for, obsolete surfaces are gone, and reader load is lower.
8. **Order the commits**: deletions, then the reshape, then follow-on cleanup. Run `opening-a-pr.md`.

**Reply:** the structure that changed, the pin, the equivalence proof, the reader-load change, and what you reverted.
