# Investigation

You own the answer. Investigations are read-only: they produce a cited explanation or a recommendation, not a code change.

1. **Gather the evidence.** Run `mori-how` for how-it-works questions. For why questions, read the history (`git log`, blame, PRs, the project's decision records). Use subagents when the question is large. Cite each claim with a path and line, a command and its output, or a link you read.
2. **For a "should we do X or Y" question,** read `principles/evidence.md` and the principle group that matches the subject.
3. **Write the answer** in `mori-how`'s shape (Overview, Key Concepts, How It Works, Where Things Live, Gotchas), or for a decision, a recommendation with a tradeoffs table. Apply `mori-unslop`.
4. When the answer leads to a code change, stop and hand back to the user, naming the playbook that comes next.

**Reply:** the answer first, then the evidence. For "are we sure?", give your real judgement and push back when the premise is wrong.
