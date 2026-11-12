# Model sheet

One line per role: the model and its starting effort. Pass both on each spawn, in the harness's own model id.

The lead runs on Claude Fable 5.2, medium; raise it to high when it misreads the user or skips a step. Switch the lead's model only at the start of a session or right after a compaction.

- **search**: Claude Haiku 5.5, medium. File search, log reading, summaries, explorers.
- **scoped**: Claude Sonnet 5.5, medium. Repeated checks, verification runs, research threads: work whose mistakes are cheap to spot. It writes no code.
- **build**: Claude Opus 5.5, medium. Every subagent that writes code.
- **judgment**: Claude Opus 5.5, high. Design, debugging with an unclear cause, cross-module changes, performance work, explainers, independent checks that need judgment. An independent check runs on a different model from the build: Fable 5.2, or Sonnet 5.5 when it only drives the app and collects evidence.
- **hardest**: Claude Fable 5.2, medium, then high. Large refactors and migrations, and work that failed on the judgment line.
- **panel**: Claude Opus 5.5 high, Claude Fable 5.2 medium. Runners and adversaries that need different models.

Adjust effort per spawn, one step at a time on `low` < `medium` < `high` < `xhigh` < `max`:

- When a result falls short, first give the subagent a check it can run itself, then raise effort one step, then move to the next line down at its starting effort. Past `high`, take the next line instead of a higher effort.
- Lower effort one step for routine work in a role.
- When results are checkable, run fan-out work one step lower and rerun only the failures one step higher.
