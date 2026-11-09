# Opening a PR

The last step of every playbook that changes code. The project's rules on branches, commits, CI and merging win over this file.

1. **Work in a worktree or branch off main.** Each parallel writer gets its own.
2. **Clean the diff.** Run `deslop` before committing and `no-comments` before review. Run the project's linters and formatters.
3. **Commit in small, ordered commits.** Each one lands on its own and the sequence tells the story. The commit body says why, not what the subject already says.
4. **Run the project's merge gate** (CI) and read its result.
5. **Write the PR** as a one-minute briefing for a reviewer who has the diff, in this order, dropping empty sections:
   - **Why:** the user's goal and the approach, in one to three sentences.
   - **What changed:** one to three bullets.
   - **Scope:** what it covers, and what it deliberately leaves out.
   - **Risk:** what it touches, and why that is safe or risky.
   - **Verification:** each real check you ran and its outcome. Attach screenshots or a recording for visible changes.
   Write it, and every commit message, with `technical-writing` (every layer except Diátaxis), then `unslop`. Follow the project's title format and writing rules.
6. **Open it ready for review**, not as a draft, and post the URL to the user.

Prefer several narrow PRs to one large one. Stack a PR on another only when it builds on it.

A subagent that opens a PR returns the URL and its proof to the lead. The lead reviews it before telling the user it is ready.
