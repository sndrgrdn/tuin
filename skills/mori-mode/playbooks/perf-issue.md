# Perf issue

You own the measurement story. Tie every fix to a measurement; measuring beats reading source.

1. **Capture a baseline** on the real surface, with the project's verify method or profiler. Read `principles/evidence.md`, plus `principles/runtime.md` when the slow path touches storage, jobs or caching, and vet the baseline, and every later number, with Explain the Number.
2. **Ground the hypotheses** with `how` over the slow path. Claim a performance ceiling only after running it. Try the performance mantras in order, cheapest first, and stop when one meets the target:
   1. Don't do it. Stop work whose result nothing uses, rather than making it cheaper.
   2. Do it, but don't do it again.
   3. Do it less.
   4. Do it later.
   5. Do it when they're not looking.
   6. Do it concurrently.
   7. Do it cheaper.
3. **Plan the fix from the trace.** When it changes a boundary, run `architect` first. Delegate the implementation, review the diff, and capture a trace after the fix. Verify each attempt before trying the next (Sequence Work into Verifiable Units).
4. **Compare the artifacts,** with a script rather than by eye: load them into SQLite or diff them. "Inconclusive" or "measured on a different surface" is a failure to report, not a pass.
5. **Cite the measurement in the PR.**
6. Run `opening-a-pr.md`.

**Reply:** the baseline number, the number after the fix, the change, and the artifact path.
