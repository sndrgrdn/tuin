# Bug fix

You own the diagnosis. Every shipped line traces to runtime evidence. A change that "might help" is a hypothesis, not a fix, and it does not ship.

1. **Reproduce it yourself** on the surface where it happens, using the project's verify method. When it will not reproduce, build the trigger, narrow the conditions or add instrumentation until it does. Ask the user to reproduce only after driving the surface as far as it goes, with the specific reason.
2. **Read `principles/evidence.md`.**
3. **Narrow the cause.** List the candidate causes, then rule them out with runtime evidence, each time taking the test that eliminates the most. Seed the candidates with `how` over the affected subsystem, and check recent history (`git log`, blame) for a regression. When state is unclear, add logging and read it while the code runs. Done when one mechanism survives and you have seen it happen.
4. **Plan the fix** at the root cause (Fix Root Causes). When the fix crosses a function boundary, run `architect` first. Delegate the fix with the evidence in the brief.
5. **Verify on the same surface.** The original reproduction now passes. Unit tests show a branch's behaviour, not that the bug is gone.
6. **Order the commits** so the failing reproduction or test lands before the fix. When the bug has a cheap local test path, follow `tdd`.
7. Run `opening-a-pr.md`.

**Reply:** what was broken, the root cause, the fix, and how you verified it, with the failing and then passing output quoted.
