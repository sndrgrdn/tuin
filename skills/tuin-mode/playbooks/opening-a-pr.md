# Opening a PR

The last step of every playbook that changes code. The project's rules on branches, commits, CI and merging win over this file.

1. **Work in a worktree or branch off main.** Each parallel writer gets its own.
2. **Clean the diff.** Run `simplify` before committing; before review, the lead runs `no-comments`. Run the project's linters and formatters.
3. **Commit in small, ordered commits.** Each one lands on its own and the sequence tells the story. The commit body says why, not what the subject already says.
4. **Run the project's merge gate** (CI) and read its result.
5. **Write the PR title and body** with `pr-description`, and every commit message with `technical-writing` (every layer except Diátaxis). Follow the project's title format and PR rules where it has them.
6. **Open it ready for review**, not as a draft, and post the URL to the user.

Prefer several narrow PRs to one large one. Stack a PR on another only when it builds on it. A stacked PR's base is its parent's branch, and its branch is rebased onto the parent's exact tip. After the parent merges, retarget the child to main (`gh pr edit <pr> --base main`) and rebase it onto the merge result.

A subagent that opens a PR runs `simplify` itself, then returns the URL and its proof to the lead. The lead runs `no-comments` on its diff and reviews it before telling the user it is ready.
