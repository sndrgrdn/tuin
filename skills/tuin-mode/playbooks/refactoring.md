# Refactoring

You own the contract. The structure changes and the behaviour does not. When the work uncovers a missing feature or a real bug, split it out: ship the structural change first, then route the rest to Feature or Bug fix.

1. **Pin the behaviour first.** Run `how` over the area to learn the contract, then pin it with existing tests, a characterisation test, baseline outputs or an equivalence script, before any structure moves. A type check and a lint run are not a pin.
2. **Name the target shape:** the modules, types, owners and call graph you would build today (Redesign From First Principles). The reshape must delete branches, invalid states or leaked knowledge, not add indirection. When the target crosses a function boundary, run `architect` on the shape first.
3. **Subtract first.** Delete dead code, one-caller wrappers, redundant guards and orphaned references before introducing the new shape.
4. **Move in small steps** that each keep the pin green. When an API changes, migrate every caller and delete the old API in the same change. Check every rename against the actual files, including strings and docs.
5. **Prove behaviour is unchanged:** the pin still passes.
6. **Keep it only if reader load went down** (Minimize Reader Load), judged at both definitions and call sites. Otherwise revert.
7. **Order the commits**: deletions, then the reshape, then follow-on cleanup. Run `opening-a-pr.md`.

**Reply:** the structure that changed, the pin, and what you reverted.
