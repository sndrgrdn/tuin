# Refactoring

You own the contract. The structure changes and the behaviour does not. When the work uncovers a missing feature or a real bug, split it out: ship the structural change first, then route the rest to Feature or Bug fix.

1. **Pin the behaviour first.** Have a subagent map the area, then write a characterisation test, snapshot or equivalence script that captures current behaviour, before any structure moves. A type check and a lint run are not a pin.
2. **Read `principles/design.md` and `principles/change.md`.**
3. **Name the target shape**: the modules, types and call graph you would build today (Redesign From First Principles). The reshape must delete branches or invalid states, not add indirection.
4. **Subtract first.** Delete dead code, one-caller wrappers, redundant guards and orphaned references before introducing the new shape.
5. **Move in small steps** that each keep the pin green. When an API changes, migrate every caller and delete the old API in the same change. Check every rename against the actual files, including strings and docs.
6. **Prove behaviour is unchanged** on the real artifact: the pin, plus an equivalence run or smoke test for a larger reshape.
7. **Keep it only if reader load went down** (Minimize Reader Load). Otherwise revert.
8. **Order the commits**: deletions, then the reshape, then follow-on cleanup. Run `opening-a-pr.md`.

**Reply:** the structure that changed, the pin, the equivalence proof, the reader-load change, and what you reverted.
