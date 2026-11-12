# Investigation

You own the answer. Investigations are read-only: they produce a cited explanation or a recommendation, not a code change.

1. **Gather the evidence,** routed by where the answer lives:
   - the codebase: `how`;
   - the codebase's history (why is it like this?): `git log`, blame, PRs and the project's RFCs or other decision records;
   - one bounded outside question (docs, an API, a library's behaviour): `research`;
   - a broad question with several threads or conflicting evidence: `deep-research`. Cite each claim with a path and line, a command and its output, or a link you read.
2. **For a "should we do X or Y" question,** read `principles/evidence.md` and the principle file whose topic matches the subject.
3. **Write the answer** in `how`'s shape (Overview, Key Concepts, How It Works, Where Things Live, Gotchas), or for a decision, a recommendation with a tradeoffs table. For a "why" question, list the competing explanations and what stays unknown. Use `show-me` where a diagram explains faster than prose. Apply `unslop`.
4. When the answer leads to a code change, stop and hand back to the user, naming the playbook that comes next.

**Reply:** the answer first, then the evidence. For "are we sure?", give your real judgement and push back when the premise is wrong.
