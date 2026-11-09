# Opening a PR

The last step of every playbook that changes code. The project's rules on branches, commits, CI and merging win over this file.

1. **Work in a worktree or branch off main.** Each parallel writer gets its own.
2. **Clean the diff.** Run `simplify` before committing and `no-comments` before review. Run the project's linters and formatters.
3. **Commit in small, ordered commits.** Each one lands on its own and the sequence tells the story. The commit body says why, not what the subject already says.
4. **Run the project's merge gate** (CI) and read its result.
5. **Write the PR title and body** with `pr-description`, and every commit message with `technical-writing` (every layer except Diátaxis). Follow the project's title format and PR rules where it has them.
6. **Open it ready for review**, not as a draft, and post the URL to the user.

Prefer several narrow PRs to one large one. Stack a PR on another only when it builds on it.

A subagent that opens a PR returns the URL and its proof to the lead. The lead reviews it before telling the user it is ready.
