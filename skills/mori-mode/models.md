# Model sheet

One line per role: the model and its starting effort. Pass both on each spawn, in the harness's own model id.

- **search**: Claude Haiku 5.5, medium. File search, log reading, summaries, explorers.
- **scoped**: Claude Sonnet 5.5, medium. Scoped edits, spec-driven work, repeated checks, verification runs, research threads.
- **judgment**: Claude Opus 5.5, high. Design, debugging with an unclear cause, cross-module changes, performance work, explainers, independent checks of a scoped build.
- **hardest**: Claude Fable 5.1, medium. Large refactors and migrations, and work that failed on the judgment line.
- **panel**: Claude Opus 5.5 high, Claude Fable 5.1 medium. Runners and adversaries that need different models.

Adjust effort per spawn, one step at a time on `low` < `medium` < `high` < `xhigh` < `max`:

- When a result falls short, first give the subagent a check it can run itself, then raise effort one step, then move to the next line down at its starting effort. Past `high`, take the next line instead of a higher effort.
- Lower effort one step for routine work in a role.
- When results are checkable, run fan-out work one step lower and rerun only the failures one step higher.
