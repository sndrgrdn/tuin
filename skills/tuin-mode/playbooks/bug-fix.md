# Bug fix

You own the diagnosis. Every shipped line traces to runtime evidence. A change that "might help" is a hypothesis, not a fix, and it does not ship; when evidence refutes a hypothesis, revert what it motivated.

1. **Reproduce it yourself** on the surface where it happens, with the project's verify method. When it will not reproduce, build the trigger, narrow the conditions or add instrumentation until it does. Ask the user to reproduce only after driving the surface as far as it goes, with the specific reason.
2. **Narrow the cause.** List the candidate causes, seeded by `how` over the affected subsystem and recent history (`git log`, blame). Rule them out with runtime evidence, each time taking the test that eliminates the most. When state is unclear, add logging and read it as the code runs. After two failed fixes that share an assumption, stop and apply Attack the Premise (`principles/evidence.md`).
3. **Plan the fix** at the root cause (Fix Root Causes). When the fix crosses a function boundary, run `architect` first. Delegate the fix with the evidence in the brief.
4. **Fix test-first** when a cheap test path exists: follow `tdd`. Otherwise use the reproduction.
5. **Verify on the same surface.** The original reproduction now passes. Unit tests show a branch's behaviour, not that the bug is gone.
6. **Order the commits** so the failing test or reproduction lands before the fix.
7. Run `opening-a-pr.md`.

**Reply:** what was broken, the root cause, the fix, and how you verified it, with the failing and then passing output quoted.
