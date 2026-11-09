# Authoring or changing a skill

You own the skill's voice: every agent that reads it inherits it.

1. **Read the authoring rules:** the project's skill-writing guide if it has one, otherwise `writing-for-agents` when it is installed. Follow them.
2. **Write the change.** When in doubt, delete. Keep only text that changes a decision. Tell the agent what to do, and explain the reason only when the rule is confusing without it. Point at sources of truth (types, READMEs, config) instead of restating them (Encode Lessons in Structure). Hand off to other skills by name and path instead of restating them. When you keep meeting a workflow no skill captures, propose a new skill.
3. **Validate it:** the frontmatter has `name` and `description`, every referenced file exists, and every link to another skill resolves.
4. **Test it when it is structural:** run it once on a real task, or have a fresh subagent follow it, and check that it takes the path you intended. Skip this for purely stylistic edits.
5. Run `opening-a-pr.md`.

**Reply:** what the skill does, the key design decisions, and the validation notes.
